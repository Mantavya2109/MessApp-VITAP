import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  DayMenu,
  MealType,
  StudentProfile,
} from '../types';
import {
  formatDateKey,
  mockStudentProfile,
  getCurrentOrNextMealType,
} from '../data/mockData';
import { getWeekSchedule } from '../data/menuRepository';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  activeTab: 'menu' | 'profile';
  setActiveTab: (tab: 'menu' | 'profile') => void;
  
  // Menus & Schedule
  schedule: DayMenu[];
  todayMenu: DayMenu | null;
  tomorrowMenu: DayMenu | null;
  todayDateKey: string;
  
  // Current active/upcoming meal info
  currentMealInfo: {
    currentMeal: MealType;
    greeting: string;
    status: 'active' | 'upcoming' | 'ended';
  };
  
  // Selection
  selectedMenuDateKey: string;
  setSelectedMenuDateKey: (dateKey: string) => void;
  selectedMenuTab: 'today' | 'tomorrow' | 'week';
  setSelectedMenuTab: (tab: 'today' | 'tomorrow' | 'week') => void;
  
  // Profile
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  
  // Network / Offline & Toasts
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  toasts: ToastItem[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'messapp_student_profile_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'profile'>('menu');
  const [selectedMenuTab, setSelectedMenuTab] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Real Browser Network State + Optional Dev Simulation
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const isOffline = !isOnline || isSimulatedOffline;

  // Real system / browser local date
  const today = useMemo(() => new Date(), []);
  const todayDateKey = useMemo(() => formatDateKey(today), [today]);
  const [selectedMenuDateKey, setSelectedMenuDateKey] = useState<string>(todayDateKey);

  // Profile state initialized from localStorage
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        return { ...mockStudentProfile, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return mockStudentProfile;
  });

  // Local-first Real Schedule State (Starts empty, hydrated strictly from Dexie / API)
  const [schedule, setSchedule] = useState<DayMenu[]>([]);

  // Current meal time calculation
  const currentMealInfo = useMemo(() => getCurrentOrNextMealType(today), [today]);

  // Toast dispatch
  const showToast = useCallback(
    (
      title: string,
      message?: string,
      type: 'success' | 'info' | 'warning' | 'error' = 'success'
    ) => {
      const id = `${Date.now()}_${Math.random()}`;
      setToasts((prev) => [...prev, { id, title, message, type }]);
      setTimeout(() => {
        dismissToast(id);
      }, 3200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Listen to real browser network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Back Online', 'Synchronizing with mess servers', 'success');
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast('Offline Mode Active', 'Serving saved menu from local cache', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Hydrate real menu from Dexie / API whenever messType changes
  useEffect(() => {
    let isMounted = true;

    getWeekSchedule(today, profile.messType)
      .then((days) => {
        if (isMounted && days.length > 0) {
          setSchedule(days);
          setSelectedMenuDateKey((prev) => {
            const hasPrev = days.some((d) => d.date === prev);
            const hasToday = days.some((d) => d.date === todayDateKey);
            if (hasToday) return todayDateKey;
            return hasPrev ? prev : days[0].date;
          });
        }
      })
      .catch((err) => {
        console.warn('[AppContext] Could not hydrate schedule:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [today, todayDateKey, profile.messType]);

  // Apply theme dynamically to documentElement
  useEffect(() => {
    const currentTheme = profile.theme || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [profile.theme]);

  // Derived today & tomorrow menus from real schedule
  const todayMenu = useMemo(
    () => schedule.find((d) => d.date === todayDateKey) || null,
    [schedule, todayDateKey]
  );
  const tomorrowKey = useMemo(() => {
    const t = new Date(today);
    t.setDate(t.getDate() + 1);
    return formatDateKey(t);
  }, [today]);
  const tomorrowMenu = useMemo(
    () => schedule.find((d) => d.date === tomorrowKey) || null,
    [schedule, tomorrowKey]
  );

  // Save profile to localStorage
  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        schedule,
        todayMenu,
        tomorrowMenu,
        todayDateKey,
        currentMealInfo,
        selectedMenuDateKey,
        setSelectedMenuDateKey,
        selectedMenuTab,
        setSelectedMenuTab,
        profile,
        updateProfile,
        isOffline,
        setIsOffline: setIsSimulatedOffline,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
