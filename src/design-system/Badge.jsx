import React from 'react';
import { cn } from '../utils/cn';

const TONES = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  brand:   'bg-indigo-50 text-indigo-700 border-indigo-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger:  'bg-rose-50 text-rose-700 border-rose-200',
  violet:  'bg-violet-50 text-violet-700 border-violet-200',
  accent:  'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
};

export function Badge({ tone = 'default', className, children, icon: Icon }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONES[tone] || TONES.default,
        className,
      )}
    >
      {Icon ? <Icon size={12} className="shrink-0" /> : null}
      {children}
    </span>
  );
}

export default Badge;
