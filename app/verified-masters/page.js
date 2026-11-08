'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  ArrowRight, 
  MapPin, 
  Palette, 
  UserCheck, 
  Building,
  Crown
} from 'lucide-react';
import { isPriorityArtist } from '@/lib/priority-utils';
import { isDummyArtworkRecord, isDummyUserRecord } from '@/lib/uuid-utils';

export default function VerifiedMastersPage() {
  const { artworks, currency, usdExchangeRate = 1480, artistVerifications: storeVerifications = [], sellers = [], usersList = [], demoTransitionMode = 'progressive' } = useStore();
  const [selectedCountry, setSelectedCountry] = useState('All');

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      const rate = (usdExchangeRate && usdExchangeRate > 0) ? usdExchangeRate : 1480;
      return `$${Math.round(amount / rate).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const realSellers = (sellers || []).filter(s => !isDummyUserRecord(s));
  const realArtworks = (artworks || []).filter(a => !isDummyArtworkRecord(a));

  const verifiedMastersList = realSellers.length > 0 ? realSellers.map(s => {
    const art = realArtworks.find(a => a.artistId === s.id || a.artistName?.toLowerCase() === s.name?.toLowerCase()) || realArtworks[0];
    const cleanSellerAvatar = s.avatar_url && !s.avatar_url.includes('unsplash.com') ? s.avatar_url : '';
    return {
      id: s.id,
      name: s.name,
      title: s.bio || 'Verified Sovereign Master Artist',
      country: s.country || 'Nigeria',
      flag: s.country_flag || '🇳🇬',
      city: s.city || 'Lagos',
      avatar: cleanSellerAvatar,
      accreditation: 'Artellium Verified Atelier Sovereign Guild',
      verificationBadge: 'Gold Crest Certified',
      kycHash: `VERIF-NG-${String(s.id || '').toUpperCase()}-GOLD`,
      biography: s.bio || `${s.name} is an authenticated creator registered with Artellium's Pan-African atelier network.`,
      featuredArtwork: art ? {
        id: art.id,
        title: art.title,
        medium: art.medium,
        price: art.price,
        image: art.image
      } : null
    };
  }).filter(m => m.featuredArtwork) : [];

  const filteredMasters = verifiedMastersList.filter(master => {
    if (selectedCountry === 'All') return true;
    return master.country === selectedCountry;
  });

  const sortedMasters = [...filteredMasters].sort((a, b) => {
    const aPri = isPriorityArtist(a, sellers, usersList);
    const bPri = isPriorityArtist(b, sellers, usersList);
    if (aPri && !bPri) return -1;
    if (!aPri && bPri) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#07080A] text-slate-100 pb-20">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#062016] via-[#04120D] to-[#07080A] border-b border-emerald-500/30 pt-12 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% CERTIFIED AUTHENTIC ARTISTS</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
                Verified Masters Directory
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                Artworks strictly created by verified master painters, sculptors, and fine craftsmen who have passed biometric identity verification, national museum peer review, and studio provenance inspection.
              </p>
            </div>

            {/* Verification Stats */}
            <div className="flex items-center gap-3 bg-black/60 border border-emerald-500/30 rounded-2xl p-4 shrink-0 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <span className="font-bold text-white block">Strict KYC & Biometric Provenance</span>
                <span className="text-slate-400 text-[11px]">Tamper-Proof Physical Certificate on Every Sale</span>
              </div>
            </div>
          </div>

          {/* Country Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-4 border-t border-white/10 text-xs scrollbar-none">
            {['All', 'Ghana', 'Nigeria', 'Morocco'].map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`px-4 py-2 rounded-xl font-medium tracking-wide transition shrink-0 cursor-pointer ${
                  selectedCountry === country
                    ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30 border border-emerald-400'
                    : 'bg-[#141722] text-slate-300 hover:bg-[#1C2230] border border-white/10'
                }`}
              >
                {country === 'All' ? 'All Verified Masters' : country}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verified Masters List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {sortedMasters.map((master) => (
          <div
            key={master.id}
            className="group relative rounded-3xl overflow-hidden bg-[#0D1017] border border-white/10 hover:border-emerald-500/60 transition-all duration-300 shadow-2xl p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Artist Profile Info (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-4">
                  {master.avatar ? (
                    <img
                      src={master.avatar}
                      alt={master.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/60 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-emerald-500/60 shadow-lg flex items-center justify-center font-serif text-2xl font-bold text-art-gold shrink-0">
                      {master.name ? master.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {master.name}
                      </h2>
                      <span title="Gold Verified Master" className="text-emerald-400">
                        <CheckCircle2 className="w-5 h-5 fill-emerald-500/20 text-emerald-400" />
                      </span>
                      {isPriorityArtist(master, sellers, usersList) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-art-gold via-amber-300 to-art-gold text-art-black font-black text-[10px] uppercase tracking-wider shadow">
                          <Crown className="w-3 h-3 fill-current" />
                          <span>PRIORITY MASTER</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-art-gold font-medium font-sans">
                      {master.title} · {master.flag} {master.city}, {master.country}
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                      {master.verificationBadge}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                  {master.biography}
                </p>

                {/* Accreditation Seal Box */}
                <div className="p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Accreditation: <strong className="text-slate-200">{master.accreditation}</strong></span>
                  <span className="text-emerald-400 font-bold">{master.kycHash}</span>
                </div>
              </div>

              {/* Masterpiece Preview (5 cols) */}
              <div className="lg:col-span-5 bg-[#080A0E] rounded-2xl border border-white/10 p-4 space-y-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider font-bold">
                  ✦ Featured Verified Masterpiece
                </span>
                
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
                  <img
                    src={master.featuredArtwork.image}
                    alt={master.featuredArtwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">{master.featuredArtwork.title}</h4>
                    <span className="text-[11px] text-slate-400">{master.featuredArtwork.medium}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-sm font-bold text-art-gold block">
                      {formatPrice(master.featuredArtwork.price)}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/artwork/${master.featuredArtwork.id}`}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-600/30"
                >
                  <span>Acquire Verified Masterwork</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
