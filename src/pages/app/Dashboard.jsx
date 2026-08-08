import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CalendarDays,
  Compass,
  BookOpen,
  ClipboardCheck,
  Bot,
  Trophy,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useGamification } from '../../features/gamification';
import { Button } from '../../design-system/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Progress } from '../../design-system/Progress';
import { PageHeader, Section, Stat } from '../../components/layout/PageHeader';
import { EmptyState } from '../../components/layout/EmptyState';
import { GamificationSummary } from '../../features/gamification';

export default function Dashboard() {
  const { profile } = useProfile();
  const { state: gState } = useGamification();
  const firstName = (profile?.name || '').split(' ')[0] || 'there';

  const goal = profile?.careerGoal || 'Define your career goal to unlock personalized paths.';
  const studyMinutes = Number(profile?.dailyStudyGoal) || 30;
  const interests = profile?.interests || [];

  const streakDays = gState?.streakDays ?? 0;
  const xp = gState?.xp ?? 0;
  const level = gState?.level ?? 0;

  // Rough profile completeness: interests + goal + name each add weight
  const completeness = Math.min(
    100,
    (interests.length > 0 ? 40 : 0) +
      (profile?.careerGoal ? 35 : 0) +
      (profile?.name ? 25 : 0),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Today"
        title={`Welcome back, ${firstName}.`}
        subtitle="Here's a snapshot of your path."
        actions={
          <Link to="/assessments">
            <Button variant="brand" leftIcon={Sparkles}>
              Start an assessment
            </Button>
          </Link>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Daily goal" value={`${studyMinutes} min`} hint="Stay consistent" tone="brand" />
        <Stat label="Interests" value={interests.length} hint="Curated for you" tone="violet" />
        <Stat label="Streak" value={`${streakDays} day${streakDays === 1 ? '' : 's'}`} hint="Build the habit" tone="success" />
        <Stat label="Level" value={`Lvl ${level}`} hint={`${xp} XP total`} />
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
            <div className="mt-5">
              <Progress
                value={completeness}
                label="Profile completeness"
              />
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
              <Link
                key={i}
                to={to}
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"
              >
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

      {/* Live gamification section */}
      <Section
        title="Your progress"
        subtitle="XP, level, streak, and achievement badges — earned by using FireStarter."
        action={
          <Link to="/progress">
            <Button variant="ghost" size="sm" rightIcon={Trophy}>
              View all
            </Button>
          </Link>
        }
      >
        <GamificationSummary />
      </Section>

      <Section
        title="Upcoming"
        subtitle="No live events yet — these populate as you go."
        action={<Badge>Phase 1</Badge>}
      >
        <Card>
          <CardBody>
            <EmptyState
              icon={CalendarDays}
              title="Your timeline will appear here"
              description="Deadlines, mentor nudges, and assessment reminders will live in this space."
            />
          </CardBody>
        </Card>
      </Section>
    </div>
  );
}
