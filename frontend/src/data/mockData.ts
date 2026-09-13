import type { StudentProfile } from '../types';

// Helper to format date strings YYYY-MM-DD
export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayName(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

export function getFormattedDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

// Meal timing definitions
export const MEAL_TIMINGS = {
  breakfast: {
    label: 'Breakfast',
    timeRange: '7:30 AM - 9:30 AM',
    startTime: '07:30',
    endTime: '09:30',
  },
  lunch: {
    label: 'Lunch',
    timeRange: '12:30 PM - 2:30 PM',
    startTime: '12:30',
    endTime: '14:30',
  },
  snacks: {
    label: 'Snacks',
    timeRange: '4:30 PM - 6:15 PM',
    startTime: '16:30',
    endTime: '18:15',
  },
  dinner: {
    label: 'Dinner',
    timeRange: '7:00 PM - 9:00 PM',
    startTime: '19:00',
    endTime: '21:00',
  },
};

// Default Student Profile Settings
export const mockStudentProfile: StudentProfile = {
  name: 'Mantavya Sharma',
  messType: 'Veg Mess',
  notificationsEnabled: true,
  theme: 'dark',
};

// Determines the currently active or next upcoming meal based on clock
export function getCurrentOrNextMealType(now: Date = new Date()): {
  currentMeal: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  greeting: string;
  status: 'active' | 'upcoming' | 'ended';
} {
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeVal = hours * 60 + minutes;

  // Greetings
  let greeting = 'Good morning';
  if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon';
  } else if (hours >= 17) {
    greeting = 'Good evening';
  }

  // Breakfast: 07:30 to 10:00
  if (timeVal < 10 * 60) {
    return {
      currentMeal: 'breakfast',
      greeting,
      status: timeVal >= 7 * 60 + 30 ? 'active' : 'upcoming',
    };
  }

  // Lunch: 12:30 to 15:00
  if (timeVal < 15 * 60) {
    return {
      currentMeal: 'lunch',
      greeting,
      status: timeVal >= 12 * 60 + 30 ? 'active' : 'upcoming',
    };
  }

  // Snacks: 16:30 to 18:30
  if (timeVal < 18 * 60 + 30) {
    return {
      currentMeal: 'snacks',
      greeting,
      status: timeVal >= 16 * 60 + 30 ? 'active' : 'upcoming',
    };
  }

  // Dinner: 19:00 to 22:00
  return {
    currentMeal: 'dinner',
    greeting,
    status: timeVal >= 19 * 60 && timeVal <= 22 * 60 ? 'active' : 'upcoming',
  };
}
