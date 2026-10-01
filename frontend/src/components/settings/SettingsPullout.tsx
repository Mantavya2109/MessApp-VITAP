import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ScrollText,
  Heart,
  Download,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePwa } from '../../context/PwaContext';
import { MESS_TIMING_SCHEDULE } from '../../data/mockData';
import { fetchAppLikes, sendAppLike, sendAppUnlike, getCachedAppLikes } from '../../data/likesRepository';
import './SettingsPullout.css';

interface SettingsPulloutProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInstructions?: () => void;
}

export const SettingsPullout: React.FC<SettingsPulloutProps> = ({
  isOpen,
  onClose,
  onOpenInstructions,
}) => {
  const {
    profile,
    updateProfile,
    isOffline,
    showToast,
  } = useApp();
  const { isInstalled, isInstalling, triggerInstall } = usePwa();

  const [isTimingsOpen, setIsTimingsOpen] = useState(false);
  const [likesState, setLikesState] = useState<{ totalLikes: number; userLiked: boolean }>(() => getCachedAppLikes());
  const [isLikedRecently, setIsLikedRecently] = useState(false);
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);

  // Fetch authoritative total likes from DB whenever pullout opens while online
  useEffect(() => {
    if (isOpen && !isOffline) {
      fetchAppLikes().then((data) => {
        setLikesState(data);
      });
    }
  }, [isOpen, isOffline]);

  // Re-fetch when coming back online
  useEffect(() => {
    const handleOnline = () => {
      fetchAppLikes().then((data) => {
        setLikesState(data);
      });
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Prevent liking while offline and inform student
    if (isOffline) {
      showToast('Connect to Internet', 'Please connect to the internet to record your like.', 'info');
      return;
    }

    if (isSubmittingLike) return;
    setIsSubmittingLike(true);

    const isCurrentlyLiked = likesState.userLiked;
    const willBeLiked = !isCurrentlyLiked;

    // Instant optimistic UI update
    setLikesState((prev) => ({
      totalLikes: willBeLiked ? prev.totalLikes + 1 : Math.max(0, prev.totalLikes - 1),
      userLiked: willBeLiked,
    }));

    setIsLikedRecently(true);
    setTimeout(() => setIsLikedRecently(false), 350);

    if (willBeLiked) {
      // Floating heart bubble effect
      const newHeart = {
        id: Date.now() + Math.random(),
        left: Math.floor(Math.random() * 50) + 25,
      };
      setFloatingHearts((prev) => [...prev.slice(-7), newHeart]);

      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 850);
    }

    try {
      if (willBeLiked) {
        const res = await sendAppLike();
        if (res) {
          setLikesState(res);
          showToast('Thank you!', 'Your support for MessApp has been recorded ❤️', 'success');
        }
      } else {
        const res = await sendAppUnlike();
        if (res) {
          setLikesState(res);
        }
      }
    } catch (err) {
      console.warn('[SettingsPullout] Like error:', err);
      // Revert from server
      const latest = await fetchAppLikes();
      setLikesState(latest);
    } finally {
      setIsSubmittingLike(false);
    }
  };

  if (!isOpen) return null;

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
                className={`pullout-theme-pill ${profile.theme === 'light' || !profile.theme ? 'active' : ''}`}
                onClick={() => updateProfile({ theme: 'light' })}
              >
                <span className="theme-pill-recommended-badge">Recommended</span>
                Light
              </button>
              <button
                type="button"
                className={`pullout-theme-pill ${profile.theme === 'dark' ? 'active' : ''}`}
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
            </div>
          </div>

          {/* 2. Daily Mess Timings (Collapsible) */}
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
                {MESS_TIMING_SCHEDULE.map((item) => (
                  <div key={item.meal} className="pullout-timing-group">
                    <span className="timing-meal-name">{item.meal}</span>
                    <div className="timing-schedule-entries">
                      {item.schedules.map((s, idx) => (
                        <div key={idx} className="pullout-timing-row">
                          <span className="timing-day-label">{s.days}</span>
                          <span className="timing-meal-time">{s.timeRange}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Mess Service Instructions Option */}
          <div
            className="pullout-item clickable"
            onClick={() => {
              onClose();
              if (onOpenInstructions) {
                onOpenInstructions();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Open Mess Service Instructions"
          >
            <div className="pullout-item-header">
              <div className="pullout-item-left">
                <div className="pullout-icon">
                  <ScrollText size={20} strokeWidth={2.2} />
                </div>
                <span className="pullout-item-label">Mess Service Instructions</span>
              </div>
              <ChevronRight size={18} color="var(--text-secondary)" strokeWidth={2.4} />
            </div>
          </div>

          {/* 4. Like MessApp Community Support Option */}
          <div
            className="pullout-item pullout-like-item clickable"
            onClick={handleLikeClick}
            role="button"
            tabIndex={0}
            aria-label={
              likesState.userLiked
                ? 'You have liked MessApp. Click to unlike.'
                : 'Like MessApp'
            }
          >
            <div className="pullout-item-header">
              <div className="pullout-item-left">
                <div className={`pullout-icon pullout-like-icon ${isLikedRecently ? 'heart-bump' : ''}`}>
                  <Heart
                    size={20}
                    strokeWidth={2.2}
                    className="pullout-heart-svg"
                    fill={likesState.userLiked ? '#EF4444' : 'none'}
                    color={likesState.userLiked ? '#EF4444' : 'currentColor'}
                  />
                </div>
                <div className="pullout-like-title-wrap">
                  <span className="pullout-item-label">Like MessApp</span>
                </div>
              </div>

              {/* Dedicated Like / Liked Button */}
              <button
                type="button"
                className={`pullout-like-action-btn ${likesState.userLiked ? 'liked-active' : ''}`}
                onClick={handleLikeClick}
                aria-label={likesState.userLiked ? 'Liked MessApp' : 'Like MessApp'}
                disabled={isSubmittingLike}
              >
                {likesState.userLiked ? (
                  <>
                    <Check size={13} strokeWidth={2.8} />
                    <span>Liked</span>
                  </>
                ) : (
                  <>
                    <Heart
                      size={13}
                      strokeWidth={2.4}
                      fill="#EF4444"
                      color="#EF4444"
                      className="action-heart-icon"
                    />
                    <span>Like</span>
                  </>
                )}
              </button>
            </div>

            {/* Total number of likes & support message displayed below the option */}
            <div className="pullout-likes-below-info">
              <span className="pullout-likes-counter-tag">
                ❤️ {likesState.totalLikes.toLocaleString()} {likesState.totalLikes === 1 ? 'student' : 'students'} liked MessApp
              </span>
            </div>

            {/* Floating hearts particles */}
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
          </div>

          {/* 5. Install MessApp (Permanent in Settings) */}
          <div
            className={`pullout-item pullout-install-item ${isInstalled ? 'is-installed' : 'clickable'}`}
            onClick={() => {
              if (!isInstalled) {
                triggerInstall();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={isInstalled ? 'MessApp is already installed' : 'Install MessApp'}
          >
            <div className="pullout-item-header">
              <div className="pullout-item-left">
                <div className={`pullout-icon pullout-install-icon ${isInstalled ? 'icon-installed' : ''}`}>
                  {isInstalled ? <Check size={20} strokeWidth={2.6} /> : <Download size={20} strokeWidth={2.2} />}
                </div>
                <div className="pullout-install-text-wrap">
                  <span className="pullout-item-label">
                    {isInstalled ? 'MessApp Installed' : 'Install MessApp'}
                  </span>
                  <span className="pullout-install-desc">
                    {isInstalled
                      ? 'Installed on this device'
                      : 'Add to home screen'}
                  </span>
                </div>
              </div>

              {/* Action: Installed Badge vs Install Button */}
              {isInstalled ? (
                <div className="pullout-installed-badge" aria-label="Already installed">
                  <Check size={12} strokeWidth={3} />
                  <span>Installed</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="pullout-install-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerInstall();
                  }}
                  aria-label="Install MessApp"
                  disabled={isInstalling}
                  title="Install MessApp"
                >
                  <Download size={13} strokeWidth={2.4} />
                  <span>Install</span>
                </button>
              )}
            </div>
          </div>

          {/* 6. Committee Feedback (Coming Soon) */}
          <div
            className="pullout-item pullout-coming-soon-item clickable"
            onClick={() => {
              showToast('Coming Soon', 'Committee Feedback will be available in an upcoming update.', 'info');
            }}
            role="button"
            tabIndex={0}
            aria-label="Committee Feedback - Coming Soon"
          >
            <div className="pullout-item-header">
              <div className="pullout-item-left">
                <div className="pullout-icon">
                  <MessageSquare size={20} strokeWidth={2.2} />
                </div>
                <div className="pullout-title-with-badge">
                  <span className="pullout-item-label">Committee Feedback</span>
                  <span className="pullout-coming-soon-pill">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Footer / Creator Credit */}
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
