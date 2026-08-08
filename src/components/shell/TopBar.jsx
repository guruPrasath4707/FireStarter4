import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Brand } from './Brand';
import { Button } from '../ui';
import { useGamification } from '../../features/gamification';
import { XPBar } from '../../features/gamification/components/XPBar';
import { StreakBadge } from '../../features/gamification/components/StreakBadge';

export function TopBar({ onOpenMobileNav, pageTitle, pageSubtitle }) {
  const { user, logout, profile } = useAuth();
  const { state: gState } = useGamification();
  const initial = (profile?.name || user?.displayName || user?.email || 'U').trim().charAt(0).toUpperCase();
  const displayName = profile?.name || user?.displayName || (user?.email?.split('@')[0] ?? 'User');

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div className="lg:hidden"><Brand compact /></div>
        <div className="hidden lg:block">
          {pageTitle ? (
            <div>
              <div className="text-base font-semibold text-slate-900">{pageTitle}</div>
              {pageSubtitle ? (
                <div className="text-xs text-slate-500">{pageSubtitle}</div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 h-10 w-72">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-400">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              placeholder="Search…"
              className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          {/* Gamification mini-display */}
          <div className="hidden md:flex items-center gap-2">
            <StreakBadge streakDays={gState?.streakDays ?? 0} />
            <XPBar xp={gState?.xp ?? 0} level={gState?.level ?? 0} compact />
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-slate-900">{displayName}</div>
              <div className="text-[11px] text-slate-500">{user?.email}</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-900 text-white grid place-items-center text-sm font-semibold">
              {initial}
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
