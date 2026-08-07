import React from 'react';
import { cn } from '../../utils/cn';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center',
        className,
      )}
    >
      {Icon ? (
        <div className="mx-auto h-10 w-10 rounded-xl bg-[linear-gradient(135deg,#eef2ff,#fdf4ff)] border border-slate-200 text-violet-700 grid place-items-center">
          <Icon size={18} />
        </div>
      ) : null}
      {title ? <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3> : null}
      {description ? (
        <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
