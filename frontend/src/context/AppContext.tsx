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
  getISTDate,
} from '../data/mockData';
import { getWeekSchedule, prefetchAllMessPlans } from '../data/menuRepository';
import { db } from '../data/db';

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
  refreshSchedule: (refDate?: Date | string, forceMessType?: string) => Promise<void>;

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

  // Clean up any legacy simulation flags in storage
  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('messapp_simulate_offline');
      }
    } catch {
      // ignore
    }
  }, []);

  // Real Browser Network State (PWA offline sync via Dexie & Service Worker)
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const isOffline = !isOnline;

  // Live IST Clock & Date Keys
  const [currentIST, setCurrentIST] = useState<Date>(() => getISTDate());
  const [todayDateKey, setTodayDateKey] = useState<string>(() => formatDateKey(getISTDate()));
  const [selectedMenuDateKey, setSelectedMenuDateKey] = useState<string>(() => formatDateKey(getISTDate()));

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

  // Local-first Real Schedule State (Hydrated strictly from Dexie / API)
  const [schedule, setSchedule] = useState<DayMenu[]>([]);

  // Current meal time calculation (Live based on current IST time)
  const currentMealInfo = useMemo(() => getCurrentOrNextMealType(currentIST), [currentIST]);

  // Schedule hydration / refresh function (guarantees caching into Dexie)
  const refreshSchedule = useCallback(
    async (refDate?: Date | string, forceMessType?: string) => {
      const mType = forceMessType || profile.messType;
      const targetDate = refDate
        ? typeof refDate === 'string'
          ? new Date(refDate + 'T00:00:00')
          : refDate
        : getISTDate();

      try {
        const days = await getWeekSchedule(targetDate, mType);
        if (days.length > 0) {
          setSchedule(days);
        }
      } catch (err) {
        console.warn('[AppContext] Could not refresh schedule:', err);
      }
    },
    [profile.messType]
  );

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
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Hydrate schedule from Dexie / API whenever messType changes
  useEffect(() => {
    let isMounted = true;

    getWeekSchedule(currentIST, profile.messType)
      .then((days) => {
        if (isMounted && days.length > 0) {
          setSchedule(days);
          setSelectedMenuDateKey((prev) => {
            const hasPrev = days.some((d) => d.date === prev);
            const hasToday = days.some((d) => d.date === todayDateKey);
            if (hasToday && (!prev || prev === todayDateKey)) return todayDateKey;
            return hasPrev ? prev : days[0].date;
          });
        }
        // Prefetch both plans in background for seamless offline use
        prefetchAllMessPlans().catch(() => { });
      })
      .catch((err) => {
        console.warn('[AppContext] Could not hydrate schedule:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [profile.messType]);

  // 12:00 AM (Midnight IST) automated date and menu rollover
  useEffect(() => {
    const checkMidnightRollover = () => {
      const nowIst = getISTDate();
      const newDateKey = formatDateKey(nowIst);

      if (newDateKey !== todayDateKey) {
        // Midnight transition: update today date key and switch selected menu & date to the new day
        setCurrentIST(nowIst);
        setTodayDateKey(newDateKey);
        setSelectedMenuDateKey(newDateKey);
        refreshSchedule(nowIst);
      } else {
        // Only update time reference if the minute changed to avoid useless re-renders during scrolling
        setCurrentIST((prev) => {
          if (prev.getMinutes() !== nowIst.getMinutes() || prev.getHours() !== nowIst.getHours()) {
            return nowIst;
          }
          return prev;
        });
      }
    };

    // Calculate exact milliseconds until next 12:00:00 AM IST midnight
    const now = getISTDate();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 1, 0); // 12:00:01 AM
    const msUntilMidnight = Math.max(1000, nextMidnight.getTime() - now.getTime());

    const midnightTimer = setTimeout(() => {
      checkMidnightRollover();
    }, msUntilMidnight);

    // Periodic check every 15 seconds to update serving status and catch wake-from-sleep
    const interval = setInterval(checkMidnightRollover, 15000);

    // Also trigger on visibility change or window focus
    const handleVisibilityOrFocus = () => {
      if (!document.hidden) {
        checkMidnightRollover();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      clearTimeout(midnightTimer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [todayDateKey, refreshSchedule]);

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
    const t = new Date(currentIST);
    t.setDate(t.getDate() + 1);
    return formatDateKey(t);
  }, [currentIST]);
  const tomorrowMenu = useMemo(
    () => schedule.find((d) => d.date === tomorrowKey) || null,
    [schedule, tomorrowKey]
  );

  // Save profile to localStorage and Dexie cache
  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next: StudentProfile = {
        ...prev,
        ...updated,
        avatar: updated.avatar || prev.avatar || 'pro-man-1',
      };
      try {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      // Also cache in Dexie DB
      db.metadata.put({
        key: 'studentProfile',
        value: next,
        updatedAt: new Date().toISOString(),
      }).catch(() => { });

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
        refreshSchedule,
        currentMealInfo,
        selectedMenuDateKey,
        setSelectedMenuDateKey,
        selectedMenuTab,
        setSelectedMenuTab,
        profile,
        updateProfile,
        isOffline,
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

