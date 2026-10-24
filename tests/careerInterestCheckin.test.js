import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAREER_INTEREST_ASSESSMENT_ID,
  CAREER_INTEREST_QUESTIONS,
  INTEREST_TAGS,
  scoreCareerInterestCheckin,
} from '../src/features/assessments/careerInterestCheckin.js';

function answersForTags(tags) {
  return Object.fromEntries(
    CAREER_INTEREST_QUESTIONS.map((question, index) => {
      const target = tags[index];
      const choice = question.choices.find((item) => item.tag === target) || question.choices[0];
      return [question.id, choice.id];
    }),
  );
}

test('check-in has eight uniquely identified questions with valid choices', () => {
  assert.equal(CAREER_INTEREST_QUESTIONS.length, 8);
  assert.equal(new Set(CAREER_INTEREST_QUESTIONS.map((question) => question.id)).size, 8);
  for (const question of CAREER_INTEREST_QUESTIONS) {
    assert.ok(question.prompt.trim());
    assert.ok(question.choices.length >= 3);
    assert.equal(new Set(question.choices.map((choice) => choice.id)).size, question.choices.length);
    assert.ok(question.choices.every((choice) => INTEREST_TAGS.some((tag) => tag.id === choice.tag)));
  }
});

test('scoring is deterministic, transparent, and preserves the submitted answers', () => {
  const answers = {
    project: 'build-tool',
    'team-role': 'prototype',
    puzzle: 'debug',
    'free-time': 'create-art',
    impact: 'useful-software',
    challenge: 'trends',
    practice: 'coding',
    'next-step': 'build-device',
  };
  const result = scoreCareerInterestCheckin(answers, '2026-10-25T00:00:00.000Z');

  assert.equal(result.assessmentId, CAREER_INTEREST_ASSESSMENT_ID);
  assert.equal(result.answerCount, 8);
  assert.equal(result.completedAt, '2026-10-25T00:00:00.000Z');
  assert.deepEqual(result.answers, answers);
  assert.equal(result.scores.reduce((sum, tag) => sum + tag.score, 0), 8);
  assert.equal(result.topInterests[0].id, 'tech');
  assert.equal(result.topInterests[0].score, 4);
});

test('ties use a stable, documented tag order rather than random ranking', () => {
  const answers = answersForTags(['tech', 'making', 'science', 'arts', 'business', 'math', 'languages', 'health']);
  const result = scoreCareerInterestCheckin(answers, '2026-10-25T00:00:00.000Z');

  assert.ok(result.scores.every((tag) => tag.score === 1));
  assert.deepEqual(result.topInterests.map((tag) => tag.id), ['tech', 'math', 'science']);
});

test('rejects missing or invalid answer IDs instead of silently scoring a partial quiz', () => {
  assert.throws(() => scoreCareerInterestCheckin({}), /Answer all 8 questions/);
  assert.throws(
    () => scoreCareerInterestCheckin({ ...answersForTags(Array(8).fill('tech')), project: 'not-an-option' }),
    /Answer all 8 questions/,
  );
});

test('scores contain only defined interests and never claim predictive validity', () => {
  const result = scoreCareerInterestCheckin(answersForTags(Array(8).fill('health')));
  assert.deepEqual(result.topInterests.map((tag) => tag.id), ['health']);
  assert.ok(result.scores.every((tag) => Number.isInteger(tag.score) && tag.score >= 0));
  assert.equal(result.title, 'Career interest check-in');
});
