'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Globe, 
  Users, 
  Building2, 
  CheckCircle2, 
  Target, 
  Flame, 
  BookOpen, 
  Shield, 
  Layers,
  HeartHandshake,
  Lightbulb,
  Compass,
  Eye,
  Check,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';

export default function AboutPage() {
  const [activeHash, setActiveHash] = useState('goal');

  // Handle hash scrolling on mount or URL change
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const id = window.location.hash.replace('#', '');
        setActiveHash(id);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navItems = [
    { id: 'goal', label: 'Artellium Goal', icon: Target },
    { id: 'who-we-are', label: 'Who We Are', icon: Users },
    { id: 'services', label: 'Our Services', icon: ShoppingBag },
    { id: 'vision', label: 'Our Vision', icon: Eye },
    { id: 'mission', label: 'Our Mission', icon: Compass },
    { id: 'core-values', label: 'Our Core Values', icon: Lightbulb },
  ];

  return (
    <main className="min-h-screen bg-[#07080A] text-slate-300 pb-20 font-sans">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark w-full" />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-art-gold/20 bg-gradient-to-b from-[#181105] via-[#0A0D14] to-[#07080A] pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-art-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-art-green/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-art-gold/15 text-art-gold text-[10px] font-bold tracking-widest uppercase border border-art-gold/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PAN-AFRICAN DIGITAL ART MARKETPLACE & CREATIVE ENTERPRISE</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-wide leading-tight">
              Where Art Meets <span className="text-gradient-gold">Culture, Commerce & Innovation.</span>
            </h1>

            {/* Signature Quote */}
            <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-art-gold/40 shadow-gold-glow backdrop-blur-md space-y-2">
              <p className="font-serif text-base sm:text-xl text-amber-200 italic leading-relaxed">
                “At Artellium, we believe that every artwork tells a story, every artist has a voice and a face”.
              </p>
              <span className="text-[11px] text-art-gold font-mono font-bold tracking-wider uppercase block">
                — The Artellium Creed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Sticky Bar */}
      <div className="sticky top-0 z-30 bg-[#0A0D14]/95 backdrop-blur-md border-b border-art-gold/20 py-3 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0">
            About Us:
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeHash === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveHash(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                  isActive
                    ? 'bg-art-gold text-art-black shadow-gold-glow'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        
        {/* ========================================================================= */}
        {/* 1. ARTELLIUM GOAL                                                         */}
        {/* ========================================================================= */}
        <section
          id="goal"
          className={`scroll-mt-28 p-8 sm:p-12 rounded-3xl border transition-all duration-300 space-y-6 ${
            activeHash === 'goal'
              ? 'bg-gradient-to-br from-[#181206] via-[#0E1118] to-[#0A0D14] border-art-gold/60 shadow-2xl ring-1 ring-art-gold/30'
              : 'bg-[#0E1118] border-white/10'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-art-gold/15 border border-art-gold/30 flex items-center justify-center text-art-gold shadow-gold-glow">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-art-gold uppercase tracking-widest block">
                  STRATEGIC MANDATE
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  Artellium Goal
                </h2>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-full bg-art-gold/10 text-art-gold border border-art-gold/30 text-xs font-bold uppercase tracking-wider shrink-0">
              Creative Enterprise
            </span>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
            <blockquote className="p-4 rounded-xl bg-black/40 border-l-4 border-art-gold text-amber-100 font-serif italic text-base sm:text-lg">
              “At Artellium, we believe that every artwork tells a story, every artist has a voice and a face”.
            </blockquote>

            <p>
              Artellium is a digital art marketplace and creative enterprise dedicated to transforming the way art is discovered, appreciated, traded and preserved. We provide an innovative platform where artists, collectors, investors and art enthusiasts connect through technology to buy, sell, celebrate creativity and cultural heritage.
            </p>

            <p>
              Artellium serves as a comprehensive ecosystem for the buying and selling of artworks and crafts, online and physical exhibitions, art auctions, artist promotion, creative storytelling, and the preservation of artistic history. By combining digital innovation with traditional artistic values, Artellium creates opportunities for artists to gain global visibility while making authentic works accessible to collectors and audiences worldwide.
            </p>
          </div>

          {/* Ecosystem Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <Sparkles className="w-4 h-4 text-art-gold" />
              <span className="font-bold text-white block">Art & Crafts Marketplace</span>
              <p className="text-[11px] text-slate-400">Authentic buying & selling of original masterworks.</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white block">Hybrid Exhibitions</span>
              <p className="text-[11px] text-slate-400">3D WebGL virtual halls and physical museum showcases.</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <Flame className="w-4 h-4 text-red-400" />
              <span className="font-bold text-white block">Live Arena Auctions</span>
              <p className="text-[11px] text-slate-400">Real-time competitive bidding and instant settlement.</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white block">History Preservation</span>
              <p className="text-[11px] text-slate-400">Immutable provenance records and digital certificates.</p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. WHO WE ARE                                                             */}
        {/* ========================================================================= */}
        <section
          id="who-we-are"
          className={`scroll-mt-28 p-8 sm:p-12 rounded-3xl border transition-all duration-300 space-y-6 ${
            activeHash === 'who-we-are'
              ? 'bg-gradient-to-br from-[#121620] via-[#0E1118] to-[#0A0D14] border-blue-500/60 shadow-2xl ring-1 ring-blue-400/30'
              : 'bg-[#0E1118] border-white/10'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
                  IDENTITY & COMMITMENT
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  Who We Are
                </h2>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider shrink-0">
              Artellium Limited
            </span>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-4xl">
            <p className="font-medium text-white text-base sm:text-lg">
              Artellium Limited is more than an online art marketplace. It is a creative hub where art meets commerce, education, culture and technology.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* For Artists */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-art-gold font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>For Emerging & Established Artists</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  We are committed to creating sustainable opportunities for emerging and established artists by providing a secure and transparent platform that enables them to showcase their works, build their brands, engage audiences and generate income.
                </p>
              </div>

              {/* For Collectors */}
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>For Collectors & Discerning Buyers</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  For collectors and buyers, we provide access to carefully curated original artworks, authentic crafts, limited editions, collectibles and exclusive pieces from diverse artistic traditions and contemporary Creators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* OUR SERVICES: ONLINE ART MARKETPLACE                                      */}
        {/* ========================================================================= */}
        <section
          id="services"
          className={`scroll-mt-28 p-8 sm:p-12 rounded-3xl border transition-all duration-300 space-y-6 ${
            activeHash === 'services'
              ? 'bg-gradient-to-br from-[#181206] via-[#0E1118] to-[#0A0D14] border-art-gold/60 shadow-2xl ring-1 ring-art-gold/30'
              : 'bg-[#0E1118] border-white/10'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-art-gold/15 border border-art-gold/30 flex items-center justify-center text-art-gold shadow-gold-glow">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-art-gold uppercase tracking-widest block">
                  DIGITAL COMMERCE & DISCOVERY
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  Our Services
                </h2>
              </div>
            </div>

            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider shrink-0">
              Online Art Marketplace
            </span>
          </div>

          <div className="space-y-3 max-w-4xl">
            <h3 className="font-serif text-xl font-bold text-white">Online Art Marketplace</h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Artellium provides a secure digital marketplace where collectors and buyers can discover and purchase:
            </p>
          </div>

          {/* 12 Official Service Offerings */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'Paintings', desc: 'Original oil, acrylic, watercolor, and master canvases', icon: '🎨', href: '/categories/paintings' },
              { label: 'Sculptures', desc: 'Bronze castings, carved wood, stone, and clay forms', icon: '🗿', href: '/categories/sculptures' },
              { label: 'Drawings', desc: 'Charcoal, ink, graphite, pastels, and master sketches', icon: '✏️', href: '/categories/drawings' },
              { label: 'Photography', desc: 'Fine art photography, documentary, and portraiture', icon: '📷', href: '/categories/photography' },
              { label: 'Textiles', desc: 'Hand-woven tapestries, Adire, Batik, and fiber art', icon: '🧵', href: '/categories/textiles' },
              { label: 'Pottery', desc: 'Traditional terracotta, clay vessels, and ancient pots', icon: '🏺', href: '/categories/pottery' },
              { label: 'Ceramics', desc: 'Glazed fine art ceramics and contemporary stoneware', icon: '🍶', href: '/categories/ceramics' },
              { label: 'Woodworks', desc: 'Carved mahogany, ancestral masks, and woodcraft', icon: '🪵', href: '/categories/woodworks' },
              { label: 'Metal works', desc: 'Cast bronze, forged iron, brass filigree, and relief', icon: '⚒️', href: '/categories/metal-works' },
              { label: 'Handmade crafts', desc: 'Beadwork, leathercraft, and artisanal treasures', icon: '🪡', href: '/categories/handmade-crafts' },
              { label: 'Indigenous artworks', desc: 'Ancestral heritage pieces and ritual folklore art', icon: '👑', href: '/categories/indigenous-artworks' },
              { label: 'Limited edition collections', desc: 'Numbered fine art prints and master editions', icon: '✨', href: '/categories/limited-editions' },
            ].map((srv, idx) => (
              <Link
                key={idx}
                href={srv.href}
                className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-art-gold/50 transition space-y-1.5 group block"
              >
                <div className="text-xl group-hover:scale-110 transition duration-200">{srv.icon}</div>
                <h4 className="font-serif font-bold text-sm text-white group-hover:text-art-gold transition">{srv.label}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{srv.desc}</p>
              </Link>
            ))}
          </div>

          {/* Service Pillar 2: Art Exhibitions & SDGs Sustainability */}
          <div className="pt-8 border-t border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                    SUSTAINABLE CURATION & GLOBAL REACH
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Art Exhibitions
                  </h3>
                </div>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider shrink-0">
                SDGs Dialogues for Sustainable Living
              </span>
            </div>

            <div className="space-y-3 max-w-4xl">
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                We curate exhibitions that showcase artistic excellence while connecting creators with wider audiences through various SDGs discussions for a sustainable living.
              </p>
              <p className="text-xs sm:text-sm text-art-gold font-mono font-bold uppercase tracking-wider">
                Our exhibitions include:
              </p>
            </div>

            {/* The 4 Exhibition Types */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {[
                {
                  title: 'Physical exhibitions',
                  desc: 'Monumental museum showcases, national gallery pavilions, and physical masterwork exhibitions.',
                  icon: '🏛️',
                  sdg: 'SDG 11: Heritage Preservation',
                  badge: 'Museum & Gallery',
                  href: '/exhibitions'
                },
                {
                  title: 'Virtual exhibitions',
                  desc: 'Interactive 3D WebGL spatial gallery rooms connecting international collectors and institutions.',
                  icon: '🌐',
                  sdg: 'SDG 9: Digital Innovation',
                  badge: '3D Spatial WebGL',
                  href: '/exhibitions'
                },
                {
                  title: 'Pop-up galleries',
                  desc: 'Intimate curatorial salons, collector lounges, and live SDG sustainable living panel discussions.',
                  icon: '✨',
                  sdg: 'SDG 12: Eco Pigments & Craft',
                  badge: 'Curatorial Salons',
                  href: '/exhibitions'
                },
                {
                  title: 'International showcases',
                  desc: 'Diaspora biennales, diplomatic exhibitions, and global fine art exchange programs.',
                  icon: '🌍',
                  sdg: 'SDG 8 & 17: Global Partnerships',
                  badge: 'Global Diaspora',
                  href: '/exhibitions'
                },
              ].map((exType, idx) => (
                <Link
                  key={idx}
                  href={exType.href}
                  className="p-5 rounded-2xl bg-black/50 border border-emerald-500/20 hover:border-emerald-400 transition space-y-3 group block"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl group-hover:scale-110 transition duration-200">{exType.icon}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                      {exType.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-white group-hover:text-art-gold transition">
                      • {exType.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{exType.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[10px] text-emerald-400 font-mono font-medium">
                    {exType.sdg}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Service Pillar 3: Online Auction House */}
          <div className="pt-8 border-t border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shadow-sm">
                  <Flame className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block">
                    COMPETITIVE BIDDING & MASTERPIECE ACQUISITIONS
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    Online Auction House
                  </h3>
                </div>
              </div>

              <span className="px-3.5 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/30 text-xs font-bold uppercase tracking-wider shrink-0">
                Live, Upcoming & Past Auctions
              </span>
            </div>

            <div className="space-y-3 max-w-4xl">
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Our Online Auction House provides authenticated collectors, museum trusts, and international patrons with transparent real-time bidding for high-value African masterworks, lost-wax bronze castings, and limited museum editions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <Link
                href="/auctions"
                className="p-5 rounded-2xl bg-black/50 border border-red-500/20 hover:border-red-400 transition space-y-2 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🔥</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-700/60 animate-pulse">
                    REAL-TIME
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-white group-hover:text-art-gold transition">
                  • Live Auctions
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Real-time bidding, +₦100k Power Bids, live countdown timer, and automated bid history ledger.
                </p>
              </Link>

              <Link
                href="/auctions"
                className="p-5 rounded-2xl bg-black/50 border border-cyan-500/20 hover:border-cyan-400 transition space-y-2 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">⏳</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                    CATALOG PREVIEW
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-white group-hover:text-art-gold transition">
                  • Upcoming Auctions
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Curated sessions with estimate guides, starting prices, and VIP bidder pre-registration.
                </p>
              </Link>

              <Link
                href="/auctions"
                className="p-5 rounded-2xl bg-black/50 border border-amber-500/20 hover:border-amber-400 transition space-y-2 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">📜</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60">
                    IMMUTABLE LEDGER
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-white group-hover:text-art-gold transition">
                  • Past Auctions
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Historical hammer realized prices, 10% buyer's premium audit, and verified WEMA bank settlement records.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. OUR VISION & 4. OUR MISSION (SPLIT GRID)                              */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* OUR VISION */}
          <section
            id="vision"
            className={`scroll-mt-28 p-8 sm:p-10 rounded-3xl border transition-all duration-300 space-y-5 flex flex-col justify-between ${
              activeHash === 'vision'
                ? 'bg-gradient-to-br from-[#181105] via-[#0E1118] to-[#0A0D14] border-art-gold/60 shadow-2xl ring-1 ring-art-gold/30'
                : 'bg-[#0E1118] border-white/10'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-art-gold/15 border border-art-gold/30 flex items-center justify-center text-art-gold shadow-gold-glow shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-art-gold uppercase tracking-widest block">
                    FUTURE ASPIRATION
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Our Vision
                  </h2>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-black/50 border border-art-gold/30 space-y-3">
                <p className="font-serif text-lg sm:text-xl font-bold text-white leading-relaxed">
                  “To become Africa’s leading digital art marketplace and one of the world’s most trusted platforms for promoting creativity, preserving artistic heritage and connecting artists with global audiences.”
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-art-gold font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Pan-African Leadership · Global Reach · Trust Infrastructure</span>
            </div>
          </section>

          {/* OUR MISSION */}
          <section
            id="mission"
            className={`scroll-mt-28 p-8 sm:p-10 rounded-3xl border transition-all duration-300 space-y-5 flex flex-col justify-between ${
              activeHash === 'mission'
                ? 'bg-gradient-to-br from-[#091512] via-[#0E1118] to-[#0A0D14] border-emerald-500/60 shadow-2xl ring-1 ring-emerald-400/30'
                : 'bg-[#0E1118] border-white/10'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                    CORE MANDATE
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Our Mission
                  </h2>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-3">
                <p className="font-serif text-lg sm:text-xl font-bold text-white leading-relaxed">
                  “To expand access to art through innovative digital solutions, professional exhibitions, transparent marketplaces, educational initiatives and histories appreciation across generations.”
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Digital Access · Education & Preservation · Generational Legacy</span>
            </div>
          </section>

        </div>

        {/* ========================================================================= */}
        {/* 5. OUR CORE VALUES                                                        */}
        {/* ========================================================================= */}
        <section
          id="core-values"
          className={`scroll-mt-28 p-8 sm:p-12 rounded-3xl border transition-all duration-300 space-y-8 ${
            activeHash === 'core-values'
              ? 'bg-gradient-to-br from-[#181105] via-[#0E1118] to-[#0A0D14] border-art-gold/60 shadow-2xl ring-1 ring-art-gold/30'
              : 'bg-[#0E1118] border-white/10'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-art-gold/15 border border-art-gold/30 flex items-center justify-center text-art-gold shadow-gold-glow">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-art-gold uppercase tracking-widest block">
                  FOUNDATIONAL PILLARS
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  Our Core Values
                </h2>
              </div>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              The Guiding Principles of Artellium
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Value 1: Creativity */}
            <div className="p-6 rounded-2xl bg-black/40 border border-art-gold/30 hover:border-art-gold transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-art-gold/10 border border-art-gold/30 flex items-center justify-center text-art-gold group-hover:scale-110 transition">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Creativity
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We celebrate originality, imagination and artistic excellence.
              </p>
            </div>

            {/* Value 2: Integrity */}
            <div className="p-6 rounded-2xl bg-black/40 border border-emerald-500/30 hover:border-emerald-400 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Integrity
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We uphold transparency, authenticity, fairness and professionalism in every transaction.
              </p>
            </div>

            {/* Value 3: Collaboration */}
            <div className="p-6 rounded-2xl bg-black/40 border border-blue-500/30 hover:border-blue-400 transition space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">
                Collaboration
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We build lasting relationships between artists, institutions, collectors, communities and creative industries.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CALL TO ACTION                                                     */}
        {/* ========================================================================= */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#181105] via-[#0D0F15] to-[#181105] border border-art-gold/40 text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/10 text-art-gold text-xs font-bold uppercase tracking-wider border border-art-gold/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JOIN THE ARTELLIUM MOVEMENT</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white max-w-xl mx-auto">
            Experience African Artistic Excellence
          </h2>
          
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Discover curated masterworks, participate in live auction arena broadcasts, or partner with us to empower creators across the globe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/explore"
              className="px-6 py-3.5 rounded-2xl bg-art-gold hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider transition shadow-gold-glow flex items-center gap-2"
            >
              <span>Explore Masterpieces</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition"
            >
              Contact Us
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
