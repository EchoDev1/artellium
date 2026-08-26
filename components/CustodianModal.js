'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';

export default function CustodianModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const alreadyShown = sessionStorage.getItem('artellium_custodian_shown');
      if (alreadyShown === 'true') {
        return;
      }

      let sessionStartTime = sessionStorage.getItem('artellium_session_start_time');
      const now = Date.now();

      if (!sessionStartTime) {
        sessionStartTime = now.toString();
        sessionStorage.setItem('artellium_session_start_time', sessionStartTime);
      }

      const elapsed = now - parseInt(sessionStartTime, 10);
      const targetDuration = 3 * 60 * 1000; // 3 minutes
      const remainingTime = Math.max(0, targetDuration - elapsed);

      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('artellium_custodian_shown', 'true');
      }, remainingTime);

      return () => clearTimeout(timer);
    } catch (e) {
      console.warn('Custodian timer notice:', e);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in select-none">
      {/* Click outside backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={handleClose} 
        aria-label="Close modal backdrop" 
      />

      {/* Traditional Museum Archival Certificate / Patron Plaque */}
      <div className="relative w-full max-w-lg bg-[#0C0E14] border-2 border-art-gold/40 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] p-2 z-10 animate-scale-up overflow-hidden">
        
        {/* Inner Engraved Gold Border Box */}
        <div className="border border-art-gold/25 rounded-xl p-6 sm:p-8 bg-gradient-to-b from-[#11141D] via-[#0D0F16] to-[#080A0E] text-center relative space-y-6">
          
          {/* Traditional Corner Notches / Crop Marks */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-art-gold/60 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-art-gold/60 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-art-gold/60 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-art-gold/60 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 hover:bg-art-gold text-slate-400 hover:text-black border border-white/10 hover:border-art-gold flex items-center justify-center transition cursor-pointer"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Traditional Embossed Medallion / Wax Seal Crest */}
          <div className="flex justify-center pt-1">
            <div className="w-16 h-16 rounded-full bg-[#1A1F2C] border-2 border-art-gold flex items-center justify-center shadow-lg relative">
              <div className="w-13 h-13 rounded-full border border-art-gold/40 flex items-center justify-center bg-[#10131B]">
                {/* Traditional Heraldic Seal SVG */}
                <svg viewBox="0 0 40 40" className="w-8 h-8 text-art-gold" fill="none">
                  <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                  <path d="M20 7 L23 15 L32 15 L25 21 L28 30 L20 24 L12 30 L15 21 L8 15 L17 15 Z" fill="currentColor" fillOpacity="0.85" />
                  <circle cx="20" cy="19" r="3" fill="#0C0E14" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dossier Monograph Header */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-art-gold block">
              ✦ FOLIO NO. AR-2026 / ATELIER ARCHIVE ✦
            </span>
            <h3 className="font-serif text-xs uppercase tracking-[0.2em] text-slate-300 font-semibold">
              Royal Artellium Recognition
            </h3>
          </div>

          {/* Core Masterwork Quote */}
          <div className="space-y-3 px-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide leading-snug italic">
              &ldquo;For staying this long indeed, you are a true custodian of art.&rdquo;
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-art-gold/50 to-transparent mx-auto" />
            <p className="text-xs sm:text-[13px] text-slate-300 font-serif leading-relaxed max-w-md mx-auto">
              Your appreciation for African creative heritage, authentic masterworks, and fine craftsmanship keeps the spirit of the continent’s finest painters, sculptors, and digital visionaries thriving.
            </p>
          </div>

          {/* Traditional Provenance Badges (Archival Seals) */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-mono uppercase tracking-wider">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col items-center justify-center gap-1 text-slate-300">
              <span className="text-art-gold font-bold">🔒 LEDGER</span>
              <span className="text-[9px] text-slate-400">Fiduciary Settled</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col items-center justify-center gap-1 text-slate-300">
              <span className="text-art-gold font-bold">📜 ORIGINS</span>
              <span className="text-[9px] text-slate-400">Verified Origins</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-col items-center justify-center gap-1 text-slate-300">
              <span className="text-art-gold font-bold">👑 PATRON</span>
              <span className="text-[9px] text-slate-400">Patron of Creators</span>
            </div>
          </div>

          {/* Solid Traditional Museum Button */}
          <div className="pt-2">
            <button
              onClick={handleClose}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-serif font-bold text-xs uppercase tracking-widest transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue Your Exploration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
