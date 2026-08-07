import React from 'react';
import { cn } from '../utils/cn';

export function Divider({ className, label }) {
  if (!label) {
    return <div className={cn('h-px w-full bg-slate-200', className)} />;
  }
  return (
    <div className={cn('flex items-center gap-3 text-xs text-slate-400', className)}>
      <div className="h-px flex-1 bg-slate-200" />
      <span className="uppercase tracking-wide">{label}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

export default Divider;
