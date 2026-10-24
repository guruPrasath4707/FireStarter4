import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import { normalizeAssessmentRecord } from '../features/assessments/assessmentEngine.js';
import {
  markLearningResourceComplete,
  removeCareerFromUserPath,
  reopenLearningResource,
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
    completedLearningResourceIds: Array.isArray(doc.completedLearningResourceIds)
      ? doc.completedLearningResourceIds
      : [],
    lastAssessment: normalizeAssessmentRecord(doc.lastAssessment),
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
    await markLearningResourceComplete(user.uid, resourceId);
    setProfile((current) => {
      const completed = current?.completedLearningResourceIds || [];
      return normalize({
        ...(current || {}),
        completedLearningResourceIds: [...new Set([...completed, resourceId])],
      });
    });
    setError(null);
  }

  async function reopenCompletedLearningResource(resourceId) {
    if (!user) throw new Error('Not authenticated');
    await reopenLearningResource(user.uid, resourceId);
    setProfile((current) => {
      const completed = current?.completedLearningResourceIds || [];
      return normalize({
        ...(current || {}),
        completedLearningResourceIds: completed.filter((id) => id !== resourceId),
      });
    });
    setError(null);
  }

  async function saveAssessmentResult(result) {
    if (!user) throw new Error('Not authenticated');
    const normalized = normalizeAssessmentRecord(result);
    if (!normalized) throw new Error('The assessment result is invalid or unsupported.');
    await setUserProfile(user.uid, { lastAssessment: normalized });
    setProfile((current) => normalize({ ...(current || {}), lastAssessment: normalized }));
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
    reopenCompletedLearningResource,
    saveAssessmentResult,
    retryProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}
