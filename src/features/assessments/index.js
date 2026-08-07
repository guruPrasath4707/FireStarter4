export const FEATURE_KEY = 'assessments';

export const assessmentsService = {
  list: () => import('../../services/apiClient').then((m) => m.apiClient.get('/assessments')),
};

export default { FEATURE_KEY, assessmentsService };
