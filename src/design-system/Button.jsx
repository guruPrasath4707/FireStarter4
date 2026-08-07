import React from 'react';
import { cn } from '../utils/cn';

const VARIANTS = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 ' +
    'focus:ring-slate-900 shadow-sm',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 ' +
    'focus:ring-slate-300',
  outline:
    'bg-white text-slate-900 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 ' +
    'focus:ring-slate-300',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 ' +
    'focus:ring-slate-200',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 ' +
    'focus:ring-rose-500',
  brand:
    'text-white shadow-sm ' +
    'bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_45%,#d946ef_100%)] ' +
    'hover:opacity-95 focus:ring-violet-500',
  soft:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 ' +
    'focus:ring-slate-300',
};

const SIZES = {
  xs: 'h-8 px-3 text-xs',
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-10 w-10 p-0',
  iconSm: 'h-9 w-9 p-0',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className,
  as: Tag = 'button',
  children,
  leftIcon: Left,
  rightIcon: Right,
  loading = false,
  ...rest
}) {
  const isDisabled = rest.disabled || loading;
  return (
    <Tag
      type={Tag === 'button' ? type : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'select-none whitespace-nowrap',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className,
      )}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
      ) : Left ? (
        <Left size={16} className="shrink-0" />
      ) : null}
      {children}
      {Right && !loading ? <Right size={16} className="shrink-0" /> : null}
    </Tag>
  );
}

export default Button;
