import React, { useId } from 'react';
import { cn } from '../utils/cn';

export function Select({ options = [], value, onChange, className, ...rest }) {
  const id = useId();
  const normalized = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o,
  );
  return (
    <select
      id={id}
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value, e)}
      className={cn(
        'w-full h-11 px-4 rounded-xl border border-slate-200 bg-white',
        'text-sm text-slate-900 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400',
        className,
      )}
      {...rest}
    >
      {normalized.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
