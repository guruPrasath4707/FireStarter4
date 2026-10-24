import {
  buildMentorRequest,
  MENTOR_ENDPOINT,
  normalizeMentorResponse,
} from './mentorContract.js';

export const FEATURE_KEY = 'mentor';

export const mentorService = {
  async ask(prompt, options = {}) {
    const body = buildMentorRequest(prompt);
    const { apiClient } = await import('../../services/apiClient');
    const response = await apiClient.post(MENTOR_ENDPOINT, body, {
      retries: 0,
      signal: options?.signal,
    });
    return normalizeMentorResponse(response);
  },
};

export default { FEATURE_KEY, mentorService };
