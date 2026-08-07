import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../design-system/Badge';
import { Button } from '../../../design-system/Button';
import { CATEGORIES } from '../data/careers.mock';

const GROWTH_TONES = {
  positive: 'success',
  steady: 'warning',
  slow: 'default',
};

const GROWTH_LABELS = {
  positive: 'Positive outlook',
  steady: 'Steady outlook',
  slow: 'Slow outlook',
};

export function CareerDetailHeader({ career, onAddToPath }) {
  const categoryLabel = labelForCategory(career.category);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/careers"
            className="text-xs text-slate-500 hover:text-slate-900"
          >
            ← Back to Career Explorer
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="brand">{categoryLabel}</Badge>
              <Badge tone={GROWTH_TONES[career.growthOutlook] || 'default'}>
                {GROWTH_LABELS[career.growthOutlook] || career.growthOutlook}
              </Badge>
              <Badge tone="default">Difficulty {career.difficulty}/5</Badge>
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              {career.title}
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              {career.shortDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" as={Link} to="/careers">
              Browse more
            </Button>
            <Button variant="brand" onClick={onAddToPath}>
              Add to my path
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Match score" value={`${career.matchScore ?? 0}%`} />
          <Stat label="Entry salary" value={career.salaryRange?.entry || '—'} />
          <Stat label="Mid salary" value={career.salaryRange?.mid || '—'} />
          <Stat label="Senior salary" value={career.salaryRange?.senior || '—'} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm sm:text-base font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function labelForCategory(value) {
  const c = CATEGORIES.find((x) => x.value === value);
  return c ? c.label : value;
}

export default CareerDetailHeader;
