import React from 'react';
import { CareerCard } from './CareerCard';

export function CareerGrid({ careers }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {careers.map((c) => (
        <CareerCard key={c.id} career={c} />
      ))}
    </div>
  );
}

export default CareerGrid;
