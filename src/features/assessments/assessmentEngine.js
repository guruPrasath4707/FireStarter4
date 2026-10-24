export const ASSESSMENT_VERSION = 'foundations-checkin-v1';

export const ASSESSMENT_DOMAINS = Object.freeze([
  Object.freeze({ id: 'programming', label: 'Programming basics', resourceId: 'python-official-tutorial' }),
  Object.freeze({ id: 'web-development', label: 'Web development', resourceId: 'mdn-first-website' }),
  Object.freeze({ id: 'computing-foundations', label: 'Computing foundations', resourceId: 'khan-computing' }),
  Object.freeze({ id: 'developer-workflow', label: 'Developer workflow', resourceId: 'github-skills' }),
]);

const QUESTIONS = [
  {
    id: 'python-text-type',
    domain: 'programming',
    prompt: 'In Python, which built-in type is commonly used to represent text?',
    choices: [
      { id: 'str', label: 'str' },
      { id: 'int', label: 'int' },
      { id: 'list', label: 'list' },
      { id: 'bool', label: 'bool' },
    ],
    correctChoiceId: 'str',
    explanation: 'Python uses str for text values. int represents integers, list stores a sequence of items, and bool represents True or False.',
  },
  {
    id: 'python-len',
    domain: 'programming',
    prompt: 'What does len([2, 4, 6]) return in Python?',
    choices: [
      { id: 'two', label: '2' },
      { id: 'three', label: '3' },
      { id: 'six', label: '6' },
      { id: 'error', label: 'It always raises an error' },
    ],
    correctChoiceId: 'three',
    explanation: 'len returns the number of items in the list. There are three items, so the result is 3.',
  },
  {
    id: 'html-link',
    domain: 'web-development',
    prompt: 'Which HTML element is used to create a hyperlink?',
    choices: [
      { id: 'a', label: '<a>' },
      { id: 'p', label: '<p>' },
      { id: 'img', label: '<img>' },
      { id: 'section', label: '<section>' },
    ],
    correctChoiceId: 'a',
    explanation: 'The anchor element (<a>) creates a link when it has an href attribute. The other elements serve different purposes.',
  },
  {
    id: 'css-text-colour',
    domain: 'web-development',
    prompt: 'Which CSS property sets the foreground colour of text?',
    choices: [
      { id: 'font-style', label: 'font-style' },
      { id: 'color', label: 'color' },
      { id: 'text-align', label: 'text-align' },
      { id: 'background-image', label: 'background-image' },
    ],
    correctChoiceId: 'color',
    explanation: 'The color property sets text colour. text-align controls alignment, font-style controls styles such as italic, and background-image sets a background image.',
  },
  {
    id: 'https-purpose',
    domain: 'computing-foundations',
    prompt: 'In normal browser use, what does HTTPS add to the connection?',
    choices: [
      { id: 'secure-transport', label: 'Encryption and integrity protection in transit, with server authentication' },
      { id: 'truth', label: 'A guarantee that every statement on the website is true' },
      { id: 'virus-free', label: 'A guarantee that the website contains no malware' },
      { id: 'speed', label: 'A guarantee that the website will always load faster' },
    ],
    correctChoiceId: 'secure-transport',
    explanation: 'HTTPS protects the connection in transit and authenticates the server. It does not prove that the website’s claims are true or that every page is safe.',
  },
  {
    id: 'algorithm-definition',
    domain: 'computing-foundations',
    prompt: 'Which option best describes an algorithm?',
    choices: [
      { id: 'steps', label: 'A defined sequence of steps for solving a problem or performing a task' },
      { id: 'language', label: 'A specific programming language' },
      { id: 'server', label: 'A computer that hosts a website' },
      { id: 'cable', label: 'A physical network cable' },
    ],
    correctChoiceId: 'steps',
    explanation: 'An algorithm describes steps for solving a problem or carrying out a task; it can be expressed in plain language, diagrams, or code.',
  },
  {
    id: 'git-commit',
    domain: 'developer-workflow',
    prompt: 'Which Git command records the staged changes in a new commit?',
    choices: [
      { id: 'git-add', label: 'git add' },
      { id: 'git-commit', label: 'git commit' },
      { id: 'git-push', label: 'git push' },
      { id: 'git-status', label: 'git status' },
    ],
    correctChoiceId: 'git-commit',
    explanation: 'git commit creates a commit from the staged snapshot. git add stages changes, git status reports working-tree state, and git push sends local commits to a remote.',
  },
  {
    id: 'traceback-first-step',
    domain: 'developer-workflow',
    prompt: 'A program fails and prints an error plus a stack trace. What is a useful first step?',
    choices: [
      { id: 'read-trace', label: 'Read the error message and trace to find where the failure originated' },
      { id: 'delete-lock', label: 'Delete the dependency lockfile immediately' },
      { id: 'ignore', label: 'Ignore it and deploy again without changes' },
      { id: 'upgrade-all', label: 'Upgrade every dependency before investigating' },
    ],
    correctChoiceId: 'read-trace',
    explanation: 'The error and trace provide evidence about the failing operation and call path. Start by understanding that evidence before changing dependencies or code.',
  },
].map((question) => Object.freeze({
  ...question,
  choices: Object.freeze(question.choices.map((choice) => Object.freeze(choice))),
}));

