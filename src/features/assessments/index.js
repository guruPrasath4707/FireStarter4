import {
  ASSESSMENT_DOMAINS,
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_VERSION,
  createAssessmentRecord,
  normalizeAssessmentRecord,
  scoreAssessment,
} from './assessmentEngine.js';

export const FEATURE_KEY = 'assessments';

export {
  ASSESSMENT_DOMAINS,
  ASSESSMENT_QUESTIONS,
  ASSESSMENT_VERSION,
  createAssessmentRecord,
  normalizeAssessmentRecord,
  scoreAssessment,
};

export const assessmentsService = {
  getQuestions: () => ASSESSMENT_QUESTIONS,
  score: scoreAssessment,
  createResult: createAssessmentRecord,
  normalizeResult: normalizeAssessmentRecord,
};

export default { FEATURE_KEY, assessmentsService };
