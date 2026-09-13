const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

export interface LikesData {
  count: number;
}

const CACHE_KEY = 'messapp_cached_likes_v1';

/**
 * Synchronously retrieves cached likes count from localStorage (avoids initial flicker).
 */
export function getCachedLikes(): number {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(CACHE_KEY);
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= 0) return val;
      }
    }
  } catch {
    // ignore
  }
  return 0;
}

/**
 * Updates local cache immediately.
 */
export function setCachedLikes(count: number): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CACHE_KEY, String(count));
    }
  } catch {
    // ignore
  }
}

/**
 * Fetch total likes from backend API with fallback to cached value.
 */
export async function fetchTotalLikes(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE_URL}/likes`);
    if (res.ok) {
      const data: LikesData = await res.json();
      if (typeof data.count === 'number') {
        setCachedLikes(data.count);
        return data.count;
      }
    }
  } catch (err) {
    console.warn('[likesRepository] Failed to fetch total likes from server:', err);
  }

  // Fallback to locally cached value
  return getCachedLikes();
}

/**
 * Send likes increment to the backend API with optimistic local caching.
 */
export async function sendLikesIncrement(count: number = 1): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/likes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ count }),
    });

    if (res.ok) {
      const data: LikesData = await res.json();
      if (typeof data.count === 'number') {
        setCachedLikes(data.count);
        return data.count;
      }
    }
  } catch (err) {
    console.warn('[likesRepository] Failed to sync increment with backend:', err);
  }

  return null;
}
