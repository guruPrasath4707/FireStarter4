import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASSESSMENT_DOMAINS,
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_VERSION,
  createAssessmentRecord,
  normalizeAssessmentRecord,
  scoreAssessment,
} from '../src/features/assessments/assessmentEngine.js';
import { LEARNING_RESOURCES } from '../src/features/learning/data/resources.js';

function answersForCorrectChoices() {
  return Object.fromEntries(ASSESSMENT_QUESTIONS.map((question) => [
    question.id,
    question.correctChoiceId,
  ]));
}

function answersForWrongChoices() {
  return Object.fromEntries(ASSESSMENT_QUESTIONS.map((question) => [
    question.id,
    question.choices.find((choice) => choice.id !== question.correctChoiceId).id,
  ]));
}

test('question set is fixed, complete, and has unique IDs with two questions per domain', () => {
  assert.equal(ASSESSMENT_QUESTIONS.length, 8);
  assert.equal(new Set(ASSESSMENT_QUESTIONS.map((question) => question.id)).size, 8);
  for (const domain of ASSESSMENT_DOMAINS) {
    assert.equal(ASSESSMENT_QUESTIONS.filter((question) => question.domain === domain.id).length, 2);
  }
});

test('all correct responses produce a full score and stable reinforcement recommendations', () => {
  const result = scoreAssessment(answersForCorrectChoices());
  assert.equal(result.isComplete, true);
  assert.equal(result.score, 8);
  assert.equal(result.total, 8);
  assert.deepEqual(result.recommendedResourceIds, ['python-official-tutorial', 'mdn-first-website']);
  assert.equal(result.recommendationMode, 'reinforcement');
});

test('all incorrect responses produce zero and deterministic practice recommendations', () => {
  const result = scoreAssessment(answersForWrongChoices());
  assert.equal(result.score, 0);
  assert.deepEqual(result.recommendedResourceIds, ['python-official-tutorial', 'mdn-first-website']);
  assert.equal(result.recommendationMode, 'practice');
});

test('topic scores add up to the overall score and cover all four domains', () => {
  const answers = answersForCorrectChoices();
  const question = ASSESSMENT_QUESTIONS.find((item) => item.domain === 'web-development');
  answers[question.id] = question.choices.find((choice) => choice.id !== question.correctChoiceId).id;
  const result = scoreAssessment(answers);
  assert.equal(Object.keys(result.categoryScores).length, 4);
  assert.equal(result.score, 7);
  assert.equal(
    Object.values(result.categoryScores).reduce((sum, category) => sum + category.score, 0),
    result.score,
  );
  assert.deepEqual(result.recommendedResourceIds, ['mdn-first-website']);
});

test('missing or invalid answers are not counted as completed questions', () => {
  const answers = answersForCorrectChoices();
  delete answers['python-text-type'];
  answers['html-link'] = 'not-a-choice';
  const result = scoreAssessment(answers);
  assert.equal(result.isComplete, false);
  assert.equal(result.answeredCount, 6);
  assert.deepEqual(result.unansweredIds, ['python-text-type', 'html-link']);
  assert.throws(() => createAssessmentRecord(result, '2026-10-25T00:00:00.000Z'), /Answer every question/);
});

test('assessment records retain the result but do not store raw answer selections', () => {
  const result = scoreAssessment(answersForCorrectChoices());
  const record = createAssessmentRecord(result, '2026-10-25T10:00:00.000Z');
  assert.equal(record.version, ASSESSMENT_VERSION);
  assert.equal(record.score, 8);
  assert.equal(record.completedAt, '2026-10-25T10:00:00.000Z');
  assert.equal('answers' in record, false);
  assert.equal(record.categoryScores.programming.total, 2);
});

test('persisted result validation rejects unknown versions, corrupt totals, and inconsistent category scores', () => {
  const record = createAssessmentRecord(scoreAssessment(answersForCorrectChoices()), '2026-10-25T10:00:00.000Z');
  assert.equal(normalizeAssessmentRecord({ ...record, version: 'old-version' }), null);
  assert.equal(normalizeAssessmentRecord({ ...record, total: 99 }), null);
  assert.equal(normalizeAssessmentRecord({
    ...record,
    categoryScores: {
      ...record.categoryScores,
      programming: { ...record.categoryScores.programming, score: 1 },
    },
  }), null);
  assert.equal(normalizeAssessmentRecord(null), null);
});

test('recommendation IDs exist in the curated Learning Hub catalogue', () => {
  const resourceIds = new Set(LEARNING_RESOURCES.map((resource) => resource.id));
  const result = scoreAssessment(answersForWrongChoices());
  assert.ok(result.recommendedResourceIds.every((id) => resourceIds.has(id)));
});

test('completion timestamps must be valid', () => {
  assert.throws(
    () => createAssessmentRecord(scoreAssessment(answersForCorrectChoices()), 'not-a-date'),
    /valid completion timestamp/,
  );
});
