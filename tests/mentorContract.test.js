import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMentorRequest,
  MENTOR_ANSWER_MAX_CODE_POINTS,
  MENTOR_CONTRACT_VERSION,
  MENTOR_MAX_CITATIONS,
  MENTOR_PROMPT_MAX_CODE_POINTS,
  normalizeMentorResponse,
  MentorContractError,
} from '../src/features/mentor/mentorContract.js';

function validResponse(overrides = {}) {
  return {
    contractVersion: MENTOR_CONTRACT_VERSION,
    requestId: 'request-abc123',
    answer: 'A stack uses last-in, first-out ordering.',
    citations: [
      {
        title: 'Stack data structure',
        url: 'https://docs.example.org/stack',
        publisher: 'Example Docs',
      },
    ],
    ...overrides,
  };
}

test('request builder trims prompt and declares the current contract version', () => {
  assert.deepEqual(buildMentorRequest('  Explain queues.  '), {
    contractVersion: 1,
    prompt: 'Explain queues.',
  });
});

test('request builder rejects non-strings and empty prompts', () => {
  for (const value of [null, undefined, 7, {}, [], '', '   ']) {
    assert.throws(() => buildMentorRequest(value), MentorContractError);
  }
});

test('request builder measures Unicode code points and enforces prompt limit', () => {
  assert.equal(
    buildMentorRequest('😀'.repeat(MENTOR_PROMPT_MAX_CODE_POINTS)).prompt,
    '😀'.repeat(MENTOR_PROMPT_MAX_CODE_POINTS),
  );
  assert.throws(
    () => buildMentorRequest('😀'.repeat(MENTOR_PROMPT_MAX_CODE_POINTS + 1)),
    /4,000 characters or fewer/,
  );
});

test('response normalizer keeps only supported fields and validates citations', () => {
  assert.deepEqual(normalizeMentorResponse(validResponse({ unexpected: 'discarded' })), {
    contractVersion: 1,
    requestId: 'request-abc123',
    answer: 'A stack uses last-in, first-out ordering.',
    citations: [{
      title: 'Stack data structure',
      url: 'https://docs.example.org/stack',
      publisher: 'Example Docs',
    }],
  });
});

test('response normalizer permits an omitted citation list', () => {
  assert.deepEqual(normalizeMentorResponse(validResponse({ citations: undefined })).citations, []);
});

test('response normalizer rejects unknown versions and malformed or oversized responses', () => {
  for (const response of [
    null,
    [],
    validResponse({ contractVersion: 2 }),
    validResponse({ requestId: ' ' }),
    validResponse({ answer: ' ' }),
    validResponse({ answer: '😀'.repeat(MENTOR_ANSWER_MAX_CODE_POINTS + 1) }),
  ]) {
    assert.throws(() => normalizeMentorResponse(response), MentorContractError);
  }
});

test('response normalizer rejects insecure, credentialed, malformed, or incomplete citation data', () => {
  for (const citation of [
    { title: 'Insecure', url: 'http://example.org' },
    { title: 'Credentialed', url: 'https://user:pass@example.org/' },
    { title: '', url: 'https://example.org' },
    { title: 'Malformed', url: 'not a URL' },
    { title: 'No source' },
  ]) {
    assert.throws(
      () => normalizeMentorResponse(validResponse({ citations: [citation] })),
      MentorContractError,
    );
  }
});

test('response normalizer rejects too many citations and overlong request IDs', () => {
  assert.throws(
    () => normalizeMentorResponse(validResponse({
      citations: Array.from({ length: MENTOR_MAX_CITATIONS + 1 }, () => ({
        title: 'Source',
        url: 'https://example.org',
      })),
    })),
    /too many or invalid citations/,
  );
  assert.throws(
    () => normalizeMentorResponse(validResponse({ requestId: 'x'.repeat(129) })),
    MentorContractError,
  );
});
