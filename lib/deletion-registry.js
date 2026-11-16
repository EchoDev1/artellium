/**
 * ARTELLIUM AFRICA — UNIVERSAL PERMANENT DELETION & TOMBSTONE REGISTRY
 * Guarantees that once an artist or admin deletes an artwork, video, exhibition,
 * banner ad, or flash deal, it is permanently tombstoned across LocalStorage,
 * IndexedDB, Seed Files, and Supabase Sync — never resurrecting on reload.
 */

import { idbGetItem, idbSetItem, safeSetItem } from './safe-storage';

const REGISTRY_KEY = 'artellium_deleted_registry_v1';

// Pre-seeded tombstones for artworks that were already deleted from Supabase prior to tombstone tracking
const PRE_DELETED_ARTWORKS = [
  'art-live-1791535169712-a8c7',
  'art-live-1790679135858-wy83',
  'art-live-1790524209440-gcxc',
  'title:gbagyi woman frame::artist:esther moses',
  'title:mask of oyo::artist:esther moses',
  'title:word painted!::artist:ebuka eke',
];

const memoryRegistry = {
  artworks: new Set(PRE_DELETED_ARTWORKS),
  videos: new Set(),
  exhibitions: new Set(),
  banners: new Set(),
  flashDeals: new Set(),
  users: new Set(),
  sellers: new Set(),
};

let initializedFromStorage = false;

function normalizeKey(val) {
  if (val === null || val === undefined) return '';
  return String(val).trim().toLowerCase();
}

export function getArtworkCompositeKey(art) {
  if (!art || typeof art !== 'object') return '';
  const title = normalizeKey(art.title || art.artworkTitle || art.artwork_title || '');
  const artist = normalizeKey(
    String(art.artistName || art.artist_name || art.artist || '').split(' (')[0]
  );
  if (!title) return '';
  return `title:${title}::artist:${artist}`;
}

function syncFromLocalStorage() {
  if (initializedFromStorage || typeof window === 'undefined') return;
  initializedFromStorage = true;
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.keys(memoryRegistry).forEach((type) => {
          if (Array.isArray(parsed[type])) {
            parsed[type].forEach((k) => {
              const norm = normalizeKey(k);
              if (norm) memoryRegistry[type].add(norm);
            });
          }
        });
      }
    }
  } catch (e) {}
}

function persistRegistry() {
  if (typeof window === 'undefined') return;
  try {
    const payload = {};
    Object.keys(memoryRegistry).forEach((type) => {
      payload[type] = Array.from(memoryRegistry[type]);
    });
    safeSetItem(REGISTRY_KEY, payload);
    idbSetItem(REGISTRY_KEY, payload).catch(() => {});
  } catch (e) {}
}

export async function hydrateDeletionRegistryFromIdb() {
  if (typeof window === 'undefined') return;
  syncFromLocalStorage();
  try {
    const idbData = await idbGetItem(REGISTRY_KEY, null);
    if (idbData && typeof idbData === 'object') {
      let changed = false;
      Object.keys(memoryRegistry).forEach((type) => {
        if (Array.isArray(idbData[type])) {
          idbData[type].forEach((k) => {
            const norm = normalizeKey(k);
            if (norm && !memoryRegistry[type].has(norm)) {
              memoryRegistry[type].add(norm);
              changed = true;
            }
          });
        }
      });
      if (changed) persistRegistry();
    }
  } catch (e) {}
}

export function markEntityDeleted(type, id, extraKeys = []) {
  syncFromLocalStorage();
  const bucket = memoryRegistry[type] || (memoryRegistry[type] = new Set());
  const normId = normalizeKey(id);
  if (normId) bucket.add(normId);
  if (Array.isArray(extraKeys)) {
    extraKeys.forEach((k) => {
      const nk = normalizeKey(k);
      if (nk) bucket.add(nk);
    });
  }
  persistRegistry();
}

export function unmarkEntityDeleted(type, id, extraKeys = []) {
  syncFromLocalStorage();
  const bucket = memoryRegistry[type];
  if (!bucket) return;
  const normId = normalizeKey(id);
  if (normId) bucket.delete(normId);
  if (Array.isArray(extraKeys)) {
    extraKeys.forEach((k) => {
      const nk = normalizeKey(k);
      if (nk) bucket.delete(nk);
    });
  }
  persistRegistry();
}

export function mergeServerDeletedIds(type, ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return;
  syncFromLocalStorage();
  const bucket = memoryRegistry[type] || (memoryRegistry[type] = new Set());
  let changed = false;
  ids.forEach((id) => {
    const norm = normalizeKey(id);
    if (norm && !bucket.has(norm)) {
      bucket.add(norm);
      changed = true;
    }
  });
  if (changed) persistRegistry();
}

export function isEntityDeleted(type, itemOrId) {
  syncFromLocalStorage();
  const bucket = memoryRegistry[type];
  if (!bucket || bucket.size === 0 || !itemOrId) return false;

  if (typeof itemOrId === 'string' || typeof itemOrId === 'number') {
    return bucket.has(normalizeKey(itemOrId));
  }

  if (typeof itemOrId === 'object') {
    const candidates = [
      itemOrId.id,
      itemOrId.originalId,
      itemOrId.artworkId,
      itemOrId.artwork_id,
      itemOrId.slug,
    ];
    for (const c of candidates) {
      const norm = normalizeKey(c);
      if (norm && bucket.has(norm)) return true;
    }
    if (type === 'artworks') {
      const comp = getArtworkCompositeKey(itemOrId);
      if (comp && bucket.has(comp)) return true;
    }
  }

  return false;
}

export function filterDeletedEntities(type, list = []) {
  if (!Array.isArray(list)) return [];
  syncFromLocalStorage();
  return list.filter((item) => item && !isEntityDeleted(type, item));
}
