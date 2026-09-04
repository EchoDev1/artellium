'use client';

import React, { useState } from 'react';
import ArtworkCard from '@/components/ArtworkCard';
import { useStore } from '@/context/store-context';
import { sortArtworksByPriority } from '@/lib/priority-utils';
import { Award, ShieldCheck, Search, SlidersHorizontal, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function RecentlySoldPage() {
  const { artworks, currency, sellers = [], usersList = [] } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter only sold items with Subscribed Priority Artists strictly first
  const soldArtworks = sortArtworksByPriority(
    artworks.filter((art) => art.status === 'sold'),
    { sellers, users: usersList, secondarySort: 'sold_date' }
  );

  // Filter sold items by search / category
  const filteredSold = soldArtworks.filter((art) => {
    const matchesQuery =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.soldTo && art.soldTo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ? true : art.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Calculate stats
  const totalVolume = soldArtworks.reduce((sum, art) => sum + (art.soldPrice || art.price), 0);
  const avgPrice = soldArtworks.length > 0 ? totalVolume / soldArtworks.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/20 via-[#0E1117] to-art-black p-8 rounded-3xl border border-art-gold/30 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-art-gold/10 text-art-gold border border-art-gold/30">
            <Award className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold text-art-gold uppercase tracking-widest">
            HISTORICAL LEDGER & PROVENANCE REGISTRY
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
          Provenance Ledger of Sold Masterpieces
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
          ARTELLIUM acts as the formal custodian of records for high-value African fine art sales. Review the closing values, ownership transfers, and provenance records for historical transactions executed on our gateway.
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400 font-sans">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Settlement Disbursed</span>
          </div>
          <div className="flex items-center gap-1.5 text-art-gold">
            <BookOpen className="w-4 h-4" />
            <span>Immutable Provenance Stamp</span>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-art-black-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Transacted Volume</span>
          <p className="font-serif text-2xl font-bold text-art-gold">{formatPrice(totalVolume)}</p>
        </div>
        <div className="bg-art-black-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Average Masterpiece Value</span>
          <p className="font-serif text-2xl font-bold text-white">{formatPrice(avgPrice)}</p>
        </div>
        <div className="bg-art-black-card p-5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Authenticated Lots</span>
          <p className="font-serif text-2xl font-bold text-white">{soldArtworks.length} Sold Lots</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-art-black-card p-4 rounded-2xl border border-white/10 text-xs">
        <div className="flex-1 flex items-center gap-3 bg-art-black px-3 py-2 rounded-xl border border-white/10">
          <Search className="w-4 h-4 text-art-gold" />
          <input
            type="text"
            placeholder="Search by title, artist, or collector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-white focus:outline-none placeholder-slate-400 font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-art-gold" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-art-black text-slate-200 border border-white/10 px-3 py-2 rounded-xl focus:outline-none cursor-pointer font-medium font-sans"
          >
            <option value="All">All Categories</option>
            <option value="Painters">Painters (Oil/Canvas)</option>
            <option value="Sculpture Makers">Sculpture Makers (Bronze/Wood)</option>
            <option value="Digital Art">Digital Art & Prints</option>
          </select>
        </div>
      </div>

      {/* Ledger Grid */}
      {filteredSold.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-art-black-card rounded-2xl border border-white/10 font-sans">
          <p className="text-slate-400">No sold masterpieces match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSold.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      )}
    </div>
  );
}
