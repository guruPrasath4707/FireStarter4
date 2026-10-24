import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CareerInterestCheckin from './CareerInterestCheckin';
import FoundationsQuiz from './FoundationsQuiz';

const MODES = [
  {
    id: 'career-interest',
    label: 'Career interest',
    description: 'A self-reflection with no right or wrong answers.',
  },
  {
    id: 'foundations',
    label: 'Foundations check',
    description: 'A short knowledge practice quiz with an answer key.',
  },
];

export default function Assessments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedMode = searchParams.get('mode');
  const activeMode = requestedMode === 'foundations' ? 'foundations' : 'career-interest';
  const currentMode = MODES.find((mode) => mode.id === activeMode) || MODES[0];

  function selectMode(modeId) {
    const nextParams = new URLSearchParams(searchParams);
    if (modeId === 'foundations') nextParams.set('mode', modeId);
    else nextParams.delete('mode');
    setSearchParams(nextParams, { replace: true });
  }

  return (
    <div className="space-y-5">
      <div
        role="tablist"
        aria-label="Choose an assessment"
        className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2"
      >
        {MODES.map((mode) => {
          const active = mode.id === activeMode;
          return (
            <button
              key={mode.id}
              id={mode.id + '-tab'}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={mode.id + '-panel'}
              onClick={() => selectMode(mode.id)}
              className={[
                'min-h-11 flex-1 rounded-xl px-4 py-2 text-left transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
              ].join(' ')}
            >
              <span className="block text-sm font-semibold">{mode.label}</span>
              <span className={['mt-0.5 block text-xs', active ? 'text-slate-200' : 'text-slate-500'].join(' ')}>
                {mode.description}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id={currentMode.id + '-panel'}
        role="tabpanel"
        aria-labelledby={currentMode.id + '-tab'}
      >
        {activeMode === 'foundations' ? <FoundationsQuiz /> : <CareerInterestCheckin />}
      </div>
    </div>
  );
}
