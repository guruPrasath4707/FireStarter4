export interface GamificationState {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  badges: string[];
  totalCareersViewed: number;
  totalCareersSaved: number;
  onboardingCompletedBonus: boolean;
}

export type XPEventType =
  | 'ONBOARDING_COMPLETE'
  | 'CAREER_VIEWED'
  | 'CAREER_SAVED'
  | 'DAILY_LOGIN';

export const XP_VALUES: Record<XPEventType, number> = {
  ONBOARDING_COMPLETE: 50,
  CAREER_VIEWED: 5,
  CAREER_SAVED: 10,
  DAILY_LOGIN: 15,
};

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  condition: (state: GamificationState) => boolean;
}
