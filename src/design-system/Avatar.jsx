import React from 'react';
import { cn } from '../utils/cn';

export function Avatar({ name = '', src, size = 'md', className }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };
  const initial = (name?.trim()?.charAt(0) || 'U').toUpperCase();
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full overflow-hidden',
        'bg-slate-900 text-white font-semibold ring-2 ring-white',
        sizes[size] || sizes.md,
        className,
      )}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}

export default Avatar;
