export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type DietaryType = 'veg' | 'non-veg' | 'egg';

export interface MenuItem {
  id: string;
  name: string;
  dietary: DietaryType;
  isSpecial?: boolean;
  category?: 'main' | 'bread' | 'curry' | 'rice' | 'sides' | 'beverage' | 'dessert';
  calories?: number;
}

export interface MealSlot {
  id: string;
  type: MealType;
  label: string;
  timeRange: string;
  startTime: string; // "07:30"
  endTime: string;   // "09:30"
  items: MenuItem[];
  specialNote?: string;
}

export interface DayMenu {
  date: string; // YYYY-MM-DD
  dayName: string; // Monday, Tuesday, ...
  isToday?: boolean;
  isTomorrow?: boolean;
  meals: {
    breakfast: MealSlot;
    lunch: MealSlot;
    snacks: MealSlot;
    dinner: MealSlot;
  };
}

export type AvatarId = 'pro-man-1' | 'pro-man-2' | 'pro-woman-1' | 'pro-woman-2';

export interface StudentProfile {
  name: string;
  messType: 'Special Mess' | 'Non-Veg Mess' | 'Veg Mess';
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'ultra-dark' | 'system';
  avatar?: AvatarId;
}

