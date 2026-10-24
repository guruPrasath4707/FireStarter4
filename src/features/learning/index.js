import {
  LEARNING_CATEGORIES,
  LEARNING_RESOURCES,
  filterLearningResources,
} from './learningCatalog.js';

export const FEATURE_KEY = 'learning';

export {
  LEARNING_CATEGORIES,
  LEARNING_RESOURCES,
  filterLearningResources,
};

export const learningService = {
  list(options = {}) {
    const items = filterLearningResources(LEARNING_RESOURCES, options);
    return {
      items,
      total: items.length,
      categories: LEARNING_CATEGORIES,
    };
  },
};

export default { FEATURE_KEY, learningService };
