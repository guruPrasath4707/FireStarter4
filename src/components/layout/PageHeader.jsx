import React from 'react';
import { Button } from '../../design-system/Button';

export function PageHeader({ title, subtitle, actions, eyebrow }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        {eyebrow ? (
          <div className="text-xs uppercase tracking-wide text-violet-600 font-medium mb-1">{eyebrow}</div>
        ) : null}
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Section({ title, subtitle, action, children, className }) {
  return (
    <section className={className}>
      {(title || action) ? (
        <div className="flex items-end justify-between mb-3">
          <div>
            {title ? <h2 className="text-base font-semibold text-slate-900">{title}</h2> : null}
            {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint, icon: Icon, tone = 'default' }) {
  const toneRing = {
    default: 'border-slate-200',
    brand:   'border-indigo-200',
    success: 'border-emerald-200',
    warning: 'border-amber-200',
    violet:  'border-violet-200',
  }[tone] || 'border-slate-200';
  return (
    <div className={`rounded-2xl border ${toneRing} bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]`}>
      <div className="flex items-start justify-between">
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        {Icon ? <Icon size={16} className="text-slate-400" /> : null}
      </div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </div>
  );
}

export default PageHeader;
