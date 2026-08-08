import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../components/layout/useToast';
import {
  calculateLevel,
  calculateStreak,
  DEFAULT_GAMIFICATION_STATE,
  evaluateBadges,
  fetchGamificationState,
  saveGamificationState,
} from '../services/gamificationService';
import type { GamificationState, XPEventType } from '../types';
import { XP_VALUES } from '../types';

const sessionDedupSet = new Set<string>();

export function useGamification() {
  const { user } = useAuth();
  const toast = useToast();
  const [state, setState] = useState<GamificationState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const uidRef = useRef<string | null>(user?.uid || null);

  useEffect(() => {
    uidRef.current = user?.uid || null;
  }, [user?.uid]);

  useEffect(() => {
    let alive = true;
    if (!user?.uid) {
      setState(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const fetched = await fetchGamificationState(user.uid);
        if (!alive) return;

        // 1. Calculate streak
        const streakResult = calculateStreak(
          fetched.lastActiveDate,
          fetched.streakDays,
        );

        let activeState: GamificationState = {
          ...fetched,
          streakDays: streakResult.streakDays,
          lastActiveDate: streakResult.lastActiveDate,
        };

        // 2. Evaluate badges
        const updatedBadges = evaluateBadges(activeState);
        activeState = { ...activeState, badges: updatedBadges };

        setState(activeState);
        setLoading(false);

        // Save back if streak or badges changed
        if (
          activeState.streakDays !== fetched.streakDays ||
          activeState.lastActiveDate !== fetched.lastActiveDate ||
          activeState.badges.length !== (fetched.badges || []).length
        ) {
          saveGamificationState(user.uid, activeState).catch((err) =>
            console.error('[useGamification] background sync error', err),
          );
        }
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : 'Unable to load gamification');
        setState(DEFAULT_GAMIFICATION_STATE);
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [user?.uid]);

  const awardXP = useCallback(
    (eventType: XPEventType, meta?: { careerId?: string }) => {
      const uid = uidRef.current;
      if (!uid) return;

      const today = new Date().toISOString().split('T')[0];
      const dedupKey = `${eventType}:${meta?.careerId ?? 'none'}:${today}`;

      if (sessionDedupSet.has(dedupKey)) {
        return; // Guard double award
      }
      sessionDedupSet.add(dedupKey);

      setState((prevState) => {
        const current = prevState || DEFAULT_GAMIFICATION_STATE;
        const delta = XP_VALUES[eventType] || 0;
        const newXP = (current.xp || 0) + delta;
        const newLevel = calculateLevel(newXP);
        const prevLevel = current.level || 0;

        let totalCareersViewed = current.totalCareersViewed || 0;
        let totalCareersSaved = current.totalCareersSaved || 0;
        let onboardingCompletedBonus = current.onboardingCompletedBonus || false;

        if (eventType === 'CAREER_VIEWED') totalCareersViewed += 1;
        if (eventType === 'CAREER_SAVED') totalCareersSaved += 1;
        if (eventType === 'ONBOARDING_COMPLETE') onboardingCompletedBonus = true;

        const candidateState: GamificationState = {
          ...current,
          xp: newXP,
          level: newLevel,
          totalCareersViewed,
          totalCareersSaved,
          onboardingCompletedBonus,
        };

        const newBadges = evaluateBadges(candidateState);
        const newState: GamificationState = {
          ...candidateState,
          badges: newBadges,
        };

        // Level up notification
        if (newLevel > prevLevel) {
          toast?.({
            title: '🎉 Level Up!',
            description: `Congratulations! You reached Level ${newLevel}.`,
            tone: 'success',
          });
        }

        // New badge notification
        if (newBadges.length > (current.badges || []).length) {
          const newBadgeCount = newBadges.length - (current.badges || []).length;
          toast?.({
            title: '🏆 New Badge Unlocked!',
            description: `You unlocked ${newBadgeCount} new achievement badge${newBadgeCount > 1 ? 's' : ''}.`,
            tone: 'success',
          });
        }

        // Optimistic async background write with rollback on error
        saveGamificationState(uid, newState).catch((err) => {
          console.error('[useGamification] save error, rolling back:', err);
          setError('Failed to sync progress.');
          setState(current); // rollback
        });

        return newState;
      });
    },
    [toast],
  );

  return { state, loading, error, awardXP };
}

export default useGamification;
