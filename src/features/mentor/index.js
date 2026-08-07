export const FEATURE_KEY = 'mentor';

export const mentorService = {
  ask: (prompt) =>
    import('../../services/apiClient').then((m) =>
      m.apiClient.post('/mentor/ask', { prompt }),
    ),
};

export default { FEATURE_KEY, mentorService };
