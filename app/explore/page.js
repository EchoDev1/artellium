'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ArtworkCard from '@/components/ArtworkCard';
import CategoryBar from '@/components/CategoryBar';
import { useStore } from '@/context/store-context';
import { Search, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';

function ExploreContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const badgeParam = searchParams.get('badge') || '';
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
  const filterParam = searchParams.get('filter') || '';
  const featuredParam = searchParams.get('featured') || '';

  const { artworks, selectedCategory, setSelectedCategory } = useStore();
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedMedium, setSelectedMedium] = useState('All');
  const [shipsFilter, setShipsFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, price_low, price_high

  // Filter artworks
  const filtered = artworks.filter((art) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesQuery = !term || (
      art.title?.toLowerCase().includes(term) ||
      art.artistName?.toLowerCase().includes(term) ||
      art.medium?.toLowerCase().includes(term) ||
      art.category?.toLowerCase().includes(term) ||
      art.country?.toLowerCase().includes(term) ||
      art.city?.toLowerCase().includes(term) ||
      art.description?.toLowerCase().includes(term) ||
      (term.includes('paint') && (art.category?.toLowerCase().includes('paint') || art.medium?.toLowerCase().includes('paint') || art.medium?.toLowerCase().includes('oil'))) ||
      (term.includes('sculpt') && (art.category?.toLowerCase().includes('sculpt') || art.medium?.toLowerCase().includes('bronze') || art.medium?.toLowerCase().includes('sculpt'))) ||
      (term.includes('draw') && (art.category?.toLowerCase().includes('draw') || art.medium?.toLowerCase().includes('charcoal') || art.medium?.toLowerCase().includes('ink'))) ||
      (term.includes('photo') && (art.category?.toLowerCase().includes('photo') || art.medium?.toLowerCase().includes('photo'))) ||
      (term.includes('textil') && (art.category?.toLowerCase().includes('textil') || art.medium?.toLowerCase().includes('textil') || art.medium?.toLowerCase().includes('adire'))) ||
      (term.includes('potter') && (art.category?.toLowerCase().includes('potter') || art.medium?.toLowerCase().includes('clay') || art.medium?.toLowerCase().includes('terracotta'))) ||
      (term.includes('ceramic') && (art.category?.toLowerCase().includes('ceramic') || art.medium?.toLowerCase().includes('stoneware'))) ||
      (term.includes('wood') && (art.category?.toLowerCase().includes('wood') || art.medium?.toLowerCase().includes('mahogany') || art.medium?.toLowerCase().includes('mask'))) ||
      (term.includes('metal') && (art.category?.toLowerCase().includes('metal') || art.medium?.toLowerCase().includes('iron') || art.medium?.toLowerCase().includes('brass'))) ||
      (term.includes('craft') && (art.category?.toLowerCase().includes('craft') || art.medium?.toLowerCase().includes('bead') || art.medium?.toLowerCase().includes('leather'))) ||
      (term.includes('indigenous') && (art.category?.toLowerCase().includes('indigenous') || art.medium?.toLowerCase().includes('heritage'))) ||
      (term.includes('limited') && (art.category?.toLowerCase().includes('limited') || art.medium?.toLowerCase().includes('edition') || art.medium?.toLowerCase().includes('print')))
    );

    const targetCat = (categoryParam || selectedCategory || '').toLowerCase();
    const artCat = (art.category || '').toLowerCase();
    const artMed = (art.medium || '').toLowerCase();

    const matchesCategory =
      !targetCat || targetCat === 'all'
        ? true
        : (
          artCat === targetCat ||
          artCat.includes(targetCat) ||
          targetCat.includes(artCat) ||
          (targetCat.includes('paint') && (artCat.includes('paint') || artMed.includes('oil') || artMed.includes('paint'))) ||
          (targetCat.includes('sculpt') && (artCat.includes('sculpt') || artMed.includes('bronze') || artMed.includes('wood'))) ||
          (targetCat.includes('draw') && (artCat.includes('draw') || artMed.includes('charcoal') || artMed.includes('ink'))) ||
          (targetCat.includes('photo') && (artCat.includes('photo') || artMed.includes('photo'))) ||
          (targetCat.includes('textil') && (artCat.includes('textil') || artMed.includes('textil') || artMed.includes('fiber'))) ||
          (targetCat.includes('potter') && (artCat.includes('potter') || artMed.includes('clay') || artMed.includes('terracotta'))) ||
          (targetCat.includes('ceramic') && (artCat.includes('ceramic') || artMed.includes('ceramic') || artMed.includes('stoneware'))) ||
          (targetCat.includes('wood') && (artCat.includes('wood') || artMed.includes('mahogany') || artMed.includes('carv'))) ||
          (targetCat.includes('metal') && (artCat.includes('metal') || artMed.includes('iron') || artMed.includes('brass'))) ||
          (targetCat.includes('craft') && (artCat.includes('craft') || artMed.includes('bead') || artMed.includes('leather'))) ||
          (targetCat.includes('indigenous') && (artCat.includes('indigenous') || artMed.includes('heritage') || artMed.includes('sacred'))) ||
          (targetCat.includes('limited') && (artCat.includes('limited') || artMed.includes('edition') || artMed.includes('print')))
        );

    const matchesMedium =
      selectedMedium === 'All' ? true : art.medium?.toLowerCase().includes(selectedMedium.toLowerCase());

    const matchesShips =
      shipsFilter === 'All'
        ? true
        : (art.shipsTo?.includes(shipsFilter) || art.shipsTo?.includes('Worldwide'));

    const matchesBadge = !badgeParam ? true : (
      art.verificationBadge === badgeParam || 
      (badgeParam === 'gold' && (art.verificationBadge === 'gold' || art.artistType === 'Premium'))
    );

    const matchesMaxPrice = !maxPriceParam ? true : (
      art.price <= maxPriceParam
    );

    const matchesFilter = !filterParam ? true : (
      filterParam === 'deals' ? (art.isDeal || art.isNewlyListed || (art.price && art.price < 2500000)) : true
    );

    const matchesFeatured = !featuredParam ? true : (
      featuredParam === 'true' ? (art.isFeatured || (art.rating && art.rating >= 4.8)) : true
    );

    return matchesQuery && matchesCategory && matchesMedium && matchesShips && matchesBadge && matchesMaxPrice && matchesFilter && matchesFeatured;
  });

  // Sort artworks
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-art-black-card p-6 sm:p-8 rounded-3xl border border-art-gold/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="badge-gold text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block">
            ARTELLIUM SERVICES & CATALOGUE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Online Art Marketplace
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
            Discover and acquire verified Paintings, Sculptures, Drawings, Photography, Textiles, Pottery, Ceramics, Woodworks, Metal works, Handmade crafts, Indigenous artworks, and Limited edition collections.
          </p>
        </div>
      </div>

      <CategoryBar />

      {/* Filter Bar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-art-black-card p-4 rounded-2xl border border-white/10 text-xs">
        <div className="flex-1 flex items-center gap-3 bg-art-black px-3 py-2 rounded-xl border border-white/10">
          <Search className="w-4 h-4 text-art-gold" />
          <input
            type="text"
            placeholder="Filter title, artist, technique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-art-gold" />
            <select
              value={selectedMedium}
              onChange={(e) => setSelectedMedium(e.target.value)}
              className="bg-art-black text-slate-200 border border-white/10 px-3 py-2 rounded-xl focus:outline-none cursor-pointer font-medium"
            >
              <option value="All">All Mediums</option>
              <option value="Oil">Oil & Canvas</option>
              <option value="Bronze">Bronze Sculpture</option>
              <option value="Wood">Carved Wood</option>
              <option value="Digital">Digital Print</option>
            </select>
          </div>

          <select
            value={shipsFilter}
            onChange={(e) => setShipsFilter(e.target.value)}
            className="bg-art-black text-slate-200 border border-white/10 px-3 py-2 rounded-xl focus:outline-none cursor-pointer font-medium"
          >
            <option value="All">✈️ Ships to: All Regions</option>
            <option value="Africa">🌍 Africa Domestic</option>
            <option value="Europe">🇪🇺 Europe</option>
            <option value="North America">🇺🇸 North America</option>
            <option value="Middle East">🇦🇪 Middle East</option>
            <option value="Asia">🌏 Asia</option>
            <option value="Worldwide">🌐 Worldwide Direct</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-art-black text-slate-200 border border-white/10 px-3 py-2 rounded-xl focus:outline-none cursor-pointer font-medium"
          >
            <option value="newest">Sort: Newest Listings</option>
            <option value="price_low">Sort: Price Low to High</option>
            <option value="price_high">Sort: Price High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Count & Active Filter Tags */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-medium">
        <div className="flex flex-wrap items-center gap-2">
          <span>Showing <strong className="text-white font-bold">{sorted.length}</strong> Masterpiece Listings</span>
          {badgeParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-[11px] font-bold">
              <span>Verified Masters ({badgeParam.toUpperCase()})</span>
            </span>
          )}
          {maxPriceParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 text-[11px] font-bold">
              <span>Under ₦{(maxPriceParam / 1000000).toFixed(0)}M Deals</span>
            </span>
          )}
          {filterParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-700/60 text-[11px] font-bold">
              <span>Filter: {filterParam}</span>
            </span>
          )}
          {featuredParam && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-700/60 text-[11px] font-bold">
              <span>Curator Featured</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid Display */}
      {sorted.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-art-black-card rounded-2xl border border-white/10">
          <Sparkles className="w-10 h-10 text-art-gold mx-auto" />
          <h3 className="font-serif text-xl font-bold text-white">No artworks match your search</h3>
          <p className="text-xs text-slate-400">Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-art-gold font-serif">Loading Catalogue...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
