'use client';

import React from 'react';
import Link from 'next/link';

// 1. 3D Golden Lightning & Stopwatch (Flash Deals)
function Icon3DFlash() {
  return (
    <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_8px_16px_rgba(239,68,68,0.35)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="flashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="stopwatchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
      </defs>
      {/* Stopwatch Backing */}
      <circle cx="36" cy="44" r="22" fill="url(#stopwatchGrad)" />
      <circle cx="36" cy="44" r="17" fill="#FFFFFF" opacity="0.95" />
      {/* Stopwatch dial marks */}
      <circle cx="36" cy="44" r="2" fill="#991B1B" />
      <line x1="36" y1="44" x2="36" y2="32" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="44" x2="44" y2="44" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      {/* Stopwatch Button Top */}
      <rect x="33" y="16" width="6" height="5" rx="1.5" fill="#EAB308" />
      {/* 3D Bold Lightning Bolt */}
      <path
        d="M48 10 L30 38 L42 38 L34 66 L58 32 L44 32 Z"
        fill="url(#flashGrad)"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
      />
    </svg>
  );
}

// 2. 3D Auction Gavel & Sound Block (Live Auctions)
function Icon3DGavel() {
  return (
    <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_8px_16px_rgba(168,85,247,0.35)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="gavelHead" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="50%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="blockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#92400E" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
      </defs>
      {/* Sound Block */}
      <ellipse cx="40" cy="62" rx="24" ry="8" fill="url(#blockGrad)" />
      <ellipse cx="40" cy="60" rx="20" ry="5.5" fill="#D97706" opacity="0.6" />
      {/* 3D Angled Gavel */}
      <g transform="rotate(-30 40 40) translate(2, -2)">
        {/* Handle */}
        <rect x="37" y="32" width="6" height="34" rx="3" fill="#D97706" />
        <rect x="38" y="34" width="4" height="30" rx="2" fill="#78350F" />
        {/* Gavel Head */}
        <rect x="24" y="20" width="32" height="14" rx="4" fill="url(#gavelHead)" />
        {/* Brass Rings */}
        <rect x="30" y="19.5" width="4" height="15" rx="1" fill="url(#goldRing)" />
        <rect x="46" y="19.5" width="4" height="15" rx="1" fill="url(#goldRing)" />
      </g>
    </svg>
  );
}

// 3. 3D Royal Gold Crown (Rare Royal Heirlooms)
function Icon3DCrown() {
  return (
    <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_8px_16px_rgba(234,179,8,0.4)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FBBF24" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="crownBase" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      {/* Crown Base Rim */}
      <ellipse cx="40" cy="56" rx="24" ry="6" fill="url(#crownBase)" />
      {/* Crown Spikes Body */}
      <path
        d="M16 54 L20 28 L30 42 L40 20 L50 42 L60 28 L64 54 Z"
        fill="url(#crownGold)"
        style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.3))' }}
      />
      {/* Gemstone Jewels */}
      <circle cx="20" cy="28" r="3.5" fill="#EF4444" />
      <circle cx="40" cy="20" r="4.5" fill="#3B82F6" />
      <circle cx="60" cy="28" r="3.5" fill="#10B981" />
      {/* Rim Embedded Jewels */}
      <circle cx="28" cy="55" r="2.5" fill="#EF4444" />
      <circle cx="40" cy="55" r="3" fill="#FFFFFF" />
      <circle cx="52" cy="55" r="2.5" fill="#10B981" />
    </svg>
  );
}

// 4. 3D Rosette Ribbon Badge (Verified Masters)
function Icon3DVerified() {
  return (
    <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_8px_16px_rgba(16,185,129,0.35)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>
        <linearGradient id="ribbonTail" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#024731" />
        </linearGradient>
      </defs>
      {/* Ribbon Tails */}
      <path d="M32 52 L26 72 L36 67 L44 72 L40 52 Z" fill="url(#ribbonTail)" />
      <path d="M48 52 L44 72 L54 67 L62 72 L56 52 Z" fill="url(#ribbonTail)" />
      {/* 3D Rosette Scallop Star */}
      <g transform="translate(40, 36)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <circle
            key={i}
            cx={Math.cos((angle * Math.PI) / 180) * 19}
            cy={Math.sin((angle * Math.PI) / 180) * 19}
            r="6"
            fill="url(#ribbonGrad)"
          />
        ))}
        {/* Rosette Core */}
        <circle cx="0" cy="0" r="18" fill="url(#ribbonGrad)" />
        <circle cx="0" cy="0" r="15" fill="#10B981" />
        <circle cx="0" cy="0" r="14" fill="#059669" />
        {/* 3D Checkmark */}
        <path
          d="M-5 0 L-1 4 L7 -4"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

