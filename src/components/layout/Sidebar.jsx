import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Sparkles, LogOut } from 'lucide-react';
import { Brand } from './Brand';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../design-system/Button';
import { PRIMARY_NAV } from '../../routes/nav';

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const nav = (
    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
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
          {item.icon ? <item.icon size={18} /> : null}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white">
        <div className="flex h-16 items-center px-6 border-b border-slate-200">
          <Brand />
        </div>
        {nav}
        <div className="border-t border-slate-200 p-4">
          <div className="rounded-xl bg-[linear-gradient(135deg,#eef2ff_0%,#fdf4ff_100%)] p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles size={14} className="text-violet-500" /> Coming soon
            </div>
            <p className="mt-1 text-xs text-slate-600">
              AI mentor, adaptive assessments, and personalized paths.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="text-xs text-slate-500 truncate flex-1">
              {user?.email}
            </div>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={logout}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50"
        aria-label="Open navigation"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Mobile drawer */}
      {open ? (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl flex flex-col">
            <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200">
              <Brand />
              <button
                onClick={() => setOpen(false)}
                className="h-9 w-9 grid place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Close navigation"
              >
                <X size={18} />
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
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Sidebar;
