'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, ShieldCheck, Award, Sparkles, ArrowRight, CheckCircle2, Eye, Compass } from 'lucide-react';

const HERITAGE_PILLARS = [
  {
    id: 'benin-bronze',
    title: 'Kingdom of Benin Guild',
    nativeName: 'Igun Eronmwon Guild',
    region: 'Edo Kingdom · Nigeria',
    era: '13th Century – Present',
    medium: 'Lost-Wax Bronze & Cast Brass',
    accentColor: 'from-[#1A1202] via-[#07080A] to-[#0A261A]',
    badgeColor: 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10',
    sealText: 'ROYAL OBA BRONZE SEAL',
    summary: 'Master court metallurgists historically appointed directly by the Oba of Benin, casting high-relief sovereign plaques and ceremonial memorial heads.',
    technique: 'Cire-Perdue (Lost-Wax) Crucible Casting',
    culturalSignificance: 'Historical court records and spiritual genealogy preserved in indestructible copper alloys before modern documentation.',
    symbolSvg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor">
        <circle cx="30" cy="30" r="24" strokeWidth="1.5" strokeDasharray="3 3" />
        <polygon points="30,12 44,40 16,40" strokeWidth="1.5" fill="#D4AF37" fillOpacity="0.15" />
        <circle cx="30" cy="28" r="5" fill="#D4AF37" />
        <line x1="30" y1="12" x2="30" y2="48" strokeWidth="1.5" />
        <line x1="16" y1="34" x2="44" y2="34" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    id: 'ashanti-kente',
    title: 'Ashanti Sovereign Ateliers',
    nativeName: 'Asantehene Royal Weavers',
    region: 'Kumasi · Ghana',
    era: '17th Century – Present',
    medium: 'Silk & Cotton Strip-Loom Textiles',
    accentColor: 'from-[#062319] via-[#0A3323] to-[#07080A]',
    badgeColor: 'border-emerald-400 text-emerald-300 bg-emerald-950/60',
    sealText: 'ADINKRA COSMOGRAM SEAL',
    summary: 'Woven on horizontal treadle looms in royal villages like Bonwire, encoding centuries of philosophical maxims into complex geometric color sequences.',
    technique: 'Double-Weave Warp-Faced Narrow Band Weaving',
    culturalSignificance: 'Regal status cloth historically restricted to kings and chiefs for sacred festivals and sovereign declarations.',
    symbolSvg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor">
        <rect x="14" y="14" width="32" height="32" strokeWidth="1.5" rx="4" />
        <line x1="14" y1="30" x2="46" y2="30" strokeWidth="1.5" />
        <line x1="30" y1="14" x2="30" y2="46" strokeWidth="1.5" />
        <polygon points="30,18 42,30 30,42 18,30" fill="currentColor" fillOpacity="0.2" strokeWidth="1.2" />
        <circle cx="30" cy="30" r="3" fill="#D4AF37" />
      </svg>
    )
  },
  {
    id: 'kuba-shoowa',
    title: 'Kuba Textile Masters',
    nativeName: 'Shoowa Raffia Velvet Guild',
    region: 'Kasai Basin · DR Congo',
    era: '16th Century – Present',
    medium: 'Cut-Pile Embroidered Raffia',
    accentColor: 'from-[#260B08] via-[#07080A] to-[#062319]',
    badgeColor: 'border-red-500 text-red-300 bg-red-950/60',
    sealText: 'SHOOWA LABYRINTH SEAL',
    summary: 'Mathematical marvels of rhythm and asymmetry, hand-embroidered by women using unspun palm fiber conditioned to a plush velvet texture.',
    technique: 'Cut-Pile Needle Embroidery on Palm Leaf Canvas',
    culturalSignificance: 'Sacred heirloom currency presented during royal coronations, investitures, and ancestral burial rites.',
    symbolSvg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor">
        <path d="M12 30 L30 12 L48 30 L30 48 Z" strokeWidth="1.5" />
        <path d="M20 30 L30 20 L40 30 L30 40 Z" strokeWidth="1.2" strokeDasharray="2 2" fill="currentColor" fillOpacity="0.15" />
        <line x1="12" y1="12" x2="48" y2="48" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="48" y1="12" x2="12" y2="48" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
    )
  },
  {
    id: 'yoruba-beads',
    title: 'Yoruba Crown Regalia',
    nativeName: 'Ade Ilèkè Divine Beaders',
    region: 'Ile-Ife & Oyo · Nigeria',
    era: '12th Century – Present',
    medium: 'Micro-Glass Seed Beads & Consecrated Cloth',
    accentColor: 'from-[#062319] via-[#07080A] to-[#261502]',
    badgeColor: 'border-amber-400 text-amber-300 bg-amber-950/60',
    sealText: 'SACRED ODUDUWA SEAL',
    summary: 'Conical crowns with veiled bead tassels worn by Obas to embody the divine authority of Oduduwa while shielding subjects from the spiritual gaze of the king.',
    technique: 'Sacred Needle Threading with Consecrated Talismans',
    culturalSignificance: 'The apex of Yoruba sacred sovereignty, linking the earthly monarch with the primordial Orisha pantheon.',
    symbolSvg: (
      <svg viewBox="0 0 60 60" className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor">
        <path d="M18 44 L22 18 L30 12 L38 18 L42 44 Z" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="22" y1="28" x2="38" y2="28" strokeWidth="1.2" />
        <line x1="20" y1="36" x2="40" y2="36" strokeWidth="1.2" />
        <circle cx="30" cy="20" r="3" fill="#8B0000" />
        <line x1="22" y1="44" x2="22" y2="52" strokeWidth="1" strokeDasharray="1 2" />
        <line x1="30" y1="44" x2="30" y2="54" strokeWidth="1" strokeDasharray="1 2" />
        <line x1="38" y1="44" x2="38" y2="52" strokeWidth="1" strokeDasharray="1 2" />
      </svg>
    )
  }
];

