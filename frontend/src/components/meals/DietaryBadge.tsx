import React from 'react';
import type { DietaryType } from '../../types';

interface DietaryBadgeProps {
  type: DietaryType;
  size?: 'sm' | 'md';
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ type, size = 'sm' }) => {
  if (type === 'veg') {
    return (
      <span
        title="Vegetarian"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size === 'sm' ? '14px' : '18px',
          height: size === 'sm' ? '14px' : '18px',
          border: '1.5px solid var(--veg-color)',
          borderRadius: '3px',
          padding: '1px',
          flexShrink: 0,
        }}
        aria-label="Vegetarian item"
      >
        <span
          style={{
            width: size === 'sm' ? '6px' : '8px',
            height: size === 'sm' ? '6px' : '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--veg-color)',
          }}
        />
      </span>
    );
  }

  if (type === 'non-veg') {
    return (
      <span
        title="Non-Vegetarian"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size === 'sm' ? '14px' : '18px',
          height: size === 'sm' ? '14px' : '18px',
          border: '1.5px solid var(--nonveg-color)',
          borderRadius: '3px',
          padding: '1px',
          flexShrink: 0,
        }}
        aria-label="Non-Vegetarian item"
      >
        <span
          style={{
            width: 0,
            height: 0,
            borderLeft: size === 'sm' ? '3px solid transparent' : '4px solid transparent',
            borderRight: size === 'sm' ? '3px solid transparent' : '4px solid transparent',
            borderBottom: size === 'sm' ? '6px solid var(--nonveg-color)' : '8px solid var(--nonveg-color)',
          }}
        />
      </span>
    );
  }

  // Egg
  return (
    <span
      title="Egg"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size === 'sm' ? '14px' : '18px',
        height: size === 'sm' ? '14px' : '18px',
        border: '1.5px solid var(--egg-color)',
        borderRadius: '3px',
        padding: '1px',
        flexShrink: 0,
      }}
      aria-label="Contains Egg"
    >
      <span
        style={{
          width: size === 'sm' ? '6px' : '8px',
          height: size === 'sm' ? '7px' : '9px',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          backgroundColor: 'var(--egg-color)',
        }}
      />
    </span>
  );
};
