export const ACADEMIC_LEVEL_VALUES = [
  'class-9',
  'class-10',
  'class-11',
  'class-12',
  'ug',
  'pg',
  'working',
];

export const DAILY_STUDY_GOAL_VALUES = [15, 30, 60, 90];

export function getProfileFormValues(profile, user) {
  return {
    name: profile?.name || user?.displayName || '',
    academicLevel: ACADEMIC_LEVEL_VALUES.includes(profile?.academicLevel)
      ? profile.academicLevel
      : 'class-12',
    interests: Array.isArray(profile?.interests) ? [...profile.interests] : [],
    careerGoal: profile?.careerGoal || '',
    dailyStudyGoal: String(
      DAILY_STUDY_GOAL_VALUES.includes(Number(profile?.dailyStudyGoal))
        ? Number(profile.dailyStudyGoal)
        : 30,
    ),
  };
}

export function normalizeProfileForm(form) {
  const name = typeof form?.name === 'string' ? form.name.trim() : '';
  const academicLevel = form?.academicLevel;
  const careerGoal = typeof form?.careerGoal === 'string'
    ? form.careerGoal.trim()
    : '';
  const seenInterests = new Set();
  const interests = (Array.isArray(form?.interests) ? form.interests : [])
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLocaleLowerCase();
      if (seenInterests.has(key)) return false;
      seenInterests.add(key);
      return true;
    });
  const dailyStudyGoal = Number(form?.dailyStudyGoal);

  const errors = {};
  if (!name) errors.name = 'Enter your name.';
  if (!ACADEMIC_LEVEL_VALUES.includes(academicLevel)) {
    errors.academicLevel = 'Choose an academic level from the list.';
  }
  if (!DAILY_STUDY_GOAL_VALUES.includes(dailyStudyGoal)) {
    errors.dailyStudyGoal = 'Choose a daily study goal from the list.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    values: {
      name,
      academicLevel,
      interests,
      careerGoal,
      dailyStudyGoal,
    },
  };
}
