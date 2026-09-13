import React from 'react';
import {
  Bell,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Clock,
  MessageSquare,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MEAL_TIMINGS } from '../data/mockData';
import './ProfileScreen.css';

export const ProfileScreen: React.FC = () => {
  const { profile, updateProfile, isOffline, setIsOffline, showToast, setActiveTab } = useApp();

  const handleToggleTheme = () => {
    const nextTheme = profile.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ theme: nextTheme });
    showToast(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
  };

  const handleToggleNotifications = () => {
    const nextVal = !profile.notificationsEnabled;
    updateProfile({ notificationsEnabled: nextVal });
    showToast(nextVal ? 'Meal reminders enabled' : 'Meal reminders muted');
  };

  const handleToggleOffline = () => {
    const nextVal = !isOffline;
    setIsOffline(nextVal);
    if (nextVal) {
      showToast('Offline Mode Active', 'Serving saved menu from local cache', 'info');
    } else {
      showToast('Connected to Network', 'Synchronized with mess servers', 'success');
    }
  };

  const handleFeedback = () => {
    showToast('Feedback form', 'Redirecting to hostel mess feedback portal...', 'info');
  };

  return (
    <div className="profile-screen-container animate-fade-in">
      {/* Top Back Nav & Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-xs)',
          }}
          aria-label="Back to Menu"
          title="Back to Menu"
        >
          <ArrowLeft size={18} strokeWidth={2.4} />
        </button>
        <h2 className="profile-title" style={{ margin: 0 }}>Settings</h2>
      </div>

      {/* Preferences & App Settings */}
      <div className="profile-section-group">
        <span className="profile-section-title">Preferences</span>
        <div className="profile-settings-card">
          {/* Dark Mode */}
          <div className="profile-setting-item" onClick={handleToggleTheme} style={{ cursor: 'pointer' }}>
            <div className="profile-setting-left">
              <div className="setting-icon-wrap">
                {profile.theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
              </div>
              <div className="setting-texts">
                <span className="setting-label">Dark Mode</span>
                <span className="setting-desc">Currently {profile.theme === 'dark' ? 'Dark' : 'Light'}</span>
              </div>
            </div>
            <div className={`toggle-switch ${profile.theme === 'dark' ? 'on' : ''}`} role="switch" aria-checked={profile.theme === 'dark'}>
              <div className="toggle-handle" />
            </div>
          </div>

          {/* Notifications */}
          <div className="profile-setting-item" onClick={handleToggleNotifications} style={{ cursor: 'pointer' }}>
            <div className="profile-setting-left">
              <div className="setting-icon-wrap">
                <Bell size={17} />
              </div>
              <div className="setting-texts">
                <span className="setting-label">Meal Reminders</span>
                <span className="setting-desc">Get notified 15 mins before meals</span>
              </div>
            </div>
            <div className={`toggle-switch ${profile.notificationsEnabled ? 'on' : ''}`} role="switch" aria-checked={profile.notificationsEnabled}>
              <div className="toggle-handle" />
            </div>
          </div>

          {/* Offline Mode Simulator */}
          <div className="profile-setting-item" onClick={handleToggleOffline} style={{ cursor: 'pointer' }}>
            <div className="profile-setting-left">
              <div className="setting-icon-wrap" style={{ color: isOffline ? '#D97706' : 'var(--veg-color)' }}>
                {isOffline ? <WifiOff size={17} /> : <Wifi size={17} />}
              </div>
              <div className="setting-texts">
                <span className="setting-label">Simulate Offline Mode</span>
                <span className="setting-desc">{isOffline ? 'Using local saved cache' : 'Live network active'}</span>
              </div>
            </div>
            <div className={`toggle-switch ${isOffline ? 'on' : ''}`} role="switch" aria-checked={isOffline}>
              <div className="toggle-handle" />
            </div>
          </div>
        </div>
      </div>

      {/* Mess Timings Section */}
      <div className="profile-section-group">
        <span className="profile-section-title">Daily Mess Timings</span>
        <div className="profile-settings-card">
          {Object.entries(MEAL_TIMINGS).map(([key, val]) => (
            <div key={key} className="profile-setting-item">
              <div className="profile-setting-left">
                <div className="setting-icon-wrap">
                  <Clock size={16} />
                </div>
                <div className="setting-texts">
                  <span className="setting-label">{val.label}</span>
                  <span className="setting-desc">{val.timeRange}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support & Feedback */}
      <div className="profile-section-group">
        <span className="profile-section-title">Support & Feedback</span>
        <div className="profile-settings-card">
          <div className="profile-setting-item" onClick={handleFeedback} style={{ cursor: 'pointer' }}>
            <div className="profile-setting-left">
              <div className="setting-icon-wrap">
                <MessageSquare size={17} />
              </div>
              <div className="setting-texts">
                <span className="setting-label">Mess Committee Feedback</span>
                <span className="setting-desc">Report food quality or request items</span>
              </div>
            </div>
            <ChevronRight size={16} color="var(--text-tertiary)" />
          </div>
        </div>
      </div>

      {/* App Meta Info */}
      <footer className="app-meta-badge">
        <p>MessApp PWA v1.0.0 • VIT-AP University</p>
        <p style={{ marginTop: '2px', opacity: 0.7 }}>Designed for Students</p>
      </footer>
    </div>
  );
};
