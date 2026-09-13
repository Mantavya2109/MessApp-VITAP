import React from 'react';
import type { AvatarId } from '../../types';
import { AvatarIcon } from './AvatarIcon';
import { Check } from 'lucide-react';
import './AvatarSelectorPopover.css';

const AVATAR_OPTIONS: AvatarId[] = [
  'pro-man-1',
  'pro-man-2',
  'pro-woman-1',
  'pro-woman-2',
];

interface AvatarSelectorPopoverProps {
  isOpen: boolean;
  currentAvatarId?: AvatarId;
  onSelect: (avatarId: AvatarId) => void;
  onClose: () => void;
}

export const AvatarSelectorPopover: React.FC<AvatarSelectorPopoverProps> = ({
  isOpen,
  currentAvatarId = 'pro-man-1',
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop for click-outside dismissal */}
      <div className="avatar-popover-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Floating Card anchored below avatar button */}
      <div className="avatar-selector-popover animate-slide-down" role="dialog" aria-label="Select Profile Avatar">
        <div className="avatar-popover-header">
          <span className="avatar-popover-title">Select Avatar</span>
        </div>

        <div className="avatar-options-grid">
          {AVATAR_OPTIONS.map((id) => {
            const isSelected = (currentAvatarId || 'pro-man-1') === id;
            return (
              <button
                key={id}
                type="button"
                className={`avatar-option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onSelect(id);
                  onClose();
                }}
                aria-label={`Select avatar ${id}`}
                title={`Select avatar`}
              >
                <div className="avatar-preview-wrap">
                  <AvatarIcon avatarId={id} size={50} />
                  {isSelected && (
                    <div className="avatar-selected-badge" aria-hidden="true">
                      <Check size={11} strokeWidth={3.5} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
