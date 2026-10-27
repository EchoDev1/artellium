'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Sparkles, Eye, Crown, ScrollText, ArrowUpRight } from 'lucide-react';
import { useStore } from '@/context/store-context';
import { INITIAL_REAL_ARTWORKS } from '@/lib/real-artworks-seed';

const HERITAGE_MOTIFS = [
  {
    era: 'ROYAL BRONZE & CORAL LINEAGE',
    dynastyBadge: 'SACRED ARCHIVE I',
    accent: '#D4AF37',
    glow: 'rgba(212, 175, 55, 0.45)'
  },
  {
    era: 'SOVEREIGN LOOM & ADINKRA',
    dynastyBadge: 'SACRED ARCHIVE II',
    accent: '#10B981',
    glow: 'rgba(16, 185, 129, 0.42)'
  },
  {
    era: 'CLASSICAL TERRACOTTA & SPIRIT',
    dynastyBadge: 'SACRED ARCHIVE III',
    accent: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.45)'
  },
  {
    era: 'SOLAR GOLD & NILE HERITAGE',
    dynastyBadge: 'SACRED ARCHIVE IV',
    accent: '#EAB308',
    glow: 'rgba(234, 179, 8, 0.45)'
  },
  {
    era: 'ANCESTRAL NSIBIDI MONOLITH',
    dynastyBadge: 'SACRED ARCHIVE V',
    accent: '#EC4899',
    glow: 'rgba(212, 175, 55, 0.5)'
  }
];

