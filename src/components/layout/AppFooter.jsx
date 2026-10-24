import React from 'react';
import { Sparkles } from 'lucide-react';
import { brand } from '../../brand';

export function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="inline-flex items-center gap-2">
          <Sparkles size={12} className="text-slate-400" />
          <span>{brand.tagline}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a href={brand.links.source} target="_blank" rel="noreferrer" className="hover:text-slate-900">
            Source code
          </a>
          <a href={brand.links.issues} target="_blank" rel="noreferrer" className="hover:text-slate-900">
            Report an issue
          </a>
          <span>Privacy and terms pages are not published yet.</span>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
