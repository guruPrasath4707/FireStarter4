import React from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { GamificationSummary } from '../../features/gamification';

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Progress"
        title="Your achievements"
        subtitle="XP, badges, and streak — everything you've earned so far."
      />
      <GamificationSummary />
    </div>
  );
}
