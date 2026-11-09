// Universal UUID & Dummy-Content Sanitization Utilities for ARTELLIUM AFRICA

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function generateUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Converts any string ID (e.g., "vid-admin-1793...", "ex-12345") into a deterministic
 * valid RFC 4122 UUID so PostgreSQL `uuid` primary keys never throw 22P02 syntax errors.
 */
export function toValidUuid(input) {
  const raw = String(input || '').trim();
  if (!raw) return generateUuid();
  if (UUID_REGEX.test(raw)) return raw.toLowerCase();

  // Deterministic 128-bit hash from string
  let h1 = 0xdeadbeef ^ raw.length;
  let h2 = 0x41c6ce57 ^ raw.length;
  let h3 = 0x9e3779b9 ^ raw.length;
  let h4 = 0x85ebca6b ^ raw.length;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  h3 = Math.imul(h3 ^ (h3 >>> 16), 2246822507) ^ Math.imul(h4 ^ (h4 >>> 13), 3266489909);
  h4 = Math.imul(h4 ^ (h4 >>> 16), 2246822507) ^ Math.imul(h3 ^ (h3 >>> 13), 3266489909);

  const hex = (n) => (n >>> 0).toString(16).padStart(8, '0');
  const full = `${hex(h1)}${hex(h2)}${hex(h3)}${hex(h4)}`;

  return `${full.slice(0, 8)}-${full.slice(8, 12)}-4${full.slice(13, 16)}-8${full.slice(17, 20)}-${full.slice(20, 32)}`.toLowerCase();
}

export const DUMMY_NAMES_LOWER = new Set([
  'kofi mensah',
  'amina diallo',
  'chief bakare ogundele',
  'tariq ndebele',
  'zola okafor',
  'fatoumata diabaté',
  'fatoumata diabate',
  'dr. evelyn carter',
  'evelyn carter',
  'chief obinna eze',
  'obinna eze',
  'lord alistair sterling',
  'alistair sterling',
  'dr. farai mutambara',
  'farai mutambara',
  'admin artellium',
  'royal guild heritage',
]);

export const DUMMY_USER_IDS = new Set([
  'user-artist-1',
  'user-artist-2',
  'user-artist-3',
  'user-artist-4',
  'user-artist-5',
  'usr-1',
  'usr-2',
  'usr-3',
  'usr-4',
  'usr-5',
  'user-buyer-1',
  'user-buyer-2',
  'user-buyer-3',
  'artist-1',
  'artist-2',
  'artist-3',
  'artist-4',
  'artist-5',
]);

export const DUMMY_VIDEO_IDS = new Set([
  'vid-1',
  'vid-2',
  'vid-3',
  'vid-4',
  '410baa77-7ad7-46a1-b311-de0de647098b',
  '2010a7d6-4515-4ec4-a571-0c279e525d13',
  'd4cfb83f-9746-43db-8e01-5c90bf001d81',
  'e1b1b1b1-b1b1-b1b1-b1b1-e1b1b1b1b1b1',
  'e2b2b2b2-b2b2-b2b2-b2b2-e2b2b2b2b2b2',
  'e3b3b3b3-b3b3-b3b3-b3b3-e3b3b3b3b3b3',
]);

export const DUMMY_ARTWORK_IDS = new Set([
  'art-101',
  'art-102',
  'art-103',
  'art-104',
  'art-105',
  'art-106',
  'art-echo-101',
  'art-real-ebuka-1',
  'art-real-ebuka-2',
  'art-real-ebuka-3',
  'art-real-ebuka-4',
  'art-real-ebuka-5',
  'art-real-ebuka-6',
]);

export function isDummyName(name) {
  const n = String(name || '').trim().toLowerCase();
  if (!n) return false;
  if (DUMMY_NAMES_LOWER.has(n)) return true;
  for (const dummy of DUMMY_NAMES_LOWER) {
    if (n.includes(dummy)) return true;
  }
  return false;
}

