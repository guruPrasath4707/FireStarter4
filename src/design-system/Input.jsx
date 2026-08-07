import React, { useId } from 'react';
import { cn } from '../utils/cn';

export function Input({ className, type = 'text', ...rest }) {
  return (
    <input
      type={type}
      className={cn(
        'w-full h-11 px-4 rounded-xl border border-slate-200 bg-white',
        'text-sm text-slate-900 placeholder:text-slate-400',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400',
        'disabled:bg-slate-50 disabled:text-slate-400',
        className,
      )}
      {...rest}
    />
  );
}

export function Textarea({ className, ...rest }) {
  return (
    <textarea
      className={cn(
        'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white',
        'text-sm text-slate-900 placeholder:text-slate-400',
        'transition-colors min-h-[96px] resize-y',
        'focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400',
        className,
      )}
      {...rest}
    />
  );
}

export function Label({ htmlFor, className, children, required }) {
  const fallbackId = useId();
  const forId = htmlFor || fallbackId;
  return (
    <label
      htmlFor={forId}
      className={cn('text-sm font-medium text-slate-700', className)}
    >
      {children}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </label>
  );
}

export function Field({ label, hint, error, required, children, htmlFor, className }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? <Label htmlFor={htmlFor} required={required}>{label}</Label> : null}
      {children}
      {error ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default Input;
