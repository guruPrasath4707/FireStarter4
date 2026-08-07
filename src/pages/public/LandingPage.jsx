import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  BookOpen,
  ClipboardCheck,
  Bot,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Quote,
  Star,
} from 'lucide-react';
import { Button } from '../../design-system/Button';
import { Card, CardBody } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Avatar } from '../../design-system/Avatar';
import { PublicLayout } from '../../layouts/PublicLayout';

const FEATURES = [
  {
    icon: Compass,
    title: 'Career Explorer',
    desc: 'Discover careers mapped to your strengths, interests, and goals.',
  },
  {
    icon: BookOpen,
    title: 'Learning Hub',
    desc: 'A structured library of resources tuned to your path.',
  },
  {
    icon: ClipboardCheck,
    title: 'Adaptive Assessments',
    desc: 'Smart tests that adjust to your level and reveal gaps.',
  },
  {
    icon: Bot,
    title: 'AI Mentor',
    desc: 'Talk through decisions, plans, and next steps, anytime.',
  },
  {
    icon: GraduationCap,
    title: 'Scholarships',
    desc: 'Curated, eligibility-aware scholarship discovery.',
  },
  {
    icon: Briefcase,
    title: 'Opportunities',
    desc: 'Internships, programs, and competitions matched to you.',
  },
];

const STEPS = [
  { n: '01', t: 'Create your account', d: 'Email and password — no credit card, no friction.' },
  { n: '02', t: 'Tell us your goals',  d: 'A short onboarding shapes your recommendations.' },
  { n: '03', t: 'Take your first test', d: 'An adaptive assessment reveals where to start.' },
  { n: '04', t: 'Follow your path',     d: 'Daily learning steps, kept short and useful.' },
];

const TESTIMONIALS = [
  {
    quote:
      'The adaptive assessment helped me see that I was stronger in logic than I assumed. My path updated the next day with better-fit modules.',
    name: 'Aanya R.',
    role: 'B.Sc. CS, 1st year',
    initial: 'A',
  },
  {
    quote:
      'I stopped guessing about scholarships. Pathlight showed me three I actually qualified for, with deadlines I didn’t miss.',
    name: 'Daniel K.',
    role: 'Class 12, Science',
    initial: 'D',
  },
  {
    quote:
      'The AI mentor feels like talking to a calm older sibling who actually knows the system. It never rushes me.',
    name: 'Mei L.',
    role: 'UG, Commerce',
    initial: 'M',
  },
];

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#eef2ff_0%,#fdf4ff_50%,#ffffff_100%)] -z-10" />
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <Badge tone="brand" className="mb-5">
                <Sparkles size={12} /> AI-Powered Personalized Paths
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
                Your personalized path to{' '}
                <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,#4f46e5,#7c3aed,#d946ef)]">
                  the right career
                </span>
                .
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-xl">
                Build adaptive learning paths, take intelligent assessments, and chat with an AI mentor —
                all designed around your goals.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button size="lg" variant="brand" rightIcon={ArrowRight}>
                    Get started free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">I already have an account</Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex -space-x-2">
                  {[0,1,2,3].map((i) => (
                    <Avatar key={i} name={`User ${i}`} size="sm" className="border-2 border-white" />
                  ))}
                </div>
                <span>Join thousands of learners shaping their future.</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-6 rounded-[32px] bg-[linear-gradient(135deg,#e0e7ff,#fdf4ff)] blur-2xl opacity-70 -z-10" />
              <Card className="relative">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-900">Your path preview</div>
                    <Badge tone="violet">Adaptive</Badge>
                  </div>
                  <div className="mt-5 space-y-3">
                    {[
                      { t: 'Foundations of Programming', m: '3 modules • ~6h', tone: 'success', label: 'In progress' },
                      { t: 'Problem Solving & Logic',    m: '4 modules • ~5h', tone: 'brand',   label: 'Up next' },
                      { t: 'Career Exploration: Tech',   m: 'Assessment ready', tone: 'default', label: 'Locked' },
                    ].map((n, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{n.t}</div>
                          <div className="text-xs text-slate-500">{n.m}</div>
                        </div>
                        <Badge tone={n.tone}>{n.label}</Badge>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <Badge tone="accent" className="mb-3">Features</Badge>
          <h2 className="text-3xl font-semibold tracking-tight">Everything you need to move forward</h2>
          <p className="mt-3 text-slate-600">
            A focused toolkit that adapts to where you are, not where someone else is.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-shadow">
              <CardBody className="p-6">
                <div className="h-10 w-10 rounded-xl bg-[linear-gradient(135deg,#eef2ff,#fdf4ff)] border border-slate-200 text-violet-700 grid place-items-center">
                  <Icon size={18} />
                </div>
                <div className="mt-4 text-base font-semibold text-slate-900">{title}</div>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] border-y border-slate-200/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <Badge tone="brand" className="mb-3">How it works</Badge>
            <h2 className="text-3xl font-semibold tracking-tight">A clear path from today to your goal</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <Card key={s.n}>
                <CardBody className="p-6">
                  <div className="text-xs font-mono text-slate-400">{s.n}</div>
                  <div className="mt-2 text-base font-semibold text-slate-900">{s.t}</div>
                  <p className="mt-1 text-sm text-slate-600">{s.d}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <Badge tone="violet" className="mb-3">Loved by learners</Badge>
          <h2 className="text-3xl font-semibold tracking-tight">Real outcomes from real students</h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardBody className="p-6">
                <Quote size={20} className="text-violet-400" />
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <Avatar name={t.name} size="md" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5 text-amber-500">
                    {[0,1,2,3,4].map((i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#0f172a_0%,#1e1b4b_55%,#4f46e5_100%)] text-white p-10 sm:p-14">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl" />
          <div className="relative grid lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Ready to discover a path built around you?
              </h3>
              <p className="mt-2 text-white/80 max-w-xl">
                Create your account, tell us where you want to be, and we’ll meet you there with a plan.
              </p>
            </div>
            <div className="lg:col-span-1 flex flex-wrap gap-3 lg:justify-end">
              <Link to="/register">
                <Button size="lg" variant="secondary" rightIcon={ArrowRight}>
                  Create free account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
