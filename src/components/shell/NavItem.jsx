import React from 'react';
import { NavLink } from 'react-router-dom';

export function NavItem({ to, icon: Icon, label, end = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ' +
        (isActive
          ? 'bg-slate-900 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
      }
    >
      {Icon ? <Icon size={18} className="shrink-0" /> : null}
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default NavItem;