export default function TraditionalHeritageShowcase() {
  const [activeTab, setActiveTab] = useState(HERITAGE_PILLARS[0].id);

  const currentPillar = HERITAGE_PILLARS.find(p => p.id === activeTab) || HERITAGE_PILLARS[0];

  return (
    <section className="relative my-10 overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(6,35,25,0.4)] bg-[#07080A]" suppressHydrationWarning>
      {/* ── BACKGROUND TRADITIONAL GEOMETRIC WATERMARK ── */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heritage-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M0 40 L40 0 L80 40 L40 80 Z" stroke="#D4AF37" strokeWidth="1" fill="none" />
              <circle cx="40" cy="40" r="14" stroke="#D4AF37" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heritage-pattern)" />
        </svg>
      </div>

      {/* ── TOP LUXURY BORDER TRIM (Traditional Kente Colors) ── */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#062319] via-[#D4AF37] to-[#8B0000]" />

      {/* ── HEADER CONTAINER ── */}
      <div className="p-6 sm:p-8 pb-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#D4AF37]/25 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#062319] text-[#D4AF37] border border-[#D4AF37]/40 shadow-inner">
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                IMPERIAL PROVENANCE & ANCIENT GUILDS
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400/80">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED HISTORICAL LINEAGE
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide">
              The Royal Pillars of African Craftsmanship
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/70 max-w-2xl font-sans leading-relaxed">
              Before modern galleries, African master artisans were organized into sovereign guilds under royal courts. Artellium Africa anchors every contemporary work to this eternal ancestral continuum.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/catalog"
              prefetch={false}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#062319] to-[#0A3323] hover:from-[#0F3D2E] hover:to-[#062319] border border-[#D4AF37]/60 text-xs font-semibold text-[#D4AF37] transition shadow-lg group cursor-pointer"
            >
              <span>Explore Provenance Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── INTERACTIVE GUILD PILLAR PILLS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-6">
          {HERITAGE_PILLARS.map((pillar) => {
            const isActive = activeTab === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={`text-left p-3 sm:p-4 rounded-xl transition-all duration-300 relative border flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-br from-[#062319] to-[#07080A] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.25)] scale-[1.02]'
                    : 'bg-black/50 border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#062319]/20'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-1 right-3 px-2 py-0.5 rounded-full bg-[#D4AF37] text-black font-mono text-[9px] font-bold uppercase tracking-wider">
                    ACTIVE
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-black/60 border border-white/10 shrink-0">
                    {pillar.symbolSvg}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 block tracking-wider uppercase">
                      {pillar.region.split('·')[0]}
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-white line-clamp-1">
                      {pillar.title}
                    </h3>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-amber-200/60 font-sans">
                  <span>{pillar.era.split('·')[0]}</span>
                  <span className="text-[#D4AF37] font-semibold">{pillar.medium.split('&')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── EXPANDED DEEP-DIVE SPOTLIGHT VAULT ── */}
      <div className="p-6 sm:p-8 pt-2 relative z-10">
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-[#062319]/80 via-[#07080A]/95 to-[#0A261A]/80 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Subtle gold radial glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            {/* Left: Traditional Narrative & Metadata */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${currentPillar.badgeColor}`}>
                  {currentPillar.nativeName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/60 text-slate-300 border border-white/10">
                  {currentPillar.era}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#062319] text-emerald-300 border border-emerald-500/30">
                  {currentPillar.region}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {currentPillar.title}
                </h3>
                <p className="text-sm font-sans text-amber-200/90 leading-relaxed mt-2">
                  {currentPillar.summary}
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-black/50 border border-[#D4AF37]/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]">
                    <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Traditional Technique</span>
                  </div>
                  <p className="text-xs text-white font-medium">
                    {currentPillar.technique}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/50 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sovereign Role</span>
                  </div>
                  <p className="text-xs text-white font-medium">
                    {currentPillar.culturalSignificance}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Traditional Archival Authenticity Seal Stamp */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-center space-y-3 relative overflow-hidden group">
              <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-gradient-to-br from-[#062319] to-[#07080A] shadow-[0_0_30px_rgba(212,175,55,0.3)] relative">
                {currentPillar.symbolSvg}
                <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/40 animate-spin-slow" />
              </div>

              <div>
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-emerald-400 block font-bold">
                  ARTELLIUM HERITAGE REGISTRY
                </span>
                <p className="font-serif text-sm font-bold text-white mt-0.5">
                  {currentPillar.sealText}
                </p>
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#D4AF37] mt-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>IMMUTABLE ARCHIVAL LEDGER</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 max-w-xs font-sans">
                Each masterpiece registered under this lineage receives a cryptographically signed physical & digital certificate of royal authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM KENTE BORDER TRIM ── */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#8B0000] via-[#D4AF37] to-[#062319]" />
    </section>
  );
}
