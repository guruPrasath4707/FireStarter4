import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { Button } from '../design-system/Button';
import { Card, CardBody } from '../design-system/Card';
import { Spinner } from '../design-system/Spinner';
import { getProtectedRouteDecision } from '../utils/protectedRouteDecision';

export function ProtectedRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const {
    loading: profileLoading,
    error: profileError,
    needsOnboarding,
    retryProfile,
  } = useProfile();
  const location = useLocation();
  const returnTo = `${location.pathname}${location.search}${location.hash}`;

  const decision = getProtectedRouteDecision({
    authLoading,
    profileLoading,
    profileError,
    user,
    needsOnboarding,
    pathname: location.pathname,
    returnTo,
  });

  if (decision.type === 'loading') {
    return (
      <div className="min-h-screen grid place-items-center bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)]">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <Spinner size="sm" />
          Loading your workspace…
        </div>
      </div>
    );
  }

  if (decision.type === 'profile-error') {
    return (
      <div className="min-h-screen grid place-items-center bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)] px-6">
        <Card className="w-full max-w-md">
          <CardBody className="p-6 text-center">
            <h1 className="text-lg font-semibold text-slate-900">
              We couldn’t load your profile
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Your preferences and onboarding status could not be retrieved. Check your connection and try again.
            </p>
            <Button className="mt-5" variant="brand" onClick={retryProfile}>
              Try again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (decision.type === 'redirect') {
    return <Navigate to={decision.to} replace state={decision.state} />;
  }

  return children;
}

export default ProtectedRoute;
