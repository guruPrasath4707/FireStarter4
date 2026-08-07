import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

export function Dropdown({ trigger, children, align = 'right', className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const alignment = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className={cn('relative inline-block', className)} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
        <ChevronDown
          size={14}
          className={cn('text-slate-400 transition-transform', open && 'rotate-180')}
        />
      </button>
      {open ? (
        <div
          role="menu"
          className={cn(
            'absolute z-30 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white shadow-lg py-1',
            alignment,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function DropdownItem({ as: Tag = 'button', className, children, ...rest }) {
  return (
    <Tag
      role="menuitem"
      className={cn(
        'w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Dropdown;
