import React from 'react';
import { Link } from 'react-router-dom';
import { Brand } from '../components/layout/Brand';
import { Button } from '../design-system/Button';
import { brand } from '../brand';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" aria-label="Pathlight home"><Brand /></Link>
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7 text-sm text-slate-600">
          <a href="#features" className="hover:text-slate-900">What's available</a>
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#faq" className="hover:text-slate-900">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button as={Link} to="/login" variant="ghost" size="sm">Sign in</Button>
          <Button as={Link} to="/register" size="sm">Create account</Button>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
        <div>
          <Brand />
          <p className="mt-3 text-xs text-slate-500 max-w-xs">{brand.description}</p>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Product</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><a href="#features" className="hover:text-slate-900">Current capabilities</a></li>
            <li><a href="#how" className="hover:text-slate-900">How it works</a></li>
            <li><Link to="/register" className="hover:text-slate-900">Create account</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Project</div>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>
              <a href={brand.links.source} target="_blank" rel="noreferrer" className="hover:text-slate-900">
                Source code
              </a>
            </li>
            <li>
              <a href={brand.links.issues} target="_blank" rel="noreferrer" className="hover:text-slate-900">
                Report an issue
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Before launch</div>
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            Privacy and terms pages have not been published yet. Review those documents and Firebase Security Rules before using real personal data in a public deployment.
          </p>
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}

export default PublicLayout;
