import React from 'react';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="app-root-container">
      {/* Main container */}
      <main className="app-content-wrapper">
        {children}
      </main>
    </div>
  );
};
