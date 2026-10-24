export const CAREER_INTEREST_ASSESSMENT_ID = 'career-interest-checkin-v1';
export const CAREER_INTEREST_ASSESSMENT_TITLE = 'Career interest check-in';

export const INTEREST_TAGS = [
  { id: 'tech', label: 'Technology' },
  { id: 'math', label: 'Mathematics & logic' },
  { id: 'science', label: 'Science & research' },
  { id: 'health', label: 'Health & wellbeing' },
  { id: 'business', label: 'Business & planning' },
  { id: 'arts', label: 'Arts & design' },
  { id: 'making', label: 'Building & making' },
  { id: 'languages', label: 'Communication & languages' },
];

export const CAREER_INTEREST_QUESTIONS = [
  {
    id: 'project',
    prompt: 'Which project would you most like to try first?',
    context: 'Pick the activity that sounds most interesting right now.',
    choices: [
      { id: 'build-tool', label: 'Build a small digital tool', detail: 'Make something people can use.', tag: 'tech' },
      { id: 'analyze-patterns', label: 'Find patterns in a dataset', detail: 'Use numbers to explain what is happening.', tag: 'math' },
      { id: 'study-nature', label: 'Investigate a question about nature', detail: 'Gather evidence and test an idea.', tag: 'science' },
      { id: 'design-visual', label: 'Design a visual story', detail: 'Communicate an idea through images.', tag: 'arts' },
    ],
  },
  {
    id: 'team-role',
    prompt: 'What role would you naturally like to try in a team?',
    context: 'There is no preferred or more valuable answer.',
    choices: [
      { id: 'prototype', label: 'Build and test a prototype', detail: 'Turn a concept into something tangible.', tag: 'making' },
      { id: 'support', label: 'Help someone solve a wellbeing challenge', detail: 'Listen carefully and support practical next steps.', tag: 'health' },
      { id: 'plan', label: 'Organize the plan and priorities', detail: 'Coordinate work, trade-offs, and resources.', tag: 'business' },
      { id: 'explain', label: 'Explain the idea to different audiences', detail: 'Choose clear words and adapt the message.', tag: 'languages' },
    ],
  },
  {
    id: 'puzzle',
    prompt: 'Which kind of problem would you enjoy untangling?',
    context: 'Choose the problem you would be curious to spend time on.',
    choices: [
      { id: 'debug', label: 'Track down why a program fails', detail: 'Form hypotheses and inspect the code.', tag: 'tech' },
      { id: 'compare', label: 'Compare results and find a pattern', detail: 'Check the numbers before drawing a conclusion.', tag: 'math' },
      { id: 'experiment', label: 'Design a fair experiment', detail: 'Change one thing and observe the results.', tag: 'science' },
      { id: 'understand', label: 'Understand what a person needs', detail: 'Ask questions and listen without assumptions.', tag: 'health' },
    ],
  },
  {
    id: 'free-time',
    prompt: 'Which optional activity would you choose?',
    context: 'Imagine the time and materials are available.',
    choices: [
      { id: 'prototype-object', label: 'Make a working object or model', detail: 'Learn by constructing and improving it.', tag: 'making' },
      { id: 'create-art', label: 'Create a poster, illustration, or interface', detail: 'Experiment with composition and visual choices.', tag: 'arts' },
      { id: 'write-guide', label: 'Write a guide or explain a topic', detail: 'Help another person understand something.', tag: 'languages' },
      { id: 'organize-event', label: 'Plan a small event or project', detail: 'Set priorities, schedule, and responsibilities.', tag: 'business' },
    ],
  },
  {
    id: 'impact',
    prompt: 'What kind of impact would feel most satisfying?',
    context: 'This is about your present preference, not a prediction of future success.',
    choices: [
      { id: 'useful-software', label: 'A tool that removes repetitive work', detail: 'Improve how people get things done.', tag: 'tech' },
      { id: 'community-plan', label: 'A clear plan that helps a group act', detail: 'Coordinate a project toward a shared goal.', tag: 'business' },
      { id: 'evidence', label: 'Reliable evidence about a real-world question', detail: 'Help people understand what is supported by data.', tag: 'science' },
      { id: 'health-support', label: 'Practical support for health or wellbeing', detail: 'Help people navigate a challenge with care.', tag: 'health' },
    ],
  },
  {
    id: 'challenge',
    prompt: 'Which challenge would you be keen to learn about?',
    context: 'Think about what you would explore, even if you are new to it.',
    choices: [
      { id: 'bridge', label: 'How to design and test a physical structure', detail: 'Explore materials, constraints, and making.', tag: 'making' },
      { id: 'trends', label: 'How to model trends and uncertainty', detail: 'Reason about evidence, quantities, and patterns.', tag: 'math' },
      { id: 'story', label: 'How to explain a complex idea clearly', detail: 'Structure a message for a particular audience.', tag: 'languages' },
      { id: 'visual-system', label: 'How to make an interface easier to use', detail: 'Test layouts and improve clarity.', tag: 'arts' },
    ],
  },
  {
    id: 'practice',
    prompt: 'Which kind of practice would keep you curious?',
    context: 'Choose the one you would be most willing to repeat and improve.',
    choices: [
      { id: 'coding', label: 'Write code, run it, and refine it', detail: 'Iterate until the behavior is reliable.', tag: 'tech' },
      { id: 'data-check', label: 'Check whether a conclusion follows from data', detail: 'Look for assumptions and alternative explanations.', tag: 'math' },
      { id: 'research-notes', label: 'Keep notes on an experiment or observation', detail: 'Record what happened and what remains unknown.', tag: 'science' },
      { id: 'people-interview', label: 'Talk with people and summarize what you learn', detail: 'Notice different perspectives and communicate them.', tag: 'languages' },
    ],
  },
  {
    id: 'next-step',
    prompt: 'For your next learning project, which starting point appeals most?',
    context: 'Your answer can change as you discover new things.',
    choices: [
      { id: 'health-topic', label: 'Explore a topic about health and people', detail: 'Start with wellbeing, evidence, or care.', tag: 'health' },
      { id: 'design-brief', label: 'Create a design from a short brief', detail: 'Explore alternatives and get feedback.', tag: 'arts' },
      { id: 'project-budget', label: 'Turn an idea into an achievable project plan', detail: 'Think about scope, time, and resources.', tag: 'business' },
      { id: 'build-device', label: 'Build or repair something practical', detail: 'Try tools and learn through iteration.', tag: 'making' },
    ],
  },
];

