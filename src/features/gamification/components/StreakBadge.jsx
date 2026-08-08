import React from 'react';
import { Flame } from 'lucide-react';
import { Badge } from '../../../design-system/Badge';

export function StreakBadge({ streakDays = 0 }) {
  if (!streakDays || streakDays <= 0) return null;

  return (
    <Badge tone="warning" className="animate-pulse">
      <Flame size={12} className="text-amber-500 fill-amber-500" />
      <span>{streakDays}d streak</span>
    </Badge>
  );
}

export default StreakBadge;
