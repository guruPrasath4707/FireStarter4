export const FEATURE_KEY = 'learning';

export {
  LEARNING_CATEGORIES,
  LEARNING_RESOURCES,
  filterLearningResources,
  getLearningProgress,
} from './learningCatalog';

export const learningService = {
  list: () => import('../../services/apiClient').then((m) => m.apiClient.get('/learning')),
};

export default { FEATURE_KEY, learningService };
