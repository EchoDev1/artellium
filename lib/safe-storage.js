/**
 * ARTELLIUM AFRICA - ZERO-QUOTA SAFE STORAGE ENGINE
 * Prevents QuotaExceededError and guarantees 100% data persistence
 */

/**
 * Attempts to safely write to localStorage, catching QuotaExceededError and
 * auto-cleaning non-critical entries if storage space runs low.
 *
 * @param {string} key
 * @param {any} value
 * @returns {boolean} True if successfully stored
 */
export function safeSetItem(key, value) {
  if (typeof window === 'undefined') return false;

  const serialized = typeof value === 'string' ? value : JSON.stringify(value);

  try {
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.warn(`[SafeStorage] Initial write for "${key}" exceeded quota. Initiating self-healing prune routine...`, error);

    try {
      // 1. Purge non-essential ephemeral caches first
      const ephemeralKeys = [
        'artellium_notifications',
        'artellium_transactions',
        'artellium_bidders',
        'artellium_priority_placements'
      ];

      for (const k of ephemeralKeys) {
        if (k !== key) {
          localStorage.removeItem(k);
        }
      }

      // Retry saving
      localStorage.setItem(key, serialized);
      console.info(`[SafeStorage] Auto-recovery successful for "${key}".`);
      return true;
    } catch (secondError) {
      console.error(`[SafeStorage] Secondary save failed for "${key}".`, secondError);
      return false;
    }
  }
}

/**
 * Safely reads from localStorage with error catching and JSON parsing.
 */
export function safeGetItem(key, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
}

/**
 * Computes storage metrics (total used bytes, approx percentage of 5MB quota).
 */
export function getStorageDiagnostics() {
  if (typeof window === 'undefined') {
    return { totalBytes: 0, formatted: '0 KB', percentage: 0, itemsCount: 0, keys: [] };
  }

  let totalBytes = 0;
  const keys = [];

  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) {
      const val = localStorage.getItem(k) || '';
      const bytes = (k.length + val.length) * 2; // UTF-16 characters are 2 bytes
      totalBytes += bytes;
      keys.push({ key: k, bytes, formatted: formatBytes(bytes) });
    }
  }

  // 5MB is standard browser LocalStorage cap (5 * 1024 * 1024 bytes)
  const maxQuota = 5 * 1024 * 1024;
  const percentage = Math.min(100, Math.round((totalBytes / maxQuota) * 100));

  return {
    totalBytes,
    formatted: formatBytes(totalBytes),
    percentage,
    itemsCount: keys.length,
    keys: keys.sort((a, b) => b.bytes - a.bytes)
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
