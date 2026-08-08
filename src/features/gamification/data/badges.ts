import type { Badge, GamificationState } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete onboarding setup',
    icon: 'Rocket',
    condition: (state: GamificationState) => state.onboardingCompletedBonus === true,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'View 5 different career paths',
    icon: 'Compass',
    condition: (state: GamificationState) => (state.totalCareersViewed ?? 0) >= 5,
  },
  {
    id: 'curator',
    name: 'Curator',
    description: 'Save 3 careers to your path',
    icon: 'Bookmark',
    condition: (state: GamificationState) => (state.totalCareersSaved ?? 0) >= 3,
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: 'Flame',
    condition: (state: GamificationState) => (state.streakDays ?? 0) >= 7,
  },
  {
    id: 'career_compass',
    name: 'Career Compass',
    description: 'Reach Level 5 in your journey',
    icon: 'Map',
    condition: (state: GamificationState) => (state.level ?? 0) >= 5,
  },
  {
    id: 'level_up',
    name: 'Level Up',
    description: 'Reach Level 3 in your journey',
    icon: 'TrendingUp',
    condition: (state: GamificationState) => (state.level ?? 0) >= 3,
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Accumulate 200 XP total',
    icon: 'Star',
    condition: (state: GamificationState) => (state.xp ?? 0) >= 200,
  },
];
