import { db, type DbNightCanteenRecord } from './db';
import type { NightCanteenItem } from '../types';
import { FALLBACK_NIGHT_CANTEEN_ITEMS } from './nightCanteenData';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

/**
 * Maps a Dexie record or API item to the clean frontend NightCanteenItem type.
 */
function mapToNightCanteenItem(item: any): NightCanteenItem {
  return {
    sno: Number(item.sno) || 0,
    type: item.type === 'Non-Veg' ? 'Non-Veg' : 'Veg',
    category: String(item.category || 'Other').trim(),
    name: String(item.name || '').trim(),
    quantity: String(item.quantity || '').trim(),
    price: Number(item.price) || 0,
  };
}

/**
 * Background synchronizer that fetches fresh night canteen items from the server API
 * and updates the local Dexie IndexedDB cache.
 */
export async function syncNightCanteenFromApi(): Promise<NightCanteenItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/night-canteen`);
    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawItems: any[] = data.items || [];
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return [];
    }

    const nowIso = new Date().toISOString();
    const items: NightCanteenItem[] = rawItems.map(mapToNightCanteenItem);

    const recordsToInsert: DbNightCanteenRecord[] = items.map((it) => ({
      sno: it.sno,
      type: it.type,
      category: it.category,
      name: it.name,
      quantity: it.quantity,
      price: it.price,
      updatedAt: nowIso,
    }));

    await db.nightCanteen.bulkPut(recordsToInsert);
    await db.metadata.put({
      key: 'lastSync_nightCanteen',
      value: nowIso,
      updatedAt: nowIso,
    });

    return items;
  } catch (error) {
    console.warn(`[nightCanteenRepository] API sync failed (${API_BASE_URL}/night-canteen):`, error);
    throw error;
  }
}

/**
 * Local-first retrieval of Night Canteen items.
 * Guaranteed to return items immediately from Dexie cache, or seed fallback items into Dexie on first load.
 */
export async function getNightCanteenItems(): Promise<NightCanteenItem[]> {
  try {
    // 1. Read from Dexie IndexedDB
    const cachedRecords = await db.nightCanteen.orderBy('sno').toArray();

    if (cachedRecords.length > 0) {
      const items: NightCanteenItem[] = cachedRecords.map(mapToNightCanteenItem);

      // Revalidate in background if online
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        syncNightCanteenFromApi().catch(() => { });
      }

      return items;
    }

    // 2. If Dexie is empty, try API first, or seed from bundled dataset into Dexie
    try {
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        const freshItems = await syncNightCanteenFromApi();
        if (freshItems.length > 0) return freshItems;
      }
    } catch {
      // fallback to offline bundle
    }

    const nowIso = new Date().toISOString();
    const seedRecords: DbNightCanteenRecord[] = FALLBACK_NIGHT_CANTEEN_ITEMS.map((it) => ({
      sno: it.sno,
      type: it.type,
      category: it.category,
      name: it.name,
      quantity: it.quantity,
      price: it.price,
      updatedAt: nowIso,
    }));

    await db.nightCanteen.bulkPut(seedRecords);
    await db.metadata.put({
      key: 'lastSync_nightCanteen',
      value: nowIso,
      updatedAt: nowIso,
    });

    return FALLBACK_NIGHT_CANTEEN_ITEMS;
  } catch (err) {
    console.warn('[nightCanteenRepository] Dexie load failed, returning fallback items:', err);
    return FALLBACK_NIGHT_CANTEEN_ITEMS;
  }
}
