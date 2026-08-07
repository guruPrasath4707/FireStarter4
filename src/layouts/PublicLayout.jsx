import React from 'react';
import { Link } from 'react-router-dom';
import { Brand } from '../components/layout/Brand';
import { Button } from '../design-system/Button';
import { brand } from '../brand';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/"><Brand /></Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#testimonials" className="hover:text-slate-900">Testimonials</a>
          <a href="#faq" className="hover:text-slate-900">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/register"><Button size="sm">Get started</Button></Link>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-8 grid sm:grid-cols-4 gap-6 text-sm">
        <div>
          <Brand />
          <p className="mt-3 text-xs text-slate-500 max-w-xs">{brand.description}</p>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Product</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><a href="#features" className="hover:text-slate-900">Features</a></li>
            <li><a href="#how" className="hover:text-slate-900">How it works</a></li>
            <li><Link to="/register" className="hover:text-slate-900">Get started</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Company</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><a href="#" className="hover:text-slate-900">About</a></li>
            <li><a href="#" className="hover:text-slate-900">Privacy</a></li>
            <li><a href="#" className="hover:text-slate-900">Terms</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Support</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><a href="#" className="hover:text-slate-900">Help center</a></li>
            <li><a href={`mailto:${brand.emails.support}`} className="hover:text-slate-900">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} {brand.name}.</div>
          <div>{brand.tagline}</div>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_60%)] text-slate-900">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}

export default PublicLayout;
