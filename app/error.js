'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home } from 'lucide-react';

export default function GlobalErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('[Application Notice]:', error?.message || error);
    // Auto-recover once only for transient chunk/network failures, avoiding infinite loops on code errors
    const isChunkFailure = error?.message?.includes('Loading chunk') || error?.message?.includes('Failed to fetch');
    if (isChunkFailure && typeof reset === 'function') {
      const key = '__artellium_last_chunk_recovery';
      const lastRecovery = sessionStorage.getItem(key);
      const now = Date.now();
      if (!lastRecovery || now - Number(lastRecovery) > 10000) {
        sessionStorage.setItem(key, String(now));
        try {
          reset();
        } catch (e) {}
      }
    }
  }, [error, reset]);

  return (
    <div className="min-h-[70vh] bg-[#07080A] py-16 px-4 flex items-center justify-center text-center font-sans">
      <div className="max-w-md w-full bg-[#0c0f17] border border-white/10 rounded-3xl p-8 space-y-4 text-slate-200 shadow-2xl">
        <h2 className="font-serif text-xl font-bold text-white">Application Notice</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error?.message || 'We encountered a momentary display interruption.'}
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset && reset()}
            className="px-4 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold text-xs uppercase rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload View</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase rounded-xl transition flex items-center gap-1.5 border border-white/10"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
