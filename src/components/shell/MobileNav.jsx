import React from 'react';
import { NavLink } from 'react-router-dom';
import { Brand } from './Brand';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui';
import { PRIMARY_NAV } from '../../routes/nav';

export function MobileNav({ open, onClose }) {
  const { user, logout } = useAuth();

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] bg-white shadow-xl flex flex-col">
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200">
          <Brand />
          <button
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
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
        <div className="border-t border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-2 truncate">
            Signed in as <span className="text-slate-900 font-medium">{user?.email}</span>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => { onClose?.(); logout(); }}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MobileNav;
