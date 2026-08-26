'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Flame, 
  Clock, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Check, 
  Percent, 
  Sparkles, 
  ShoppingBag, 
  Eye, 
  Tag, 
  Filter
} from 'lucide-react';

export default function FlashDealsPage() {
  const { artworks, addToCart, currency, flashDeals = [], claimFlashDeal } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 12, seconds: 40 });
  const [claimedNotice, setClaimedNotice] = useState(null);

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Flash deal artworks with slashed prices and discount percentages
  const fallbackFlashDeals = [
    {
      id: 'art-107',
      title: 'Spirit of the Mask',
      artistName: 'Chief Bakare Ogundele',
      country: 'Nigeria 🇳🇬',
      category: 'Sculpture Makers',
      medium: 'Carved Iroko Wood & Brass Inlay',
      originalPrice: 1950000,
      discountedPrice: 1450000,
      discountPercent: 25,
      availableUnits: 1,
      claimedPercent: 75,
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1000',
      description: 'Sacred Yoruba ceremonial carving with hand-hammered brass inlay, offering exceptional presence and cultural lineage.'
    },
    {
      id: 'art-109',
      title: 'Children of the Sun',
      artistName: 'Kenza Belghiti',
      country: 'Morocco 🇲🇦',
      category: 'Painters',
      medium: 'Acrylic & Gold Dust on Canvas',
      originalPrice: 2100000,
      discountedPrice: 1680000,
      discountPercent: 20,
      availableUnits: 2,
      claimedPercent: 60,
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
      description: 'Atmospheric North African portraiture exploring light and Berber heritage with authentic 22K gold dust accents.'
    },
    {
      id: 'art-110',
      title: 'Ancestral Geometry',
      artistName: 'Chidi Nwosu',
      country: 'Nigeria 🇳🇬',
      category: 'Painters',
      medium: 'Mixed Media & Natural Pigments',
      originalPrice: 620000,
      discountedPrice: 465000,
      discountPercent: 25,
      availableUnits: 3,
      claimedPercent: 70,
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
      description: 'Intricate Uli-inspired geometric expressions utilizing organic riverbed minerals and raw linen.'
    },
    {
      id: 'art-112',
      title: 'Sahara Mirage',
      artistName: 'Fatoumata Diabaté',
      country: 'Mali 🇲🇱',
      category: 'Photographers',
      medium: 'Archival Giclée Print on Fine Art Rag',
      originalPrice: 2800000,
      discountedPrice: 2240000,
      discountPercent: 20,
      availableUnits: 1,
      claimedPercent: 85,
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=1000',
      description: 'Dramatic desert composition capturing Tuareg nomadic life with master-grade archival preservation.'
    },
    {
      id: 'art-101',
      title: 'The Ancestral Horizon',
      artistName: 'Kofi Mensah',
      country: 'Ghana 🇬🇭',
      category: 'Painters',
      medium: 'Oil & Gold Leaf on Canvas',
      originalPrice: 2400000,
      discountedPrice: 1850000,
      discountPercent: 23,
      availableUnits: 1,
      claimedPercent: 90,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
      description: '24K gold leaf masterwork exploring West African royal lineage, exhibited at international biennales.'
    },
    {
      id: 'art-115',
      title: 'Echoes of Benin Royalty',
      artistName: 'Osahon Idehen',
      country: 'Nigeria 🇳🇬',
      category: 'Sculpture Makers',
      medium: 'Bronze Casting & Patina',
      originalPrice: 1800000,
      discountedPrice: 1350000,
      discountPercent: 25,
      availableUnits: 2,
      claimedPercent: 65,
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
      description: 'Traditional lost-wax bronze casting representing imperial court heraldry with certified provenance.'
    }
  ];

  const flashDealsList = (flashDeals && flashDeals.length > 0) ? flashDeals : fallbackFlashDeals;

  const filteredDeals = flashDealsList.filter(deal => {
    if (selectedCategory === 'All') return true;
    return (deal.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleClaimDeal = (deal) => {
    if (addToCart) {
      addToCart({
        id: deal.id,
        title: deal.title,
        artistName: deal.artistName,
        price: deal.discountedPrice,
        image: deal.image,
        category: deal.category,
        medium: deal.medium
      });
    }
    setClaimedNotice(deal.title);
    setTimeout(() => setClaimedNotice(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-slate-100 pb-20">
      {/* Toast Notification */}
      {claimedNotice && (
        <div className="fixed top-20 right-6 z-50 bg-[#161B26] border-2 border-red-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">✓</div>
          <div>
            <p className="text-xs font-bold text-red-400 font-mono uppercase">Flash Deal Claimed!</p>
            <p className="text-sm font-serif font-semibold">{claimedNotice} added to cart at vault discount.</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative bg-gradient-to-b from-[#2A0505] via-[#150202] to-[#07080A] border-b border-red-500/30 pt-10 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-400 text-xs font-mono font-bold tracking-widest uppercase">
                <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                <span>DIRECT ATELIER VAULT DISCOUNTS</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
                Fine Art Flash Deals
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-sans">
                Time-limited reserve drops with prices slashed directly by verified African master artists. Every piece includes 100% physical provenance certification and verified fiduciary settlement guarantee.
              </p>
            </div>

            {/* Countdown Clock Box */}
            <div className="bg-[#120000] border-2 border-red-500/60 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(239,68,68,0.25)] shrink-0 text-center space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-red-400 tracking-widest flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 animate-spin text-red-400" />
                <span>VAULT CLOSES IN:</span>
              </span>
              <div className="flex items-center justify-center gap-2 font-mono font-black text-2xl sm:text-3xl text-white">
                <div className="bg-[#2A0000] px-3 py-1.5 rounded-lg border border-red-500/40">
                  {String(timeLeft.hours).padStart(2, '0')}
                  <span className="block text-[9px] font-normal text-red-300 font-sans">HRS</span>
                </div>
                <span className="text-red-500">:</span>
                <div className="bg-[#2A0000] px-3 py-1.5 rounded-lg border border-red-500/40">
                  {String(timeLeft.minutes).padStart(2, '0')}
                  <span className="block text-[9px] font-normal text-red-300 font-sans">MIN</span>
                </div>
                <span className="text-red-500">:</span>
                <div className="bg-[#2A0000] px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                  <span className="block text-[9px] font-normal text-red-300 font-sans">SEC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-4 border-t border-white/10 text-xs scrollbar-none">
            {['All', 'Painters', 'Sculpture Makers', 'Photographers'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-medium tracking-wide transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30 border border-red-400'
                    : 'bg-[#141722] text-slate-300 hover:bg-[#1C2230] border border-white/10'
                }`}
              >
                {cat === 'All' ? 'All Flash Deals' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Flash Deal Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredDeals.map((deal) => (
            <div
              key={deal.id}
              className="group relative rounded-3xl overflow-hidden bg-[#0D1017] border border-white/10 hover:border-red-500/60 transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1.5"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-transparent to-black/30 pointer-events-none" />

                {/* Discount Percentage Badge */}
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-red-600 text-white font-mono font-black text-xs shadow-lg flex items-center gap-1 border border-red-400">
                  <Percent className="w-3.5 h-3.5" />
                  <span>{deal.discountPercent}% OFF</span>
                </div>

                {/* Units Left Pill */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-300 font-mono font-bold text-[10px] border border-amber-500/30">
                  {deal.availableUnits} Available
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-sans font-semibold text-art-gold uppercase tracking-wider block">
                    {deal.artistName} ({deal.country})
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                    {deal.medium} · {deal.description}
                  </p>
                </div>

                {/* Progress Bar & Price Section */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  {/* Claimed Meter */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{deal.claimedPercent}% Claimed</span>
                      <span className="text-red-400 font-bold">Fast Selling</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${deal.claimedPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Slashed Price Display */}
                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">Slashed Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl sm:text-2xl font-black text-red-400">
                          {formatPrice(deal.discountedPrice)}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-mono">
                          {formatPrice(deal.originalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href={`/artwork/${deal.id}`}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs flex items-center justify-center gap-1 border border-white/10 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>

                    <button
                      onClick={() => handleClaimDeal(deal)}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Claim Deal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
