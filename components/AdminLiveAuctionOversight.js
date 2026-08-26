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
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLiveAuctionOversight() {
  const { 
    artworks = [], 
    updateArtwork, 
    currency, 
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

  const liveLots = artworks.filter((art) => art.status === 'auction');
  const totalVolume = liveLots.reduce((sum, art) => sum + (art.auction?.currentBid || art.price), 0);

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
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

    if (!confirm(`Sovereign Hammer Down for "${art.title}" at ${formatPrice(winningBid)}? This will finalize the auction and dispatch the ${artistPayoutPercentage}% WEMA settlement to ${art.artistName}.`)) {
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

    showToast(`🔨 Gavel Hammered! Lot "${art.title}" settled. ${artistPayoutPercentage}% net split (₦${(winningBid * (artistPayoutPercentage / 100)).toLocaleString()}) queued for WEMA Bank disbursement.`);
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

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
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
                          onClick={() => handleAdminHammerDown(art)}
                          className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-[11px] transition shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <Gavel className="w-3.5 h-3.5 text-art-gold" />
                          <span>Sovereign Hammer Down (Settle & Payout {artistPayoutPercentage}%)</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
          </div>
        )}
      </div>

    </div>
  );
}
