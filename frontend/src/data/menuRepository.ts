import { db, type DbDayMenuRecord } from './db';
import type { DayMenu, MealSlot, MenuItem } from '../types';
import { formatDateKey, getMealTiming, getISTDate } from './mockData';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

/**
 * Resolves frontend messType string to backend MessPlan code.
 */
export function getPlanCode(messType: string): string {
  if (messType.toLowerCase().includes('special')) {
    return 'SPECIAL';
  }
  return 'VEG_NON_VEG';
}

/**
 * Ensures meal slots have the correct date-specific timing (e.g. Sunday/Monday vs Tue-Sat breakfast).
 */
function ensureDynamicMealTimings(meals: DayMenu['meals'], dateKey: string): DayMenu['meals'] {
  const mealTypes = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;
  const updatedMeals = { ...meals };

  for (const mType of mealTypes) {
    if (updatedMeals[mType]) {
      const timing = getMealTiming(mType, dateKey);
      updatedMeals[mType] = {
        ...updatedMeals[mType],
        timeRange: timing.timeRange,
        startTime: timing.startTime,
        endTime: timing.endTime,
      };
    }
  }

  return updatedMeals;
}

/**
 * Maps an API meal slot response to the frontend MealSlot structure.
 */
function mapApiSlotToFrontendSlot(
  apiSlot: any,
  dateKey: string
): MealSlot {
  const typeLower = (apiSlot?.mealType || 'breakfast').toLowerCase() as 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  const timing = getMealTiming(typeLower, dateKey);

  const items: MenuItem[] = (apiSlot?.items || []).map((item: any, idx: number) => {
    let dietary: 'veg' | 'non-veg' | 'egg' = 'veg';
    if (item.dietaryTag === 'NON_VEG') {
      dietary = 'non-veg';
    } else if (item.dietaryTag === 'EGG_LESS' || item.dietaryTag === 'VEG') {
      dietary = 'veg';
    } else {
      const lower = item.name.toLowerCase();
      if (lower.includes('(non-veg)') || lower.includes('(non veg)') || lower.includes('(nv)')) {
        dietary = 'non-veg';
      }
    }

    return {
      id: item.id || `${typeLower}-${idx + 1}`,
      name: item.name,
      dietary,
      isSpecial: item.name.toLowerCase().includes('special') || item.name.toLowerCase().includes('biryani') || item.name.toLowerCase().includes('paneer'),
    };
  });

  return {
    id: `${typeLower}-${dateKey}`,
    type: typeLower,
    label: timing.label.toUpperCase(),
    timeRange: timing.timeRange,
    startTime: timing.startTime,
    endTime: timing.endTime,
    items,
  };
}

/**
 * Maps a single backend MenuDay object into the frontend DayMenu structure.
 */
export function mapApiDayToDayMenu(apiDay: any, todayKey: string, tomorrowKey: string): DayMenu {
  const dateKey = apiDay.date;
  const slots: any[] = apiDay.mealSlots || [];

  const bfSlot = slots.find((s: any) => s.mealType === 'BREAKFAST') || { mealType: 'BREAKFAST', items: [] };
  const luSlot = slots.find((s: any) => s.mealType === 'LUNCH') || { mealType: 'LUNCH', items: [] };
  const snSlot = slots.find((s: any) => s.mealType === 'SNACKS') || { mealType: 'SNACKS', items: [] };
  const dnSlot = slots.find((s: any) => s.mealType === 'DINNER') || { mealType: 'DINNER', items: [] };

  return {
    date: dateKey,
    dayName: apiDay.dayOfWeek,
    isToday: dateKey === todayKey,
    isTomorrow: dateKey === tomorrowKey,
    meals: {
      breakfast: mapApiSlotToFrontendSlot(bfSlot, dateKey),
      lunch: mapApiSlotToFrontendSlot(luSlot, dateKey),
      snacks: mapApiSlotToFrontendSlot(snSlot, dateKey),
      dinner: mapApiSlotToFrontendSlot(dnSlot, dateKey),
    },
  };
}

export const CACHE_VERSION = 'v4_october_2026_timings';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL for background sync revalidation

/**
 * Clears old/stale mock records from Dexie if needed.
 */
export async function clearStaleCache(): Promise<void> {
  try {
    const syncMeta = await db.metadata.get('cacheVersion');
    if (syncMeta?.value !== CACHE_VERSION) {
      await db.menus.clear();
      await db.metadata.put({
        key: 'cacheVersion',
        value: CACHE_VERSION,
        updatedAt: new Date().toISOString(),
      });
      await db.metadata.delete('lastSync_Veg Mess');
      await db.metadata.delete('lastSync_Special Mess');
    }
  } catch (e) {
    console.warn('[menuRepository] Failed to clear stale cache:', e);
  }
}

/**
 * Fetches menu from backend API and caches ALL days of the month into IndexedDB (Dexie).
 * One single sync caches the COMPLETE month (all 31 days).
 */