// 5. 3D Price Tag with Naira ₦ Symbol (Under ₦1M Deals)
function Icon3DTag() {
  return (
    <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_8px_16px_rgba(249,115,22,0.35)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="tagGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA24C" />
          <stop offset="50%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#DD5200" />
        </linearGradient>
        <linearGradient id="tagGradSide" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B33E00" />
          <stop offset="100%" stopColor="#732500" />
        </linearGradient>
      </defs>
      {/* 3D Extrusion */}
      <g transform="rotate(-25 40 40) translate(2, 3)">
        <path
          d="M24 16 L48 16 C52 16, 62 26, 62 30 L62 58 C62 62, 58 66, 54 66 L24 66 C20 66, 16 62, 16 58 L16 24 C16 20, 20 16, 24 16 Z"
          fill="url(#tagGradSide)"
        />
      </g>
      {/* Main Tag Face */}
      <g transform="rotate(-25 40 40)">
        <path
          d="M24 16 L48 16 C52 16, 62 26, 62 30 L62 58 C62 62, 58 66, 54 66 L24 66 C20 66, 16 62, 16 58 L16 24 C16 20, 20 16, 24 16 Z"
          fill="url(#tagGradFront)"
        />
        {/* Eyelet Hole */}
        <circle cx="26" cy="26" r="4" fill="#662200" />
        <circle cx="26" cy="26" r="2.5" fill="#FFE5D1" />
        {/* Embossed White Naira ₦ Symbol */}
        <text
          x="42"
          y="52"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="22"
          fill="#FFFFFF"
          textAnchor="middle"
          style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
        >
          ₦
        </text>
      </g>
    </svg>
  );
}

// 6. 3D Emerald Shield (Provenance Ledger)
function Icon3DShield() {
  return (
    <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_8px_16px_rgba(16,185,129,0.35)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="shieldGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="shieldGradSide" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#065F46" />
          <stop offset="100%" stopColor="#023627" />
        </linearGradient>
      </defs>
      {/* 3D Depth Layer */}
      <path
        d="M40 12 L60 20 C60 46, 50 62, 40 70 C30 62, 20 46, 20 20 Z"
        fill="url(#shieldGradSide)"
        transform="translate(2, 3)"
      />
      {/* Shield Main Body */}
      <path
        d="M40 12 L60 20 C60 46, 50 62, 40 70 C30 62, 20 46, 20 20 Z"
        fill="url(#shieldGradFront)"
      />
      {/* Inner Inset Rim */}
      <path
        d="M40 17 L55 24 C55 44, 47 57, 40 64 C33 57, 25 44, 25 24 Z"
        fill="#059669"
        opacity="0.6"
      />
      {/* Crisp 3D Checkmark */}
      <path
        d="M32 38 L38 45 L50 31"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
      />
    </svg>
  );
}

