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
  staggerIndex?: number;
}

const MealCardComponent: React.FC<MealCardProps> = ({
  meal,
  dateKey,
  isHero = false,
  statusOverride,
  isPast = false,
  staggerIndex = 0,
}) => {
  return (
    <article
      className={`meal-card ${isHero ? 'is-active-meal' : ''} ${isPast ? 'is-past-meal' : ''}`}
      style={{ '--stagger': staggerIndex } as React.CSSProperties}
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
        </div>

        {/* Timing with Clock icon */}
        <div className="meal-card-time">
          <Clock size={13.5} className="meal-card-time-icon" />
          <span>{meal.timeRange}</span>
        </div>
      </div>

      {/* Meal Content Area: Text with bottom-right floating artwork */}
      <div className="meal-card-content">
        {/* Float spacer pushes the artwork container down so upper lines have 100% full width */}
        <div className="meal-artwork-spacer" aria-hidden="true" />

        {/* Dedicated Food Artwork Container (Bottom-Right) */}
        <div className="meal-artwork-container" aria-hidden="true">
          <FoodIllustration type={meal.type} />
        </div>

        {/* Menu Dishes Content Area */}
        {meal.items.length > 0 && (
          <p className="meal-dishes-paragraph">
            {meal.items.map((item, idx) => (
              <React.Fragment key={item.id}>
                <span className="meal-dish-item">{item.name}</span>
                {idx < meal.items.length - 1 && ', '}
              </React.Fragment>
            ))}
          </p>
        )}
      </div>
    </article>
  );
};

export const MealCard = React.memo(MealCardComponent);

