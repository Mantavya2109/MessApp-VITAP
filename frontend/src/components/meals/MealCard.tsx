import React from 'react';
import { Clock } from 'lucide-react';
import type { MealSlot } from '../../types';
import { FoodIllustration } from './FoodIllustration';
import './MealCard.css';

interface MealCardProps {
  meal: MealSlot;
  dateKey: string;
  isHero?: boolean;
  statusOverride?: 'serving' | 'upcoming' | 'ended';
  isPast?: boolean;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  dateKey,
  isHero = false,
  statusOverride,
  isPast = false,
}) => {
  return (
    <article
      className={`meal-card ${isHero ? 'is-active-meal' : ''} ${isPast ? 'is-past-meal' : ''}`}
      aria-label={`${meal.label} menu for ${dateKey}`}
    >
      {/* Header Area */}
      <div className="meal-card-header">
        <div className="meal-card-title-row">
          <h2 className="meal-card-name">{meal.label}</h2>
          {statusOverride === 'serving' && (
            <span className="meal-card-status-badge status-badge-serving">
              <span className="status-dot" />
              Serving
            </span>
          )}
          {statusOverride === 'upcoming' && (
            <span className="meal-card-status-badge status-badge-upcoming">
              Next
            </span>
          )}
        </div>

        {/* Timing with Clock icon */}
        <div className="meal-card-time">
          <Clock size={13.5} className="meal-card-time-icon" />
          <span>{meal.timeRange}</span>
        </div>
      </div>

      {/* Menu Dishes Text List (Natural flowing comma-separated text with right-side clearance) */}
      <div className="meal-dishes-text-area">
        {meal.items.length > 0 && (
          <p className="meal-dishes-paragraph">
            {meal.items.map((item, idx) => (
              <React.Fragment key={item.id}>
                <span>{item.name}</span>
                {idx < meal.items.length - 1 && ', '}
              </React.Fragment>
            ))}
          </p>
        )}
      </div>

      {/* Overlapping Food Illustration (Partially exits card boundary) */}
      <div className="meal-artwork-container">
        <FoodIllustration type={meal.type} />
      </div>
    </article>
  );
};

