const PROFILE_FIELDS = [
  {
    key: 'name',
    label: 'Add your name',
    complete: (profile) => typeof profile?.name === 'string' && profile.name.trim().length > 0,
  },
  {
    key: 'academicLevel',
    label: 'Choose your academic level',
    complete: (profile) => typeof profile?.academicLevel === 'string' && profile.academicLevel.trim().length > 0,
  },
  {
    key: 'interests',
    label: 'Choose at least one interest',
    complete: (profile) => Array.isArray(profile?.interests) && profile.interests.length > 0,
  },
  {
    key: 'careerGoal',
    label: 'Add a career goal',
    complete: (profile) => typeof profile?.careerGoal === 'string' && profile.careerGoal.trim().length > 0,
  },
  {
    key: 'dailyStudyGoal',
    label: 'Set your daily study goal',
    complete: (profile) => Number.isFinite(Number(profile?.dailyStudyGoal)) && Number(profile.dailyStudyGoal) > 0,
  },
];

export function getProfileCompleteness(profile) {
  const completeFields = PROFILE_FIELDS.filter((field) => field.complete(profile)).length;
  const totalFields = PROFILE_FIELDS.length;
  const missingSteps = PROFILE_FIELDS
    .filter((field) => !field.complete(profile))
    .map((field) => ({ key: field.key, label: field.label }));

  return {
    completeFields,
    totalFields,
    percentage: Math.round((completeFields / totalFields) * 100),
    missingSteps,
  };
}
