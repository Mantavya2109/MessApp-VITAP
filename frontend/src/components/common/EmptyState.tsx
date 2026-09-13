import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = UtensilsCrossed,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '36px 20px',
        backgroundColor: 'var(--bg-surface-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-medium)',
        margin: '12px 0',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-surface-subtle)',
          color: 'var(--primary-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
        }}
        aria-hidden="true"
      >
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--text-primary)',
          marginBottom: '6px',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          maxWidth: '300px',
          lineHeight: '1.45',
          marginBottom: actionText ? '16px' : '0',
        }}
      >
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            padding: '8px 18px',
            backgroundColor: 'var(--primary-500)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
