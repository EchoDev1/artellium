'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ArtworkCard from '@/components/ArtworkCard';
import CategoryBar from '@/components/CategoryBar';
import { useStore } from '@/context/store-context';
import { isCategoryMatch } from '@/lib/category-utils';
import { sortArtworksByPriority } from '@/lib/priority-utils';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  Award, 
  Palette, 
  ShieldCheck,
  Flame,
  PlusCircle,
  TrendingUp,
  Tag
} from 'lucide-react';

function NewlyListedContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const { 
    artworks, 
    realArtworks, 
    selectedCategory, 
    setSelectedCategory,
    currency,
    currentUser,
    sellers = [],
    usersList = []
  } = useStore();

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedMedium, setSelectedMedium] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, price_low, price_high

  // Filter artworks strictly for newly listed / available
  const matchingArtworks = useMemo(() => {
    return artworks.filter((art) => {
      // Exclude sold items from newly listed feed
      if (art.status === 'sold') return false;

      const term = searchTerm.trim().toLowerCase();
      const matchesQuery = !term || (
        art.title?.toLowerCase().includes(term) ||
        art.artistName?.toLowerCase().includes(term) ||
        art.medium?.toLowerCase().includes(term) ||
        art.category?.toLowerCase().includes(term) ||
        art.country?.toLowerCase().includes(term) ||
        art.city?.toLowerCase().includes(term) ||
        art.description?.toLowerCase().includes(term)
      );

      const targetCat = categoryParam || selectedCategory || 'All';
      const matchesCategory = isCategoryMatch(art.category, targetCat, art.medium, art.title);

      const matchesMedium = selectedMedium === 'All' || isCategoryMatch(art.medium, selectedMedium, art.category, art.title);

      let matchesPrice = true;
      if (priceFilter === 'under500k') matchesPrice = (art.price || 0) <= 500000;
      else if (priceFilter === '500k_1m') matchesPrice = (art.price || 0) > 500000 && (art.price || 0) <= 1000000;
      else if (priceFilter === '1m_3m') matchesPrice = (art.price || 0) > 1000000 && (art.price || 0) <= 3000000;
      else if (priceFilter === 'above3m') matchesPrice = (art.price || 0) > 3000000;

      return matchesQuery && matchesCategory && matchesMedium && matchesPrice;
    });
  }, [artworks, searchTerm, categoryParam, selectedCategory, selectedMedium, priceFilter]);

  // Sort: Subscribed Priority Artist creations ALWAYS come first, followed by newest timestamp
  const sortedArtworks = useMemo(() => {
    return sortArtworksByPriority(matchingArtworks, {
      sellers,
      users: usersList,
      secondarySort: sortBy
    });
  }, [matchingArtworks, sortBy, sellers, usersList]);

  const realNewlyListedCount = useMemo(() => {
    return sortedArtworks.filter(a => !a.isDemo).length;
  }, [sortedArtworks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in font-sans">
      
      {currentUser?.role === 'artist' && (
        <div className="flex justify-end">
          <Link
            href="/artist/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-art-gold hover:brightness-110 text-art-black rounded-xl text-xs font-bold uppercase tracking-wider transition shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Artwork</span>
          </Link>
        </div>
      )}

      {/* Gold Luxury Header Banner */}
      <div className="bg-gradient-to-r from-[#1F1705]/95 via-[#3E2D07]/95 to-[#1F1705]/95 border-2 border-art-gold/60 rounded-3xl p-6 sm:p-10 shadow-[0_8px_32px_rgba(212,175,55,0.25)] relative overflow-hidden backdrop-blur-md space-y-3">
        <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        
        <div className="flex items-center gap-2 font-mono">
          <span className="p-1.5 rounded-lg bg-art-gold/20 text-art-gold border border-art-gold/40 shadow-sm">
            <Sparkles className="w-5 h-5 text-art-gold animate-pulse" />
          </span>
          <span className="text-xs font-bold text-art-gold uppercase tracking-widest">
            FRESH STUDIO CREATIONS & NEW ARRIVALS
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
          Newly Listed Fine Artworks
        </h1>

        <p className="text-xs sm:text-sm text-amber-100/80 max-w-3xl leading-relaxed">
          Discover genuine masterworks uploaded directly by verified painters, sculptors, and digital creators across 54 African ateliers. Every listing includes authentic studio provenance, direct artist escrow, and secure global logistics.
        </p>

        {/* Live Status Indicators */}
        <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Direct Studio Origin</span>
          </div>
          <div className="flex items-center gap-1.5 text-art-gold font-medium">
            <ShieldCheck className="w-4 h-4 text-art-gold" />
            <span>Dual Physical & Digital Certificate</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <TrendingUp className="w-4 h-4 text-amber-300" />
            <span>{realNewlyListedCount > 0 ? `${realNewlyListedCount} Live Artist Listings Active` : 'Curated Master Selection'}</span>
          </div>
        </div>
      </div>

      {/* Category Quick Filter */}
      <CategoryBar />

      {/* Filter & Search Bar */}
      <div className="bg-[#0D111A] p-4 sm:p-5 rounded-2xl border border-art-gold/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        
        {/* Text Search */}
        <div className="flex-1 flex items-center gap-3 bg-[#06080D] px-3.5 py-2.5 rounded-xl border border-white/10 focus-within:border-art-gold transition">
          <Search className="w-4 h-4 text-art-gold shrink-0" />
          <input
            type="text"
            placeholder="Search newly listed titles, artists, mediums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none placeholder-slate-400"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-white text-[11px]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Medium Selector */}
          <select
            value={selectedMedium}
            onChange={(e) => setSelectedMedium(e.target.value)}
            className="bg-[#06080D] text-slate-200 border border-white/15 px-3 py-2 rounded-xl focus:border-art-gold focus:outline-none cursor-pointer"
          >
            <option value="All">All Mediums</option>
            <option value="Oil">Oil on Canvas</option>
            <option value="Bronze">Bronze Cast</option>
            <option value="Wood">Carved Wood</option>
            <option value="Acrylic">Acrylic & Canvas</option>
            <option value="Digital">Digital & 3D Render</option>
            <option value="Textile">Textile / Indigo</option>
            <option value="Clay">Terracotta / Clay</option>
          </select>

          {/* Price Selector */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="bg-[#06080D] text-slate-200 border border-white/15 px-3 py-2 rounded-xl focus:border-art-gold focus:outline-none cursor-pointer"
          >
            <option value="All">All Price Tiers</option>
            <option value="under500k">Under ₦500k</option>
            <option value="500k_1m">₦500k - ₦1M</option>
            <option value="1m_3m">₦1M - ₦3M</option>
            <option value="above3m">Above ₦3M</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#06080D] text-slate-200 border border-white/15 px-3 py-2 rounded-xl focus:border-art-gold focus:outline-none cursor-pointer font-bold text-art-gold"
          >
            <option value="newest">✨ Newest Arrivals First</option>
            <option value="price_low">💰 Price: Low to High</option>
            <option value="price_high">💎 Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Real Artist Priority Callout if available */}
      {realNewlyListedCount > 0 && (
        <div className="p-3.5 bg-art-gold/10 border border-art-gold/40 rounded-2xl flex items-center justify-between text-xs text-art-gold animate-fade-in">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-art-gold shrink-0" />
            <span><strong>{realNewlyListedCount} genuine artist creation(s)</strong> highlighted at the front of this feed.</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-art-gold text-art-black px-2 py-0.5 rounded font-bold">
            Live Verified Feed
          </span>
        </div>
      )}

      {/* Artworks Grid */}
      {sortedArtworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedArtworks.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      ) : (
        <div className="bg-[#0D111A] p-12 rounded-3xl border border-white/10 text-center space-y-4 max-w-lg mx-auto">
          <Palette className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-white">No Artworks Found</h3>
          <p className="text-xs text-slate-400">
            No artworks match your current search filters. Try clearing your search or exploring all categories.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedMedium('All');
              setPriceFilter('All');
              setSelectedCategory('All');
            }}
            className="px-5 py-2.5 bg-art-gold text-art-black rounded-xl font-bold text-xs uppercase tracking-wider transition hover:brightness-110"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}

export default function NewlyListedPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-art-gold text-sm font-serif">Loading Newly Listed Artworks...</div>}>
      <NewlyListedContent />
    </Suspense>
  );
}
