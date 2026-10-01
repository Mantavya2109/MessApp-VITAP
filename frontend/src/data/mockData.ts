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

// Meal timing definitions and date-aware schedule
export interface TimingScheduleItem {
  meal: string;
  schedules: { days: string; timeRange: string }[];
}

export const MESS_TIMING_SCHEDULE: TimingScheduleItem[] = [
  {
    meal: 'Breakfast',
    schedules: [
      { days: 'Tuesday – Saturday', timeRange: '7:00 AM – 9:00 AM' },
      { days: 'Sunday – Monday', timeRange: '7:15 AM – 9:15 AM' },
    ],
  },
  {
    meal: 'Lunch',
    schedules: [{ days: 'Every day', timeRange: '12:30 PM – 2:15 PM' }],
  },
  {
    meal: 'Snacks',
    schedules: [{ days: 'Every day', timeRange: '4:30 PM – 6:15 PM' }],
  },
  {
    meal: 'Dinner',
    schedules: [{ days: 'Every day', timeRange: '7:15 PM – 9:00 PM' }],
  },
];

export const MEAL_TIMINGS = {
  breakfast: {
    label: 'Breakfast',
    timeRange: '7:00 AM – 9:00 AM',
    startTime: '07:00',
    endTime: '09:00',
  },
  lunch: {
    label: 'Lunch',
    timeRange: '12:30 PM – 2:15 PM',
    startTime: '12:30',
    endTime: '14:15',
  },
  snacks: {
    label: 'Snacks',
    timeRange: '4:30 PM – 6:15 PM',
    startTime: '16:30',
    endTime: '18:15',
  },
  dinner: {
    label: 'Dinner',
    timeRange: '7:15 PM – 9:00 PM',
    startTime: '19:15',
    endTime: '21:00',
  },
};

/**
 * Checks if a date or YYYY-MM-DD date string falls on a Sunday or Monday.
 */
export function isSundayOrMonday(dateOrDateKey?: Date | string): boolean {
  if (!dateOrDateKey) return false;
  let dayOfWeek: number;
  if (typeof dateOrDateKey === 'string') {
    const parts = dateOrDateKey.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      dayOfWeek = new Date(y, m, d).getDay();
    } else {
      dayOfWeek = new Date(dateOrDateKey).getDay();
    }
  } else {
    dayOfWeek = dateOrDateKey.getDay();
  }
  return dayOfWeek === 0 || dayOfWeek === 1; // 0 is Sun, 1 is Mon
}

/**
 * Returns the exact meal timing based on meal type and specific calendar date/weekday.
 */
export function getMealTiming(
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner' | string,
  dateOrDateKey?: Date | string
): { label: string; timeRange: string; startTime: string; endTime: string } {
  const typeLower = mealType.toLowerCase() as 'breakfast' | 'lunch' | 'snacks' | 'dinner';

  if (typeLower === 'breakfast') {
    if (isSundayOrMonday(dateOrDateKey)) {
      return {
        label: 'Breakfast',
        timeRange: '7:15 AM – 9:15 AM',
        startTime: '07:15',
        endTime: '09:15',
      };
    }
    return {
      label: 'Breakfast',
      timeRange: '7:00 AM – 9:00 AM',
      startTime: '07:00',
      endTime: '09:00',
    };
  }

  if (typeLower === 'lunch') {
    return {
      label: 'Lunch',
      timeRange: '12:30 PM – 2:15 PM',
      startTime: '12:30',
      endTime: '14:15',
    };
  }

  if (typeLower === 'snacks') {
    return {
      label: 'Snacks',
      timeRange: '4:30 PM – 6:15 PM',
      startTime: '16:30',
      endTime: '18:15',
    };
  }

  // dinner
  return {
    label: 'Dinner',
    timeRange: '7:15 PM – 9:00 PM',
    startTime: '19:15',
    endTime: '21:00',
  };
}

// Default Student Profile Settings
export const mockStudentProfile: StudentProfile = {
  name: 'Mantavya Sharma',
  messType: 'Veg Mess',
  theme: 'light',
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

// Determines the currently active meal based on IST clock and official weekday timings
export function getCurrentOrNextMealType(now: Date = new Date()): {
  currentMeal: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  greeting: string;
  status: 'active' | 'upcoming' | 'ended';
} {
  const ist = getISTDate(now);
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const timeVal = hours * 60 + minutes;
  const dayOfWeek = ist.getDay();

  // Greetings
  let greeting = 'Good morning';
  if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon';
  } else if (hours >= 17) {
    greeting = 'Good evening';
  }

  // Breakfast serving window:
  // Sunday (0) & Monday (1): 07:15 (435) to 09:15 (555)
  // Tuesday to Saturday (2..6): 07:00 (420) to 09:00 (540)
  const isSunOrMon = dayOfWeek === 0 || dayOfWeek === 1;
  const bfStart = isSunOrMon ? 7 * 60 + 15 : 7 * 60;
  const bfEnd = isSunOrMon ? 9 * 60 + 15 : 9 * 60;

  if (timeVal >= bfStart && timeVal <= bfEnd) {
    return { currentMeal: 'breakfast', greeting, status: 'active' };
  }

  // Lunch: 12:30 (750) to 14:15 (855) (2:15 PM)
  const luStart = 12 * 60 + 30;
  const luEnd = 14 * 60 + 15;
  if (timeVal >= luStart && timeVal <= luEnd) {
    return { currentMeal: 'lunch', greeting, status: 'active' };
  }

  // Snacks: 16:30 (990) to 18:15 (1095) (4:30 PM to 6:15 PM)
  const snStart = 16 * 60 + 30;
  const snEnd = 18 * 60 + 15;
  if (timeVal >= snStart && timeVal <= snEnd) {
    return { currentMeal: 'snacks', greeting, status: 'active' };
  }

  // Dinner: 19:15 (1155) to 21:00 (1260) (7:15 PM to 9:00 PM)
  const dnStart = 19 * 60 + 15;
  const dnEnd = 21 * 60;
  if (timeVal >= dnStart && timeVal <= dnEnd) {
    return { currentMeal: 'dinner', greeting, status: 'active' };
  }

  // Outside serving windows
  let upcomingMeal: 'breakfast' | 'lunch' | 'snacks' | 'dinner' = 'breakfast';
  if (timeVal < bfStart) upcomingMeal = 'breakfast';
  else if (timeVal < luStart) upcomingMeal = 'lunch';
  else if (timeVal < snStart) upcomingMeal = 'snacks';
  else if (timeVal < dnStart) upcomingMeal = 'dinner';
  else upcomingMeal = 'breakfast';

  return {
    currentMeal: upcomingMeal,
    greeting,
    status: 'upcoming',
  };
}
