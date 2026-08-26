'use client';

import React from 'react';
import Link from 'next/link';
import JumiaArtHero from '@/components/JumiaArtHero';
import GoldRevealHero from '@/components/GoldRevealHero';
import HeroBanner from '@/components/HeroBanner';
import JumiaQuickShortcuts from '@/components/JumiaQuickShortcuts';
import JumiaFlashSales from '@/components/JumiaFlashSales';
import ArtworkCard from '@/components/ArtworkCard';
import AuctionCard from '@/components/AuctionCard';
import ArtistVideoModal from '@/components/ArtistVideoModal';
import CuratorialSpotlightBanner from '@/components/CuratorialSpotlightBanner';
import { useStore } from '@/context/store-context';
import { Sparkles, Flame, Eye, ArrowRight, Award, CheckCircle2, Crown, Zap, ShieldCheck, Tag, Gavel } from 'lucide-react';

export default function HomePage() {
  const { 
    artworks, 
    exhibitions, 
    selectedCategory, 
    heroConfig, 
    homePageConfig 
  } = useStore();

  const hConfig = heroConfig || { heroType: 'jumia_art_hero' };
  const pConfig = homePageConfig || {
    sections: [
      { id: 'sec-hero', type: 'hero', isVisible: true },
      { id: 'sec-auctions', type: 'auctions', title: 'Live Fine Art Auctions', subtitle: 'Participate in real-time competitive bidding for high-value African masterworks.', badge: 'LIVE BIDDING ARENA', isVisible: true, maxItems: 3 },
      { id: 'sec-newly-listed', type: 'newly_listed', title: 'Newly Listed Artworks', subtitle: 'Fresh creations uploaded directly by verified master painters, sculptors, and digital artists.', badge: 'CURATED MARKETPLACE', isVisible: true, maxItems: 9 },
      { id: 'sec-subscriptions', type: 'subscriptions', title: 'Showcase Your Fine Art with Zero Hindrance', subtitle: 'Join ARTELLIUM as a verified seller. Upload original oil paintings, bronze sculptures, or digital prints with automated backend tracking and international buyer outreach.', badge: 'ARTIST & SELLER SUBSCRIPTION PACKAGES', isVisible: true },
      { id: 'sec-recently-sold', type: 'recently_sold', title: 'Recently Sold Masterpieces', subtitle: 'Transactions logged in our immutable ledger of African creative heritage and authenticity registry.', badge: 'HISTORICAL LEDGER & PROVENANCE', isVisible: true, maxItems: 6 },
      { id: 'sec-exhibitions', type: 'exhibitions', title: 'Current Exhibitions', subtitle: 'Explore curated virtual gallery halls from top African museum directors and curators.', badge: 'VIRTUAL GALLERY ROOMS', isVisible: true, maxItems: 4 }
    ],
    customPromoBanners: []
  };

  // Filter artworks by selected category
  const filteredArtworks = artworks.filter((art) => {
    if (selectedCategory === 'All') return true;
    return art.category === selectedCategory;
  });

  const getNewlyListed = (limit = 9) => filteredArtworks
    .filter((art) => art.isNewlyListed || art.status === 'available')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);

  const getLiveAuctions = (limit = 3) => artworks
    .filter((art) => art.status === 'auction')
    .slice(0, limit);

  const getRecentlySold = (limit = 6) => artworks
    .filter((art) => art.status === 'sold')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);

  // Determine which hero to render based on heroConfig (JumiaArtHero is default)
  const renderHero = () => {
    if (hConfig.heroType === 'gold_reveal') {
      return <GoldRevealHero />;
    }
    if (hConfig.heroType === 'split_banner' || hConfig.heroType === 'video_showcase' || hConfig.heroType === 'media_hero') {
      return <HeroBanner />;
    }
    return <JumiaArtHero />;
  };

  // Section render helper
  const renderSection = (sec) => {
    if (sec.isVisible === false) return null;

    switch (sec.type) {
      case 'hero':
        return null; // rendered outside main container

      case 'auctions': {
        const auctionsList = getLiveAuctions(sec.maxItems || 3);
        if (auctionsList.length === 0) return null;
        return (
          <section key={sec.id} className="space-y-6">
            {/* Dark Green Luxury Heading Banner */}
            <div className="bg-gradient-to-r from-[#04180F]/95 via-[#08291A]/95 to-[#04180F]/95 border border-emerald-600/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
              <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2 mb-1 font-sans">
                  <span className="p-1.5 rounded-lg bg-red-950/80 text-red-400 border border-red-500/40 shadow-sm">
                    <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                  </span>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest font-mono">
                    {sec.badge || 'LIVE BIDDING ARENA'}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-red-500 tracking-wide">
                  {sec.title || 'Live Fine Art Auctions'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/70 font-sans max-w-2xl leading-relaxed">
                  {sec.subtitle || 'Participate in real-time competitive bidding for high-value African masterworks.'}
                </p>
              </div>

              <Link
                href="/auctions"
                className="text-xs font-bold text-art-gold hover:text-white flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/50 px-4 py-2.5 rounded-xl transition font-sans shadow-md shrink-0 relative z-10"
              >
                <span>View All Live Lots</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {auctionsList.map((art) => (
                <AuctionCard key={art.id} artwork={art} />
              ))}
            </div>
          </section>
        );
      }

      case 'newly_listed': {
        const newlyListed = getNewlyListed(sec.maxItems || 9);
        return (
          <section key={sec.id} className="space-y-6">
            {/* Dark Green Luxury Heading Banner */}
            <div className="bg-gradient-to-r from-[#04180F]/95 via-[#08291A]/95 to-[#04180F]/95 border border-emerald-600/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
              <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2 mb-1 font-sans">
                  <span className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </span>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest font-mono">
                    {sec.badge || 'CURATED MARKETPLACE'}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {sec.title || 'Newly Listed Artworks'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/70 font-sans max-w-2xl leading-relaxed">
                  {sec.subtitle || 'Fresh creations uploaded directly by verified master painters, sculptors, and digital artists.'}
                </p>
              </div>

              <Link
                href="/explore"
                className="text-xs font-bold text-art-gold hover:text-white flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/50 px-4 py-2.5 rounded-xl transition font-sans shadow-md shrink-0 relative z-10"
              >
                <span>Explore All Artworks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newlyListed.map((art) => (
                <ArtworkCard key={art.id} artwork={art} />
              ))}
            </div>
          </section>
        );
      }

      case 'subscriptions':
        return (
          <section key={sec.id} className="relative rounded-3xl overflow-hidden glass-card-gold p-8 lg:p-12 border border-art-gold/40 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/10 border border-art-gold/40 text-art-gold text-xs font-bold">
                  <Crown className="w-4 h-4" />
                  <span>{sec.badge || 'ARTIST & SELLER SUBSCRIPTION PACKAGES'}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                  {sec.title || 'Showcase Your Fine Art with Zero Hindrance'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {sec.subtitle || 'Join ARTELLIUM as a verified seller. Upload original oil paintings, bronze sculptures, or digital prints with automated backend tracking and international buyer outreach.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-art-black p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Standard Tier</span>
                      <span className="badge-emerald px-2 py-0.5 rounded text-[10px] font-bold">Popular</span>
                    </div>
                    <p className="font-serif text-lg font-bold text-art-gold">
                      ₦30,000 <span className="text-xs text-slate-400 font-sans font-normal">/ month</span>
                    </p>
                    <p className="text-[11px] text-emerald-400">or ₦200,000 / year (Discounted)</p>
                    <ul className="space-y-1 text-slate-300 text-[11px] pt-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-art-gold" />
                        <span>Upload up to 15 artworks/mo</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-art-gold" />
                        <span>Dedicated Seller Profile & Bio</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-art-black p-4 rounded-xl border border-art-gold/40 space-y-2 shadow-gold-glow">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-art-gold text-sm">Premium Tier</span>
                      <span className="badge-gold px-2 py-0.5 rounded text-[10px] font-bold">Gold Crest</span>
                    </div>
                    <p className="font-serif text-lg font-bold text-art-gold">
                      ₦50,000 <span className="text-xs text-slate-400 font-sans font-normal">/ month</span>
                    </p>
                    <p className="text-[11px] text-art-gold">or ₦350,000 / year (Save ₦250k)</p>
                    <ul className="space-y-1 text-slate-300 text-[11px] pt-1">
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-art-gold" />
                        <span>Unlimited High-Res Uploads</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-art-gold" />
                        <span>Live Auction Access & Video Features</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center space-y-4">
                <div className="p-6 rounded-2xl bg-art-black/80 border border-art-gold/30 text-center space-y-3 max-w-sm">
                  <Zap className="w-8 h-8 text-art-gold mx-auto animate-pulse" />
                  <h4 className="font-serif text-lg font-bold text-white">Ready to Sell Your Art?</h4>
                  <p className="text-xs text-slate-400">
                    Self-service registration with automated backend dashboard setup.
                  </p>
                  <Link
                    href="/artist/register"
                    className="block w-full py-3 bg-art-gold hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-gold-glow"
                  >
                    Register as Artist Now
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );

      case 'recently_sold': {
        const recentlySold = getRecentlySold(sec.maxItems || 6);
        if (recentlySold.length === 0) return null;
        return (
          <section key={sec.id} className="space-y-6">
            {/* Dark Green Luxury Heading Banner */}
            <div className="bg-gradient-to-r from-[#04180F]/95 via-[#08291A]/95 to-[#04180F]/95 border border-emerald-600/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
              <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2 mb-1 font-sans">
                  <span className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </span>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest font-mono">
                    {sec.badge || 'HISTORICAL LEDGER & PROVENANCE'}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {sec.title || 'Recently Sold Masterpieces'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/70 font-sans max-w-2xl leading-relaxed">
                  {sec.subtitle || 'Transactions logged in our immutable ledger of African creative heritage and authenticity registry.'}
                </p>
              </div>

              <Link
                href="/recently-sold"
                className="text-xs font-bold text-art-gold hover:text-white flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/50 px-4 py-2.5 rounded-xl transition shrink-0 font-sans shadow-md relative z-10"
              >
                <span>View More Recently Sold</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlySold.map((art) => (
                <ArtworkCard key={art.id} artwork={art} />
              ))}
            </div>
          </section>
        );
      }

      case 'exhibitions': {
        const exList = exhibitions.slice(0, sec.maxItems || 4);
        return (
          <section key={sec.id} className="space-y-6">
            {/* Dark Green Luxury Heading Banner */}
            <div className="bg-gradient-to-r from-[#04180F]/95 via-[#08291A]/95 to-[#04180F]/95 border border-emerald-600/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
              <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <div className="space-y-1 relative z-10">
                <div className="flex items-center gap-2 mb-1 font-sans">
                  <span className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm">
                    <Eye className="w-4 h-4 text-emerald-400" />
                  </span>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest font-mono">
                    {sec.badge || 'VIRTUAL GALLERY ROOMS'}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {sec.title || 'Current Exhibitions'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/70 font-sans max-w-2xl leading-relaxed">
                  {sec.subtitle || 'Explore curated virtual gallery halls from top African museum directors and curators.'}
                </p>
              </div>

              <Link
                href="/exhibitions"
                className="text-xs font-bold text-art-gold hover:text-white flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/50 px-4 py-2.5 rounded-xl transition font-sans shadow-md relative z-10"
              >
                <span>View All Exhibitions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exList.map((ex) => (
                <div
                  key={ex.id}
                  className="group relative rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-emerald-500/50 transition duration-300 shadow-2xl flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img
                      src={ex.coverImage}
                      alt={ex.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-art-black via-art-black/40 to-transparent" />

                    <span className="absolute top-4 left-4 bg-art-green text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/40">
                      {ex.status}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-emerald-300 transition">
                      {ex.title}
                    </h3>
                    <p className="text-xs text-art-gold font-medium">Curated by {ex.curator}</p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {ex.description}
                    </p>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{ex.featuredArtworksCount} Artworks On View</span>
                      <Link
                        href="/exhibitions"
                        className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Enter Virtual Room</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      default:
        return null;
    }
  };

  const sectionsToRender = (pConfig.sections || []).filter(s => s.type !== 'hero');

  return (
    <div className="space-y-0 bg-[#07080A] min-h-screen text-slate-100">
      {/* 1. Traditionally-Coded Jumia-Style Pan-African Fine Art Hero */}
      {renderHero()}

      {/* 2. Jumia-Style Quick Department & Action Shortcuts Pill Grid */}
      <JumiaQuickShortcuts />

      {/* Main Content Area */}
      <div className="relative bg-[#07080A] text-slate-100 pb-20 pt-8 space-y-16 overflow-hidden">
        {/* Spotlight Voices & Provenance (Voices of Master Artists) */}
        <div className="relative z-10">
          <ArtistVideoModal />
        </div>

        {/* Curatorial Spotlight & Priority Artist Advert Banner */}
        <CuratorialSpotlightBanner />

        {/* Dynamic Homepage Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
          {sectionsToRender.map(renderSection)}
        </div>
      </div>
    </div>
  );
}

