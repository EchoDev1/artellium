import React from 'react';
import Link from 'next/link';
import { Sparkles, Gavel, Compass, Home, ArrowRight, ShieldCheck } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] bg-[#07080A] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-art-gold/10 blur-[140px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10 text-center">
        
        {/* Emblem */}
        <div className="w-20 h-20 rounded-3xl bg-art-gold/15 border border-art-gold/40 text-art-gold flex items-center justify-center mx-auto shadow-gold-glow">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold tracking-widest text-art-gold uppercase">
            ARCHIVAL CODE 404 • LOT NOT FOUND
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Masterpiece or Page Not Found
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            The page, artwork lot, or archival record you requested could not be located in the Artellium sovereign ledger. It may have been relocated or privatized.
          </p>
        </div>

        {/* Navigation Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <Link
            href="/auctions"
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-art-gold/50 text-left transition group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block group-hover:text-art-gold transition">
                Live Fine Art Auctions
              </span>
              <span className="text-[10px] text-slate-400 block">
                Competitive Bidding Rooms
              </span>
            </div>
          </Link>

          <Link
            href="/explore"
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-art-gold/50 text-left transition group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block group-hover:text-art-gold transition">
                Curated Marketplace
              </span>
              <span className="text-[10px] text-slate-400 block">
                Explore All Artworks
              </span>
            </div>
          </Link>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-art-gold to-amber-500 text-art-black font-bold uppercase tracking-wider text-xs shadow-gold-glow hover:brightness-110 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
