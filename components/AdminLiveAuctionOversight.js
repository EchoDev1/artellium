'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/store-context';
import {
  Flame,
  Gavel,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Pause,
  Play,
  RotateCcw,
  Eye,
  Sliders,
  DollarSign,
  User,
  Building,
  ArrowUpRight,
  Sparkles,
  Award,
  Plus,
  Trash2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLiveAuctionOversight() {
  const { 
    artworks = [], 
    addArtwork,
    updateArtwork, 
    currency, 
    usdExchangeRate = 1480,
    liveAuctionActive, 
    setLiveAuctionActive,
    transactions = [],
    addTransaction,
    artistPayoutPercentage = 85
  } = useStore();

  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedLot, setSelectedLot] = useState(null);
  const [arenaPaused, setArenaPaused] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Modals for Launching Auction Lots
  const [isAddLotModalOpen, setIsAddLotModalOpen] = useState(false);
  const [isSelectArtModalOpen, setIsSelectArtModalOpen] = useState(false);
  const [newLotForm, setNewLotForm] = useState({
    title: '',
    artistName: '',
    category: 'Paintings',
    medium: 'Oil on Canvas',
    dimensions: '120 x 95 cm',
    country: 'Nigeria',
    city: 'Lagos',
    startingBid: 1000000,
    reservePrice: 1500000,
    estimateMin: 1000000,
    estimateMax: 2500000,
    image: ''
  });

  const liveLots = artworks.filter((art) => art.status === 'auction');
  const totalVolume = liveLots.reduce((sum, art) => sum + (art.auction?.currentBid || art.price), 0);

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      const rate = (usdExchangeRate && usdExchangeRate > 0) ? usdExchangeRate : 1480;
      return `$${Math.round(amount / rate).toLocaleString()}`;
    }
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  const showToast = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  // Sovereign Hammer Down
  const handleAdminHammerDown = (art) => {
    const winningBid = art.auction?.currentBid || art.price;
    const winningBidder = art.auction?.highestBidder || 'Verified Continental Collector';

    if (!confirm(`Sovereign Hammer Down for "${art.title}" at ${formatPrice(winningBid)}? This will finalize the auction and dispatch the direct WEMA settlement to ${art.artistName}.`)) {
      return;
    }

    updateArtwork(art.id, {
      status: 'sold',
      soldPrice: winningBid,
      soldTo: winningBidder,
      soldDate: new Date().toLocaleDateString()
    });

    // Record Sovereign Transaction
    addTransaction({
      id: `tx-auction-${Date.now()}`,
      artworkTitle: art.title,
      artistName: art.artistName,
      buyerName: winningBidder,
      amount: winningBid,
      artistPayout: winningBid * (artistPayoutPercentage / 100),
      platformFee: winningBid * ((100 - artistPayoutPercentage) / 100),
      settlementBank: 'Wema Bank PLC Direct',
      date: new Date().toISOString(),
      type: 'Live Arena Auction Settlement'
    });

    showToast(`🔨 Gavel Hammered! Lot "${art.title}" settled. direct net studio settlement (₦${(winningBid * (artistPayoutPercentage / 100)).toLocaleString()}) queued for WEMA Bank disbursement.`);
  };

  // Anti-Sniping Timer Extension
  const handleExtendLot = (art, minutes = 2) => {
    const currentEnd = art.auction?.endTime ? new Date(art.auction.endTime).getTime() : Date.now() + 600000;
    const newEnd = new Date(currentEnd + minutes * 60 * 1000).toISOString();

    updateArtwork(art.id, {
      auction: {
        ...art.auction,
        endTime: newEnd
      }
    });

    showToast(`⏱️ Anti-sniping extension applied (+${minutes} mins) to "${art.title}".`);
  };

  return (
    <div className="space-y-6 text-xs font-sans">
      
      {/* Top Telemetry Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Live Lots</span>
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900">{liveLots.length} Broadcast Lots</p>
          <span className="text-[10px] text-emerald-600 font-bold font-mono">Synchronized with 4 3D Halls</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Live Arena Valuation</span>
            <DollarSign className="w-4 h-4 text-art-gold" />
          </div>
          <p className="font-serif text-2xl font-bold text-art-gold">{formatPrice(totalVolume)}</p>
          <span className="text-[10px] text-slate-400 font-mono">Real-time aggregate high bids</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Online Collectors</span>
            <User className="w-4 h-4 text-blue-500" />
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900">248+ Active Bidders</p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sub-second Socket Streams</span>
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Bidding Protocol</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-serif text-lg font-bold text-slate-900">₦100k Power Bids</p>
          <span className="text-[10px] text-slate-500 font-mono">WEMA 85/15 Smart Split Active</span>
        </div>
      </div>

      {/* Action Toast */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-900 font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Global Sovereign Arena Control Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/60 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-art-gold/10 border border-art-gold/30 flex items-center justify-center text-art-gold">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-white">
              Sovereign Auction Arena Oversight & Command Matrix
            </h4>
            <p className="text-slate-400 text-xs">
              Direct oversight on all master artists, live bidding velocity, and instant settlement disbursements.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setArenaPaused(!arenaPaused);
              showToast(arenaPaused ? '▶️ Live Arena Bidding Resumed.' : '⏸️ Live Arena Bidding Paused for curatorial notice.');
            }}
            className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition ${
              arenaPaused
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {arenaPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{arenaPaused ? 'Resume Arena' : 'Pause Arena'}</span>
          </button>

          <Link
            href="/auctions"
            target="_blank"
            className="px-4 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider text-xs rounded-xl shadow-gold-glow flex items-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Live Broadcast</span>
          </Link>
        </div>
      </div>

      {/* Live Lots Roster */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Active Broadcast Lots & Real-Time Bidding Feeds</span>
            </h3>
            <p className="text-slate-500 text-xs">
              Every live lot currently open for collector bidding across Nigeria, Ghana, South Africa, and global vaults.
            </p>
          </div>

          {/* Category Filter & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsAddLotModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Live Lot</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSelectArtModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-art-gold" />
              <span>Move Art to Auction</span>
            </button>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Filter:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-medium text-xs focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Painters">Oil & Acrylic Painters</option>
                <option value="Sculpture Makers">Bronze & Wood Sculptors</option>
                <option value="Digital Art">Afrofuturist 3D & Digital</option>
                <option value="Mixed Media">Textile & Mixed Media</option>
              </select>
            </div>
          </div>
        </div>

        {liveLots.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Gavel className="w-8 h-8 mx-auto text-slate-300" />
            <p>No active auction lots currently in the Live Arena.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {liveLots
              .filter((art) => filterCategory === 'All' || art.category === filterCategory)
              .map((art) => {
                const currentBid = art.auction?.currentBid || art.price;
                const totalBids = art.auction?.totalBids || 1;
                const highestBidder = art.auction?.highestBidder || 'Verified Collector';
                const reserveMet = currentBid >= (art.auction?.reservePrice || 0);

                return (
                  <div
                    key={art.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-art-gold/40 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-black shrink-0">
                          <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[9.5px] uppercase border border-red-200">
                              Live Bidding Open
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">Lot #{art.id.slice(-6).toUpperCase()}</span>
                          </div>
                          <h4 className="font-serif font-bold text-slate-900 text-sm">{art.title}</h4>
                          <p className="text-slate-500 text-xs">
                            Master Artist: <strong className="text-slate-800 font-semibold">{art.artistName}</strong> ({art.country || 'Nigeria'})
                          </p>
                        </div>
                      </div>

                      {/* Pricing and Highest Bidder Info */}
                      <div className="flex items-center gap-6 text-right shrink-0">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Current High Bid</span>
                          <span className="font-serif font-bold text-base text-emerald-600">{formatPrice(currentBid)}</span>
                          <span className="text-[9px] text-slate-400 block font-mono">By {highestBidder}</span>
                        </div>
                        <div className="border-l border-slate-200 pl-4">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Reserve Status</span>
                          <span className={`text-xs font-bold font-mono ${reserveMet ? 'text-emerald-700' : 'text-amber-800'}`}>
                            {reserveMet ? 'Reserve Met' : 'Reserve Pending'}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-mono">{totalBids} Bids Placed</span>
                        </div>
                      </div>
                    </div>

                    {/* Sovereign Control Buttons for this Lot */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleExtendLot(art, 2)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-art-gold text-slate-700 hover:text-slate-900 font-bold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>+2 Mins Anti-Sniping</span>
                        </button>

                        <button
                          onClick={() => handleExtendLot(art, 10)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-art-gold text-slate-700 hover:text-slate-900 font-bold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>+10 Mins Extended</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove "${art.title}" from Live Auction and return to regular catalogue?`)) {
                              updateArtwork(art.id, { status: 'available', isAuction: false });
                              showToast(`Lot "${art.title}" returned to regular marketplace catalogue.`);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                          title="Revert lot to standard catalogue"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Revert to Catalogue</span>
                        </button>

                        <button
                          onClick={() => handleAdminHammerDown(art)}
                          className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-[11px] transition shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Gavel className="w-3.5 h-3.5 text-art-gold" />
                          <span>Sovereign Hammer Down (Settle & Payout)</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Launch New Auction Lot Modal */}
      {isAddLotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600 animate-pulse" />
                <span>Launch New Live Auction Arena Lot</span>
              </h3>
              <button onClick={() => setIsAddLotModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newLotForm.title || !newLotForm.artistName) return;

                const startBid = parseFloat(newLotForm.startingBid) || 1000000;
                const reserve = parseFloat(newLotForm.reservePrice) || (startBid * 1.25);
                const estMin = parseFloat(newLotForm.estimateMin) || startBid;
                const estMax = parseFloat(newLotForm.estimateMax) || (startBid * 1.6);

                const lotData = {
                  id: `art-lot-${Date.now()}`,
                  title: newLotForm.title,
                  artistName: newLotForm.artistName,
                  category: newLotForm.category || 'Paintings',
                  medium: newLotForm.medium || 'Oil on Canvas',
                  dimensions: newLotForm.dimensions || '120 x 95 cm',
                  country: newLotForm.country || 'Nigeria',
                  city: newLotForm.city || 'Lagos',
                  countryFlag: '🇳🇬',
                  price: startBid,
                  status: 'auction',
                  isAuction: true,
                  image: newLotForm.image || '',
                  auction: {
                    startingBid: startBid,
                    currentBid: startBid,
                    reservePrice: reserve,
                    estimateMin: estMin,
                    estimateMax: estMax,
                    totalBids: 0,
                    endTimestamp: Date.now() + 1000 * 60 * 60 * 48,
                    highestBidder: 'Awaiting first bid',
                    bidHistory: []
                  }
                };

                addArtwork(lotData);
                showToast(`🔥 Live Auction Lot "${newLotForm.title}" successfully launched!`);
                setIsAddLotModalOpen(false);
                setNewLotForm({
                  title: '',
                  artistName: '',
                  category: 'Paintings',
                  medium: 'Oil on Canvas',
                  dimensions: '120 x 95 cm',
                  country: 'Nigeria',
                  city: 'Lagos',
                  startingBid: 1000000,
                  reservePrice: 1500000,
                  estimateMin: 1000000,
                  estimateMax: 2500000,
                  image: ''
                });
              }}
              className="space-y-3.5"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Artwork Title</label>
                  <input
                    type="text"
                    required
                    value={newLotForm.title}
                    onChange={e => setNewLotForm({ ...newLotForm, title: e.target.value })}
                    placeholder="e.g. Sovereign Warrior of Benin"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Artist Name</label>
                  <input
                    type="text"
                    required
                    value={newLotForm.artistName}
                    onChange={e => setNewLotForm({ ...newLotForm, artistName: e.target.value })}
                    placeholder="Enter Artist Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Category</label>
                  <select
                    value={newLotForm.category}
                    onChange={e => setNewLotForm({ ...newLotForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  >
                    <option value="Paintings">Paintings</option>
                    <option value="Sculptures">Sculptures</option>
                    <option value="Drawings">Drawings</option>
                    <option value="Photography">Photography</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Pottery">Pottery</option>
                    <option value="Ceramics">Ceramics</option>
                    <option value="Woodworks">Woodworks</option>
                    <option value="Metal works">Metal works</option>
                    <option value="Limited edition collections">Limited edition collections</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Medium</label>
                  <input
                    type="text"
                    value={newLotForm.medium}
                    onChange={e => setNewLotForm({ ...newLotForm, medium: e.target.value })}
                    placeholder="Cast Lost-Wax Bronze"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Dimensions</label>
                  <input
                    type="text"
                    value={newLotForm.dimensions}
                    onChange={e => setNewLotForm({ ...newLotForm, dimensions: e.target.value })}
                    placeholder="90 × 45 × 35 cm"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200/60 space-y-2.5">
                <span className="font-bold text-red-900 text-xs block flex items-center gap-1.5">
                  <Gavel className="w-3.5 h-3.5 text-red-600" />
                  <span>Auction Reserve & Pricing Configuration (₦ NGN)</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Starting Bid</label>
                    <input
                      type="number"
                      required
                      value={newLotForm.startingBid}
                      onChange={e => setNewLotForm({ ...newLotForm, startingBid: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Reserve Price (Hidden Minimum)</label>
                    <input
                      type="number"
                      required
                      value={newLotForm.reservePrice}
                      onChange={e => setNewLotForm({ ...newLotForm, reservePrice: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Estimate Low</label>
                    <input
                      type="number"
                      value={newLotForm.estimateMin}
                      onChange={e => setNewLotForm({ ...newLotForm, estimateMin: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[10px] mb-0.5">Estimate High</label>
                    <input
                      type="number"
                      value={newLotForm.estimateMax}
                      onChange={e => setNewLotForm({ ...newLotForm, estimateMax: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Masterpiece Photo Image URL</label>
                <input
                  type="text"
                  value={newLotForm.image}
                  onChange={e => setNewLotForm({ ...newLotForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddLotModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold uppercase rounded-xl transition shadow"
                >
                  Broadcast to Live Arena
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Select Artwork to Move to Live Auction Modal */}
      {isSelectArtModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-art-gold" />
                <span>Move Catalog Artwork to Live Auction Arena</span>
              </h3>
              <button onClick={() => setIsSelectArtModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <p className="text-slate-500 text-xs">
              Select any verified catalog artwork to immediately activate real-time live bidding, reserve price protections, and anti-sniping clock timers.
            </p>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {(artworks || []).filter(a => a.status !== 'auction').map(art => (
                <div key={art.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:border-art-gold transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={art.image} alt={art.title} className="w-12 h-12 object-cover rounded-lg bg-black shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-serif font-bold text-slate-900 text-sm truncate">{art.title}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{art.artistName} · {art.category}</p>
                      <span className="font-mono font-bold text-emerald-600 text-xs">{formatPrice(art.price)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const startBid = art.price || 1000000;
                      updateArtwork(art.id, {
                        status: 'auction',
                        isAuction: true,
                        auction: {
                          startingBid: startBid,
                          currentBid: startBid,
                          reservePrice: Math.round(startBid * 1.25),
                          estimateMin: startBid,
                          estimateMax: Math.round(startBid * 1.6),
                          totalBids: 0,
                          endTimestamp: Date.now() + 1000 * 60 * 60 * 48,
                          highestBidder: 'Awaiting first bid',
                          bidHistory: []
                        }
                      });
                      showToast(`🔥 "${art.title}" moved to Live Auction Arena!`);
                      setIsSelectArtModalOpen(false);
                    }}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold uppercase text-[10px] shrink-0 transition"
                  >
                    Activate Auction
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSelectArtModalOpen(false)}
                className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
