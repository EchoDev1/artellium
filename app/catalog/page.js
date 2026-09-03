'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  ShieldCheck, 
  BookOpen, 
  Landmark, 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Compass, 
  Scroll, 
  Sparkles, 
  Layers, 
  Award,
  Search,
  Filter,
  Info,
  CheckCircle2
} from 'lucide-react';

const HISTORICAL_EPOCHS = [
  {
    id: 'nok',
    era: 'c. 1500 BCE – 500 CE',
    title: 'The Nok Civilization',
    nativeTitle: 'Ham & Jos Plateau Ancestral Iron Masters',
    region: 'Central Nigeria (Benue-Plateau)',
    material: 'High-Fired Terracotta & Smelted Iron',
    colorTheme: 'from-[#2A1708] via-[#07080A] to-[#062319]',
    borderTheme: 'border-amber-600/40',
    tag: 'Oldest Figurative Art South of the Sahara',
    significance: 'Sub-Saharan Africa’s earliest known monumental terracotta sculptures and master iron-smelting centers.',
    narrative: `Discovered in 1928 during tin mining operations near the village of Nok, these extraordinary clay sculptures shattered colonial misconceptions regarding ancient African technology and artistry. The Nok masters possessed sophisticated pyrotechnic knowledge, operating advanced blast furnaces for smelting iron while simultaneously firing hollow terracotta figures with intricate triangular perforated eyes, elaborate hair braids, and sovereign beaded pectorals.`,
    curatorialNotes: [
      'Slip-coated hollow earthenware fired in open kilns exceeding 800°C',
      'Pierced pupils and ears allowed air and heat decompression during rapid firing',
      'Depicts seated sovereigns, spiritual elders, and legal magistrates holding ancestral batons'
    ],
    symbols: 'Triangular eyes · Beaded torques · Royal coiffures'
  },
  {
    id: 'ife',
    era: 'c. 11th – 15th Century CE',
    title: 'The Kingdom of Ifẹ',
    nativeTitle: 'Ilé-Ifẹ̀ · The Cradle of Yoruba Sovereign Art',
    region: 'Southwestern Nigeria',
    material: 'Pure Copper, Leaded Brass & Terracotta',
    colorTheme: 'from-[#062319] via-[#07080A] to-[#261502]',
    borderTheme: 'border-[#D4AF37]/50',
    tag: 'Apex of Classical African Naturalism',
    significance: 'Unrivaled naturalistic portrait bronze metallurgy that amazed global historians with its supreme anatomical fidelity.',
    narrative: `In the sacred spiritual center of the Yoruba world, master metallurgists achieved a standard of lost-wax casting in nearly pure copper—a feat chemically and technologically difficult even for Renaissance European foundries. The serene crowned heads of the Ooni (kings) feature delicate striations representing royal lineage scarification, adorned with intricate multi-tiered diadems and beaded veils that signified the divine incarnation of Oduduwa.`,
    curatorialNotes: [
      'Cast with copper alloys reaching up to 98% purity using wax-investment techniques',
      'Facial grooves (are) channeled light across the royal countenance during court ceremonies',
      'Small neck holes indicate heads were once attached to wooden mannequins during funeral investitures'
    ],
    symbols: 'Striated scarification · Conical diadems · Divine Ooni peace'
  },
  {
    id: 'benin',
    era: '13th – 19th Century CE',
    title: 'The Royal Court of Benin',
    nativeTitle: 'Igun Eronmwon · Guild of Sovereign Bronze Casters',
    region: 'Edo Kingdom · Southern Nigeria',
    material: 'Cast Bronze, Brass & Carved Elephant Ivory',
    colorTheme: 'from-[#07080A] via-[#1A1202] to-[#062319]',
    borderTheme: 'border-[#D4AF37]',
    tag: 'State Archival Bronze Chronicles',
    significance: 'The royal court plaques and commemorative Queen Mother (Iyoba) heads served as the official constitutional ledger of the empire.',
    narrative: `Established under Oba Oguola in the 13th century, the Igun Eronmwon were an exclusive, hereditary guild of sculptors sworn under sacred covenant to the Oba of Benin. Occupying their own quarter in ancient Benin City, they forged hundreds of monumental brass plaques that clad the wooden pillars of the imperial palace. These reliefs documented diplomatic encounters, coronation decrees, astronomical alignments, and military victories—forming an indestructible metallurgical archive.`,
    curatorialNotes: [
      'High-relief lost-wax plaques up to 60cm in height, hammered and chased with exquisite micro-stippling',
      'The sacred Queen Mother Idia pendant masks immortalized maternal political diplomacy',
      'Systematic looting during the British Punitive Expedition of 1897 scattered these state archives into foreign museums, sparking today’s global restitution movement'
    ],
    symbols: 'Coral bead regalia · Royal leopards · Mudfish river spirits'
  },
  {
    id: 'asante',
    era: '17th – 20th Century CE',
    title: 'The Asante Empire & Akan Gold Culture',
    nativeTitle: 'Asantehene Ateliers · Golden Stool Guardians',
    region: 'Kumasi · Central Ghana',
    material: 'Cast Gold, Brass Kuduo & Strip-Woven Kente',
    colorTheme: 'from-[#062319] via-[#0A3323] to-[#120803]',
    borderTheme: 'border-emerald-400/50',
    tag: 'Sacred Gold Metallurgy & Textile Cosmograms',
    significance: 'Spiritual goldweight accounting systems and royal narrow-band silk cloths conveying deep philosophical proverbs.',
    narrative: `Under Osei Tutu I and high priest Okomfo Anokye in 1701, the Golden Stool (Sika Dwa Kofi) descended as the soul of the Asante nation. Akan artistry fused complex philosophy with everyday utility: geometric brass goldweights (mrammou) preserved mathematical proverbs; cast bronze Kuduo vessels housed the kra (soul) of aristocrats; and hand-loomed Kente cloth encoded historical treatises into vibrant silk and cotton warp sequences.`,
    curatorialNotes: [
      'Over 3 million distinct Akan goldweight designs existed, depicting animals, proverbs, and abstract cosmological formulas',
      'Kuduo vessels were buried with sovereigns to nurture their spiritual journey in the ancestral world',
      'Royal Kente patterns like "Adwini Asa" (All Motifs Are Exhausted) were woven exclusively for the Asantehene'
    ],
    symbols: 'Sika Dwa Kofi · Gye Nyame · Akan proverb goldweights'
  },
  {
    id: 'djenne',
    era: '12th – 15th Century CE',
    title: 'Inland Niger Delta & Djenné',
    nativeTitle: 'Ancient Mali Empire · Sahelian Clay Dynasties',
    region: 'Mopti Region · Mali',
    material: 'Terracotta, Cast Brass & Adobe Architecture',
    colorTheme: 'from-[#241306] via-[#07080A] to-[#0A261A]',
    borderTheme: 'border-amber-500/40',
    tag: 'Sahelian Spiritual Clay Sculptures',
    significance: 'Dynamic kneeling, equestrian, and entwined terracotta figures documenting trans-Saharan intellectual and artistic vibrancy.',
    narrative: `Long before trans-Saharan Islamic caravans reshaped the medieval Sahel, the ancient urban centers of Djenné-Djenno flourished along the floodplains of the Niger River. Their artists created terracotta figures in expressive gestures of supplication, mourning, and warrior triumph. Adorned with body amulets, serpent talismans, and pustule scarifications that signified ritual inoculation against disease, these works reflect profound medical and spiritual traditions.`,
    curatorialNotes: [
      'Sculpted from local alluvial clay and polished with hematite red iron-rich slips',
      'Equestrian figures illustrate early West African cavalry tacticians and royal guard prestige',
      'Coincided with the trans-Saharan wealth of Mansa Musa and the Great Mosque adobe architecture'
    ],
    symbols: 'Entwined serpents · Alluvial slip · Kneeling supplicants'
  },
  {
    id: 'dogon',
    era: '14th Century – Present',
    title: 'The Dogon & Bandiagara Escarpment',
    nativeTitle: 'Awa Mask Society & Ogotemmêli Cosmologists',
    region: 'Bandiagara Escarpment · Mali',
    material: 'Carved Iroko Hardwood, Pigments & Fibers',
    colorTheme: 'from-[#07080A] via-[#062319] to-[#1F1705]',
    borderTheme: 'border-[#D4AF37]/40',
    tag: 'Sacred Astronomy & Architectural Woodcraft',
    significance: 'Complex primordial cosmological sculptures and towering Kanaga masks connecting earth with the Sirius star system.',
    narrative: `Perched upon the sheer sandstone cliffs of Bandiagara, Dogon woodcarvers hold a profound metaphysical tradition preserved through the Awa society. Their sculptures—characterized by geometric human figures with raised arms invoking rain (Nommo ancestors) and towering Kanaga and Sirige masks—are not decorative objects, but energetic conduits balancing spiritual vibrations between Amma the creator, the stars, and the earth.`,
    curatorialNotes: [
      'Carved from consecrated trees following ancestral libations and wood-curing rituals',
      'The double-cross motif of the Kanaga mask traces the creative movement of the supreme deity across the cosmos',
      'Sanctuary granary doors feature high-relief rows of ancestral guardian figures protecting sacred seed grain'
    ],
    symbols: 'Kanaga cross · Nommo rain posture · Granary door relief'
  }
];

