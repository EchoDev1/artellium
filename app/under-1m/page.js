'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Tag, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  ShoppingBag, 
  Check, 
  Filter, 
  DollarSign 
} from 'lucide-react';

export default function Under1MPage() {
  const { artworks, addToCart, currency } = useStore();
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(1000000);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartSuccess, setCartSuccess] = useState(null);

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Fine art pieces strictly under ₦1,000,000
  const fallbackUnder1M = [
    {
      id: 'art-110',
      title: 'Ancestral Geometry',
      artistName: 'Chidi Nwosu',
      category: 'Painters',
      medium: 'Mixed Media & Natural Riverbed Pigments',
      dimensions: '80 × 60 cm',
      price: 465000, // ₦465K
      country: 'Nigeria 🇳🇬',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
      description: 'Intricate Uli-inspired geometric expressions utilizing organic riverbed minerals on stretched linen.'
    },
    {
      id: 'art-103',
      title: 'Echoes of the Serengeti',
      artistName: 'Tariq Ndebele',
      category: 'Painters',
      medium: 'Soil Pigment & Ash on Raw Canvas',
      dimensions: '120 × 90 cm',
      price: 950000, // ₦950K
      country: 'South Africa 🇿🇦',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
      description: 'Rich earth pigments harvested from Kwazulu-Natal rendered into sweeping savannah landscapes.'
    },
    {
      id: 'art-118',
      title: 'Lagos Island Rhythm No. 4',
      artistName: 'Adeola Adeleke',
      category: 'Painters',
      medium: 'Oil on Canvas',
      dimensions: '75 × 75 cm',
      price: 680000, // ₦680K
      country: 'Nigeria 🇳🇬',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
      description: 'Dynamic urban color palette celebrating the hustle and expressive energy of Lagos market squares.'
    },
    {
      id: 'art-119',
      title: 'Kigali Dawn Silhouette',
      artistName: 'Jean-Luc Habimana',
      category: 'Photographers',
      medium: 'Fine Art Archival Print',
      dimensions: '60 × 40 cm',
      price: 285000, // ₦285K
      country: 'Rwanda 🇷🇼',
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=1000',
      description: 'Atmospheric early morning mist rising over the hills of Kigali, hand-printed on museum cotton rag.'
    },
    {
      id: 'art-120',
      title: 'Terracotta Harvest Urn',
      artistName: 'Musa Tanko',
      category: 'Sculpture Makers',
      medium: 'Kiln-Fired Clay & Indigo Glaze',
      dimensions: '45 × 30 × 30 cm',
      price: 520000, // ₦520K
      country: 'Nigeria 🇳🇬',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1000',
      description: 'Functional high-fire stoneware inspired by ancient Nok ceramic traditions with natural indigo tint.'
    },
    {
      id: 'art-121',
      title: 'Adire Imperial Tapestry Study',
      artistName: 'Folashade Alabi',
      category: 'Textile Artists',
      medium: 'Hand-Dyed Indigo Organic Cotton',
      dimensions: '140 × 90 cm',
      price: 340000, // ₦340K
      country: 'Nigeria 🇳🇬',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
      description: 'Traditional resist-dyed textile artwork bearing ancestral Yoruba proverbs and botanical motifs.'
    }
  ];

  const catalogUnder1M = artworks.filter(a => (a.price || 0) <= 1000000 && a.status !== 'sold');
  const under1MArtworks = catalogUnder1M.length > 0 ? catalogUnder1M : fallbackUnder1M;

  const filteredItems = under1MArtworks.filter(art => {
    const matchesPrice = (art.price || 0) <= selectedMaxPrice;
    const matchesCat = selectedCategory === 'All' || (art.category || '').toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesPrice && matchesCat;
  });

  const handleAddToCart = (art) => {
    if (addToCart) {
      addToCart(art);
    }
    setCartSuccess(art.title);
    setTimeout(() => setCartSuccess(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-slate-100 pb-20">
      {/* Toast Notification */}
      {cartSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-[#161B26] border-2 border-art-gold text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-art-gold text-art-black flex items-center justify-center font-bold">✓</div>
          <div>
            <p className="text-xs font-bold text-art-gold font-mono uppercase">Added to Collection Cart</p>
            <p className="text-sm font-serif font-semibold">{cartSuccess}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#1C1404] via-[#0E0B02] to-[#07080A] border-b border-art-gold/30 pt-12 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-art-gold/15 border border-art-gold/40 text-art-gold text-xs font-mono font-bold tracking-widest uppercase">
                <Tag className="w-4 h-4 text-art-gold" />
                <span>ACCESSIBLE MASTERWORKS CATALOGUE</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
                Under ₦1,000,000 Fine Art Deals
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                Exceptional original African paintings, fine art photography, textiles, and ceramics priced under ₦1 Million. The perfect entry point for new art patrons and seasoned collectors alike.
              </p>
            </div>

            {/* Price Filter Pills */}
            <div className="flex items-center gap-2 bg-black/60 border border-art-gold/30 rounded-2xl p-2 shrink-0">
              {[
                { label: 'Under ₦350k', value: 350000 },
                { label: 'Under ₦700k', value: 700000 },
                { label: 'Under ₦1M (All)', value: 1000000 }
              ].map(tier => (
                <button
                  key={tier.value}
                  onClick={() => setSelectedMaxPrice(tier.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    selectedMaxPrice === tier.value
                      ? 'bg-art-gold text-art-black shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-4 border-t border-white/10 text-xs scrollbar-none">
            {['All', 'Painters', 'Sculpture Makers', 'Photographers', 'Textile Artists'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl font-medium tracking-wide transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white/20 text-white font-bold border border-white/40'
                    : 'bg-[#141722] text-slate-300 hover:bg-[#1C2230] border border-white/10'
                }`}
              >
                {cat === 'All' ? 'All Mediums' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Artworks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((art) => (
            <div
              key={art.id}
              className="group relative rounded-3xl overflow-hidden bg-[#0D1017] border border-white/10 hover:border-art-gold/60 transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1.5"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-transparent to-black/30 pointer-events-none" />

                {/* Country Tag */}
                <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-slate-300 font-sans text-[10px] font-bold border border-white/15">
                  {art.country}
                </div>

                {/* Affordable Guarantee Tag */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full bg-art-gold/90 text-art-black font-mono font-black text-[9px] shadow-sm">
                  100% Provenance
                </div>
              </div>

              {/* Artwork Details */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-sans font-semibold text-art-gold uppercase tracking-wider block">
                    {art.artistName}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-art-gold transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                    {art.medium} · {art.dimensions}
                  </p>
                </div>

                {/* Price & Action Button */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase block">Affordable Fine Art Price</span>
                      <span className="font-serif text-xl sm:text-2xl font-black text-art-gold">
                        {formatPrice(art.price)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/artwork/${art.id}`}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs flex items-center justify-center gap-1 border border-white/10 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>

                    <button
                      onClick={() => handleAddToCart(art)}
                      className="py-2.5 px-3 rounded-xl bg-art-gold hover:bg-[#E5BE38] text-art-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
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