const CHOICE_BY_QUESTION = new Map(
  CAREER_INTEREST_QUESTIONS.map((question) => [
    question.id,
    new Map(question.choices.map((choice) => [choice.id, choice])),
  ]),
);

export function scoreCareerInterestCheckin(answers, completedAt = new Date().toISOString()) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    throw new Error('Answer every question before viewing your check-in.');
  }

  const missing = CAREER_INTEREST_QUESTIONS.filter((question) => {
    const choiceId = answers[question.id];
    return typeof choiceId !== 'string' || !CHOICE_BY_QUESTION.get(question.id).has(choiceId);
  });

  if (missing.length > 0) {
    throw new Error(`Answer all ${CAREER_INTEREST_QUESTIONS.length} questions to calculate your check-in.`);
  }

  const scores = INTEREST_TAGS.map((tag, order) => ({
    ...tag,
    score: 0,
    order,
  }));

  const scoreById = new Map(scores.map((tag) => [tag.id, tag]));
  for (const question of CAREER_INTEREST_QUESTIONS) {
    const selected = CHOICE_BY_QUESTION.get(question.id).get(answers[question.id]);
    scoreById.get(selected.tag).score += 1;
  }

  const ranked = scores
    .sort((a, b) => (b.score - a.score) || (a.order - b.order))
    .map(({ order, ...tag }) => tag);

  return {
    assessmentId: CAREER_INTEREST_ASSESSMENT_ID,
    title: CAREER_INTEREST_ASSESSMENT_TITLE,
    completedAt,
    answerCount: CAREER_INTEREST_QUESTIONS.length,
    answers: Object.fromEntries(
      CAREER_INTEREST_QUESTIONS.map((question) => [question.id, answers[question.id]]),
    ),
    scores: ranked,
    topInterests: ranked.filter((tag) => tag.score > 0).slice(0, 3),
  };
}