export function isDummyUserRecord(u) {
  if (!u) return true;
  const id = String(u.id || '').trim();
  const userId = String(u.user_id || u.userId || '').trim();
  const email = String(u.email || '').trim().toLowerCase();
  const name = String(u.name || '').trim();
  const avatar = String(u.avatar_url || u.avatarUrl || u.avatar || '').trim().toLowerCase();

  if (DUMMY_USER_IDS.has(id) || DUMMY_USER_IDS.has(userId)) return true;
  if (/^(user-artist-|user-buyer-|usr-|artist-\d+$)/i.test(id)) return true;
  if (isDummyName(name)) return true;
  if (
    email.endsWith('@artellium.com') ||
    email.endsWith('@artellium.africa') ||
    email.endsWith('@londonpatrons.co.uk')
  ) {
    return true;
  }
  if (avatar.includes('images.unsplash.com') || avatar.includes('/artworks/ebuka-')) return true;
  return false;
}

export function isDummyArtworkRecord(a) {
  if (!a || a.isDemo) return true;
  const id = String(a.id || a.artworkId || a.artwork_id || '').trim();
  const title = String(a.title || a.artworkTitle || a.artwork_title || '').trim().toLowerCase();
  const artist = String(a.artistName || a.artist_name || a.artist || '').trim();
  const img = String(a.image || a.image_url || a.coverImage || '').trim().toLowerCase();

  if (/^lot-live-80[1-4]$/i.test(id)) return false;
  if (DUMMY_ARTWORK_IDS.has(id)) return true;
  if (/^(mock-|demo-|art-10\d|art-echo-|art-real-ebuka-)/i.test(id)) return true;
  if (isDummyName(artist)) return true;
  if (
    title === 'the ancestral horizon' ||
    title === 'the golden benin queen' ||
    title === 'the solitary mask of oyo' ||
    title === 'warrior of the bronze empire'
  ) {
    return true;
  }
  if (
    !img ||
    img.includes('images.unsplash.com') ||
    img.includes('unsplash.com') ||
    img.includes('/artworks/ebuka-')
  ) {
    return true;
  }
  return false;
}

export function isDummyVideoRecord(v) {
  if (!v || v.isDemo || v.is_demo) return true;
  const id = String(v.id || '').trim();
  const url = String(v.videoUrl || v.video_url || '').trim();
  const thumb = String(v.thumbnail || v.thumbnail_url || '').trim().toLowerCase();
  const artist = String(v.artistName || v.artist_name || '').trim();
  const title = String(v.artworkTitle || v.artwork_title || v.title || '').trim().toLowerCase();

  if (DUMMY_VIDEO_IDS.has(id) || /^vid-[1-4]$/i.test(id)) return true;
  if (!url) return true;
  if (
    /\/videos\/artist-(savannah|studio|turtle|nature)\.mp4/i.test(url) ||
    url.includes('mixkit.co') ||
    url.includes('dQw4w9WgXcQ') ||
    url.includes('rickroll')
  ) {
    return true;
  }
  if (isDummyName(artist)) return true;
  if (
    title === 'the ancestral horizon' ||
    title === 'the golden benin queen' ||
    title === 'the solitary mask of oyo' ||
    title === 'warrior of the bronze empire'
  ) {
    return true;
  }
  if (thumb.includes('images.unsplash.com') || thumb.includes('/artworks/ebuka-')) {
    return true;
  }
  return false;
}

export function isDummyExhibitionRecord(ex) {
  if (!ex || ex.isDemo) return true;
  const id = String(ex.id || '').trim();
  const curator = String(ex.curator || '').trim();
  const cover = String(ex.coverImage || ex.cover_image || '').trim().toLowerCase();

  if (/^(ex-10[5-9]|c[1-4]b[1-4]b[1-4])/i.test(id)) return true;
  if (isDummyName(curator)) return true;
  if (cover.includes('images.unsplash.com')) return true;
  return false;
}
