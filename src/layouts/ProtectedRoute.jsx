import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { Spinner } from '../design-system/Spinner';

export function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { needsOnboarding, loading: profileLoading } = useProfile();
  const location = useLocation();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)]">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <Spinner size="sm" />
          Loading your workspace…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

export default ProtectedRoute;
