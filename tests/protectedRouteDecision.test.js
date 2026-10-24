import test from 'node:test';
import assert from 'node:assert/strict';
import { getProtectedRouteDecision } from '../src/utils/protectedRouteDecision.js';

const user = { uid: 'test-user' };

test('waits for the initial Firebase auth state', () => {
  assert.deepEqual(
    getProtectedRouteDecision({ authLoading: true, pathname: '/dashboard' }),
    { type: 'loading' },
  );
});

test('waits for a signed-in user profile before deciding onboarding', () => {
  assert.deepEqual(
    getProtectedRouteDecision({
      user,
      profileLoading: true,
      pathname: '/dashboard',
    }),
    { type: 'loading' },
  );
});

test('redirects unauthenticated users to login and preserves the intended URL', () => {
  assert.deepEqual(
    getProtectedRouteDecision({
      pathname: '/careers/software-engineer',
      returnTo: '/careers/software-engineer?tab=roadmap#skills',
    }),
    {
      type: 'redirect',
      to: '/login',
      state: { from: '/careers/software-engineer?tab=roadmap#skills' },
    },
  );
});

test('requires onboarding only when the loaded profile is incomplete', () => {
  assert.deepEqual(
    getProtectedRouteDecision({
      user,
      pathname: '/dashboard',
      needsOnboarding: true,
    }),
    { type: 'redirect', to: '/onboarding' },
  );
});

test('allows an incomplete signed-in user to complete onboarding', () => {
  assert.deepEqual(
    getProtectedRouteDecision({
      user,
      pathname: '/onboarding',
      needsOnboarding: true,
    }),
    { type: 'render' },
  );
});

test('sends completed users away from onboarding', () => {
  assert.deepEqual(
    getProtectedRouteDecision({
      user,
      pathname: '/onboarding',
      needsOnboarding: false,
    }),
    { type: 'redirect', to: '/dashboard' },
  );
});

test('allows completed users to open protected application routes', () => {
  assert.deepEqual(
    getProtectedRouteDecision({
      user,
      pathname: '/careers',
      needsOnboarding: false,
    }),
    { type: 'render' },
  );
});

test('does not mistake a profile read failure for incomplete onboarding', () => {
  assert.deepEqual(
    getProtectedRouteDecision({
      user,
      pathname: '/dashboard',
      profileError: new Error('permission denied'),
      needsOnboarding: false,
    }),
    { type: 'profile-error' },
  );
});
