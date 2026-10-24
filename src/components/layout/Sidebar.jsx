import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Sparkles, LogOut } from 'lucide-react';
import { Brand } from './Brand';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../design-system/Button';
import { PRIMARY_NAV } from '../../routes/nav';
import { pushToast } from './useToast';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { user, logout } = useAuth();
  const triggerRef = useRef(null);
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = Array.from(
        drawerRef.current?.querySelectorAll(FOCUSABLE_SELECTOR) || [],
      ).filter((element) => element.getClientRects().length > 0);

      if (focusable.length === 0) {
        event.preventDefault();
        drawerRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeIsInside = drawerRef.current?.contains(document.activeElement);

      if (!activeIsInside) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  async function handleLogout() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
      setOpen(false);
    } catch {
      pushToast({
        tone: 'danger',
        title: 'Could not sign out',
        description: 'Your session is still active. Check your connection and try again.',
      });
    } finally {
      setSigningOut(false);
    }
  }

  const nav = (
    <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto p-4 space-y-1">
      {PRIMARY_NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ' +
            (isActive
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
          }
        >
          {item.icon ? <item.icon size={18} aria-hidden="true" /> : null}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white">
        <div className="flex h-16 items-center px-6 border-b border-slate-200">
          <Brand />
        </div>
        {nav}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-[linear-gradient(135deg,#eef2ff_0%,#fdf4ff_100%)] p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles size={14} className="text-violet-500" aria-hidden="true" /> Coming soon
            </div>
            <p className="mt-1 text-xs text-slate-600">
              AI mentor, assessments, and other learning tools are being built incrementally.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="text-xs text-slate-500 truncate flex-1">
              {user?.email}
            </div>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={handleLogout}
              disabled={signingOut}
              loading={signingOut}
              aria-label={signingOut ? 'Signing out' : 'Sign out'}
              title="Sign out"
            >
              {!signingOut ? <LogOut size={16} aria-hidden="true" /> : null}
            </Button>
          </div>
        </div>
      </aside>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        aria-label="Open navigation"
        aria-controls="app-mobile-navigation"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open ? (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="app-mobile-navigation"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            tabIndex={-1}
            className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl flex flex-col focus:outline-none"
          >
            <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200">
              <Brand />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                aria-label="Close navigation"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            {nav}
            <div className="border-t border-slate-200 p-4">
              <div className="text-xs text-slate-500 mb-2 truncate">
                Signed in as <span className="text-slate-900 font-medium">{user?.email}</span>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                leftIcon={LogOut}
                onClick={handleLogout}
                disabled={signingOut}
                loading={signingOut}
              >
                {signingOut ? 'Signing out…' : 'Sign out'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Sidebar;
