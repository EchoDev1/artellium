'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Flame, 
  Gavel, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Award, 
  ArrowRight, 
  X, 
  Lock, 
  Unlock, 
  Eye, 
  Download, 
  Check, 
  DollarSign, 
  Building, 
  Percent, 
  ChevronRight, 
  History, 
  Filter, 
  CreditCard,
  Crown
} from 'lucide-react';

export default function AuctionsPage() {
  const { 
    artworks = [], 
    placeBid, 
    currency, 
    currentUser, 
    isLoggedIn, 
    isBidderRegistered, 
    registerAuctionBidder, 
    auctionBidders = [],
    updateUser 
  } = useStore();

  // Active Tab: 'live' (LIVE NOW), 'upcoming' (UPCOMING), 'past' (PAST AUCTIONS)
  const [activeTab, setActiveTab] = useState('live');

  // Bidder Registration State
  const [isBidderRegModalOpen, setIsBidderRegModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHighValueApprovalModalOpen, setIsHighValueApprovalModalOpen] = useState(false);
  const [selectedHighValueLot, setSelectedHighValueLot] = useState(null);
  const [pendingBidLot, setPendingBidLot] = useState(null);
  
  // Custom Bid Modal State
  const [biddingLot, setBiddingLot] = useState(null);
  const [customBidAmount, setCustomBidAmount] = useState('');
  const [bidSuccessMessage, setBidSuccessMessage] = useState('');
  const [bidError, setBidError] = useState('');

  // Invoice & Settlement Breakdown Modal State
  const [invoiceLot, setInvoiceLot] = useState(null);

  // History Drawer State
  const [historyLotId, setHistoryLotId] = useState(null);

  // Quick In-Modal Bidder Registration Form State
  const [bidderForm, setBidderForm] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '+234 803 123 4567',
    country: currentUser?.country || 'Nigeria',
    city: currentUser?.city || 'Lagos',
    idType: 'International Passport',
    idNumber: 'A08942184',
    biddingTier: 'Standard',
    bankName: 'WEMA Bank PLC'
  });
  const [isRegisteringBidder, setIsRegisteringBidder] = useState(false);
  const [bidderRegSuccessMsg, setBidderRegSuccessMsg] = useState('');

  // Determine if active user is accredited
  const isAccredited = Boolean(isLoggedIn && isBidderRegistered && isBidderRegistered(currentUser));
  const currentBidder = auctionBidders.find(b => 
    (currentUser?.email && b.email?.toLowerCase() === currentUser.email.toLowerCase()) || 
    (currentUser?.id && b.id === currentUser.id) || 
    (currentUser?.name && b.fullName?.toLowerCase() === currentUser.name.toLowerCase())
  );
  const hasHighValueApproval = Boolean(isAccredited && (currentBidder?.highValueApproved || currentBidder?.biddingTier === 'Sovereign'));

  // Flash notification for Power Bid
  const [flashNotice, setFlashNotice] = useState(null);

  // Countdown timer clock tick
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // 1. LIVE NOW LOTS (Orderly Arranged by Lot Number)
  const [liveLots, setLiveLots] = useState([
    {
      id: 'lot-801',
      lotNumber: 'Lot #801',
      artworkId: 'art-102',
      title: 'Warrior of the Bronze Empire',
      artistName: 'Amina Diallo',
      artistTier: 'Heritage Master',
      medium: 'Cast Bronze & Ebony Wood Base',
      dimensions: '85 × 40 × 35 cm',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
      country: 'Benin City, Nigeria 🇳🇬',
      estimateMin: 3000000,
      estimateMax: 4500000,
      startingBid: 2500000,
      currentBid: 3400000,
      reservePrice: 3000000,
      isReserveMet: true,
      totalBids: 14,
      endTimestamp: Date.now() + 1000 * 60 * 60 * 18 + 1000 * 60 * 35, // 18h 35m
      isHighValue: false,
      highestBidder: 'Dr. O. Adebayo (Lagos)',
      bidHistory: [
        { id: 'bh-1', bidder: 'Dr. O. Adebayo (Lagos)', amount: 3400000, time: '3m ago', isPower: false },
        { id: 'bh-2', bidder: 'Johannesburg Contemporary', amount: 3300000, time: '12m ago', isPower: true },
        { id: 'bh-3', bidder: 'Sotheby’s Patron Desk (London)', amount: 3200000, time: '24m ago', isPower: false },
        { id: 'bh-4', bidder: 'Dr. O. Adebayo (Lagos)', amount: 3100000, time: '1h ago', isPower: false },
      ]
    },
    {
      id: 'lot-802',
      lotNumber: 'Lot #802',
      artworkId: 'art-106',
      title: 'Daughters of the Nile',
      artistName: 'Nour El-Din',
      artistTier: 'Master Painter',
      medium: 'Oil on Lined Canvas',
      dimensions: '200 × 140 cm',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=1000',
      country: 'Cairo, Egypt 🇪🇬',
      estimateMin: 4500000,
      estimateMax: 6500000,
      startingBid: 3800000,
      currentBid: 4800000,
      reservePrice: 4200000,
      isReserveMet: true,
      totalBids: 22,
      endTimestamp: Date.now() + 1000 * 60 * 60 * 26 + 1000 * 60 * 12,
      isHighValue: false,
      highestBidder: 'Tariq A. (Dubai)',
      bidHistory: [
        { id: 'bh-5', bidder: 'Tariq A. (Dubai)', amount: 4800000, time: '1m ago', isPower: true },
        { id: 'bh-6', bidder: 'Nairobi Heritage Fund', amount: 4700000, time: '15m ago', isPower: false },
        { id: 'bh-7', bidder: 'Geneva Art Trust', amount: 4600000, time: '30m ago', isPower: false },
      ]
    },
    {
      id: 'lot-803',
      lotNumber: 'Lot #803',
      artworkId: 'art-108',
      title: 'The Golden Benin Queen',
      artistName: 'Amina Diallo',
      artistTier: 'Royal Foundry Guild',
      medium: 'Polished Bronze & 24K Gold Filigree',
      dimensions: '95 × 45 × 40 cm',
      image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1000',
      country: 'Benin City, Nigeria 🇳🇬',
      estimateMin: 8000000,
      estimateMax: 12000000,
      startingBid: 5000000,
      currentBid: 9100000,
      reservePrice: 7500000,
      isReserveMet: true,
      totalBids: 38,
      endTimestamp: Date.now() + 1000 * 60 * 60 * 15 + 1000 * 60 * 45,
      isHighValue: true, // Requires Admin High-Value Approval
      highestBidder: 'Dr. Folake Davies (Lagos)',
      bidHistory: [
        { id: 'bh-8', bidder: 'Dr. Folake Davies (Lagos)', amount: 9100000, time: 'Just now', isPower: true },
        { id: 'bh-9', bidder: 'Sotheby’s Patron Desk (London)', amount: 9000000, time: '2m ago', isPower: false },
        { id: 'bh-10', bidder: 'Nairobi Fine Arts Circle', amount: 8900000, time: '5m ago', isPower: false },
        { id: 'bh-11', bidder: 'Johannesburg Contemporary', amount: 8800000, time: '11m ago', isPower: true },
      ]
    },
    {
      id: 'lot-804',
      lotNumber: 'Lot #804',
      artworkId: 'art-101',
      title: 'The Ancestral Horizon (Master Canvas)',
      artistName: 'Kofi Mensah',
      artistTier: 'Gold Master',
      medium: 'Oil & 24K Gold Leaf on Linen Canvas',
      dimensions: '150 × 120 cm',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
      country: 'Accra, Ghana 🇬🇭',
      estimateMin: 2000000,
      estimateMax: 3200000,
      startingBid: 1500000,
      currentBid: 2200000,
      reservePrice: 2000000,
      isReserveMet: true,
      totalBids: 11,
      endTimestamp: Date.now() + 1000 * 60 * 60 * 32 + 1000 * 60 * 10,
      isHighValue: false,
      highestBidder: 'Aliko Dangote Jr. (Lagos)',
      bidHistory: [
        { id: 'bh-12', bidder: 'Aliko Dangote Jr. (Lagos)', amount: 2200000, time: '10m ago', isPower: true },
        { id: 'bh-13', bidder: 'Accra Contemporary Trust', amount: 2100000, time: '45m ago', isPower: false },
      ]
    },
    {
      id: 'lot-805',
      lotNumber: 'Lot #805',
      artworkId: 'art-104',
      title: 'The Solitary Mask of Oyo',
      artistName: 'Chief Bakare Ogundele',
      artistTier: 'Heritage Carver',
      medium: 'Carved Iroko Wood & Brass Inlay',
      dimensions: '90 × 35 × 25 cm',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1000',
      country: 'Oyo, Nigeria 🇳🇬',
      estimateMin: 1400000,
      estimateMax: 2200000,
      startingBid: 1000000,
      currentBid: 1350000,
      reservePrice: 1500000,
      isReserveMet: false, // Reserve not met yet
      totalBids: 8,
      endTimestamp: Date.now() + 1000 * 60 * 60 * 41 + 1000 * 60 * 20,
      isHighValue: false,
      highestBidder: 'Chief Adeleke (Ibadan)',
      bidHistory: [
        { id: 'bh-14', bidder: 'Chief Adeleke (Ibadan)', amount: 1350000, time: '20m ago', isPower: false },
        { id: 'bh-15', bidder: 'Dakar Folk Arts', amount: 1300000, time: '1h ago', isPower: false },
      ]
    }
  ]);

  // 2. UPCOMING AUCTION SESSIONS
  const upcomingLots = [
    {
      id: 'lot-806',
      lotNumber: 'Lot #806',
      title: 'Royal Dan Ceremonial Mask',
      artistName: 'Chief Bakare Ogundele',
      medium: 'Carved Ebony & Polished Cowrie Shells',
      dimensions: '70 × 30 × 20 cm',
      image: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80&w=1000',
      country: 'Oyo, Nigeria 🇳🇬',
      estimateMin: 2200000,
      estimateMax: 3500000,
      startingBid: 1800000,
      startDate: 'Mar 1, 2026 • 12:00 PM WAT',
      isHighValue: false,
    },
    {
      id: 'lot-807',
      lotNumber: 'Lot #807',
      title: 'Nubian Golden Sunburst',
      artistName: 'Nour El-Din',
      medium: 'Oil & Hand-Beaten Copper Leaf on Canvas',
      dimensions: '180 × 120 cm',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
      country: 'Cairo, Egypt 🇪🇬',
      estimateMin: 5000000,
      estimateMax: 8000000,
      startingBid: 4200000,
      startDate: 'Mar 5, 2026 • 02:00 PM WAT',
      isHighValue: true,
    },
    {
      id: 'lot-808',
      lotNumber: 'Lot #808',
      title: 'Great Benin Oba Memorial Relic Head',
      artistName: 'Amina Diallo',
      medium: 'Antique Lost-Wax Bronze Cast & Ebony Pedestal',
      dimensions: '60 × 40 × 35 cm',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
      country: 'Benin City, Nigeria 🇳🇬',
      estimateMin: 12000000,
      estimateMax: 18000000,
      startingBid: 10000000,
      startDate: 'Mar 10, 2026 • 04:00 PM WAT',
      isHighValue: true,
    }
  ];

  // 3. PAST AUCTIONS & HAMMER REALIZED PRICES
  const pastLots = [
    {
      id: 'past-790',
      lotNumber: 'Lot #790',
      title: 'Oshun Divine River Waters',
      artistName: 'Kofi Mensah',
      medium: 'Oil, Indigo & 24K Gold Leaf on Canvas',
      dimensions: '160 × 130 cm',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
      hammerPrice: 3800000,
      buyersPremium: 380000, // 10%
      totalRealized: 4180000,
      winner: 'Sotheby’s Patron Desk (London)',
      dateClosed: 'Feb 15, 2026',
      totalBids: 29,
      settlementStatus: 'Settled via WEMA Bank Fiduciary',
      payoutStatus: 'Disbursed to Kofi Mensah'
    },
    {
      id: 'past-789',
      lotNumber: 'Lot #789',
      title: 'Kingdoms of the Niger (Bronze Cast)',
      artistName: 'Amina Diallo',
      medium: 'Cast Lost-Wax Bronze',
      dimensions: '90 × 45 × 40 cm',
      image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1000',
      hammerPrice: 6500000,
      buyersPremium: 650000,
      totalRealized: 7150000,
      winner: 'Dr. Folake Davies (Lagos)',
      dateClosed: 'Feb 10, 2026',
      totalBids: 42,
      settlementStatus: 'Settled via WEMA Bank Fiduciary',
      payoutStatus: 'Disbursed to Amina Diallo'
    },
    {
      id: 'past-788',
      lotNumber: 'Lot #788',
      title: 'Serengeti Twilight Horizon',
      artistName: 'Tariq Ndebele',
      medium: 'Earth Pigments & Ash on Canvas',
      dimensions: '180 × 100 cm',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
      hammerPrice: 1900000,
      buyersPremium: 190000,
      totalRealized: 2090000,
      winner: 'Johannesburg Contemporary',
      dateClosed: 'Jan 28, 2026',
      totalBids: 18,
      settlementStatus: 'Settled via WEMA Bank Fiduciary',
      payoutStatus: 'Disbursed to Tariq Ndebele'
    }
  ];

  // Format countdown string
  const formatCountdown = (endTimestamp) => {
    const diff = Math.max(0, endTimestamp - now);
    if (diff === 0) return 'AUCTION CLOSED';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
  };

  // Handle Power Bid (+₦100,000 increment)
  const handlePowerBid = (lot) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isAccredited) {
      setPendingBidLot(lot);
      setIsBidderRegModalOpen(true);
      return;
    }

    if (lot.isHighValue && !hasHighValueApproval) {
      setSelectedHighValueLot(lot);
      setIsHighValueApprovalModalOpen(true);
      return;
    }

    const increment = 100000;
    const newBidAmount = lot.currentBid + increment;
    const bidderName = currentUser?.name ? `${currentUser.name} (You)` : 'Accredited Bidder (You)';

    setLiveLots(prev => prev.map(l => {
      if (l.id === lot.id) {
        return {
          ...l,
          currentBid: newBidAmount,
          totalBids: l.totalBids + 1,
          highestBidder: bidderName,
          isReserveMet: newBidAmount >= l.reservePrice,
          bidHistory: [
            {
              id: `bh-${Date.now()}`,
              bidder: bidderName,
              amount: newBidAmount,
              time: 'Just now',
              isPower: true
            },
            ...l.bidHistory
          ]
        };
      }
      return l;
    }));

    if (placeBid && lot.artworkId) {
      placeBid(lot.artworkId, newBidAmount, bidderName);
    }

    setFlashNotice({
      lotNumber: lot.lotNumber,
      amount: newBidAmount,
      msg: `⚡ POWER BID PLACED! You are now the highest bidder on ${lot.lotNumber} at ${formatPrice(newBidAmount)}.`
    });

    setTimeout(() => setFlashNotice(null), 5000);
  };

  // Open Custom Bid Modal
  const openCustomBidModal = (lot) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isAccredited) {
      setPendingBidLot(lot);
      setIsBidderRegModalOpen(true);
      return;
    }

    if (lot.isHighValue && !hasHighValueApproval) {
      setSelectedHighValueLot(lot);
      setIsHighValueApprovalModalOpen(true);
      return;
    }
    setBiddingLot(lot);
    setCustomBidAmount(lot.currentBid + 100000);
    setBidError('');
    setBidSuccessMessage('');
  };

  // Submit Custom Bid
  const handleCustomBidSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isAccredited) {
      setPendingBidLot(biddingLot);
      setIsBidderRegModalOpen(true);
      return;
    }

    const val = parseFloat(customBidAmount);
    if (!val || val <= biddingLot.currentBid) {
      setBidError(`Bid must exceed current highest bid (${formatPrice(biddingLot.currentBid)})`);
      return;
    }

    const bidderName = currentUser?.name ? `${currentUser.name} (You)` : 'Accredited Bidder (You)';

    setLiveLots(prev => prev.map(l => {
      if (l.id === biddingLot.id) {
        return {
          ...l,
          currentBid: val,
          totalBids: l.totalBids + 1,
          highestBidder: bidderName,
          isReserveMet: val >= l.reservePrice,
          bidHistory: [
            {
              id: `bh-${Date.now()}`,
              bidder: bidderName,
              amount: val,
              time: 'Just now',
              isPower: false
            },
            ...l.bidHistory
          ]
        };
      }
      return l;
    }));

    if (placeBid && biddingLot.artworkId) {
      placeBid(biddingLot.artworkId, val, bidderName);
    }

    setBidSuccessMessage(`🎉 Bid of ${formatPrice(val)} Confirmed! You are currently the highest bidder.`);
    setTimeout(() => {
      setBiddingLot(null);
      setBidSuccessMessage('');
    }, 2000);
  };

  // Instant In-Modal Bidder Accreditation Submit Handler
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
        categories: ['Paintings', 'Sculptures', 'Bronze']
      });
    }

    setTimeout(() => {
      setIsRegisteringBidder(false);
      setBidderRegSuccessMsg(`✓ Accredited Bidder Pass Activated (${bidderId})! You can now place live bids.`);
      setTimeout(() => {
        setIsBidderRegModalOpen(false);
        setBidderRegSuccessMsg('');
        if (pendingBidLot) {
          openCustomBidModal(pendingBidLot);
          setPendingBidLot(null);
        }
      }, 1500);
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans pb-24 text-slate-100">
      {/* Global Flash Notice for Power Bid */}
      {flashNotice && (
        <div className="p-4 bg-emerald-950/90 border-2 border-emerald-400 text-emerald-200 rounded-2xl flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold text-xs sm:text-sm">{flashNotice.msg}</span>
          </div>
          <button onClick={() => setFlashNotice(null)} className="text-slate-400 hover:text-white text-sm font-bold">✕</button>
        </div>
      )}

      {/* Unaccredited Bidder Warning Banner */}
      {!isAccredited && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-black to-amber-950/60 border-2 border-art-gold/50 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-art-gold/20 border border-art-gold/40 text-art-gold flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                <span>Accredited Bidder Protocol</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-art-gold text-[9px] font-mono uppercase">
                  Fiduciary Standard
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                To prevent fraudulent bidding and protect sovereign transactions, <strong className="text-art-gold">only verified registered bidders</strong> can place bids in Artellium auctions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {isLoggedIn ? (
              <button
                onClick={() => setIsBidderRegModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Accredit My Account Now</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            ) : (
              <Link
                href="/login?redirect=/auctions"
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-black" />
                <span>Sign In to Verify Bidder Pass</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* MAJOR TAB CONTROLS: LIVE NOW | UPCOMING | PAST AUCTIONS */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 bg-[#0E1118] p-1.5 rounded-2xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'live'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-crimson-glow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Flame className="w-4 h-4 text-red-300 animate-pulse" />
            <span>LIVE NOW</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 font-mono">
              {liveLots.length} Lots
            </span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'upcoming'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-300" />
            <span>UPCOMING</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 font-mono">
              {upcomingLots.length} Sessions
            </span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'past'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-900 shadow-gold-glow'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span>PAST AUCTIONS</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 font-mono text-slate-300">
              {pastLots.length} Results
            </span>
          </button>
        </div>

        {/* Dynamic Bidder Status Indicator */}
        <div className="flex items-center gap-3">
          {isAccredited ? (
            <button
              onClick={() => setIsBidderRegModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/50 hover:border-emerald-400 px-3.5 py-2 rounded-xl text-xs text-emerald-200 transition shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-[11px]">
                Bidder Pass: <strong className="text-emerald-300">{currentBidder?.bidderId || currentUser?.bidderId || 'ART-BID-88942'} (Accredited)</strong>
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 ml-1" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (!isLoggedIn) setIsAuthModalOpen(true);
                else setIsBidderRegModalOpen(true);
              }}
              className="flex items-center gap-2 bg-amber-950/60 border border-art-gold/50 hover:border-art-gold px-3.5 py-2 rounded-xl text-xs text-art-gold transition shadow-gold-glow cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-art-gold" />
              <span className="font-mono text-[11px] font-bold">
                Bidder Status: <strong className="text-amber-300">Accreditation Required</strong>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-art-gold" />
            </button>
          )}

          <Link
            href="/auctions/register"
            className="hidden sm:inline-flex px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition items-center gap-1.5"
          >
            <span>Full Accreditation Portal</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. LIVE NOW TAB                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-mono uppercase tracking-wider">
              Showing {liveLots.length} Orderly Arranged Auction Lots
            </span>
            <span className="text-red-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>Real-Time Bidding Active</span>
            </span>
          </div>

          <div className="space-y-8">
            {liveLots.map((lot) => {
              const isHighest = lot.highestBidder?.includes('You') || lot.highestBidder?.includes(currentUser?.name || 'Folake');
              const isHistoryOpen = historyLotId === lot.id;

              return (
                <div
                  key={lot.id}
                  className="rounded-3xl overflow-hidden bg-[#0A0D14] border border-art-gold/30 hover:border-art-gold/70 transition-all duration-300 shadow-2xl flex flex-col lg:flex-row gap-6 p-6 relative"
                >
                  {/* High Value Badge Banner */}
                  {lot.isHighValue && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-art-gold via-amber-500 to-transparent text-art-black font-black text-[10px] uppercase px-6 py-1 tracking-widest flex items-center gap-1 shadow">
                      <Crown className="w-3 h-3 text-art-black" />
                      <span>HIGH-VALUE AUCTION LOT</span>
                    </div>
                  )}

                  {/* Artwork Image Column */}
                  <div className="relative lg:w-5/12 aspect-[4/3] rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10">
                    <img
                      src={lot.image}
                      alt={lot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-red-600 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-crimson-glow flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3 fill-current" />
                        <span>LIVE NOW</span>
                      </span>
                      <span className="bg-black/80 backdrop-blur-md text-art-gold font-mono font-bold text-[10px] px-3 py-1 rounded-full border border-art-gold/40">
                        {lot.lotNumber}
                      </span>
                    </div>

                    {/* Reserve Status Overlay */}
                    <div className="absolute bottom-3 left-3">
                      {lot.isReserveMet ? (
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

                  {/* Lot Metadata & Bidding Controls Column */}
                  <div className="flex-1 flex flex-col justify-between space-y-5">
                    
                    {/* Header Info */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
                        <span className="font-mono text-xs font-bold text-art-gold uppercase tracking-wider">
                          {lot.lotNumber} • {lot.country}
                        </span>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400 font-mono">{lot.totalBids} Bids Placed</span>
                          <span className="text-slate-600">•</span>
                          <button
                            onClick={() => setHistoryLotId(isHistoryOpen ? null : lot.id)}
                            className="text-art-gold hover:underline font-mono text-[11px] flex items-center gap-1"
                          >
                            <History className="w-3 h-3" />
                            <span>{isHistoryOpen ? 'Hide Bid Feed' : 'View Bid Log'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Artwork Title & Artist */}
                      <div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {lot.title}
                        </h2>
                        <p className="text-xs text-art-gold font-semibold mt-0.5">
                          Artist: <strong className="text-white">{lot.artistName}</strong> ({lot.artistTier})
                        </p>
                      </div>

                      {/* Medium & Dimensions Required Line */}
                      <p className="text-xs text-slate-300 font-mono bg-white/[0.03] p-2 rounded-xl border border-white/5">
                        {lot.medium} • <span className="text-art-gold font-bold">{lot.dimensions}</span>
                      </p>

                      {/* Estimate & Starting Bid Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block">Estimate Range</span>
                          <span className="font-mono font-bold text-slate-200">
                            {formatPrice(lot.estimateMin)} – {formatPrice(lot.estimateMax)}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block">Starting Price</span>
                          <span className="font-mono font-bold text-slate-300">
                            {formatPrice(lot.startingBid)}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block">Buyer's Premium</span>
                          <span className="font-mono font-bold text-art-gold">
                            10% ({formatPrice(Math.round(lot.currentBid * 0.1))})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Live Clock & Current Bid Action Box */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-black to-red-950/40 border border-red-800/40 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Countdown */}
                        <div className="flex items-center gap-2 text-xs">
                          <Clock className="w-5 h-5 text-red-400 animate-spin" style={{ animationDuration: '10s' }} />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono block">Time Remaining</span>
                            <span className="font-mono font-bold text-red-400 text-sm tracking-wider">
                              {formatCountdown(lot.endTimestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Current Highest Bid */}
                        <div className="sm:text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Highest Bid</span>
                          <div className="font-serif text-2xl sm:text-3xl font-black text-art-gold">
                            {formatPrice(lot.currentBid)}
                          </div>
                        </div>
                      </div>

                      {/* Current Leader Status */}
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Users className="w-3.5 h-3.5 text-art-gold" />
                          <span>High Bidder: <strong className="text-white">{lot.highestBidder}</strong></span>
                        </div>
                        {isHighest && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            👑 You Are Currently Leading!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bidding Action Buttons: PLACE BID & POWER BID */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        onClick={() => openCustomBidModal(lot)}
                        className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-red-600 via-art-red to-red-700 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-crimson-glow flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Gavel className="w-4 h-4" />
                        <span>PLACE BID</span>
                      </button>

                      <button
                        onClick={() => handlePowerBid(lot)}
                        className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-art-black fill-current animate-pulse" />
                        <span>POWER BID (+₦100K)</span>
                      </button>

                      <button
                        onClick={() => setInvoiceLot(lot)}
                        className="px-4 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 border border-white/10"
                        title="Calculate Pro-Forma Invoice & Settlement"
                      >
                        <FileText className="w-4 h-4 text-art-gold" />
                        <span className="hidden sm:inline">Pro-Forma</span>
                      </button>
                    </div>

                    {/* Expandable Bid History Ledger */}
                    {isHistoryOpen && (
                      <div className="p-4 rounded-2xl bg-black/60 border border-art-gold/30 space-y-2.5 animate-fade-in text-xs">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                            Real-Time Bid Audit Ledger ({lot.bidHistory.length} Recorded)
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">
                            Live Gateway Synced
                          </span>
                        </div>

                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {lot.bidHistory.map((bh) => (
                            <div key={bh.id} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 font-mono text-[11px]">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${bh.isPower ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                                <span className="text-slate-200 font-medium">
                                  {bh.bidder} {bh.isPower ? '⚡ (Power Bid)' : ''}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-art-gold font-bold">{formatPrice(bh.amount)}</span>
                                <span className="text-slate-500 text-[10px]">{bh.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. UPCOMING AUCTIONS TAB                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'upcoming' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-mono uppercase tracking-wider">
              Upcoming Curated Auction Sessions ({upcomingLots.length})
            </span>
            <span className="text-cyan-400 font-bold">Catalog Preview & Pre-Registration Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingLots.map((lot) => (
              <div
                key={lot.id}
                className="rounded-3xl overflow-hidden bg-[#0A0D14] border border-cyan-800/40 hover:border-cyan-400 transition-all duration-300 shadow-xl flex flex-col justify-between p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-white/10">
                    <img
                      src={lot.image}
                      alt={lot.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-cyan-950/90 text-cyan-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-cyan-700/60">
                      {lot.lotNumber}
                    </span>
                    {lot.isHighValue && (
                      <span className="absolute top-3 right-3 bg-art-gold text-art-black text-[9px] font-black px-2.5 py-0.5 rounded-full">
                        HIGH VALUE
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase block">
                      {lot.country}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white pt-1">
                      {lot.title}
                    </h3>
                    <p className="text-xs text-art-gold font-semibold">Artist: {lot.artistName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">{lot.medium} • {lot.dimensions}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Estimate:</span>
                      <span className="text-white font-mono font-bold">{formatPrice(lot.estimateMin)} – {formatPrice(lot.estimateMax)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Starting Bid:</span>
                      <span className="text-art-gold font-mono font-bold">{formatPrice(lot.startingBid)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Opens: {lot.startDate}</span>
                  </div>

                  <button
                    onClick={() => alert(`Pre-registration confirmed for ${lot.lotNumber}! You will be alerted 15 minutes before the auction commences.`)}
                    className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-600 text-white font-bold uppercase tracking-wider rounded-xl transition shadow"
                  >
                    Pre-Register for Lot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PAST AUCTIONS TAB & HAMMER REALIZED PRICES                            */}
      {/* ========================================================================= */}
      {activeTab === 'past' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-mono uppercase tracking-wider">
              Historical Realized Auction Hammer Results ({pastLots.length})
            </span>
            <span className="text-art-gold font-bold">Immutable Ledger Verified</span>
          </div>

          <div className="space-y-4">
            {pastLots.map((lot) => (
              <div
                key={lot.id}
                className="p-5 rounded-3xl bg-[#0A0D14] border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black shrink-0 border border-white/10">
                    <img src={lot.image} alt={lot.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-art-gold uppercase">
                      {lot.lotNumber} • Closed {lot.dateClosed}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">{lot.title}</h3>
                    <p className="text-xs text-slate-400">{lot.artistName} • {lot.medium} ({lot.dimensions})</p>
                    <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                      Winning Patron: <strong className="text-white">{lot.winner}</strong> ({lot.totalBids} Bids)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 justify-between w-full md:w-auto">
                  <div className="text-left md:text-right space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Hammer Price</span>
                    <span className="font-serif text-xl font-bold text-art-gold block">
                      {formatPrice(lot.hammerPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Total Realized: {formatPrice(lot.totalRealized)} (+10% Premium)
                    </span>
                  </div>

                  <button
                    onClick={() => alert(`Certificate of Realized Auction Sale for ${lot.lotNumber} downloaded!`)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-mono font-bold border border-white/10 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-art-gold" />
                    <span>Sale Record</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PLACE CUSTOM BID MODAL                                                    */}
      {/* ========================================================================= */}
      {biddingLot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0A0D14] border border-art-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block">
                  AUTHENTICATED BIDDING PORTAL
                </span>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-art-gold" />
                  <span>Place Bid on {biddingLot.lotNumber}</span>
                </h3>
              </div>
              <button
                onClick={() => setBiddingLot(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {bidSuccessMessage ? (
              <div className="p-6 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                <Sparkles className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-sm sm:text-base font-bold text-emerald-300">{bidSuccessMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleCustomBidSubmit} className="space-y-4 text-xs">
                
                {/* Lot Brief */}
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Artwork:</span>
                    <span className="text-white font-bold">{biddingLot.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Highest Bid:</span>
                    <span className="text-art-gold font-mono font-bold">{formatPrice(biddingLot.currentBid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Minimum Allowed Bid:</span>
                    <span className="text-emerald-400 font-mono font-bold">{formatPrice(biddingLot.currentBid + 100000)}</span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-semibold">
                    Your Binding Bid Amount (in NGN ₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-art-gold font-bold text-lg select-none">
                      ₦
                    </span>
                    <input
                      type="number"
                      required
                      min={biddingLot.currentBid + 50000}
                      step={50000}
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-art-gold/50 rounded-2xl text-white font-mono text-xl font-bold focus:border-art-gold focus:outline-none"
                    />
                  </div>
                  {bidError && (
                    <p className="text-red-400 font-semibold text-[11px] pt-1">{bidError}</p>
                  )}
                </div>

                {/* Quick Increment Shortcut Pills */}
                <div className="flex gap-2">
                  {[100000, 250000, 500000, 1000000].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setCustomBidAmount(biddingLot.currentBid + inc)}
                      className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-slate-200 rounded-xl"
                    >
                      + ₦{(inc / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                {/* Fiduciary Commitment Disclaimer */}
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 text-[10.5px] text-slate-400 leading-snug">
                  By submitting this bid, you agree to the Artellium Online Auction House terms. If your bid is highest at close, an official 10% Buyer’s Premium invoice will be generated.
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setBiddingLot(null)}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold uppercase rounded-xl shadow-crimson-glow"
                  >
                    Confirm & Place Bid
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HIGH VALUE AUCTION ADMIN APPROVAL MODAL                                  */}
      {/* ========================================================================= */}
      {isHighValueApprovalModalOpen && selectedHighValueLot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0A0D14] border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-art-gold" />
                <h3 className="font-serif text-lg font-bold text-white">
                  High-Value Auction Clearance Protocol
                </h3>
              </div>
              <button onClick={() => setIsHighValueApprovalModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              <strong>{selectedHighValueLot.lotNumber} ({selectedHighValueLot.title})</strong> is designated as a High-Value Sovereign Masterpiece. Our Curatorial Board and WEMA Fiduciary desk require identity validation before placing binding bids above ₦5,000,000.
            </p>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant KYC Clearance Available</span>
              </div>
              <p className="text-[11px] text-slate-400">
                You can activate your High-Value Bidding Clearance instantly using your verified collector credentials.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setHasHighValueApproval(true);
                setIsHighValueApprovalModalOpen(false);
                alert(`VIP High-Value Bidding Approval Granted for ${selectedHighValueLot.lotNumber}! You may now bid freely.`);
              }}
              className="w-full py-3.5 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow"
            >
              Grant Instant VIP Clearance
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRO-FORMA INVOICE & SETTLEMENT BREAKDOWN MODAL                            */}
      {/* ========================================================================= */}
      {invoiceLot && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#0D0F15] border border-art-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-art-gold uppercase tracking-widest block">
                  PRO-FORMA SETTLEMENT INVOICE
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  Acquisition Statement · {invoiceLot.lotNumber}
                </h3>
              </div>
              <button onClick={() => setInvoiceLot(null)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
            </div>

            <div className="space-y-3 bg-black/50 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between">
                <span className="text-slate-400">Lot:</span>
                <span className="text-white font-bold">{invoiceLot.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Master Artist:</span>
                <span className="text-white">{invoiceLot.artistName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Hammer Estimate:</span>
                <span className="text-art-gold font-mono font-bold">{formatPrice(invoiceLot.currentBid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Buyer's Premium (10%):</span>
                <span className="text-slate-200 font-mono">{formatPrice(Math.round(invoiceLot.currentBid * 0.1))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">WEMA Bank Settlement Fee (Covered by Platform):</span>
                <span className="text-emerald-400 font-mono">₦0 (Waived)</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
                <span className="text-white">Total Fiduciary Invoiced:</span>
                <span className="text-art-gold font-mono">{formatPrice(Math.round(invoiceLot.currentBid * 1.1))}</span>
              </div>
            </div>

            {/* Fiduciary Settlement Guarantee */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">Fiduciary Settlement Guarantee:</span>
              <p className="text-slate-300 text-[11px]">
                Funds are held under secure WEMA Bank corporate custody protocol and released only after curatorial clearance, physical receipt, and certificate of authenticity verification.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setInvoiceLot(null)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase rounded-xl"
              >
                Close Statement
              </button>
              <button
                onClick={() => alert(`Pro-Forma Auction Invoice for ${invoiceLot.lotNumber} downloaded in PDF format.`)}
                className="px-5 py-2.5 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Pro-Forma PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. GUEST AUTH REQUIRED MODAL                                              */}
      {/* ========================================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0A0D14] border border-art-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-art-gold" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Accredited Bidder Authentication
                </h3>
              </div>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-white text-base">✕</button>
            </div>

            <div className="text-center space-y-3 py-2">
              <div className="w-14 h-14 rounded-2xl bg-art-gold/15 border border-art-gold/40 text-art-gold flex items-center justify-center mx-auto shadow-gold-glow">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base font-bold text-white">
                Live Auction Floor Security
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                In compliance with Pan-African fine art fiduciary policies, only verified registered bidders can place bids on live auction lots.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/login?redirect=/auctions"
                className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold hover:brightness-110 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2"
              >
                <span>Sign In to My Account</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </Link>

              <Link
                href="/register?redirect=/auctions"
                className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Create New Account & Accredit</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ACCREDITED BIDDER PROFILE & ENROLLMENT MODAL                           */}
      {/* ========================================================================= */}
      {isBidderRegModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#0A0D14] border border-art-gold/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-xs animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-art-gold" />
                <h3 className="font-serif text-lg font-bold text-white">
                  {isAccredited ? 'Accredited Bidder Pass' : 'Instant Bidder Accreditation'}
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

            {isAccredited ? (
              /* ALREADY ACCREDITED VIEW */
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-black via-[#0D121B] to-black border border-art-gold/60 space-y-3 shadow-gold-glow">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                    <span className="font-serif font-black text-art-gold tracking-widest text-xs">
                      ARTELLIUM AUCTION HOUSE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>ACCREDITED</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Patron Name:</span>
                      <strong className="text-white font-bold">{currentUser?.name || currentBidder?.fullName || 'Accredited Collector'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Accredited Bidder ID:</span>
                      <strong className="text-art-gold font-mono">{currentBidder?.bidderId || currentUser?.bidderId || 'ART-BID-88942'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bidding Clearance:</span>
                      <strong className="text-emerald-300 font-medium">
                        {currentBidder?.biddingTier === 'Sovereign' ? 'Sovereign (Unlimited Live Bidding)' : 'Standard (Up to ₦10,000,000)'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fiduciary Settlement Bond:</span>
                      <strong className="text-slate-200">WEMA Bank PLC (Verified)</strong>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsBidderRegModalOpen(false)}
                    className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold hover:brightness-110 text-black font-black uppercase text-xs tracking-wider rounded-xl transition shadow-gold-glow cursor-pointer"
                  >
                    Return to Live Auction Floor
                  </button>
                </div>
              </div>
            ) : (
              /* INSTANT ENROLLMENT FORM */
              <form onSubmit={handleQuickBidderRegistration} className="space-y-4">
                <p className="text-slate-300 text-xs leading-relaxed">
                  Fill in your identity details below to immediately unlock live bidding credentials across all Artellium auction lots.
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
                      <label className="block text-slate-300 mb-1 font-semibold">Phone (Live SMS Alerts)</label>
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
                      <label className="block text-slate-300 mb-1 font-semibold">Government ID Type</label>
                      <select
                        value={bidderForm.idType}
                        onChange={e => setBidderForm({ ...bidderForm, idType: e.target.value })}
                        className="w-full bg-[#07090E] border border-white/15 rounded-xl p-2.5 text-white focus:border-art-gold focus:outline-none"
                      >
                        <option value="International Passport">International Passport</option>
                        <option value="National Identification (NIN)">National ID (NIN)</option>
                        <option value="Driver's License">Driver's License</option>
                        <option value="Voter's Card">Voter's Card</option>
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

                  <div>
                    <label className="block text-slate-300 mb-1 font-semibold">Bidding Tier</label>
                    <select
                      value={bidderForm.biddingTier}
                      onChange={e => setBidderForm({ ...bidderForm, biddingTier: e.target.value })}
                      className="w-full bg-[#07090E] border border-white/15 rounded-xl p-2.5 text-white font-bold focus:border-art-gold focus:outline-none"
                    >
                      <option value="Standard">Standard Tier (Live Bids up to ₦10,000,000)</option>
                      <option value="Sovereign">Sovereign Tier (Unlimited VIP Live Bidding)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-emerald-300">Instant cryptographic accreditation via WEMA Fiduciary Gateway</span>
                </div>

                <button
                  type="submit"
                  disabled={isRegisteringBidder}
                  className="w-full py-4 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold hover:brightness-110 text-black font-black uppercase text-xs sm:text-sm tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isRegisteringBidder ? (
                    <span>Validating & Issuing Bidder Pass...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-black" />
                      <span>Submit & Activate Accredited Bidder Pass</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
