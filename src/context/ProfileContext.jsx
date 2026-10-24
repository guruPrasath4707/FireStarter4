import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import {
  markLearningResourceComplete,
  markLearningResourceIncomplete,
  removeCareerFromUserPath,
  saveCareerToUserPath,
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
    savedCareerIds: Array.isArray(doc.savedCareerIds) ? doc.savedCareerIds : [],
    completedLearningIds: Array.isArray(doc.completedLearningIds) ? doc.completedLearningIds : [],
    updatedAt: doc.updatedAt,
  };
}

export function ProfileProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const retryProfile = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setProfile(null);
      setLoading(false);
      setError(null);
      return undefined;
    }

    let active = true;
    setProfile(null);
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeUserProfile(
      user.uid,
      (data) => {
        if (!active) return;
        setProfile(normalize(data));
        setError(null);
        setLoading(false);
      },
      (subscriptionError) => {
        if (!active) return;
        setError(subscriptionError);
        setLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user, authLoading, reloadToken]);

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
    // Update context immediately so the route guard does not redirect back to
    // onboarding while the Firestore snapshot update is still in flight.
    setProfile(normalize(payload));
    setError(null);
    setLoading(false);
    return payload;
  }

  async function updateProfile(patch) {
    if (!user) throw new Error('Not authenticated');
    await setUserProfile(user.uid, patch);
    setProfile((current) => normalize({ ...(current || {}), ...patch }));
    setError(null);
  }

  async function saveCareer(careerId) {
    if (!user) throw new Error('Not authenticated');
    await saveCareerToUserPath(user.uid, careerId);
    setProfile((current) => {
      const ids = current?.savedCareerIds || [];
      return normalize({
        ...(current || {}),
        savedCareerIds: [...new Set([...ids, careerId])],
      });
    });
    setError(null);
  }

  async function removeSavedCareer(careerId) {
    if (!user) throw new Error('Not authenticated');
    await removeCareerFromUserPath(user.uid, careerId);
    setProfile((current) => {
      const ids = current?.savedCareerIds || [];
      return normalize({
        ...(current || {}),
        savedCareerIds: ids.filter((id) => id !== careerId),
      });
    });
    setError(null);
  }

  async function completeLearningResource(resourceId) {
    if (!user) throw new Error('Not authenticated');
    if (typeof resourceId !== 'string' || !resourceId.trim()) {
      throw new Error('A learning resource id is required.');
    }
    const id = resourceId.trim();
    await markLearningResourceComplete(user.uid, id);
    setProfile((current) => normalize({
      ...(current || {}),
      completedLearningIds: [...new Set([...(current?.completedLearningIds || []), id])],
    }));
    setError(null);
  }

  async function reopenLearningResource(resourceId) {
    if (!user) throw new Error('Not authenticated');
    if (typeof resourceId !== 'string' || !resourceId.trim()) {
      throw new Error('A learning resource id is required.');
    }
    const id = resourceId.trim();
    await markLearningResourceIncomplete(user.uid, id);
    setProfile((current) => normalize({
      ...(current || {}),
      completedLearningIds: (current?.completedLearningIds || []).filter((completedId) => completedId !== id),
    }));
    setError(null);
  }

  const needsOnboarding =
    !!user && !loading && !error && (!profile || !profile.onboardingCompleted);

  const value = {
    profile,
    loading,
    error,
    needsOnboarding,
    completeOnboarding,
    updateProfile,
    saveCareer,
    removeSavedCareer,
    completeLearningResource,
    reopenLearningResource,
    retryProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
