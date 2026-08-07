import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../design-system/Input';
import { Button } from '../../../design-system/Button';
import { CATEGORIES } from '../data/careers.mock';
import { cn } from '../../../utils/cn';

const ALL = 'all';

export function CareerFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  total,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 h-11">
        <Search size={16} className="text-slate-400 shrink-0" />
        <Input
          aria-label="Search careers"
          placeholder="Search careers, skills, descriptions…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="h-11 border-0 px-0 focus:ring-0 focus:border-0 shadow-none bg-transparent"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip
          active={category === ALL}
          onClick={() => onCategoryChange(ALL)}
        >
          All
        </Chip>
        {CATEGORIES.map((c) => (
          <Chip
            key={c.value}
            active={category === c.value}
            onClick={() => onCategoryChange(c.value)}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      {typeof total === 'number' ? (
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium text-slate-700">{total}</span> career{total === 1 ? '' : 's'}
          {category && category !== ALL ? (
            <> in <span className="font-medium text-slate-700">{labelFor(category)}</span></>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <Button
      variant={active ? 'primary' : 'outline'}
      size="sm"
      onClick={onClick}
      className={cn('rounded-full', active && 'shadow-sm')}
    >
      {children}
    </Button>
  );
}

function labelFor(value) {
  const c = CATEGORIES.find((x) => x.value === value);
  return c ? c.label : value;
}

export default CareerFilters;
