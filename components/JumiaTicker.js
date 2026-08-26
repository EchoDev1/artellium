'use client';

import React from 'react';
import { useStore } from '@/context/store-context';
import { Zap, Flame, ShieldCheck, Sparkles } from 'lucide-react';

export default function JumiaTicker() {
  const { homePageConfig } = useStore();
  const ticker = homePageConfig?.ticker;

  if (!ticker || ticker.isVisible === false) return null;

  return (
    <div className={`w-full overflow-hidden bg-gradient-to-r ${ticker.bgGradient || 'from-amber-600 via-red-600 to-amber-700'} text-white py-2.5 px-4 shadow-inner relative border-y border-art-gold/30 z-20`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-bold">
        {/* Badge */}
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-white/20 z-10 bg-inherit">
          <span className="p-1 rounded-md bg-white/20 text-white animate-pulse">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </span>
          <span className="uppercase tracking-widest text-[10px] sm:text-xs font-mono font-black drop-shadow">
            {ticker.badge || 'JUMIA MEGA DEALS'}
          </span>
        </div>

        {/* Scrolling Urgency Text */}
        <div className="overflow-hidden whitespace-nowrap relative flex-1 pl-4">
          <div className="inline-block tracking-wider font-mono text-[11px] sm:text-xs uppercase drop-shadow-sm font-semibold animate-pulse">
            {ticker.text || '⚡ FLASH SALE LIVE: UP TO 40% OFF SELECT ACCRA & LAGOS MASTERWORKS ⚡ FREE INSURED MUSEUM FREIGHT ON LOTS OVER ₦3M ⚡ 100% FIDUCIARY BUYER PROTECTION ⚡ NEW VERIFIED ATELIERS ONBOARDED TODAY'}
          </div>
        </div>
      </div>
    </div>
  );
}
