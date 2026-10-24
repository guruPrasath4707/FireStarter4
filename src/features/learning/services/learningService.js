import {
  LEARNING_CATEGORIES,
  LEARNING_RESOURCES,
} from '../data/resources.js';
import { getInterestOverlap } from '../../../utils/interestMatching.js';

export function listLearningResources({
  query = '',
  category = 'all',
  interests = [],
  matchingOnly = false,
} = {}) {
  const normalizedQuery = typeof query === 'string' ? query.trim().toLocaleLowerCase() : '';

  const matching = LEARNING_RESOURCES
    .map((resource, index) => ({
      ...resource,
      interestFit: getInterestOverlap(resource.interests, interests),
      catalogueOrder: index,
    }))
    .filter((resource) => {
      if (category !== 'all' && resource.category !== category) return false;
      if (matchingOnly && interests.length > 0 && resource.interestFit.matchCount === 0) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        resource.title,
        resource.provider,
        resource.category,
        resource.level,
        resource.summary,
        ...resource.topics,
      ].join(' ').toLocaleLowerCase();

      return haystack.includes(normalizedQuery);
    });

  if (interests.length > 0) {
    matching.sort((a, b) =>
      (b.interestFit.matchCount - a.interestFit.matchCount) ||
      (a.catalogueOrder - b.catalogueOrder),
    );
  }

  return {
    items: matching.map(({ catalogueOrder, ...resource }) => resource),
    total: matching.length,
    categories: LEARNING_CATEGORIES,
  };
}

export const learningService = {
  list: listLearningResources,
};

export default learningService;
