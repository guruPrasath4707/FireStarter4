import React from 'react';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="inline-flex items-center gap-2">
          <Sparkles size={12} className="text-slate-400" />
          <span>Offline-first • Multilingual • Accessible</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-slate-900">Privacy</a>
          <a href="#" className="hover:text-slate-900">Terms</a>
          <a href="#" className="hover:text-slate-900">Help</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
