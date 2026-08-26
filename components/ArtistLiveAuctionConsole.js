'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/store-context';
import {
  Flame,
  Gavel,
  Clock,
  TrendingUp,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  DollarSign,
  ShieldCheck,
  Zap,
  Layers,
  Box,
  Palette,
  Monitor,
  ArrowUpRight,
  RotateCcw,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function ArtistLiveAuctionConsole({ artistName }) {
  const { 
    artworks = [], 
    updateArtwork, 
    addArtwork, 
    currency, 
    liveAuctionActive,
    auctionLots = [],
    placeBid,
    artistPayoutPercentage = 85
  } = useStore();

  const [activeTab, setActiveTab] = useState('live_tracking'); // 'live_tracking' | 'submit_lot'
  const [submissionSuccess, setSubmissionSuccess] = useState('');

  // Special Live Auction Submission Form state
  const [lotForm, setLotForm] = useState({
    title: '',
    category: 'Painters',
    medium: 'Oil & 24k Gold Leaf on Canvas',
    dimensions: '150 x 120 cm',
    startingBid: '1500000',
    reservePrice: '2500000',
    estimateLow: '2000000',
    estimateHigh: '3500000',
    durationMinutes: '60',
    exhibitionHall: 'Grand Benin Bronze Hall',
    antiSniping: true,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
    description: 'Masterpiece presented for real-time competitive bidding in the Live Arena Broadcast.'
  });

  // Filter artworks that are in live auction for this artist
  const myLiveLots = artworks.filter(
    (art) =>
      art.status === 'auction' &&
      (art.artistName?.toLowerCase().includes(artistName?.toLowerCase()) ||
        art.artist?.toLowerCase().includes(artistName?.toLowerCase()) ||
        artistName?.toLowerCase().includes(art.artistName?.toLowerCase()))
  );

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  // Submit Artwork to Live Auction
  const handleLaunchLiveLot = (e) => {
    e.preventDefault();
    const startingBidNum = parseFloat(lotForm.startingBid) || 1000000;
    const reservePriceNum = parseFloat(lotForm.reservePrice) || 2000000;

    const newAuctionLot = {
      id: `auction-${Date.now()}`,
      title: lotForm.title,
      artistName: artistName || 'Master Artist',
      category: lotForm.category,
      medium: lotForm.medium,
      dimensions: lotForm.dimensions,
      price: startingBidNum,
      image: lotForm.image,
      status: 'auction',
      country: 'Nigeria',
      city: 'Lagos',
      countryFlag: '🇳🇬',
      shipsTo: ['Africa', 'Europe', 'North America', 'Worldwide'],
      description: lotForm.description,
      auction: {
        currentBid: startingBidNum,
        startingBid: startingBidNum,
        reservePrice: reservePriceNum,
        totalBids: 1,
        highestBidder: 'Initial Opening Reserve',
        endTime: new Date(Date.now() + parseInt(lotForm.durationMinutes) * 60 * 1000).toISOString(),
        exhibitionHall: lotForm.exhibitionHall,
        antiSnipingEnabled: lotForm.antiSniping,
        bidsHistory: [
          {
            id: `bid-init-${Date.now()}`,
            bidder: 'Opening Floor Reserve',
            amount: startingBidNum,
            time: 'Just now',
            isPowerBid: false
          }
        ]
      }
    };

    addArtwork(newAuctionLot);
    setSubmissionSuccess(`"${lotForm.title}" successfully launched into the LIVE ARENA BROADCAST!`);
    setActiveTab('live_tracking');
    setTimeout(() => setSubmissionSuccess(''), 5000);
  };

  // Artist 1-click actions on their live lot
  const handleAcceptAndHammerDown = (art) => {
    if (!confirm(`Accept current highest bid of ${formatPrice(art.auction?.currentBid || art.price)} and hammer down this lot?`)) return;
    
    updateArtwork(art.id, {
      status: 'sold',
      soldPrice: art.auction?.currentBid || art.price,
      soldTo: art.auction?.highestBidder || 'Winning Live Collector',
      soldDate: new Date().toLocaleDateString()
    });
    alert(`🔨 Gavel Hammered! Lot marked as SOLD to ${art.auction?.highestBidder || 'Winning Collector'}. Direct WEMA Bank settlement initiated.`);
  };

  const handleExtendLotTime = (art) => {
    const currentEnd = art.auction?.endTime ? new Date(art.auction.endTime).getTime() : Date.now() + 600000;
    const newEnd = new Date(currentEnd + 5 * 60 * 1000).toISOString();
    
    updateArtwork(art.id, {
      auction: {
        ...art.auction,
        endTime: newEnd
      }
    });
    alert('⏱️ Auction extended by +5 minutes for competitive bidding!');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm font-sans text-xs">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-600 shadow-sm">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Artist Live Auction Operations & Follow-Up Portal</span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold border border-red-200 uppercase tracking-widest">
                Live Broadcast Connected
              </span>
            </h3>
            <p className="text-slate-500 text-xs">
              List lots for live bidding, monitor incoming bids in real-time, and track competitive bidding velocity.
            </p>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('live_tracking')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'live_tracking'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gavel className="w-3.5 h-3.5 text-amber-600" />
            <span>Live Lots & Bid Stream ({myLiveLots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('submit_lot')}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'submit_lot'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-art-gold" />
            <span>Launch New Live Lot</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {submissionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{submissionSuccess}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: LIVE TRACKING & MOMENT-BY-MOMENT BID STREAM                        */}
      {/* ========================================================================= */}
      {activeTab === 'live_tracking' && (
        <div className="space-y-6 animate-fade-in">
          {myLiveLots.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-amber-800">
                <Gavel className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-slate-900 text-sm">No Active Live Auction Lots Currently</h4>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  Submit one of your premier masterpieces to the Live Arena Broadcast to receive competitive real-time collector bids.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('submit_lot')}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition"
              >
                + Launch Artwork into Live Arena
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {myLiveLots.map((art) => {
                const currentBid = art.auction?.currentBid || art.price;
                const totalBids = art.auction?.totalBids || 1;
                const highestBidder = art.auction?.highestBidder || 'Anonymous Verified Collector';
                const reserveMet = currentBid >= (art.auction?.reservePrice || 0);

                return (
                  <div
                    key={art.id}
                    className="p-6 rounded-3xl bg-slate-900 text-white border border-amber-500/40 shadow-xl relative overflow-hidden space-y-6"
                  >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Lot Header & Status Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-art-gold bg-black shrink-0">
                          <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[9px] uppercase tracking-wider animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              <span>LIVE ARENA ACTIVE</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Lot #{art.id.slice(-6).toUpperCase()}</span>
                          </div>
                          <h4 className="font-serif text-lg font-bold text-white">{art.title}</h4>
                          <p className="text-slate-400 text-xs font-sans">{art.medium} · {art.dimensions}</p>
                        </div>
                      </div>

                      {/* Live Bidding Numbers */}
                      <div className="flex items-center gap-6 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Current Highest Bid</span>
                          <span className="font-serif text-2xl font-bold text-art-gold">{formatPrice(currentBid)}</span>
                        </div>
                        <div className="text-right border-l border-white/10 pl-4">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Reserve Status</span>
                          <span className={`text-xs font-bold font-mono ${reserveMet ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {reserveMet ? '✅ Reserve Met' : '⏳ Reserve Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Telemetry Grid & Follow-Up Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Bids Placed</span>
                        <p className="font-serif text-lg font-bold text-white flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span>{totalBids} Bids</span>
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Leading Collector</span>
                        <p className="font-serif text-xs font-bold text-art-gold truncate flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{highestBidder}</span>
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Exhibition Pairing</span>
                        <p className="text-xs font-medium text-slate-200 truncate flex items-center gap-1">
                          <Box className="w-3.5 h-3.5 text-art-gold shrink-0" />
                          <span className="truncate">{art.auction?.exhibitionHall || 'Grand Benin Bronze Hall'}</span>
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Settlement Estimate ({artistPayoutPercentage}%)</span>
                        <p className="font-serif text-base font-bold text-emerald-400">
                          {formatPrice(currentBid * (artistPayoutPercentage / 100))}
                        </p>
                      </div>
                    </div>

                    {/* Live Bids Feed */}
                    <div className="space-y-2 bg-black/40 border border-white/10 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Moment-by-Moment Incoming Live Bids Log:
                      </span>

                      <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                        {art.auction?.bidsHistory?.map((b, idx) => (
                          <div
                            key={b.id || idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="font-medium text-slate-200">{b.bidder}</span>
                              {b.isPowerBid && (
                                <span className="px-2 py-0.5 rounded-full bg-art-gold/20 text-art-gold font-bold text-[9px] border border-art-gold/30">
                                  ⚡ Power Bid (+₦100k)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-art-gold">{formatPrice(b.amount)}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{b.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Artist Real-Time Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Link
                          href="/auctions"
                          target="_blank"
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-art-gold" />
                          <span>View in Public Live Arena</span>
                        </Link>

                        <button
                          onClick={() => handleExtendLotTime(art)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Extend Bidding (+5 Mins)</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleAcceptAndHammerDown(art)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold uppercase tracking-wider text-xs shadow-lg flex items-center gap-2 transition cursor-pointer"
                      >
                        <Gavel className="w-4 h-4" />
                        <span>Accept Current Bid & Hammer Down</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SPECIAL LIVE AUCTION SUBMISSION FORM                                */}
      {/* ========================================================================= */}
      {activeTab === 'submit_lot' && (
        <form onSubmit={handleLaunchLiveLot} className="space-y-6 animate-fade-in">
          <div className="p-4 bg-gradient-to-r from-amber-50 via-amber-100/50 to-orange-50 rounded-2xl border border-amber-200 flex items-center gap-3 text-amber-900">
            <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="font-serif font-bold text-sm">Live Arena Broadcast Submission Protocol</p>
              <p className="text-[11px] text-amber-800/80">
                Works submitted to the live arena are broadcast directly to 240+ verified collectors with live WebGL 3D museum staging and +₦100k Power Bidding.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1 font-medium">Masterpiece Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Sovereign Golden Dynasty: The Royal Oba"
                value={lotForm.title}
                onChange={(e) => setLotForm({ ...lotForm, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-medium">Artwork Category</label>
              <select
                value={lotForm.category}
                onChange={(e) => setLotForm({ ...lotForm, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none cursor-pointer"
              >
                <option value="Paintings">🎨 Paintings</option>
                <option value="Sculptures">🗿 Sculptures</option>
                <option value="Drawings">✏️ Drawings</option>
                <option value="Photography">📷 Photography</option>
                <option value="Textiles">🧵 Textiles</option>
                <option value="Pottery">🏺 Pottery</option>
                <option value="Ceramics">🍶 Ceramics</option>
                <option value="Woodworks">🪵 Woodworks</option>
                <option value="Metal works">⚒️ Metal Works</option>
                <option value="Handmade crafts">🪡 Handmade Crafts</option>
                <option value="Indigenous artworks">👑 Indigenous Artworks</option>
                <option value="Limited edition collections">✨ Limited Edition Collections</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 mb-1 font-medium">Opening Starting Bid (₦ NGN)</label>
              <input
                type="number"
                required
                placeholder="e.g. 1500000"
                value={lotForm.startingBid}
                onChange={(e) => setLotForm({ ...lotForm, startingBid: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono focus:border-art-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-medium">Confidential Reserve Price (₦ NGN)</label>
              <input
                type="number"
                required
                placeholder="e.g. 2500000"
                value={lotForm.reservePrice}
                onChange={(e) => setLotForm({ ...lotForm, reservePrice: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono focus:border-art-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-medium">Live Auction Duration</label>
              <select
                value={lotForm.durationMinutes}
                onChange={(e) => setLotForm({ ...lotForm, durationMinutes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none cursor-pointer"
              >
                <option value="45">⚡ 45 Minutes (Flash Arena)</option>
                <option value="120">⏱️ 2 Hours (Standard Gala)</option>
                <option value="360">🏛️ 6 Hours (Grand Salon)</option>
                <option value="1440">👑 24 Hours (Continental Bourse)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1 font-medium">Medium & Technique</label>
              <input
                type="text"
                required
                placeholder="e.g. Cast Bronze with Natural Patina / Oil on Raw Linen"
                value={lotForm.medium}
                onChange={(e) => setLotForm({ ...lotForm, medium: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-medium">3D Virtual Museum Exhibition Pairing</label>
              <select
                value={lotForm.exhibitionHall}
                onChange={(e) => setLotForm({ ...lotForm, exhibitionHall: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none cursor-pointer"
              >
                <option value="Grand Benin Bronze Hall">🏛️ Grand Benin Bronze Hall</option>
                <option value="Great Zimbabwe Pavilion">🗿 Great Zimbabwe Pavilion</option>
                <option value="Nubian Gold Sanctuary">✨ Nubian Gold Sanctuary</option>
                <option value="Swahili Maritime Gallery">🌊 Swahili Maritime Gallery</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-medium">High-Resolution Image URL</label>
            <input
              type="url"
              required
              value={lotForm.image}
              onChange={(e) => setLotForm({ ...lotForm, image: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-1 font-medium">Provenance & Studio Narrative</label>
            <textarea
              rows="3"
              value={lotForm.description}
              onChange={(e) => setLotForm({ ...lotForm, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('live_tracking')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-7 py-2.5 bg-gradient-to-r from-red-600 via-amber-500 to-art-gold hover:brightness-110 text-white font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition cursor-pointer"
            >
              <Flame className="w-4 h-4" />
              <span>Launch Lot to Live Arena</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
