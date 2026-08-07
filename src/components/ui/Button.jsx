import React from 'react';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all ' +
  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ' +
  'disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap';

const variants = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-sm',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200',
  outline:
    'bg-white text-slate-900 border border-slate-300 hover:border-slate-400 focus:ring-slate-300',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
  gradient:
    'text-white shadow-sm ' +
    'bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_45%,#3b82f6_100%)] ' +
    'hover:opacity-95 focus:ring-blue-500',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-10 w-10 p-0',
};

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
