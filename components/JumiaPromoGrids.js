'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { Crown, Sparkles, ArrowRight, Tag, ShieldCheck, Zap } from 'lucide-react';

export default function JumiaPromoGrids() {
  const { homePageConfig } = useStore();

  const defaultBanners = [
    {
      id: 'promo-split-1',
      layoutType: 'split_2_col',
      title: 'Curated Atelier Departments',
      badge: 'PAN-AFRICAN COLLECTIONS',
      card1: {
        badge: 'ROYAL MASTERWORKS',
        title: 'West African Oil Masters',
        subtitle: 'Authentic canvas creations layered with 24K gold leaf, gesso, and raw linen from Accra and Lagos masters.',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
        buttonText: 'Shop Fine Paintings',
        buttonLink: '/categories/paintings',
        bgGradient: 'from-[#1A1105] via-[#100B03] to-[#080501]'
      },
      card2: {
        badge: 'ANCIENT GUILD BRONZE',
        title: 'Lost-Wax Bronze Sculptures',
        subtitle: 'Handcrafted by hereditary foundry masters in Benin City and Oyo. Physical provenance ledger certified.',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
        buttonText: 'Shop Bronze Sculptures',
        buttonLink: '/categories/sculptures',
        bgGradient: 'from-[#1B0B0B] via-[#100707] to-[#080303]'
      }
    }
  ];

  const customBanners = (homePageConfig?.customBanners && homePageConfig.customBanners.length > 0)
    ? homePageConfig.customBanners.filter(b => b.isVisible !== false)
    : defaultBanners;

  if (!customBanners || customBanners.length === 0) return null;

  return (
    <div className="space-y-8">
      {customBanners.map((banner) => {
        // 1. TWO-COLUMN SPLIT DEAL CARDS (JUMIA STYLE)
        if (banner.layoutType === 'split_2_col' && banner.card1 && banner.card2) {
          return (
            <div key={banner.id} className="space-y-4">
              {banner.title && (
                <div className="flex items-center justify-between border-b border-art-gold/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-art-gold/10 text-art-gold border border-art-gold/30">
                      <Crown className="w-4 h-4" />
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">{banner.title}</h3>
                  </div>
                  {banner.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-art-gold/15 text-art-gold uppercase font-mono border border-art-gold/30">
                      {banner.badge}
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Card 1 */}
                <div className={`relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r ${banner.card1.bgGradient || 'from-[#1A1105] via-[#100B03] to-[#080501]'} text-white border border-art-gold/35 shadow-xl flex flex-col justify-between group`}>
                  <div className="space-y-3 relative z-10 max-w-md">
                    {banner.card1.badge && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-art-gold text-art-black font-black text-[9px] font-mono uppercase tracking-wider shadow">
                        {banner.card1.badge}
                      </span>
                    )}
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-art-gold transition">
                      {banner.card1.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {banner.card1.subtitle}
                    </p>
                  </div>

                  <div className="pt-6 relative z-10 flex items-center justify-between">
                    <Link
                      href={banner.card1.buttonLink || '/categories/paintings'}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-art-gold to-art-gold-dark hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider transition shadow-gold-glow flex items-center gap-2"
                    >
                      <span>{banner.card1.buttonText || 'Shop Fine Paintings'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Background Artwork Accent */}
                  {banner.card1.image && (
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 group-hover:opacity-35 group-hover:scale-105 transition duration-700 pointer-events-none">
                      <img src={banner.card1.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1105] via-[#1A1105]/70 to-transparent" />
                    </div>
                  )}
                </div>

                {/* Card 2 */}
                <div className={`relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r ${banner.card2.bgGradient || 'from-[#1B0B0B] via-[#100707] to-[#080303]'} text-white border border-red-800/40 shadow-xl flex flex-col justify-between group`}>
                  <div className="space-y-3 relative z-10 max-w-md">
                    {banner.card2.badge && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] font-mono uppercase tracking-wider shadow">
                        {banner.card2.badge}
                      </span>
                    )}
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-red-300 transition">
                      {banner.card2.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {banner.card2.subtitle}
                    </p>
                  </div>

                  <div className="pt-6 relative z-10 flex items-center justify-between">
                    <Link
                      href={banner.card2.buttonLink || '/categories/sculptures'}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition shadow-crimson-glow flex items-center gap-2"
                    >
                      <span>{banner.card2.buttonText || 'Shop Bronze Sculptures'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Background Artwork Accent */}
                  {banner.card2.image && (
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 group-hover:opacity-35 group-hover:scale-105 transition duration-700 pointer-events-none">
                      <img src={banner.card2.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#1B0B0B] via-[#1B0B0B]/70 to-transparent" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        // 2. THREE-COLUMN MULTI-DEAL CARDS (JUMIA STYLE)
        if (banner.layoutType === 'multi_3_col' && banner.card1 && banner.card2 && banner.card3) {
          return (
            <div key={banner.id} className="space-y-4">
              {banner.title && (
                <div className="flex items-center justify-between border-b border-art-gold/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                      <Tag className="w-4 h-4" />
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">{banner.title}</h3>
                  </div>
                  {banner.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-300 uppercase font-mono border border-emerald-800/40">
                      {banner.badge}
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                {[banner.card1, banner.card2, banner.card3].map((card, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-3xl overflow-hidden p-5 sm:p-6 bg-gradient-to-r ${card.bgGradient || 'from-[#0D1017] to-black'} text-white border border-white/10 shadow-lg flex flex-col justify-between group`}
                  >
                    <div className="space-y-2 relative z-10">
                      {card.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-white/15 text-white font-mono text-[9px] font-bold uppercase tracking-wider inline-block">
                          {card.badge}
                        </span>
                      )}
                      <h4 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-art-gold transition">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {card.subtitle}
                      </p>
                    </div>

                    <div className="pt-5 relative z-10 flex items-center justify-between">
                      <Link
                        href={card.buttonLink || '/explore'}
                        className="text-xs font-bold text-art-gold hover:underline flex items-center gap-1"
                      >
                        <span>{card.buttonText || 'Explore'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {card.image && (
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 group-hover:opacity-30 transition pointer-events-none">
                        <img src={card.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // 3. FULL-WIDTH LUXURY PROMO BANNER (DEFAULT)
        return (
          <div 
            key={banner.id}
            className={`relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-art-gold/30 shadow-2xl bg-gradient-to-r ${banner.bgGradient || 'from-[#1C1205] via-[#100B03] to-[#07080A]'} text-white`}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                {banner.badge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-art-gold/15 border border-art-gold/40 text-art-gold text-xs font-bold uppercase tracking-wider">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{banner.badge}</span>
                  </div>
                )}
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-300">
                    {banner.subtitle}
                  </p>
                )}
              </div>

              <Link
                href={banner.buttonLink || '/explore'}
                className="px-6 py-3 bg-gradient-to-r from-art-gold to-art-gold-dark hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-gold-glow shrink-0 flex items-center gap-2"
              >
                <span>{banner.buttonText || 'Explore Collection'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
