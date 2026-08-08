import React from 'react';
import { useGamification } from '../hooks/useGamification';
import { XPBar } from '../components/XPBar';
import { StreakBadge } from '../components/StreakBadge';
import { BadgeGrid } from '../components/BadgeGrid';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../../design-system/Card';
import { Spinner } from '../../../design-system/Spinner';
import { Trophy } from 'lucide-react';

export function GamificationSummary() {
  const { state, loading, error } = useGamification();

  if (loading) {
    return (
      <Card>
        <CardBody className="p-6 flex items-center justify-center gap-3 text-slate-500 text-sm">
          <Spinner size="sm" />
          Loading your learning achievements…
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardBody className="p-4 text-xs text-amber-800">
          Progress tracking is operating in offline mode: {error}
        </CardBody>
      </Card>
    );
  }

  const xp = state?.xp ?? 0;
  const level = state?.level ?? 0;
  const streakDays = state?.streakDays ?? 0;
  const earnedBadges = state?.badges ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 grid place-items-center">
              <Trophy size={18} />
            </div>
            <div>
              <CardTitle>Your Progress & Badges</CardTitle>
              <CardDescription>
                Earn XP and unlock achievements as you explore career paths.
              </CardDescription>
            </div>
          </div>
          <StreakBadge streakDays={streakDays} />
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        <XPBar xp={xp} level={level} />

        <div>
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-3">
            Achievements ({earnedBadges.length} Unlocked)
          </div>
          <BadgeGrid earnedBadgeIds={earnedBadges} />
        </div>
      </CardBody>
    </Card>
  );
}

export default GamificationSummary;
