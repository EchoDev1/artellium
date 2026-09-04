'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { ChevronLeft, ChevronRight, ArrowRight, Eye, Sparkles } from 'lucide-react';

export default function CuratorialSpotlightBanner() {
  const { priorityBannerPlacements = [], artworks = [], currency } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Active placements from admin/artist approved queue, or fall back to high-value masterworks
  const activePlacements = (priorityBannerPlacements || []).filter(p => p.status === 'active');

  const fallbackArtworks = (artworks || []).filter(
    (art) => art.artistType === 'Premium' || art.verificationBadge === 'gold' || art.isFeatured
  ).slice(0, 6);

  const slides = activePlacements.length > 0 ? activePlacements : (fallbackArtworks.length > 0 ? fallbackArtworks : [
    {
      id: 'art-101',
      title: 'The Ancestral Horizon',
      artistName: 'Kofi Mensah',
      country: 'Ghana',
      countryFlag: '🇬🇭',
      city: 'Accra',
      medium: 'Oil & 24K Gold Leaf on Canvas',
      dimensions: '150 x 120 cm',
      price: 1850000,
      priceUSD: 1250,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1400',
    },
    {
      id: 'art-102',
      title: 'Warrior of the Bronze Empire',
      artistName: 'Amina Diallo',
      country: 'Nigeria',
      countryFlag: '🇳🇬',
      city: 'Benin City',
      medium: 'Cast Bronze & Ebony Wood Base',
      dimensions: '85 x 40 x 35 cm',
      price: 3200000,
      priceUSD: 2150,
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1400',
    },
    {
      id: 'art-104',
      title: 'The Solitary Mask of Oyo',
      artistName: 'Chief Bakare Ogundele',
      country: 'Nigeria',
      countryFlag: '🇳🇬',
      city: 'Oyo',
      medium: 'Carved Iroko Wood & Brass Inlay',
      dimensions: '90 x 35 x 25 cm',
      price: 1450000,
      priceUSD: 980,
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1400',
    },
    {
      id: 'art-121',
      title: 'Rivers of the Great Rift',
      artistName: 'Nour El-Din',
      country: 'Egypt',
      countryFlag: '🇪🇬',
      city: 'Cairo',
      medium: 'Oil on Raw Linen',
      dimensions: '165 x 130 cm',
      price: 2650000,
      priceUSD: 1790,
      image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&q=80&w=1400',
    }
  ]);

  // Auto-slide effect every 6 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];
  const artworkTargetId = currentSlide.artworkId || currentSlide.id || 'art-101';

  const formatPriceDisplay = (priceNgn, priceUsd) => {
    if (currency === 'USD' && priceUsd) {
      return `$${priceUsd.toLocaleString()}`;
    }
    return `₦${priceNgn?.toLocaleString()}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 select-none">
      {/* TRADITIONAL ARCHIVAL MUSEUM SPOTLIGHT BANNER */}
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0C12] border border-art-gold/35 shadow-2xl group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="p-2 sm:p-2.5">
          
          {/* ARCHIVAL MATTED CANVAS PICTURE FRAME */}
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden p-1.5 sm:p-2 bg-[#050608] border border-white/10">
            
            {/* CANVAS DISPLAY (PRESERVED PANORAMIC ASPECT RATIO) */}
            <div className="relative aspect-[18/9] sm:aspect-[2.8/1] lg:aspect-[3.2/1] max-h-[300px] sm:max-h-[340px] w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
              <img
                src={currentSlide.image || currentSlide.artworkImage}
                alt={currentSlide.title || 'Masterpiece'}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />

              {/* Natural Archival Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/25 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-transparent to-black/75 pointer-events-none" />

              {/* Traditional Corner Registry Marks */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-art-gold/50 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-art-gold/50 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-art-gold/50 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-art-gold/50 pointer-events-none" />

              {/* Top Archival Header Dossier Badge */}
              <div className="absolute top-3 left-3.5 z-20 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-black/85 backdrop-blur-sm text-art-gold font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border border-art-gold/35">
                  ✦ CURATORIAL SPOTLIGHT · PROVENANCE HIGHLIGHT
                </span>
              </div>

              {/* Slide Counter */}
              <div className="absolute top-3 right-3.5 z-20">
                <span className="px-2.5 py-0.5 rounded bg-black/85 backdrop-blur-sm text-slate-300 font-mono text-[9px] sm:text-[10px] font-bold border border-white/15">
                  <span className="text-art-gold">{currentIndex + 1}</span> / {slides.length}
                </span>
              </div>

              {/* Traditional Left/Right Navigation Chevrons */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/80 hover:bg-art-gold text-slate-200 hover:text-art-black flex items-center justify-center border border-white/20 hover:border-art-gold transition shadow-lg z-30 cursor-pointer"
                aria-label="Previous Masterwork"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/80 hover:bg-art-gold text-slate-200 hover:text-art-black flex items-center justify-center border border-white/20 hover:border-art-gold transition shadow-lg z-30 cursor-pointer"
                aria-label="Next Masterwork"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* OVERLAID ARTIST & MASTERPIECE DOSSIER */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4.5 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                
                {/* Artist Name & Artwork Title */}
                <div className="space-y-0.5 max-w-xl">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-art-gold font-sans font-medium uppercase tracking-wider">
                    <span>{currentSlide.countryFlag || '🌍'}</span>
                    <span>{currentSlide.city ? `${currentSlide.city}, ` : ''}{currentSlide.country || 'Africa'}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-[10px] font-mono text-slate-300">MASTER ATELIER</span>
                  </div>

                  {/* MASTER ARTIST NAME */}
                  <h2 className="font-serif text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-wide uppercase">
                    {currentSlide.artistName}
                  </h2>

                  {/* Artwork Title & Medium */}
                  <p className="text-[11px] sm:text-xs text-slate-200 font-serif italic">
                    "{currentSlide.title}" {currentSlide.medium && <span className="font-sans not-italic text-slate-300 font-normal text-[10px] sm:text-[11px]"> — {currentSlide.medium}</span>}
                  </p>
                </div>

                {/* Valuation & Direct Action CTA */}
                <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2 shrink-0">
                  {currentSlide.price && (
                    <div className="text-left sm:text-right">
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider block">Valuation</span>
                      <span className="font-serif text-sm sm:text-lg font-bold text-art-gold">
                        {formatPriceDisplay(currentSlide.price, currentSlide.priceUSD)}
                      </span>
                    </div>
                  )}

                  <Link
                    href={`/artwork/${artworkTargetId}`}
                    className="px-4 py-2 rounded-lg bg-art-gold hover:brightness-110 text-white font-bold text-[11px] font-sans uppercase tracking-wider transition shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Masterpiece</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

            </div>

          </div>

          {/* TRADITIONAL SLIDE INDICATOR PILLS */}
          <div className="pt-2 flex items-center justify-center gap-1.5">
            {slides.map((slide, idx) => (
              <button
                key={slide.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all rounded-full cursor-pointer ${
                  currentIndex === idx 
                    ? 'w-8 bg-art-gold' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={slide.artistName ? `${slide.artistName} - ${slide.title}` : `Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

