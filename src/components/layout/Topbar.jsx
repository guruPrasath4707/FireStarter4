import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { Brand } from './Brand';
import { Avatar } from '../../design-system/Avatar';
import { Button } from '../../design-system/Button';
import { Dropdown, DropdownItem } from '../../design-system/Dropdown';
import { Divider } from '../../design-system/Divider';

export function Topbar({ pageTitle, pageSubtitle }) {
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const name = profile?.name || user?.displayName || (user?.email?.split('@')[0] ?? 'User');

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        {/* Sidebar trigger (mobile) sits absolutely; offset content so it isn't covered */}
        <div className="lg:hidden w-12" />
        <div className="lg:hidden">
          <Brand compact />
        </div>
        <div className="hidden lg:block">
          {pageTitle ? (
            <div>
              <div className="text-base font-semibold text-slate-900">{pageTitle}</div>
              {pageSubtitle ? (
                <div className="text-xs text-slate-500">{pageSubtitle}</div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 h-10 w-72">
            <Search size={16} className="text-slate-400" />
            <input
              placeholder="Search…"
              className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <Button variant="ghost" size="iconSm" aria-label="Notifications">
            <Bell size={16} />
          </Button>
          <Divider className="hidden sm:block !w-px !h-6 !bg-slate-200" />
          <Dropdown
            trigger={
              <div className="flex items-center gap-2">
                <Avatar name={name} size="sm" />
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-slate-900 leading-tight">{name}</div>
                  <div className="text-[11px] text-slate-500">{user?.email}</div>
                </div>
              </div>
            }
          >
            <div className="px-3 py-2 text-xs text-slate-500 sm:hidden">
              {user?.email}
            </div>
            <div className="sm:hidden h-px bg-slate-100 my-1" />
            <DropdownItem onClick={logout}>Sign out</DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
