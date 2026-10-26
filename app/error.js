'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function GlobalErrorPage({ error, reset }) {
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    console.warn('[Artellium Self-Healing Router]: Initiating seamless recovery...', error?.message);

    if (typeof window === 'undefined') return;

    // Immediately attempt reset() first to re-render without reloading
    if (typeof reset === 'function') {
      try {
        reset();
        return;
      } catch (e) {}
    }

    // Auto-heal seamlessly if needed
    const healKey = 'artellium_last_auto_heal';
    const lastHeal = sessionStorage.getItem(healKey);
    const now = Date.now();

    if (!lastHeal || (now - parseInt(lastHeal, 10)) > 15000) {
      sessionStorage.setItem(healKey, now.toString());
      setTimeout(() => {
        try {
          window.location.reload();
        } catch (e) {}
      }, 150);
    }
  }, [error, reset]);

  const handleForceRecover = () => {
    setIsRecovering(true);
    if (typeof reset === 'function') {
      try {
        reset();
        return;
      } catch (e) {}
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-[75vh] bg-[#07080A] py-20 px-4 flex items-center justify-center text-center font-sans">
      <div className="max-w-md w-full bg-[#0c0f17] border border-art-gold/30 rounded-3xl p-8 sm:p-10 space-y-6 text-slate-200 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-art-gold/10 border border-art-gold/40 flex items-center justify-center mx-auto text-art-gold shadow-gold-glow">
          <ShieldCheck className="w-8 h-8 text-art-gold animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Restoring Artellium Gallery
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Synchronizing African masterworks, live auction ledger, and curatorial state.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleForceRecover}
            disabled={isRecovering}
            className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-art-gold via-amber-500 to-art-gold hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${isRecovering ? 'animate-spin' : ''}`} />
            <span>{isRecovering ? 'Restoring...' : 'Continue to Gallery'}</span>
          </button>
          <Link
            href="/"
            className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 border border-white/10"
          >
            <span>Home</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
