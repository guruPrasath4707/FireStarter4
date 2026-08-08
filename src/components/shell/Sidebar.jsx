import React from 'react';
import { Link } from 'react-router-dom';
import { Brand } from './Brand';
import { NavItem } from './NavItem';
import { PRIMARY_NAV } from '../../routes/nav';
import { useGamification } from '../../features/gamification';
import { XPBar } from '../../features/gamification/components/XPBar';
import { StreakBadge } from '../../features/gamification/components/StreakBadge';

export function Sidebar({ onNavigate }) {
  const { state } = useGamification();
  const xp = state?.xp ?? 0;
  const level = state?.level ?? 0;
  const streakDays = state?.streakDays ?? 0;

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white">
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <Brand />
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          {PRIMARY_NAV.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              end={item.end}
              onClick={onNavigate}
            />
          ))}
        </div>
      </nav>
      <div className="border-t border-slate-200 p-4">
        <Link to="/progress" className="block rounded-xl bg-[linear-gradient(135deg,#eef2ff_0%,#f0f9ff_100%)] p-4 hover:opacity-90 transition-opacity">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-slate-900">Your Progress</div>
            <StreakBadge streakDays={streakDays} />
          </div>
          <XPBar xp={xp} level={level} compact={false} />
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;

