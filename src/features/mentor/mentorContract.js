export const MENTOR_CONTRACT_VERSION = 1;
export const MENTOR_ENDPOINT = '/v1/mentor/ask';
export const MENTOR_PROMPT_MAX_CODE_POINTS = 4000;
export const MENTOR_ANSWER_MAX_CODE_POINTS = 12000;
export const MENTOR_MAX_CITATIONS = 8;

export class MentorContractError extends Error {
  constructor(message, code = 'invalid_mentor_payload') {
    super(message);
    this.name = 'MentorContractError';
    this.code = code;
  }
}

function codePointLength(value) {
  return Array.from(value).length;
}

function boundedText(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && codePointLength(value.trim()) <= maxLength
    ? value.trim()
    : null;
}

export function buildMentorRequest(prompt) {
  if (typeof prompt !== 'string') {
    throw new MentorContractError('Enter a question for the AI Mentor.', 'invalid_prompt');
  }

  const normalized = prompt.trim();
  if (!normalized) {
    throw new MentorContractError('Enter a question for the AI Mentor.', 'invalid_prompt');
  }
  if (codePointLength(normalized) > MENTOR_PROMPT_MAX_CODE_POINTS) {
    throw new MentorContractError(
      'Keep your question to 4,000 characters or fewer.',
      'prompt_too_long',
    );
  }

  return {
    contractVersion: MENTOR_CONTRACT_VERSION,
    prompt: normalized,
  };
}

function normalizeCitation(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new MentorContractError('The AI Mentor returned an invalid citation.', 'invalid_mentor_response');
  }

  const title = boundedText(value.title, 200);
  const urlText = boundedText(value.url, 2048);
  const publisher = value.publisher == null ? '' : boundedText(value.publisher, 200);

  if (!title || !urlText || (value.publisher != null && !publisher)) {
    throw new MentorContractError('The AI Mentor returned an invalid citation.', 'invalid_mentor_response');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(urlText);
  } catch {
    throw new MentorContractError('The AI Mentor returned an invalid citation URL.', 'invalid_mentor_response');
  }

  if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) {
    throw new MentorContractError('The AI Mentor returned an unsafe citation URL.', 'invalid_mentor_response');
  }

  return {
    title,
    url: parsedUrl.href,
    ...(publisher ? { publisher } : {}),
  };
}

export function normalizeMentorResponse(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new MentorContractError('The AI Mentor returned an invalid response.', 'invalid_mentor_response');
  }
  if (value.contractVersion !== MENTOR_CONTRACT_VERSION) {
    throw new MentorContractError('The AI Mentor response version is not supported.', 'unsupported_mentor_version');
  }

  const requestId = boundedText(value.requestId, 128);
  const answer = boundedText(value.answer, MENTOR_ANSWER_MAX_CODE_POINTS);
  if (!requestId || !answer) {
    throw new MentorContractError('The AI Mentor response was incomplete.', 'invalid_mentor_response');
  }

  const rawCitations = value.citations == null ? [] : value.citations;
  if (!Array.isArray(rawCitations) || rawCitations.length > MENTOR_MAX_CITATIONS) {
    throw new MentorContractError('The AI Mentor returned too many or invalid citations.', 'invalid_mentor_response');
  }

  return {
    contractVersion: MENTOR_CONTRACT_VERSION,
    requestId,
    answer,
    citations: rawCitations.map(normalizeCitation),
  };
}
