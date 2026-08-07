import React from 'react';
import { brand } from '../../brand';

export function Brand({ compact = false, className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="h-9 w-9 rounded-xl bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_45%,#d946ef_100%)] grid place-items-center text-white shadow-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 L20 7 V17 L12 22 L4 17 V7 Z" />
          <path d="M12 2 V22" />
          <path d="M4 7 L20 17" />
          <path d="M20 7 L4 17" />
        </svg>
      </div>
      {!compact ? (
        <div className="leading-tight">
          <div className="text-[15px] font-semibold text-slate-900 tracking-tight">{brand.name}</div>
          <div className="text-[11px] text-slate-500">{brand.tagline.split(' ').slice(0, 4).join(' ')}…</div>
        </div>
      ) : null}
    </div>
  );
}

export default Brand;
