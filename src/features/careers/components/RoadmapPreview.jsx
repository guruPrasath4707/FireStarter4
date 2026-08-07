import React from 'react';
import { Check } from 'lucide-react';

export function RoadmapPreview({ stages }) {
  if (!stages || stages.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No roadmap available yet for this career.
      </p>
    );
  }

  return (
    <ol className="relative space-y-5 pl-7">
      <span className="absolute left-3 top-2 bottom-2 w-px bg-slate-200" aria-hidden="true" />
      {stages.map((s, i) => (
        <li key={i} className="relative">
          <span
            className="absolute -left-7 top-0.5 h-6 w-6 rounded-full bg-white border border-slate-300 text-slate-700 grid place-items-center text-[11px] font-semibold"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900">
                {s.stage}
              </h4>
              <span className="text-xs text-slate-500">
                ~{s.durationMonths} mo
              </span>
            </div>
            {Array.isArray(s.items) && s.items.length > 0 ? (
              <ul className="mt-2 space-y-1.5">
                {s.items.map((it, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <Check
                      size={14}
                      className="mt-0.5 text-violet-600 shrink-0"
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default RoadmapPreview;
