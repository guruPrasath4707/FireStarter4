import React from 'react';
import { Sparkles } from 'lucide-react';

export function Brand({ compact = false }) {
  return (
    <div className="inline-flex items-center gap-2.5">
      <div className="h-9 w-9 rounded-xl bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_45%,#3b82f6_100%)] grid place-items-center text-white shadow-sm">
        <Sparkles size={18} />
      </div>
      {!compact ? (
        <div className="leading-tight">
          <div className="text-[15px] font-semibold text-slate-900">Pathlight</div>
          <div className="text-[11px] text-slate-500">Career & Learning Platform</div>
        </div>
      ) : null}
    </div>
  );
}

export default Brand;
