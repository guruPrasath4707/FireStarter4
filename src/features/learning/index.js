export const FEATURE_KEY = 'learning';

export const learningService = {
  list: () => import('../../services/apiClient').then((m) => m.apiClient.get('/learning')),
};

export default { FEATURE_KEY, learningService };
