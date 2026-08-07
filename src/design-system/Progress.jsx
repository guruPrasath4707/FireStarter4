import React from 'react';
import { cn } from '../utils/cn';

export function Progress({ value = 0, className, label }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="flex items-center justify-between mb-1.5 text-xs text-slate-600">
          <span>{label}</span>
          <span className="font-medium text-slate-700">{Math.round(pct)}%</span>
        </div>
      ) : null}
      <div
        className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-[linear-gradient(90deg,#4f46e5,#7c3aed,#d946ef)] transition-all"
          style={{ width: pct + '%' }}
        />
      </div>
    </div>
  );
}

export default Progress;
