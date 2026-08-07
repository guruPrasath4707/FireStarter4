import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)]">
      <Sidebar onNavigate={() => setMobileOpen(false)} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <TopBar onOpenMobileNav={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default AppShell;
