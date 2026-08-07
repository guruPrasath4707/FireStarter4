import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const ToastContext = createContext(null);
const listeners = new Set();

let idSeq = 0;
function nextId() {
  idSeq += 1;
  return idSeq;
}

export function pushToast(input) {
  const id = nextId();
  const toast = {
    id,
    title: input?.title || '',
    description: input?.description || '',
    tone: input?.tone || 'default',
    duration: input?.duration ?? 3500,
  };
  for (const l of listeners) l(toast);
  return id;
}

export function useToast() {
  return useCallback((input) => pushToast(input), []);
}

export function ToastHost({ className }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const handler = (t) => {
      setItems((prev) => [...prev, t]);
      if (t.duration > 0) {
        setTimeout(() => {
          setItems((prev) => prev.filter((x) => x.id !== t.id));
        }, t.duration);
      }
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  function dismiss(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm',
        className,
      )}
      role="region"
      aria-label="Notifications"
    >
      {items.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const Icon =
    toast.tone === 'success' ? CheckCircle2 :
    toast.tone === 'warning' ? AlertTriangle :
    toast.tone === 'danger'  ? AlertTriangle :
    Info;
  const tone =
    toast.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' :
    toast.tone === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-800' :
    toast.tone === 'danger'  ? 'border-rose-200 bg-rose-50 text-rose-800' :
    'border-slate-200 bg-white text-slate-800';

  return (
    <div
      role="status"
      className={cn(
        'rounded-xl border shadow-lg px-4 py-3 flex items-start gap-3',
        tone,
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        {toast.title ? <div className="text-sm font-medium">{toast.title}</div> : null}
        {toast.description ? (
          <div className="text-xs opacity-80 mt-0.5">{toast.description}</div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="opacity-60 hover:opacity-100"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
