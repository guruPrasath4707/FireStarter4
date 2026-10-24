import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '../../../design-system/Card';
import { Badge } from '../../../design-system/Badge';
import { CATEGORIES } from '../data/careers.mock';
import { formatInterestLabel, getCareerInterestFit } from '../services/careerFit';

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

const DIFFICULTY_LABELS = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Moderate',
  4: 'Challenging',
  5: 'Hard',
};

export function CareerCard({ career, interests = [], saved = false }) {
  const categoryLabel = labelForCategory(career.category);
  const skills = (career.skills || []).slice(0, 3);
  const fit = getCareerInterestFit(career.interests || [], interests);

  return (
    <Link
      to={`/careers/${career.slug || career.id}`}
      className="group block h-full"
      aria-label={`Open ${career.title}`}
    >
      <Card className="h-full transition-all hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:-translate-y-0.5">
        <CardBody className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="brand">{categoryLabel}</Badge>
                {saved ? <Badge tone="success">Saved</Badge> : null}
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900 leading-snug">
                {career.title}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-xl bg-[linear-gradient(135deg,#eef2ff,#fdf4ff)] border border-slate-200 text-violet-700 grid place-items-center shrink-0">
              <Briefcase size={16} />
            </div>
          </div>

          <p className="text-sm text-slate-600 line-clamp-3">
            {career.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <Badge key={s.name} tone="default">{s.name}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <Stat icon={TrendingUp} label="Catalogue outlook">
              <Badge tone={GROWTH_TONES[career.growthOutlook] || 'default'}>
                {GROWTH_LABELS[career.growthOutlook] || 'Illustrative'}
              </Badge>
            </Stat>
            <Stat label="Difficulty (demo)">
              <span className="text-sm font-medium text-slate-900">
                {DIFFICULTY_LABELS[career.difficulty] || career.difficulty}
              </span>
            </Stat>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              Interest overlap
            </div>
            {fit.hasSelectedInterests ? (
              <>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {fit.matchCount} of {fit.selectedCount} selected interests
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {fit.matchCount > 0
                    ? `Aligned tags: ${fit.matchingInterests.map(formatInterestLabel).join(', ')}`
                    : 'No direct overlap with your selected interests.'}
                </p>
              </>
            ) : (
              <p className="mt-1 text-xs text-slate-600">
                Add interests to your profile to compare tags.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-sm">
            <span className="text-slate-500">Explore</span>
            <span className="inline-flex items-center gap-1 font-medium text-slate-900 group-hover:text-violet-700 transition-colors">
              Open
              <ArrowRight size={14} />
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

function Stat({ icon: Icon, label, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 flex items-center gap-1.5">
        {Icon ? <Icon size={12} /> : null}
        {label}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function labelForCategory(value) {
  const c = CATEGORIES.find((x) => x.value === value);
  return c ? c.label : value;
}

export default CareerCard;
