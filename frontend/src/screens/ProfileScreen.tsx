import {
  Moon,
  Sun,
  Clock,
  MessageSquare,
  ChevronRight,
  ArrowLeft,
  Download,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePwa } from '../context/PwaContext';
import { MEAL_TIMINGS } from '../data/mockData';
import './ProfileScreen.css';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    updateProfile,
    setActiveTab,
    isOffline,
  } = useApp();
  const { isInstalled, isInstalling, triggerInstall } = usePwa();

  const handleFeedback = () => {
    // Open feedback
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
          {/* Appearance / Theme Selector */}
          <div className="profile-setting-item theme-setting-item">
            <div className="profile-setting-left">
              <div className="setting-icon-wrap">
                {profile.theme === 'light' ? <Sun size={17} /> : <Moon size={17} />}
              </div>
              <div className="setting-texts">
                <span className="setting-label">Appearance</span>
                <span className="setting-desc">
                  {profile.theme === 'ultra-dark'
                    ? 'Ultra Dark'
                    : profile.theme === 'light'
                    ? 'Light Mode'
                    : 'Dark Mode'}
                </span>
              </div>
            </div>
            <div className="theme-toggle-pills" role="radiogroup" aria-label="Theme Selection">
              <button
                type="button"
                className={`theme-pill ${profile.theme === 'light' || !profile.theme ? 'active' : ''}`}
                onClick={() => {
                  updateProfile({ theme: 'light' });
                }}
              >
                <span className="theme-pill-recommended-badge">Recommended</span>
                Light
              </button>
              <button
                type="button"
                className={`theme-pill ${profile.theme === 'dark' ? 'active' : ''}`}
                onClick={() => {
                  updateProfile({ theme: 'dark' });
                }}
              >
                Dark
              </button>
              <button
                type="button"
                className={`theme-pill ${profile.theme === 'ultra-dark' ? 'active' : ''}`}
                onClick={() => {
                  updateProfile({ theme: 'ultra-dark' });
                }}
              >
                Ultra Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Installation Section (Permanent in Settings) */}
      <div className="profile-section-group">
        <span className="profile-section-title">App Installation</span>
        <div className="profile-settings-card">
          <div
            className={`profile-setting-item ${!isInstalled && !isOffline ? 'clickable' : ''}`}
            onClick={() => {
              if (!isInstalled && !isOffline) {
                triggerInstall();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={isInstalled ? 'MessApp is already installed' : isOffline ? 'Installation disabled offline' : 'Install MessApp'}
            aria-disabled={isInstalled || isOffline}
          >
            <div className="profile-setting-left">
              <div className={`setting-icon-wrap ${isInstalled ? 'icon-installed' : ''}`}>
                {isInstalled ? <Check size={17} strokeWidth={2.8} /> : <Download size={17} />}
              </div>
              <div className="setting-texts">
                <span className="setting-label">{isInstalled ? 'MessApp Installed' : 'Install MessApp'}</span>
                <span className="setting-desc">
                  {isInstalled
                    ? 'Installed on this device as a PWA'
                    : 'Install on your device for 1-tap offline access'}
                </span>
              </div>
            </div>

            {isInstalled ? (
              <div className="pullout-installed-badge" aria-label="Already installed">
                <Check size={12} strokeWidth={3} />
                <span>Installed</span>
              </div>
            ) : (
              <button
                type="button"
                className={`pullout-install-action-btn ${isOffline ? 'btn-disabled' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  triggerInstall();
                }}
                disabled={isOffline || isInstalling}
                aria-label={isOffline ? 'Install disabled offline' : 'Install MessApp'}
                title={isOffline ? 'Connect to internet to install' : 'Install MessApp'}
              >
                <Download size={13} strokeWidth={2.4} />
                <span>{isOffline ? 'Offline' : 'Install'}</span>
              </button>
            )}
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
        <p style={{ marginTop: '3px', opacity: 0.7 }}>
          Designed for students by{' '}
          <a
            href="https://www.linkedin.com/in/mantavya-patel-53b49932b/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-creator-link"
          >
            Mantavya Patel
          </a>
        </p>
      </footer>
    </div>
  );
};
