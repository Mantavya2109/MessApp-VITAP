import React from 'react';
import { WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ToastContainer } from '../common/Toast';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { isOffline } = useApp();

  return (
    <div className="app-root-container">
      {/* Subtle Offline status bar */}
      {isOffline && (
        <div className="offline-status-bar" role="status">
          <span className="offline-pulse-dot" />
          <WifiOff size={14} />
          <span>Offline mode · Showing saved local data</span>
        </div>
      )}

      {/* Main container */}
      <main className="app-content-wrapper">
        {children}
      </main>

      {/* Toast notification overlay */}
      <ToastContainer />
    </div>
  );
};
