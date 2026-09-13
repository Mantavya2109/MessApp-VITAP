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
    timeRange: '7:15 AM – 9:00 AM',
    startTime: '07:15',
    endTime: '09:00',
  },
  lunch: {
    label: 'Lunch',
    timeRange: '12:30 PM – 2:00 PM',
    startTime: '12:30',
    endTime: '14:00',
  },
  snacks: {
    label: 'Snacks',
    timeRange: '4:45 PM – 6:15 PM',
    startTime: '16:45',
    endTime: '18:15',
  },
  dinner: {
    label: 'Dinner',
    timeRange: '7:15 PM – 9:00 PM',
    startTime: '19:15',
    endTime: '21:00',
  },
};

// Default Student Profile Settings
export const mockStudentProfile: StudentProfile = {
  name: 'Mantavya Sharma',
  messType: 'Veg Mess',
  notificationsEnabled: true,
  theme: 'dark',
  avatar: 'pro-man-1',
};

// Calculate current IST (Asia/Kolkata) time
export function getISTDate(now: Date = new Date()): Date {
  try {
    const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    return new Date(istString);
  } catch {
    return now;
  }
}

// Determines the currently active meal based on IST clock
export function getCurrentOrNextMealType(now: Date = new Date()): {
  currentMeal: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  greeting: string;
  status: 'active' | 'upcoming' | 'ended';
} {
  const ist = getISTDate(now);
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeVal = hours * 60 + minutes;

  // Greetings
  let greeting = 'Good morning';
  if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon';
  } else if (hours >= 17) {
    greeting = 'Good evening';
  }

  // Check exact active serving windows in IST:
  // Breakfast: 07:15 to 09:00
  if (timeVal >= 7 * 60 + 15 && timeVal <= 9 * 60) {
    return { currentMeal: 'breakfast', greeting, status: 'active' };
  }

  // Lunch: 12:30 to 14:00
  if (timeVal >= 12 * 60 + 30 && timeVal <= 14 * 60) {
    return { currentMeal: 'lunch', greeting, status: 'active' };
  }

  // Snacks: 16:45 to 18:15
  if (timeVal >= 16 * 60 + 45 && timeVal <= 18 * 60 + 15) {
    return { currentMeal: 'snacks', greeting, status: 'active' };
  }

  // Dinner: 19:15 to 21:00
  if (timeVal >= 19 * 60 + 15 && timeVal <= 21 * 60) {
    return { currentMeal: 'dinner', greeting, status: 'active' };
  }

  // Outside serving windows
  let upcomingMeal: 'breakfast' | 'lunch' | 'snacks' | 'dinner' = 'breakfast';
  if (timeVal < 7 * 60 + 15) upcomingMeal = 'breakfast';
  else if (timeVal < 12 * 60 + 30) upcomingMeal = 'lunch';
  else if (timeVal < 16 * 60 + 45) upcomingMeal = 'snacks';
  else if (timeVal < 19 * 60 + 15) upcomingMeal = 'dinner';
  else upcomingMeal = 'breakfast';

  return {
    currentMeal: upcomingMeal,
    greeting,
    status: 'upcoming',
  };
}
