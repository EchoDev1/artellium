'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { ShoppingBag, Star, ShieldCheck, Eye, Sparkles, CheckCircle, Tag, Heart } from 'lucide-react';
import VerificationBadge from '@/components/VerificationBadge';
import { DEFAULT_FALLBACK_IMAGE } from '@/lib/image-utils';

export default function ArtworkCard({ artwork }) {
  const { addToCart, currency, wishlist, addToWishlist, removeFromWishlist } = useStore();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const isWishlisted = wishlist?.includes(artwork.id);

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden glass-card hover:border-art-gold/60 transition duration-300 transform hover:-translate-y-1.5 shadow-xl flex flex-col justify-between">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-art-black">
        <img
          src={artwork.image || DEFAULT_FALLBACK_IMAGE}
          alt={artwork.title}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-art-black via-transparent to-transparent opacity-80" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {artwork.artistType === 'Premium' && (
            <span className="badge-gold text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-gold-glow">
              <Sparkles className="w-3 h-3 text-art-gold" />
              <span>PREMIUM ARTIST</span>
            </span>
          )}

          {artwork.isNewlyListed && (
            <span className="badge-emerald text-[10px] font-bold px-2 py-0.5 rounded-full">
              NEW LISTING
            </span>
          )}

          {artwork.status === 'sold' && (
            <span className="badge-crimson text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              RECENTLY SOLD
            </span>
          )}

          {artwork.status === 'auction' && (
            <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
              🔥 LIVE AUCTION
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => { e.preventDefault(); isWishlisted ? removeFromWishlist(artwork.id) : addToWishlist(artwork.id); }}
          className="absolute top-3 right-3 p-1.5 bg-art-black/70 hover:bg-art-black text-white rounded-xl backdrop-blur-md transition shadow-lg z-10"
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={() => setQuickViewOpen(true)}
          className="absolute bottom-3 right-3 p-2 bg-art-black/80 hover:bg-art-gold hover:text-art-black text-white rounded-xl backdrop-blur-md transition shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-mono">{artwork.category}</span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3 h-3 fill-current" />
              <span>{artwork.rating || '5.0'}</span>
            </div>
          </div>

          <Link href={`/artwork/${artwork.id}`}>
            <h3 className="font-serif text-base font-bold text-white hover:text-art-gold transition line-clamp-1">
              {artwork.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mt-1 mb-2">
            <img
              src={artwork.artistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={artwork.artistName}
              className="w-5 h-5 rounded-full object-cover border border-art-gold/40"
            />
            <span className="text-xs text-art-gold font-medium truncate">
              {artwork.artistName}
            </span>
          </div>

          {/* Verification Badge */}
          <div className="mb-2">
            <VerificationBadge badge={artwork.verificationBadge} />
          </div>

          <p className="text-[11px] text-slate-400 line-clamp-2 italic mb-2">
            "{artwork.description}"
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Price:</span>
            <span className="font-serif text-base font-bold text-white group-hover:text-art-gold transition">
              {artwork.status === 'sold' ? (
                <span className="text-slate-400 line-through">{formatPrice(artwork.price)}</span>
              ) : (
                formatPrice(artwork.price)
              )}
            </span>
          </div>

          {artwork.status === 'available' && (
            <button
              onClick={() => addToCart(artwork)}
              className="bg-art-gold hover:brightness-110 text-art-black font-bold text-xs px-3 py-2 rounded-xl transition shadow-gold-glow flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}

          {artwork.status === 'auction' && (
            <Link
              href="/auctions"
              className="bg-art-red hover:bg-red-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition shadow-crimson-glow flex items-center gap-1"
            >
              <span>Place Bid</span>
            </Link>
          )}

          {artwork.status === 'sold' && (
            <span className="text-[11px] font-bold text-red-400 bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-800/30">
              Sold ({artwork.soldTo || 'Private Collector'})
            </span>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-art-black-card border border-art-gold/40 rounded-2xl shadow-2xl flex flex-col md:flex-row my-auto max-h-[92vh] overflow-y-auto pb-6 md:pb-0">
            <div className="md:w-1/2 aspect-square md:aspect-auto bg-black overflow-hidden relative shrink-0 min-h-[220px]">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-art-gold font-bold uppercase tracking-wide">
                    {artwork.category}
                  </span>
                  <button
                    onClick={() => setQuickViewOpen(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">{artwork.title}</h3>
                <p className="text-sm text-art-gold font-medium mb-3">By {artwork.artistName}</p>

                <div className="space-y-2 text-xs text-slate-300 mb-4 bg-art-black p-3 rounded-xl border border-white/10">
                  <p><strong>Medium:</strong> {artwork.medium}</p>
                  <p><strong>Dimensions:</strong> {artwork.dimensions}</p>
                  <p><strong>Provenance:</strong> {artwork.provenance}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">{artwork.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block">List Price:</span>
                  <span className="font-serif text-xl font-bold text-art-gold">
                    {formatPrice(artwork.price)}
                  </span>
                </div>

                {artwork.status === 'available' && (
                  <button
                    onClick={() => {
                      addToCart(artwork);
                      setQuickViewOpen(false);
                    }}
                    className="bg-art-gold hover:brightness-110 text-art-black font-bold text-xs px-5 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2 shrink-0"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Collection</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
