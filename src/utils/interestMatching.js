const INTEREST_ALIASES = {
  technology: 'tech',
  'math & logic': 'math',
  'arts & design': 'arts',
  'health & med': 'health',
  'building / diy': 'making',
  'building and diy': 'making',
  'building & making': 'making',
};

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

export function normalizeInterestId(value) {
  if (typeof value !== 'string') return '';
  const key = value.trim().toLocaleLowerCase();
  return INTEREST_ALIASES[key] || key;
}

export function getInterestOverlap(availableTags = [], selectedTags = []) {
  const selected = new Map();
  for (const value of selectedTags) {
    const key = normalizeInterestId(value);
    if (key && !selected.has(key)) selected.set(key, value.trim());
  }

  const available = new Set(availableTags.map(normalizeInterestId).filter(Boolean));
  const matchingInterests = [...selected.entries()]
    .filter(([key]) => available.has(key))
    .map(([, label]) => label);

  return {
    hasSelectedInterests: selected.size > 0,
    selectedCount: selected.size,
    matchCount: matchingInterests.length,
    matchingInterests,
  };
}

export function formatInterestLabel(value) {
  const key = normalizeInterestId(value);
  if (!key) return '';
  if (INTEREST_LABELS[key]) return INTEREST_LABELS[key];
  return key.charAt(0).toLocaleUpperCase() + key.slice(1);
}
