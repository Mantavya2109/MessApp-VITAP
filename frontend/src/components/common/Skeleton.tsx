import React from 'react';

export const MealCardSkeleton: React.FC = () => {
  return (
    <div
      className="meal-card"
      style={{
        border: '1px solid var(--border-subtle)',
        padding: '18px 20px',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
          <div>
            <div className="skeleton" style={{ width: '90px', height: '18px', marginBottom: '6px' }} />
            <div className="skeleton" style={{ width: '120px', height: '12px' }} />
          </div>
        </div>
        <div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '8px 0' }}>
        <div className="skeleton" style={{ width: '80%', height: '16px' }} />
        <div className="skeleton" style={{ width: '65%', height: '16px' }} />
        <div className="skeleton" style={{ width: '90%', height: '16px' }} />
        <div className="skeleton" style={{ width: '50%', height: '16px' }} />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div className="skeleton" style={{ width: '100px', height: '14px' }} />
        <div className="skeleton" style={{ width: '110px', height: '38px', borderRadius: '9999px' }} />
      </div>
    </div>
  );
};
