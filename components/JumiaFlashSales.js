'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { Zap, Flame, ArrowRight, Clock, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';

export default function JumiaFlashSales() {
  const { homePageConfig, currency, artworks = [] } = useStore();
  const flashSaleConfig = homePageConfig?.flashSale;

  const [timeLeft, setTimeLeft] = useState({
    hours: '08',
    minutes: '24',
    seconds: '15'
  });

  useEffect(() => {
    const target = flashSaleConfig?.endTime ? new Date(flashSaleConfig.endTime).getTime() : Date.now() + 8 * 3600 * 1000;
    const interval = setInterval(() => {
      const difference = target - Date.now();
      if (difference <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / (1000 * 60)) % 60);
      const s = Math.floor((difference / 1000) % 60);
      setTimeLeft({
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [flashSaleConfig?.endTime]);

  const defaultFlashItems = [
    {
      id: 'flash-1',
      artworkId: 'art-107',
      title: 'Spirit of the Mask',
      artist: 'Chief Bakare Ogundele (Nigeria 🇳🇬)',
      originalPrice: 1950000,
      dealPrice: 1450000,
      originalPriceUSD: 1320,
      dealPriceUSD: 980,
      discountPercent: 25,
      itemsLeft: 1,
      claimedPercent: 75,
      image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'flash-2',
      artworkId: 'art-109',
      title: 'Children of the Sun',
      artist: 'Kenza Belghiti (Morocco 🇲🇦)',
      originalPrice: 2100000,
      dealPrice: 1680000,
      originalPriceUSD: 1420,
      dealPriceUSD: 1130,
      discountPercent: 20,
      itemsLeft: 2,
      claimedPercent: 60,
      image: 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'flash-3',
      artworkId: 'art-110',
      title: 'Ancestral Geometry',
      artist: 'Chidi Nwosu (Nigeria 🇳🇬)',
      originalPrice: 620000,
      dealPrice: 465000,
      originalPriceUSD: 420,
      dealPriceUSD: 315,
      discountPercent: 25,
      itemsLeft: 3,
      claimedPercent: 70,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'flash-4',
      artworkId: 'art-112',
      title: 'Sahara Mirage',
      artist: 'Fatoumata Diabaté (Mali 🇲🇱)',
      originalPrice: 2800000,
      dealPrice: 2240000,
      originalPriceUSD: 1900,
      dealPriceUSD: 1520,
      discountPercent: 20,
      itemsLeft: 1,
      claimedPercent: 85,
      image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const items = (flashSaleConfig?.items && flashSaleConfig.items.length > 0)
    ? flashSaleConfig.items
    : defaultFlashItems;

  const formatPriceVal = (priceNgn, priceUsd) => {
    if (currency === 'USD' && priceUsd) {
      return `$${priceUsd.toLocaleString()}`;
    }
    return `₦${priceNgn.toLocaleString()}`;
  };

  return (
    <section className="w-full bg-gradient-to-b from-[#7A570F] via-[#523A0A] to-[#3B2906] rounded-3xl border border-art-gold/50 shadow-2xl overflow-hidden">
      {/* JUMIA-STYLE RED & GOLD FLASH SALE HEADER */}
      <div className="bg-gradient-to-r from-[#68490B] via-[#996F15] to-[#68490B] text-white px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-art-gold/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-600/30 border border-red-500/40 backdrop-blur-sm">
            <Zap className="w-5 h-5 text-art-gold fill-current animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg sm:text-xl font-black tracking-wide uppercase text-white">
                {flashSaleConfig?.title || 'FINE ART FLASH DEALS & LIMITED DROPS'}
              </h2>
              <span className="bg-art-gold text-art-black px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider">
                TIME LIMITED
              </span>
            </div>
            <p className="text-xs text-red-200 font-sans">
              {flashSaleConfig?.subtitle || 'Direct Atelier Vault Discounts · 100% Physical Provenance Guaranteed'}
            </p>
          </div>
        </div>

        {/* Live Countdown Timer & CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-red-800/50 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-red-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="text-slate-300 text-[10px] mr-1 hidden sm:inline">ENDS IN:</span>
            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-200 font-bold border border-red-800/60">{timeLeft.hours}h</span>
            <span className="text-art-gold font-black">:</span>
            <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-200 font-bold border border-red-800/60">{timeLeft.minutes}m</span>
            <span className="text-art-gold font-black">:</span>
            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold animate-pulse">{timeLeft.seconds}s</span>
          </div>

          <Link
            href={flashSaleConfig?.buttonLink || '/explore'}
            className="text-xs font-bold text-white hover:text-art-gold transition flex items-center gap-1 shrink-0 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/20"
          >
            <span className="hidden sm:inline">{flashSaleConfig?.buttonText || 'SEE ALL DEALS'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* FLASH SALE ITEMS GRID */}
      <div className="p-3.5 sm:p-6 bg-gradient-to-b from-[#3B2906] to-[#241903]">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 scrollbar-none snap-x snap-mandatory touch-pan-x">
          {items.map((it) => (
            <div
              key={it.id}
              className="w-[240px] xs:w-[265px] sm:w-auto shrink-0 snap-start bg-[#0F131C] rounded-2xl border border-white/10 hover:border-red-500/60 shadow-lg transition duration-300 p-3.5 space-y-3 flex flex-col justify-between group relative"
            >
              {/* Discount Badge */}
              <div className="absolute top-5 left-5 z-10 bg-red-600 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-lg shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                <span>-{it.discountPercent}%</span>
              </div>

              {/* Artwork Thumbnail */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black">
                <img
                  src={it.image}
                  alt={it.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] text-slate-300 font-sans font-medium line-clamp-1">
                  {it.artist}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-1.5">
                <h4 className="font-serif font-bold text-white text-sm line-clamp-1 group-hover:text-red-400 transition">
                  {it.title}
                </h4>

                {/* Price Display: Deal vs Strikethrough */}
                <div className="flex items-baseline gap-2">
                  <span className="font-serif font-black text-red-400 text-base sm:text-lg">
                    {formatPriceVal(it.dealPrice, it.dealPriceUSD)}
                  </span>
                  <span className="text-xs text-slate-500 line-through font-mono">
                    {formatPriceVal(it.originalPrice, it.originalPriceUSD)}
                  </span>
                </div>

                {/* Inventory Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-amber-400 flex items-center gap-1 font-sans">
                      <Flame className="w-3 h-3 text-red-500 fill-current" />
                      <span>{it.itemsLeft || 1} available</span>
                    </span>
                    <span className="text-slate-400 font-mono">{it.claimedPercent || 60}% Claimed</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-black overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-art-gold rounded-full transition-all duration-500"
                      style={{ width: `${it.claimedPercent || 60}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/artwork/${it.artworkId || 'art-101'}`}
                className="w-full py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow text-center flex items-center justify-center gap-1.5 mt-1"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Claim Flash Deal</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
