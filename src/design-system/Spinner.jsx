import React from 'react';
import { cn } from '../utils/cn';

const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
};

export function Spinner({ size = 'md', className, label = 'Loading' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block rounded-full border-current border-r-transparent animate-spin text-slate-400',
        SIZES[size] || SIZES.md,
        className,
      )}
    />
  );
}

export default Spinner;
