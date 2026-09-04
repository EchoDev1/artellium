'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Eye, Sparkles, Gavel, ShieldCheck, ArrowRight, Radio, Users, Clock } from 'lucide-react';

export default function LiveEventTicker() {
  const events = [
    {
      id: 'e-1',
      type: 'auction',
      icon: Flame,
      badge: 'LIVE AUCTION BID',
      badgeColor: 'bg-red-950/80 text-red-400 border-red-800/60',
      headline: 'Lot #804 "The Golden Benin Queen"',
      detail: 'New bid: ₦4,900,000 from Collector in Lagos',
      actionText: 'Bid Now',
      link: '/auctions',
      pulseColor: 'bg-red-500'
    },
    {
      id: 'e-2',
      type: 'exhibition',
      icon: Eye,
      badge: '3D VIRTUAL GALLERY',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      headline: 'Exhibition: "Echoes of Ancestral Royalty"',
      detail: 'Curator Dr. Evelyn Carter • 🟢 142 Active Collectors in Room',
      actionText: 'Enter Room',
      link: '/exhibitions',
      pulseColor: 'bg-emerald-400'
    },
    {
      id: 'e-3',
      type: 'auction_urgent',
      icon: Clock,
      badge: 'CLOSING SOON',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      headline: 'Lot #806 "Daughters of the Nile"',
      detail: 'Highest Bid: ₦4,800,000 • 22 competitive bids placed',
      actionText: 'View Lot',
      link: '/auctions',
      pulseColor: 'bg-amber-400'
    },
    {
      id: 'e-4',
      type: 'exhibition_2',
      icon: Radio,
      badge: 'CURATORIAL BROADCAST',
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800/60',
      headline: 'Live 3D Hall: "Afrofuturism & Nsibidi Codes"',
      detail: 'Interactive 360° virtual tour live with artist Zola Okafor',
      actionText: 'Join Tour',
      link: '/exhibitions',
      pulseColor: 'bg-purple-400'
    },
    {
      id: 'e-5',
      type: 'settlement',
      icon: ShieldCheck,
      badge: 'WEMA SECURED FIDUCIARY',
      badgeColor: 'bg-art-gold/15 text-art-gold border-art-gold/40',
      headline: 'Direct Bank Settlement Guarantee',
      detail: 'Corporate account verification & cryptographic COA registry live',
      actionText: 'Learn More',
      link: '/policies#wema-banking',
      pulseColor: 'bg-art-gold'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [events.length]);

  const activeEvent = events[currentIndex];
  const Icon = activeEvent.icon;

  return (
    <div className="w-full bg-gradient-to-r from-[#68490B] via-[#996F15] to-[#68490B] border-y border-art-gold/40 relative overflow-hidden py-2.5 px-4 sm:px-6 lg:px-8">
      {/* Subtle gold sheen overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-art-gold/10 via-art-gold/15 to-art-gold/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        
        {/* Left Live Indicator & Ticker Item */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
          {/* Pulsing Live Beacon */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-mono font-black text-red-400 uppercase tracking-widest">
              LIVE ACTION
            </span>
          </div>

          {/* Event Content with Fade Animation */}
          <div key={activeEvent.id} className="flex items-center gap-2.5 truncate animate-fade-in text-xs">
            <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[9px] uppercase border shrink-0 ${activeEvent.badgeColor}`}>
              {activeEvent.badge}
            </span>
            <span className="font-serif font-bold text-white truncate">
              {activeEvent.headline}:
            </span>
            <span className="text-slate-300 truncate hidden md:inline">
              {activeEvent.detail}
            </span>
          </div>
        </div>

        {/* Right Action & Dot Controls */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Indicator Dots */}
          <div className="hidden lg:flex items-center gap-1.5">
            {events.map((ev, idx) => (
              <button
                key={ev.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'w-5 bg-art-gold' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                title={ev.badge}
              />
            ))}
          </div>

          <Link
            href={activeEvent.link}
            className="inline-flex items-center gap-1 text-xs font-bold text-art-gold hover:text-white transition px-3 py-1 rounded-lg bg-white/5 hover:bg-art-gold/20 border border-white/10"
          >
            <span>{activeEvent.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
