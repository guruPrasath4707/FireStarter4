import React from 'react';
import { Progress } from '../../../design-system/Progress';
import { Sparkles } from 'lucide-react';

export function XPBar({ xp = 0, level = 0, compact = false }) {
  const currentLvlXP = level * level * 50;
  const nextLvlXP = (level + 1) * (level + 1) * 50;
  const range = Math.max(1, nextLvlXP - currentLvlXP);
  const currentProgressXP = Math.max(0, xp - currentLvlXP);
  const progressPercent = Math.min(100, Math.max(0, (currentProgressXP / range) * 100));

  if (compact) {
    return (
      <div className="w-24 sm:w-28 shrink-0" title={`Level ${level} (${xp} XP)`}>
        <Progress value={progressPercent} size="sm" />
      </div>
    );
  }

  if (level === 0 && xp === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-700">
          <Sparkles size={16} className="text-amber-500" />
          Start earning XP to level up!
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Explore careers, save paths, and complete onboarding to unlock badges.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
        <span className="text-slate-900 font-semibold flex items-center gap-1.5">
          <Sparkles size={14} className="text-violet-600" />
          Level {level}
        </span>
        <span className="text-slate-500">
          {xp} / {nextLvlXP} XP
        </span>
      </div>
      <Progress value={progressPercent} label={`Level ${level} progress`} />
    </div>
  );
}

export default XPBar;
