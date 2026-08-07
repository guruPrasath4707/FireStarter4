import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from './Button';

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div
        ref={ref}
        className={cn(
          'relative w-full bg-white rounded-2xl border border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.2)]',
          'max-h-[90vh] overflow-hidden flex flex-col',
          sizes[size] || sizes.md,
        )}
      >
        <div className="flex items-start justify-between p-6 pb-3 border-b border-slate-100">
          <div>
            {title ? (
              <h2 id="modal-title" className="text-lg font-semibold text-slate-900">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-2 -mt-1"
          >
            <X size={16} />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        {footer ? (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
