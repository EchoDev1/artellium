'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Flame, 
  Eye, 
  Gavel, 
  Clock, 
  Users, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Compass, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  AlertCircle,
  X
} from 'lucide-react';

export default function LiveAuctionExhibitionHub() {
  const { artworks, exhibitions, currency, placeBid, currentUser } = useStore();

  // Active Live Lots data
  const liveAuctionLots = [
    {
      id: 'art-108',
      lotNumber: '808',
      title: 'The Golden Benin Queen',
      artistName: 'Amina Diallo',
      artistAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
      image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1000',
      medium: 'Polished Bronze and Gold Filigree',
      country: 'Benin City, Nigeria 🇳🇬',
      currentBid: 4900000,
      totalBids: 19,
      endTimeHours: 15,
      activeViewers: 68,
      recentBids: [
        { id: 'b-1', bidder: 'Dr. O. Adebayo (Lagos)', amount: 4900000, time: '2m ago', verified: true },
        { id: 'b-2', bidder: 'Geneva Art Trust (Zurich)', amount: 4700000, time: '8m ago', verified: true }
      ]
    },
    {
      id: 'art-106',
      lotNumber: '806',
      title: 'Daughters of the Nile',
      artistName: 'Nour El-Din',
      artistAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=1000',
      medium: 'Oil on Lined Canvas',
      country: 'Cairo, Egypt 🇪🇬',
      currentBid: 4800000,
      totalBids: 22,
      endTimeHours: 52,
      activeViewers: 84,
      recentBids: [
        { id: 'b-4', bidder: 'Tariq A. (Dubai)', amount: 4800000, time: '1m ago', verified: true },
        { id: 'b-5', bidder: 'Nairobi Heritage Fund', amount: 4600000, time: '14m ago', verified: true }
      ]
    }
  ];

  // Active Exhibitions data
  const liveExhibitions = [
    {
      id: 'ex-1',
      hall: 'HALL 01',
      title: 'Echoes of Ancestral Royalty',
      theme: 'Pre-colonial Benin bronzes & terra cotta artifacts',
      curator: 'Dr. Evelyn Carter',
      curatorRole: 'Chief Conservator',
      coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1200',
      activeVisitors: 142,
      artworksCount: 16,
      audioGuideTitle: 'Curator Commentary (Dr. Carter)',
      status: '🟢 LIVE 3D ROOM'
    },
    {
      id: 'ex-2',
      hall: 'HALL 02',
      title: 'Afrofuturism: The Digital Frontier',
      theme: 'Nsibidi cryptograms & 3D speculative visions',
      curator: 'Kofi Mensah',
      curatorRole: 'Biennial Fellow',
      coverImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1200',
      activeVisitors: 98,
      artworksCount: 12,
      audioGuideTitle: 'Atelier Soundscapes',
      status: '🟢 LIVE 3D ROOM'
    }
  ];

  const [selectedLotIndex, setSelectedLotIndex] = useState(0);
  const [selectedExhibitionIndex, setSelectedExhibitionIndex] = useState(0);

  const activeLot = liveAuctionLots[selectedLotIndex];
  const activeExhibition = liveExhibitions[selectedExhibitionIndex];

  // Live countdown timer state
  const [timer, setTimer] = useState({ hours: 14, minutes: 48, seconds: 22 });
  const [bidsFeed, setBidsFeed] = useState(activeLot.recentBids);
  const [currentHighestBid, setCurrentHighestBid] = useState(activeLot.currentBid);
  const [flashNewBid, setFlashNewBid] = useState(false);
  const [userBidNotification, setUserBidNotification] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Manual Bidding Form state
  const [isManualBidOpen, setIsManualBidOpen] = useState(false);
  const [manualBidAmount, setManualBidAmount] = useState('');
  const [bidError, setBidError] = useState('');

  // Synchronize when lot tab changes
  useEffect(() => {
    setBidsFeed(activeLot.recentBids);
    setCurrentHighestBid(activeLot.currentBid);
    setTimer({ hours: activeLot.endTimeHours, minutes: 34, seconds: 15 });
    setIsManualBidOpen(false);
    setBidError('');
  }, [selectedLotIndex]);

  // Countdown timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic simulated live collector bid arrival
  useEffect(() => {
    const simulatedBidders = [
      { name: 'Dr. Folake Davies (Lagos)' },
      { name: 'Sotheby’s Patron Desk (London)' },
      { name: 'Johannesburg Contemporary' },
      { name: 'Nairobi Fine Arts Circle' }
    ];

    const bidTimer = setInterval(() => {
      const randomBidder = simulatedBidders[Math.floor(Math.random() * simulatedBidders.length)];
      const increment = 100000;
      setCurrentHighestBid((prev) => {
        const nextAmount = prev + increment;
        const newBid = {
          id: `b-${Date.now()}`,
          bidder: randomBidder.name,
          amount: nextAmount,
          time: 'Just now',
          verified: true
        };
        setBidsFeed((f) => [newBid, ...f.slice(0, 2)]);
        setFlashNewBid(true);
        setTimeout(() => setFlashNewBid(false), 2000);
        return nextAmount;
      });
    }, 20000);

    return () => clearInterval(bidTimer);
  }, [selectedLotIndex]);

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const openManualBidConsole = (defaultIncrement = 100000) => {
    const suggested = currentHighestBid + defaultIncrement;
    setManualBidAmount(suggested.toLocaleString());
    setBidError('');
    setIsManualBidOpen(true);
  };

  // Instant Power Bid: Exactly 100k above every current bidded price
  const handlePowerBid = () => {
    if (currentUser?.status === 'blocked') {
      alert('⛔ Your account has been permanently blocked by the Security Council.');
      return;
    }
    if (currentUser?.status === 'suspended') {
      alert('⚠️ Your account is temporarily suspended. Bidding is disabled pending compliance review.');
      return;
    }
    if (currentUser?.status === 'frozen') {
      alert('❄️ Your account assets and bids are frozen pending settlement review.');
      return;
    }

    const powerAmount = currentHighestBid + 100000;
    const userBid = {
      id: `b-power-${Date.now()}`,
      bidder: currentUser?.name ? `${currentUser.name} (You)` : 'Verified Collector (You)',
      amount: powerAmount,
      time: 'Just now',
      verified: true,
      isUser: true,
      isPowerBid: true
    };
    setCurrentHighestBid(powerAmount);
    setBidsFeed((prev) => [userBid, ...prev.slice(0, 2)]);
    setFlashNewBid(true);
    setUserBidNotification(`⚡ Power Bid Placed: ₦${powerAmount.toLocaleString()} (+₦100,000 above current price)!`);
    setIsManualBidOpen(false);
    setBidError('');

    if (placeBid && activeLot.id) {
      placeBid(activeLot.id, powerAmount);
    }

    setTimeout(() => {
      setFlashNewBid(false);
      setUserBidNotification('');
    }, 4000);
  };

  const handleManualBidSubmit = (e) => {
    if (e) e.preventDefault();

    if (currentUser?.status === 'blocked') {
      setBidError('⛔ Your account has been permanently blocked by the Security Council.');
      return;
    }
    if (currentUser?.status === 'suspended') {
      setBidError('⚠️ Your account is temporarily suspended. Bidding is disabled pending review.');
      return;
    }
    if (currentUser?.status === 'frozen') {
      setBidError('❄️ Account assets and bids are frozen pending settlement review.');
      return;
    }

    const rawDigits = manualBidAmount.toString().replace(/[^0-9]/g, '');
    const numericAmount = parseInt(rawDigits, 10);

    if (!numericAmount || isNaN(numericAmount)) {
      setBidError('Please enter a valid bid amount in Naira (₦).');
      return;
    }

    if (numericAmount <= currentHighestBid) {
      setBidError(`⚠️ Bid cannot be below or equal to already bidded amount (₦${currentHighestBid.toLocaleString()}).`);
      return;
    }

    // Place the valid user bid
    const userBid = {
      id: `b-user-${Date.now()}`,
      bidder: currentUser?.name ? `${currentUser.name} (You)` : 'Verified Collector (You)',
      amount: numericAmount,
      time: 'Just now',
      verified: true,
      isUser: true
    };
    setCurrentHighestBid(numericAmount);
    setBidsFeed((prev) => [userBid, ...prev.slice(0, 2)]);
    setFlashNewBid(true);
    setUserBidNotification(`🎉 Your bid of ₦${numericAmount.toLocaleString()} has been placed as the highest bid!`);
    setIsManualBidOpen(false);
    setBidError('');

    if (placeBid && activeLot.id) {
      placeBid(activeLot.id, numericAmount);
    }

    setTimeout(() => {
      setFlashNewBid(false);
      setUserBidNotification('');
    }, 4000);
  };

  const applyIncrementToManual = (inc) => {
    const rawDigits = manualBidAmount.toString().replace(/[^0-9]/g, '');
    const currentBase = rawDigits ? parseInt(rawDigits, 10) : currentHighestBid;
    const newAmount = Math.max(currentBase, currentHighestBid) + inc;
    setManualBidAmount(newAmount.toLocaleString());
    setBidError('');
  };

  return (
    <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0e121a] via-[#090b10] to-[#0a0d13] border border-art-gold/30 p-6 sm:p-7 lg:p-8 shadow-2xl space-y-6">
      
      {/* Background Ambience & Glow */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Main Header with Broadcast Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-white font-mono text-[10.5px] font-black uppercase tracking-wider border border-red-500/80 animate-broadcast-flash">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
              </span>
              <span className="tracking-widest font-extrabold text-red-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.75)]">
                LIVE ARENA BROADCAST
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>240+ Active Collectors Online</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Live Auctions & 3D Exhibition Rooms
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time competitive bidding and curated virtual museum tours happening right now on Artellium Africa.
          </p>
        </div>

        {/* Global Action Links */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/auctions"
            className="px-4 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-800/50 font-bold text-xs flex items-center gap-1.5 transition shadow-crimson-glow"
          >
            <Flame className="w-4 h-4 text-red-400" />
            <span>Auction Floor</span>
          </Link>
          <Link
            href="/exhibitions"
            className="px-4 py-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 font-bold text-xs flex items-center gap-1.5 transition shadow-emerald-glow"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>Exhibition Halls</span>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* ========================================================================= */}
        {/* LEFT STAGE: LIVE AUCTION BIDDING ARENA                                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 rounded-2xl bg-black/55 border border-red-900/35 p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          
          <div className="space-y-4">
            {/* Top Lot Switcher */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/40">
                  <Gavel className="w-4 h-4 text-red-400" />
                </span>
                <span className="font-serif text-xs font-bold text-white uppercase tracking-wider">
                  Live Lot In Play
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
                {liveAuctionLots.map((lot, idx) => (
                  <button
                    key={lot.id}
                    onClick={() => setSelectedLotIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg transition font-bold ${
                      selectedLotIndex === idx
                        ? 'bg-red-600 text-white shadow-crimson-glow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Lot #{lot.lotNumber}
                  </button>
                ))}
              </div>
            </div>

            {/* Artwork Preview Card + Details */}
            <div className="flex gap-4 p-3.5 rounded-xl bg-gradient-to-r from-red-950/25 to-black border border-red-900/25 items-center">
              <div className="relative w-24 sm:w-28 aspect-square rounded-xl overflow-hidden shrink-0 border border-red-500/30">
                <img
                  src={activeLot.image}
                  alt={activeLot.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-1.5 left-1.5 bg-red-600 text-white font-bold text-[8.5px] px-2 py-0.5 rounded-md animate-pulse">
                  🔥 LIVE
                </span>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="text-[10px] text-art-gold font-mono uppercase block truncate">
                  Lot #{activeLot.lotNumber} • {activeLot.medium}
                </span>
                <h3 className="font-serif text-lg font-bold text-white truncate">
                  {activeLot.title}
                </h3>
                <p className="text-xs text-slate-300 truncate">
                  By <strong className="text-art-gold">{activeLot.artistName}</strong> • {activeLot.country}
                </p>

                {/* Live Countdown */}
                <div className="flex items-center gap-2 text-xs font-mono pt-1">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-red-400" />
                    <span>Closes in:</span>
                  </span>
                  <span className="font-bold text-red-400 bg-red-950/60 px-2.5 py-0.5 rounded-md text-[11px] border border-red-900/50">
                    {String(timer.hours).padStart(2, '0')}h : {String(timer.minutes).padStart(2, '0')}m : {String(timer.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>

            {/* Highest Bid + Realtime Stream Combined Box */}
            <div className={`p-3.5 rounded-xl border transition-all duration-300 space-y-2.5 ${
              flashNewBid 
                ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]' 
                : 'bg-[#10141d] border-art-gold/30'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block font-medium">
                    Current Highest Bid
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-art-gold">
                    {formatPrice(currentHighestBid)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 font-mono block font-semibold">
                    {activeLot.totalBids + (bidsFeed.length - activeLot.recentBids.length)} Bids Placed
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 justify-end">
                    <Users className="w-3.5 h-3.5 text-red-400" />
                    <span>{activeLot.activeViewers} Bidders Live</span>
                  </span>
                </div>
              </div>

              {/* 2-line Live Bid Stream */}
              <div className="pt-2 border-t border-white/5 space-y-1">
                {bidsFeed.slice(0, 2).map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between text-[11px] text-slate-300 font-mono p-1 rounded bg-white/[0.02]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${bid.isPowerBid ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                      <span className="truncate">
                        {bid.bidder} {bid.isPowerBid ? '⚡' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-art-gold font-bold">{formatPrice(bid.amount)}</span>
                      <span className="text-[10px] text-slate-500">{bid.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {userBidNotification && (
              <div className="text-xs font-bold text-emerald-400 bg-emerald-950/80 p-2 rounded-lg border border-emerald-500/40 text-center animate-fade-in">
                {userBidNotification}
              </div>
            )}
          </div>

          {/* Interactive Quick / Power Bid Section */}
          <div className="space-y-2.5 pt-3 border-t border-white/10">
            {isManualBidOpen ? (
              <form onSubmit={handleManualBidSubmit} className="space-y-3 p-3.5 rounded-xl bg-[#141824] border-2 border-art-gold/60 shadow-2xl animate-fade-in text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-white flex items-center gap-1.5 text-xs">
                    <Gavel className="w-3.5 h-3.5 text-art-gold" />
                    <span>Set Custom Bid Price (in Naira)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsManualBidOpen(false);
                      setBidError('');
                    }}
                    className="text-slate-400 hover:text-white text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                    <span>Current Bid: <strong>₦{currentHighestBid.toLocaleString()}</strong></span>
                    <span className="text-emerald-400 font-semibold">Min valid bid: ₦{(currentHighestBid + 1).toLocaleString()}</span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-art-gold font-bold text-base select-none">
                      ₦
                    </span>
                    <input
                      type="text"
                      value={manualBidAmount}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setManualBidAmount(raw ? parseInt(raw, 10).toLocaleString() : '');
                        setBidError('');
                      }}
                      placeholder={(currentHighestBid + 100000).toLocaleString()}
                      className="w-full pl-8 pr-4 py-2.5 bg-black/90 border border-art-gold/60 rounded-xl text-white font-mono font-bold text-base focus:border-art-gold focus:outline-none shadow-inner"
                      autoFocus
                    />
                  </div>

                  {bidError && (
                    <p className="text-[11px] text-red-400 font-semibold mt-1.5 flex items-center gap-1 bg-red-950/60 p-1.5 rounded-lg border border-red-900/50">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                      <span>{bidError}</span>
                    </p>
                  )}
                </div>

                {/* Quick Add Increments */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[9.5px] text-slate-400 font-mono">Quick Bump:</span>
                  {[50000, 100000, 250000, 500000].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => applyIncrementToManual(inc)}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-mono text-[10px] font-bold transition"
                    >
                      +₦{(inc / 1000)}k
                    </button>
                  ))}
                </div>

                {/* Action Row */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="submit"
                    className="py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-white font-bold uppercase tracking-wider text-xs transition shadow-crimson-glow flex items-center justify-center gap-1.5 animate-flash-crimson hover:animate-none cursor-pointer active:scale-95"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Confirm Bid (₦)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePowerBid}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-art-gold via-amber-400 to-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider text-xs transition shadow-gold-glow flex items-center justify-center gap-1.5 animate-flash-gold hover:animate-none cursor-pointer active:scale-95"
                    title={`Instantly bid ₦${(currentHighestBid + 100000).toLocaleString()} (+₦100k above current bid)`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Power Bid (+₦100k)</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => openManualBidConsole(100000)}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white transition flex items-center justify-center gap-1.5 shadow-crimson-glow animate-flash-crimson hover:animate-none cursor-pointer text-xs active:scale-95"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Quick Bid (Set Price)</span>
                </button>
                
                {/* 1-Click Power Bid: Exactly 100k above current bidded price */}
                <button
                  onClick={handlePowerBid}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-art-gold via-amber-400 to-art-gold hover:brightness-110 text-art-black transition flex flex-col items-center justify-center shadow-gold-glow animate-flash-gold hover:animate-none cursor-pointer text-xs active:scale-95"
                  title={`Click to instantly place ₦${(currentHighestBid + 100000).toLocaleString()}`}
                >
                  <div className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Power Bid (+₦100k)</span>
                  </div>
                  <span className="text-[9.5px] font-mono opacity-90 font-bold">
                    → ₦{(currentHighestBid + 100000).toLocaleString()}
                  </span>
                </button>
              </div>
            )}

            <Link
              href="/auctions"
              className="block w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-center text-xs font-bold border border-white/10 transition"
            >
              Enter Full Auction Arena & Custom Bidding Room →
            </Link>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT STAGE: 3D VIRTUAL EXHIBITION ROOM LIVE PORTAL                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 rounded-2xl bg-black/55 border border-emerald-900/35 p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-xl relative overflow-hidden">
          
          <div className="space-y-4">
            {/* Header & Hall Switcher */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/40">
                  <Eye className="w-4 h-4 text-emerald-400" />
                </span>
                <span className="font-serif text-xs font-bold text-white uppercase tracking-wider">
                  Art Exhibitions & SDGs Forums
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
                {liveExhibitions.map((ex, idx) => (
                  <button
                    key={ex.id}
                    onClick={() => setSelectedExhibitionIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg transition font-bold ${
                      selectedExhibitionIndex === idx
                        ? 'bg-emerald-600 text-white shadow-emerald-glow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ex.hall}
                  </button>
                ))}
              </div>
            </div>

            {/* Immersive 3D Gallery Preview Screen */}
            <div className="relative h-44 sm:h-48 rounded-xl overflow-hidden border border-emerald-500/30 group">
              <img
                src={activeExhibition.coverImage}
                alt={activeExhibition.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Live Status + Visitors */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                <span className="bg-emerald-950/90 text-emerald-300 font-mono text-[9px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1 shadow-emerald-glow">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>3D ROOM LIVE</span>
                </span>
              </div>

              <div className="absolute top-2.5 right-2.5 bg-black/80 px-2.5 py-1 rounded-full border border-white/20 text-[9px] font-mono text-slate-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeExhibition.activeVisitors} Active</span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3.5 right-3.5 space-y-1 text-white">
                <span className="text-[9px] text-art-gold font-mono uppercase tracking-widest block font-bold">
                  {activeExhibition.artworksCount} Masterpieces On View
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-white truncate">
                  {activeExhibition.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-1">
                  {activeExhibition.theme}
                </p>
              </div>
            </div>

            {/* Curator & Audio Commentary Bar */}
            <div className="p-3 rounded-xl bg-[#0d131a] border border-emerald-500/25 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Compass className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <span className="font-serif font-bold text-white block text-xs truncate">{activeExhibition.curator}</span>
                    <span className="text-[10px] text-art-gold font-mono truncate">{activeExhibition.curatorRole}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className={`px-3 py-1 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition shrink-0 ${
                    isAudioPlaying
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-glow'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{isAudioPlaying ? 'Guide Playing 🔊' : 'Play Guide'}</span>
                </button>
              </div>

              <p className="text-[10.5px] text-slate-400 italic">
                "{activeExhibition.audioGuideTitle} — high-fidelity 360° virtual museum rendering."
              </p>
            </div>
          </div>

          {/* Enter 3D Hall Action */}
          <div className="pt-3 border-t border-white/10">
            <Link
              href="/exhibitions"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-emerald-glow"
            >
              <Eye className="w-4 h-4" />
              <span>Explore Exhibitions & SDGs Dialogues</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

      {/* Sleek Compact Bottom Metrics Bar */}
      <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="py-1.5 px-2 rounded-lg bg-white/[0.02] border border-white/5">
          <span className="font-serif text-sm font-bold text-art-gold block leading-tight">
            ₦14.2M+
          </span>
          <span className="text-[8.5px] text-slate-400 uppercase font-mono tracking-wider">Live Volume</span>
        </div>

        <div className="py-1.5 px-2 rounded-lg bg-white/[0.02] border border-white/5">
          <span className="font-serif text-sm font-bold text-red-400 block flex items-center justify-center gap-1 leading-tight">
            <Flame className="w-3 h-3 fill-current" />
            <span>2 Arenas</span>
          </span>
          <span className="text-[8.5px] text-slate-400 uppercase font-mono tracking-wider">Active Bidding</span>
        </div>

        <div className="py-1.5 px-2 rounded-lg bg-white/[0.02] border border-white/5">
          <span className="font-serif text-sm font-bold text-emerald-400 block flex items-center justify-center gap-1 leading-tight">
            <Eye className="w-3 h-3" />
            <span>4 Halls</span>
          </span>
          <span className="text-[8.5px] text-slate-400 uppercase font-mono tracking-wider">Curated 3D Rooms</span>
        </div>

        <div className="py-1.5 px-2 rounded-lg bg-white/[0.02] border border-white/5">
          <span className="font-serif text-sm font-bold text-white block flex items-center justify-center gap-1 leading-tight">
            <ShieldCheck className="w-3 h-3 text-art-gold" />
            <span>WEMA Bank</span>
          </span>
          <span className="text-[8.5px] text-slate-400 uppercase font-mono tracking-wider">Direct Settlement</span>
        </div>
      </div>

    </section>
  );
}
