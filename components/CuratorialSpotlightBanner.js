'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { ChevronLeft, ChevronRight, ArrowRight, Eye, Sparkles, Volume2, VolumeX, Play, Pause, ExternalLink, Film } from 'lucide-react';

export default function CuratorialSpotlightBanner() {
  const { priorityBannerPlacements = [], artworks = [], currency, demoTransitionMode = 'progressive' } = useStore();
  const isLiveOnly = demoTransitionMode === 'live_only';
  const isMockOrDemo = (a) => !a || a.isDemo === true || String(a.id || '').startsWith('mock-') || a.id === 'art-101' || a.id === 'art-102';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  // Active placements from admin/artist approved queue, or fall back to high-value masterworks
  const realArtworksPool = (artworks || []).filter(a => !isMockOrDemo(a));
  const eligiblePlacements = isLiveOnly
    ? (priorityBannerPlacements || []).filter(p => p.status === 'active' && (!isMockOrDemo(p) || p.isPartnerAd))
    : (priorityBannerPlacements || []).filter(p => p.status === 'active');

  const fallbackArtworks = (isLiveOnly ? realArtworksPool : (artworks || [])).filter(
    (art) => art.artistType === 'Premium' || art.verificationBadge === 'gold' || art.isFeatured
  ).slice(0, 6);

  const realFallbacks = fallbackArtworks.length > 0 ? fallbackArtworks : realArtworksPool.slice(0, 4);

  const slides = eligiblePlacements.length > 0 ? eligiblePlacements : (realFallbacks.length > 0 ? realFallbacks : (isLiveOnly ? [] : [
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
  ]));

  const safeIndex = slides.length > 0 ? currentIndex % slides.length : 0;
  const currentSlide = slides[safeIndex] || slides[0];
  const isVideoSlide = Boolean(currentSlide && (currentSlide.mediaType === 'video' || currentSlide.videoUrl));

  // Auto-slide effect every 6.5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, isVideoSlide ? 12000 : 6500);

    return () => clearInterval(timer);
  }, [isPaused, slides.length, isVideoSlide]);

  // Sync video playback when slide changes
  useEffect(() => {
    if (isVideoSlide && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [safeIndex, isVideoSlide, isMuted, isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0 || !currentSlide) return null;

  const artworkTargetId = currentSlide.artworkId || currentSlide.id || (isLiveOnly ? (realArtworksPool[0]?.id || '') : 'art-101');
  const targetHref = currentSlide.ctaLink || (currentSlide.isPartnerAd ? '/explore' : `/artwork/${artworkTargetId}`);
  const ctaLabel = currentSlide.ctaText || (currentSlide.isPartnerAd ? 'Explore Partner Offer' : 'View Masterpiece');

  const formatPriceDisplay = (priceNgn, priceUsd) => {
    if (!priceNgn && !priceUsd) return null;
    if (currency === 'USD' && priceUsd) {
      return `$${Number(priceUsd).toLocaleString()}`;
    }
    if (currency === 'USD' && priceNgn) {
      return `$${Math.round(Number(priceNgn) / 1480).toLocaleString()}`;
    }
    return `₦${Number(priceNgn)?.toLocaleString()}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 select-none">
      {/* FULL-SCREEN ULTRA-WIDE TELEVISION / CINEMA AD BANNER */}
      <div
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#06070A] border-2 border-art-gold/55 shadow-[0_20px_50px_rgba(0,0,0,0.65)] group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Top Kente Royal Bezel Trim */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#062319] via-art-gold to-[#8B0000]" />

        <div className="p-2 sm:p-3 bg-gradient-to-b from-[#12151E] via-[#090B10] to-[#050608]">
          {/* TV SCREEN INNER BEZEL (100% UNDIVIDED FULL WIDTH DISPLAY) */}
          <div className="relative aspect-[16/9] sm:aspect-[2.6/1] lg:aspect-[3.1/1] max-h-[340px] sm:max-h-[400px] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black border border-art-gold/35 shadow-inner flex items-center justify-center">
            
            {/* Full-Bleed Media (Video or Photo/Artwork) */}
            {isVideoSlide ? (
              currentSlide.videoUrl?.includes('youtube') || currentSlide.videoUrl?.includes('youtu.be') ? (
                <iframe
                  src={`${currentSlide.videoUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1`}
                  title={currentSlide.title || 'Sponsored Video'}
                  className="w-full h-full object-cover pointer-events-none scale-110"
                  allow="autoplay; encrypted-media"
                />
              ) : (
                <video
                  ref={videoRef}
                  key={currentSlide.videoUrl || currentSlide.id}
                  src={currentSlide.videoUrl}
                  poster={currentSlide.image || currentSlide.artworkImage}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.02]"
                />
              )
            ) : (
              <Link href={targetHref} className="block w-full h-full cursor-pointer">
                <img
                  src={currentSlide.image || currentSlide.artworkImage}
                  alt={currentSlide.title || 'Featured Showcase'}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-[1.03]"
                />
              </Link>
            )}

            {/* Cinema TV Screen Reflection & Vignette Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/35 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/65 pointer-events-none" />
            {/* Subtle Diagonal Screen Glass Glare */}
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_38%,rgba(255,255,255,0)_100%)] pointer-events-none" />

            {/* Traditional Corner Registry Mounts */}
            <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-art-gold/60 pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-art-gold/60 pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-art-gold/60 pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-art-gold/60 pointer-events-none" />

            {/* Top Left: Ad / Curatorial Broadcast Badge */}
            <div className="absolute top-3.5 left-4 z-20 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-art-gold font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border border-art-gold/45 flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3 h-3 text-art-gold animate-pulse" />
                <span>
                  {currentSlide.badge || (currentSlide.isPartnerAd ? 'OFFICIAL PARTNER SPONSORSHIP · AD' : 'CURATORIAL SPOTLIGHT · FEATURED SHOWCASE')}
                </span>
              </span>
              {isVideoSlide && (
                <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                  <Film className="w-3 h-3" />
                  <span>VIDEO AD</span>
                </span>
              )}
            </div>

            {/* Top Right: Video Sound Controls & Slide Counter */}
            <div className="absolute top-3.5 right-4 z-20 flex items-center gap-2">
              {isVideoSlide && !currentSlide.videoUrl?.includes('youtube') && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const nextMuted = !isMuted;
                      setIsMuted(nextMuted);
                      if (videoRef.current) videoRef.current.muted = nextMuted;
                    }}
                    className="px-2.5 py-1 rounded-full bg-black/80 hover:bg-art-gold text-white hover:text-black font-mono text-[10px] font-bold border border-white/20 transition flex items-center gap-1 cursor-pointer"
                    title={isMuted ? 'Unmute Ad Video' : 'Mute Ad Video'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-art-gold" />}
                    <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        if (isPlaying) videoRef.current.pause();
                        else videoRef.current.play().catch(() => {});
                      }
                      setIsPlaying(!isPlaying);
                    }}
                    className="p-1.5 rounded-full bg-black/80 hover:bg-art-gold text-white hover:text-black border border-white/20 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                  </button>
                </>
              )}
              <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-slate-300 font-mono text-[9px] sm:text-[10px] font-bold border border-white/15">
                <span className="text-art-gold">{safeIndex + 1}</span> / {slides.length}
              </span>
            </div>

            {/* Left/Right Navigation Chevrons */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-art-gold text-slate-200 hover:text-art-black flex items-center justify-center border border-white/20 hover:border-art-gold transition shadow-xl z-30 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-art-gold text-slate-200 hover:text-art-black flex items-center justify-center border border-white/20 hover:border-art-gold transition shadow-xl z-30 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Bottom Full-Width Cinema Overlay Dossier & Write-up */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-art-gold font-sans font-semibold uppercase tracking-wider">
                  <span>{currentSlide.countryFlag || '🌍'}</span>
                  <span>
                    {currentSlide.partnerName || currentSlide.artistName || 'Artellium Partner Showcase'}
                  </span>
                  {currentSlide.country && (
                    <>
                      <span className="text-slate-500">·</span>
                      <span className="text-[10px] font-mono text-slate-300">
                        {currentSlide.city ? `${currentSlide.city}, ` : ''}{currentSlide.country}
                      </span>
                    </>
                  )}
                </div>

                <Link href={targetHref}>
                  <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white hover:text-art-gold transition-colors tracking-wide leading-tight cursor-pointer drop-shadow-md">
                    {currentSlide.title}
                  </h2>
                </Link>

                {/* Write-up / Description or Medium */}
                {(currentSlide.description || currentSlide.writeup || currentSlide.medium) && (
                  <p className="text-xs sm:text-sm text-slate-200/95 font-sans line-clamp-2 max-w-xl leading-relaxed">
                    {currentSlide.description || currentSlide.writeup || `${currentSlide.medium}${currentSlide.dimensions ? ` — ${currentSlide.dimensions}` : ''}`}
                  </p>
                )}
              </div>

              {/* Right CTA & Valuation */}
              <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2.5 shrink-0">
                {formatPriceDisplay(currentSlide.price, currentSlide.priceUSD) && (
                  <div className="text-left sm:text-right bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-art-gold/30">
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider block">
                      {currentSlide.isPartnerAd ? 'Featured Offer' : 'Valuation'}
                    </span>
                    <span className="font-serif text-base sm:text-xl font-black text-art-gold">
                      {formatPriceDisplay(currentSlide.price, currentSlide.priceUSD)}
                    </span>
                  </div>
                )}

                <Link
                  href={targetHref}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-art-gold via-[#9E7720] to-art-gold-dark hover:brightness-110 text-white font-bold text-xs font-sans uppercase tracking-wider transition shadow-gold-glow flex items-center gap-2 shrink-0"
                >
                  {currentSlide.isPartnerAd ? <ExternalLink className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

          {/* TV Bezel Bottom Indicator Strip */}
          <div className="pt-2.5 pb-0.5 px-2 flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 hidden sm:inline-block">
              ARTELLIUM ULTRA-VISION DISPLAY · PARTNER & CURATORIAL NETWORK
            </span>
            <div className="flex items-center justify-center gap-1.5 mx-auto sm:mx-0">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 transition-all rounded-full cursor-pointer ${
                    safeIndex === idx 
                      ? 'w-8 bg-art-gold shadow-gold-glow' 
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  title={slide.title || `Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Kente Royal Bezel Trim */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#8B0000] via-art-gold to-[#062319]" />
      </div>
    </div>
  );
}
