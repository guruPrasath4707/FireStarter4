import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LEARNING_RESOURCES,
  filterLearningResources,
  getLearningProgress,
} from '../src/features/learning/learningCatalog.js';

test('curated resources have unique IDs, official source URLs, and provenance metadata', () => {
  const ids = LEARNING_RESOURCES.map((resource) => resource.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.length >= 5);

  for (const resource of LEARNING_RESOURCES) {
    assert.ok(resource.title.trim(), resource.id + ' needs a title');
    assert.ok(resource.provider.trim(), resource.id + ' needs a provider');
    assert.match(resource.url, /^https:\/\/\S+$/);
    assert.match(resource.sourceUrl, /^https:\/\/\S+$/);
    assert.match(resource.licenseUrl, /^https:\/\/\S+$/);
    assert.ok(resource.licenseLabel.trim(), resource.id + ' needs license metadata');
    assert.ok(resource.licenseNote.trim(), resource.id + ' needs a license note');
    assert.match(resource.reviewedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(Array.isArray(resource.tags) && resource.tags.length > 0);
  }
});

test('search matches resource titles, provider names, and tags case-insensitively', () => {
  assert.deepEqual(
    filterLearningResources(LEARNING_RESOURCES, { query: 'PYTHON' }).map((r) => r.id),
    ['python-tutorial'],
  );
  assert.deepEqual(
    filterLearningResources(LEARNING_RESOURCES, { query: 'github' }).map((r) => r.id),
    ['github-skills-intro'],
  );
  assert.ok(
    filterLearningResources(LEARNING_RESOURCES, { query: 'algorithms' }).some((r) => r.id === 'cs50x-2026'),
  );
});

test('topic and completion filters combine rather than overwrite each other', () => {
  const filtered = filterLearningResources(LEARNING_RESOURCES, {
    category: 'developer-workflow',
    status: 'incomplete',
    completedIds: ['mit-missing-semester'],
  });
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((resource) => resource.category === 'developer-workflow'));
  assert.ok(filtered.every((resource) => resource.id !== 'mit-missing-semester'));
});

test('completed filter returns only IDs recorded as completed', () => {
  const filtered = filterLearningResources(LEARNING_RESOURCES, {
    status: 'completed',
    completedIds: ['python-tutorial', 'github-skills-intro', 'unknown-id'],
  });
  assert.deepEqual(filtered.map((resource) => resource.id), ['python-tutorial', 'github-skills-intro']);
});

test('progress ignores duplicate and unknown completion IDs and safely handles empty input', () => {
  assert.deepEqual(getLearningProgress(LEARNING_RESOURCES, [
    'python-tutorial',
    'python-tutorial',
    'unknown-id',
    'mit-missing-semester',
  ]), {
    completed: 2,
    total: LEARNING_RESOURCES.length,
    remaining: LEARNING_RESOURCES.length - 2,
    percentage: Math.round((2 / LEARNING_RESOURCES.length) * 100),
  });
  assert.deepEqual(getLearningProgress([], ['anything']), {
    completed: 0,
    total: 0,
    remaining: 0,
    percentage: 0,
  });
});
