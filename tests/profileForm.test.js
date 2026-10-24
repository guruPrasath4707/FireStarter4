import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getProfileFormValues,
  normalizeProfileForm,
} from '../src/utils/profileForm.js';
import { getProfileCompleteness } from '../src/utils/profileCompleteness.js';

test('hydrates the form from profile data and safely defaults invalid values', () => {
  assert.deepEqual(
    getProfileFormValues(
      { name: 'Student', academicLevel: 'ug', interests: ['tech'], dailyStudyGoal: 60 },
      { displayName: 'Auth name' },
    ),
    {
      name: 'Student',
      academicLevel: 'ug',
      interests: ['tech'],
      careerGoal: '',
      dailyStudyGoal: '60',
    },
  );

  assert.deepEqual(
    getProfileFormValues({ academicLevel: 'unsupported', dailyStudyGoal: 42 }, { displayName: 'Account name' }),
    {
      name: 'Account name',
      academicLevel: 'class-12',
      interests: [],
      careerGoal: '',
      dailyStudyGoal: '30',
    },
  );
});

test('requires a nonblank name and a valid academic level and study goal', () => {
  const result = normalizeProfileForm({
    name: '  ',
    academicLevel: 'not-real',
    interests: [],
    careerGoal: '',
    dailyStudyGoal: '999',
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.name, 'Enter your name.');
  assert.ok(result.errors.academicLevel);
  assert.ok(result.errors.dailyStudyGoal);
});

test('trims fields and de-duplicates interest tags case-insensitively', () => {
  const result = normalizeProfileForm({
    name: '  Ada Lovelace  ',
    academicLevel: 'ug',
    interests: [' tech ', 'TECH', '', 'science', null],
    careerGoal: '  Explore computational science ',
    dailyStudyGoal: '60',
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.values, {
    name: 'Ada Lovelace',
    academicLevel: 'ug',
    interests: ['tech', 'science'],
    careerGoal: 'Explore computational science',
    dailyStudyGoal: 60,
  });
});

test('profile completeness is derived only from saved profile fields', () => {
  assert.deepEqual(getProfileCompleteness({
    name: 'Ada',
    academicLevel: 'ug',
    interests: ['tech'],
    careerGoal: '',
    dailyStudyGoal: 30,
  }), {
    completeFields: 4,
    totalFields: 5,
    percentage: 80,
    missingSteps: [{ key: 'careerGoal', label: 'Add a career goal' }],
  });
});

test('an empty profile reports all required profile fields as incomplete', () => {
  const result = getProfileCompleteness(null);
  assert.equal(result.completeFields, 0);
  assert.equal(result.percentage, 0);
  assert.equal(result.missingSteps.length, 5);
});
