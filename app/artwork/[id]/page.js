'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { CUSTOMER_REVIEWS } from '@/lib/mock-data';
import { 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  User, 
  MessageSquare, 
  CheckCircle, 
  ArrowLeft,
  Heart,
  Send,
  MessageCircle,
  Globe,
  DollarSign,
  Info
} from 'lucide-react';
import Link from 'next/link';
import OriginMapPin from '@/components/OriginMapPin';
import VerificationBadge from '@/components/VerificationBadge';

export default function ArtworkDetailPage() {
  const { id } = useParams();
  const { 
    artworks, 
    addToCart, 
    currency, 
    currentUser, 
    makeBuyoutOffer,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    artworkQuestions = [],
    askQuestion,
    submitCollectorOffer
  } = useStore();

  const artwork = artworks.find((item) => item.id === id) || artworks[0];
  const isWishlisted = wishlist?.includes(artwork.id);

  const [reviews, setReviews] = useState(
    CUSTOMER_REVIEWS.filter((r) => r.artworkId === artwork.id) || CUSTOMER_REVIEWS
  );

  const [newReviewForm, setNewReviewForm] = useState({
    rating: 5,
    comment: '',
    location: 'Lagos, Nigeria',
  });

  const [offerPrice, setOfferPrice] = useState('');
  const [offerNote, setOfferNote] = useState('');
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [qaSubmitted, setQaSubmitted] = useState(false);

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewForm.comment) return;

    const createdReview = {
      id: `rev-${Date.now()}`,
      artworkId: artwork.id,
      userName: currentUser?.name || 'Verified Collector',
      location: newReviewForm.location,
      rating: newReviewForm.rating,
      date: 'Just now',
      comment: newReviewForm.comment,
    };

    setReviews([createdReview, ...reviews]);
    setNewReviewForm({ rating: 5, comment: '', location: 'Lagos, Nigeria' });
  };

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    if (!offerPrice) return;
    submitCollectorOffer(artwork.id, artwork.title, offerPrice, offerNote, currentUser?.name || 'Verified Collector');
    setOfferSubmitted(true);
    setOfferPrice('');
    setOfferNote('');
    setTimeout(() => setOfferSubmitted(false), 5000);
  };

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    askQuestion(artwork.id, questionText, currentUser?.name || 'Collector');
    setQuestionText('');
    setQaSubmitted(true);
    setTimeout(() => setQaSubmitted(false), 5000);
  };

  // Filter Q&As for this artwork
  const questionsForThisArt = (artworkQuestions || []).filter(q => q.artworkId === artwork.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-art-gold transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Artwork Catalogue</span>
        </Link>

        {/* Wishlist quick action */}
        <button
          onClick={() => isWishlisted ? removeFromWishlist(artwork.id) : addToWishlist(artwork.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
            isWishlisted 
              ? 'bg-red-500/10 border-red-500/30 text-red-400' 
              : 'bg-art-black-card border-white/10 text-slate-300 hover:border-art-gold/40'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
        </button>
      </div>

      {/* Main Grid: Image & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Display */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card-gold border border-art-gold/40 shadow-2xl">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />

            {artwork.artistType === 'Premium' && (
              <span className="absolute top-4 left-4 badge-gold text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-gold-glow">
                <Sparkles className="w-3.5 h-3.5 text-art-gold" />
                <span>PREMIUM VERIFIED ARTIST</span>
              </span>
            )}
          </div>

          {/* Physical Verification & Direct Settlement bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-art-black-card rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-art-gold" />
              <span>Curatorial Inspection & Provenance Verified</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>WEMA Bank Secured Settlement</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Purchase */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-art-gold font-bold uppercase tracking-widest">
                  {artwork.category} • {artwork.year || '2026'}
                </span>
                <VerificationBadge badge={artwork.verificationBadge} />
              </div>
              <h1 className="font-serif text-3xl font-bold text-white mb-2">{artwork.title}</h1>

              {/* Artist row */}
              <div className="flex items-center gap-3 py-2 border-y border-white/10 my-3">
                <img
                  src={artwork.artistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                  alt={artwork.artistName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-art-gold/50"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{artwork.artistName}</h3>
                  <p className="text-xs text-art-gold flex items-center gap-1">
                    <span>{artwork.city || 'Lagos'}, {artwork.country || 'Nigeria'}</span>
                    <span>{artwork.countryFlag || '🇳🇬'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-art-black border border-art-gold/30 shadow-xl space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Valuation:</span>
                <span className="font-serif text-3xl font-bold text-white text-gradient-gold">
                  {formatPrice(artwork.price)}
                </span>
              </div>

              {/* Action Buttons based on status */}
              {artwork.status === 'available' && (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => addToCart(artwork)}
                    className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold-dark text-art-black font-bold text-sm uppercase tracking-wider rounded-xl transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Acquire Masterpiece (Direct Settlement)</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    Direct settlement secured via WEMA Bank PLC Corporate Gateway.
                  </p>
                </div>
              )}

              {artwork.status === 'auction' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Live Auction Highest Bid:</span>
                    <span className="font-mono text-base font-bold text-red-400">
                      {formatPrice(artwork.auction?.currentBid || artwork.price)}
                    </span>
                  </div>
                  <Link
                    href="/auctions"
                    className="w-full py-3.5 bg-art-red hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition shadow-crimson-glow flex items-center justify-center gap-2 text-center"
                  >
                    <span>Enter Live Bidding Room</span>
                  </Link>
                </div>
              )}

              {artwork.status === 'sold' && (
                <div className="p-4 bg-zinc-900 rounded-xl border border-white/10 text-center space-y-1">
                  <span className="text-red-400 font-bold text-xs uppercase tracking-wider">Historical Sold Record</span>
                  <p className="text-xs text-slate-300">
                    Sold to <strong className="text-white">{artwork.soldTo || 'Private Collector'}</strong> for <span className="text-art-gold font-mono">{formatPrice(artwork.soldPrice || artwork.price)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Artwork Specifications Table */}
            <div className="p-4 bg-art-black-card rounded-2xl border border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Medium</span>
                <span className="text-slate-200 font-medium">{artwork.medium}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Dimensions</span>
                <span className="text-slate-200 font-mono">{artwork.dimensions}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Creation Year</span>
                <span className="text-slate-200 font-mono">{artwork.year || '2026'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Authentication</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>ARTELLIUM Digital COA Attached</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Origin Map Pin Section */}
      <section className="pt-8 border-t border-white/10">
        <OriginMapPin 
          country={artwork.country || 'Nigeria'} 
          city={artwork.city || 'Lagos'} 
          countryFlag={artwork.countryFlag || '🇳🇬'} 
        />
      </section>

      {/* Feature 7: Artist Story & Studio Journal / History */}
      {artwork.studioNotes && (
        <section id="artist-history" className="scroll-mt-24 bg-gradient-to-r from-art-black-card via-zinc-950 to-art-black-card border border-art-gold/30 rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <img 
              src={artwork.artistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'} 
              alt={artwork.artistName} 
              className="w-12 h-12 rounded-full object-cover border-2 border-art-gold" 
            />
            <div>
              <span className="text-[10px] font-bold text-art-gold uppercase tracking-widest block">ARTIST LIVING HISTORY & STUDIO JOURNAL</span>
              <h3 className="font-serif text-lg font-bold text-white">Provenance & Heritage from {artwork.artistName}'s Atelier</h3>
            </div>
          </div>
          <blockquote className="border-l-4 border-art-gold pl-6 py-2 text-sm sm:text-base text-slate-200 italic leading-relaxed font-serif">
            "{artwork.studioNotes}"
          </blockquote>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Documented direct from artist atelier in {artwork.city}, {artwork.country}</span>
          </div>
        </section>
      )}

      {/* Feature 4: "Make an Offer" Private Collector Bid Section */}
      {artwork.status === 'available' && (
        <section className="bg-gradient-to-br from-art-black-card to-zinc-950 border border-amber-500/30 rounded-3xl p-8 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Submit a Private Offer</h3>
                <p className="text-xs text-slate-400">
                  Propose your own acquisition price directly to {artwork.artistName}. Direct settlement terms apply on acceptance.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono bg-art-black px-3 py-1.5 rounded-full border border-white/10 text-slate-300">
              List: {formatPrice(artwork.price)}
            </span>
          </div>

          {offerSubmitted ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle className="w-5 h-5" />
                <span>Private Offer Transmitted to {artwork.artistName}!</span>
              </div>
              <p className="text-xs text-slate-300">
                The artist will review your offer in their dashboard. You will receive notification on acceptance.
              </p>
            </div>
          ) : (
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Your Proposed Offer Amount (₦ NGN)
                  </label>
                  <input
                    type="number"
                    required
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder={`e.g. ${Math.round(artwork.price * 0.9)}`}
                    className="w-full bg-art-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-art-gold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Collector Message / Provenance Request (Optional)
                  </label>
                  <input
                    type="text"
                    value={offerNote}
                    onChange={(e) => setOfferNote(e.target.value)}
                    placeholder="e.g. Seeking for private foundation collection in Nairobi..."
                    className="w-full bg-art-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-art-gold"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Private Offer</span>
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* Feature 8: Ask the Artist (Pre-Purchase Q&A) */}
      <section className="bg-art-black-card border border-white/10 rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-art-gold/10 border border-art-gold/30 flex items-center justify-center text-art-gold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Ask the Artist · Pre-Purchase Inquiries</h3>
              <p className="text-xs text-slate-400">
                Direct questions regarding conservation, pigments, framing, or historical context.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-art-gold bg-art-black px-3 py-1 rounded-full border border-art-gold/30">
            {questionsForThisArt.length} Questions Answered
          </span>
        </div>

        {/* Existing Q&A List */}
        <div className="space-y-4">
          {questionsForThisArt.map((q) => (
            <div key={q.id} className="bg-art-black rounded-2xl p-5 border border-white/10 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-art-gold/20 text-art-gold font-bold text-xs flex items-center justify-center shrink-0">
                  Q
                </span>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium text-white">{q.question}</p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Asked by {q.askedBy} · {q.date}
                  </span>
                </div>
              </div>

              {q.answer ? (
                <div className="flex items-start gap-3 pl-4 border-l-2 border-art-gold/50 pt-2 ml-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                    A
                  </span>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{q.answer}</p>
                    <span className="text-[10px] text-emerald-400 font-medium">
                      Answered by {q.answeredBy || artwork.artistName} (Artist) · {q.answeredDate || 'Verified'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="pl-9 text-xs text-slate-500 italic flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Awaiting artist reply in studio inbox...</span>
                </div>
              )}
            </div>
          ))}

          {questionsForThisArt.length === 0 && (
            <p className="text-xs text-slate-500 italic text-center py-4">
              No inquiries posted yet. Be the first to ask {artwork.artistName} a question about this masterwork!
            </p>
          )}
        </div>

        {/* Submit Question Form */}
        {qaSubmitted ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 text-center text-emerald-400 text-xs font-semibold">
            ✅ Inquiry sent directly to {artwork.artistName}'s studio dashboard!
          </div>
        ) : (
          <form onSubmit={handleAskQuestion} className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="text"
              required
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={`Ask ${artwork.artistName} about technique, framing, archival care...`}
              className="flex-1 bg-art-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs sm:text-sm focus:outline-none focus:border-art-gold"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-art-gold hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask Question</span>
            </button>
          </form>
        )}
      </section>

      {/* Provenance History Timeline */}
      <section className="pt-10 border-t border-white/10 space-y-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-art-gold" />
          <h2 className="font-serif text-2xl font-bold text-white">Chain of Custody & Provenance History</h2>
        </div>

        <div className="p-6 bg-art-black-card rounded-3xl border border-white/10 space-y-6 relative">
          <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-art-gold/30" />

          {(() => {
            const history = artwork.history || [
              { event: 'Masterpiece Created', actor: artwork.artistName, price: 0, date: artwork.created_at || '2026-02-05' },
              ...(artwork.status === 'sold' || artwork.soldTo ? [
                { event: 'Ownership Transferred', actor: artwork.soldTo || 'Dr. Evelyn Carter', price: artwork.soldPrice || artwork.price, date: '2026-02-12' }
              ] : [])
            ];

            return history.map((hist, idx) => (
              <div key={idx} className="flex gap-6 items-start relative z-10 text-xs">
                <div className="w-6 h-6 rounded-full bg-art-black border border-art-gold flex items-center justify-center font-bold text-[9px] text-art-gold shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 bg-black/30 border border-white/5 p-4 rounded-2xl space-y-1 hover:border-art-gold/30 transition">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span className="uppercase tracking-wider font-bold text-art-gold">{hist.event}</span>
                    <span>{new Date(hist.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-200 font-medium">{hist.actor}</span>
                    {hist.price > 0 && (
                      <span className="font-mono text-emerald-400 font-bold">{formatPrice(hist.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </section>

      {/* Customer Reviews & Feedback Section */}
      <section className="pt-10 border-t border-white/10 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-art-gold" />
            <h2 className="font-serif text-2xl font-bold text-white">Collector Feedback & Reviews</h2>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span>4.9 / 5.0 Rating</span>
          </div>
        </div>

        {/* Submit Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-art-black-card p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-serif text-sm font-bold text-white">Write Collector Review</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Rating (Out of 5 Stars)</label>
              <select
                value={newReviewForm.rating}
                onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none cursor-pointer"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional Masterwork)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Very High Quality)</option>
                <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Collector Location</label>
              <input
                type="text"
                value={newReviewForm.location}
                onChange={(e) => setNewReviewForm({ ...newReviewForm, location: e.target.value })}
                placeholder="e.g. London, UK or Lagos, Nigeria"
                className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1 font-medium">Your Review Statement</label>
            <textarea
              rows="3"
              required
              value={newReviewForm.comment}
              onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
              placeholder="Share your feedback on provenance, framing, or delivery experience..."
              className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-art-gold text-art-black font-bold text-xs px-5 py-2.5 rounded-xl hover:brightness-110 transition shadow-gold-glow"
          >
            Submit Collector Review
          </button>
        </form>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl bg-art-black border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-art-gold/10 text-art-gold flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{rev.userName}</h4>
                    <p className="text-[10px] text-slate-400">{rev.location} • {rev.date}</p>
                  </div>
                </div>

                <div className="flex text-amber-400 text-xs">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 italic pt-1">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
