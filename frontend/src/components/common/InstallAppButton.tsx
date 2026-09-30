import React from 'react';
import { Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePwa } from '../../context/PwaContext';
import './InstallAppButton.css';

export const InstallAppButton: React.FC = () => {
  const { isOffline } = useApp();
  const { isInstalled, canInstall, isInstalling, triggerInstall } = usePwa();

  // Dynamic visibility:
  // If already running as standalone PWA or already installed, hide completely from navbar.
  // If not installable and not on iOS, hide from navbar.
  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <button
      type="button"
      className={`pwa-install-nav-btn ${isOffline ? 'is-offline' : ''}`}
      onClick={triggerInstall}
      disabled={isOffline || isInstalling}
      aria-label={isOffline ? 'Install App (Disabled while offline)' : 'Install MessApp'}
      title={
        isOffline
          ? 'Connect to internet to install MessApp'
          : 'Install MessApp on your device'
      }
    >
      <span className="pwa-install-icon-wrap" aria-hidden="true">
        <Download size={15} strokeWidth={2.4} />
      </span>
      <span className="pwa-install-text">
        <span className="pwa-install-text-full">Install MessApp</span>
        <span className="pwa-install-text-short">Install</span>
      </span>
    </button>
  );
};
