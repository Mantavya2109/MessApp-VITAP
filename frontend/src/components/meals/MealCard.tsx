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

      {/* Menu Dishes Text List */}
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

      {/* Food Artwork: Fixed Block at Right Bottom */}
      <div className="meal-artwork-container" aria-hidden="true">
        <FoodIllustration type={meal.type} />
      </div>
    </article>
  );
};

export const MealCard = React.memo(MealCardComponent);