// 7. 3D Purple Star Sparkles (Curator Picks)
function Icon3DSparkle() {
  return (
    <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_8px_16px_rgba(139,92,246,0.35)] transition-transform duration-300 group-hover:scale-110">
      <defs>
        <linearGradient id="purpleGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="40%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id="purpleGradSide" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5B21B6" />
          <stop offset="100%" stopColor="#3B0764" />
        </linearGradient>
      </defs>
      {/* 3D Depth Layer */}
      <path
        d="M40 8 C40 25, 43 28, 60 28 C43 28, 40 31, 40 48 C40 31, 37 28, 20 28 C37 28, 40 25, 40 8 Z"
        fill="url(#purpleGradSide)"
        transform="translate(2, 3)"
      />
      {/* Main 4-Point Star */}
      <path
        d="M40 8 C40 25, 43 28, 60 28 C43 28, 40 31, 40 48 C40 31, 37 28, 20 28 C37 28, 40 25, 40 8 Z"
        fill="url(#purpleGradFront)"
      />
      {/* Secondary Companion 3D Stars */}
      <g transform="translate(48, 42) scale(0.6)">
        <path
          d="M20 0 C20 10, 22 12, 32 12 C22 12, 20 14, 20 24 C20 14, 18 12, 8 12 C18 12, 20 10, 20 0 Z"
          fill="url(#purpleGradFront)"
        />
      </g>
      <g transform="translate(8, 40) scale(0.45)">
        <path
          d="M20 0 C20 10, 22 12, 32 12 C22 12, 20 14, 20 24 C20 14, 18 12, 8 12 C18 12, 20 10, 20 0 Z"
          fill="url(#purpleGradFront)"
        />
      </g>
      <circle cx="40" cy="28" r="2.5" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

export default function JumiaQuickShortcuts() {
  const cards = [
    {
      id: 'sc-deals',
      label: 'Flash Deals',
      sublabel: 'Shop Now',
      image: '/flash-deal.png',
      href: '/flash-deals',
      hasBeep: true
    },
    {
      id: 'sc-live',
      label: 'Live Auctions',
      sublabel: 'Join Now',
      image: '/live-auctions.png',
      href: '/auctions'
    },
    {
      id: 'sc-rare',
      label: 'Royal Heirlooms',
      sublabel: 'Shop Now',
      image: '/royal-heirlooms.png',
      href: '/royal-heirlooms'
    },
    {
      id: 'sc-verified',
      label: 'Verified Masters',
      sublabel: 'Certified Authentic',
      image: '/verified-masters.png',
      href: '/verified-masters'
    },
    {
      id: 'sc-under1m',
      label: 'Under ₦1M Deals',
      sublabel: 'Shop Now',
      image: '/under-1m-deals.png',
      href: '/under-1m'
    },
    {
      id: 'sc-provenance',
      label: 'Provenance Ledger',
      sublabel: 'View Registry',
      image: '/provenance-ledger.png',
      href: '/provenance-ledger'
    },
    {
      id: 'sc-curator',
      label: 'Curator Picks',
      sublabel: 'Shop Now',
      image: '/curator-picks.png',
      href: '/curator-picks'
    }
  ];

  return (
    <div className="w-full bg-[#07080A] border-y border-art-gold/20 py-3 sm:py-6 px-2 sm:px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Single-Line Ribbon on Mobile / Responsive 7-Col Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3.5 lg:gap-4 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 scrollbar-none snap-x snap-mandatory touch-pan-x px-1 sm:px-0">
          {cards.map((card) => {
            if (card.image) {
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className={`group relative flex flex-col w-[92px] xs:w-[102px] sm:w-auto shrink-0 snap-start rounded-2xl sm:rounded-3xl overflow-hidden border ${
                    card.hasBeep 
                      ? 'border-red-500/60 hover:border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]' 
                      : 'border-white/10 hover:border-art-gold/60 shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
                  } bg-[#0E121A] hover:bg-[#151B26] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(212,175,55,0.15)] hover:-translate-y-1 h-[115px] xs:h-[125px] sm:h-auto sm:min-h-[160px] active:scale-95`}
                  title={`${card.label} - ${card.sublabel}`}
                >
                  <img
                    src={card.image}
                    alt={card.label}
                    className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
                      card.hasBeep ? 'animate-flash-beep' : ''
                    }`}
                  />

                  {/* Subtle inner gloss highlight border */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-white/20 pointer-events-none" />

                  {/* Mobile Pulse Indicator on Flash Deals */}
                  {card.hasBeep && (
                    <div className="sm:hidden absolute top-1.5 right-1.5 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute" />
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 relative" />
                    </div>
                  )}
                </Link>
              );
            }

            return (
              <Link
                key={card.id}
                href={card.href}
                className="group flex flex-col items-center justify-between w-[92px] xs:w-[102px] sm:w-auto shrink-0 snap-start p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-art-gold/60 bg-[#0E121A] hover:bg-[#151B26] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_28px_rgba(212,175,55,0.15)] hover:-translate-y-1 text-center relative h-[115px] xs:h-[125px] sm:h-auto sm:min-h-[160px] active:scale-95"
                title={`${card.label} - ${card.sublabel}`}
              >
                {/* Top Tag */}
                <div className="h-4 sm:h-5 flex items-center justify-center w-full">
                  {card.tag && (
                    <span className={`px-2 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full text-[8px] sm:text-[9px] font-black font-sans uppercase tracking-wider text-white shadow-sm ${card.tagBg}`}>
                      {card.tag}
                    </span>
                  )}
                </div>

                {/* Center 3D Vector Icon */}
                <div className="flex-1 flex items-center justify-center my-1">
                  {card.icon}
                </div>

                {/* Bottom Label & Sublabel */}
                <div className="space-y-0.5 w-full">
                  <span className="font-bold text-white text-[10px] sm:text-xs tracking-tight line-clamp-1 group-hover:text-art-gold transition-colors block">
                    {card.label}
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 font-sans tracking-wide block uppercase font-medium line-clamp-1">
                    {card.sublabel}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}


