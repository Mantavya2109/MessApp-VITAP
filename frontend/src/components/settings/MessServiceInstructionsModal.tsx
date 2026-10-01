import React, { useEffect } from 'react';
import { X, ScrollText } from 'lucide-react';
import './MessServiceInstructionsModal.css';

interface MessServiceInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SERVICE_INSTRUCTIONS = [
  {
    id: 1,
    content: (
      <>
        Thick curd must be served as per the menu, either during lunch or dinner.
      </>
    ),
  },
  {
    id: 2,
    content: (
      <>
        Fresh salad must be served every day as per the menu.
      </>
    ),
  },
  {
    id: 3,
    content: (
      <>
        The toaster should be kept functional every day.
      </>
    ),
  },
  {
    id: 4,
    content: (
      <>
        A weighing machine <strong>must be used while serving Chicken and Paneer</strong> and it must be functionally available in the mess area everyday.
      </>
    ),
  },
  {
    id: 5,
    content: (
      <>
        Chicken should weigh <strong>150 g (and 180 g on Sundays)</strong> after cooking, i.e., before serving (excluding bowl weight and gravy). Fish should weight <strong>120 g after cooking</strong> (excluding bowl weight and gravy).
      </>
    ),
  },
  {
    id: 6,
    content: (
      <>
        Paneer/Mushroom should be soft and must weigh <strong>75 g/50 g after cooking</strong>, i.e., before serving (excluding bowl weight and gravy).
      </>
    ),
  },
  {
    id: 7,
    content: (
      <>
        Roti/Phulka/Chapathi should be prepared using <strong>100% good-quality Atta</strong>.
      </>
    ),
  },
  {
    id: 8,
    content: (
      <>
        White Rice (Sona Masuri) must be cooked properly every day — <strong>neither undercooked nor overcooked.</strong>
      </>
    ),
  },
  {
    id: 9,
    content: (
      <>
        All wet gravy-based curries should be prepared with <strong>75% vegetables and 25% gravy.</strong>
      </>
    ),
  },
  {
    id: 10,
    content: (
      <>
        Egg Bhurji should be served as <strong>60 g (after cooking).</strong>
      </>
    ),
  },
  {
    id: 11,
    content: (
      <>
        The quantity of an item may vary depending on the size served by the caterer.
      </>
    ),
  },
  {
    id: 12,
    content: (
      <>
        Fresh juice served in the Special Menu must be at least <strong>250 ml</strong>. Fresh juices, sweet items, and soups included in the Special Menu must be of the highest quality. Please use minimal water/milk while preparing the juices.
      </>
    ),
  },
  {
    id: 13,
    content: (
      <>
        Food items like <strong>Rava bonda, Vada</strong> should be served in <strong>3 standard-sized pieces</strong>; if the size is smaller, <strong>4 pieces must be served. (in breakfast)</strong>
      </>
    ),
  },
  {
    id: 14,
    content: (
      <>
        Ice Cream served during the <strong>Sunday lunch</strong> should be made primarily with milk and cream. It should not be frozen dessert type.
      </>
    ),
  },
];

export const MessServiceInstructionsModal: React.FC<MessServiceInstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="instructions-modal-backdrop" onClick={onClose} aria-hidden="true">
      <div
        className="instructions-modal-container animate-scale-up"
        role="dialog"
        aria-label="Mess Service Instructions"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <header className="instructions-modal-header">
          <div className="instructions-header-title-wrap">
            <div className="instructions-icon-badge">
              <ScrollText size={18} strokeWidth={2.4} color="var(--accent-golden)" />
            </div>
            <h2 className="instructions-modal-title">Mess Service Instructions</h2>
          </div>
          <button
            type="button"
            className="instructions-close-btn"
            onClick={onClose}
            aria-label="Close instructions modal"
            title="Close"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </header>

        {/* Scrollable Content Body */}
        <div className="instructions-modal-body">
          <ol className="instructions-list">
            {SERVICE_INSTRUCTIONS.map((item) => (
              <li key={item.id} className="instructions-list-item">
                <span className="instruction-number-badge">{item.id}</span>
                <div className="instruction-text">{item.content}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
