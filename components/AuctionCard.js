'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Flame, 
  Clock, 
  Gavel, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  User, 
  Zap, 
  Check, 
  AlertCircle, 
  History, 
  FileText, 
  Download,
  X,
  Lock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function AuctionCard({ artwork }) {
  const { 
    placeBid, 
    currency, 
    currentUser, 
    isLoggedIn, 
    isBidderRegistered, 
    registerAuctionBidder, 
    auctionBidders = [] 
  } = useStore();

  const [bidAmount, setBidAmount] = useState('');
  const [biddingOpen, setBiddingOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [bidSuccessMessage, setBidSuccessMessage] = useState('');
  const [bidError, setBidError] = useState('');
  const [flashNotice, setFlashNotice] = useState(null);

  // Accreditation & Auth Modals
  const [isBidderRegModalOpen, setIsBidderRegModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisteringBidder, setIsRegisteringBidder] = useState(false);
  const [bidderRegSuccessMsg, setBidderRegSuccessMsg] = useState('');
  const [bidderForm, setBidderForm] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+234 803 123 4567',
    country: currentUser?.country || 'Nigeria',
    city: currentUser?.city || 'Lagos',
    idType: 'International Passport',
    idNumber: 'A08942184',
    biddingTier: 'Standard'
  });

  const isAccredited = Boolean(isLoggedIn && isBidderRegistered && isBidderRegistered(currentUser));
  const currentBidder = auctionBidders.find(b => 
    (currentUser?.email && b.email?.toLowerCase() === currentUser.email.toLowerCase()) || 
    (currentUser?.id && b.id === currentUser.id) || 
    (currentUser?.name && b.fullName?.toLowerCase() === currentUser.name.toLowerCase())
  );

  // Dynamic values
  const currentBid = artwork.auction?.currentBid || artwork.price;
  const startingBid = artwork.auction?.startingBid || Math.round(currentBid * 0.75);
  const reservePrice = Math.round(currentBid * 0.85);
  const isReserveMet = currentBid >= reservePrice;
  const minBid = currentBid + 100000;
  const estimateMin = Math.round(currentBid * 0.9);
  const estimateMax = Math.round(currentBid * 1.35);
  const lotNumber = artwork.lotNumber || `Lot #${artwork.id?.replace('art-', '80') || '801'}`;
  const dimensions = artwork.dimensions || '120 × 90 cm';
  const medium = artwork.medium || 'Oil on Canvas';

  // Live Bid Feed
  const [bidsFeed, setBidsFeed] = useState([
    { id: 'b-1', bidder: artwork.auction?.lastBidder || 'Dr. O. Adebayo (Lagos)', amount: currentBid, time: 'Just now', isPower: true },
    { id: 'b-2', bidder: 'Johannesburg Contemporary', amount: currentBid - 100000, time: '12m ago', isPower: false },
    { id: 'b-3', bidder: 'Sotheby’s Patron Desk (London)', amount: currentBid - 200000, time: '35m ago', isPower: false }
  ]);

  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 35, seconds: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const handlePlaceBidSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isAccredited) {
      setIsBidderRegModalOpen(true);
      return;
    }

    const parsedBid = parseFloat(bidAmount);
    if (!parsedBid || parsedBid <= currentBid) {
      setBidError(`Bid must exceed current highest bid (${formatPrice(currentBid)})`);
      return;
    }

    const bidderName = currentUser?.name ? `${currentUser.name} (You)` : 'Accredited Bidder (You)';
    placeBid(artwork.id, parsedBid, bidderName);
    
    setBidsFeed(prev => [
      { id: `b-${Date.now()}`, bidder: bidderName, amount: parsedBid, time: 'Just now', isPower: false },
      ...prev
    ]);

    setBidSuccessMessage(`🎉 Success! You are now the highest bidder at ${formatPrice(parsedBid)}`);
    setTimeout(() => {
      setBidSuccessMessage('');
      setBiddingOpen(false);
      setBidAmount('');
      setBidError('');
    }, 2000);
  };

  const handlePowerBid = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isAccredited) {
      setIsBidderRegModalOpen(true);
      return;
    }

    const newAmount = currentBid + 100000;
    const bidderName = currentUser?.name ? `${currentUser.name} (You)` : 'Accredited Bidder (You)';
    placeBid(artwork.id, newAmount, bidderName);

    setBidsFeed(prev => [
      { id: `b-${Date.now()}`, bidder: bidderName, amount: newAmount, time: 'Just now', isPower: true },
      ...prev
    ]);

    setFlashNotice(`⚡ Power Bid Placed! You are leading ${lotNumber} at ${formatPrice(newAmount)}.`);
    setTimeout(() => setFlashNotice(null), 4000);
  };

  const handleQuickBidderRegistration = (e) => {
    e.preventDefault();
    setIsRegisteringBidder(true);

    const bidderId = `ART-BID-${Date.now().toString().slice(-5)}`;
    
    if (registerAuctionBidder) {
      registerAuctionBidder({
        bidderId,
        fullName: bidderForm.fullName || currentUser?.name || 'Accredited Collector',
        email: bidderForm.email || currentUser?.email || 'collector@artellium.com',
        phone: bidderForm.phone || '+234 803 123 4567',
        country: bidderForm.country || 'Nigeria',
        city: bidderForm.city || 'Lagos',
        idType: bidderForm.idType || 'International Passport',
        idNumber: bidderForm.idNumber || 'A08942184',
        biddingTier: bidderForm.biddingTier || 'Standard',
        highValueApproved: bidderForm.biddingTier === 'Sovereign',
        categories: ['Paintings', 'Sculptures']
      });
    }

    setTimeout(() => {
      setIsRegisteringBidder(false);
      setBidderRegSuccessMsg(`✓ Accredited Bidder Pass Activated (${bidderId})! You can now place live bids.`);
      setTimeout(() => {
        setIsBidderRegModalOpen(false);
        setBidderRegSuccessMsg('');
        setBiddingOpen(true);
      }, 1500);
    }, 900);
  };

  const isHighest = bidsFeed[0]?.bidder?.includes('You') || bidsFeed[0]?.bidder?.includes(currentUser?.name || 'Folake');

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-[#0A0D14] border border-art-gold/30 shadow-2xl flex flex-col md:flex-row gap-6 p-6 hover:border-art-gold transition duration-300">
      
      {/* Artwork Image Container */}
      <div className="relative aspect-[4/3] md:w-5/12 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10">
        <img
          src={artwork.image}
          alt={artwork.title}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?q=80&w=1000&auto=format&fit=crop';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-crimson-glow flex items-center gap-1 animate-pulse">
            <Flame className="w-3 h-3 fill-current" />
            <span>LIVE AUCTION</span>
          </span>
          <span className="bg-black/80 backdrop-blur-md text-art-gold font-mono font-bold text-[10px] px-3 py-1 rounded-full border border-art-gold/40">
            {lotNumber}
          </span>
        </div>

        {/* Reserve Met Status */}
        <div className="absolute bottom-3 left-3">
          {isReserveMet ? (
            <span className="bg-emerald-950/90 text-emerald-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/60 flex items-center gap-1 shadow">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Reserve Met</span>
            </span>
          ) : (
            <span className="bg-amber-950/90 text-amber-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-amber-500/60 flex items-center gap-1 shadow">
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Reserve Not Met</span>
            </span>
          )}
        </div>
      </div>

      {/* Auction Details & Bid Arena */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        
        {/* Header Title & Provenance */}
        <div>
          <div className="flex items-center justify-between mb-1 border-b border-white/10 pb-2">
            <span className="text-xs text-art-gold font-mono font-bold uppercase tracking-wider">
              {lotNumber} • {artwork.country || 'Nigeria 🇳🇬'}
            </span>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authenticated Provenance</span>
            </div>
          </div>

          <h3 className="font-serif text-2xl font-bold text-white mb-1 group-hover:text-art-gold transition">
            {artwork.title}
          </h3>
          
          <p className="text-xs text-art-gold font-medium mb-2">
            Master Creator: <strong className="text-white">{artwork.artistName}</strong> ({artwork.artistType || 'Heritage Master'} Tier)
          </p>

          {/* Medium & Dimensions */}
          <p className="text-xs text-slate-300 font-mono bg-white/[0.03] p-2 rounded-xl border border-white/5 mb-3">
            {medium} • <span className="text-art-gold font-bold">{dimensions}</span>
          </p>

          {/* Estimate & Starting Bid Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-3 text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Estimate</span>
              <span className="font-mono font-bold text-slate-200 text-[11px]">
                {formatPrice(estimateMin)} – {formatPrice(estimateMax)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Starting Bid</span>
              <span className="font-mono font-bold text-slate-300 text-[11px]">
                {formatPrice(startingBid)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Buyer's Premium</span>
              <span className="font-mono font-bold text-art-gold text-[11px]">
                10% ({formatPrice(Math.round(currentBid * 0.1))})
              </span>
            </div>
          </div>

          {/* Countdown Clock Bar */}
          <div className="bg-gradient-to-r from-red-950/40 via-black to-red-950/40 p-3.5 rounded-2xl border border-red-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-400 animate-spin" style={{ animationDuration: '8s' }} />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Auction Closes In:</span>
                <div className="flex items-center gap-1 text-sm font-mono font-bold text-red-400">
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span>:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span>:</span>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>
            </div>

            <div className="text-right border-l border-white/10 pl-4">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Current Highest Bid:</span>
              <span className="font-serif text-xl sm:text-2xl font-black text-art-gold">
                {formatPrice(currentBid)}
              </span>
            </div>
          </div>
        </div>

        {/* Flash Notice */}
        {flashNotice && (
          <div className="p-2.5 bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-xs font-bold rounded-xl animate-fade-in text-center">
            {flashNotice}
          </div>
        )}

        {/* Highest Bidder & Action Row */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-art-gold/20 text-art-gold flex items-center justify-center font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <span>
                Leader: <strong className="text-art-gold">{bidsFeed[0]?.bidder}</strong>
              </span>
            </div>
            
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="text-[11px] text-art-gold hover:underline font-mono flex items-center gap-1"
            >
              <History className="w-3.5 h-3.5" />
              <span>{isHistoryOpen ? 'Hide Bid Log' : `${bidsFeed.length} Bids Log`}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
            <button
              onClick={() => {
                setBidAmount(minBid);
                setBiddingOpen(true);
              }}
              className="w-full sm:flex-1 bg-gradient-to-r from-art-red via-red-600 to-art-red hover:brightness-110 text-white font-bold text-xs py-3 rounded-xl transition shadow-crimson-glow flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer"
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>PLACE BID</span>
            </button>

            <button
              onClick={handlePowerBid}
              className="w-full sm:flex-1 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-black text-xs py-3 rounded-xl transition shadow-gold-glow flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current animate-pulse text-art-black" />
              <span>POWER BID (+₦100K)</span>
            </button>

            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="px-3.5 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1 border border-white/10"
              title="View Pro-Forma Acquisition Statement"
            >
              <FileText className="w-3.5 h-3.5 text-art-gold" />
              <span className="hidden sm:inline">Invoice</span>
            </button>
          </div>
        </div>

        {/* Expandable Bid History Ledger */}
        {isHistoryOpen && (
          <div className="p-4 rounded-2xl bg-black/60 border border-art-gold/30 space-y-2 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-1">
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                Real-Time Bid Audit Ledger
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Live Synced</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {bidsFeed.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.02] border border-white/5 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${b.isPower ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                    <span className="text-slate-200">{b.bidder} {b.isPower ? '⚡' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-art-gold font-bold">{formatPrice(b.amount)}</span>
                    <span className="text-slate-500 text-[10px]">{b.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Place Bid Modal */}
      {biddingOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0A0D14] border border-art-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-art-gold font-serif font-bold text-lg">
                <Gavel className="w-5 h-5 text-red-500" />
                <span>Live Auction Bid · {lotNumber}</span>
              </div>
              <button
                onClick={() => setBiddingOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-base"
              >
                ✕
              </button>
            </div>

            {bidSuccessMessage ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center space-y-2">
                <Sparkles className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-emerald-300">{bidSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handlePlaceBidSubmit} className="space-y-4">
                <div className="bg-black/60 p-3.5 rounded-2xl border border-white/10 space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Artwork:</span>
                    <span className="text-white font-medium">{artwork.title}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Current High Bid:</span>
                    <span className="text-art-gold font-mono font-bold">{formatPrice(currentBid)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Minimum Allowed Bid:</span>
                    <span className="text-emerald-400 font-mono font-bold">{formatPrice(minBid)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">
                    Enter Your Bid Amount (NGN ₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-art-gold font-bold text-base select-none">
                      ₦
                    </span>
                    <input
                      type="number"
                      min={minBid}
                      step={50000}
                      required
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-black border border-art-gold/50 rounded-xl text-white font-mono text-base font-bold focus:border-art-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {[100000, 250000, 500000].map(inc => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setBidAmount(currentBid + inc)}
                      className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-300 rounded-lg"
                    >
                      + ₦{(inc / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setBiddingOpen(false)}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold uppercase rounded-xl shadow-crimson-glow"
                  >
                    Submit Bid
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Pro-Forma Invoice Modal (Without Seller Settlement Payout Disclosure) */}
      {isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0D0F15] border border-art-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-art-gold uppercase tracking-widest block">
                  PRO-FORMA ACQUISITION INVOICE
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  {artwork.title} · {lotNumber}
                </h3>
              </div>
              <button onClick={() => setIsInvoiceOpen(false)} className="text-slate-400 hover:text-white text-base font-bold">✕</button>
            </div>

            <div className="space-y-2.5 bg-black/50 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between">
                <span className="text-slate-400">Master Artist:</span>
                <span className="text-white font-medium">{artwork.artistName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Medium & Size:</span>
                <span className="text-slate-300">{medium} ({dimensions})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hammer Bid Estimate:</span>
                <span className="text-art-gold font-mono font-bold">{formatPrice(currentBid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Buyer's Premium (10%):</span>
                <span className="text-slate-200 font-mono">{formatPrice(Math.round(currentBid * 0.1))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">WEMA Bank Fiduciary Protocol:</span>
                <span className="text-emerald-400 font-mono">₦0 (Included)</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
                <span className="text-white">Total Collector Payment:</span>
                <span className="text-art-gold font-mono">{formatPrice(Math.round(currentBid * 1.1))}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsInvoiceOpen(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold uppercase rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => alert(`Pro-Forma Auction Invoice for ${lotNumber} downloaded in PDF format.`)}
                className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Statement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Auth Required Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0A0D14] border border-art-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs animate-fade-in text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-art-gold" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Accredited Bidder Required
                </h3>
              </div>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-white text-base">✕</button>
            </div>

            <div className="text-center space-y-3 py-2">
              <div className="w-14 h-14 rounded-2xl bg-art-gold/15 border border-art-gold/40 text-art-gold flex items-center justify-center mx-auto shadow-gold-glow">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base font-bold text-white">
                Live Bidding Access Restricted
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Only verified, accredited bidders can place bids on live auction lots. Please sign in or create an account to activate your bidder pass.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/login?redirect=/auctions"
                className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold hover:brightness-110 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>

              <Link
                href="/register?redirect=/auctions"
                className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Create New Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Bidder Accreditation Modal */}
      {isBidderRegModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0A0D14] border border-art-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-xs animate-fade-in text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-art-gold" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Instant Bidder Accreditation
                </h3>
              </div>
              <button onClick={() => setIsBidderRegModalOpen(false)} className="text-slate-400 hover:text-white text-base">✕</button>
            </div>

            {bidderRegSuccessMsg && (
              <div className="p-4 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{bidderRegSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleQuickBidderRegistration} className="space-y-4">
              <p className="text-slate-300 text-xs leading-relaxed">
                Complete your quick accreditation below to activate your official Artellium Bidder Pass and place live bids immediately.
              </p>

              <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/10">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Full Legal / Collector Name</label>
                  <input
                    type="text"
                    required
                    value={bidderForm.fullName}
                    onChange={e => setBidderForm({ ...bidderForm, fullName: e.target.value })}
                    placeholder="e.g. Dr. Folake Davies"
                    className="w-full bg-[#07090E] border border-white/15 rounded-xl p-2.5 text-white focus:border-art-gold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Email Address</label>
                    <input
                      type="email"
                      required
                      value={bidderForm.email}
                      onChange={e => setBidderForm({ ...bidderForm, email: e.target.value })}
                      placeholder="e.g. folake@artellium.com"
                      className="w-full bg-[#07090E] border border-white/15 rounded-xl p-2.5 text-white focus:border-art-gold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={bidderForm.phone}
                      onChange={e => setBidderForm({ ...bidderForm, phone: e.target.value })}
                      className="w-full bg-[#07090E] border border-white/15 rounded-xl p-2.5 text-white font-mono focus:border-art-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">ID Type</label>
                    <select
                      value={bidderForm.idType}
                      onChange={e => setBidderForm({ ...bidderForm, idType: e.target.value })}
                      className="w-full bg-[#07090E] border border-white/15 rounded-xl p-2.5 text-white focus:border-art-gold focus:outline-none"
                    >
                      <option value="International Passport">International Passport</option>
                      <option value="National Identification (NIN)">National ID (NIN)</option>
                      <option value="Driver's License">Driver's License</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Document Number</label>
                    <input
                      type="text"
                      required
                      value={bidderForm.idNumber}
                      onChange={e => setBidderForm({ ...bidderForm, idNumber: e.target.value })}
                      className="w-full bg-[#07090E] border border-white/15 rounded-xl p-2.5 text-white font-mono focus:border-art-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] text-emerald-300">Identity cryptographically cleared under WEMA Fiduciary standards</span>
              </div>

              <button
                type="submit"
                disabled={isRegisteringBidder}
                className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold hover:brightness-110 text-black font-black uppercase text-xs tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isRegisteringBidder ? (
                  <span>Activating Bidder Pass...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Submit & Activate Accredited Bidder Pass</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
