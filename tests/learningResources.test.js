import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LEARNING_CATEGORIES,
  LEARNING_RESOURCES,
  LEARNING_RESOURCE_REVIEWED_AT,
} from '../src/features/learning/data/resources.js';
import { listLearningResources } from '../src/features/learning/services/learningService.js';

test('every learning resource has unique identity, direct provider links, and rights metadata', () => {
  const ids = LEARNING_RESOURCES.map((resource) => resource.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(LEARNING_RESOURCES.length >= 5);

  for (const resource of LEARNING_RESOURCES) {
    assert.ok(resource.title.trim());
    assert.ok(resource.provider.trim());
    assert.ok(resource.summary.trim());
    assert.ok(resource.topics.length > 0);
    assert.ok(resource.interests.length > 0);
    assert.match(resource.url, /^https:\/\//);
    assert.match(resource.sourceUrl, /^https:\/\//);
    assert.match(resource.rightsNote, /publisher|license/i);
    assert.ok(resource.licenseLabel.trim());
    assert.match(resource.licenseUrl, /^https:\/\//);
    assert.ok(resource.licenseNote.trim());
    assert.equal(resource.rightsReviewedOn, LEARNING_RESOURCE_REVIEWED_AT);
    assert.equal(resource.sourceReviewDate, LEARNING_RESOURCE_REVIEWED_AT);
    assert.ok(LEARNING_CATEGORIES.some((category) => category.value === resource.category));
  }
});

test('search matches title, provider, and topics without mutating the source catalogue', () => {
  const beforeIds = LEARNING_RESOURCES.map((resource) => resource.id);
  const python = listLearningResources({ query: 'python' });
  const github = listLearningResources({ query: 'pull requests' });

  assert.ok(python.total >= 2);
  assert.ok(python.items.some((resource) => resource.id === 'python-official-tutorial'));
  assert.ok(github.items.some((resource) => resource.id === 'github-skills'));
  assert.deepEqual(LEARNING_RESOURCES.map((resource) => resource.id), beforeIds);
});

test('category filtering limits results to the requested category', () => {
  const result = listLearningResources({ category: 'Web development' });
  assert.ok(result.total >= 2);
  assert.ok(result.items.every((resource) => resource.category === 'Web development'));
});

test('interest matching normalizes the onboarding Math & Logic label and keeps unmatched resources available by default', () => {
  const selectedInterests = ['Math & Logic'];
  const all = listLearningResources({ interests: selectedInterests });
  const matching = listLearningResources({
    interests: selectedInterests,
    matchingOnly: true,
  });

  assert.ok(all.total > matching.total);
  assert.equal(matching.items[0].interestFit.matchCount, 1);
  assert.ok(matching.items.every((resource) => resource.interestFit.matchCount > 0));
  assert.ok(all.items.some((resource) => resource.interestFit.matchCount === 0));
});

test('with no selected interests, matching-only mode does not pretend to personalize the catalogue', () => {
  const result = listLearningResources({ matchingOnly: true, interests: [] });
  assert.equal(result.total, LEARNING_RESOURCES.length);
});


test('explicitly distinguishes reusable license information from provider-only terms', () => {
  const byId = Object.fromEntries(LEARNING_RESOURCES.map((resource) => [resource.id, resource]));
  assert.match(byId['mdn-first-website'].licenseLabel, /CC BY-SA 2\.5 or later/i);
  assert.match(byId['python-official-tutorial'].licenseLabel, /PSF License Version 2/i);
  assert.match(byId['microsoft-python-fundamentals'].licenseLabel, /no blanket reuse license assumed/i);
  assert.match(byId['khan-computing'].licenseLabel, /no blanket reuse license assumed/i);
  assert.match(byId['github-skills'].licenseLabel, /no blanket reuse license assumed/i);
});
