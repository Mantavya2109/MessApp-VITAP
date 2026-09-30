import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import { useApp } from './AppContext';
import './PwaContext.css';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Check if current context is running as an installed standalone PWA
export const checkIsRunningStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  const isWindowControlsOverlay = window.matchMedia('(display-mode: window-controls-overlay)').matches;
  const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isAndroidApp = typeof document !== 'undefined' && document.referrer.startsWith('android-app://');

  return isStandalone || isMinimalUi || isFullscreen || isWindowControlsOverlay || isIosStandalone || isAndroidApp;
};

interface PwaContextType {
  isInstalled: boolean;
  canInstall: boolean;
  isIOS: boolean;
  isInstalling: boolean;
  triggerInstall: () => Promise<void>;
  showIOSModal: boolean;
  setShowIOSModal: (show: boolean) => void;
}

const PwaContext = createContext<PwaContextType | undefined>(undefined);

export const PwaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOffline, showToast } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => checkIsRunningStandalone());
  const [isIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  });
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  // Check getInstalledRelatedApps API if supported in Chromium
  const checkInstalledRelatedApps = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
      try {
        const relatedApps = await (navigator as unknown as { getInstalledRelatedApps: () => Promise<unknown[]> }).getInstalledRelatedApps();
        if (relatedApps && relatedApps.length > 0) {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch {
        // Feature not supported or permission denied
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isMounted = true;

    // 1. Initial check for installed related apps (Chromium PWA detection)
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as unknown as { getInstalledRelatedApps: () => Promise<unknown[]> })
        .getInstalledRelatedApps()
        .then((relatedApps) => {
          if (isMounted && relatedApps && relatedApps.length > 0) {
            setIsInstalled(true);
            setDeferredPrompt(null);
          }
        })
        .catch(() => {});
    }

    // 2. Listen to display-mode change
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = () => {
      if (checkIsRunningStandalone()) {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    // 3. Capture native PWA install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 4. Listen to native appinstalled event (fires immediately after successful install)
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstalling(false);
      setShowIOSModal(false);
      showToast('MessApp Installed!', 'MessApp has been successfully added to your apps.', 'success');
    };

    // 5. Re-check when window regains visibility/focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (checkIsRunningStandalone()) {
          setIsInstalled(true);
          setDeferredPrompt(null);
        } else {
          checkInstalledRelatedApps();
        }
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('focus', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('focus', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkInstalledRelatedApps, showToast]);

  // Unified install trigger used by BOTH Navbar and Settings buttons
  const triggerInstall = useCallback(async () => {
    if (isOffline) {
      showToast('Offline', 'Please connect to the internet to install MessApp.', 'warning');
      return;
    }

    // iOS flow: show clean guidance modal
    if (isIOS && !deferredPrompt) {
      setShowIOSModal(true);
      return;
    }

    // Standard Chromium / Android / Desktop flow
    if (deferredPrompt) {
      try {
        setIsInstalling(true);
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
        } else {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('[PWA] Error triggering install prompt:', err);
        setDeferredPrompt(null);
      } finally {
        setIsInstalling(false);
      }
    } else {
      showToast('Install MessApp', 'Tap your browser menu (⋮) and select "Install app" or "Add to Home Screen".', 'info');
    }
  }, [isOffline, isIOS, deferredPrompt, showToast]);

  const canInstall = !isInstalled && (!!deferredPrompt || isIOS);

  return (
    <PwaContext.Provider
      value={{
        isInstalled,
        canInstall,
        isIOS,
        isInstalling,
        triggerInstall,
        showIOSModal,
        setShowIOSModal,
      }}
    >
      {children}

      {/* Global iOS Guidance Modal accessible from either button */}
      {showIOSModal && (
        <div className="ios-install-backdrop" onClick={() => setShowIOSModal(false)}>
          <div
            className="ios-install-sheet animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Install MessApp on iOS"
          >
            <div className="ios-install-header">
              <span className="ios-install-title">Install MessApp</span>
              <button
                type="button"
                className="ios-install-close-btn"
                onClick={() => setShowIOSModal(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <p className="ios-install-subtitle">
              Install MessApp on your iPhone or iPad for quick access and full-screen experience:
            </p>

            <ol className="ios-install-steps">
              <li className="ios-install-step">
                <div className="ios-step-icon">
                  <Share size={18} color="var(--accent-golden)" />
                </div>
                <div className="ios-step-content">
                  <strong>1. Tap the Share button</strong>
                  <span>Located at the bottom of Safari (or top right on iPad).</span>
                </div>
              </li>
              <li className="ios-install-step">
                <div className="ios-step-icon">
                  <PlusSquare size={18} color="var(--accent-golden)" />
                </div>
                <div className="ios-step-content">
                  <strong>2. Select 'Add to Home Screen'</strong>
                  <span>Scroll down the share menu and tap Add to Home Screen.</span>
                </div>
              </li>
            </ol>

            <button
              type="button"
              className="ios-install-got-it-btn"
              onClick={() => setShowIOSModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </PwaContext.Provider>
  );
};

export const usePwa = () => {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error('usePwa must be used within a PwaProvider');
  }
  return context;
};