export default function AfricanCulturalKaleidoscope() {
  const { artworks, realArtworks } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Select 5 authentic artworks (exact replica artwork images from the platform)
  const showcaseArtworks = useMemo(() => {
    const sourceList =
      Array.isArray(realArtworks) && realArtworks.length >= 5
        ? realArtworks
        : Array.isArray(artworks) && artworks.length > 0
        ? artworks.filter((a) => !a.isDemo && a.image)
        : [];

    const merged = [...sourceList];
    if (merged.length < 5 && Array.isArray(INITIAL_REAL_ARTWORKS)) {
      for (const seedArt of INITIAL_REAL_ARTWORKS) {
        if (merged.length >= 5) break;
        if (!merged.some((item) => item.id === seedArt.id)) {
          merged.push({
            ...seedArt,
            artistName: seedArt.artistName || seedArt.artist_name || 'Master African Artist'
          });
        }
      }
    }

    if (merged.length < 5 && Array.isArray(artworks)) {
      for (const fallbackArt of artworks) {
        if (merged.length >= 5) break;
        if (fallbackArt?.image && !merged.some((item) => item.id === fallbackArt.id)) {
          merged.push(fallbackArt);
        }
      }
    }

    return merged.slice(0, 5).map((art, idx) => {
      const motif = HERITAGE_MOTIFS[idx % HERITAGE_MOTIFS.length];
      return {
        id: art.id,
        title: (art.title || 'Sovereign Masterwork').trim(),
        artistName: art.artistName || art.artist_name || 'Master African Artist',
        medium: art.medium || art.category || 'Fine Art on Canvas',
        country: art.country || 'Nigeria',
        countryFlag: art.countryFlag || '🇳🇬',
        image: art.image,
        era: motif.era,
        dynastyBadge: motif.dynastyBadge,
        accent: motif.accent,
        glow: motif.glow
      };
    });
  }, [artworks, realArtworks]);

  // Auto-cycle through all 5 real artworks in the center showcase
  useEffect(() => {
    if (showcaseArtworks.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseArtworks.length);
    }, 4800);
    return () => clearInterval(timer);
  }, [showcaseArtworks.length]);

  if (showcaseArtworks.length === 0) return null;

  const safeIndex = activeIndex % showcaseArtworks.length;
  const activeArtwork = showcaseArtworks[safeIndex];
  // The 4 corner artworks (exact artwork images at the 4 corners)
  const cornerArtworks = showcaseArtworks.slice(0, 4);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setMouseOffset({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseOffset({ x: 0, y: 0 })}
      className="relative my-6 rounded-3xl overflow-hidden bg-[#05060A] border-2 border-art-gold/60 shadow-[0_20px_55px_rgba(0,0,0,0.85)] select-none"
    >
      {/* Top Traditional Royal Kente & Adinkra Woven Geometric Border */}
      <div className="h-2 w-full bg-[repeating-linear-gradient(90deg,#8B0000_0px,#8B0000_18px,#D4AF37_18px,#D4AF37_36px,#065F46_36px,#065F46_54px,#D97706_54px,#D97706_72px)]" />

      {/* Ambient Morphing Artwork Backdrop with Subtle Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {showcaseArtworks.map((art, idx) => (
          <img
            key={art.id}
            src={art.image}
            alt={art.title}
            style={{
              transform: `scale(1.1) translate(${mouseOffset.x * -0.45}px, ${mouseOffset.y * -0.45}px)`
            }}
            className={`absolute inset-0 w-full h-full object-cover blur-2xl transition-all duration-1000 ease-out filter saturate-150 ${
              idx === safeIndex ? 'opacity-25 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-radial from-transparent via-[#05060A]/85 to-[#05060A]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060A]/90 via-[#05060A]/55 to-[#05060A]/95" />
      </div>

      {/* Sacred African Celestial Astrolabe & Nsibidi Geometric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 600 600"
          className="w-[430px] h-[430px] sm:w-[540px] sm:h-[540px] opacity-25 animate-spin"
          style={{ animationDuration: '65s' }}
        >
          <circle cx="300" cy="300" r="282" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="6 10" />
          <circle cx="300" cy="300" r="252" fill="none" stroke="#D4AF37" strokeWidth="1" />
          <polygon points="300,26 574,300 300,574 26,300" fill="none" stroke="#D4AF37" strokeWidth="1.2" />
          <polygon
            points="300,26 574,300 300,574 26,300"
            fill="none"
            stroke="#10B981"
            strokeWidth="1.1"
            transform="rotate(45 300 300)"
          />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 300 300)`}>
              <circle cx="300" cy="34" r="3.5" fill="#D4AF37" />
              <line x1="300" y1="18" x2="300" y2="48" stroke="#D4AF37" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
      </div>

      {/* Main Compact Visual Stage */}
      <div className="relative z-10 px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center justify-between gap-5">
        
        {/* Top Royal Header Badge */}
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-black/85 backdrop-blur-xl border border-art-gold/55 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          <Crown className="w-3.5 h-3.5 text-art-gold animate-pulse" />
          <span className="font-mono text-[9px] sm:text-[11px] font-bold tracking-[0.28em] uppercase text-art-gold">
            SACRED AFRICAN COSMOLOGY · CLICK ANY MASTERWORK FOR IMAGE &amp; BRIEF HISTORY
          </span>
          <Sparkles className="w-3.5 h-3.5 text-art-gold" />
        </div>

        {/* 12-Column Sacred Grid: Left 2 Corner Artworks | Center 5-Artwork Changing Shrine | Right 2 Corner Artworks */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          
          {/* Left 2 Corner Exact Artwork Portals */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3.5">
            {cornerArtworks.slice(0, 2).map((art, idx) => {
              const isSelected = safeIndex === idx;
              return (
                <Link
                  key={art.id}
                  href={`/artwork/${art.id}#artwork-history`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`group relative h-28 sm:h-32 rounded-2xl overflow-hidden border-2 bg-[#090B10] transition-all duration-500 cursor-pointer flex items-center gap-3 p-2.5 text-left ${
                    isSelected
                      ? 'border-art-gold shadow-[0_0_25px_rgba(212,175,55,0.45)] scale-[1.02]'
                      : 'border-art-gold/25 hover:border-art-gold/80 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Ambient glow behind corner card */}
                  <img
                    src={art.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/85 pointer-events-none" />

                  {/* Exact Uncropped Replica Artwork Image Thumbnail */}
                  <div className="relative z-10 w-20 sm:w-24 h-full rounded-xl overflow-hidden bg-[#040508] border border-art-gold/50 shrink-0 flex items-center justify-center p-1 shadow-inner">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Artwork Title, Artist & Direct History Link Cue */}
                  <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-art-gold block truncate">
                        {art.dynastyBadge} · {art.countryFlag}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-white group-hover:text-art-gold transition truncate">
                        {art.title}
                      </h4>
                      <p className="text-[10px] text-slate-300 truncate">
                        {art.artistName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                      <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                        <ScrollText className="w-2.5 h-2.5" />
                        <span>Image &amp; Brief History</span>
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-art-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Center: 5 Changing Real Replica Artwork Images in Sacred Royal Frame */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <Link
              href={`/artwork/${activeArtwork.id}#artwork-history`}
              style={{
                transform: `perspective(900px) rotateY(${mouseOffset.x}deg) rotateX(${-mouseOffset.y}deg)`
              }}
              className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl bg-gradient-to-b from-[#1A1407] via-[#090B10] to-[#050608] border-2 border-art-gold shadow-[0_0_40px_rgba(212,175,55,0.4)] flex items-center justify-center p-3 transition-transform duration-200 ease-out group cursor-pointer"
            >
              {/* Pulsing Sacred Aura Halo */}
              <div
                className="absolute -inset-3 rounded-3xl blur-xl transition-all duration-700 pointer-events-none"
                style={{ background: activeArtwork.glow }}
              />

              {/* Traditional Royal Corner Filigree Brackets */}
              <span className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-art-gold rounded-tl-md pointer-events-none z-20" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-art-gold rounded-tr-md pointer-events-none z-20" />
              <span className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-art-gold rounded-bl-md pointer-events-none z-20" />
              <span className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-art-gold rounded-br-md pointer-events-none z-20" />

              {/* Top Counter Pill (1 of 5 Real Artworks) */}
              <div className="absolute -top-3 z-30 px-3 py-0.5 rounded-full bg-black/90 border border-art-gold/60 text-[9px] font-mono font-bold text-art-gold uppercase tracking-widest shadow-md">
                MASTERWORK {safeIndex + 1} OF {showcaseArtworks.length}
              </div>

              {/* Exact Replica Artwork Image (All 5 Artworks Smoothly Changing in the Center) */}
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden bg-[#06080D] border border-art-gold/40 flex items-center justify-center p-2">
                {showcaseArtworks.map((art, idx) => (
                  <img
                    key={art.id}
                    src={art.image}
                    alt={art.title}
                    className={`absolute inset-0 w-full h-full object-contain p-2 transition-all duration-700 ease-out ${
                      idx === safeIndex
                        ? 'opacity-100 scale-100 group-hover:scale-105'
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  />
                ))}
              </div>

              {/* Bottom CTA Pill on Center Frame */}
              <div className="absolute -bottom-3 z-30 px-3.5 py-1 rounded-full bg-gradient-to-r from-art-gold via-amber-400 to-art-gold-dark text-black font-mono text-[9px] font-black uppercase tracking-widest shadow-gold-glow flex items-center gap-1.5 group-hover:scale-105 transition">
                <Eye className="w-3 h-3 text-black" />
                <span>OPEN IMAGE &amp; HISTORY</span>
              </div>
            </Link>

            {/* Active Center Artwork Title & Artist Plaque */}
            <div className="mt-4 text-center space-y-0.5">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-emerald-400 block">
                {activeArtwork.artistName} · {activeArtwork.medium}
              </span>
              <Link
                href={`/artwork/${activeArtwork.id}#artwork-history`}
                className="font-serif text-lg sm:text-xl font-black text-white hover:text-art-gold transition tracking-wide block"
              >
                &ldquo;{activeArtwork.title}&rdquo;
              </Link>
            </div>

            {/* 5 Changing Center Artwork Mini Replica Switcher */}
            <div className="mt-2.5 flex items-center gap-2">
              {showcaseArtworks.map((art, idx) => (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  title={`${art.title} by ${art.artistName}`}
                  className={`relative w-8 h-8 rounded-lg overflow-hidden border transition-all cursor-pointer bg-black p-0.5 ${
                    safeIndex === idx
                      ? 'border-art-gold scale-110 ring-2 ring-art-gold/50 shadow-md'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right 2 Corner Exact Artwork Portals */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3.5">
            {cornerArtworks.slice(2, 4).map((art, i) => {
              const idx = i + 2;
              const isSelected = safeIndex === idx;
              return (
                <Link
                  key={art.id}
                  href={`/artwork/${art.id}#artwork-history`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`group relative h-28 sm:h-32 rounded-2xl overflow-hidden border-2 bg-[#090B10] transition-all duration-500 cursor-pointer flex items-center gap-3 p-2.5 text-left ${
                    isSelected
                      ? 'border-art-gold shadow-[0_0_25px_rgba(212,175,55,0.45)] scale-[1.02]'
                      : 'border-art-gold/25 hover:border-art-gold/80 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Ambient glow behind corner card */}
                  <img
                    src={art.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/85 pointer-events-none" />

                  {/* Exact Uncropped Replica Artwork Image Thumbnail */}
                  <div className="relative z-10 w-20 sm:w-24 h-full rounded-xl overflow-hidden bg-[#040508] border border-art-gold/50 shrink-0 flex items-center justify-center p-1 shadow-inner">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Artwork Title, Artist & Direct History Link Cue */}
                  <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      <span className="text-[8px] font-mono uppercase tracking-widest text-art-gold block truncate">
                        {art.dynastyBadge} · {art.countryFlag}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-white group-hover:text-art-gold transition truncate">
                        {art.title}
                      </h4>
                      <p className="text-[10px] text-slate-300 truncate">
                        {art.artistName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                      <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                        <ScrollText className="w-2.5 h-2.5" />
                        <span>Image &amp; Brief History</span>
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-art-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>

      {/* Bottom Royal Kente Geometric Accent Strip */}
      <div className="h-1.5 w-full bg-[repeating-linear-gradient(90deg,#D4AF37_0px,#D4AF37_24px,#065F46_24px,#065F46_48px,#8B0000_48px,#8B0000_72px)]" />
    </section>
  );
}
