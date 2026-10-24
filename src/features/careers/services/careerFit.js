const INTEREST_LABELS = {
  tech: 'Technology',
  technology: 'Technology',
  math: 'Mathematics',
  mathematics: 'Mathematics',
  making: 'Building & making',
  science: 'Science',
  health: 'Health',
  business: 'Business',
  arts: 'Arts',
  languages: 'Languages',
};

const INTEREST_ALIASES = {
  technology: 'tech',
  'math & logic': 'math',
  'arts & design': 'arts',
  'health & med': 'health',
  'building / diy': 'making',
  'building and diy': 'making',
  'building & making': 'making',
};

function normalizeInterest(value) {
  if (typeof value !== 'string') return '';
  const key = value.trim().toLocaleLowerCase();
  return INTEREST_ALIASES[key] || key;
}

export function getCareerInterestFit(careerInterests = [], selectedInterests = []) {
  const selected = new Map();
  for (const value of selectedInterests) {
    const key = normalizeInterest(value);
    if (key && !selected.has(key)) selected.set(key, value.trim());
  }

  const careerTags = new Set(
    careerInterests
      .map(normalizeInterest)
      .filter(Boolean),
  );

  const matchingInterests = [...selected.entries()]
    .filter(([key]) => careerTags.has(key))
    .map(([, label]) => label);

  return {
    hasSelectedInterests: selected.size > 0,
    selectedCount: selected.size,
    matchCount: matchingInterests.length,
    matchingInterests,
  };
}

export function formatInterestLabel(value) {
  const key = normalizeInterest(value);
  if (!key) return '';
  if (INTEREST_LABELS[key]) return INTEREST_LABELS[key];
  return key.charAt(0).toLocaleUpperCase() + key.slice(1);
}
