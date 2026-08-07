import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  getUserProfile,
  setUserProfile,
  subscribeUserProfile,
} from '../services/firestore';

const ProfileContext = createContext(null);

function normalize(doc) {
  if (!doc) return null;
  return {
    name: doc.name || '',
    email: doc.email || '',
    academicLevel: doc.academicLevel || '',
    interests: Array.isArray(doc.interests) ? doc.interests : [],
    careerGoal: doc.careerGoal || '',
    preferredLanguage: doc.preferredLanguage || 'en',
    dailyStudyGoal: Number(doc.dailyStudyGoal) || 30,
    onboardingCompleted: !!doc.onboardingCompleted,
    updatedAt: doc.updatedAt,
  };
}

export function ProfileProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    // Seed on first sign-in
    (async () => {
      try {
        const existing = await getUserProfile(user.uid);
        if (!existing) {
          await setUserProfile(user.uid, {
            name: user.displayName || '',
            email: user.email || '',
            academicLevel: '',
            interests: [],
            careerGoal: '',
            preferredLanguage: 'en',
            dailyStudyGoal: 30,
            onboardingCompleted: false,
          });
        }
      } catch (e) {
        // Non-fatal: subscription will surface real errors.
        // eslint-disable-next-line no-console
        console.warn('[profile] seed failed', e);
      }
    })();

    unsubRef.current?.();
    unsubRef.current = subscribeUserProfile(
      user.uid,
      (data) => {
        setProfile(normalize(data));
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => {
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [user, authLoading]);

  async function completeOnboarding(data) {
    if (!user) throw new Error('Not authenticated');
    const payload = {
      name: (data.name || user.displayName || '').trim(),
      email: user.email || data.email || '',
      academicLevel: data.academicLevel || '',
      interests: Array.isArray(data.interests) ? data.interests : [],
      careerGoal: (data.careerGoal || '').trim(),
      preferredLanguage: data.preferredLanguage || 'en',
      dailyStudyGoal: Number(data.dailyStudyGoal) || 30,
      onboardingCompleted: true,
    };
    await setUserProfile(user.uid, payload);
    return payload;
  }

  async function updateProfile(patch) {
    if (!user) throw new Error('Not authenticated');
    await setUserProfile(user.uid, patch);
  }

  const value = {
    profile,
    loading,
    error,
    needsOnboarding: !!user && (!profile || !profile.onboardingCompleted),
    completeOnboarding,
    updateProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
