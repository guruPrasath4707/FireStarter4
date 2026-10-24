/**
 * Pure decision function for protected routing.
 *
 * Kept free of React so redirect behavior can be covered by Node's built-in test
 * runner without adding a browser-testing dependency.
 */
export function getProtectedRouteDecision({
  authLoading = false,
  profileLoading = false,
  profileError = null,
  user = null,
  needsOnboarding = false,
  pathname = '/',
  returnTo,
} = {}) {
  if (authLoading || (Boolean(user) && profileLoading)) {
    return { type: 'loading' };
  }

  if (!user) {
    return {
      type: 'redirect',
      to: '/login',
      state: { from: returnTo || pathname || '/' },
    };
  }

  if (profileError) {
    return { type: 'profile-error' };
  }

  if (needsOnboarding) {
    return pathname === '/onboarding'
      ? { type: 'render' }
      : { type: 'redirect', to: '/onboarding' };
  }

  if (pathname === '/onboarding') {
    return { type: 'redirect', to: '/dashboard' };
  }

  return { type: 'render' };
}
