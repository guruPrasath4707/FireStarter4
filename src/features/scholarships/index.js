export const FEATURE_KEY = 'scholarships';

export const scholarshipsService = {
  list: () => import('../../services/apiClient').then((m) => m.apiClient.get('/scholarships')),
};

export default { FEATURE_KEY, scholarshipsService };
