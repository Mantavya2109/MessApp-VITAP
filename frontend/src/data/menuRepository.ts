import { db, type DbDayMenuRecord } from './db';
import type { DayMenu, MealSlot, MenuItem } from '../types';
import { formatDateKey, MEAL_TIMINGS, getISTDate } from './mockData';

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
 * Maps an API meal slot response to the frontend MealSlot structure.
 */
function mapApiSlotToFrontendSlot(
  apiSlot: any,
  dateKey: string
): MealSlot {
  const typeLower = (apiSlot?.mealType || 'breakfast').toLowerCase() as 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  const timing = MEAL_TIMINGS[typeLower] || MEAL_TIMINGS.breakfast;

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

/**
 * Clears old/stale mock records from Dexie if needed.
 */
export async function clearStaleCache(): Promise<void> {
  try {
    const syncMeta = await db.metadata.get('cacheVersion');
    if (syncMeta?.value !== 'v2_september_2026') {
      await db.menus.clear();
      await db.metadata.put({
        key: 'cacheVersion',
        value: 'v2_september_2026',
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.warn('[menuRepository] Failed to clear stale cache:', e);
  }
}

/**
 * Checks if Simulate Offline Mode is enabled in localStorage.
 */
export function isSimulatedOffline(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem('messapp_simulate_offline') === 'true';
  } catch {
    return false;
  }
}

/**
 * Fetches menu from backend API and caches all days into IndexedDB (Dexie).
 */
export async function syncMenusFromApi(refDate: Date = getISTDate(), messType: string = 'Veg Mess'): Promise<DayMenu[]> {
  if (isSimulatedOffline()) {
    throw new Error('Network requests blocked (Simulate Offline Mode is active)');
  }

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

    // Save to IndexedDB Dexie Cache
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
 */
export async function getWeekSchedule(
  refDate: Date = getISTDate(),
  messType: string = 'Veg Mess'
): Promise<DayMenu[]> {
  await clearStaleCache();

  const todayDate = getISTDate();
  const todayKey = formatDateKey(todayDate);
  const tomorrowObj = new Date(todayDate);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowKey = formatDateKey(tomorrowObj);

  try {
    // 1. Check Dexie IndexedDB cache first
    const cachedRecords = await db.menus
      .where('messType')
      .equals(messType)
      .sortBy('date');

    if (cachedRecords.length > 0) {
      const cachedDayMenus: DayMenu[] = cachedRecords.map((rec) => ({
        date: rec.date,
        dayName: rec.dayName,
        isToday: rec.date === todayKey,
        isTomorrow: rec.date === tomorrowKey,
        meals: rec.meals,
      }));

      // Background revalidation only if NOT simulated offline
      if (!isSimulatedOffline()) {
        syncMenusFromApi(refDate, messType).catch(() => { });
      }

      return cachedDayMenus;
    }

    // 2. If IndexedDB empty and simulated offline, do not attempt network request
    if (isSimulatedOffline()) {
      return [];
    }

    // 3. If IndexedDB empty, fetch from API and cache
    const freshDays = await syncMenusFromApi(refDate, messType);
    return freshDays;
  } catch (err) {
    console.warn('[menuRepository] Menu unavailable:', err);
    return [];
  }
}

/**
 * Fetch a single day menu for a specific date and guarantees it is added to Dexie cache.
 */
export async function getDayMenu(
  dateKey: string,
  messType: string = 'Veg Mess'
): Promise<DayMenu | null> {
  const planCode = getPlanCode(messType);
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
        meals: cached.meals,
      };
    }
  } catch (e) {
    console.warn('[menuRepository] Dexie read failed:', e);
  }

  // 2. If simulated offline, don't attempt network
  if (isSimulatedOffline()) {
    return null;
  }

  // 3. Fetch from API and store into Dexie cache
  try {
    const response = await fetch(`${API_BASE_URL}/menu?date=${dateKey}&messPlan=${planCode}`);
    if (response.ok) {
      const data = await response.json();
      if (data.day) {
        const dayMenu = mapApiDayToDayMenu(data.day, todayKey, tomorrowKey);
        await db.menus.put({
          id: `${messType}_${dayMenu.date}`,
          messType,
          date: dayMenu.date,
          dayName: dayMenu.dayName,
          isToday: dayMenu.isToday,
          isTomorrow: dayMenu.isTomorrow,
          meals: dayMenu.meals,
          updatedAt: new Date().toISOString(),
        });
        return dayMenu;
      }
    }
  } catch (e) {
    console.warn('[menuRepository] API read failed:', e);
  }

  return null;
}

/**
 * Prefetches and caches all mess plans in the background for instant offline availability.
 */
export async function prefetchAllMessPlans(): Promise<void> {
  if (isSimulatedOffline()) return;

  const plans = ['Veg Mess', 'Special Mess'];
  for (const plan of plans) {
    try {
      await syncMenusFromApi(getISTDate(), plan);
    } catch {
      // Quiet background fallback
    }
  }
}

