# Assessments

The current assessment is a short, fixed foundations check-in, not an adaptive test or a validated measure of general ability.

## Behavior

- Eight multiple-choice questions are presented to every learner in the same order.
- Two questions cover each of four domains: programming basics, web development, computing foundations, and developer workflow.
- The score is deterministic: one point per correct answer, with a transparent two-question breakdown per domain.
- The explanation for each correct answer is kept with its question.
- Suggested next resources are selected from the lowest-scoring domain(s); ties use the fixed domain order. A perfect score shows optional reinforcement resources instead.
- Only the latest result (version, completion timestamp, overall score, topic scores, and recommendation IDs) is saved on the signed-in user's Firestore profile. Raw answer selections are not persisted.
- Stored result records are validated and normalized before display. Unknown versions and inconsistent scores are rejected.

## Limitations

The quiz has only eight basic questions and has not been psychometrically validated. Its results should be treated as one practice signal, not a measure of intelligence, mastery, eligibility, or a basis for high-stakes decisions. It has no timer and does not adapt question difficulty. No backend service is required or called by this feature.

## Tests

Run \`npm test\` for coverage of fixed question count, score calculation, incomplete and invalid answers, topic score consistency, deterministic recommendations, record normalization, and the Learning Hub resource IDs used by suggestions.
