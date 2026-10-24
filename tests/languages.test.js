import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  normalizePreferredLanguage,
} from '../src/utils/languages.js';

test('only exposes languages that have runtime translations', () => {
  assert.deepEqual(SUPPORTED_LANGUAGES.map(({ value }) => value), ['en']);
  assert.equal(DEFAULT_LANGUAGE, 'en');
});

test('keeps an available language after trimming and case normalization', () => {
  assert.equal(normalizePreferredLanguage(' EN '), 'en');
});

test('falls back safely for languages not implemented by the runtime', () => {
  for (const value of ['hi', 'ta', 'es', 'fr', '', null, undefined, 4]) {
    assert.equal(normalizePreferredLanguage(value), 'en');
  }
});