export async function syncMenusFromApi(refDate: Date = getISTDate(), messType: string = 'Veg Mess'): Promise<DayMenu[]> {
  const planCode = getPlanCode(messType);
  const dateKey = formatDateKey(refDate);

  try {
    const response = await fetch(`${API_BASE_URL}/menu/week?date=${dateKey}&messPlan=${planCode}&range=month`);
    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!data.days || !Array.isArray(data.days) || data.days.length === 0) {
      return [];
    }

    const todayDate = getISTDate();
    const todayKey = formatDateKey(todayDate);
    const tomorrowObj = new Date(todayDate);
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);
    const tomorrowKey = formatDateKey(tomorrowObj);

    const nowIso = new Date().toISOString();
    const dayMenus: DayMenu[] = data.days.map((apiDay: any) => mapApiDayToDayMenu(apiDay, todayKey, tomorrowKey));

    // Save COMPLETE month to IndexedDB Dexie Cache in a single bulk operation
    const recordsToInsert: DbDayMenuRecord[] = dayMenus.map((day) => ({
      id: `${messType}_${day.date}`,
      messType,
      date: day.date,
      dayName: day.dayName,
      isToday: day.isToday,
      isTomorrow: day.isTomorrow,
      meals: day.meals,
      updatedAt: nowIso,
    }));

    await db.menus.bulkPut(recordsToInsert);
    await db.metadata.put({
      key: `lastSync_${messType}`,
      value: nowIso,
      updatedAt: nowIso,
    });

    return dayMenus;
  } catch (error) {
    console.warn(`[menuRepository] Failed to sync from API (${API_BASE_URL}):`, error);
    throw error;
  }
}

/**
 * Retrieves the schedule for a given date and mess type (Local-first: IndexedDB -> Network Sync).
 * Uses local cache directly and only fetches if cache is missing or stale.
 */
export async function getWeekSchedule(
  refDate: Date = getISTDate(),
  messType: string = 'Veg Mess'
): Promise<DayMenu[]> {
  await clearStaleCache();

  const targetDateKey = formatDateKey(refDate);
  const targetMonthPrefix = targetDateKey.substring(0, 7); // "YYYY-MM"

  const todayDate = getISTDate();
  const todayKey = formatDateKey(todayDate);
  const tomorrowObj = new Date(todayDate);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrowObj);

  try {
    // 1. Check Dexie IndexedDB cache first for this messType and month
    const cachedRecords = await db.menus
      .where('messType')
      .equals(messType)
      .filter((rec) => rec.date.startsWith(targetMonthPrefix))
      .sortBy('date');

    if (cachedRecords.length > 0) {
      const cachedDayMenus: DayMenu[] = cachedRecords.map((rec) => ({
        date: rec.date,
        dayName: rec.dayName,
        isToday: rec.date === todayKey,
        isTomorrow: rec.date === tomorrowKey,
        meals: ensureDynamicMealTimings(rec.meals, rec.date),
      }));

      // Background revalidation only if TTL has elapsed
      const lastSyncRecord = await db.metadata.get(`lastSync_${messType}`);
      const lastSyncTime = lastSyncRecord?.value ? new Date(lastSyncRecord.value).getTime() : 0;
      const isStale = Date.now() - lastSyncTime > CACHE_TTL_MS;

      if (isStale) {
        syncMenusFromApi(refDate, messType).catch(() => { });
      }

      return cachedDayMenus;
    }

    // 2. If IndexedDB empty, perform 1 sync for the complete month and cache
    const freshDays = await syncMenusFromApi(refDate, messType);
    return freshDays;
  } catch (err) {
    console.warn('[menuRepository] Menu unavailable:', err);
    return [];
  }
}

/**
 * Fetch a single day menu for a specific date (Local-first with full month fallback).
 */
export async function getDayMenu(
  dateKey: string,
  messType: string = 'Veg Mess'
): Promise<DayMenu | null> {
  const todayDate = getISTDate();
  const todayKey = formatDateKey(todayDate);
  const tomorrowObj = new Date(todayDate);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrowObj);

  // 1. Check Dexie cache
  try {
    const cached = await db.menus.get(`${messType}_${dateKey}`);
    if (cached) {
      return {
        date: cached.date,
        dayName: cached.dayName,
        isToday: cached.date === todayKey,
        isTomorrow: cached.date === tomorrowKey,
        meals: ensureDynamicMealTimings(cached.meals, cached.date),
      };
    }
  } catch (e) {
    console.warn('[menuRepository] Dexie read failed:', e);
  }

  // 2. If not in cache, sync the entire month so all days are loaded at once
  try {
    const targetDate = new Date(dateKey + 'T00:00:00');
    const syncedDays = await syncMenusFromApi(targetDate, messType);
    const found = syncedDays.find((d) => d.date === dateKey);
    if (found) return found;
  } catch (e) {
    console.warn('[menuRepository] Full sync failed:', e);
  }

  return null;
}

/**
 * Prefetches and caches all mess plans in the background for instant offline availability.
 */
export async function prefetchAllMessPlans(refDate: Date = getISTDate()): Promise<void> {
  const plans = ['Veg Mess', 'Special Mess'];
  const targetMonthPrefix = formatDateKey(refDate).substring(0, 7);
  for (const plan of plans) {
    try {
      const count = await db.menus
        .where('messType')
        .equals(plan)
        .filter((rec) => rec.date.startsWith(targetMonthPrefix))
        .count();

      if (count === 0) {
        await syncMenusFromApi(refDate, plan);
      }
    } catch {
      // Quiet background fallback
    }
  }
}

