'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { isPriorityArtist, sortArtworksByPriority } from '@/lib/priority-utils';
import { isDummyArtworkRecord } from '@/lib/uuid-utils';
import { 
  Sparkles, 
  Award, 
  Eye, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Quote, 
  Bookmark, 
  Building2,
  Crown
} from 'lucide-react';

export default function CuratorPicksPage() {
  const { artworks, currency, usdExchangeRate = 1480, curatorPicks: storeCuratorPicks = [], sellers = [], usersList = [], demoTransitionMode = 'progressive' } = useStore();
  const [selectedHall, setSelectedHall] = useState('All');

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      const rate = (usdExchangeRate && usdExchangeRate > 0) ? usdExchangeRate : 1480;
      return `$${Math.round(amount / rate).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const realArtworks = (artworks || []).filter(a => !isDummyArtworkRecord(a));
  const cleanStorePicks = (storeCuratorPicks || []).filter(p => !isDummyArtworkRecord(p));
  const curatorPicksList = cleanStorePicks.length > 0
    ? cleanStorePicks
    : realArtworks.map((art) => ({
        id: art.id,
        title: art.title,
        artistName: art.artistName,
        country: `${art.country || 'Nigeria'} ${art.countryFlag || '🇳🇬'}`,
        category: art.category,
        medium: art.medium,
        price: art.price,
        curatorName: 'Artellium Curatorial Directorate',
        curatorRole: 'Chief Senior Curator, Artellium Pan-African Board',
        rating: 5.0,
        image: art.image,
        curatorCritique: art.studioNotes || art.description || 'A commanding masterwork embodying authentic African cultural heritage, technical distinction, and archival permanence.',
        exhibitionHall: 'West African Modernism Pavilion'
      }));

  const filteredPicks = curatorPicksList.filter(pick => {
    if (selectedHall === 'All') return true;
    return pick.exhibitionHall === selectedHall;
  });

  const sortedPicks = sortArtworksByPriority(filteredPicks, { sellers, users: usersList });

  return (
    <div className="min-h-screen bg-[#07080A] text-slate-100 pb-20">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#1E092B] via-[#0E0414] to-[#07080A] border-b border-purple-500/30 pt-12 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold tracking-widest uppercase">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>PREMIER AFRICAN CURATORIAL SELECTIONS</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
                Curator Picks & Masterwork Essays
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                Hand-selected masterworks curated by Africa’s foremost museum directors, institutional fellows, and art critics. Explore in-depth curatorial critiques and cultural significance analyses.
              </p>
            </div>

            {/* Curatorial Seal */}
            <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 space-y-1 text-center shrink-0">
              <Award className="w-6 h-6 text-purple-400 mx-auto" />
              <span className="text-[10px] font-mono text-purple-300 uppercase block font-bold">Museum Peer Reviewed</span>
              <span className="text-xs font-serif font-bold text-white">Institutional Grade</span>
            </div>
          </div>

          {/* Exhibition Hall Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-4 border-t border-white/10 text-xs scrollbar-none">
            {['All', 'West African Modernism Pavilion', 'Imperial Bronzes & Metallurgical Heritage', 'North African Saharan Perspectives', 'Sacred Yoruba Ceremonial Sculpture'].map((hall) => (
              <button
                key={hall}
                onClick={() => setSelectedHall(hall)}
                className={`px-4 py-2 rounded-xl font-medium tracking-wide transition shrink-0 cursor-pointer ${
                  selectedHall === hall
                    ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/30 border border-purple-400'
                    : 'bg-[#141722] text-slate-300 hover:bg-[#1C2230] border border-white/10'
                }`}
              >
                {hall === 'All' ? 'All Exhibition Halls' : hall}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Curator Picks Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        {sortedPicks.map((pick) => (
          <div
            key={pick.id}
            className="group relative rounded-3xl overflow-hidden bg-[#0D1017] border border-purple-500/30 hover:border-purple-500/70 transition-all duration-500 shadow-2xl p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Masterpiece Photo Frame (5 cols - Clickable) */}
              <Link
                href={`/artwork/${pick.artworkId || pick.id}`}
                className="lg:col-span-5 block relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black shadow-xl cursor-pointer group/pick"
              >
                <img
                  src={pick.image}
                  alt={pick.title}
                  className="w-full h-full object-cover group-hover:scale-105 group-hover/pick:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
                  <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-purple-300 font-mono font-bold text-xs border border-purple-500/40 w-fit">
                    {pick.exhibitionHall}
                  </span>
                  {isPriorityArtist(pick, sellers, usersList) && (
                    <span className="bg-gradient-to-r from-amber-500 via-art-gold to-yellow-500 text-black font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.6)] flex items-center gap-1 border border-amber-300 w-fit">
                      <Crown className="w-2.5 h-2.5 text-black fill-current" />
                      <span>PRIORITY ARTIST</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-full bg-art-gold text-art-black font-serif font-black text-sm shadow-lg pointer-events-none">
                  {formatPrice(pick.price)}
                </div>
              </Link>

              {/* Curatorial Review Details (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-art-gold uppercase tracking-widest block">
                    {pick.artistName} ({pick.country})
                  </span>
                  <Link href={`/artwork/${pick.artworkId || pick.id}`}>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-300 transition-colors hover:underline">
                      {pick.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate-400 font-sans">
                    {pick.medium}
                  </p>
                </div>

                {/* Curator Quote Block */}
                <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/20 space-y-2 relative">
                  <Quote className="w-5 h-5 text-purple-400 opacity-60" />
                  <p className="text-xs sm:text-sm text-slate-200 font-serif italic leading-relaxed">
                    &ldquo;{pick.curatorCritique}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-purple-300 font-semibold font-sans">
                      — {pick.curatorName} <span className="text-slate-400 font-normal">({pick.curatorRole})</span>
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{pick.rating}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Link */}
                <div className="pt-2">
                  <Link
                    href={`/artwork/${pick.id}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-purple-600/30"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Masterpiece & Curatorial Dossier</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
