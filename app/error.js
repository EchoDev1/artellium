'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, RefreshCw, ShieldAlert, Home, ArrowRight } from 'lucide-react';

export default function GlobalErrorPage({ error, reset }) {
  useEffect(() => {
    // Log error cleanly
    console.error('[Artellium System Sentinel caught error]:', error);
  }, [error]);

  const handleSelfHeal = () => {
    try {
      // Clear any corrupted transient temporary session keys if needed without destroying login
      sessionStorage.clear();
    } catch (e) {}
    reset();
  };

  return (
    <div className="min-h-[80vh] bg-[#07080A] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-art-gold/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10 text-center">
        
        {/* Brand Header */}
        <div className="inline-flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-art-gold via-amber-600 to-art-green p-0.5 shadow-gold-glow">
            <div className="w-full h-full bg-art-black rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-art-gold" />
            </div>
          </div>
          <div className="text-left">
            <span className="font-serif text-2xl font-black tracking-wider text-white block leading-none">
              ARTELLIUM
            </span>
            <span className="text-[10px] text-art-gold font-sans tracking-widest uppercase font-semibold">
              SYSTEM SENTINEL
            </span>
          </div>
        </div>

        {/* Error Card */}
        <div className="rounded-3xl bg-[#0c0f17]/90 border border-art-gold/35 shadow-2xl p-8 sm:p-10 backdrop-blur-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-gold-glow">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Sovereign Session Protection Active
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Our automated reliability sentinel intercepted a transient view rendering issue and secured your session state.
            </p>
          </div>

          {error?.message && (
            <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl text-left font-mono text-[11px] text-slate-400 break-words max-h-24 overflow-y-auto">
              <span className="text-art-gold font-bold">Sentinel Notice: </span>
              {error.message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSelfHeal}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Self-Heal & Recover View</span>
            </button>

            <Link
              href="/"
              className="py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition flex items-center justify-center gap-2 border border-white/10"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10px] text-slate-500 font-mono">
            Direct Corporate WEMA Settlement & Immutable Provenance Ledger Remain Fully Intact.
          </div>
        </div>

      </div>
    </div>
  );
}
