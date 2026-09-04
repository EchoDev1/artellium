'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Palette, 
  Box, 
  PenTool, 
  Camera, 
  Scissors, 
  Sparkles, 
  TreePine, 
  Hammer, 
  Crown, 
  Flame, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  PlusCircle, 
  Award, 
  Zap, 
  CheckCircle2,
  TrendingUp,
  Globe,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Video,
  X,
  Film
} from 'lucide-react';

export default function JumiaArtHero() {
  const { videos = [], artworks = [], heroConfig, currency, formatPrice, setSelectedCategory } = useStore();
  const maxSlides = typeof heroConfig?.maxHeroSlides === 'number' ? heroConfig.maxHeroSlides : 4;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Countdown timer state for the Right Rail Live Auction card
  const [auctionTimeLeft, setAuctionTimeLeft] = useState({
    hours: '04',
    minutes: '38',
    seconds: '24'
  });

  useEffect(() => {
    const target = Date.now() + (4 * 3600 + 38 * 60 + 24) * 1000;
    const interval = setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setAuctionTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setAuctionTimeLeft({
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Approved Artist Videos for the Hero Carousel (bounded by admin maxSlides capacity)
  const heroVideos = useMemo(() => {
    const list = (videos || []).filter(v => v.status === 'approved');
    const pool = list.length > 0 ? list : (videos || []);
    return pool.slice(0, Math.max(1, maxSlides));
  }, [videos, maxSlides]);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCinemaVideo, setActiveCinemaVideo] = useState(null);
  const videoRef = useRef(null);

  // Auto-advance slides every 7.5 seconds unless user is hovering or cinema modal is open
  useEffect(() => {
    if (isPaused || activeCinemaVideo || heroVideos.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroVideos.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [isPaused, activeCinemaVideo, heroVideos.length]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroVideos.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroVideos.length) % heroVideos.length);
  };

  const safeIndex = heroVideos.length > 0 ? currentSlideIndex % heroVideos.length : 0;
  const currentSlide = heroVideos[safeIndex] || {
    artistName: 'Kofi Mensah',
    artistTitle: 'Master Painter & Gold Leaf Specialist',
    country: 'Ghana',
    countryFlag: '🇬🇭',
    city: 'Accra',
    artworkTitle: 'The Ancestral Horizon',
    videoUrl: '/videos/artist-savannah.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
    quote: 'Every stroke of gold leaf represents a prayer for our forebears.',
    duration: '1:45',
    priceNGN: 1850000,
    priceUSD: 1250,
  };

  // Video element playback synchronization (Autoplays with sound by default; users can mute)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            // If the browser enforces a strict autoplay gesture requirement on cold-load,
            // fall back to playing muted until first interaction unlocks the sound
            if (err.name === 'NotAllowedError' && !isMuted) {
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play().catch(() => {});
              }
            }
          });
        }
      }
    }
  }, [safeIndex, isPlaying, isMuted]);

  // Unlock unmuted sound on user's first document interaction if still unmuted
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (videoRef.current && !isMuted) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isMuted]);

  const toggleMute = (e) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    setIsMuted(nextMuted);
  };

  const togglePlayPause = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Department / Category Navigation Items for the Left Sidebar (Jumia-style Art Departments)
  const departments = [
    { name: 'Paintings', label: 'Fine Paintings & Oils', icon: Palette, href: '/categories/paintings', tag: 'Hot', color: 'red' },
    { name: 'Sculptures', label: 'Bronze & Metal Sculptures', icon: Box, href: '/categories/sculptures', tag: 'High Value', color: 'gold' },
    { name: 'Woodworks', label: 'Royal Masks & Woodworks', icon: TreePine, href: '/categories/woodworks' },
    { name: 'Textiles', label: 'Authentic Textiles & Kente', icon: Scissors, href: '/categories/textiles' },
    { name: 'Ceramics', label: 'Ceramics & Ancient Pottery', icon: Sparkles, href: '/categories/ceramics' },
    { name: 'Drawings', label: 'Charcoal & Fine Drawings', icon: PenTool, href: '/categories/drawings' },
    { name: 'Photography', label: 'Pan-African Photography', icon: Camera, href: '/categories/photography' },
    { name: 'Limited edition collections', label: 'Limited Edition Collections', icon: Crown, href: '/categories/limited-editions', tag: 'Exclusive', color: 'emerald' },
    { name: 'auctions', label: 'Live Fine Art Auctions', icon: Flame, href: '/auctions', tag: 'LIVE', color: 'red' },
    { name: 'artist-voices', label: 'Voices of Master Artists', icon: Film, href: '/artist-voices', tag: 'FEATURE', color: 'gold' },
    { name: 'exhibitions', label: 'Virtual Museum Halls', icon: Eye, href: '/exhibitions', tag: '3D', color: 'blue' },
  ];

  const formatPriceVal = (priceNgn, priceUsd) => {
    if (currency === 'USD' && priceUsd) {
      return `$${priceUsd.toLocaleString()}`;
    }
    return `₦${priceNgn.toLocaleString()}`;
  };

  return (
    <section className="w-full bg-[#FAF9F6] text-white pt-3 pb-6 border-b border-art-gold/20 select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP MARKETPLACE ASSURANCE BANNER (JUMIA STYLE TRUST STRIP) */}
        {/* ========================================================================= */}
        <div className="mb-3 hidden md:flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900 border border-art-gold/30 text-xs font-sans shadow-sm">
          <div className="flex items-center gap-2 text-art-gold font-semibold">
            <span className="w-2 h-2 rounded-full bg-art-gold animate-ping" />
            <span className="tracking-wide uppercase text-[11px] font-mono">ARTELLIUM FINE ART MARKETPLACE</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 hover:text-art-gold transition">
              <ShieldCheck className="w-3.5 h-3.5 text-art-gold" />
              <span>100% Signed Physical Provenance Certificate</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-emerald-400 transition">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Master Artist Settlement Guarantee</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-art-gold transition">
              <Globe className="w-3.5 h-3.5 text-art-gold" />
              <span>Museum-Grade Insured Global Freight</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. THE 3-PANEL TRADITIONAL MARKETPLACE HERO GRID (DESKTOP / TABLET / MOBILE) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          
          {/* ===================================================================== */}
          {/* LEFT COLUMN: ART DEPARTMENTS & MEDIUMS NAVIGATION (JUMIA SIDEBAR) */}
          {/* ===================================================================== */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="h-full bg-[#0D1017] rounded-2xl border border-art-gold/25 p-3 flex flex-col justify-between shadow-xl">
              <div>
                {/* Department Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-art-gold/15 mb-2">
                  <span className="font-serif text-xs font-bold text-art-gold uppercase tracking-wider flex items-center gap-2">
                    <Crown className="w-3.5 h-3.5 text-art-gold" />
                    <span>Art Departments</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">54 Nations</span>
                </div>

                {/* Categories List */}
                <nav className="space-y-0.5" aria-label="Art Marketplace Departments">
                  {departments.map((dept) => {
                    const Icon = dept.icon;
                    return (
                      <Link
                        key={dept.name}
                        href={dept.href}
                        onClick={() => {
                          if (dept.name !== 'auctions' && dept.name !== 'exhibitions') {
                            setSelectedCategory(dept.name);
                          }
                        }}
                        className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-art-gold hover:bg-art-gold/10 border border-transparent hover:border-art-gold/30 transition duration-200"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-art-gold transition shrink-0" />
                          <span className="font-sans line-clamp-1">{dept.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {dept.tag && (
                            <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold font-mono uppercase ${
                              dept.color === 'red' ? 'bg-red-950 text-red-400 border border-red-800/60 animate-pulse' :
                              dept.color === 'emerald' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60' :
                              dept.color === 'blue' ? 'bg-blue-950 text-blue-300 border border-blue-800/60' :
                              'bg-art-gold/20 text-art-gold border border-art-gold/40'
                            }`}>
                              {dept.tag}
                            </span>
                          )}
                          <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-art-gold group-hover:translate-x-0.5 transition" />
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Quick Support / Curator Hotline */}
              <div className="mt-3 pt-2.5 border-t border-white/10 px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Curator Advisory</span>
                </span>
                <Link href="/contact" className="text-art-gold hover:underline text-[10px] font-bold">
                  Inquire Now
                </Link>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* CENTER COLUMN: MAIN ARTIST VIDEO SHOWCASE CAROUSEL (AUTOPLAYING HERO) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 flex flex-col">
            <div 
              className="relative flex-1 min-h-[390px] sm:min-h-[430px] lg:min-h-[470px] rounded-2xl overflow-hidden bg-black border border-art-gold/40 shadow-2xl group flex flex-col justify-between"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Autoplaying Background Artist Video / Visual */}
              <div 
                className="absolute inset-0 z-0 cursor-pointer"
                onClick={() => setActiveCinemaVideo(currentSlide)}
                title="Click to watch full video story with sound"
              >
                {currentSlide.videoUrl?.includes('youtube') || currentSlide.videoUrl?.includes('youtu.be') ? (
                  <iframe
                    src={`${currentSlide.videoUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentSlide.videoUrl.split('embed/')[1] || ''}`}
                    title={currentSlide.artistName}
                    className="w-full h-full object-cover pointer-events-none scale-125 opacity-85 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    key={currentSlide.id || currentSlide.videoUrl}
                    src={currentSlide.videoUrl || '/videos/artist-savannah.mp4'}
                    poster={currentSlide.thumbnail}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    preload="auto"
                    onError={(e) => {
                      if (e.currentTarget && !e.currentTarget.src.includes('/videos/artist-savannah.mp4')) {
                        e.currentTarget.src = '/videos/artist-savannah.mp4';
                        e.currentTarget.play().catch(() => {});
                      }
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100 group-hover:scale-105"
                  />
                )}
                {/* Clean Subtle Gradients: Top for controls contrast, Bottom for artist bar contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 pointer-events-none" />
              </div>

              {/* Top Bar of the Video Carousel Slide: Leave only the write up on the same line as mute and push buttons */}
              <div className="relative z-10 p-3 sm:p-5 flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase shadow-lg backdrop-blur-md border bg-black/80 text-art-gold border-art-gold/50 shadow-gold-glow">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <Film className="w-3.5 h-3.5 text-art-gold" />
                    <span>ARTIST STORY</span>
                  </span>
                </div>

                {/* Video Controls: Mute/Unmute & Play/Pause & Counter */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 transition backdrop-blur-md border cursor-pointer ${
                      isMuted 
                        ? 'bg-black/70 text-slate-300 border-white/20 hover:border-art-gold hover:text-white' 
                        : 'bg-art-gold text-white border-art-gold shadow-gold-glow'
                    }`}
                    title={isMuted ? 'Unmute video sound' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-pulse text-white" />}
                    <span className="hidden sm:inline text-white">{isMuted ? 'Muted' : 'Sound On'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="p-1.5 rounded-full bg-black/70 hover:bg-art-gold text-white hover:text-art-black border border-white/20 hover:border-art-gold transition backdrop-blur-md cursor-pointer"
                    title={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>

                  <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-mono font-bold text-slate-300">
                    {safeIndex + 1} / {heroVideos.length}
                  </div>
                </div>
              </div>

              {/* Navigation Chevrons (Prev / Next Buttons) */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-art-gold text-white hover:text-art-black flex items-center justify-center border border-art-gold/40 transition shadow-xl z-20 cursor-pointer"
                aria-label="Previous Artist Video"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/75 hover:bg-art-gold text-white hover:text-art-black flex items-center justify-center border border-art-gold/40 transition shadow-xl z-20 cursor-pointer"
                aria-label="Next Artist Video"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Bottom Bar: Artist Name in place of Amount, Compact "Watch Full Video" Button, No Explore Work Button */}
              <div className="relative z-10 p-3 sm:p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 bg-black/60 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/15">
                  <div className="min-w-0">
                    <span className="text-[10px] text-art-gold font-mono uppercase tracking-wider block">Featured Artist</span>
                    <h2 className="font-serif text-base sm:text-xl font-bold text-white truncate tracking-wide">
                      {currentSlide.artistName}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveCinemaVideo(currentSlide)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-art-gold via-[#9E7720] to-art-gold-dark hover:brightness-110 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider transition shadow-gold-glow flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch Full Video</span>
                  </button>
                </div>

                {/* Carousel Pagination Progress Pills */}
                <div className="flex items-center justify-center gap-1.5 pt-0.5">
                  {heroVideos.map((slide, idx) => (
                    <button
                      key={slide.id || idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 transition-all rounded-full cursor-pointer ${
                        safeIndex === idx 
                          ? 'w-7 bg-art-gold shadow-gold-glow' 
                          : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                      title={`${slide.artistName}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: JUMIA-STYLE ACTION RAILS (3 DISTINCT FINE ART CARDS) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-3">
            
            {/* CARD 1: LIVE AUCTION QUICK-CARD (URGENCY & HIGH-CONVERSION) */}
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#1C0D0D] via-[#120808] to-[#0D0505] border border-red-700/40 p-3.5 shadow-xl flex flex-col justify-between relative overflow-hidden group">
              {/* Subtle background red glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-xl pointer-events-none" />

              <div className="space-y-2 relative z-10">
                {/* Header with Countdown Timer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>LIVE LOT #803</span>
                  </div>

                  {/* Real-time Ticking Timer */}
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 border border-red-800/60 text-[10px] font-mono font-bold text-red-300">
                    <Clock className="w-3 h-3 text-red-400" />
                    <span>{auctionTimeLeft.hours}:{auctionTimeLeft.minutes}:{auctionTimeLeft.seconds}</span>
                  </div>
                </div>

                {/* Artwork Thumbnail & Details */}
                <div className="flex items-center gap-2.5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-red-800/40">
                    <img
                      src="https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=200"
                      alt="The Golden Benin Queen"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-xs line-clamp-1 group-hover:text-red-300 transition">
                      The Golden Benin Queen
                    </h4>
                    <span className="text-[10px] text-slate-400 font-sans block">Amina Diallo · Lost-Wax Bronze</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-[10px] text-slate-400">Current Bid:</span>
                      <span className="font-serif text-xs font-black text-red-400">₦4,900,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href="/auctions"
                className="mt-2.5 w-full py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl transition shadow-crimson-glow flex items-center justify-center gap-1.5 text-center relative z-10"
              >
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>Place Live Bid Now</span>
              </Link>
            </div>

            {/* CARD 2: ARTIST ONBOARDING & MONETIZATION (EMPOWERING CREATORS) */}
            <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#1A1407] via-[#100D04] to-[#080602] border border-art-gold/35 p-3.5 shadow-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-art-gold uppercase tracking-wider font-mono flex items-center gap-1">
                    <Crown className="w-3 h-3 text-art-gold" />
                    <span>ARTIST SUBSCRIPTION</span>
                  </span>
                  <span className="bg-art-gold text-art-black px-1.5 py-0.2 rounded text-[8px] font-black uppercase font-mono">
                    DIRECT REMITTANCE
                  </span>
                </div>

                <h4 className="font-serif font-bold text-white text-xs leading-snug">
                  Showcase & Sell Fine Art Directly
                </h4>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Join 1,200+ master painters & sculptors. Instant payout ledger & verified physical certificates.
                </p>
              </div>

              <Link
                href="/artist/register"
                className="mt-2 w-full py-2 bg-art-gold hover:brightness-110 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-1.5 text-center relative z-10"
              >
                <PlusCircle className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Start Selling Art</span>
              </Link>
            </div>

            {/* CARD 3: MUSEUM PROVENANCE & SETTLEMENT ASSURANCE */}
            <div className="rounded-2xl bg-[#0B0E14] border border-emerald-800/40 p-3 shadow-lg flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-white block">Museum Settlement</span>
                  <span className="text-[9px] text-slate-400 block font-sans">Physical QR Ledger Guarantee</span>
                </div>
              </div>
              <Link
                href="/provenance-ledger"
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 shrink-0 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/40"
              >
                <span>Ledger</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE FULL CINEMA MODAL (UNMUTED WITH AUDIO & ARTIST DOSSIER) */}
      {/* ========================================================================= */}
      {activeCinemaVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#0B0E14] border border-art-gold/50 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[95vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-[#080A0E] border-b border-art-gold/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-art-gold/20 border border-art-gold/40 flex items-center justify-center text-art-gold font-bold">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{activeCinemaVideo.artistName}</span>
                    <span className="text-xs font-mono font-normal text-art-gold">({activeCinemaVideo.countryFlag || '🌍'} {activeCinemaVideo.country})</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    {activeCinemaVideo.artistTitle} · Featured Work: &ldquo;{activeCinemaVideo.artworkTitle}&rdquo;
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCinemaVideo(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition shrink-0 cursor-pointer"
                aria-label="Close cinema modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
              {activeCinemaVideo.videoUrl?.includes('youtube') || activeCinemaVideo.videoUrl?.includes('youtu.be') ? (
                <iframe
                  src={`${activeCinemaVideo.videoUrl.replace('watch?v=', 'embed/')}?autoplay=1`}
                  title={activeCinemaVideo.artistName}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeCinemaVideo.videoUrl || '/videos/artist-savannah.mp4'}
                  poster={activeCinemaVideo.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  onError={(e) => {
                    if (e.currentTarget && !e.currentTarget.src.includes('/videos/artist-savannah.mp4')) {
                      e.currentTarget.src = '/videos/artist-savannah.mp4';
                    }
                  }}
                  className="w-full h-full object-contain bg-black"
                />
              )}
            </div>

            {/* Modal Footer Dossier */}
            <div className="p-4 sm:p-6 bg-[#080A0E] border-t border-art-gold/20 space-y-3">
              <blockquote className="text-xs sm:text-sm text-amber-100/90 font-serif italic border-l-2 border-art-gold pl-3">
                &ldquo;{activeCinemaVideo.quote}&rdquo;
              </blockquote>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
                <div className="text-xs text-slate-400">
                  <span>Provenance Status: </span>
                  <span className="text-emerald-400 font-semibold">✓ Artellium Registered & Verified Atelier</span>
                </div>

                <div className="flex items-center gap-2">
                  {activeCinemaVideo.artworkId && (
                    <Link
                      href={`/artwork/${activeCinemaVideo.artworkId}`}
                      onClick={() => setActiveCinemaVideo(null)}
                      className="px-4 py-2 rounded-xl bg-art-gold hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition shadow-gold-glow flex items-center gap-1.5"
                    >
                      <span>Acquire / View Artwork</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <button
                    onClick={() => setActiveCinemaVideo(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
