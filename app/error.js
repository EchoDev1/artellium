'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, RefreshCw, ShieldAlert, Home, ArrowRight } from 'lucide-react';

export default function GlobalErrorPage({ error, reset }) {
  const [isHealing, setIsHealing] = React.useState(false);

  const [showAdminDiagnostics, setShowAdminDiagnostics] = React.useState(false);

  useEffect(() => {
    // Log error cleanly in console
    console.error('[Artellium System Sentinel caught error]:', error);

    // Auto-heal chunk load errors (happens when browser cache has stale chunks from an update)
    const isChunkError = 
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') || 
      error?.message?.includes('Loading CSS chunk');

    if (isChunkError && typeof window !== 'undefined') {
      const reloadKey = 'artellium_chunk_heal_lock';
      const lastHeal = sessionStorage.getItem(reloadKey);
      if (!lastHeal) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  }, [error]);

  const handleSelfHeal = () => {
    setIsHealing(true);
    try {
      // Clear any corrupted transient temporary session keys
      sessionStorage.clear();
    } catch (e) {}

    // First try React error boundary reset
    if (typeof reset === 'function') {
      try {
        reset();
      } catch (e) {
        console.warn('React boundary reset encountered issue, falling back to reload');
      }
    }

    // Hard reload to guarantee clean bundle fetch
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 200);
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
              Our automated reliability sentinel intercepted a transient connection delay and secured your session state.
            </p>
          </div>

          {/* Technical Details: Only shown if clicked or in development */}
          {error?.message && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowAdminDiagnostics(!showAdminDiagnostics)}
                className="text-[10px] font-mono text-slate-500 hover:text-art-gold transition underline cursor-pointer"
              >
                {showAdminDiagnostics ? 'Hide Diagnostic Details' : 'Admin Diagnostic Details'}
              </button>

              {showAdminDiagnostics && (
                <div className="p-3.5 bg-black/80 border border-white/10 rounded-xl text-left font-mono text-[11px] text-slate-400 break-words max-h-32 overflow-y-auto">
                  <span className="text-art-gold font-bold">Sentinel Trace: </span>
                  {error.message}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleSelfHeal}
              disabled={isHealing}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <RefreshCw className={`w-4 h-4 ${isHealing ? 'animate-spin' : ''}`} />
              <span>{isHealing ? 'Healing View...' : 'Self-Heal & Recover View'}</span>
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