export default function ProvenanceCatalogHistoryPage() {
  const [selectedEpoch, setSelectedEpoch] = useState(HISTORICAL_EPOCHS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEpochs = HISTORICAL_EPOCHS.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.era.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeEpochData = HISTORICAL_EPOCHS.find(e => e.id === selectedEpoch) || HISTORICAL_EPOCHS[0];

  return (
    <div className="min-h-screen bg-[#07080A] text-slate-100 selection:bg-[#D4AF37] selection:text-black" suppressHydrationWarning>
      
      {/* ── TOP HISTORICAL NOTICE BANNER (EXPLICIT USER INSTRUCTION) ── */}
      <div className="bg-gradient-to-r from-[#062319] via-[#0F3D2E] to-[#062319] border-b-2 border-[#D4AF37]/50 py-3 px-4 sticky top-0 z-50 backdrop-blur-md shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#D4AF37] text-black font-mono text-[9px] font-black uppercase tracking-widest">
              OFFICIAL ARCHIVAL NOTICE
            </span>
            <p className="text-xs sm:text-sm font-serif font-bold text-[#D4AF37] tracking-wider" suppressHydrationWarning>
              Here is not a trade zone but a historical page
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-emerald-200/90 font-mono hidden md:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Non-Commercial Educational & Curatorial Ledger
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-mono text-[#D4AF37] hover:text-white transition underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Marketplace</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── HERO HEADER CONTAINER ── */}
      <header className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 overflow-hidden">
        {/* Background Traditional Geometry Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="kente-mesh" width="60" height="60" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="30" height="30" fill="#D4AF37" fillOpacity="0.1" />
                <rect x="30" y="30" width="30" height="30" fill="#062319" fillOpacity="0.2" />
                <path d="M0 30 L30 0 L60 30 L30 60 Z" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#kente-mesh)" />
          </svg>
        </div>

        {/* Ambient Dark Green & Red Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#062319] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-950/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#062319] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono uppercase tracking-[0.25em]">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            WEST AFRICAN ART HISTORICAL CHRONICLES
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight" suppressHydrationWarning>
            Here is Not a Trade Zone, <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-amber-200 to-[#D4AF37] bg-clip-text text-transparent">
              But an Immutable Historical Page
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-amber-100/80 font-sans leading-relaxed">
            The sovereign history of West African fine art spans over 3,500 years of revolutionary metallurgy, sacred geometry, courtly protocol, and philosophical cosmograms. This sanctuary serves as an educational provenance repository honoring ancestral master artisans whose work predated and enriched world art history.
          </p>

          {/* Quick Stats Badges */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4 text-xs font-mono">
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-amber-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>Epoch: 1500 BCE to Contemporary Era</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>Sovereign Guilds & Dynasties Documented</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-black/60 border border-red-500/30 text-red-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>Non-Commercial Cultural Patrimony</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT: EPOCH EXPLORER & TIMELINE ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c120f] border border-[#D4AF37]/30 shadow-xl">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search civilizations, materials, dynasties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/80 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition font-sans"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>Showing {filteredEpochs.length} Historical Art Civilizations</span>
          </div>
        </div>

        {/* Civilizations Grid Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEpochs.map((epoch) => {
            const isSelected = selectedEpoch === epoch.id;
            return (
              <div
                key={epoch.id}
                onClick={() => setSelectedEpoch(epoch.id)}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 border flex flex-col justify-between relative overflow-hidden ${
                  isSelected 
                    ? 'bg-gradient-to-br from-[#062319] via-[#07080A] to-[#0c1a14] border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.25)] scale-[1.01]' 
                    : 'bg-black/50 border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#062319]/20'
                }`}
              >
                {/* Active Indicator Seal */}
                {isSelected && (
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-mono font-bold uppercase tracking-wider">
                    EXAMINING
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{epoch.era}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-serif tracking-widest text-[#D4AF37] uppercase block">
                      {epoch.nativeTitle}
                    </span>
                    <h2 className="font-serif text-xl font-bold text-white mt-0.5">
                      {epoch.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{epoch.region}</span>
                  </div>

                  <p className="text-xs text-amber-100/70 line-clamp-3 leading-relaxed font-sans">
                    {epoch.significance}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-[#D4AF37] font-semibold">{epoch.material.split('&')[0]}</span>
                  <span className="text-emerald-400 underline">Read Archive →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SPOTLIGHT HISTORICAL DOSSIER CARD ── */}
        <section className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#062319] via-[#07080A] to-[#0A261A] border-2 border-[#D4AF37]/60 shadow-[0_25px_60px_rgba(6,35,25,0.5)] relative overflow-hidden">
          {/* Subtle gold watermark decoration */}
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-8 relative z-10">
            {/* Header of Dossier */}
            <div className="border-b border-[#D4AF37]/30 pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#D4AF37] text-black">
                    ARCHIVAL FOLIO · {activeEpochData.era}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/60 text-emerald-400 border border-emerald-500/30">
                    {activeEpochData.region}
                  </span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
                  {activeEpochData.title}
                </h3>
                <p className="text-sm font-mono text-[#D4AF37]">
                  Sacred Native Name: {activeEpochData.nativeTitle}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-[#D4AF37]/30 text-center shrink-0">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  PRIMARY MEDIUM & DISCIPLINE
                </span>
                <span className="font-serif text-sm font-bold text-[#D4AF37] mt-1 block">
                  {activeEpochData.material}
                </span>
              </div>
            </div>

            {/* In-Depth Historical Narrative */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                    <span>The Historical & Artistic Treatise</span>
                  </h4>
                  <p className="text-sm sm:text-base font-sans text-amber-100/90 leading-relaxed text-justify">
                    {activeEpochData.narrative}
                  </p>
                </div>

                {/* Curatorial & Provenance Bullet Points */}
                <div className="p-5 rounded-2xl bg-black/50 border border-emerald-500/20 space-y-3">
                  <h5 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Curatorial & Metallurgical Discoveries</span>
                  </h5>
                  <ul className="space-y-2 text-xs font-sans text-slate-300">
                    {activeEpochData.curatorialNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar: Cultural Emblems & Preservation Declaration */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-2xl bg-black/60 border border-[#D4AF37]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Iconographic Emblems</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {activeEpochData.symbols}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/40 via-black to-[#062319] border border-red-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-400">
                    <Info className="w-4 h-4 text-red-400" />
                    <span>Historical Archive Status</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    This folio documents irreplaceable historical masterworks held in sacred ancestral sanctuaries or world museums. They are not commercial items for purchase. Artellium Africa maintains this page to anchor our contemporary marketplace to sovereign cultural roots.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── FOOTER CALLOUT: PROVENANCE PRESERVATION STATEMENT ── */}
        <div className="p-8 rounded-3xl bg-[#062319]/50 border border-[#D4AF37]/40 text-center space-y-4 max-w-4xl mx-auto">
          <h3 className="font-serif text-2xl font-bold text-white">
            Honoring West Africa’s Eternal Artistic Legacy
          </h3>
          <p className="text-xs sm:text-sm text-amber-100/80 font-sans max-w-2xl mx-auto leading-relaxed">
            Every contemporary painting, bronze sculpture, and digital creation listed on Artellium Africa follows in the footsteps of the Nok, Ifẹ, Benin, and Asante masters. We pledge to preserve their provenance with immutable dignity.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider hover:brightness-110 transition shadow-lg"
            >
              <span>Return to Contemporary Gallery</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>

      </main>

    </div>
  );
}
