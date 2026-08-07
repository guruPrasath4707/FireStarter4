import { CAREERS, CATEGORIES } from '../data/careers.mock';
import type {
  Career,
  CareerCategory,
  CareerListParams,
  CareerListResult,
} from '../types';

const USE_MOCK = true; // flip when backend is live

function applyFilters(
  items: Career[],
  params: CareerListParams = {},
): Career[] {
  const { query, category, interests } = params;
  const q = (query || '').trim().toLowerCase();

  return items.filter((c) => {
    if (category && category !== 'all' && c.category !== category) return false;

    if (q) {
      const haystack = [
        c.title,
        c.shortDescription,
        c.description,
        ...c.skills.map((s) => s.name),
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (interests && interests.length > 0) {
      const overlap = c.interests.some((i) => interests.includes(i));
      if (!overlap) return false;
    }

    return true;
  });
}

async function fetchList(
  params: CareerListParams = {},
): Promise<CareerListResult> {
  if (USE_MOCK) {
    const items = applyFilters(CAREERS, params);
    const categories: CareerCategory[] = Array.from(
      new Set(items.map((c) => c.category)),
    );
    return { items, total: items.length, categories };
  }
  // Future backend path — same shape:
  // const { apiClient } = await import('../../../services/apiClient');
  // const qs = {
  //   query: params.query,
  //   category: params.category && params.category !== 'all' ? params.category : undefined,
  //   interests: params.interests?.join(','),
  // };
  // const data = await apiClient.get('/careers', { query: qs });
  // return data;
  return { items: [], total: 0, categories: [] };
}

async function fetchById(id: string): Promise<Career | null> {
  if (USE_MOCK) {
    return CAREERS.find((c) => c.id === id || c.slug === id) ?? null;
  }
  return null;
}

export const careersService = {
  list: fetchList,
  getById: fetchById,
  categories: async () => CATEGORIES.map((c) => c.value),
};

export default careersService;
