import React from 'react';

const tones = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  brand: 'bg-blue-50 text-blue-700 border-blue-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
};

export function Badge({ tone = 'default', className = '', children }) {
  return (
    <span
      className={
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ' +
        (tones[tone] || tones.default) +
        ' ' +
        className
      }
    >
      {children}
    </span>
  );
}

export default Badge;