export const ASSESSMENT_QUESTIONS = Object.freeze(QUESTIONS);

const DOMAIN_TOTALS = Object.freeze(
  Object.fromEntries(
    ASSESSMENT_DOMAINS.map((domain) => [
      domain.id,
      ASSESSMENT_QUESTIONS.filter((question) => question.domain === domain.id).length,
    ]),
  ),
);

function chooseRecommendations(categoryScores) {
  const ranked = ASSESSMENT_DOMAINS
    .map((domain, index) => ({
      ...domain,
      index,
      score: categoryScores[domain.id].score,
      total: categoryScores[domain.id].total,
    }))
    .sort((a, b) =>
      (a.score / a.total) - (b.score / b.total) || a.index - b.index,
    );

  const needsPractice = ranked.filter((domain) => domain.score < domain.total);
  const chosen = (needsPractice.length > 0 ? needsPractice : ranked).slice(0, 2);

  return {
    recommendedResourceIds: chosen.map((domain) => domain.resourceId),
    recommendationMode: needsPractice.length > 0 ? 'practice' : 'reinforcement',
  };
}

/**
 * Scores the same fixed question set for every learner. This check-in is not
 * adaptive and is not a validated measure of general ability or proficiency.
 */
export function scoreAssessment(answers = {}) {
  const submitted = answers && typeof answers === 'object' && !Array.isArray(answers)
    ? answers
    : {};
  const categoryScores = Object.fromEntries(
    ASSESSMENT_DOMAINS.map((domain) => [
      domain.id,
      {
        label: domain.label,
        score: 0,
        total: DOMAIN_TOTALS[domain.id],
        resourceId: domain.resourceId,
      },
    ]),
  );

  const unansweredIds = [];
  let answeredCount = 0;
  let score = 0;

  for (const question of ASSESSMENT_QUESTIONS) {
    const choiceId = submitted[question.id];
    const validChoice = question.choices.some((choice) => choice.id === choiceId);
    if (!validChoice) {
      unansweredIds.push(question.id);
      continue;
    }

    answeredCount += 1;
    if (choiceId === question.correctChoiceId) {
      score += 1;
      categoryScores[question.domain].score += 1;
    }
  }

  const recommendation = chooseRecommendations(categoryScores);
  return {
    version: ASSESSMENT_VERSION,
    answeredCount,
    questionCount: ASSESSMENT_QUESTIONS.length,
    isComplete: unansweredIds.length === 0,
    unansweredIds,
    score,
    total: ASSESSMENT_QUESTIONS.length,
    categoryScores,
    ...recommendation,
  };
}

/** Build the minimal profile record after every question has been answered. */
export function createAssessmentRecord(scored, completedAt = new Date().toISOString()) {
  if (!scored || scored.version !== ASSESSMENT_VERSION || scored.isComplete !== true) {
    throw new Error('Answer every question before saving an assessment result.');
  }

  const timestamp = new Date(completedAt);
  if (!Number.isFinite(timestamp.getTime())) {
    throw new Error('A valid completion timestamp is required.');
  }

  const record = {
    version: ASSESSMENT_VERSION,
    completedAt: timestamp.toISOString(),
    score: scored.score,
    total: scored.total,
    categoryScores: scored.categoryScores,
  };
  return normalizeAssessmentRecord(record);
}

/** Validate persisted profile data and derive recommendations from the stored scores. */
export function normalizeAssessmentRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (value.version !== ASSESSMENT_VERSION) return null;
  if (value.total !== ASSESSMENT_QUESTIONS.length) return null;
  if (!Number.isInteger(value.score) || value.score < 0 || value.score > value.total) return null;

  const timestamp = new Date(value.completedAt);
  if (!Number.isFinite(timestamp.getTime())) return null;
  if (!value.categoryScores || typeof value.categoryScores !== 'object' || Array.isArray(value.categoryScores)) {
    return null;
  }

  const categoryScores = {};
  let categoryScoreTotal = 0;
  for (const domain of ASSESSMENT_DOMAINS) {
    const saved = value.categoryScores[domain.id];
    const expectedTotal = DOMAIN_TOTALS[domain.id];
    if (
      !saved ||
      !Number.isInteger(saved.score) ||
      saved.score < 0 ||
      saved.score > expectedTotal ||
      saved.total !== expectedTotal
    ) {
      return null;
    }

    categoryScores[domain.id] = {
      label: domain.label,
      score: saved.score,
      total: expectedTotal,
      resourceId: domain.resourceId,
    };
    categoryScoreTotal += saved.score;
  }

  if (categoryScoreTotal !== value.score) return null;

  const recommendations = chooseRecommendations(categoryScores);
  return {
    version: ASSESSMENT_VERSION,
    completedAt: timestamp.toISOString(),
    score: value.score,
    total: ASSESSMENT_QUESTIONS.length,
    categoryScores,
    ...recommendations,
  };
}

export default {
  ASSESSMENT_VERSION,
  ASSESSMENT_DOMAINS,
  ASSESSMENT_QUESTIONS,
  scoreAssessment,
  createAssessmentRecord,
  normalizeAssessmentRecord,
};
