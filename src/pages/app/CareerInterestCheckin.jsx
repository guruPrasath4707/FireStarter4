import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  RotateCcw,
  Save,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import {
  CAREER_INTEREST_ASSESSMENT_TITLE,
  CAREER_INTEREST_QUESTIONS,
  scoreCareerInterestCheckin,
} from '../../features/assessments';
import { Badge } from '../../design-system/Badge';
import { Button } from '../../design-system/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../design-system/Card';
import { Progress } from '../../design-system/Progress';
import { PageHeader } from '../../components/layout/PageHeader';

export default function CareerInterestCheckin() {
  const { profile, saveAssessmentResult } = useProfile();
  const savedResult = profile?.latestAssessmentResult || null;
  const [mode, setMode] = useState(savedResult ? 'result' : 'intro');
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [result, setResult] = useState(savedResult);
  const [resultSaved, setResultSaved] = useState(Boolean(savedResult));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const question = CAREER_INTEREST_QUESTIONS[questionIndex];
  const selectedChoice = answers[question?.id];

  function startCheckin() {
    setAnswers({});
    setQuestionIndex(0);
    setResult(null);
    setResultSaved(false);
    setError('');
    setMode('quiz');
  }

  function chooseAnswer(choiceId) {
    setAnswers((current) => ({ ...current, [question.id]: choiceId }));
    setError('');
  }

  async function persistResult(nextResult) {
    if (!nextResult || saving) return;
    setSaving(true);
    setError('');
    try {
      await saveAssessmentResult(nextResult);
      setResultSaved(true);
      setError('');
    } catch (saveError) {
      setResultSaved(false);
      setError(
        saveError?.message ||
        'Your result is ready, but it could not be saved. Check your connection and try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function finishCheckin() {
    let scored;
    try {
      scored = scoreCareerInterestCheckin(answers);
    } catch (scoreError) {
      setError(scoreError?.message || 'Answer all questions before viewing your result.');
      return;
    }
    setResult(scored);
    setResultSaved(false);
    setMode('result');
    await persistResult(scored);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assessments"
        title="Career interest check-in"
        subtitle="A short self-reflection tool that helps you notice the kinds of activities you currently enjoy."
        actions={<Badge tone="brand">8 questions</Badge>}
      />

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
        This is not a standardized aptitude test, psychological assessment, or prediction of career success. Results are simple counts of your selected activity preferences and can change over time.
      </div>

      {mode === 'intro' ? (
        <Card>
          <CardBody className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                <ClipboardCheck size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">A reflection, not a test of ability</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Choose the activity you would most like to try in each scenario. Every answer adds one point to a transparent interest tag. No answer is considered better than another.
                </p>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              <IntroStep number="01" title="8 prompts" text="Choose one option for each." />
              <IntroStep number="02" title="Clear scoring" text="One choice adds one tag point." />
              <IntroStep number="03" title="Save result" text="Your latest check-in is stored on your profile." />
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="brand" onClick={startCheckin} rightIcon={ArrowRight}>
                Start check-in
              </Button>
              <Button as={Link} to="/careers" variant="outline" leftIcon={Compass}>
                Explore careers instead
              </Button>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Your result is saved only to your own profile. It does not automatically change the interests you selected during onboarding.
            </p>
          </CardBody>
        </Card>
      ) : null}

      {mode === 'quiz' && question ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Question {questionIndex + 1} of {CAREER_INTEREST_QUESTIONS.length}
                </div>
                <CardTitle className="mt-2">{question.prompt}</CardTitle>
                <CardDescription>{question.context}</CardDescription>
              </div>
              <Badge tone="default">{Math.round(((questionIndex + 1) / CAREER_INTEREST_QUESTIONS.length) * 100)}%</Badge>
            </div>
            <div className="mt-4">
              <Progress value={((questionIndex + 1) / CAREER_INTEREST_QUESTIONS.length) * 100} />
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            <div role="radiogroup" aria-label={question.prompt} className="grid gap-3">
              {question.choices.map((choice) => {
                const selected = selectedChoice === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => chooseAnswer(choice.id)}
                    className={[
                      'w-full rounded-xl border p-4 text-left transition-colors',
                      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                      selected
                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-300'
                        : 'border-slate-200 bg-white hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <span className="flex items-start gap-3">
                      <span className={[
                        'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border',
                        selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-white',
                      ].join(' ')}>
                        {selected ? <CheckCircle2 size={13} /> : null}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-slate-900">{choice.label}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-slate-600">{choice.detail}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {error ? (
              <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <Button
                variant="outline"
                leftIcon={ArrowLeft}
                onClick={() => {
                  setError('');
                  if (questionIndex > 0) setQuestionIndex((index) => index - 1);
                  else setMode('intro');
                }}
              >
                {questionIndex > 0 ? 'Previous' : 'Exit check-in'}
              </Button>
              {questionIndex < CAREER_INTEREST_QUESTIONS.length - 1 ? (
                <Button
                  variant="brand"
                  rightIcon={ArrowRight}
                  disabled={!selectedChoice}
                  onClick={() => {
                    setError('');
                    setQuestionIndex((index) => index + 1);
                  }}
                >
                  Next question
                </Button>
              ) : (
                <Button variant="brand" rightIcon={CheckCircle2} disabled={!selectedChoice || saving} onClick={finishCheckin} loading={saving}>
                  {saving ? 'Saving result…' : 'Finish and save result'}
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      ) : null}

      {mode === 'result' && result ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>Your strongest themes in this check-in</CardTitle>
                <CardDescription>
                  {CAREER_INTEREST_ASSESSMENT_TITLE}: {result.answerCount} choices counted, one point per answer.
                </CardDescription>
              </div>
              <Badge tone={resultSaved ? 'success' : 'warning'}>
                {resultSaved ? 'Saved to profile' : 'Not saved yet'}
              </Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-6">
            {result.topInterests?.length ? (
              <div className="grid sm:grid-cols-3 gap-3">
                {result.topInterests.map((tag, index) => (
                  <div key={tag.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Theme {index + 1}</div>
                    <div className="mt-2 text-base font-semibold text-slate-900">{tag.label}</div>
                    <div className="mt-1 text-sm text-slate-600">{tag.score} of {result.answerCount} choices</div>
                  </div>
                ))}
              </div>
            ) : null}

            <section aria-labelledby="assessment-score-breakdown">
              <h3 id="assessment-score-breakdown" className="text-sm font-semibold text-slate-900">Full score breakdown</h3>
              <p className="mt-1 text-xs text-slate-500">Equal scores are ordered by a fixed tag order; the ordering is not a judgement of importance.</p>
              <div className="mt-4 space-y-3">
                {(result.scores || []).map((tag) => (
                  <div key={tag.id}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-700">{tag.label}</span>
                      <span className="tabular-nums font-medium text-slate-900">{tag.score}/{result.answerCount}</span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`${tag.label} choices`}
                      aria-valuemin={0}
                      aria-valuemax={result.answerCount}
                      aria-valuenow={tag.score}
                    >
                      <div
                        className="h-full rounded-full bg-indigo-600"
                        style={{ width: `${(tag.score / result.answerCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {error ? (
              <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
            ) : null}
            {resultSaved ? (
              <p role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle2 size={16} /> Your latest result is saved on your profile.
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="brand" onClick={() => persistResult(result)} disabled={saving} loading={saving} leftIcon={Save}>
                  {saving ? 'Saving…' : 'Retry saving result'}
                </Button>
                <span className="text-xs text-slate-500">The result is visible in this session but has not been confirmed as saved.</span>
              </div>
            )}

            <p className="text-xs leading-relaxed text-slate-500">
              Completed: {formatDate(result.completedAt)}. These scores count your choices only. They are not validated psychometric scores, aptitude measurements, academic grades, or career recommendations.
            </p>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
              <Button variant="brand" as={Link} to="/careers" rightIcon={ArrowRight}>Explore career catalogue</Button>
              <Button variant="outline" onClick={startCheckin} leftIcon={RotateCcw}>Retake check-in</Button>
            </div>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}

function IntroStep({ number, title, text }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="text-xs font-mono text-slate-400">{number}</div>
      <div className="mt-2 text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'date unavailable'
    : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}
