'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { isCategoryMatch } from '@/lib/category-utils';
import ArtworkCard from '@/components/ArtworkCard';
import { 
  Palette, 
  Box, 
  PenTool, 
  Camera, 
  Scissors, 
  TreePine, 
  Hammer, 
  Crown, 
  Bookmark, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ArrowLeft,
  Flame,
  Award,
  TrendingUp,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_MAP = {
  'paintings': {
    title: 'Paintings',
    subtitle: 'Master canvas works rendered with archival oil pigments, 24k gold leaf, watercolors, and rich acrylics across the African continent.',
    storeCategory: 'Paintings',
    icon: Palette,
    accent: 'from-amber-700 via-amber-600 to-amber-900',
    featuredMediums: ['Oil on Canvas', 'Acrylic on Canvas', 'Gold Leaf & Pigment', 'Watercolor', 'Impasto Fine Art'],
    curatorNote: 'Curated paintings from renowned studios in Lagos, Accra, and Dakar featuring heritage narratives and contemporary realism.'
  },
  'painters': {
    title: 'Paintings',
    subtitle: 'Master canvas works rendered with archival oil pigments, 24k gold leaf, watercolors, and rich acrylics across the African continent.',
    storeCategory: 'Paintings',
    icon: Palette,
    accent: 'from-amber-700 via-amber-600 to-amber-900',
    featuredMediums: ['Oil on Canvas', 'Acrylic on Canvas', 'Gold Leaf & Pigment', 'Watercolor', 'Impasto Fine Art'],
    curatorNote: 'Curated paintings from renowned studios in Lagos, Accra, and Dakar featuring heritage narratives and contemporary realism.'
  },
  'sculptures': {
    title: 'Sculptures',
    subtitle: 'Timeless lost-wax Benin bronze castings, carved ancient mahogany, stone sculptures, and terracotta figures.',
    storeCategory: 'Sculptures',
    icon: Box,
    accent: 'from-amber-900 via-yellow-800 to-amber-950',
    featuredMediums: ['Lost-Wax Bronze', 'Carved Ancient Wood', 'Stone Sculpture', 'Polished Terracotta'],
    curatorNote: 'Direct foundry and atelier sculptures honoring centuries of African metallurgical and carving mastery.'
  },
  'sculptors': {
    title: 'Sculptures',
    subtitle: 'Timeless lost-wax Benin bronze castings, carved ancient mahogany, stone sculptures, and terracotta figures.',
    storeCategory: 'Sculptures',
    icon: Box,
    accent: 'from-amber-900 via-yellow-800 to-amber-950',
    featuredMediums: ['Lost-Wax Bronze', 'Carved Ancient Wood', 'Stone Sculpture', 'Polished Terracotta'],
    curatorNote: 'Direct foundry and atelier sculptures honoring centuries of African metallurgical and carving mastery.'
  },
  'drawings': {
    title: 'Drawings',
    subtitle: 'Intricate master sketches, charcoal on heavy archival paper, ink compositions, pastels, and graphite studies.',
    storeCategory: 'Drawings',
    icon: PenTool,
    accent: 'from-slate-800 via-stone-800 to-zinc-950',
    featuredMediums: ['Charcoal on Archival Paper', 'Ink & Quill Drawing', 'Graphite & Pencil', 'Soft Pastels'],
    curatorNote: 'Expressive linework and detailed preparatory drawings capturing raw anatomical elegance and cultural motifs.'
  },
  'photography': {
    title: 'Photography',
    subtitle: 'Fine art photography, cultural documentary archives, and museum-grade contemporary African portraiture.',
    storeCategory: 'Photography',
    icon: Camera,
    accent: 'from-zinc-900 via-neutral-800 to-stone-950',
    featuredMediums: ['Archival Pigment Print', 'Fine Art Silver Gelatin', 'Analog Documentary', 'Contemporary Portrait'],
    curatorNote: 'Luminously printed and numbered photography chronicling African architecture, folklore, and daily life.'
  },
  'textiles': {
    title: 'Textiles',
    subtitle: 'Hand-woven tapestries, Adire indigo dyeing, ceremonial Kente weaves, and multi-layered textural fiber art.',
    storeCategory: 'Textiles',
    icon: Scissors,
    accent: 'from-emerald-950 via-teal-900 to-slate-950',
    featuredMediums: ['Hand-Woven Tapestry', 'Adire Indigo Cotton', 'Ceremonial Kente', 'Batik & Fiber Art'],
    curatorNote: 'Tactile masterpieces celebrating indigenous textile weaving traditions and contemporary fiber artistry.'
  },
  'pottery': {
    title: 'Pottery',
    subtitle: 'Traditional terracotta, hand-coiled clay vessels, ancestral cooking pots, and kiln-fired earthen sculpture.',
    storeCategory: 'Pottery',
    icon: Sparkles,
    accent: 'from-orange-950 via-amber-900 to-stone-950',
    featuredMediums: ['Hand-Coiled Terracotta', 'Natural Earth Clay', 'Burnished Clay Vessels', 'Kiln-Fired Pottery'],
    curatorNote: 'Ancestral ceramic and pottery techniques preserved across generations with natural earthen textures.'
  },
  'ceramics': {
    title: 'Ceramics',
    subtitle: 'Glazed fine art ceramics, contemporary stoneware, decorative vases, and high-fire porcelain artworks.',
    storeCategory: 'Ceramics',
    icon: Sparkles,
    accent: 'from-cyan-950 via-blue-900 to-slate-950',
    featuredMediums: ['Glazed Fine Art Stoneware', 'Raku Fired Ceramic', 'Handmade Porcelain', 'Decorative Clay Platter'],
    curatorNote: 'Modern ceramic artisans blending traditional clay craftsmanship with avant-garde ceramic glazes.'
  },
  'woodworks': {
    title: 'Woodworks',
    subtitle: 'Carved sacred mahogany, ceremonial masks, architectural wall panels, and bespoke wooden fine crafts.',
    storeCategory: 'Woodworks',
    icon: TreePine,
    accent: 'from-amber-950 via-yellow-950 to-stone-950',
    featuredMediums: ['Carved Oyo Mahogany', 'Iroko Hardwood', 'Sacred Mask Carving', 'Relief Wall Panel'],
    curatorNote: 'Master timber sculptors shaping aged hardwoods into resonant ancestral storytelling pieces.'
  },
  'metal-works': {
    title: 'Metal Works',
    subtitle: 'Hand-cast bronze reliefs, forged wrought iron, copper repoussé, and fine brass filigree masterworks.',
    storeCategory: 'Metal works',
    icon: Hammer,
    accent: 'from-yellow-950 via-amber-800 to-stone-950',
    featuredMediums: ['Forged Wrought Iron', 'Copper Repousse', 'Hand-Hammered Brass', 'Cast Bronze Plate'],
    curatorNote: 'Monumental and decorative metal crafting highlighting ancient African iron and brass guilds.'
  },
  'handmade-crafts': {
    title: 'Handmade Crafts',
    subtitle: 'Intricate beadwork, hand-stitched leathercraft, calabash engraving, and curated indigenous artifacts.',
    storeCategory: 'Handmade crafts',
    icon: Scissors,
    accent: 'from-red-950 via-rose-900 to-stone-950',
    featuredMediums: ['Intricate Glass Beadwork', 'Hand-Tooled Leather', 'Engraved Calabash', 'Artisanal Woven Basketry'],
    curatorNote: 'Authentic handmade artisanal treasures embodying regional craftsmanship and community pride.'
  },
  'indigenous-artworks': {
    title: 'Indigenous Artworks',
    subtitle: 'Ancestral heritage artifacts, ritual crowns, folkloric totem pieces, and museum-grade ethnographic treasures.',
    storeCategory: 'Indigenous artworks',
    icon: Crown,
    accent: 'from-art-gold/30 via-amber-950 to-black',
    featuredMediums: ['Ancestral Folklore Art', 'Beaded Crown & Staff', 'Ceremonial Altar Sculpture', 'Sacred Symbol Relic'],
    curatorNote: 'Rare cultural works documented with verified provenance and archival certificates of authenticity.'
  },
  'limited-editions': {
    title: 'Limited Edition Collections',
    subtitle: 'Numbered master prints, certified archival reproductions, and collector portfolios with signed documentation.',
    storeCategory: 'Limited edition collections',
    icon: Bookmark,
    accent: 'from-purple-950 via-indigo-900 to-black',
    featuredMediums: ['Numbered Museum Giclee', 'Signed Lithograph', 'Collector Box Set', 'Certificate Embossed Edition'],
    curatorNote: 'Strictly limited fine art editions created under direct supervision of master artists.'
  }
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params?.slug ? String(params.slug).toLowerCase() : 'paintings';
  
  const categoryConfig = CATEGORY_MAP[rawSlug] || CATEGORY_MAP['paintings'];
  const Icon = categoryConfig.icon;

  const { artworks = [], currency } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('All');
  const [shipsFilter, setShipsFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Filter artworks strictly for this category and user search queries
  const matchingArtworks = useMemo(() => {
    return artworks.filter((art) => {
      const artCat = (art.category || '').toLowerCase();
      const artMed = (art.medium || '').toLowerCase();
      const targetCat = (categoryConfig.storeCategory || '').toLowerCase();

      // Category match
      let matchesCategory = isCategoryMatch(art.category, rawSlug, art.medium, art.title) || 
                            isCategoryMatch(art.category, categoryConfig.storeCategory, art.medium, art.title);

      if (!matchesCategory) return false;

      // Text query match
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesQuery =
          art.title?.toLowerCase().includes(term) ||
          art.artistName?.toLowerCase().includes(term) ||
          art.medium?.toLowerCase().includes(term) ||
          art.country?.toLowerCase().includes(term) ||
          art.city?.toLowerCase().includes(term) ||
          art.description?.toLowerCase().includes(term);
        if (!matchesQuery) return false;
      }

      // Medium filter match
      if (selectedMedium !== 'All') {
        if (!art.medium?.toLowerCase().includes(selectedMedium.toLowerCase())) return false;
      }

      // Shipping filter match
      if (shipsFilter !== 'All') {
        if (!art.shipsTo?.includes(shipsFilter) && !art.shipsTo?.includes('Worldwide')) return false;
      }

      return true;
    });
  }, [artworks, categoryConfig, rawSlug, searchTerm, selectedMedium, shipsFilter]);

  // Sort matching artworks (real artist creations strictly first)
  const sortedArtworks = useMemo(() => {
    return [...matchingArtworks].sort((a, b) => {
      if (sortBy === 'price-low') {
        return (currency === 'USD' ? (a.priceUSD || a.price / 1500) : a.price) - (currency === 'USD' ? (b.priceUSD || b.price / 1500) : b.price);
      }
      if (sortBy === 'price-high') {
        return (currency === 'USD' ? (b.priceUSD || b.price / 1500) : b.price) - (currency === 'USD' ? (a.priceUSD || a.price / 1500) : a.price);
      }
      if (sortBy === 'rating') {
        return (b.rating || 5) - (a.rating || 5);
      }
      if (!a.isDemo && b.isDemo) return -1;
      if (a.isDemo && !b.isDemo) return 1;
      return new Date(b.created_at || '2026-01-01') - new Date(a.created_at || '2026-01-01');
    });
  }, [matchingArtworks, sortBy, currency]);

  // Featured artists in this category
  const categoryArtists = useMemo(() => {
    const map = new Map();
    matchingArtworks.forEach((art) => {
      if (art.artistName && !map.has(art.artistName)) {
        map.set(art.artistName, {
          name: art.artistName,
          avatar: art.artistAvatar,
          country: art.country || 'Africa',
          city: art.city || 'Atelier',
          flag: art.countryFlag || '🌍',
          count: 1
        });
      } else if (art.artistName) {
        map.get(art.artistName).count += 1;
      }
    });
    return Array.from(map.values()).slice(0, 4);
  }, [matchingArtworks]);

  return (
    <main className="min-h-screen bg-[#07080A] text-slate-100 font-sans pb-20">
      
      {/* Category Hero Banner */}
      <div className={`relative overflow-hidden bg-gradient-to-b ${categoryConfig.accent} pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-art-gold/20 shadow-2xl`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-art-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-black/40 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-art-gold hover:text-art-black text-slate-300 text-xs font-semibold border border-white/10 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Services & Art</span>
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-xs text-art-gold font-mono uppercase tracking-wider">Online Art Marketplace</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-black/50 border border-art-gold/40 rounded-2xl text-art-gold shadow-gold-glow">
                  <Icon className="w-8 h-8" />
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
                  {categoryConfig.title}
                </h1>
              </div>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                {categoryConfig.subtitle}
              </p>
            </div>

            <div className="bg-black/50 border border-art-gold/30 p-4 rounded-2xl backdrop-blur-md text-right shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Verified Registry</span>
              <span className="text-xl font-serif font-bold text-art-gold">{matchingArtworks.length} Masterpieces</span>
              <p className="text-[9px] text-emerald-400 font-mono mt-0.5">Direct Master Atelier Settlement</p>
            </div>
          </div>

          {/* Quick Medium Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-xs text-slate-400 font-medium">Curated Techniques:</span>
            {categoryConfig.featuredMediums.map((med) => (
              <button
                key={med}
                onClick={() => setSelectedMedium(selectedMedium === med ? 'All' : med)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  selectedMedium === med
                    ? 'bg-art-gold text-art-black font-bold shadow'
                    : 'bg-black/40 text-slate-300 hover:bg-black/70 border border-white/10'
                }`}
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Category Switcher Bar with all 12 services */}
        <div className="bg-[#0E1118] border border-art-gold/20 rounded-2xl p-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0">
            Departments:
          </span>
          {[
            { label: '🎨 Paintings', slug: 'paintings' },
            { label: '🗿 Sculptures', slug: 'sculptures' },
            { label: '✏️ Drawings', slug: 'drawings' },
            { label: '📷 Photography', slug: 'photography' },
            { label: '🧵 Textiles', slug: 'textiles' },
            { label: '🏺 Pottery', slug: 'pottery' },
            { label: '🍶 Ceramics', slug: 'ceramics' },
            { label: '🪵 Woodworks', slug: 'woodworks' },
            { label: '⚒️ Metal Works', slug: 'metal-works' },
            { label: '🪡 Handmade Crafts', slug: 'handmade-crafts' },
            { label: '👑 Indigenous Artworks', slug: 'indigenous-artworks' },
            { label: '✨ Limited Editions', slug: 'limited-editions' },
          ].map((cat) => {
            const isCurrent = rawSlug === cat.slug || rawSlug.includes(cat.slug.replace('s', ''));
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 ${
                  isCurrent ? 'bg-art-gold text-art-black shadow-gold-glow' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Curatorial Note Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-art-gold/10 via-[#0A0D14] to-[#0A0D14] border border-art-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-art-gold/20 flex items-center justify-center text-art-gold shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-art-gold uppercase tracking-wider block font-bold">
                Curatorial Guarantee
              </span>
              <p className="text-xs text-slate-300 font-serif italic">
                "{categoryConfig.curatorNote}"
              </p>
            </div>
          </div>
          <Link
            href="/policies#provenance"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs shrink-0 border border-white/10 transition"
          >
            Provenance Guarantee →
          </Link>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="p-4 bg-[#0E1118] rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${categoryConfig.title}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-art-gold text-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters & Sorter */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Ships to:</span>
              <select
                value={shipsFilter}
                onChange={(e) => setShipsFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-art-gold cursor-pointer"
              >
                <option value="All">Worldwide / All</option>
                <option value="Africa">Africa</option>
                <option value="Europe">Europe</option>
                <option value="North America">North America</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-art-gold cursor-pointer"
              >
                <option value="newest">Newest Additions</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated (5★)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Master Artists in this Department */}
        {categoryArtists.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <span>Featured Master Artists in {categoryConfig.title}</span>
              </h3>
              <span className="text-xs text-art-gold font-mono">{categoryArtists.length} Accredited</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categoryArtists.map((artist) => (
                <div key={artist.name} className="p-3.5 rounded-2xl bg-[#0E1118] border border-white/10 flex items-center gap-3">
                  <img
                    src={artist.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={artist.name}
                    className="w-12 h-12 rounded-xl object-cover border border-art-gold/40 shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-serif font-bold text-xs text-white truncate">{artist.name}</h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{artist.flag}</span>
                      <span className="truncate">{artist.city}, {artist.country}</span>
                    </p>
                    <span className="text-[9px] text-art-gold font-mono font-bold block mt-1">
                      {artist.count} Masterpiece{artist.count > 1 ? 's' : ''} Listed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Masterpieces Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <span>{categoryConfig.title} Catalog</span>
              <span className="text-xs text-slate-400 font-sans font-normal">
                ({sortedArtworks.length} works found)
              </span>
            </h3>
            {selectedMedium !== 'All' && (
              <button
                onClick={() => setSelectedMedium('All')}
                className="text-xs text-art-gold hover:underline font-bold"
              >
                Clear technique filter ✕
              </button>
            )}
          </div>

          {sortedArtworks.length === 0 ? (
            <div className="p-12 text-center bg-[#0E1118] rounded-3xl border border-white/10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">No Pieces Match Your Search</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try adjusting your search keywords or resetting the medium filter to view all verified {categoryConfig.title} pieces.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMedium('All');
                  setShipsFilter('All');
                }}
                className="px-5 py-2.5 bg-art-gold text-art-black rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
