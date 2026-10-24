import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Compass,
  ClipboardCheck,
  UserRound,
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { Button } from '../../design-system/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../design-system/Card';
import { Badge } from '../../design-system/Badge';
import { Progress } from '../../design-system/Progress';
import { PageHeader, Section, Stat } from '../../components/layout/PageHeader';
import { EmptyState } from '../../components/layout/EmptyState';
import { getProfileCompleteness } from '../../utils/profileCompleteness';

export default function Dashboard() {
  const { profile } = useProfile();
  const firstName = (profile?.name || '').trim().split(/\s+/)[0] || 'there';
  const goal = profile?.careerGoal?.trim() || '';
  const studyMinutes = Number(profile?.dailyStudyGoal) || 30;
  const interests = Array.isArray(profile?.interests) ? profile.interests : [];
  const savedCareerIds = Array.isArray(profile?.savedCareerIds) ? profile.savedCareerIds : [];
  const lastAssessment = profile?.lastAssessment || null;
  const completeness = getProfileCompleteness(profile);
  const hasSuggestedSteps = completeness.missingSteps.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back, ${firstName}.`}
        subtitle="A snapshot of the information you have saved so far."
        actions={
          <Button as={Link} to="/careers" variant="brand" leftIcon={Compass}>
            Explore careers
          </Button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Daily study goal" value={`${studyMinutes} min`} hint="Your selected target" tone="brand" />
        <Stat label="Selected interests" value={interests.length} hint="From your saved profile" tone="violet" />
        <Stat label="Saved careers" value={savedCareerIds.length} hint="Roles saved to your path" />
        <Stat
          label="Profile setup"
          value={`${completeness.completeFields}/${completeness.totalFields}`}
          hint={`${completeness.percentage}% of tracked profile fields`}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Your career goal</CardTitle>
              <Badge tone={goal ? 'success' : 'default'}>{goal ? 'Saved profile field' : 'Not set'}</Badge>
            </div>
            <CardDescription>This is the goal you wrote in your profile, not an automatically generated recommendation.</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              {goal || 'Add a career goal to record what you want to explore.'}
            </div>
            <div className="mt-5">
              <Progress
                value={completeness.percentage}
                label="Profile details completed"
              />
              <div className="mt-2 text-xs text-slate-500">
                {completeness.completeFields} of {completeness.totalFields} tracked fields have values.
              </div>
            </div>
            <div className="mt-5">
              <Button as={Link} to="/profile" variant="outline" leftIcon={UserRound}>
                Review profile
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Useful next steps</CardTitle>
            <CardDescription>Based on saved profile information, without invented streaks or activity.</CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            {hasSuggestedSteps ? (
              completeness.missingSteps.slice(0, 3).map((step) => (
                <Link
                  key={step.key}
                  to="/profile"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 grid place-items-center">
                    <UserRound size={16} />
                  </div>
                  <div className="flex-1 text-sm text-slate-700">{step.label}</div>
                  <ArrowRight size={16} className="text-slate-400" />
                </Link>
              ))
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Your tracked profile fields are complete. Continue exploring roles and saving the ones you want to research.
              </div>
            )}
            <Link
              to="/careers?saved=1"
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"
            >
              <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 grid place-items-center">
                <BookOpen size={16} />
              </div>
              <div className="flex-1 text-sm text-slate-700">Review saved careers</div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
            <Link
              to="/careers"
              className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors"
            >
              <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-700 grid place-items-center">
                <Compass size={16} />
              </div>
              <div className="flex-1 text-sm text-slate-700">Explore the career catalogue</div>
              <ArrowRight size={16} className="text-slate-400" />
            </Link>
          </CardBody>
        </Card>
      </div>

      <Section
        title="Foundations check-in"
        subtitle="A fixed practice quiz with an explainable topic breakdown, not an adaptive or validated proficiency test."
      >
        <Card>
          <CardBody className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 grid place-items-center">
                  <ClipboardCheck size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Programming, web and developer basics</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {lastAssessment
                      ? 'Latest saved score: ' + lastAssessment.score + ' / ' + lastAssessment.total
                      : 'No saved result yet. Complete the eight-question check-in to get a topic breakdown.'}
                  </p>
                  {lastAssessment ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Last completed {new Date(lastAssessment.completedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}. Suggestions are based on topic scores and link into the Learning Hub providers.
                    </p>
                  ) : null}
                </div>
              </div>
              <Button as={Link} to="/assessments" variant="outline">
                {lastAssessment ? 'Review or retake' : 'Start check-in'}
              </Button>
            </div>
          </CardBody>
        </Card>
      </Section>

      <Section title="Other tools in development" subtitle="These require server-side services or verified external listings before they can be represented as working features.">
        <Card>
          <CardBody>
            <EmptyState
              icon={BookOpen}
              title="More student tools are in development"
              description="AI Mentor, Scholarships, and Opportunities are not connected yet. No backend service is included in this repository."
            />
          </CardBody>
        </Card>
      </Section>
    </div>
  );
}
