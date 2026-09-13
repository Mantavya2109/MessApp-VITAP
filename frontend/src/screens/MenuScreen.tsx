import React, { useState, useMemo } from 'react';
import {
  Bell,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MealCard } from '../components/meals/MealCard';
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
    setActiveTab,
    showToast,
  } = useApp();

  const [isMessModalOpen, setIsMessModalOpen] = useState(false);

  // Available mess options
  const messOptions: Array<'Veg Mess' | 'Special Mess' | 'Non-Veg Mess'> = [
    'Veg Mess',
    'Special Mess',
    'Non-Veg Mess',
  ];

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
    } else {
      showToast('Reached earliest menu in cache', undefined, 'info');
    }
  };

  // Navigate Next Day
  const handleNextDay = () => {
    if (activeDayIndex < schedule.length - 1) {
      const nextDate = schedule[activeDayIndex + 1].date;
      setSelectedMenuDateKey(nextDate);
      if (selectedMenuTab === 'week') setSelectedMenuTab('today');
    } else {
      showToast('Reached end of weekly menu cycle', undefined, 'info');
    }
  };

  // Toggle Week / Day view via Calendar button
  const handleToggleCalendar = () => {
    if (selectedMenuTab === 'week') {
      setSelectedMenuTab('today');
    } else {
      setSelectedMenuTab('week');
    }
  };

  return (
    <div className="menu-screen-container animate-fade-in">
      {/* 1. Top Navigation Bar (Minimal Hamburger, Notification Bell, Avatar) */}
      <header className="menu-top-bar">
        {/* Custom 2-Line Minimal Hamburger */}
        <button
          type="button"
          className="menu-hamburger-btn"
          onClick={() => setActiveTab('profile')}
          aria-label="Open menu options"
          title="Open settings"
        >
          <span className="hamburger-line line-1" />
          <span className="hamburger-line line-2" />
        </button>

        {/* Right Actions (Bell + Circular Illustrated Avatar) */}
        <div className="menu-top-actions">
          <button
            type="button"
            className="notification-bell-btn"
            onClick={() => showToast('No new unread mess notices', undefined, 'info')}
            aria-label="View notifications"
          >
            <Bell size={26} fill="currentColor" strokeWidth={0} />
          </button>

          <button
            type="button"
            className="top-profile-avatar-btn"
            onClick={() => setActiveTab('profile')}
            aria-label="Go to My Profile"
            title={`${profile.name} • ${profile.messType}`}
          >
            {/* Friendly Avatar SVG Illustration */}
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
              <rect width="36" height="36" fill="#FBBF24" />
              {/* Hair */}
              <path d="M 8 16 C 8 8 16 6 24 6 C 28 6 30 10 30 14 C 30 17 28 19 28 19 C 26 13 22 10 18 10 C 14 10 11 12 10 16 Z" fill="#78350F" />
              {/* Face */}
              <circle cx="18" cy="18" r="8" fill="#FDE68A" />
              {/* Eyes */}
              <circle cx="15" cy="17" r="1.2" fill="#78350F" />
              <circle cx="21" cy="17" r="1.2" fill="#78350F" />
              {/* Smile */}
              <path d="M 16 21 Q 18 23 20 21" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              {/* Collar / Shirt */}
              <path d="M 8 36 C 8 28 14 26 18 26 C 22 26 28 28 28 36 Z" fill="#EA580C" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. Centered Mess Selector ("Menu for Veg Mess ˅") */}
      <div className="mess-selector-wrap">
        <button
          type="button"
          className="mess-selector-trigger"
          onClick={() => setIsMessModalOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isMessModalOpen}
        >
          <span className="mess-for-label">Menu for</span>
          <span className="mess-name-underline">{profile.messType}</span>
          <ChevronDown size={17} className="mess-chevron-icon" />
        </button>
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
                type="button"
                className={`date-pill-item ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedMenuDateKey(day.date)}
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
          {mealSlotsOrder.map((mType) => {
            const meal = activeDayMenu.meals[mType];
            if (!meal) return null;
            const isTodayDate = activeDayMenu.date === todayDateKey;
            const isCurrentActive = isTodayDate && mType === currentMealInfo.currentMeal;

            return (
              <MealCard
                key={`${activeDayMenu.date}-${meal.id}`}
                meal={meal}
                dateKey={activeDayMenu.date}
                isHero={isCurrentActive}
                statusOverride={
                  isCurrentActive
                    ? currentMealInfo.status === 'active'
                      ? 'serving'
                      : 'upcoming'
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

      {/* 5. Mess Selection Bottom Sheet Modal */}
      {isMessModalOpen && (
        <div
          className="mess-modal-backdrop"
          onClick={() => setIsMessModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Select Mess Type"
        >
          <div className="mess-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="mess-modal-header">
              <h3 className="mess-modal-title">Select Mess</h3>
              <button
                type="button"
                onClick={() => setIsMessModalOpen(false)}
                style={{ color: '#9CA3AF', padding: '4px' }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mess-modal-options">
              {messOptions.map((opt) => {
                const isSelected = profile.messType === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`mess-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      updateProfile({ messType: opt });
                      setIsMessModalOpen(false);
                      showToast(`Switched to ${opt}`);
                    }}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check size={18} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
