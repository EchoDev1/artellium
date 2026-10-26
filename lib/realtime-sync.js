/**
 * ARTELLIUM AFRICA - REAL-TIME ADMIN SYNC & BROADCAST PLUGIN
 * Guarantees that any save performed by Admin reflects IMMEDIATELY across
 * all open pages, tabs, and visitor sessions. Admin has the final say.
 */

const SYNC_CHANNEL_NAME = 'artellium_realtime_sync';

export function broadcastAdminChange(eventType, payload = {}) {
  if (typeof window === 'undefined') return;

  const eventData = {
    type: eventType,
    payload,
    timestamp: Date.now()
  };

  // 1. Dispatch custom DOM event in current window for immediate React re-rendering
  try {
    window.dispatchEvent(new CustomEvent('artellium:admin-update', { detail: eventData }));
  } catch (e) {}

  // 2. Broadcast across all other open browser tabs
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage(eventData);
      channel.close();
    }
  } catch (e) {}
}

export function subscribeToAdminChanges(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = (e) => {
    if (e && e.detail && callback) {
      callback(e.detail);
    }
  };

  window.addEventListener('artellium:admin-update', handleCustomEvent);

  let channel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event && event.data && callback) {
          callback(event.data);
        }
      };
    }
  } catch (e) {}

  return () => {
    window.removeEventListener('artellium:admin-update', handleCustomEvent);
    if (channel) {
      try { channel.close(); } catch (e) {}
    }
  };
}
