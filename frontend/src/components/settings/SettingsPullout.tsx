import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Heart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MEAL_TIMINGS } from '../../data/mockData';
import { fetchTotalLikes, sendLikesIncrement, getCachedLikes, setCachedLikes } from '../../data/likesRepository';
import './SettingsPullout.css';

interface SettingsPulloutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPullout: React.FC<SettingsPulloutProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    updateProfile,
    isOffline,
    showToast,
  } = useApp();

  const [isTimingsOpen, setIsTimingsOpen] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(() => getCachedLikes());
  const [isLikedRecently, setIsLikedRecently] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);
  const pendingLikesRef = useRef<number>(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch authoritative total likes from DB whenever pullout opens while online
  useEffect(() => {
    if (isOpen && !isOffline) {
      fetchTotalLikes().then((count) => {
        setLikesCount(count);
      });
    }
  }, [isOpen, isOffline]);

  // Flush queued likes to backend
  const flushLikes = useCallback(() => {
    if (pendingLikesRef.current > 0 && !isOffline) {
      const toSend = pendingLikesRef.current;
      pendingLikesRef.current = 0;
      sendLikesIncrement(toSend).then((updatedCount) => {
        if (updatedCount !== null) {
          setLikesCount(updatedCount);
        }
      });
    }
  }, [isOffline]);

  // Flush on unmount or close
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      flushLikes();
    };
  }, [flushLikes]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Prevent liking while offline and inform student
    if (isOffline) {
      showToast('Offline Mode', 'Connect to the internet to add likes.', 'info');
      return;
    }

    // Instant optimistic UI increment & local persistence
    setLikesCount((prev) => {
      const next = prev + 1;
      setCachedLikes(next);
      return next;
    });
    pendingLikesRef.current += 1;
    setIsLikedRecently(true);
    setTimeout(() => setIsLikedRecently(false), 300);

    // Floating heart bubble effect
    const newHeart = {
      id: Date.now() + Math.random(),
      left: Math.floor(Math.random() * 50) + 25,
    };
    setFloatingHearts((prev) => [...prev.slice(-7), newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 850);

    // Debounced API sync to persist into database
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      flushLikes();
    }, 350);
  };

  if (!isOpen) return null;

  const handleToggleNotifications = () => {
    updateProfile({ notificationsEnabled: !profile.notificationsEnabled });
  };

  return (
    <>
      {/* Invisible backdrop to dismiss pullout when tapping outside */}
      <div className="pullout-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Pullout Card Anchored under Hamburger */}
      <div
        className="settings-pullout-card animate-pullout"
        role="dialog"
        aria-label="Settings and Preferences"
      >
        <div className="pullout-items-list">
          {/* 1. Theme / Appearance */}
          <div className="pullout-item">
            <div className="pullout-item-header">
              <div className="pullout-item-left">
                <div className="pullout-icon">
                  {profile.theme === 'light' ? <Sun size={20} strokeWidth={2.2} /> : <Moon size={20} strokeWidth={2.2} />}
                </div>
                <span className="pullout-item-label">Toggle Theme</span>
              </div>
            </div>
            <div className="pullout-theme-pills" role="radiogroup" aria-label="Theme Selection">
              <button
                type="button"
                className={`pullout-theme-pill ${profile.theme === 'dark' || !profile.theme ? 'active' : ''}`}
                onClick={() => updateProfile({ theme: 'dark' })}
              >
                Dark
              </button>
              <button
                type="button"
                className={`pullout-theme-pill ${profile.theme === 'ultra-dark' ? 'active' : ''}`}
                onClick={() => updateProfile({ theme: 'ultra-dark' })}
              >
                Ultra Dark
              </button>
              <button
                type="button"
                className={`pullout-theme-pill ${profile.theme === 'light' ? 'active' : ''}`}
                onClick={() => updateProfile({ theme: 'light' })}
              >
                Light
              </button>
            </div>
          </div>

          {/* 2. Meal Reminders */}
          <div className="pullout-item clickable" onClick={handleToggleNotifications}>
            <div className="pullout-item-header">
              <div className="pullout-item-left">
                <div className="pullout-icon">
                  <Bell size={20} strokeWidth={2.2} />
                </div>
                <span className="pullout-item-label">Meal Reminders</span>
              </div>
              <div
                className={`pullout-toggle ${profile.notificationsEnabled ? 'on' : ''}`}
                role="switch"
                aria-checked={profile.notificationsEnabled}
              >
                <div className="pullout-toggle-thumb" />
              </div>
            </div>
          </div>

          {/* 3. Daily Mess Timings (Collapsible) */}
          <div className="pullout-item">
            <div
              className="pullout-item-header clickable"
              onClick={() => setIsTimingsOpen(!isTimingsOpen)}
            >
              <div className="pullout-item-left">
                <div className="pullout-icon">
                  <Clock size={20} strokeWidth={2.2} />
                </div>
                <span className="pullout-item-label">Mess Timings</span>
              </div>
              <button
                type="button"
                className="pullout-expand-btn"
                aria-label="Toggle Timings"
              >
                {isTimingsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {isTimingsOpen && (
              <div className="pullout-timings-sublist">
                {Object.entries(MEAL_TIMINGS).map(([key, val]) => (
                  <div key={key} className="pullout-timing-row">
                    <span className="timing-meal-name">{val.label}</span>
                    <span className="timing-meal-time">{val.timeRange}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Infinite App Like Option (Online Only) */}
          <div
            className={`pullout-item pullout-like-item ${isOffline ? 'is-disabled-offline' : 'clickable'}`}
            onClick={handleLikeClick}
            role="button"
            tabIndex={0}
            aria-label={isOffline ? 'Liking is disabled while offline' : 'Like if you liked the app'}
            aria-disabled={isOffline}
          >
            <div className="pullout-item-header">
              <div className="pullout-item-left">
                <div className={`pullout-icon pullout-like-icon ${isLikedRecently && !isOffline ? 'heart-bump' : ''}`}>
                  <Heart
                    size={20}
                    strokeWidth={2.2}
                    className="pullout-heart-svg"
                    fill={likesCount > 0 ? '#EF4444' : 'none'}
                    color={likesCount > 0 ? '#EF4444' : 'currentColor'}
                  />
                </div>
                <div className="pullout-like-title-wrap">
                  <span className="pullout-item-label">Like if you liked the app</span>
                  {isOffline && <span className="pullout-offline-pill">Offline</span>}
                </div>
              </div>

              {/* Dedicated Like Button */}
              <button
                type="button"
                className={`pullout-like-action-btn ${isLikedRecently && !isOffline ? 'liked-active' : ''} ${isOffline ? 'btn-disabled' : ''}`}
                onClick={handleLikeClick}
                aria-label={isOffline ? 'Likes disabled offline' : 'Give a like'}
                disabled={isOffline}
              >
                <Heart
                  size={13}
                  strokeWidth={2.4}
                  fill={isOffline ? '#94A3B8' : '#EF4444'}
                  color={isOffline ? '#94A3B8' : '#EF4444'}
                  className="action-heart-icon"
                />
                <span>{isOffline ? 'Offline' : 'Like'}</span>
              </button>
            </div>

            {/* Total number of likes displayed below the option */}
            <div className="pullout-likes-below-info">
              <span className={`pullout-likes-counter-tag ${isOffline ? 'tag-offline' : ''}`}>
                ❤️ {likesCount.toLocaleString()} {likesCount === 1 ? 'total like' : 'total likes'} across all students
                {isOffline && ' (Cached)'}
              </span>
            </div>

            {/* Floating hearts particles */}
            {!isOffline && (
              <div className="floating-hearts-container" aria-hidden="true">
                {floatingHearts.map((h) => (
                  <span
                    key={h.id}
                    className="floating-heart"
                    style={{ left: `${h.left}%` }}
                  >
                    ❤️
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 5. Committee Feedback */}
          <div
            className="pullout-item clickable"
            onClick={() => {
              window.open('https://vtop2.vitap.ac.in/vtop/initialProcess', '_blank');
            }}
          >
            <div className="pullout-item-header">
              <div className="pullout-item-left">
                <div className="pullout-icon">
                  <MessageSquare size={20} strokeWidth={2.2} />
                </div>
                <span className="pullout-item-label">Committee Feedback</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Footer / Creator Credit */}
        <footer className="pullout-footer">
          <p>
            Designed for students by{' '}
            <a
              href="https://www.linkedin.com/in/mantavya-patel-53b49932b/"
              target="_blank"
              rel="noopener noreferrer"
              className="pullout-creator-link"
            >
              Mantavya Patel
            </a>
          </p>
        </footer>
      </div>
    </>
  );
};
