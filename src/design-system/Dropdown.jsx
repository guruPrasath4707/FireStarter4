import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import { getMenuFocusIndex } from '../utils/menuKeyboard.js';

const MENU_ITEM_SELECTOR = '[role="menuitem"]:not([disabled])';

export function Dropdown({ trigger, children, align = 'right', className, menuLabel = 'Actions' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    function onDocumentMouseDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function onKeyDown(event) {
      if (!open) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key === 'Tab') {
        setOpen(false);
        return;
      }

      const menuItems = Array.from(menuRef.current?.querySelectorAll(MENU_ITEM_SELECTOR) || []);
      if (!menuItems.length) return;

      const currentIndex = menuItems.indexOf(document.activeElement);
      const nextIndex = getMenuFocusIndex(event.key, currentIndex, menuItems.length);
      if (nextIndex !== null) {
        event.preventDefault();
        menuItems[nextIndex]?.focus();
      }
    }

    document.addEventListener('mousedown', onDocumentMouseDown);
    if (open) document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocumentMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) menuRef.current?.querySelector(MENU_ITEM_SELECTOR)?.focus();
  }, [open]);

  const alignment = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className={cn('relative inline-block', className)} ref={containerRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
      >
        {trigger}
        <ChevronDown
          size={14}
          className={cn('text-slate-400 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div
          id={menuId}
          ref={menuRef}
          role="menu"
          aria-label={menuLabel}
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

export function DropdownItem({ as: Tag = 'button', className, type, ...rest }) {
  return (
    <Tag
      type={Tag === 'button' ? (type || 'button') : undefined}
      role="menuitem"
      className={cn(
        'w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-indigo-600',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...rest}
    />
  );
}

export default Dropdown;
