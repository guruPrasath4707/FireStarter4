export const FEATURE_KEY = 'opportunities';

export const opportunitiesService = {
  list: () => import('../../services/apiClient').then((m) => m.apiClient.get('/opportunities')),
};

export default { FEATURE_KEY, opportunitiesService };
