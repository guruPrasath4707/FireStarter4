export type CareerCategory =
  | 'technology'
  | 'science'
  | 'business'
  | 'arts'
  | 'health'
  | 'engineering';

export type GrowthOutlook = 'positive' | 'steady' | 'slow';

export type SalaryRange = {
  entry: string;
  mid: string;
  senior: string;
  currency?: string;
};

export type RoadmapStage = {
  stage: string;
  durationMonths: number;
  items: string[];
};

export type CareerSkill = {
  name: string;
  weight: number; // 0–100
};

export type Career = {
  id: string;
  slug: string;
  title: string;
  category: CareerCategory;
  shortDescription: string;
  description: string;
  salaryRange: SalaryRange;
  growthOutlook: GrowthOutlook;
  difficulty: 1 | 2 | 3 | 4 | 5;
  matchScore?: number; // 0–100
  interests: string[];
  skills: CareerSkill[];
  roadmap: RoadmapStage[];
  relatedCareers: string[];
};

export type CareerListParams = {
  query?: string;
  category?: CareerCategory | 'all';
  interests?: string[];
};

export type CareerListResult = {
  items: Career[];
  total: number;
  categories: CareerCategory[];
};
