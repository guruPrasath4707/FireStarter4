export { default as careersService } from './services/careersService';
export * from './services/careersService';
export { CAREERS, CATEGORIES } from './data/careers.mock';
export * from './types';

import CareerExplorerPage from './pages/CareerExplorerPage';
import CareerDetailPage from './pages/CareerDetailPage';
export { CareerExplorerPage, CareerDetailPage };

export const FEATURE_KEY = 'careers';
export default { FEATURE_KEY, careersService, CareerExplorerPage, CareerDetailPage };
