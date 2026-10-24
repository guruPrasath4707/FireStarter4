import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, ClipboardCheck, RotateCcw } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { Button } from '../../design-system/Button';
import { Badge } from '../../design-system/Badge';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '../../design-system/Card';
import { Progress } from '../../design-system/Progress';
import { PageHeader, Section, Stat } from '../../components/layout/PageHeader';
import { getLearningResourceById } from '../../features/learning/data/resources.js';
import {
  ASSESSMENT_QUESTIONS,
  createAssessmentRecord,
  normalizeAssessmentRecord,
  scoreAssessment,
} from '../../features/assessments/assessmentEngine.js';

export default function FoundationsQuiz() {
  const { profile, saveFoundationsAssessmentResult } = useProfile();
  const savedResult = normalizeAssessmentRecord(profile?.lastFoundationsAssessment);
  const [mode, setMode] = useState('auto');
  const [answers, setAnswers] = useState({});
  const [localResult, setLocalResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState('');

  const visibleResult = mode === 'quiz' ? null : (localResult || savedResult);
  const showQuiz = mode === 'quiz' || (mode === 'auto' && !visibleResult);
  const answeredCount = ASSESSMENT_QUESTIONS.filter((question) =>
    question.choices.some((choice) => choice.id === answers[question.id]),
  ).length;
  const remainingQuestions = ASSESSMENT_QUESTIONS.length - answeredCount;

  function beginCheckIn() {
    setAnswers({});
    setLocalResult(null);
    setSaveStatus('idle');
    setSaveError('');
    setMode('quiz');
  }

  async function persistResult(result) {
    if (!result || saving) return;
    setSaving(true);
    setSaveStatus('saving');
    setSaveError('');
    try {
      await saveFoundationsAssessmentResult(result);
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      setSaveError(
        error?.message ||
        'Your score was calculated, but the result could not be saved. Check your connection and retry.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function submitCheckIn(event) {
    event.preventDefault();
    const scored = scoreAssessment(answers);
    if (!scored.isComplete) return;

    const record = createAssessmentRecord(scored);
    setLocalResult(record);
    setMode('result');
    await persistResult(record);
  }

  function dateLabel(value) {
    const date = new Date(value);
    return Number.isFinite(date.getTime())
      ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      : 'Unknown date';
  }

  const recommendationRows = visibleResult
    ? visibleResult.recommendedResourceIds.map((resourceId) => {
        const resource = getLearningResourceById(resourceId);
        const domain = Object.values(visibleResult.categoryScores)
          .find((category) => category.resourceId === resourceId);
        return resource ? { resource, domain } : null;
      }).filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assessments"
        title="Foundations check-in"
        subtitle="Eight fixed multiple-choice questions on programming, web development, computing fundamentals, and developer workflow."
        actions={<Badge tone="default">8 questions · not adaptive</Badge>}
      />

      <Card>
        <CardBody className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 grid place-items-center">
              <ClipboardCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">How to use this check-in</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                This is a small practice check, not a validated test of intelligence, ability, or overall proficiency. Every learner receives the same eight questions. Your topic breakdown is a starting point for choosing what to review.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {showQuiz ? (
        <form onSubmit={submitCheckIn} className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Questions</CardTitle>
                  <CardDescription>Choose one answer for each question. There is no timer.</CardDescription>
                </div>
                <Badge tone={answeredCount === ASSESSMENT_QUESTIONS.length ? 'success' : 'default'}>
                  {answeredCount} / {ASSESSMENT_QUESTIONS.length} answered
                </Badge>
              </div>
              <div className="mt-4">
                <Progress
                  value={(answeredCount / ASSESSMENT_QUESTIONS.length) * 100}
                  label="Completion"
                />
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              {ASSESSMENT_QUESTIONS.map((question, index) => (
                <fieldset key={question.id} className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                  <legend className="text-sm font-semibold leading-relaxed text-slate-900">
                    <span className="mr-2 text-xs font-mono text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                    {question.prompt}
                  </legend>
                  <div className="mt-3 grid gap-2">
                    {question.choices.map((choice) => (
                      <label
                        key={choice.id}
                        className={
                          'flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm leading-relaxed transition-colors ' +
                          (answers[question.id] === choice.id
                            ? 'border-indigo-300 bg-indigo-50 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50')
                        }
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={choice.id}
                          checked={answers[question.id] === choice.id}
                          onChange={() => setAnswers((current) => ({ ...current, [question.id]: choice.id }))}
                          className="mt-0.5 h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <span>{choice.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </CardBody>
          </Card>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-slate-500" aria-live="polite">
              {remainingQuestions === 0
                ? 'All questions answered. You can calculate your result.'
                : 'Answer ' + remainingQuestions + ' more question' + (remainingQuestions === 1 ? '' : 's') + ' to submit.'}
            </p>
            <Button type="submit" variant="brand" disabled={answeredCount !== ASSESSMENT_QUESTIONS.length || saving} loading={saving}>
              Calculate result
            </Button>
          </div>
        </form>
      ) : null}

      {visibleResult ? (
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>Check-in result</CardTitle>
                  <CardDescription>
                    {localResult ? 'Completed' : 'Previously saved'} on {dateLabel(visibleResult.completedAt)}
                  </CardDescription>
                </div>
                <Badge tone={visibleResult.score === visibleResult.total ? 'success' : 'brand'}>
                  {visibleResult.score} / {visibleResult.total} correct
                </Badge>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3">
                <Stat label="Correct answers" value={visibleResult.score + '/' + visibleResult.total} hint="This attempt only" tone="brand" />
                <Stat label="Topics covered" value={Object.keys(visibleResult.categoryScores).length} hint="Two questions per topic" />
                <Stat label="Suggested resources" value={recommendationRows.length} hint="External resources to review" tone="success" />
              </div>
              <Progress
                value={(visibleResult.score / visibleResult.total) * 100}
                label="Correct responses on this check-in"
              />
              <p className="text-sm leading-relaxed text-slate-600">
                {visibleResult.score === visibleResult.total
                  ? 'All eight responses were correct on this attempt. The suggested resources are for reinforcement, not evidence of mastery.'
                  : 'You answered ' + visibleResult.score + ' of ' + visibleResult.total + ' questions correctly on this attempt. Review the topic breakdown and practise the suggested resources; this score is not a ranking or proficiency certification.'}
              </p>
            </CardBody>
          </Card>

          {localResult ? (
            <Section
              title="Answer review"
              subtitle="Review your selected answers with the answer key and a short explanation. The raw selections are not stored in your profile."
            >
              <div className="grid gap-3">
                {ASSESSMENT_QUESTIONS.map((question, index) => {
                  const selected = question.choices.find((choice) => choice.id === answers[question.id]);
                  const correct = question.choices.find((choice) => choice.id === question.correctChoiceId);
                  const wasCorrect = selected?.id === correct?.id;
                  return (
                    <Card key={question.id}>
                      <CardBody className="space-y-2">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {index + 1}. {question.prompt}
                          </h3>
                          <Badge tone={wasCorrect ? 'success' : 'warning'}>
                            {wasCorrect ? 'Correct' : 'Review'}
                          </Badge>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-600">
                          Your answer: {selected?.label || 'No valid answer selected'}
                        </p>
                        {!wasCorrect ? (
                          <p className="text-xs leading-relaxed text-slate-700">
                            Correct answer: <span className="font-semibold">{correct?.label}</span>
                          </p>
                        ) : null}
                        <p className="text-sm leading-relaxed text-slate-600">{question.explanation}</p>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </Section>
          ) : null}

          <Section title="Topic breakdown" subtitle="Each topic has two questions; a small sample can miss skills you do have.">
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(visibleResult.categoryScores).map(([id, category]) => (
                <Card key={id}>
                  <CardBody className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900">{category.label}</h3>
                      <span className="text-sm font-semibold tabular-nums text-slate-700">{category.score}/{category.total}</span>
                    </div>
                    <Progress value={(category.score / category.total) * 100} />
                    <p className="text-xs leading-relaxed text-slate-500">
                      {category.score === category.total
                        ? 'Both questions were correct. Use the suggested material if you want to reinforce this topic.'
                        : category.score === 0
                          ? 'Neither question was correct. Start with the resource below and revisit the relevant explanations.'
                          : 'One answer was correct. Review the relevant concepts before moving on.'}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Section>

          <Section
            title={visibleResult.recommendationMode === 'practice' ? 'Suggested practice' : 'Suggested reinforcement'}
            subtitle={visibleResult.recommendationMode === 'practice'
              ? 'Suggestions are selected from lower-scoring topics; ties follow a fixed order.'
              : 'Your score was full on this short check-in, so these are optional resources to deepen your understanding.'}
          >
            <div className="grid md:grid-cols-2 gap-3">
              {recommendationRows.map(({ resource, domain }) => (
                <Card key={resource.id}>
                  <CardBody className="space-y-2">
                    <Badge tone="default">{domain?.label || 'Learning resource'}</Badge>
                    <h3 className="text-sm font-semibold text-slate-900">{resource.title}</h3>
                    <p className="text-xs text-slate-500">{resource.provider}</p>
                    <p className="text-sm leading-relaxed text-slate-600">{resource.summary}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-indigo-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Open resource <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Section>

          {saveStatus === 'saved' ? (
            <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Result saved to your profile. Only the most recent check-in result is retained here.
            </div>
          ) : null}
          {saveStatus === 'error' ? (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 space-y-2">
              <p>{saveError}</p>
              <Button variant="outline" size="sm" onClick={() => persistResult(visibleResult)} disabled={saving}>
                Retry saving result
              </Button>
            </div>
          ) : null}
          {saveStatus === 'saving' ? (
            <p role="status" aria-live="polite" className="text-sm text-slate-500">Saving your result to your profile…</p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" leftIcon={RotateCcw} onClick={beginCheckIn}>
              Retake check-in
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
