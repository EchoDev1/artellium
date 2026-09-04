'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { useLanguage } from '@/context/language-context';
import {
  X,
  Palette,
  ShieldCheck,
  Award,
  Flame,
  Sparkles,
  Eye,
  ChevronRight,
  Crown,
  Layers,
  Box,
  PenTool,
  Camera,
  Scissors,
  TreePine,
  Hammer,
  Bookmark,
  FileCheck,
  Compass,
  ShoppingBag,
  Film
} from 'lucide-react';

export default function SidebarDrawer() {
  const pathname = usePathname();
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    currency
  } = useStore();

  const { currentLanguage, setLanguage, languagesList } = useLanguage();

  if (!isSidebarOpen) return null;

  const officialServiceCategories = [
    {
      id: 'nav-paintings',
      label: 'Paintings',
      subtitle: 'Oil, acrylic, gold leaf & raw natural pigments',
      href: '/categories/paintings',
      icon: Palette,
      iconColor: 'text-amber-400',
      badge: 'Curated',
      badgeClass: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    },
    {
      id: 'nav-sculptures',
      label: 'Sculptures',
      subtitle: 'Benin lost-wax bronze casts & timber carvings',
      href: '/categories/sculptures',
      icon: Box,
      iconColor: 'text-orange-400',
      badge: 'Heritage',
      badgeClass: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    },
    {
      id: 'nav-drawings',
      label: 'Drawings',
      subtitle: 'Charcoal, ink, graphite & master sketches',
      href: '/categories/drawings',
      icon: PenTool,
      iconColor: 'text-slate-300',
      badge: 'Originals',
      badgeClass: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
    },
    {
      id: 'nav-photography',
      label: 'Photography',
      subtitle: 'Fine art documentary & contemporary portraiture',
      href: '/categories/photography',
      icon: Camera,
      iconColor: 'text-zinc-300',
      badge: 'Fine Art',
      badgeClass: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30',
    },
    {
      id: 'nav-textiles',
      label: 'Textiles',
      subtitle: 'Hand-woven tapestries, Adire, Batik & fiber art',
      href: '/categories/textiles',
      icon: Scissors,
      iconColor: 'text-teal-400',
      badge: 'Woven',
      badgeClass: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
    },
    {
      id: 'nav-pottery',
      label: 'Pottery & Ceramics',
      subtitle: 'Traditional terracotta, clay vessels & glazed stoneware',
      href: '/categories/pottery',
      icon: Sparkles,
      iconColor: 'text-art-gold',
      badge: 'Clay & Kiln',
      badgeClass: 'bg-art-gold/10 text-art-gold border-art-gold/30',
    },
    {
      id: 'nav-woodworks',
      label: 'Woodworks & Metal Works',
      subtitle: 'Carved mahogany masks, bronze reliefs & iron forged',
      href: '/categories/woodworks',
      icon: TreePine,
      iconColor: 'text-art-gold',
      badge: 'Foundry & Wood',
      badgeClass: 'bg-art-gold/10 text-art-gold border-art-gold/30',
    },
    {
      id: 'nav-crafts',
      label: 'Handmade Crafts',
      subtitle: 'Beadwork, leather craft & artisanal treasures',
      href: '/categories/handmade-crafts',
      icon: Scissors,
      iconColor: 'text-rose-400',
      badge: 'Artisanal',
      badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    },
    {
      id: 'nav-indigenous',
      label: 'Indigenous Artworks',
      subtitle: 'Ancestral heritage artifacts & ritual folklore art',
      href: '/categories/indigenous-artworks',
      icon: Crown,
      iconColor: 'text-art-gold',
      badge: 'Ancestral',
      badgeClass: 'bg-art-gold/15 text-art-gold border-art-gold/30',
    },
    {
      id: 'nav-limited',
      label: 'Limited Edition Collections',
      subtitle: 'Numbered master prints & certified editions',
      href: '/categories/limited-editions',
      icon: Bookmark,
      iconColor: 'text-purple-400',
      badge: 'Exclusive',
      badgeClass: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    },
  ];

  const platformFeatures = [
    {
      id: 'nav-artist-voices',
      label: 'Voices of Master Artists',
      subtitle: 'Watch master African painters & sculptors speak on origins & technique',
      href: '/artist-voices',
      icon: Film,
      iconColor: 'text-art-gold',
      badge: '🎥 SPOTLIGHT',
      badgeClass: 'bg-art-gold/20 text-art-gold border-art-gold/40 font-bold',
    },
    {
      id: 'nav-auctions',
      label: 'Live Auctions Arena',
      subtitle: 'Real-time competitive bidding with +₦100k Power Bids',
      href: '/auctions',
      icon: Flame,
      iconColor: 'text-red-500',
      badge: '🔥 LIVE NOW',
      badgeClass: 'bg-red-950/60 text-red-400 border-red-800/60 animate-pulse',
    },
    {
      id: 'nav-exhibitions',
      label: 'Art Exhibitions & SDGs',
      subtitle: 'Physical, Virtual 3D, Pop-Up & International Showcases',
      href: '/exhibitions',
      icon: Eye,
      iconColor: 'text-emerald-400',
      badge: '🏛️ SDGs Dialogues',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    },
    {
      id: 'nav-subscriptions',
      label: 'Artist Subscriptions',
      subtitle: 'Sell fine art worldwide • Free & Priority Placement plans',
      href: '/artist/register',
      icon: Crown,
      iconColor: 'text-art-gold',
      badge: '👑 FREE & PRIORITY',
      badgeClass: 'bg-art-gold/20 text-art-gold border-art-gold/40 font-bold',
    },
    {
      id: 'nav-bidder-reg',
      label: 'Bidder Registration & KYC',
      subtitle: 'Accredited patron verification & sovereign pass',
      href: '/auctions/register',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      badge: '✅ KYC PASS',
      badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    },
  ];

  const secondaryLinks = [
    {
      id: 'sec-newly-listed',
      label: '✨ Newly Listed Artworks',
      subtitle: 'Fresh creations uploaded directly by verified master artists',
      href: '/newly-listed',
      icon: Sparkles,
    },
    {
      id: 'sec-all',
      label: 'All Artworks & Services',
      subtitle: 'Complete verified catalogue across 54 African nations',
      href: '/explore',
      icon: Layers,
    },
    {
      id: 'sec-services',
      label: 'Our Services Charter',
      subtitle: 'Online Art Marketplace details and curatorial standards',
      href: '/about#services',
      icon: ShoppingBag,
    },
    {
      id: 'sec-catalog-history',
      label: '👑 West African Art History Archive',
      subtitle: 'Nok, Ifẹ, Benin & Asante royal craftsmanship chronicles',
      href: '/catalog',
      icon: Crown,
    },
    {
      id: 'sec-ledger',
      label: 'Historical Provenance Ledger',
      subtitle: 'Immutable record of transacted artworks & values',
      href: '/recently-sold',
      icon: FileCheck,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end animate-fade-in font-sans">
      {/* Backdrop Click Close */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={() => setIsSidebarOpen(false)} 
        aria-label="Close drawer backdrop"
      />

      <div className="relative w-full max-w-md bg-[#08090D] border-l border-art-gold/30 shadow-2xl h-full flex flex-col z-10 animate-slide-in-right overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0D0F15]/95 backdrop-blur-md">
          <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center group">
            <img
              src="/artellium_brand_logo.png"
              alt="ARTELLIUM"
              className="h-8 w-auto object-contain group-hover:scale-105 transition duration-300"
            />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          
          {/* Section 1: Live Arena & Global Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span>Live Arena & Curatorial Programs</span>
              </span>
            </div>

            <div className="space-y-2">
              {platformFeatures.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full p-3 rounded-2xl border transition flex items-center justify-between group ${
                      isActive
                        ? 'bg-art-gold/15 border-art-gold/50 shadow-gold-glow'
                        : 'bg-[#0E1118]/80 hover:bg-[#151923] border-white/5 hover:border-art-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                        <Icon className={`w-4 h-4 ${item.iconColor}`} />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-xs sm:text-sm font-bold text-white group-hover:text-art-gold transition truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${item.badgeClass} flex-shrink-0`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition block truncate leading-tight mt-0.5">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-art-gold group-hover:translate-x-0.5 transition flex-shrink-0 ml-2" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 2: Official Marketplace Services & Departments */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-art-gold" />
                <span>Our Services · Departments</span>
              </span>
              <span className="text-[10px] text-art-gold font-mono font-medium">12 Services</span>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {officialServiceCategories.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full p-2.5 rounded-2xl border transition flex items-center justify-between group ${
                      isActive
                        ? 'bg-art-gold/15 border-art-gold/50 shadow-gold-glow'
                        : 'bg-[#0E1118]/80 hover:bg-[#151923] border-white/5 hover:border-art-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                        <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-xs font-bold text-white group-hover:text-art-gold transition truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-semibold border ${item.badgeClass} flex-shrink-0`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-300 transition block truncate leading-tight mt-0.5">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-art-gold group-hover:translate-x-0.5 transition flex-shrink-0 ml-1" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section 3: Provenance, Charter & Ledger */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block px-1 mb-2">
              Provenance & Marketplace Governance
            </span>

            {secondaryLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full p-3 rounded-2xl bg-[#0E1118]/80 hover:bg-[#151923] border border-white/5 hover:border-art-gold/30 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-art-gold" />
                    </div>
                    <div className="text-left min-w-0">
                      <span className="font-serif text-xs font-bold text-white group-hover:text-art-gold transition block truncate">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition block truncate mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-art-gold group-hover:translate-x-0.5 transition flex-shrink-0 ml-2" />
                </Link>
              );
            })}
          </div>

        </div>

        {/* Drawer Footer Status */}
        <div className="p-4 border-t border-white/10 bg-[#0D0F15]/95 backdrop-blur-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 font-mono text-[10px]">WEMA Fiduciary Protected</span>
          </div>
          <span className="text-art-gold font-mono text-[10px] font-bold">Direct Atelier Remittance</span>
        </div>
      </div>
    </div>
  );
}
