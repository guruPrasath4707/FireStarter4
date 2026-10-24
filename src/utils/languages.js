export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = Object.freeze([
  { value: DEFAULT_LANGUAGE, label: 'English' },
]);

const SUPPORTED_LANGUAGE_CODES = new Set(
  SUPPORTED_LANGUAGES.map(({ value }) => value),
);

/**
 * Return a language whose translations are actually loaded by the app.
 * Older profiles may contain planned-but-unimplemented language codes.
 */
export function normalizePreferredLanguage(value) {
  const candidate = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return SUPPORTED_LANGUAGE_CODES.has(candidate) ? candidate : DEFAULT_LANGUAGE;
}
