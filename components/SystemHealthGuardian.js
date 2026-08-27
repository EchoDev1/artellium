'use client';

import React, { useEffect } from 'react';

/**
 * ARTELLIUM SYSTEM HEALTH GUARDIAN
 * Inbuilt runtime resilience monitor:
 * 1. Silences benign browser extension & third-party script noise
 * 2. Self-heals corrupted LocalStorage data entries
 * 3. Prevents unhandled promise rejections from crashing the UI
 */
export default function SystemHealthGuardian() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Global Error Sentinel
    const errorHandler = (event) => {
      const msg = event?.message || '';
      // Ignore common benign third-party/extension errors
      if (
        msg.includes('ResizeObserver') ||
        msg.includes('translate.google') ||
        msg.includes('chrome-extension://') ||
        msg.includes('moz-extension://') ||
        msg.includes('safari-extension://')
      ) {
        event.preventDefault();
        return;
      }
    };

    // 2. Unhandled Promise Rejection Sentinel
    const rejectionHandler = (event) => {
      const reason = event?.reason?.message || event?.reason || '';
      if (
        String(reason).includes('ResizeObserver') ||
        String(reason).includes('translate') ||
        String(reason).includes('extension')
      ) {
        event.preventDefault();
        return;
      }
    };

    // 3. LocalStorage Self-Healing Sanitizer
    try {
      const criticalKeys = [
        'artellium_cart',
        'artellium_wishlist',
        'artellium_orders',
        'artellium_payments',
        'artellium_artworks',
        'artellium_login_state',
        'artellium_users'
      ];

      criticalKeys.forEach((key) => {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            JSON.parse(item);
          } catch (e) {
            console.warn(`[System Health Guardian] Auto-repairing corrupted storage key "${key}"`);
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {}

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  return null;
}
