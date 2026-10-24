import {
  formatInterestLabel,
  getInterestOverlap,
} from '../../../utils/interestMatching';

export function getCareerInterestFit(careerInterests = [], selectedInterests = []) {
  return getInterestOverlap(careerInterests, selectedInterests);
}

export { formatInterestLabel };

