import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { BADGES } from '../data/badges';
import type { GamificationState } from '../types';

export const DEFAULT_GAMIFICATION_STATE: GamificationState = {
  xp: 0,
  level: 0,
  streakDays: 0,
  lastActiveDate: '',
  badges: [],
  totalCareersViewed: 0,
  totalCareersSaved: 0,
  onboardingCompletedBonus: false,
};

export function calculateLevel(xp: number): number {
  if (xp <= 0) return 0;
  return Math.floor(Math.sqrt(xp / 50));
}

export function calculateStreak(
  lastActiveDate: string,
  currentStreakDays: number,
): { streakDays: number; lastActiveDate: string } {
  const today = new Date().toISOString().split('T')[0];

  if (!lastActiveDate) {
    return { streakDays: 1, lastActiveDate: today };
  }

  if (lastActiveDate === today) {
    return { streakDays: Math.max(1, currentStreakDays), lastActiveDate: today };
  }

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  if (lastActiveDate === yesterday) {
    return { streakDays: (currentStreakDays || 0) + 1, lastActiveDate: today };
  }

  // Gap > 1 day -> reset streak to 1
  return { streakDays: 1, lastActiveDate: today };
}

export function evaluateBadges(state: GamificationState): string[] {
  const existingSet = new Set(state.badges || []);
  for (const badge of BADGES) {
    if (!existingSet.has(badge.id)) {
      if (badge.condition(state)) {
        existingSet.add(badge.id);
      }
    }
  }
  return Array.from(existingSet);
}

export async function fetchGamificationState(uid: string): Promise<GamificationState> {
  if (!uid) return DEFAULT_GAMIFICATION_STATE;
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'gamification', 'state'));
    if (snap.exists()) {
      const data = snap.data();
      return {
        ...DEFAULT_GAMIFICATION_STATE,
        ...data,
        badges: Array.isArray(data.badges) ? data.badges : [],
      };
    }
    return DEFAULT_GAMIFICATION_STATE;
  } catch (err) {
    console.error('[gamificationService] fetch error:', err);
    return DEFAULT_GAMIFICATION_STATE;
  }
}

export async function saveGamificationState(
  uid: string,
  state: GamificationState,
): Promise<void> {
  if (!uid) return;
  await setDoc(doc(db, 'users', uid, 'gamification', 'state'), state, { merge: true });
}
