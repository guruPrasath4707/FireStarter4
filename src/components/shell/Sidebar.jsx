import React from 'react';
import { Brand } from './Brand';
import { NavItem } from './NavItem';
import { PRIMARY_NAV } from '../../routes/nav';

export function Sidebar({ onNavigate }) {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white">
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <Brand />
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          {PRIMARY_NAV.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              end={item.end}
              onClick={onNavigate}
            />
          ))}
        </div>
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-[linear-gradient(135deg,#eef2ff_0%,#f0f9ff_100%)] p-4">
          <div className="text-sm font-semibold text-slate-900">Upgrade to Pro</div>
          <p className="mt-1 text-xs text-slate-600">
            Unlock AI mentor, adaptive assessments, and personalized paths.
          </p>
          <button className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800">
            Coming soon
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
