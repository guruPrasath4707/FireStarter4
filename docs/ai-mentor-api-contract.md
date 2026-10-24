# AI Mentor API contract (proposal v1)

**Status:** contract only. No server, model provider, or /v1/mentor/ask endpoint is implemented or deployed in this repository. The current AI Mentor page remains a placeholder. This document is the acceptance contract for a later backend implementation; it is not evidence that AI requests work today.

## 1. Design decisions

- **Server-side generation only.** Provider SDKs and provider API keys belong in a backend runtime or secret manager. Never add provider secrets to VITE_* variables or browser bundles.
- **Firebase identity is the trust boundary.** The web app sends a Firebase ID token through the Authorization: Bearer header. The server verifies its signature, issuer, audience, expiry, and revocation policy with the Firebase Admin SDK. It derives the user ID from the verified token; it never trusts a client-supplied UID.
- **Stateless v1.** A request contains one prompt only. Do not silently append the student's profile, email, saved careers, assessment scores, or previous conversations. Future contextual features require a separate consented contract and explicit data minimization.
- **Plain text output.** The client renders the answer as text, never as HTML or executable Markdown. Model output is untrusted.
- **No duplicate-billing retries.** The client must not automatically retry the generation POST after a network failure or timeout. A learner may deliberately submit again. Server-side idempotency can be added before any automatic retry behavior.
- **Explain limits honestly.** The assistant may help explain learning topics and suggest next steps, but must not claim it is a human counselor, guarantee admissions/jobs/scholarships, or present a practice score as a validated assessment.

## 2. Endpoint

POST /v1/mentor/ask

Requires HTTPS in deployed environments and a valid Firebase bearer token. The server enforces authorization, rate limits, request limits, provider spend limits, and timeouts before contacting a model provider.

### Request JSON

    {
      "contractVersion": 1,
      "prompt": "Explain the difference between a stack and a queue."
    }

| Field | Rule |
| --- | --- |
| contractVersion | Required integer 1; reject unsupported versions with HTTP 400. |
| prompt | Required string, trim outer whitespace, reject empty content, maximum 4,000 Unicode code points. |
| Other fields | Reject unknown fields in v1; the client must not send UID, profile documents, roles, provider settings, or system instructions. |

The client-side prompt check is for user experience only. The backend repeats every validation; client checks are not a security boundary.

### Successful response JSON

    {
      "contractVersion": 1,
      "requestId": "opaque-server-generated-id",
      "answer": "A stack is last-in, first-out ...",
      "citations": [
        {
          "title": "Stacks and Queues",
          "url": "https://example.org/learning/stacks-queues",
          "publisher": "Example publisher"
        }
      ]
    }

| Field | Rule |
| --- | --- |
| contractVersion | Required integer 1. |
| requestId | Required opaque server-generated trace ID; do not include secrets or prompt text. |
| answer | Required non-empty plain-text string, maximum 12,000 Unicode code points. No HTML, scripts, or embedded executable markup. |
| citations | Optional array, maximum 8 entries. Each citation needs a non-empty title (max 200 characters) and absolute HTTPS URL without embedded credentials. Publisher is optional plain text (max 200 characters). |

Citations are optional because not every conceptual explanation needs an external source. When the answer makes a current, specific factual claim that requires sourcing, the backend should retrieve or otherwise verify a source before attaching it; the model must not invent citations. If a source cannot be verified, the answer should say so rather than emit a fabricated link.

### Error response JSON

The shape deliberately matches ApiError parsing in src/services/apiClient.ts:

    {
      "code": "rate_limited",
      "message": "The mentor is temporarily rate-limited. Try again later.",
      "requestId": "opaque-server-generated-id",
      "retryable": false
    }

Use a stable top-level code and safe, user-readable message; do not return provider exception messages, raw prompts, internal system prompts, stack traces, provider credentials, or upstream response bodies.

| HTTP | Example code | Meaning |
| --- | --- | --- |
| 400 | invalid_prompt | Prompt or contract version is invalid. |
| 401 | unauthenticated | Token is missing, invalid, expired, or revoked. |
| 403 | not_allowed | Account, region, or policy does not permit this operation. |
| 413 | request_too_large | Request exceeds the configured body/prompt limit. |
| 429 | rate_limited | Per-user/IP quota or spend policy was reached. |
| 502 | provider_unavailable | Upstream provider failed or returned an unusable response. |
| 503 | mentor_not_configured | Server-side provider configuration is unavailable. |
| 504 | generation_timeout | The generation deadline was exceeded. |

## 3. Security, privacy, and safety requirements

Before a model provider is connected, the backend must implement and test all of the following:

1. **Authentication and authorization:** verify Firebase ID tokens server-side, derive UID from the verified token, reject anonymous/unverified identities if product policy requires verified accounts, and never rely on React route guards for data authorization.
2. **Abuse and cost controls:** apply configurable per-UID and per-IP rate limits, prompt/response token caps, concurrency limits, generation deadline, and a total spend budget with a shut-off path. Do not retry billable POST requests automatically.
3. **Secrets:** use deployment secrets/secret-manager storage for the provider key; keep it out of source control, Firebase profile documents, client env variables, error messages, analytics, and logs. Rotate it if exposure is suspected.
4. **Data minimization:** do not log raw prompt or answer text by default; do not persist conversation content in Firestore in v1. Operational logs may include request ID, status, latency, model/version, and aggregate token/cost numbers, with retention and access controls documented before launch.
5. **Prompt and output safety:** treat prompt text and retrieved material as untrusted input; do not give the model tool access or permission to execute code, make purchases, send messages, or access user records. Validate output shape and link schemes; render text only.
6. **Student-appropriate guidance:** distinguish established facts from suggestions, encourage checking official course/provider pages for deadlines and eligibility, avoid high-stakes claims, and respond safely to self-harm, abuse, or crisis disclosures by encouraging immediate appropriate human/emergency support. Do not claim to replace a qualified professional.
7. **Operational failure behavior:** fail closed when auth/configuration/quota checks fail; use stable error codes; avoid leaking upstream detail; make timeout and provider failure visible without destroying draft user input.
8. **Deployment:** deploy the API behind HTTPS using a maintained server runtime (for example, a serverless function or managed container). Keep provider credentials exclusively in the server runtime. Restrict CORS to known app origins, configure server-side quotas, and use a staged test environment with no production credentials first.

## 4. Client integration rules

- mentorService.ask(prompt, { signal }) validates and trims input, sends the versioned request to /v1/mentor/ask, and normalizes the response.
- The API client adds the Firebase bearer token by default.
- Disable automatic retries for this POST (retries: 0) to avoid duplicate billable generations after uncertain network failures.
- Reject responses with an unknown contract version, blank/oversized answer, invalid request ID, or unsafe/malformed citation URL.
- Display answer as plain text. Treat citations as links only after schema validation.
- Preserve a student's draft when the request fails; never display a fake answer or pretend that a response was generated offline.

## 5. Acceptance gates for a future backend PR

A backend feature is not complete until tests cover:

- missing/expired/invalid Firebase token and user identity spoofing;
- blank, non-string, over-limit, and unsupported-version requests;
- request/IP quota, provider spend caps, body limit, timeout, and concurrency;
- provider timeout/error/malformed response and a server with no configured secret;
- no prompt/answer content written into logs or profile documents by default;
- valid response schema, invalid citation schemes, oversized answers, and stable error envelopes;
- prompt-injection attempts and student-safety edge cases;
- staging-only deployment, HTTPS, CORS, server secret configuration, and an operational cost shut-off.

This document defines an interface and deployment gate; it does not claim those server-side controls already exist.
