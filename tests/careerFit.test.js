import test from 'node:test';
import assert from 'node:assert/strict';
import { formatInterestLabel, getCareerInterestFit } from '../src/features/careers/services/careerFit.js';

test('reports when the user has not selected any interests', () => {
  assert.deepEqual(getCareerInterestFit(['tech', 'math'], []), {
    hasSelectedInterests: false,
    selectedCount: 0,
    matchCount: 0,
    matchingInterests: [],
  });
});

test('counts exact overlapping interests case-insensitively', () => {
  assert.deepEqual(
    getCareerInterestFit(['tech', 'math', 'making'], ['Math', 'TECH', 'health']),
    {
      hasSelectedInterests: true,
      selectedCount: 3,
      matchCount: 2,
      matchingInterests: ['Math', 'TECH'],
    },
  );
});

test('deduplicates selected interests and ignores blank/non-string values', () => {
  const fit = getCareerInterestFit(['science'], ['science', ' SCIENCE ', '', null, 5]);
  assert.equal(fit.selectedCount, 1);
  assert.equal(fit.matchCount, 1);
  assert.deepEqual(fit.matchingInterests, ['science']);
});

test('returns zero overlap when none of the selected tags fit the career', () => {
  const fit = getCareerInterestFit(['business'], ['tech', 'math']);
  assert.equal(fit.hasSelectedInterests, true);
  assert.equal(fit.matchCount, 0);
  assert.deepEqual(fit.matchingInterests, []);
});

test('formats known interest values with readable labels', () => {
  assert.equal(formatInterestLabel('tech'), 'Technology');
  assert.equal(formatInterestLabel('math'), 'Mathematics');
  assert.equal(formatInterestLabel('  public policy '), 'Public policy');
  assert.equal(formatInterestLabel(null), '');
});
