import React from 'react';
import { Progress } from '../../../design-system/Progress';

export function SkillBar({ skill }) {
  const value = Math.max(0, Math.min(100, Number(skill.weight) || 0));
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-800">{skill.name}</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <div className="mt-1.5">
        <Progress value={value} />
      </div>
    </div>
  );
}

export default SkillBar;
