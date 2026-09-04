'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { isPriorityArtist, sortArtworksByPriority } from '@/lib/priority-utils';
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
  const { artworks, currency, curatorPicks: storeCuratorPicks = [], sellers = [], usersList = [] } = useStore();
  const [selectedHall, setSelectedHall] = useState('All');

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Standout curator picks with curatorial review essays
  const fallbackCuratorPicks = [
    {
      id: 'art-101',
      title: 'The Ancestral Horizon',
      artistName: 'Kofi Mensah',
      country: 'Ghana 🇬🇭',
      category: 'Painters',
      medium: 'Oil & 24K Gold Leaf on Canvas',
      price: 1850000,
      curatorName: 'Dr. Nana Osei',
      curatorRole: 'Director of Contemporary African Art, Accra Art Trust',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
      curatorCritique: 'Kofi Mensah has achieved an uncommon equilibrium between ancient Akan metaphysical heritage and monumental contemporary abstraction. The 24K gold leaf is not decorative; it operates as an active spiritual conduit.',
      exhibitionHall: 'West African Modernism Pavilion'
    },
    {
      id: 'art-102',
      title: 'Warrior of the Bronze Empire',
      artistName: 'Amina Diallo',
      country: 'Nigeria 🇳🇬',
      category: 'Sculpture Makers',
      medium: 'Cast Bronze & Ebony Wood Base',
      price: 3200000,
      curatorName: 'Prof. Folake Adeleke',
      curatorRole: 'Senior Fellow in African Metallurgy, Royal Heritage Foundation',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
      curatorCritique: 'Diallo’s bronze bust resurrects the immortal gravitas of 16th-century Benin foundry artistry while challenging classical patriarchal forms. A seminal acquisition for institutional archives.',
      exhibitionHall: 'Imperial Bronzes & Metallurgical Heritage'
    },
    {
      id: 'art-103',
      title: 'Solitude in the Sahara',
      artistName: 'Fatoumata Diabaté',
      country: 'Mali 🇲🇱',
      category: 'Photographers',
      medium: 'Archival Giclée Fine Art Print',
      price: 2240000,
      curatorName: 'Moussa Traoré',
      curatorRole: 'Chief Curator, Bamako Biennial of Photography',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=1000',
      curatorCritique: 'Diabaté translates the expansive, unforgiving silence of the Sahel into an intimate psychological landscape. The chromogenic depth is flawless.',
      exhibitionHall: 'North African Saharan Perspectives'
    },
    {
      id: 'art-107',
      title: 'Spirit of the Mask',
      artistName: 'Chief Bakare Ogundele',
      country: 'Nigeria 🇳🇬',
      category: 'Sculpture Makers',
      medium: 'Carved Iroko Wood & Brass Inlay',
      price: 1450000,
      curatorName: 'Dr. Babatunde Lawal',
      curatorRole: 'Emeritus Curator of African Sacred Arts',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1000',
      curatorCritique: 'Chief Ogundele breathes ancestral vitality into seasoned Iroko. The minimalist chiseled planes and brass inlays provide a profound dialogue between the sacred realm and fine sculpture.',
      exhibitionHall: 'Sacred Yoruba Ceremonial Sculpture'
    }
  ];

  const curatorPicksList = (storeCuratorPicks && storeCuratorPicks.length > 0) ? storeCuratorPicks : fallbackCuratorPicks;

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
              
              {/* Masterpiece Photo Frame (5 cols) */}
              <div className="lg:col-span-5 relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black shadow-xl">
                <img
                  src={pick.image}
                  alt={pick.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
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

                <div className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-full bg-art-gold text-art-black font-serif font-black text-sm shadow-lg">
                  {formatPrice(pick.price)}
                </div>
              </div>

              {/* Curatorial Review Details (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-art-gold uppercase tracking-widest block">
                    {pick.artistName} ({pick.country})
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {pick.title}
                  </h2>
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
