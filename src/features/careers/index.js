export const FEATURE_KEY = 'careers';

export const careersService = {
  list: () => import('../../services/apiClient').then((m) => m.apiClient.get('/careers')),
};

export default { FEATURE_KEY, careersService };
