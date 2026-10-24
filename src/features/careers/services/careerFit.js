import {
  formatInterestLabel,
  getInterestOverlap,
} from '../../../utils/interestMatching.js';

export function getCareerInterestFit(careerInterests = [], selectedInterests = []) {
  return getInterestOverlap(careerInterests, selectedInterests);
}

export { formatInterestLabel };

