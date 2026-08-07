import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardBody, CardHeader, CardTitle, CardDescription, Badge, Progress, Button } from '../../components/ui';
import { Compass, BookOpen, ClipboardCheck, Bot, ArrowRight, Sparkles, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { profile, onboarding } = useAuth();
  const firstName = (profile?.name || '').split(' ')[0] || 'there';

  const goal = onboarding?.careerGoal || 'Define your career goal to unlock personalized paths.';
  const studyMinutes = Number(onboarding?.dailyStudyGoal) || 30;
  const interests = onboarding?.interests || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Welcome back, {firstName}.</h1>
          <p className="mt-1 text-slate-500">Here's a snapshot of your path today.</p>
        </div>
        <Link to="/assessments">
          <Button variant="gradient">
            <Sparkles size={16} /> Start an assessment
          </Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Daily goal" value={`${studyMinutes} min`} hint="Stay consistent" />
        <Stat label="Interests" value={interests.length} hint="Curated for you" />
        <Stat label="Streak" value="0 days" hint="Build the habit" />
        <Stat label="Progress" value="0%" hint="Across your path" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your career goal</CardTitle>
              <Badge tone="brand">Personalized</Badge>
            </div>
            <CardDescription>Update this anytime to reshape recommendations.</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              {goal}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Profile completeness</span>
                <span className="font-medium text-slate-900">{interests.length ? 72 : 28}%</span>
              </div>
              <div className="mt-2"><Progress value={interests.length ? 72 : 28} /></div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today</CardTitle>
            <CardDescription>A short list to keep momentum.</CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            {[
              { icon: ClipboardCheck, t: 'Take a 10-min baseline assessment', to: '/assessments' },
              { icon: Compass,        t: 'Explore 3 career paths',          to: '/careers' },
              { icon: BookOpen,       t: 'Read one recommended module',     to: '/learning' },
              { icon: Bot,            t: 'Ask the AI mentor a question',    to: '/mentor' },
            ].map(({ icon: Icon, t, to }, i) => (
              <Link key={i} to={to} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50">
                <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 grid place-items-center">
                  <Icon size={16} />
                </div>
                <div className="flex-1 text-sm text-slate-700">{t}</div>
                <ArrowRight size={16} className="text-slate-400" />
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={18} className="text-slate-500" /> Upcoming
              </span>
            </CardTitle>
            <Badge>Phase 1</Badge>
          </div>
          <CardDescription>No live events yet — these populate as you go.</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            Your timeline will appear here once you start activities.
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Stat({ label, value, hint }) {
  return (
    <Card>
      <CardBody className="p-5">
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
        {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
      </CardBody>
    </Card>
  );
}
