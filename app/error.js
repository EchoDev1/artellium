'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, Home } from 'lucide-react';

export default function GlobalErrorPage({ error, reset }) {
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    console.error('[Application notice]:', error);

    if (typeof window === 'undefined') return;

    // Auto-heal once silently on chunk / transient script mismatches
    const reloadKey = 'artellium_auto_heal_timestamp';
    const lastHeal = sessionStorage.getItem(reloadKey);
    const now = Date.now();

    if (!lastHeal || (now - parseInt(lastHeal, 10)) > 20000) {
      sessionStorage.setItem(reloadKey, now.toString());
      if (typeof reset === 'function') {
        try {
          reset();
          return;
        } catch (e) {}
      }
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }
  }, [error, reset]);

  const handleReload = () => {
    setIsReloading(true);
    if (typeof reset === 'function') {
      try {
        reset();
      } catch (e) {}
    }
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 200);
  };

  return (
    <div className="min-h-[70vh] bg-[#07080A] py-16 px-4 flex items-center justify-center text-center">
      <div className="max-w-md w-full bg-[#0c0f17] border border-white/10 rounded-2xl p-8 space-y-5 text-slate-200">
        <h2 className="font-serif text-xl font-bold text-white">Temporary Loading Delay</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          The page encountered a brief connection or loading interruption. Please refresh to continue.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReload}
            disabled={isReloading}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
            <span>{isReloading ? 'Refreshing...' : 'Refresh Page'}</span>
          </button>
          <a
            href="/"
            className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 border border-white/10"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}
