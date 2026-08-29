'use client';

import React, { useState, useEffect } from 'react';
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
  Globe
} from 'lucide-react';

export default function JumiaArtHero() {
  const { artworks = [], currency, formatPrice, setSelectedCategory } = useStore();

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

  // Curated Masterpiece Hero Carousel Slides
  const heroSlides = [
    {
      id: 'slide-1',
      badge: '★ MASTERPIECE OF THE MONTH ★',
      badgeColor: 'gold',
      title: 'The Ancestral Horizon',
      artist: 'Kofi Mensah',
      artistOrigin: 'Accra, Ghana 🇬🇭',
      category: 'Paintings',
      medium: 'Oil & 24K Gold Leaf on Canvas',
      dimensions: '150 x 120 cm (2026)',
      priceNGN: 1850000,
      priceUSD: 1250,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
      artworkId: 'art-101',
      primaryCta: { text: 'Explore Masterpiece', href: '/artwork/art-101' },
      secondaryCta: { text: 'Browse Paintings', href: '/categories/paintings' }
    },
    {
      id: 'slide-2',
      badge: '🔥 LIVE AUCTION LOT #803',
      badgeColor: 'red',
      title: 'The Golden Benin Queen',
      artist: 'Amina Diallo',
      artistOrigin: 'Benin City, Nigeria 🇳🇬',
      category: 'Sculptures',
      medium: 'Polished Bronze & 24K Gold Filigree',
      dimensions: '95 x 45 x 40 cm (19 Bids Placed)',
      priceNGN: 4900000,
      priceUSD: 3300,
      image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1200',
      artworkId: 'art-108',
      primaryCta: { text: 'Enter Live Bidding', href: '/auctions' },
      secondaryCta: { text: 'Bidder Registration', href: '/bidder-registration' }
    },
    {
      id: 'slide-3',
      badge: '🏛️ VIRTUAL MUSEUM EXHIBITION',
      badgeColor: 'emerald',
      title: 'Daughters of the Nile',
      artist: 'Nour El-Din',
      artistOrigin: 'Cairo, Egypt 🇪🇬',
      category: 'Paintings',
      medium: 'Monumental Oil on Lined Canvas',
      dimensions: '200 x 140 cm · Cairo Gallery Collection',
      priceNGN: 4500000,
      priceUSD: 3000,
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=1200',
      artworkId: 'art-106',
      primaryCta: { text: 'Enter Virtual Gallery', href: '/exhibitions' },
      secondaryCta: { text: 'View Provenance Dossier', href: '/artwork/art-106' }
    },
    {
      id: 'slide-4',
      badge: '👑 ARTIST SELF-SERVICE MONETIZATION',
      badgeColor: 'gold',
      title: 'Sell Your Art Directly to 50k+ Global Patrons',
      artist: 'Join 1,200+ Verified Master Creators',
      artistOrigin: 'Pan-African Ateliers Across 54 Nations',
      category: 'Artist Portal',
      medium: 'Automated Backend · Direct Master Remittance · Settlement Logistics',
      dimensions: 'Standard Tier (₦30k/mo) · Premium Gold Crest (₦50k/mo)',
      priceNGN: 30000,
      priceUSD: 20,
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
      artworkId: 'art-102',
      primaryCta: { text: 'Register as Artist Now', href: '/artist/register' },
      secondaryCta: { text: 'Learn Seller Benefits', href: '/artist/dashboard' }
    }
  ];

  // Auto-advance slides every 6.5 seconds unless user is hovering
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentSlide = heroSlides[currentSlideIndex];

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
    { name: 'exhibitions', label: 'Virtual Museum Halls', icon: Eye, href: '/exhibitions', tag: '3D', color: 'blue' },
  ];

  const formatPriceVal = (priceNgn, priceUsd) => {
    if (currency === 'USD' && priceUsd) {
      return `$${priceUsd.toLocaleString()}`;
    }
    return `₦${priceNgn.toLocaleString()}`;
  };

  return (
    <section className="w-full bg-[#062319] text-white pt-3 pb-6 border-b border-art-gold/20 select-none">
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
            <span className="flex items-center gap-1.5 hover:text-amber-400 transition">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
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
          {/* CENTER COLUMN: MAIN MASTERPIECE SHOWCASE CAROUSEL (HIGH IMPACT HERO) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 flex flex-col">
            <div 
              className="relative flex-1 min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] rounded-2xl overflow-hidden bg-black border border-art-gold/40 shadow-2xl group flex flex-col justify-between"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Background High-Resolution Artwork Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 scale-100 group-hover:scale-105"
                />
                {/* Multi-layer High-Contrast Vignette for Clear Traditional Typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-[#07080A]/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#07080A]/90 via-[#07080A]/40 to-transparent" />
              </div>

              {/* Top Bar of the Carousel Slide */}
              <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase shadow-lg backdrop-blur-md border ${
                  currentSlide.badgeColor === 'red' ? 'bg-red-950/80 text-red-300 border-red-700/60 shadow-crimson-glow' :
                  currentSlide.badgeColor === 'emerald' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 shadow-emerald-glow' :
                  'bg-black/75 text-art-gold border-art-gold/50 shadow-gold-glow'
                }`}>
                  {currentSlide.badgeColor === 'red' ? <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" /> :
                   currentSlide.badgeColor === 'emerald' ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> :
                   <Sparkles className="w-3.5 h-3.5 text-art-gold" />}
                  <span>{currentSlide.badge}</span>
                </span>

                {/* Slide Counter Indicator */}
                <div className="bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 text-[10px] font-mono font-bold text-slate-300">
                  {currentSlideIndex + 1} / {heroSlides.length}
                </div>
              </div>

              {/* Navigation Chevrons (Prev / Next Buttons) */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-art-gold text-white hover:text-art-black flex items-center justify-center border border-art-gold/40 transition shadow-xl z-20 cursor-pointer"
                aria-label="Previous Featured Lot"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-art-gold text-white hover:text-art-black flex items-center justify-center border border-art-gold/40 transition shadow-xl z-20 cursor-pointer"
                aria-label="Next Featured Lot"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Bottom Content Area: Title, Artist Info, Pricing, Action CTAs */}
              <div className="relative z-10 p-4 sm:p-6 space-y-3">
                {/* Artist Origin & Department Tag */}
                <div className="flex items-center gap-2 text-xs text-art-gold font-sans font-semibold">
                  <span>{currentSlide.artistOrigin}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-300 font-mono text-[11px]">{currentSlide.medium}</span>
                </div>

                {/* Masterpiece Title */}
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-wide drop-shadow-md">
                  {currentSlide.title}
                </h1>

                {/* Artist Name & Dimensions */}
                <p className="text-xs sm:text-sm text-slate-200 font-sans">
                  By <strong className="text-art-gold font-serif text-sm sm:text-base">{currentSlide.artist}</strong> <span className="text-slate-400">({currentSlide.dimensions})</span>
                </p>

                {/* Price Valuation Box & Action CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/15">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Valuation / Reserve Price</span>
                    <span className="font-serif text-xl sm:text-2xl font-black text-art-gold drop-shadow-sm">
                      {formatPriceVal(currentSlide.priceNGN, currentSlide.priceUSD)}
                    </span>
                  </div>

                  {/* Dual CTAs */}
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={currentSlide.primaryCta.href}
                      className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider transition shadow-gold-glow flex items-center gap-1.5 shrink-0"
                    >
                      <span>{currentSlide.primaryCta.text}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={currentSlide.secondaryCta.href}
                      className="px-3.5 py-2.5 rounded-xl bg-black/60 hover:bg-black/80 border border-white/25 text-white hover:text-art-gold font-semibold text-xs transition shrink-0 hidden sm:flex items-center gap-1"
                    >
                      <span>{currentSlide.secondaryCta.text}</span>
                    </Link>
                  </div>
                </div>

                {/* Carousel Pagination Progress Pills */}
                <div className="pt-2 flex items-center justify-center gap-1.5">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 transition-all rounded-full cursor-pointer ${
                        currentSlideIndex === idx 
                          ? 'w-8 bg-art-gold shadow-gold-glow' 
                          : 'w-2 bg-white/25 hover:bg-white/50'
                      }`}
                      title={slide.title}
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
                className="mt-2 w-full py-2 bg-art-gold hover:brightness-110 text-art-black font-bold text-[11px] uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-1.5 text-center relative z-10"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Start Selling Art</span>
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
    </section>
  );
}
