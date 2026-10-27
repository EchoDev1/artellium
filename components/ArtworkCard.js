'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { ShoppingBag, Star, ShieldCheck, Eye, Sparkles, CheckCircle, Tag, Heart, Crown } from 'lucide-react';
import VerificationBadge from '@/components/VerificationBadge';
import { DEFAULT_FALLBACK_IMAGE, getCategoryFallback } from '@/lib/image-utils';
import { isPriorityArtist } from '@/lib/priority-utils';

export default function ArtworkCard({ artwork }) {
  const { addToCart, currency, wishlist, addToWishlist, removeFromWishlist, usdExchangeRate = 1480 } = useStore();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const isWishlisted = wishlist?.includes(artwork.id);

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      const rate = (usdExchangeRate && usdExchangeRate > 0) ? usdExchangeRate : 1480;
      return `$${Math.round(amount / rate).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const fallbackImg = getCategoryFallback(artwork.category) || DEFAULT_FALLBACK_IMAGE;

  return (
    <div className="group relative rounded-2xl overflow-hidden glass-card hover:border-art-gold/60 transition duration-300 transform hover:-translate-y-1.5 shadow-xl flex flex-col h-full bg-[#0B0D14]">
      {/* Top Badge Strip (Locked height - NO wrapping, NO overlapping on artwork) */}
      <div className="h-10 px-3 flex items-center justify-between gap-1.5 bg-[#0B0D14] border-b border-white/5 shrink-0 z-10">
        <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
          {!artwork.isDemo && (
            <span className="bg-gradient-to-r from-art-gold to-art-gold-dark text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-gold-glow shrink-0">
              <Sparkles className="w-2.5 h-2.5 text-white" />
              <span>DIRECT ARTIST UPLOAD</span>
            </span>
          )}

          {isPriorityArtist(artwork) ? (
            <span className="bg-gradient-to-r from-amber-500 via-art-gold to-yellow-500 text-black font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_12px_rgba(212,175,55,0.6)] border border-amber-300 shrink-0">
              <Crown className="w-2.5 h-2.5 text-black fill-current" />
              <span>PRIORITY ARTIST</span>
            </span>
          ) : (
            artwork.artistType === 'Premium' && (
              <span className="badge-gold text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-gold-glow shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-art-gold" />
                <span>PREMIUM ARTIST</span>
              </span>
            )
          )}

          {artwork.isNewlyListed && (
            <span className="badge-emerald text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
              NEW LISTING
            </span>
          )}

          {artwork.status === 'sold' && (
            <span className="badge-crimson text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
              SOLD
            </span>
          )}

          {artwork.status === 'auction' && (
            <span className="bg-red-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full animate-pulse shadow-md shrink-0">
              🔥 LIVE AUCTION
            </span>
          )}

          {artwork.status === 'exhibition' && (
            <span className="bg-emerald-700 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-md shrink-0">
              🏛️ EXHIBITION
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); isWishlisted ? removeFromWishlist(artwork.id) : addToWishlist(artwork.id); }}
          className="p-1 hover:bg-white/10 text-white rounded-lg transition shrink-0"
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-white'}`} />
        </button>
      </div>

      {/* Uniform Image Container: Exactly same dimensions on every card */}
      <Link 
        href={`/artwork/${artwork.id}`} 
        className="relative w-full h-64 sm:h-72 overflow-hidden bg-[#07090E] group/img shrink-0 flex items-center justify-center cursor-pointer border-b border-white/5"
      >
        {(artwork.status === 'exhibition' || artwork.isExhibition || artwork.status === 'auction' || artwork.isAuction) ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#06140E] via-[#07090D] to-[#0B1410] flex flex-col items-center justify-center p-6 text-center select-none z-10">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] uppercase text-white/15">
              Coming Soon
            </span>
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-emerald-400/20 mt-2">
              {(artwork.status === 'auction' || artwork.isAuction) ? 'Live Auction Coming Very Soon' : 'Exhibition Coming Very Soon'}
            </span>
          </div>
        ) : (
          <img
            src={artwork.image || fallbackImg}
            alt={artwork.title}
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = fallbackImg;
            }}
            className="relative z-10 w-full h-full object-fill art-card-img contrast-[1.05] saturate-[1.08] brightness-[1.02] group-hover:scale-105 group-hover/img:scale-105 transition-transform duration-500 ease-out"
          />
        )}

        {/* Quick View Button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewOpen(true); }}
          className="absolute bottom-2.5 right-2.5 p-2 bg-art-black/85 hover:bg-art-gold hover:text-art-black text-white rounded-xl backdrop-blur-md transition shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 z-20 cursor-pointer"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Link>

      {/* Streamlined Card Content: Uniform height, no over-size */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5 bg-[#0B0D14]">
        <div className="space-y-1.5">
          {/* Category & Rating Row */}
          <div className="h-4 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono uppercase tracking-wider text-[10px] text-slate-400">{artwork.category}</span>
            <div className="flex items-center gap-1 text-art-gold font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span>{artwork.rating || '5.0'}</span>
            </div>
          </div>

          {/* Masterwork Title */}
          <Link href={`/artwork/${artwork.id}`} className="block h-5 sm:h-6 overflow-hidden">
            <h3 className="font-serif text-sm sm:text-base font-bold text-white hover:text-art-gold transition line-clamp-1 leading-snug">
              {artwork.title}
            </h3>
          </Link>

          {/* Artist & Verification Badge Compact Inline Row */}
          <div className="h-5 flex items-center justify-between gap-2 pt-0.5">
            <Link 
              href={`/artist/${artwork.artistId || encodeURIComponent(artwork.artistName)}`}
              className="flex items-center gap-1.5 group/artist hover:opacity-90 transition min-w-0"
            >
              <img
                src={artwork.artistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={artwork.artistName}
                className="w-4 h-4 rounded-full object-cover border border-art-gold/40 shrink-0"
              />
              <span className="text-xs text-art-gold font-medium truncate group-hover/artist:underline">
                {artwork.artistName}
              </span>
            </Link>

            <div className="shrink-0">
              <VerificationBadge badge={artwork.verificationBadge} />
            </div>
          </div>
        </div>

        {/* Price & Action Row (Locked height for uniform card bottoms) */}
        <div className="pt-2.5 border-t border-white/10 h-11 flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] text-slate-400 block uppercase font-mono font-medium leading-none mb-0.5">Price</span>
            <span className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-art-gold transition">
              {artwork.status === 'sold' ? (
                <span className="text-slate-400 line-through">{formatPrice(artwork.price)}</span>
              ) : (
                formatPrice(artwork.price)
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {artwork.status === 'available' && (
              <button
                onClick={() => addToCart(artwork)}
                className="h-8 sm:h-8.5 bg-art-gold hover:brightness-110 text-white font-bold text-[11px] sm:text-xs px-3 rounded-xl transition shadow-gold-glow flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            )}

            {artwork.status === 'auction' && (
              <Link
                href="/auctions"
                className="h-8 sm:h-8.5 bg-art-red hover:bg-red-700 text-white font-bold text-[11px] sm:text-xs px-3 rounded-xl transition shadow-crimson-glow flex items-center gap-1 shrink-0"
              >
                <span>Place Bid</span>
              </Link>
            )}

            {artwork.status === 'sold' && (
              <span className="h-8 sm:h-8.5 inline-flex items-center text-[10px] font-bold text-red-400 bg-red-950/40 px-2.5 rounded-lg border border-red-800/30 shrink-0">
                Sold
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-art-black-card border border-art-gold/40 rounded-2xl shadow-2xl flex flex-col md:flex-row my-auto max-h-[92vh] overflow-y-auto pb-6 md:pb-0">
            <div className="md:w-1/2 min-h-[320px] md:min-h-[440px] bg-[#07090D] overflow-hidden relative shrink-0 flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-125 pointer-events-none"
                style={{ backgroundImage: `url(${artwork.image || fallbackImg})` }}
              />
              <img
                src={artwork.image || fallbackImg}
                alt={artwork.title}
                onError={(e) => { e.currentTarget.src = fallbackImg; }}
                className="relative z-10 max-h-full max-w-full object-contain rounded-xl shadow-2xl"
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
                    className="bg-art-gold hover:brightness-110 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-gold-glow flex items-center gap-2 shrink-0"
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
