import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  BookOpen,
  Bot,
  ClipboardCheck,
  GraduationCap,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { Brand } from '../../components/shell/Brand';
import { Button, Card, CardBody, Badge } from '../../components/ui';

const FEATURES = [
  { icon: Compass,        title: 'Career Explorer',     desc: 'Discover careers mapped to your strengths, interests, and goals.' },
  { icon: BookOpen,       title: 'Learning Hub',        desc: 'A structured library of resources tuned to your path.' },
  { icon: ClipboardCheck, title: 'Adaptive Assessments',desc: 'Smart tests that adjust to your level and reveal gaps.' },
  { icon: Bot,            title: 'AI Mentor',           desc: 'Talk through decisions, plans, and next steps, 24/7.' },
  { icon: GraduationCap,  title: 'Scholarships',        desc: 'Curated, eligibility-aware scholarship discovery.' },
  { icon: Briefcase,      title: 'Opportunities',       desc: 'Internships, programs, and competitions matched to you.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Brand />
          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge tone="brand" className="mb-5">
              <Sparkles size={12} /> New • AI-Powered Personalized Paths
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
              Your personalized path to <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,#1e3a8a,#3b82f6)]">the right career</span>.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Build adaptive learning paths, take intelligent assessments, and chat with an AI mentor — all designed around your goals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" variant="gradient">
                  Get started free <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">I already have an account</Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-slate-500">
              <div className="flex -space-x-2">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <span>Join thousands of learners shaping their future.</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-[linear-gradient(135deg,#dbeafe,#e0f2fe)] blur-2xl opacity-70" />
            <Card className="relative">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-slate-900">Your path preview</div>
                  <Badge tone="violet">Adaptive</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { t: 'Foundations of Programming', m: '3 modules • ~6h', tone: 'success' },
                    { t: 'Problem Solving & Logic',    m: '4 modules • ~5h', tone: 'brand' },
                    { t: 'Career Exploration: Tech',   m: 'Assessment ready', tone: 'default' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{n.t}</div>
                        <div className="text-xs text-slate-500">{n.m}</div>
                      </div>
                      <Badge tone={n.tone}>{i === 0 ? 'In progress' : i === 1 ? 'Up next' : 'Locked'}</Badge>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold tracking-tight">Everything you need to move forward</h2>
          <p className="mt-3 text-slate-600">A focused toolkit that adapts to where you are, not where someone else is.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardBody className="p-6">
                <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-items-center">
                  <Icon size={18} />
                </div>
                <div className="mt-4 text-base font-semibold text-slate-900">{title}</div>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid lg:grid-cols-4 gap-4">
          {[
            { n: '01', t: 'Create your account', d: 'Email and password — no credit card, no friction.' },
            { n: '02', t: 'Tell us your goals',  d: 'A short onboarding shapes your recommendations.' },
            { n: '03', t: 'Take your first test', d: 'An adaptive assessment reveals where to start.' },
            { n: '04', t: 'Follow your path',     d: 'Daily learning steps, kept short and useful.' },
          ].map((s) => (
            <Card key={s.n}>
              <CardBody className="p-6">
                <div className="text-xs font-mono text-slate-400">{s.n}</div>
                <div className="mt-2 text-base font-semibold text-slate-900">{s.t}</div>
                <p className="mt-1 text-sm text-slate-600">{s.d}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <Brand />
          <div>© {new Date().getFullYear()} Pathlight.</div>
        </div>
      </footer>
    </div>
  );
}
