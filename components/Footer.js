'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Sparkles, 
  Shield, 
  Award, 
  Truck, 
  Lock, 
  ArrowRight, 
  Heart, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Facebook 
} from 'lucide-react';

export default function Footer() {
  const { footerConfig, artworks = [] } = useStore();

  const cfg = footerConfig || {
    brandTitle: 'ARTELLIUM',
    brandDescription: 'ARTELLIUM bridges ancient African artistic royalty with cutting-edge global fine art commerce. Empowering painters, sculptors, and digital creators through transparent auctions and authentic gallery exhibitions.',
    newsletterTitle: 'Join collector newsletter...',
    newsletterButtonText: 'Join',
    copyrightNotice: '© {year} ARTELLIUM AFRICA & GLOBAL MARKETPLACE. All rights reserved.',
    bottomSubtext: 'Crafted with cultural pride & global excellence for African Master Creators.',
    trustBadges: [],
    columns: [],
    socialLinks: []
  };

  // Curate artist history slides from artworks with studio notes
  const artworksWithNotes = (artworks || []).filter(a => a.studioNotes && a.artistName);

  const artistHistorySlides = artworksWithNotes.length > 0 ? artworksWithNotes.map(a => {
    // Extract first 1-2 lines/sentences of history
    const firstLine = a.studioNotes.split('. ')[0] + (a.studioNotes.includes('. ') ? '.' : '');
    return {
      artworkId: a.id,
      artistName: a.artistName,
      artistAvatar: a.artistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      country: a.country || 'Africa',
      city: a.city || 'Atelier',
      countryFlag: a.countryFlag || '🌍',
      artworkTitle: a.title,
      artworkImage: a.image,
      historySnippet: a.studioNotes,
      firstLine: firstLine || a.studioNotes
    };
  }) : [
    {
      artworkId: 'art-101',
      artistName: 'Kofi Mensah',
      artistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      country: 'Ghana',
      city: 'Accra',
      countryFlag: '🇬🇭',
      artworkTitle: 'The Ancestral Horizon',
      artworkImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
      firstLine: 'My studio in Accra is filled with ancestral masks and bowls of gold dust.',
      historySnippet: 'My studio in Accra is filled with ancestral masks and bowls of gold dust. Every morning I grind pigment by hand — a ritual my grandfather taught me. The gold leaf is applied last, always in silence, as an offering to those who came before us.'
    },
    {
      artworkId: 'art-102',
      artistName: 'Amina Diallo',
      artistAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
      country: 'Nigeria',
      city: 'Benin City',
      countryFlag: '🇳🇬',
      artworkTitle: 'Warrior of the Bronze Empire',
      artworkImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
      firstLine: 'I work beside the same foundry fire my great-grandmother lit.',
      historySnippet: 'I work beside the same foundry fire my great-grandmother lit. The lost-wax method is not a technique to me — it is a language. Bronze holds memory in ways canvas cannot.'
    },
    {
      artworkId: 'art-104',
      artistName: 'Chief Bakare Ogundele',
      artistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
      country: 'Nigeria',
      city: 'Oyo',
      countryFlag: '🇳🇬',
      artworkTitle: 'The Solitary Mask of Oyo',
      artworkImage: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1000',
      firstLine: 'I was initiated into sacred wood carving by my father at age nine.',
      historySnippet: 'I was initiated into carving by my father at age nine. The chisel speaks its own dialect. My studio is a sacred compound — visitors remove their shoes.'
    },
    {
      artworkId: 'art-103',
      artistName: 'Tariq Ndebele',
      artistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      country: 'South Africa',
      city: 'Johannesburg',
      countryFlag: '🇿🇦',
      artworkTitle: 'Echoes of the Serengeti',
      artworkImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
      firstLine: 'I collect soil, ash, and plant matter from across southern Africa and grind them into natural pigment.',
      historySnippet: 'I collect soil, ash, and plant matter from across southern Africa and grind them into pigment. There is no synthetic colour in my studio — only the continent itself, translated onto canvas.'
    },
    {
      artworkId: 'art-106',
      artistName: 'Nour El-Din',
      artistAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      country: 'Egypt',
      city: 'Cairo',
      countryFlag: '🇪🇬',
      artworkTitle: 'Daughters of the Nile',
      artworkImage: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=1000',
      firstLine: 'My studio overlooks the majestic Nile where light dances on historical waters.',
      historySnippet: 'My studio overlooks the Nile. I spend hours just watching the light change on the water before I pick up a brush.'
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Automatic slide rotation every 5 seconds
  useEffect(() => {
    if (isSlidePaused || artistHistorySlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % artistHistorySlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isSlidePaused, artistHistorySlides.length]);

  const handleNextSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev + 1) % artistHistorySlides.length);
  };

  const handlePrevSlide = (e) => {
    e?.stopPropagation();
    setCurrentSlideIndex((prev) => (prev - 1 + artistHistorySlides.length) % artistHistorySlides.length);
  };

  const activeArtistSlide = artistHistorySlides[currentSlideIndex] || artistHistorySlides[0];

  const renderSocialLogo = (platform = '') => {
    const p = platform.toLowerCase();
    if (p.includes('instagram') || p.includes('insta')) {
      return <Instagram className="w-4 h-4" />;
    }
    if (p.includes('twitter') || p.includes('x')) {
      return (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    }
    if (p.includes('linkedin')) {
      return <Linkedin className="w-4 h-4" />;
    }
    if (p.includes('youtube')) {
      return <Youtube className="w-4 h-4" />;
    }
    if (p.includes('facebook')) {
      return <Facebook className="w-4 h-4" />;
    }
    return <Globe className="w-4 h-4" />;
  };

  const renderBadgeIcon = (iconName, color) => {
    const colorClasses = {
      gold: 'bg-art-gold/10 text-art-gold',
      emerald: 'bg-art-green/20 text-emerald-400',
      red: 'bg-art-red/20 text-red-400',
    };
    const cls = colorClasses[color] || 'bg-art-gold/10 text-art-gold';

    return (
      <div className={`p-2.5 rounded-lg ${cls} shrink-0`}>
        {iconName === 'Truck' && <Truck className="w-5 h-5" />}
        {iconName === 'Lock' && <Lock className="w-5 h-5" />}
        {iconName === 'Shield' && <Shield className="w-5 h-5" />}
        {iconName === 'Award' && <Award className="w-5 h-5" />}
        {iconName === 'Heart' && <Heart className="w-5 h-5" />}
        {iconName === 'Sparkles' && <Sparkles className="w-5 h-5" />}
        {!['Truck', 'Lock', 'Shield', 'Award', 'Heart', 'Sparkles'].includes(iconName) && (
          <Award className="w-5 h-5" />
        )}
      </div>
    );
  };

  const defaultTrustBadges = [
    {
      id: 'tb-1',
      title: 'Authenticity Guarantee',
      description: 'Physical certificate signed by artist & curator.',
      icon: 'Award',
      color: 'gold',
      isVisible: true
    },
    {
      id: 'tb-2',
      title: 'Curatorial Excellence',
      description: 'Accredited provenance & authentic gallery exhibitions.',
      icon: 'Shield',
      color: 'emerald',
      isVisible: true
    },
    {
      id: 'tb-3',
      title: 'Wema Bank Secured Settlement',
      description: 'Direct corporate banking & instant payment settlement.',
      icon: 'Lock',
      color: 'gold',
      isVisible: true
    },
    {
      id: 'tb-4',
      title: 'Master Artist Support',
      description: 'Directly empowering pan-African talent.',
      icon: 'Shield',
      color: 'gold',
      isVisible: true
    }
  ];

  const badgesToRender = (cfg.trustBadges && cfg.trustBadges.length > 0) 
    ? cfg.trustBadges.filter(b => b.isVisible !== false) 
    : defaultTrustBadges;

  const formattedCopyright = (cfg.copyrightNotice || '© {year} ARTELLIUM AFRICA & GLOBAL MARKETPLACE. All rights reserved.')
    .replace('{year}', new Date().getFullYear().toString());

  return (
    <footer className="w-full bg-[#050608] text-slate-400 border-t border-art-gold/20 pt-12 pb-8 relative overflow-hidden">
      {/* African Pattern Accent Top Border */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-art-red via-art-gold to-art-green" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. TOP SPOT: AUTOMATIC SLIDESHOW OF FIRST LINES OF ARTIST HISTORIES       */}
        {/* ========================================================================= */}
        <div
          className="rounded-3xl overflow-hidden bg-[#0A0D14] border border-art-gold/30 p-5 sm:p-7 shadow-2xl relative select-none"
          onMouseEnter={() => setIsSlidePaused(true)}
          onMouseLeave={() => setIsSlidePaused(false)}
        >
          {/* Top Archival Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-art-gold" />
              <span className="font-mono text-[10px] sm:text-xs font-bold text-art-gold uppercase tracking-widest flex items-center gap-2">
                <span>Living Artist History & Oral Archives</span>
                <span className="text-slate-600 font-sans font-normal hidden sm:inline">|</span>
                <span className="text-slate-400 font-sans font-normal hidden sm:inline">First-Person Atelier Monographs</span>
              </span>
            </div>

            {/* Slide Index Counter & Controls */}
            <div className="flex items-center gap-3">
              <div className="text-xs font-mono font-medium text-slate-400">
                <span className="text-art-gold font-bold">{String(currentSlideIndex + 1).padStart(2, '0')}</span>
                <span className="mx-1 text-slate-600">/</span>
                <span>{String(artistHistorySlides.length).padStart(2, '0')}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="w-7 h-7 rounded-lg bg-[#121622] hover:bg-art-gold text-slate-300 hover:text-art-black border border-white/10 hover:border-art-gold flex items-center justify-center transition cursor-pointer"
                  aria-label="Previous Artist History"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="w-7 h-7 rounded-lg bg-[#121622] hover:bg-art-gold text-slate-300 hover:text-art-black border border-white/10 hover:border-art-gold flex items-center justify-center transition cursor-pointer"
                  aria-label="Next Artist History"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Clickable Card Linking Directly to the History Section of the Artist's Page */}
            <Link
              href={`/artwork/${activeArtistSlide.artworkId}#artist-history`}
              className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group/link cursor-pointer"
            >
              {/* Traditional Framed Artist Portrait */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#050608] p-1 border border-art-gold/40 shadow-lg relative">
                  <img
                    src={activeArtistSlide.artistAvatar}
                    alt={activeArtistSlide.artistName}
                    className="w-full h-full object-cover rounded-xl group-hover/link:scale-105 transition duration-500"
                  />
                  <span className="absolute bottom-2 right-2 text-xs drop-shadow">
                    {activeArtistSlide.countryFlag}
                  </span>
                </div>
              </div>

              {/* Artist Details & Monograph Excerpt */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-sans">
                  <span className="font-semibold text-slate-200">
                    {activeArtistSlide.city}, {activeArtistSlide.country}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-art-gold font-mono text-[10px] font-bold">ORAL TESTIMONY</span>
                </div>

                <h4 className="font-serif text-lg sm:text-xl font-bold text-white group-hover/link:text-art-gold transition flex items-center gap-2">
                  <span>{activeArtistSlide.artistName}</span>
                  <span className="text-xs text-slate-400 font-sans font-normal italic hidden sm:inline">
                    — "{activeArtistSlide.artworkTitle}"
                  </span>
                </h4>

                {/* First-person Authentic Monograph Quote */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 mt-1">
                  <p className="font-serif text-xs sm:text-sm text-slate-200 italic leading-relaxed line-clamp-2">
                    "{activeArtistSlide.firstLine}"
                  </p>
                </div>
              </div>
            </Link>

            {/* Direct Action Link Button */}
            <div className="shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
              <Link
                href={`/artwork/${activeArtistSlide.artworkId}#artist-history`}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
              >
                <span>Read Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Slide Indicator Dots */}
          <div className="pt-4 flex items-center justify-center gap-1.5">
            {artistHistorySlides.map((slide, idx) => (
              <button
                key={slide.artworkId || idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 transition-all rounded-full cursor-pointer ${
                  currentSlideIndex === idx 
                    ? 'w-6 bg-art-gold' 
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                title={`History: ${slide.artistName}`}
              />
            ))}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. FOOTER NAVIGATION COLUMNS & NEWSLETTER                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block group" title="ARTELLIUM Fine Art & Auctions">
              <img
                src="/artellium_brand_logo.png"
                alt="ARTELLIUM"
                className="h-11 sm:h-12 w-auto max-w-[280px] object-contain object-left filter contrast-115 brightness-110 group-hover:scale-105 transition duration-300"
              />
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {cfg.brandDescription || "ARTELLIUM bridges ancient African artistic royalty with cutting-edge global fine art commerce."}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to ARTELLIUM Gazette!'); }} className="flex items-center gap-2 max-w-sm">
              <input
                type="email"
                placeholder={cfg.newsletterTitle || "Join collector newsletter..."}
                required
                className="bg-art-black-card border border-art-gold/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-art-gold flex-1"
              />
              <button type="submit" className="bg-art-gold hover:brightness-110 text-art-black font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1 shrink-0">
                <span>{cfg.newsletterButtonText || 'Join'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Social Media Logo Icons */}
            {(cfg.socialLinks || []).filter(s => s.isVisible !== false).length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs">
                {(cfg.socialLinks || []).filter(s => s.isVisible !== false).map((soc) => (
                  <a
                    key={soc.id}
                    href={soc.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.platform}
                    title={soc.platform}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-art-gold hover:text-art-black border border-white/10 hover:border-art-gold flex items-center justify-center transition-all duration-300 text-slate-300 hover:scale-110 shadow-sm"
                  >
                    {renderSocialLogo(soc.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Link Columns */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {(cfg.columns || []).map((col) => (
              <div key={col.id}>
                <h4 className="font-serif text-white text-sm font-semibold mb-4 tracking-wide uppercase">
                  {col.title}
                </h4>
                <ul className="space-y-2 text-xs">
                  {(col.links || []).filter(l => l.isVisible !== false).map((link) => (
                    <li key={link.id}>
                      {link.href && link.href !== '#' ? (
                        link.href.startsWith('mailto:') || link.href.startsWith('tel:') || link.href.startsWith('http') ? (
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className={`transition ${
                              link.highlight === 'red' ? 'text-red-400 hover:text-red-300' :
                              link.highlight === 'emerald' ? 'text-emerald-400 hover:text-emerald-300' :
                              link.highlight === 'amber' ? 'text-amber-300 hover:text-white' :
                              'hover:text-art-gold text-slate-400'
                            }`}
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link 
                            href={link.href} 
                            className={`transition ${
                              link.highlight === 'red' ? 'text-red-400 hover:text-red-300' :
                              link.highlight === 'emerald' ? 'text-emerald-400 hover:text-emerald-300' :
                              link.highlight === 'amber' ? 'text-amber-300 hover:text-white' :
                              'hover:text-art-gold text-slate-400'
                            }`}
                          >
                            {link.label}
                          </Link>
                        )
                      ) : (
                        <span className="text-slate-500 cursor-not-allowed">
                          {link.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. LOWER SPOT: HERITAGE TRUST BADGES                                      */}
        {/* ========================================================================= */}
        {badgesToRender.length > 0 && (
          <div className="pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {badgesToRender.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-3.5 rounded-2xl bg-art-black-card border border-white/5 hover:border-art-gold/30 transition">
                  {renderBadgeIcon(badge.icon, badge.color)}
                  <div>
                    <h4 className="text-white font-semibold text-xs">{badge.title}</h4>
                    <p className="text-[11px] text-slate-400">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. BOTTOM COPYRIGHT & CULTURAL SUBTEXT                                   */}
        {/* ========================================================================= */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{formattedCopyright}</p>
          <div className="flex items-center gap-1">
            <span>{cfg.bottomSubtext || "Crafted with cultural pride & global excellence for African Master Creators."}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
