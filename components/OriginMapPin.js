'use client';

import React from 'react';
import { MapPin, Compass, ShieldCheck } from 'lucide-react';

export default function OriginMapPin({ country = 'Nigeria', city = 'Lagos', countryFlag = '🇳🇬' }) {
  const countryCoordinates = {
    'Ghana': { cx: 72, cy: 118, region: 'West Africa' },
    'Nigeria': { cx: 92, cy: 114, region: 'West Africa' },
    'South Africa': { cx: 104, cy: 196, region: 'Southern Africa' },
    'Egypt': { cx: 122, cy: 52, region: 'North Africa' },
    'Mali': { cx: 62, cy: 96, region: 'West Africa' },
    'Morocco': { cx: 58, cy: 44, region: 'North Africa' },
    'Ethiopia': { cx: 142, cy: 112, region: 'East Africa' },
    'Kenya': { cx: 138, cy: 128, region: 'East Africa' },
    'Senegal': { cx: 42, cy: 98, region: 'West Africa' },
    'DR Congo': { cx: 108, cy: 138, region: 'Central Africa' },
    'Zimbabwe': { cx: 114, cy: 172, region: 'Southern Africa' },
    'Tanzania': { cx: 134, cy: 144, region: 'East Africa' },
  };

  const currentCoords = countryCoordinates[country] || { cx: 92, cy: 114, region: 'Pan-African' };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-art-black-card via-art-black to-zinc-950 border border-art-gold/30 rounded-2xl p-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 bg-art-black rounded-xl border border-white/10 shadow-inner flex items-center justify-center">
            {countryFlag}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-art-gold text-[10px] font-bold tracking-widest uppercase">
              <MapPin className="w-3 h-3 text-art-gold animate-bounce" />
              <span>CREATION ORIGIN</span>
            </div>
            <h4 className="font-serif text-lg font-bold text-white">
              {city}, <span className="text-art-gold">{country}</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">{currentCoords.region}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Authenticated Origin</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Stylized African Continent Map SVG */}
        <div className="relative w-full aspect-[4/3] bg-art-black/80 rounded-xl border border-art-gold/20 flex items-center justify-center p-3 overflow-hidden group">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:12px_12px]" />
          
          <svg viewBox="0 0 200 240" className="w-full h-full max-h-48 drop-shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <path
              d="M 72 26 L 90 28 L 126 32 L 138 46 L 152 74 L 146 88 L 154 98 L 160 114 L 148 126 L 142 144 L 132 168 L 120 192 L 106 214 L 98 214 L 94 200 L 86 182 L 80 162 L 74 148 L 68 136 L 56 122 L 40 106 L 36 94 L 40 76 L 48 58 L 58 40 Z"
              fill="#18181b"
              stroke="#D4AF37"
              strokeWidth="1.5"
              className="transition-colors duration-500 hover:fill-zinc-900"
            />
            <line x1="30" y1="120" x2="170" y2="120" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
            <line x1="40" y1="60" x2="160" y2="60" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.2" />
            <line x1="60" y1="180" x2="140" y2="180" stroke="#D4AF37" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.2" />

            <circle cx={currentCoords.cx} cy={currentCoords.cy} r="14" fill="#D4AF37" opacity="0.2" className="animate-ping" />
            <circle cx={currentCoords.cx} cy={currentCoords.cy} r="8" fill="#D4AF37" opacity="0.4" />
            <circle cx={currentCoords.cx} cy={currentCoords.cy} r="4" fill="#D4AF37" stroke="#ffffff" strokeWidth="1.5" className="shadow-lg" />
          </svg>

          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-art-black/90 px-2 py-0.5 rounded text-[10px] text-art-gold font-mono border border-art-gold/30">
            <Compass className="w-3 h-3 text-art-gold animate-spin-slow" />
            <span>GEO-LOCATION VERIFIED</span>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 space-y-1.5">
            <span className="text-slate-400 font-medium block">Origin Significance</span>
            <p className="text-slate-300 leading-relaxed">
              Handcrafted within the indigenous artisanal traditions of <strong className="text-white">{city}, {country}</strong>. Certified by ARTELLIUM Heritage Preservation Network.
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Continental Heritage Tier</span>
            <span className="text-art-gold font-bold uppercase tracking-wider">Class A Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}
