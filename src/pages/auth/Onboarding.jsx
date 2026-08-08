import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  FlaskConical,
  Calculator,
  Palette,
  Briefcase,
  HeartPulse,
  Languages,
  Wrench,
  Check,
} from 'lucide-react';
import { Brand } from '../../components/layout/Brand';
import { Button } from '../../design-system/Button';
import { Card, CardBody } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Field, Input, Textarea } from '../../design-system/Input';
import { Select } from '../../design-system/Select';
import { Progress } from '../../design-system/Progress';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { useGamification } from '../../features/gamification';

const STEPS = ['Basics', 'Interests', 'Goals', 'Preferences'];

const ACADEMIC_LEVELS = [
  { value: 'class-9',   label: 'Class 9' },
  { value: 'class-10',  label: 'Class 10' },
  { value: 'class-11',  label: 'Class 11' },
  { value: 'class-12',  label: 'Class 12' },
  { value: 'ug',        label: 'Undergraduate' },
  { value: 'pg',        label: 'Postgraduate' },
  { value: 'working',   label: 'Working professional' },
];

const INTERESTS = [
  { id: 'tech',       label: 'Technology',     icon: Code2 },
  { id: 'science',    label: 'Science',        icon: FlaskConical },
  { id: 'math',       label: 'Math & Logic',   icon: Calculator },
  { id: 'arts',       label: 'Arts & Design',  icon: Palette },
  { id: 'business',   label: 'Business',       icon: Briefcase },
  { id: 'health',     label: 'Health & Med',   icon: HeartPulse },
  { id: 'languages',  label: 'Languages',      icon: Languages },
  { id: 'making',     label: 'Building / DIY', icon: Wrench },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
];

const STUDY_GOALS = [
  { value: '15', label: '15 min / day — light' },
  { value: '30', label: '30 min / day — steady' },
  { value: '60', label: '1 hr / day — serious' },
  { value: '90', label: '1.5 hr / day — intensive' },
];

export default function Onboarding() {
  const { syncDisplayName } = useAuth();
  const { completeOnboarding } = useProfile();
  const { awardXP } = useGamification();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [data, setData] = useState({
    name: '',
    academicLevel: 'class-12',
    interests: [],
    careerGoal: '',
    preferredLanguage: 'en',
    dailyStudyGoal: '30',
  });

  function update(k, v) {
    setData((p) => ({ ...p, [k]: v }));
  }
  function toggleInterest(id) {
    setData((p) => {
      const has = p.interests.includes(id);
      return {
        ...p,
        interests: has ? p.interests.filter((x) => x !== id) : [...p.interests, id],
      };
    });
  }

  const stepValid = (() => {
    if (step === 0) return data.name.trim().length > 0 && !!data.academicLevel;
    if (step === 1) return data.interests.length > 0;
    if (step === 2) return data.careerGoal.trim().length >= 2;
    return true;
  })();

  async function finish() {
    setError('');
    setSubmitting(true);
    try {
      await syncDisplayName(data.name);
      await completeOnboarding(data);
      // Award XP for completing onboarding — triggers 'First Steps' badge
      awardXP('ONBOARDING_COMPLETE');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err?.message || 'Unable to save your preferences.');
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (!stepValid) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish();
  }
  function prev() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)]">
      <header className="border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 h-16 flex items-center justify-between">
          <Brand />
          <Badge tone="brand">Step {step + 1} of {STEPS.length}</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6">
          <Progress value={((step + 1) / STEPS.length) * 100} />
          <div className="mt-3 flex flex-wrap gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={
                  'text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ' +
                  (i === step
                    ? 'bg-slate-900 text-white border-slate-900'
                    : i < step
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-500 border-slate-200')
                }
              >
                {i < step ? <Check size={10} /> : null}
                {s}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardBody className="p-6 sm:p-8">
            {step === 0 ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Let’s start with the basics</h2>
                  <p className="mt-1 text-sm text-slate-500">We use this to personalize your experience.</p>
                </div>
                <Field label="Your name" htmlFor="ob-name" required>
                  <Input
                    id="ob-name"
                    placeholder="Jane Doe"
                    value={data.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </Field>
                <Field label="Academic level" htmlFor="ob-level" required>
                  <Select
                    id="ob-level"
                    options={ACADEMIC_LEVELS}
                    value={data.academicLevel}
                    onChange={(v) => update('academicLevel', v)}
                  />
                </Field>
              </div>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">What sparks your curiosity?</h2>
                  <p className="mt-1 text-sm text-slate-500">Pick a few. We’ll use them to shape your path.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {INTERESTS.map(({ id, label, icon: Icon }) => {
                    const selected = data.interests.includes(id);
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => toggleInterest(id)}
                        className={
                          'group rounded-xl border px-3 py-4 text-left transition-all ' +
                          (selected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50')
                        }
                      >
                        <Icon size={20} className={selected ? 'text-white' : 'text-slate-500'} />
                        <div className="mt-2 text-sm font-medium">{label}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500">
                  {data.interests.length} selected · minimum 1
                </p>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Where do you want to be?</h2>
                  <p className="mt-1 text-sm text-slate-500">Describe your career goal in your own words.</p>
                </div>
                <Field
                  label="Career goal"
                  htmlFor="ob-goal"
                  hint='e.g., "Become a software developer working on AI products"'
                  required
                >
                  <Textarea
                    id="ob-goal"
                    placeholder="Become a software developer working on AI products"
                    value={data.careerGoal}
                    onChange={(e) => update('careerGoal', e.target.value)}
                  />
                </Field>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">A few last preferences</h2>
                  <p className="mt-1 text-sm text-slate-500">We can change these later.</p>
                </div>
                <Field label="Preferred language" htmlFor="ob-lang">
                  <Select
                    id="ob-lang"
                    options={LANGUAGES}
                    value={data.preferredLanguage}
                    onChange={(v) => update('preferredLanguage', v)}
                  />
                </Field>
                <Field label="Daily study goal" htmlFor="ob-study">
                  <Select
                    id="ob-study"
                    options={STUDY_GOALS}
                    value={data.dailyStudyGoal}
                    onChange={(v) => update('dailyStudyGoal', v)}
                  />
                </Field>
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between">
              <Button variant="ghost" onClick={prev} disabled={step === 0}>
                Back
              </Button>
              <div className="flex items-center gap-3">
                {!stepValid ? (
                  <span className="text-xs text-slate-500 hidden sm:block">
                    Answer the highlighted fields to continue.
                  </span>
                ) : null}
                <Button
                  variant="brand"
                  onClick={next}
                  disabled={!stepValid || submitting}
                  loading={submitting && step === STEPS.length - 1}
                >
                  {step === STEPS.length - 1
                    ? (submitting ? 'Saving…' : 'Finish setup')
                    : 'Continue'}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
