import React, { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MEAL_TIMINGS } from '../../data/mockData';
import './SettingsPullout.css';

interface SettingsPulloutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPullout: React.FC<SettingsPulloutProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    updateProfile,
    isSimulatedOffline,
    setSimulateOffline,
  } = useApp();

  const [isTimingsOpen, setIsTimingsOpen] = useState(false);

  if (!isOpen) return null;

  const handleToggleNotifications = () => {
    updateProfile({ notificationsEnabled: !profile.notificationsEnabled });
  };

  const handleToggleSimulateOffline = () => {
    setSimulateOffline(!isSimulatedOffline);
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

          {/* 3. Simulate Offline Mode */}
          <div className="pullout-item clickable" onClick={handleToggleSimulateOffline}>
            <div className="pullout-item-header">
              <div className="pullout-item-left">
                <div className="pullout-icon" style={{ color: isSimulatedOffline ? '#F59E0B' : 'inherit' }}>
                  {isSimulatedOffline ? <WifiOff size={20} strokeWidth={2.2} /> : <Wifi size={20} strokeWidth={2.2} />}
                </div>
                <span className="pullout-item-label">Simulate Offline</span>
              </div>
              <div
                className={`pullout-toggle ${isSimulatedOffline ? 'on' : ''}`}
                role="switch"
                aria-checked={isSimulatedOffline}
              >
                <div className="pullout-toggle-thumb" />
              </div>
            </div>
          </div>

          {/* 4. Daily Mess Timings (Collapsible) */}
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
