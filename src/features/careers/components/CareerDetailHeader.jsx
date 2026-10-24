import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Badge } from '../../../design-system/Badge';
import { Button } from '../../../design-system/Button';
import { CATEGORIES } from '../data/careers.mock';
import { formatInterestLabel } from '../services/careerFit';

const GROWTH_TONES = {
  positive: 'success',
  steady: 'warning',
  slow: 'default',
};

const GROWTH_LABELS = {
  positive: 'Demo: positive outlook',
  steady: 'Demo: steady outlook',
  slow: 'Demo: slow outlook',
};

export function CareerDetailHeader({
  career,
  fit,
  isSaved = false,
  savingToPath = false,
  onToggleSaved,
}) {
  const categoryLabel = labelForCategory(career.category);
  const interestOverlap = fit?.hasSelectedInterests
    ? `${fit.matchCount} of ${fit.selectedCount}`
    : 'Not set';

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
                {GROWTH_LABELS[career.growthOutlook] || 'Illustrative outlook'}
              </Badge>
              <Badge tone="default">Difficulty {career.difficulty}/5 (demo)</Badge>
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
            <Button
              variant={isSaved ? 'secondary' : 'brand'}
              onClick={onToggleSaved}
              disabled={savingToPath}
              aria-pressed={isSaved}
            >
              {savingToPath ? (
                'Updating…'
              ) : isSaved ? (
                <><BookmarkCheck size={15} /> Remove from my path</>
              ) : (
                <><Bookmark size={15} /> Add to my path</>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Interest overlap" value={interestOverlap} />
          <Stat label="Entry salary (demo)" value={career.salaryRange?.entry || '—'} />
          <Stat label="Mid salary (demo)" value={career.salaryRange?.mid || '—'} />
          <Stat label="Senior salary (demo)" value={career.salaryRange?.senior || '—'} />
        </div>
        <p className="text-xs leading-relaxed text-slate-500">
          Catalogue content is illustrative. Salary ranges, outlook labels, difficulty and skill weights have not been verified against dated labour-market sources.
          {fit?.matchingInterests?.length ? ` Tags overlapping your profile: ${fit.matchingInterests.map(formatInterestLabel).join(', ')}.` : ''}
        </p>
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
  const category = CATEGORIES.find((item) => item.value === value);
  return category ? category.label : value;
}

export default CareerDetailHeader;
