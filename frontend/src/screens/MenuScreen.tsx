import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Bell,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MealCard } from '../components/meals/MealCard';
import { SettingsPullout } from '../components/settings/SettingsPullout';
import { AvatarIcon } from '../components/profile/AvatarIcon';
import { AvatarSelectorPopover } from '../components/profile/AvatarSelectorPopover';
import './MenuScreen.css';

export const MenuScreen: React.FC = () => {
  const {
    schedule,
    selectedMenuDateKey,
    setSelectedMenuDateKey,
    selectedMenuTab,
    setSelectedMenuTab,
    todayDateKey,
    currentMealInfo,
    profile,
    updateProfile,
    refreshSchedule,
  } = useApp();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const activePillRef = useRef<HTMLButtonElement | null>(null);

  // Auto scroll active date pill into center when week calendar view is open
  useEffect(() => {
    if (selectedMenuTab === 'week' && activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedMenuTab, selectedMenuDateKey]);

  // Find active day menu from schedule
  const activeDayIndex = useMemo(() => {
    return schedule.findIndex((d) => d.date === selectedMenuDateKey);
  }, [schedule, selectedMenuDateKey]);

  const activeDayMenu = activeDayIndex >= 0 ? schedule[activeDayIndex] : (schedule.length > 0 ? schedule[0] : null);

  const mealSlotsOrder = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;

  // Format date exactly like reference: "Sun, 13th Sep"
  const formattedDateTitle = useMemo(() => {
    const targetDate = activeDayMenu?.date || selectedMenuDateKey;
    const d = new Date(targetDate + 'T00:00:00');
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });

    // Ordinal suffix (1st, 2nd, 3rd, 13th...)
    const getOrdinal = (n: number) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${weekday}, ${dayNum}${getOrdinal(dayNum)} ${month}`;
  }, [activeDayMenu?.date, selectedMenuDateKey]);

  // Navigate Previous Day
  const handlePrevDay = () => {
    if (activeDayIndex > 0) {
      const prevDate = schedule[activeDayIndex - 1].date;
      setSelectedMenuDateKey(prevDate);
      if (selectedMenuTab === 'week') setSelectedMenuTab('today');
      refreshSchedule(prevDate);
    }
  };

  // Navigate Next Day
  const handleNextDay = () => {
    if (activeDayIndex < schedule.length - 1) {
      const nextDate = schedule[activeDayIndex + 1].date;
      setSelectedMenuDateKey(nextDate);
      if (selectedMenuTab === 'week') setSelectedMenuTab('today');
      refreshSchedule(nextDate);
    }
  };

  // Toggle Week / Day view via Calendar button (Directly jumps to current date & caches all dates)
  const handleToggleCalendar = () => {
    if (selectedMenuTab === 'week') {
      setSelectedMenuTab('today');
    } else {
      setSelectedMenuTab('week');
      const hasToday = schedule.some((d) => d.date === todayDateKey);
      if (hasToday) {
        setSelectedMenuDateKey(todayDateKey);
      }
      // Proactively ensure schedule and selected date are fully cached in Dexie
      refreshSchedule(todayDateKey);
    }
  };

  return (
    <div className="menu-screen-container animate-fade-in">
      {/* 1. Top Navigation Bar (Hamburger, subtle "VIT - AP Mess" label, Notification Bell, Avatar) */}
      <header className="menu-top-bar">
        {/* Custom 2-Line Minimal Hamburger */}
        <button
          type="button"
          className="menu-hamburger-btn"
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          aria-label="Open settings menu"
          title="Open settings"
        >
          <span className="hamburger-line line-1" />
          <span className="hamburger-line line-2" />
        </button>

        {/* Floating Pullout Settings Menu Anchored under Hamburger */}
        <SettingsPullout isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        {/* Subtle App Identity Label between Settings and Bell */}
        <div className="menu-app-brand-badge" aria-label="VIT - AP Mess">
          <span className="brand-text-label">VIT - AP Mess</span>
        </div>

        {/* Right Actions (Bell + Circular Illustrated Avatar) */}
        <div className="menu-top-actions">
          <button
            type="button"
            className="notification-bell-btn"
            aria-label="View notifications"
          >
            <Bell size={26} fill="currentColor" strokeWidth={0} />
          </button>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="top-profile-avatar-btn"
              onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
              aria-label="Select Avatar"
              title="Change Profile Avatar"
            >
              <AvatarIcon avatarId={profile.avatar || 'pro-man-1'} size={38} />
            </button>

            {/* Avatar Selector Floating Box */}
            <AvatarSelectorPopover
              isOpen={isAvatarPickerOpen}
              currentAvatarId={profile.avatar || 'pro-man-1'}
              onSelect={(newAvatar) => updateProfile({ avatar: newAvatar })}
              onClose={() => setIsAvatarPickerOpen(false)}
            />
          </div>
        </div>
      </header>

      {/* 2. Compact Mess Segmented Toggle (Veg & Non-Veg / Special) */}
      <div className="mess-selector-wrap">
        <div className="compact-mess-segmented-toggle" role="radiogroup" aria-label="Select mess plan">
          <button
            type="button"
            role="radio"
            aria-checked={profile.messType !== 'Special Mess'}
            className={`compact-mess-pill ${profile.messType !== 'Special Mess' ? 'active' : ''}`}
            onClick={() => {
              if (profile.messType === 'Special Mess') {
                updateProfile({ messType: 'Veg Mess' });
              }
            }}
          >
            Veg &amp; Non-Veg
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={profile.messType === 'Special Mess'}
            className={`compact-mess-pill ${profile.messType === 'Special Mess' ? 'active' : ''}`}
            onClick={() => {
              if (profile.messType !== 'Special Mess') {
                updateProfile({ messType: 'Special Mess' });
              }
            }}
          >
            Special
          </button>
        </div>
      </div>

      {/* 3. Date Navigation Row (Sun, 13th Sep   [📅] [←] [→]) */}
      <div className="menu-date-controls-row">
        <h1 className="menu-current-date-title">{formattedDateTitle}</h1>

        <div className="menu-circular-actions">
          {/* Calendar Toggle Button */}
          <button
            type="button"
            className={`circle-nav-btn circle-btn-calendar ${selectedMenuTab === 'week' ? 'active' : ''}`}
            onClick={handleToggleCalendar}
            aria-label="Toggle Full Week Schedule"
            title="Toggle Week View"
          >
            <CalendarIcon size={20} stroke="#11141A" strokeWidth={2.4} />
          </button>

          {/* Previous Day Arrow */}
          <button
            type="button"
            className="circle-nav-btn circle-btn-arrow"
            onClick={handlePrevDay}
            aria-label="Previous Day"
            title="Previous Day"
          >
            <ChevronLeft size={22} stroke="#11141A" strokeWidth={3.2} />
          </button>

          {/* Next Day Arrow */}
          <button
            type="button"
            className="circle-nav-btn circle-btn-arrow"
            onClick={handleNextDay}
            aria-label="Next Day"
            title="Next Day"
          >
            <ChevronRight size={22} stroke="#11141A" strokeWidth={3.2} />
          </button>
        </div>
      </div>

      {/* Full Week Horizontal Day Selector (When Calendar Week view is toggled) */}
      {selectedMenuTab === 'week' && (
        <div className="date-pill-scroll" aria-label="Select day of week">
          {schedule.map((day) => {
            const isSelected = selectedMenuDateKey === day.date;
            const dateObj = new Date(day.date + 'T00:00:00');
            const dayNum = dateObj.getDate();
            const shortDay = day.dayName.slice(0, 3);

            return (
              <button
                key={day.date}
                ref={isSelected ? activePillRef : null}
                type="button"
                className={`date-pill-item ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setSelectedMenuDateKey(day.date);
                  refreshSchedule(day.date);
                }}
              >
                <span className="date-pill-day">{day.isToday ? 'Today' : shortDay}</span>
                <span className="date-pill-date">{dayNum}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Vertical Stack of Meal Cards (BREAKFAST, LUNCH, SNACKS, DINNER) */}
      {activeDayMenu ? (
        <div className="meals-vertical-stack animate-fade-in">
          {mealSlotsOrder.map((mType, idx) => {
            const meal = activeDayMenu.meals[mType];
            if (!meal) return null;
            const isTodayDate = activeDayMenu.date === todayDateKey;
            const isCurrentActive = isTodayDate && mType === currentMealInfo.currentMeal;

            return (
              <MealCard
                key={`${activeDayMenu.date}-${meal.id}`}
                meal={meal}
                dateKey={activeDayMenu.date}
                staggerIndex={idx}
                isHero={isCurrentActive && currentMealInfo.status === 'active'}
                statusOverride={
                  isCurrentActive && currentMealInfo.status === 'active'
                    ? 'serving'
                    : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="menu-empty-state" style={{ padding: '60px 20px', textAlign: 'center', color: '#9CA3AF' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Menu not available</p>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>No menu published for this date.</p>
        </div>
      )}
    </div>
  );
};
