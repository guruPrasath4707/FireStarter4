import React from 'react';
import { CareerCard } from './CareerCard';

export function CareerGrid({ careers, interests = [], savedCareerIds = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {careers.map((career) => (
        <CareerCard
          key={career.id}
          career={career}
          interests={interests}
          saved={savedCareerIds.includes(career.id)}
        />
      ))}
    </div>
  );
}

export default CareerGrid;
