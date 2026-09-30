const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const ANONYMOUS_USER_ID_KEY = 'messapp_anonymous_user_id_v1';

/**
 * Returns a persistent anonymous device/browser UUID.
 * Stored locally so that the same installed PWA/browser identity is recognized.
 */
export function getAnonymousUserId(): string {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'anon_guest_device';
  }

  try {
    const existing = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
    if (existing && existing.trim().length >= 8) {
      return existing.trim();
    }

    let newId: string;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      newId = crypto.randomUUID();
    } else {
      newId = 'anon_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
    }

    localStorage.setItem(ANONYMOUS_USER_ID_KEY, newId);
    return newId;
  } catch (err) {
    console.warn('[likesRepository] Error accessing localStorage for anonymous ID:', err);
    return 'anon_fallback_device';
  }
}

export interface AppLikesResponse {
  totalLikes: number;
  userLiked: boolean;
  count?: number;
  success?: boolean;
}

const CACHE_KEY_COUNT = 'messapp_cached_likes_v2';
const CACHE_KEY_USER_LIKED = 'messapp_user_liked_app_v2';

/**
 * Synchronously retrieves cached app likes data from localStorage.
 */
export function getCachedAppLikes(): { totalLikes: number; userLiked: boolean } {
  let totalLikes = 0;
  let userLiked = false;

  try {
    if (typeof localStorage !== 'undefined') {
      const savedCount = localStorage.getItem(CACHE_KEY_COUNT);
      if (savedCount) {
        const val = parseInt(savedCount, 10);
        if (!isNaN(val) && val >= 0) totalLikes = val;
      }
      userLiked = localStorage.getItem(CACHE_KEY_USER_LIKED) === 'true';
    }
  } catch {
    // ignore
  }

  return { totalLikes, userLiked };
}

export function getCachedLikes(): number {
  return getCachedAppLikes().totalLikes;
}

/**
 * Updates local cache.
 */
export function setCachedAppLikes(totalLikes: number, userLiked: boolean): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(CACHE_KEY_COUNT, String(totalLikes));
      localStorage.setItem(CACHE_KEY_USER_LIKED, String(userLiked));
    }
  } catch {
    // ignore
  }
}

export function setCachedLikes(count: number): void {
  setCachedAppLikes(count, getCachedAppLikes().userLiked);
}

/**
 * Fetch total global app likes from backend API with fallback to cached value.
 */
export async function fetchAppLikes(): Promise<{ totalLikes: number; userLiked: boolean }> {
  const anonymousUserId = getAnonymousUserId();

  try {
    const res = await fetch(`${API_BASE_URL}/app-like?anonymousUserId=${encodeURIComponent(anonymousUserId)}`);
    if (res.ok) {
      const data: AppLikesResponse = await res.json();
      const count = typeof data.totalLikes === 'number' ? data.totalLikes : (typeof data.count === 'number' ? data.count : 0);
      const liked = !!data.userLiked;
      setCachedAppLikes(count, liked);
      return { totalLikes: count, userLiked: liked };
    }
  } catch (err) {
    console.warn('[likesRepository] Failed to fetch app likes from server:', err);
  }

  return getCachedAppLikes();
}

export async function fetchTotalLikes(): Promise<number> {
  const data = await fetchAppLikes();
  return data.totalLikes;
}

/**
 * Send like to the backend API (1 like per installation/anonymous ID).
 */
export async function sendAppLike(): Promise<{ totalLikes: number; userLiked: boolean } | null> {
  const anonymousUserId = getAnonymousUserId();

  try {
    const res = await fetch(`${API_BASE_URL}/app-like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ anonymousUserId }),
    });

    if (res.ok) {
      const data: AppLikesResponse = await res.json();
      const count = typeof data.totalLikes === 'number' ? data.totalLikes : (typeof data.count === 'number' ? data.count : 0);
      setCachedAppLikes(count, true);
      return { totalLikes: count, userLiked: true };
    }
  } catch (err) {
    console.warn('[likesRepository] Failed to send like to backend:', err);
  }

  return null;
}

/**
 * Send unlike to backend API.
 */
export async function sendAppUnlike(): Promise<{ totalLikes: number; userLiked: boolean } | null> {
  const anonymousUserId = getAnonymousUserId();

  try {
    const res = await fetch(`${API_BASE_URL}/app-like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ anonymousUserId }),
    });

    if (res.ok) {
      const data: AppLikesResponse = await res.json();
      const count = typeof data.totalLikes === 'number' ? data.totalLikes : (typeof data.count === 'number' ? data.count : 0);
      setCachedAppLikes(count, false);
      return { totalLikes: count, userLiked: false };
    }
  } catch (err) {
    console.warn('[likesRepository] Failed to send unlike to backend:', err);
  }

  return null;
}

export async function sendLikesIncrement(): Promise<number | null> {
  const res = await sendAppLike();
  return res ? res.totalLikes : null;
}
