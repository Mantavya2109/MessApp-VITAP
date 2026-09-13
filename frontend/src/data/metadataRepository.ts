import { db } from './db';

export async function getMetadata<T = any>(key: string): Promise<T | null> {
  try {
    const record = await db.metadata.get(key);
    return record ? record.value : null;
  } catch (err) {
    console.warn('[metadataRepository] Error getting key:', key, err);
    return null;
  }
}

export async function setMetadata(key: string, value: any): Promise<void> {
  try {
    const nowIso = new Date().toISOString();
    await db.metadata.put({
      key,
      value,
      updatedAt: nowIso,
    });
  } catch (err) {
    console.warn('[metadataRepository] Error setting key:', key, err);
  }
}
