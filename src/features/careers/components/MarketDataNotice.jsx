import React from 'react';
import { Info } from 'lucide-react';
import { CAREER_MARKET_DATA_NOTICE } from '../data/marketDataQuality';

export function MarketDataNotice() {
  return (
    <aside
      role="note"
      aria-label="Career market data notice"
      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
    >
      <Info size={17} className="mt-0.5 shrink-0 text-slate-500" aria-hidden="true" />
      <div>
        <p className="font-semibold text-slate-900">Market data is illustrative, not verified.</p>
        <p className="mt-1 leading-relaxed">{CAREER_MARKET_DATA_NOTICE}</p>
      </div>
    </aside>
  );
}

export default MarketDataNotice;
