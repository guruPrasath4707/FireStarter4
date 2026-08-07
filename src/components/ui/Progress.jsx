import React from 'react';

export function Progress({ value = 0, className = '' }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      className={'w-full h-2 rounded-full bg-slate-100 overflow-hidden ' + className}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-slate-900 transition-all"
        style={{ width: pct + '%' }}
      />
    </div>
  );
}

export default Progress;
