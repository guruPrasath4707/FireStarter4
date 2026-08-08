import React from 'react';
import {
  Rocket,
  Compass,
  Bookmark,
  Flame,
  Map,
  TrendingUp,
  Star,
  Lock,
  Award,
} from 'lucide-react';
import { Card, CardBody } from '../../../design-system/Card';
import { Badge as UIBadge } from '../../../design-system/Badge';
import { BADGES } from '../data/badges';

const ICON_MAP = {
  Rocket,
  Compass,
  Bookmark,
  Flame,
  Map,
  TrendingUp,
  Star,
};

export function BadgeGrid({ earnedBadgeIds = [] }) {
  const earnedSet = new Set(earnedBadgeIds || []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {BADGES.map((b) => {
        const isEarned = earnedSet.has(b.id);
        const IconComponent = ICON_MAP[b.icon] || Award;

        return (
          <Card
            key={b.id}
            className={
              'relative transition-all ' +
              (isEarned
                ? 'border-slate-300 bg-white hover:border-slate-400 hover:shadow-sm'
                : 'opacity-45 bg-slate-50 border-slate-200')
            }
          >
            <CardBody className="p-4 flex flex-col items-center text-center gap-2">
              <div
                className={
                  'h-10 w-10 rounded-xl grid place-items-center relative ' +
                  (isEarned
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'bg-slate-200 text-slate-400')
                }
              >
                <IconComponent size={20} />
                {!isEarned && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-slate-700 text-white grid place-items-center">
                    <Lock size={10} />
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-900 leading-tight">
                  {b.name}
                </div>
                <div className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {b.description}
                </div>
              </div>

              <div className="mt-auto pt-1">
                {isEarned ? (
                  <UIBadge tone="success" className="text-[10px]">
                    Unlocked
                  </UIBadge>
                ) : (
                  <UIBadge tone="default" className="text-[10px]">
                    Locked
                  </UIBadge>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

export default BadgeGrid;
