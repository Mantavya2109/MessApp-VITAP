import Dexie, { type EntityTable } from 'dexie';
import type { MealSlot } from '../types';

export interface DbDayMenuRecord {
  id: string; // compound key: `${messType}_${date}`
  messType: string;
  date: string;
  dayName: string;
  isToday?: boolean;
  isTomorrow?: boolean;
  meals: {
    breakfast: MealSlot;
    lunch: MealSlot;
    snacks: MealSlot;
    dinner: MealSlot;
  };
  updatedAt: string;
}

export interface DbMetadataRecord {
  key: string;
  value: any;
  updatedAt: string;
}

export interface DbNightCanteenRecord {
  sno: number;
  type: 'Veg' | 'Non-Veg';
  category: string;
  name: string;
  quantity: string;
  price: number;
  updatedAt: string;
}

// Dexie IndexedDB Definition for MessApp
export class MessAppDatabase extends Dexie {
  menus!: EntityTable<DbDayMenuRecord, 'id'>;
  nightCanteen!: EntityTable<DbNightCanteenRecord, 'sno'>;
  metadata!: EntityTable<DbMetadataRecord, 'key'>;

  constructor() {
    super('MessAppDB');
    this.version(3).stores({
      menus: 'id, messType, date, [messType+date], updatedAt',
      nightCanteen: 'sno, type, category, name, price, updatedAt',
      metadata: 'key, updatedAt',
      // Explicitly remove tables from v1 that are no longer needed
      attendance: null,
      syncQueue: null,
    });
  }
}

export const db = new MessAppDatabase();

