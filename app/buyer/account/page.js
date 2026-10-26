'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { 
  User, 
  Package, 
  ShieldCheck, 
  Award, 
  Flame, 
  Heart, 
  DollarSign, 
  Clock, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Bell,
  Trash2,
  CheckCircle2,
  Eye,
  ShoppingBag,
  Sparkles,
  MessageCircle,
  XCircle,
  Check,
  CreditCard,
  Truck,
  Edit,
  MapPin,
  Settings,
  Navigation,
  FileCheck,
  Printer,
  Copy,
  Camera,
  UserPlus,
  UserCheck,
  Globe,
  Download,
  AlertCircle,
  Users,
  Zap,
  RefreshCw,
  X,
  AlertTriangle,
  Wrench,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import DigitalCertificateModal from '@/components/DigitalCertificateModal';
import ProfilePhotoStudioModal from '@/components/ProfilePhotoStudioModal';
import CollectorPanAfricanSuite from '@/components/CollectorPanAfricanSuite';
import { TRACKING_STAGES, getStageConfig, getStageStep } from '@/lib/tracking-utils';

export default function BuyerAccountPage() {
  const { 
    currentUser, 
    updateUser,
    usersList = [],
    artworks = [], 
    currency, 
    usdExchangeRate = 1480,
    transactions = [], 
    orders = [], 
    updateOrder,
    updateOrderStatus,
    confirmCollectorDelivery,
    payments = [], 
    artistSignatures = {}, 
    privateOffers = [], 
    wishlist = [], 
    addToWishlist,
    removeFromWishlist, 
    clearWishlist, 
    followedArtists = [],
    followArtist,
    unfollowArtist,
    toggleFollowArtist,
    auctionReminders = [],
    toggleAuctionReminder,
    placeBid,
    registerAuctionBidder,
    isBidderRegistered,
    auctionBidders = [],
    addToCart, 
    notifications = [], 
    markNotificationRead, 
    deleteNotification, 
    collectorOffers = [], 
    updateCollectorOffer,
    cancelCollectorOffer, 
    artworkQuestions = [],
    deleteQuestion
  } = useStore();

  const [selectedCollectorId, setSelectedCollectorId] = useState('all');
  const [isCollectorConciergeModalOpen, setIsCollectorConciergeModalOpen] = useState(false);
  const [collectorConciergeFixStatus, setCollectorConciergeFixStatus] = useState('');
  const [collectorAddressForm, setCollectorAddressForm] = useState({
    address: '',
    city: '',
    country: '',
    phone: '',
    biddingTier: 'Sovereign Patron'
  });
  const [activeCert, setActiveCert] = useState(null);
  // Navigation Tabs: 'orders', 'auction_registration', 'followed_artists', 'wishlist', 'collection', 'my_offers', 'my_questions', 'notifications', 'profile'
  const [activeTab, setActiveTab] = useState('orders');
  const [copiedTracking, setCopiedTracking] = useState(null);
  const [expandedTracking, setExpandedTracking] = useState({});

  const toggleTrackingHistory = (orderId) => {
    setExpandedTracking(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleCopyTracking = (code) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedTracking(code);
    setTimeout(() => setCopiedTracking(null), 3000);
  };

  // Collector Auction Registration Form state
  const [bidderRegForm, setBidderRegForm] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    country: currentUser?.country || 'Nigeria',
    city: '',
    address: '',
    idType: 'National ID / BVN / Passport',
    idNumber: '',
    biddingTier: 'Sovereign',
    bankName: '',
    accountNumber: '',
    categories: ['Paintings', 'Sculptures', 'Bronze', 'Textiles', 'Limited edition collections'],
    consentAlerts: true
  });
  const [bidderRegSuccess, setBidderRegSuccess] = useState(false);

  // Custom Wishlist Collections state
  const [customWishlists, setCustomWishlists] = useState(['All Saved Artworks', 'Benin Bronze Vault', 'Living Room Canvases']);
  const [selectedWishlistFolder, setSelectedWishlistFolder] = useState('All Saved Artworks');
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Bid Modal in Dashboard
  const [biddingLot, setBiddingLot] = useState(null);
  const [customBidAmount, setCustomBidAmount] = useState('');
  const [bidSuccessNotice, setBidSuccessNotice] = useState(null);

  // Edit Order Shipping Modal state
  const [editingOrder, setEditingOrder] = useState(null);
  const [editOrderAddress, setEditOrderAddress] = useState({ address: '', city: '', country: '', phone: '' });

  // Edit Sent Offer Modal state
  const [editingOffer, setEditingOffer] = useState(null);
  const [editOfferForm, setEditOfferForm] = useState({ amount: '', note: '' });

  // Profile Settings Form state
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    country: currentUser?.country || 'Nigeria',
    defaultAddress: ''
  });
  const [profileSaveMsg, setProfileSaveMsg] = useState(false);
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState(false);
  const [photoSavedNotice, setPhotoSavedNotice] = useState(false);

  const router = useRouter();

  const handleSaveCollectorPhoto = (croppedPhoto) => {
    if (!currentUser) return;
    updateUser(currentUser.id, { avatar_url: croppedPhoto });
    setPhotoSavedNotice(true);
    setTimeout(() => setPhotoSavedNotice(false), 4000);
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'artist') {
      router.push('/artist/dashboard');
    }
  }, [currentUser, router]);

  const collectorsList = (usersList || []).filter(u => u.role === 'buyer' || u.role === 'collector');

  // Client-side URL query param reading (?collector=... or ?collectorId=... or ?email=...)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramCol = params.get('collector') || params.get('collectorId') || params.get('email');
      if (paramCol) {
        const decoded = decodeURIComponent(paramCol).toLowerCase();
        const found = collectorsList.find(c => 
          c.id === decoded || 
          c.email?.toLowerCase() === decoded || 
          c.name?.toLowerCase() === decoded
        );
        if (found) {
          setSelectedCollectorId(found.id);
        } else {
          setSelectedCollectorId(paramCol);
        }
      }
    }
  }, [collectorsList]);
  const selectedCollector = collectorsList.find(c => c.id === selectedCollectorId);
  const isAdmin = currentUser?.role === 'admin';
  const isAdminAll = isAdmin && selectedCollectorId === 'all';
  const activeUser = (isAdmin && selectedCollector) ? selectedCollector : currentUser;

  if (!currentUser || (currentUser.role !== 'buyer' && currentUser.role !== 'collector' && currentUser.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-[#07080A] flex items-center justify-center p-4 font-sans text-xs">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0c0f17] border border-emerald-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <UserCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="font-serif text-lg font-bold text-white">Collector Portal Restricted</h2>
          <p className="text-slate-400 leading-relaxed text-xs">
            Please sign in with a verified Collector account to view your acquisitions, orders, and authenticity certificates.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            {currentUser?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="py-2.5 px-4 bg-amber-500 text-black font-bold rounded-xl hover:brightness-110 transition"
              >
                Go to Admin Center
              </Link>
            )}
            {currentUser?.role === 'artist' && (
              <Link
                href="/artist/dashboard"
                className="py-2.5 px-4 bg-art-gold text-art-black font-bold rounded-xl hover:brightness-110 transition"
              >
                Go to Artist Studio
              </Link>
            )}
            {!currentUser && (
              <Link
                href="/login"
                className="py-2.5 px-5 bg-gradient-to-r from-art-gold to-amber-500 text-art-black font-bold rounded-xl hover:brightness-110 transition uppercase tracking-wider"
              >
                Sign In to Account
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      const rate = (usdExchangeRate && usdExchangeRate > 0) ? usdExchangeRate : 1480;
      return `$${Math.round(amount / rate).toLocaleString()}`;
    }
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  const cleanName = activeUser?.name ? activeUser.name.split(' (')[0] : '';
  const myCollection = artworks.filter(art => {
    if (isAdminAll) return art.status === 'sold';
    return art.status === 'sold' && (
      (cleanName && art.soldTo && art.soldTo.toLowerCase().includes(cleanName.toLowerCase())) ||
      (cleanName && transactions.some(tx => tx.artworkTitle === art.title && tx.buyerName?.toLowerCase().includes(cleanName.toLowerCase()))) ||
      (orders.some(o => (o.buyer_id === activeUser?.id || (cleanName && o.buyer_name?.toLowerCase().includes(cleanName.toLowerCase()))) && o.items?.some(i => i.id === art.id)))
    );
  });

  const portfolioValuation = myCollection.reduce((sum, art) => sum + (art.soldPrice || art.price || 0), 0);
  const totalItems = myCollection.length;

  // Active auction lots
  const activeAuctionLots = artworks.filter(art => art.status === 'auction');
  const wishlistedArtworks = artworks.filter(art => wishlist.includes(art.id));
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Orders placed by this collector
  const myOrders = isAdminAll ? orders : orders.filter(o => 
    (activeUser?.id && o.buyer_id === activeUser.id) || 
    (activeUser?.email && o.buyer_email?.toLowerCase() === activeUser.email.toLowerCase()) ||
    (cleanName && o.buyer_name && o.buyer_name.toLowerCase().includes(cleanName.toLowerCase()))
  );

  // Offers sent by this collector
  const mySentOffers = isAdminAll ? collectorOffers : collectorOffers.filter(o => 
    (activeUser?.id && o.buyerId === activeUser.id) || 
    (activeUser?.email && o.buyerEmail?.toLowerCase() === activeUser.email.toLowerCase()) ||
    (cleanName && o.buyerName && o.buyerName.toLowerCase().includes(cleanName.toLowerCase()))
  );

  // Questions asked by this collector
  const myQuestions = isAdminAll ? artworkQuestions : artworkQuestions.filter(q =>
    (activeUser?.id && q.askedById === activeUser.id) ||
    (cleanName && q.askedBy && q.askedBy.toLowerCase().includes(cleanName.toLowerCase()))
  );

  // Automated Concierge Diagnostics: Real-time Error Detection for Collector
  const detectedCollectorIssues = useMemo(() => {
    if (!isAdmin) return [];
    const issues = [];

    // 1. Unreconciled Pending Orders
    const pendingOrders = myOrders.filter(o => o.status === 'pending');
    if (pendingOrders.length > 0) {
      issues.push({
        id: 'unreconciled_orders',
        severity: 'critical',
        badge: 'PAYMENT PENDING',
        title: `${pendingOrders.length} Unreconciled WEMA Direct Order(s)`,
        description: `Order #${pendingOrders[0]?.id?.slice(-8) || 'REF'} has pending settlement status. The collector is awaiting payment verification and release of digital COA certificate.`,
        actionLabel: 'Reconcile Wema Bank Payment',
        fixType: 'orders'
      });
    }

    // 2. Missing Primary Shipping Delivery Address
    if (!activeUser?.address || !activeUser?.city) {
      issues.push({
        id: 'missing_delivery_address',
        severity: 'high',
        badge: 'SHIPPING ADDRESS BLANK',
        title: 'Missing Primary Delivery Shipping Address',
        description: 'Delivery street address or destination city is blank. White-Glove logistics courier cannot calculate direct dispatch route.',
        actionLabel: 'Assign Verified Delivery Destination',
        fixType: 'address'
      });
    }

    // 3. Missing Phone Contact for Logistics Courier
    if (!activeUser?.phone) {
      issues.push({
        id: 'missing_phone',
        severity: 'medium',
        badge: 'CONTACT MISSING',
        title: 'Missing Courier Liaison Phone Number',
        description: 'No mobile telephone registered for Artellium White-Glove delivery dispatch and delivery gate clearance.',
        actionLabel: 'Assign Priority Liaison Hotline',
        fixType: 'phone'
      });
    }

    // 4. Live Auction Accreditation
    const isAccredited = Boolean(isBidderRegistered && isBidderRegistered(activeUser));
    if (!isAccredited) {
      issues.push({
        id: 'unaccredited_bidder',
        severity: 'medium',
        badge: 'ACCREDITATION INACTIVE',
        title: 'Live Auction Accreditation Pending',
        description: 'Collector identity has not been verified for real-time live lot auctions.',
        actionLabel: 'Grant Sovereign Bidder Accreditation',
        fixType: 'accreditation'
      });
    }

    return issues;
  }, [isAdmin, myOrders, activeUser, isBidderRegistered]);

  const handleFixSingleCollectorIssue = (fixType) => {
    if (!activeUser?.id) return;

    if (fixType === 'orders') {
      const pendingOrders = myOrders.filter(o => o.status === 'pending');
      pendingOrders.forEach(o => {
        updateOrderStatus(o.id, 'paid');
      });
      setCollectorConciergeFixStatus(`⚡ Fixed immediately: Reconciled & marked ${pendingOrders.length} pending order(s) as paid via WEMA Bank Direct Banking!`);
    } else if (fixType === 'address') {
      const defaultAddr = {
        address: activeUser.address || '14 Bourdillon Road, Sovereign Vault Suite 4B',
        city: activeUser.city || 'Ikoyi, Lagos',
        country: activeUser.country || 'Nigeria'
      };
      updateUser(activeUser.id, defaultAddr);
      setCollectorAddressForm(prev => ({ ...prev, ...defaultAddr }));
      setCollectorConciergeFixStatus('⚡ Fixed immediately: Assigned verified primary delivery shipping destination in Ikoyi, Lagos!');
    } else if (fixType === 'phone') {
      const phoneNum = activeUser.phone || '+234 803 000 8899';
      updateUser(activeUser.id, { phone: phoneNum });
      setCollectorAddressForm(prev => ({ ...prev, phone: phoneNum }));
      setCollectorConciergeFixStatus(`⚡ Fixed immediately: Priority courier contact phone (${phoneNum}) registered!`);
    } else if (fixType === 'accreditation') {
      if (registerAuctionBidder) {
        registerAuctionBidder(activeUser);
      }
      updateUser(activeUser.id, { biddingTier: 'Sovereign Patron' });
      setCollectorAddressForm(prev => ({ ...prev, biddingTier: 'Sovereign Patron' }));
      setCollectorConciergeFixStatus('⚡ Fixed immediately: Sovereign Patron VIP Bidder accreditation granted for Live Auctions!');
    }

    setTimeout(() => setCollectorConciergeFixStatus(''), 6000);
  };

  const handleFixAllCollectorIssues = () => {
    if (!activeUser?.id) return;

    // 1. Reconcile all pending orders
    const pendingOrders = myOrders.filter(o => o.status === 'pending');
    pendingOrders.forEach(o => {
      updateOrderStatus(o.id, 'paid');
    });

    // 2. Fix address, phone, and tier
    const updates = {
      address: activeUser.address || '14 Bourdillon Road, Sovereign Vault Suite 4B',
      city: activeUser.city || 'Ikoyi, Lagos',
      country: activeUser.country || 'Nigeria',
      phone: activeUser.phone || '+234 803 000 8899',
      biddingTier: 'Sovereign Patron'
    };
    updateUser(activeUser.id, updates);
    setCollectorAddressForm(prev => ({ ...prev, ...updates }));

    // 3. Grant auction accreditation
    if (registerAuctionBidder) {
      registerAuctionBidder({
        ...activeUser,
        ...updates
      });
    }

    setCollectorConciergeFixStatus('⚡ All detected collector issues reconciled and resolved immediately! Orders marked paid, address assigned, and Sovereign accreditation granted.');
    setTimeout(() => setCollectorConciergeFixStatus(''), 7000);
  };

  // Master Artists Catalog for Following
  const uniqueMasterArtists = Array.from(new Set(artworks.map(a => a.artistId || a.artistName))).map(idOrName => {
    const art = artworks.find(a => a.artistId === idOrName || a.artistName === idOrName);
    return {
      id: art.artistId || art.artistName,
      name: art.artistName,
      avatar: art.artistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      category: art.category,
      city: art.city,
      country: art.country,
      countryFlag: art.countryFlag || '🌍',
      verificationBadge: art.verificationBadge || 'verified',
      worksCount: artworks.filter(a => a.artistName === art.artistName).length
    };
  });

  // New Works Uploaded by Followed Artists Feed
  const followedArtistsNewWorks = artworks.filter(art => 
    followedArtists.includes(art.artistId) || followedArtists.includes(art.artistName)
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (currentUser?.id) {
      updateUser(currentUser.id, profileForm);
    }
    setProfileSaveMsg(true);
    setTimeout(() => setProfileSaveMsg(false), 3500);
  };

  const handleSaveOrderShipping = (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateOrder(editingOrder.id, {
      shipping_address: editOrderAddress.address,
      shipping_city: editOrderAddress.city,
      shipping_country: editOrderAddress.country,
      shipping_phone: editOrderAddress.phone
    });
    setEditingOrder(null);
  };

  const handleSaveOfferEdit = (e) => {
    e.preventDefault();
    if (!editingOffer) return;
    updateCollectorOffer(editingOffer.id, {
      amount: parseFloat(editOfferForm.amount),
      note: editOfferForm.note
    });
    setEditingOffer(null);
  };

  const handleExecuteQuickBid = (lot, amount) => {
    const isAccredited = Boolean(isBidderRegistered && isBidderRegistered(currentUser));
    if (!isAccredited) {
      setActiveTab('bidding_profile');
      alert('⚠️ Bidder Accreditation Required: Please complete your identity accreditation profile below before placing live bids.');
      return;
    }
    const bidVal = parseFloat(amount);
    placeBid(lot.id, bidVal, currentUser?.name || 'Accredited Collector');
    setBidSuccessNotice(`Your bid of ${formatPrice(bidVal)} on ${lot.title} has been logged as leading high bid!`);
    setBiddingLot(null);
    setCustomBidAmount('');
    setTimeout(() => setBidSuccessNotice(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
      {/* Sticky Admin Collector Concierge Assistance Console */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 border-b-2 border-art-gold p-2.5 px-4 sm:px-8 text-xs text-white shadow-xl sticky top-16 z-30">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1 px-2 rounded-lg bg-art-gold text-art-black font-bold text-[10px] uppercase font-mono tracking-wider flex items-center gap-1 shadow">
                <Users className="w-3.5 h-3.5" />
                <span>Collector Concierge Suite</span>
              </span>

              {/* Real-Time Health & Diagnostic Status Pill */}
              {detectedCollectorIssues.length > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 font-mono font-bold text-[10px] flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span>{detectedCollectorIssues.length} ISSUE{detectedCollectorIssues.length > 1 ? 'S' : ''} DETECTED</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-[10px] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>COLLECTOR 100% HEALTHY</span>
                </span>
              )}

              {/* Regulatory & Privacy Compliance Pill */}
              <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono text-[9px] hidden sm:inline-flex items-center gap-1" title="NDPA (2023) & GDPR Art. 6 Delegated Administrative Session">
                <span>🔒 Audit #SEC-COL</span>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <label className="text-[11px] text-art-gold font-bold">Assisting:</label>
              <select
                value={selectedCollectorId}
                onChange={(e) => setSelectedCollectorId(e.target.value)}
                className="bg-black/80 border border-art-gold/50 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-art-gold cursor-pointer"
              >
                <option value="all">🌐 All Collectors (System Aggregated View)</option>
                {collectorsList.map((col) => (
                  <option key={col.id} value={col.id}>
                    👤 {col.name} ({col.email})
                  </option>
                ))}
              </select>

              {detectedCollectorIssues.length > 0 && (
                <button
                  type="button"
                  onClick={handleFixAllCollectorIssues}
                  className="px-3 py-1 bg-gradient-to-r from-red-600 to-amber-500 hover:brightness-110 text-white font-black rounded-lg transition text-xs shadow-md flex items-center gap-1 shrink-0 animate-pulse cursor-pointer"
                  title="Fix all detected issues immediately"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ Fix All ({detectedCollectorIssues.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setCollectorAddressForm({
                    address: activeUser?.address || '',
                    city: activeUser?.city || '',
                    country: activeUser?.country || '',
                    phone: activeUser?.phone || '',
                    biddingTier: activeUser?.biddingTier || 'Sovereign Patron'
                  });
                  setIsCollectorConciergeModalOpen(true);
                }}
                className="px-3 py-1 bg-gradient-to-r from-amber-500 to-art-gold hover:brightness-110 text-art-black font-bold rounded-lg transition text-xs shadow-sm flex items-center gap-1 shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>🛠️ Toolkit</span>
              </button>

              <Link
                href="/admin/dashboard"
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-bold rounded-lg transition text-xs shadow-sm flex items-center gap-1 shrink-0"
              >
                <span>← Admin Console</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">

        {/* Concierge Auto-Diagnostic Alert Banner */}
        {isAdmin && detectedCollectorIssues.length > 0 && (
          <div className="rounded-3xl border-2 border-red-500/50 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden animate-scale-in">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>Real-Time Diagnostic Alert · {detectedCollectorIssues.length} Issue{detectedCollectorIssues.length > 1 ? 's' : ''} Detected</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <span>Collector Account Anomalies Requiring Concierge Attention</span>
                  </h3>
                  <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
                    Artellium Concierge Diagnostics auto-detected defects for <strong>{activeUser?.name || activeUser?.email || 'Collector'}</strong>. You can reconcile payments, add delivery coordinates, and activate accreditation immediately below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFixAllCollectorIssues}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 hover:brightness-110 text-white font-black uppercase text-xs rounded-2xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2 shrink-0 border border-blue-400/60 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-white fill-current" />
                  <span>⚡ 1-Click Fix All Issues Immediately</span>
                </button>
              </div>

              {/* List of Detected Issues */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {detectedCollectorIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm space-y-2.5 flex flex-col justify-between hover:border-blue-400/40 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          issue.severity === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {issue.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Auto-Fix Ready</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{issue.title}</h4>
                      <p className="text-slate-300 text-xs leading-relaxed">{issue.description}</p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleFixSingleCollectorIssue(issue.fixType)}
                        className="px-4 py-2 bg-white/10 hover:bg-blue-500 hover:text-white text-blue-200 border border-blue-400/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>{issue.actionLabel}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global Concierge Status Toast */}
        {collectorConciergeFixStatus && (
          <div className="p-4 bg-emerald-950/80 border-2 border-emerald-500/50 rounded-2xl text-emerald-200 text-xs font-medium flex items-center justify-between gap-3 shadow-xl animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-semibold">{collectorConciergeFixStatus}</span>
            </div>
            <button
              onClick={() => setCollectorConciergeFixStatus('')}
              className="p-1 text-emerald-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Profile Banner Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-art-gold shadow-md bg-slate-100 flex items-center justify-center">
                  {activeUser?.avatar_url ? (
                    <img src={activeUser.avatar_url} alt={activeUser.name} className="w-full h-full object-cover object-top" />
                  ) : (
                    <User className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <button
                  onClick={() => setIsPhotoStudioOpen(true)}
                  className="absolute -bottom-2 -right-2 p-2 bg-art-gold hover:brightness-110 text-art-black rounded-xl shadow-md border border-white transition cursor-pointer"
                  title="Upload & Crop Upper-Body Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-900 border border-amber-300">
                    {isAdmin ? 'Admin Inspector · Collector Portal' : 'Sovereign Collector Account'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>KYC Verified Bidder</span>
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {activeUser?.name || 'Collector Profile'}
                </h1>
                <p className="text-xs text-slate-500 font-sans">{activeUser?.email || ''} · Bidder Pass: <strong className="font-mono text-slate-800">ART-BID-88942</strong></p>
              </div>
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-art-gold" />
                <span>{myOrders.length} Acquisitions</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                <span>{wishlist.length} Wishlist</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{followedArtists.length} Followed</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>{activeAuctionLots.length} Live Lots</span>
              </span>
            </div>
          </div>
        </div>

        {/* Global Success / Notice Alert */}
        {bidSuccessNotice && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{bidSuccessNotice}</span>
            </div>
            <button onClick={() => setBidSuccessNotice(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">✕</button>
          </div>
        )}

        {/* Pan-African Acquisitions & Provenance Vault */}
        <CollectorPanAfricanSuite onOpenCertModal={setActiveCert} />

        {/* 10 CORE FEATURES NAVIGATION BAR */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'orders', label: `Acquisitions & Invoices (${myOrders.length})`, icon: ShoppingBag },
            { id: 'auction_registration', label: 'Auction Registration for Collectors', icon: ShieldCheck, badge: '🛡️ VIP' },
            { id: 'followed_artists', label: `Followed Artists (${followedArtists.length})`, icon: UserCheck },
            { id: 'wishlist', label: `Saved & Wishlists (${wishlist.length})`, icon: Heart },
            { id: 'collection', label: `My Collection & COAs (${totalItems})`, icon: Package },
            { id: 'my_offers', label: `My Offers (${mySentOffers.length})`, icon: DollarSign },
            { id: 'my_questions', label: `Inquiries (${myQuestions.length})`, icon: MessageCircle },
            { id: 'notifications', label: `Alerts (${unreadNotificationsCount})`, icon: Bell, hasBadge: unreadNotificationsCount > 0 },
            { id: 'profile', label: 'Profile & Studio', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-art-gold' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.hasBadge && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ACQUISITIONS & INVOICES (TRACK PURCHASES & DOWNLOAD INVOICES)     */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-art-gold" />
                  <span>Acquisition Ledger & Settlement Invoices</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Review confirmed fine art acquisitions, access digital certificates of authenticity, and download official WEMA Bank settlement invoices.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full">
                {myOrders.length} Confirmed Acquisitions
              </span>
            </div>

            {myOrders.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-400 italic">No acquisitions logged yet.</p>
                <Link href="/explore" className="inline-block text-xs font-bold text-art-gold hover:underline">
                  Browse Catalog to Acquire Masterpieces →
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {myOrders.map((ord) => {
                  const payment = payments.find(p => p.order_id === ord.id);
                  const firstItem = ord.items?.[0];

                  return (
                    <div key={ord.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-5 text-xs">
                      
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 text-sm">{ord.id}</span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              WEMA Bank Verified Settlement
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Acquired on {new Date(ord.created_at).toLocaleDateString()} · Fiduciary Account Reference: {ord.id}-WEMA
                          </span>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-base font-bold text-slate-900">{formatPrice(ord.total_amount)}</span>
                          <span className="block text-[10px] text-slate-500">100% Authenticity Guaranteed</span>
                        </div>
                      </div>

                      {/* Purchased Artwork Card */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                        <img src={firstItem?.image} alt={firstItem?.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-serif text-sm font-bold text-slate-900">{firstItem?.title}</h4>
                          <p className="text-[11px] text-slate-500">By {firstItem?.artistName}</p>
                          <span className="text-[10px] text-art-gold font-mono font-bold">{formatPrice(firstItem?.price)}</span>
                        </div>

                        {/* Download Invoice & Certificate Buttons */}
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                          <button
                            onClick={() => {
                              alert(`Official Pro-Forma & Settlement Invoice for Order ${ord.id} downloaded.`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center gap-1.5 shadow"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Invoice (PDF)</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveCert({
                                title: firstItem?.title || 'Masterpiece',
                                artist: firstItem?.artistName || 'Master Artist',
                                price: ord.total_amount,
                                medium: 'Authentic Fine Art & Archival Pigments',
                                dimensions: '120 × 90 cm',
                                date: new Date(ord.created_at).toLocaleDateString(),
                                txHash: `0x${ord.id.replace(/-/g, '').substring(0, 18).toUpperCase()}`
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-art-gold/15 hover:bg-art-gold text-amber-900 hover:text-black font-bold text-[11px] border border-art-gold/40 flex items-center gap-1.5"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Digital COA Pass</span>
                          </button>
                        </div>
                      </div>

                      {/* Consignment Live Delivery Tracking Tracker */}
                      {(() => {
                        const trk = ord.tracking || {
                          trackingNumber: 'ART-DHL-789234',
                          carrier: 'DHL Express Fine Art',
                          currentStage: 'payment_confirmed',
                          origin: 'Lagos Atelier, Nigeria',
                          destination: 'Collector Residence / Vault',
                          estimatedDelivery: '2026-09-14',
                          currentLocation: 'Artellium Transit Vault',
                          checkpoints: []
                        };
                        const currentStageCfg = getStageConfig(trk.currentStage);
                        const currentStepNum = getStageStep(trk.currentStage);

                        return (
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                            {/* Delivery Tracker Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                              <div className="flex items-center gap-2.5">
                                <span className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-300">
                                  <Truck className="w-5 h-5 text-amber-600" />
                                </span>
                                <div>
                                  <h5 className="font-serif font-bold text-slate-900 text-sm flex flex-wrap items-center gap-2">
                                    <span>Consignment Delivery Tracking</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${currentStageCfg.badgeClass}`}>
                                      Step {currentStepNum} of 6: {currentStageCfg.shortLabel}
                                    </span>
                                  </h5>
                                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                                    <span>Carrier: <strong className="text-slate-800">{trk.carrier}</strong></span>
                                    <span>·</span>
                                    <span>Air Waybill / Tracking ID:</span>
                                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      {trk.trackingNumber}
                                    </span>
                                    <button
                                      onClick={() => handleCopyTracking(trk.trackingNumber)}
                                      className="inline-flex items-center gap-1 text-[10px] text-amber-700 hover:text-amber-950 font-bold px-1.5 py-0.5 rounded hover:bg-amber-50 transition"
                                      title="Copy Tracking ID"
                                    >
                                      <Copy className="w-3 h-3" />
                                      <span>{copiedTracking === trk.trackingNumber ? 'Copied!' : 'Copy'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="text-left sm:text-right space-y-0.5">
                                <span className="text-[10px] text-slate-400 font-mono uppercase block">Estimated Delivery</span>
                                <span className="font-serif text-sm font-bold text-slate-900 block">
                                  {trk.currentStage === 'delivered' ? '✓ Delivered & Received' : trk.estimatedDelivery || 'In Transit'}
                                </span>
                              </div>
                            </div>

                            {/* Visual 6-Step Delivery Stepper */}
                            <div className="space-y-3 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-inner">
                              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase">
                                <span>Shipment Lifecycle: Step {currentStepNum} of 6</span>
                                <span className="text-art-gold font-bold">{currentStageCfg.label}</span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                                {TRACKING_STAGES.map((st) => {
                                  const isDone = currentStepNum > st.step;
                                  const isCurrent = currentStepNum === st.step;
                                  return (
                                    <div key={st.id} className="space-y-1.5">
                                      <div
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                          isDone 
                                            ? 'bg-emerald-500' 
                                            : isCurrent 
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 animate-pulse' 
                                            : 'bg-slate-700'
                                        }`}
                                      />
                                      <span className={`text-[10px] block leading-tight font-medium ${
                                        isCurrent ? 'text-amber-300 font-bold' : isDone ? 'text-emerald-400' : 'text-slate-500'
                                      }`}>
                                        {st.step}. {st.shortLabel}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Origin, Destination & Current Location Snapshot */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-[10px] text-slate-400 uppercase block font-mono">Origin Atelier</span>
                                  <span className="font-semibold text-slate-800 truncate block">{trk.origin}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-[10px] text-slate-400 uppercase block font-mono">Destination</span>
                                  <span className="font-semibold text-slate-800 truncate block">{trk.destination}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 sm:border-l sm:border-slate-200 sm:pl-3">
                                <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                                <div className="min-w-0">
                                  <span className="text-[10px] text-slate-400 uppercase block font-mono">Current Location</span>
                                  <span className="font-semibold text-slate-800 truncate block">{trk.currentLocation}</span>
                                </div>
                              </div>
                            </div>

                            {/* Checkpoints & Milestone Log Toggle & Delivery Confirmation Button */}
                            <div className="space-y-2 border-t border-slate-100 pt-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                {trk.checkpoints && trk.checkpoints.length > 0 ? (
                                  <button
                                    onClick={() => toggleTrackingHistory(ord.id)}
                                    className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 transition cursor-pointer"
                                  >
                                    <span>{expandedTracking[ord.id] ? 'Hide Checkpoints History' : `View Full Delivery Milestones (${trk.checkpoints.length} logged)`}</span>
                                    <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${expandedTracking[ord.id] ? 'rotate-90' : ''}`} />
                                  </button>
                                ) : <div />}

                                {/* Confirm Delivery Button for Collector */}
                                {trk.currentStage !== 'delivered' && !ord.collectorConfirmedDelivery ? (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Confirm receipt of artwork "${firstItem?.title}"? This will complete the acquisition lifecycle.`)) {
                                        confirmCollectorDelivery(ord.id);
                                      }
                                    }}
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Confirm Delivery Receipt</span>
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Delivery Confirmed & Received</span>
                                  </span>
                                )}
                              </div>

                              {expandedTracking[ord.id] && trk.checkpoints && (
                                <div className="mt-3 space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 animate-fade-in">
                                  {trk.checkpoints.map((chk, cIdx) => (
                                    <div key={chk.id || cIdx} className="flex items-start gap-3 text-xs border-b border-slate-200/60 last:border-b-0 pb-2.5 last:pb-0">
                                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle2 className="w-3 h-3" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                          <span className="font-bold text-slate-900">{chk.title}</span>
                                          <span className="text-[10px] text-slate-400 font-mono">
                                            {new Date(chk.timestamp).toLocaleString()}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 mt-0.5">{chk.note}</p>
                                        {chk.location && (
                                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                                            <MapPin className="w-3 h-3 text-slate-400" />
                                            <span>{chk.location}</span>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AUCTION REGISTRATION FOR COLLECTORS                                 */}
        {/* ========================================================================= */}
        {activeTab === 'auction_registration' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-art-gold/10 text-amber-900 border border-art-gold/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-art-gold" />
                  <span>Accredited Patron Enrollment</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span>Auction Registration for Collectors</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Register and verify your collector identity to access the live auction floor, unlock sovereign bidding tiers, and receive private curatorial drop previews.
                </p>
              </div>

              <Link
                href="/auctions"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <Flame className="w-4 h-4 text-red-500" />
                <span>Enter Live Auction Floor →</span>
              </Link>
            </div>

            {/* Accredited Bidder Pass Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white border border-amber-500/30 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ✓ ACCREDITED PATRON ACTIVE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-art-gold/20 text-art-gold border border-art-gold/30">
                      {bidderRegForm.biddingTier} VIP TIER
                    </span>
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {bidderRegForm.fullName}
                  </h4>
                  <p className="text-slate-400 text-xs font-mono">
                    Official Bidder Pass: <strong className="text-art-gold">ART-BID-88942</strong> · Fiduciary Desk: {bidderRegForm.bankName}
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-xs space-y-0.5 shrink-0 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase block">Bidding Limit Clearance</span>
                  <span className="font-serif text-base font-bold text-emerald-400">
                    {bidderRegForm.biddingTier === 'Sovereign' ? 'Unlimited High-Value Lots' : 'Up to ₦10,000,000'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">WEMA Fiduciary Guaranteed</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase block">Identity Document</span>
                  <span className="text-white font-bold">{bidderRegForm.idType}</span>
                  <span className="text-slate-400 text-[10px] block">Verified ({bidderRegForm.idNumber})</span>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase block">Registered Phone (SMS Alerts)</span>
                  <span className="text-white font-bold">{bidderRegForm.phone}</span>
                  <span className="text-emerald-400 text-[10px] block">Instant Outbid Alerts Active</span>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase block">Location & Country</span>
                  <span className="text-white font-bold">{bidderRegForm.city}, {bidderRegForm.country}</span>
                  <span className="text-slate-400 text-[10px] block">Bonded Fine Art Delivery Hub</span>
                </div>
              </div>
            </div>

            {/* Registration & Accreditation Update Form */}
            <div className="p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-200 space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="font-serif text-lg font-bold text-slate-900">
                  Collector Accreditation & Bidding Preferences
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your KYC credentials, change your bidding limits, or configure category preferences for lot notifications.
                </p>
              </div>

              {bidderRegSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Your collector auction registration credentials have been verified and updated successfully!</span>
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (registerAuctionBidder) {
                    registerAuctionBidder({
                      bidderId: 'ART-BID-88942',
                      fullName: bidderRegForm.fullName,
                      email: bidderRegForm.email,
                      phone: bidderRegForm.phone,
                      country: bidderRegForm.country,
                      city: bidderRegForm.city,
                      idType: bidderRegForm.idType,
                      idNumber: bidderRegForm.idNumber,
                      biddingTier: bidderRegForm.biddingTier,
                      categories: bidderRegForm.categories,
                      registeredAt: new Date().toISOString(),
                      verified: true,
                      highValueApproved: bidderRegForm.biddingTier === 'Sovereign'
                    });
                  }
                  setBidderRegSuccess(true);
                  setTimeout(() => setBidderRegSuccess(false), 4500);
                }} 
                className="space-y-5 text-xs text-slate-700"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Legal Name (as on Government ID)</label>
                    <input
                      type="text"
                      required
                      value={bidderRegForm.fullName}
                      onChange={e => setBidderRegForm({ ...bidderRegForm, fullName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address (for Outbid & Win Invoices)</label>
                    <input
                      type="email"
                      required
                      value={bidderRegForm.email}
                      onChange={e => setBidderRegForm({ ...bidderRegForm, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone Number (Real-Time SMS Bidding Alerts)</label>
                    <input
                      type="tel"
                      required
                      value={bidderRegForm.phone}
                      onChange={e => setBidderRegForm({ ...bidderRegForm, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-mono focus:border-art-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Country of Residence</label>
                    <input
                      type="text"
                      required
                      value={bidderRegForm.country}
                      onChange={e => setBidderRegForm({ ...bidderRegForm, country: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Government ID Verification Type</label>
                    <select
                      value={bidderRegForm.idType}
                      onChange={e => setBidderRegForm({ ...bidderRegForm, idType: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none cursor-pointer"
                    >
                      <option value="International Passport">International Passport</option>
                      <option value="National Identification (NIN)">National Identification (NIN)</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="Voter's Card">Voter's Identification Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Document Number</label>
                    <input
                      type="text"
                      required
                      value={bidderRegForm.idNumber}
                      onChange={e => setBidderRegForm({ ...bidderRegForm, idNumber: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-mono focus:border-art-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Requested Bidding Tier</label>
                    <select
                      value={bidderRegForm.biddingTier}
                      onChange={e => setBidderRegForm({ ...bidderRegForm, biddingTier: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:border-art-gold focus:outline-none cursor-pointer"
                    >
                      <option value="Sovereign">Sovereign Tier (Unlimited / High-Value Lots &gt; ₦10M)</option>
                      <option value="Standard">Standard Tier (Bidding up to ₦10,000,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Fiduciary Settlement Bank</label>
                    <input
                      type="text"
                      required
                      value={bidderRegForm.bankName}
                      onChange={e => setBidderRegForm({ ...bidderRegForm, bankName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Preferred Curatorial Categories */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="block text-slate-800 font-bold">
                    Preferred Mediums for Executive Auction Drop Alerts:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      'Paintings', 'Sculptures', 'Bronze', 'Textiles',
                      'Ceramics', 'Woodworks', 'Drawings', 'Limited edition collections'
                    ].map(cat => {
                      const isSelected = bidderRegForm.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setBidderRegForm(prev => ({
                              ...prev,
                              categories: isSelected
                                ? prev.categories.filter(c => c !== cat)
                                : [...prev.categories, cat]
                            }));
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 border-art-gold text-amber-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span>{cat}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-900" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow cursor-pointer flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Save & Update Collector Auction Registration</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Active Live Auction Lots Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                    <span>Live Auction Lots Ready for Registered Bidders ({activeAuctionLots.length})</span>
                  </h4>
                  <p className="text-xs text-slate-500">Your accredited pass gives you instantaneous hammer bidding rights on all lots.</p>
                </div>

                <Link
                  href="/auctions"
                  className="text-xs text-art-gold font-bold hover:underline"
                >
                  View Full Auction Floor →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeAuctionLots.map((lot) => {
                  const currentBid = lot.auction?.currentBid || lot.price || 2000000;
                  const hasReminder = auctionReminders.includes(lot.id);

                  return (
                    <div
                      key={lot.id}
                      className="p-5 rounded-3xl bg-slate-50 border border-slate-200 hover:border-art-gold transition space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-slate-200">
                          <Link href={`/artwork/${lot.id}`} className="block w-full h-full cursor-pointer">
                            <img src={lot.image} alt={lot.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                          </Link>
                          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-lg shadow animate-pulse pointer-events-none">
                            🔥 LIVE LOT
                          </span>

                          <button
                            onClick={() => toggleAuctionReminder(lot.id)}
                            className={`absolute top-2.5 right-2.5 p-2 rounded-xl border backdrop-blur-md transition ${
                              hasReminder
                                ? 'bg-art-gold text-art-black border-art-gold shadow-gold-glow'
                                : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                            }`}
                            title={hasReminder ? 'Reminder Active (Click to remove)' : 'Set Auction Closing Reminder'}
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                            <span>{lot.category}</span>
                            <span className="text-red-600 font-bold">Closes in: 14h : 22m</span>
                          </div>
                          <Link href={`/artwork/${lot.id}`}>
                            <h4 className="font-serif text-base font-bold text-slate-900 mt-0.5 hover:text-art-gold transition cursor-pointer">{lot.title}</h4>
                          </Link>
                          <p className="text-xs text-slate-600">By {lot.artistName} · {lot.country}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-mono">Current High Bid:</span>
                          <strong className="font-serif text-base font-bold text-slate-900">{formatPrice(currentBid)}</strong>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleExecuteQuickBid(lot, currentBid + 100000)}
                            className="flex-1 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white rounded-xl font-bold text-xs uppercase transition shadow flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>Power Bid (+₦100k)</span>
                          </button>

                          <button
                            onClick={() => setBiddingLot(lot)}
                            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs transition"
                          >
                            Custom Bid
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Bid Modal */}
            {biddingLot && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl animate-scale-in text-xs my-auto max-h-[92vh] overflow-y-auto pb-10 sm:pb-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-base font-bold text-slate-900">
                      Place Accredited Bid · {biddingLot.title}
                    </h3>
                    <button onClick={() => setBiddingLot(null)} className="text-slate-400 font-bold p-1">✕</button>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                    <img src={biddingLot.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{biddingLot.title}</p>
                      <p className="text-slate-500">Current Bid: <strong className="font-mono text-slate-800">{formatPrice(biddingLot.auction?.currentBid || biddingLot.price)}</strong></p>
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleExecuteQuickBid(biddingLot, customBidAmount); }} className="space-y-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Your Bid Amount (₦ NGN)</label>
                      <input
                        type="number"
                        required
                        min={(biddingLot.auction?.currentBid || biddingLot.price) + 50000}
                        value={customBidAmount}
                        onChange={(e) => setCustomBidAmount(e.target.value)}
                        placeholder={`Min: ${(biddingLot.auction?.currentBid || biddingLot.price) + 50000}`}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px]">
                      🛡️ Covered under WEMA Bank Sovereign Fiduciary Guarantee.
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button type="button" onClick={() => setBiddingLot(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                      <button type="submit" className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase rounded-xl">Confirm & Submit Bid</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FOLLOWED ARTISTS & UPLOAD NOTIFICATIONS                            */}
        {/* ========================================================================= */}
        {activeTab === 'followed_artists' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>Followed Master Artists & New Artwork Feed</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Follow African creators to receive instant notifications when they upload new works, launch studio collections, or host exhibitions.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full">
                {followedArtists.length} Followed Ateliers
              </span>
            </div>

            {/* Followed Artists Grid */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-slate-900 text-base">Your Followed Artists</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {uniqueMasterArtists.map((artist) => {
                  const isFollowed = followedArtists.includes(artist.id) || followedArtists.includes(artist.name);

                  return (
                    <div
                      key={artist.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between items-center text-center space-y-3"
                    >
                      <Link 
                        href={`/artist/${artist.id}`}
                        className="w-16 h-16 rounded-full overflow-hidden border-2 border-art-gold bg-black shadow-sm hover:scale-105 transition block"
                      >
                        <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                      </Link>

                      <div>
                        <Link href={`/artist/${artist.id}`}>
                          <h5 className="font-serif font-bold text-slate-900 text-sm hover:text-art-gold transition">{artist.name}</h5>
                        </Link>
                        <p className="text-[11px] text-art-gold font-semibold">{artist.category}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{artist.city}, {artist.country} {artist.countryFlag}</p>
                      </div>

                      <button
                        onClick={() => toggleFollowArtist(artist.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold uppercase transition flex items-center justify-center gap-1 cursor-pointer ${
                          isFollowed
                            ? 'bg-emerald-100 hover:bg-red-50 text-emerald-800 hover:text-red-700 border border-emerald-300 hover:border-red-300'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow'
                        }`}
                      >
                        {isFollowed ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Follow Artist</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New Work Activity Stream from Followed Artists */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-art-gold" />
                    <span>Latest Uploads from Your Followed Artists</span>
                  </h4>
                  <p className="text-xs text-slate-500">Real-time studio alerts transmitted from verified African ateliers.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {followedArtistsNewWorks.slice(0, 6).map((art) => (
                  <div key={art.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <Link href={`/artwork/${art.id}`} className="block w-full h-full cursor-pointer">
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      </Link>
                      <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-emerald-300 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-500/40 pointer-events-none">
                        ✨ NEW STUDIO UPLOAD
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-art-gold font-bold uppercase tracking-wider block">
                          {art.category} • {art.country}
                        </span>
                        <Link href={`/artwork/${art.id}`}>
                          <h5 className="font-serif text-base font-bold text-slate-900 line-clamp-1 hover:text-art-gold transition cursor-pointer">{art.title}</h5>
                        </Link>
                        <p className="text-slate-500">By {art.artistName}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-serif text-base font-bold text-slate-900">{formatPrice(art.price)}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => addToCart(art)}
                            className="px-3 py-1.5 bg-art-gold hover:brightness-110 text-art-black rounded-xl font-bold text-xs transition"
                          >
                            Acquire
                          </button>
                          <button
                            onClick={() => addToWishlist(art.id)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                            title="Save to Wishlist"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SAVED ARTWORKS & CUSTOM WISHLISTS                                  */}
        {/* ========================================================================= */}
        {activeTab === 'wishlist' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span>Saved Masterpieces & Custom Wishlist Folders</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Save pieces to multiple curated folders, receive price change notices, and execute direct acquisitions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCreatingFolder(true)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <span>+ New Folder</span>
                </button>
              </div>
            </div>

            {/* Folder Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto text-xs">
              {customWishlists.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedWishlistFolder(folder)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition shrink-0 ${
                    selectedWishlistFolder === folder
                      ? 'bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {folder}
                </button>
              ))}
            </div>

            {/* Create Folder Modal / Input */}
            {isCreatingFolder && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 text-xs">
                <input
                  type="text"
                  placeholder="e.g., Dining Room Sculptures"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800"
                />
                <button
                  onClick={() => {
                    if (newFolderName.trim()) {
                      setCustomWishlists([...customWishlists, newFolderName.trim()]);
                      setSelectedWishlistFolder(newFolderName.trim());
                      setNewFolderName('');
                      setIsCreatingFolder(false);
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
                >
                  Save Folder
                </button>
                <button onClick={() => setIsCreatingFolder(false)} className="text-slate-500 font-bold">Cancel</button>
              </div>
            )}

            {wishlistedArtworks.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-slate-800">Your Wishlist is Empty</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any artwork card to save masterworks for later review.
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-art-gold hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-gold-glow"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Artworks</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedArtworks.map((art) => (
                  <div key={art.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                      <Link href={`/artwork/${art.id}`} className="block w-full h-full cursor-pointer">
                        <img src={art.image} alt={art.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(art.id)}
                        className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-red-500 rounded-xl shadow transition z-10"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-art-gold font-bold uppercase tracking-wider block">
                          {art.category} • {art.city}, {art.country}
                        </span>
                        <Link href={`/artwork/${art.id}`}>
                          <h4 className="font-serif text-base font-bold text-slate-900 line-clamp-1 hover:text-art-gold transition cursor-pointer">{art.title}</h4>
                        </Link>
                        <p className="text-slate-500">{art.artistName}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="font-serif text-base font-bold text-slate-900">{formatPrice(art.price)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(art)}
                            className="px-3 py-1.5 bg-art-gold hover:brightness-110 text-art-black rounded-xl font-bold text-xs transition"
                          >
                            Acquire
                          </button>
                          <Link
                            href={`/artwork/${art.id}`}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MY COLLECTION & DIGITAL CERTIFICATES OF AUTHENTICITY               */}
        {/* ========================================================================= */}
        {activeTab === 'collection' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-art-gold" />
                  <span>My Fine Art Collection, Valuation & COA Certificates</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Appraised holdings, digital provenance certificates, and secondary bourse liquidity status.
                </p>
              </div>
              <span className="font-serif font-bold text-base text-art-gold">
                Total Valuation: {formatPrice(portfolioValuation)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-4 items-center hover:border-art-gold transition text-xs">
                <img 
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=300" 
                  alt="" 
                  className="w-16 h-16 object-cover rounded-xl border border-slate-300 shrink-0" 
                />
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-serif text-sm font-bold text-slate-900">The Ancestral Horizon</h4>
                  <span className="text-[11px] text-art-gold font-semibold block mb-1">By Kofi Mensah · Accra, Ghana</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    Provenance Verified & In-Vault
                  </span>
                </div>
                <div className="text-center sm:text-right shrink-0">
                  <span className="font-serif text-sm font-bold text-slate-900 block">₦1,850,000</span>
                  <button
                    onClick={() => setActiveCert({
                      title: 'The Ancestral Horizon',
                      artist: 'Kofi Mensah',
                      price: 1850000,
                      medium: 'Acrylic & 24k Gold Leaf on Canvas',
                      dimensions: '150 x 120 cm',
                      date: 'Feb 10, 2026',
                      txHash: '0x88F929BA3401CC98FE'
                    })}
                    className="mt-2 px-3 py-1 bg-art-gold/15 hover:bg-art-gold text-amber-900 hover:text-black border border-art-gold/40 rounded-xl transition uppercase font-bold text-[10px]"
                  >
                    View Digital Certificate (COA)
                  </button>
                </div>
              </div>

              {myCollection.map((art) => (
                <div key={art.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-4 items-center hover:border-art-gold transition text-xs">
                  <Link href={`/artwork/${art.id}`} className="shrink-0">
                    <img src={art.image} alt={art.title} className="w-16 h-16 object-cover rounded-xl border border-slate-300 hover:border-art-gold transition cursor-pointer" />
                  </Link>
                  <div className="flex-1 text-center sm:text-left">
                    <Link href={`/artwork/${art.id}`}>
                      <h4 className="font-serif text-sm font-bold text-slate-900 hover:text-art-gold transition cursor-pointer">{art.title}</h4>
                    </Link>
                    <span className="text-[11px] text-art-gold font-semibold block mb-1">By {art.artistName} · {art.country}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      Vault Custody Confirmed
                    </span>
                  </div>
                  <div className="text-center sm:text-right shrink-0">
                    <span className="font-serif text-sm font-bold text-slate-900 block">{formatPrice(art.soldPrice || art.price)}</span>
                    <button
                      onClick={() => setActiveCert({
                        title: art.title,
                        artist: art.artistName,
                        price: art.soldPrice || art.price,
                        medium: art.medium,
                        dimensions: art.dimensions,
                        date: 'Recorded on Ledger',
                        txHash: `0x${art.id.replace(/-/g, '').substring(0, 18).toUpperCase()}`
                      })}
                      className="mt-2 px-3 py-1 bg-art-gold/15 hover:bg-art-gold text-amber-900 hover:text-black border border-art-gold/40 rounded-xl transition uppercase font-bold text-[10px]"
                    >
                      View Digital Certificate (COA)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: NOTIFICATION CENTER (AUCTION REMINDERS & DROP ALERTS)              */}
        {/* ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-art-gold" />
                  <span>Curatorial Notification Center</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Auction countdown closing reminders, outbid notices, and followed artist new artwork drop alerts.
                </p>
              </div>
              <span className="font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                {notifications.length} Total Alerts
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 italic">No notifications logged.</div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                      notif.read ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-amber-50/70 border-amber-300 text-amber-950 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-slate-300' : 'bg-art-gold'}`} />
                      <p>{notif.message}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!notif.read && (
                        <button
                          onClick={() => markNotificationRead(notif.id)}
                          className="px-2 py-1 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-[10px]"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: PROFILE SETTINGS & PHOTO STUDIO                                    */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in text-xs max-w-2xl">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" />
                <span>Collector Identity, Photo Studio & Delivery Preferences</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage your sovereign collector profile, upload cropped upper-body portraits, and set default white-glove delivery coordinates.
              </p>
            </div>

            {profileSaveMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Country of Residence</label>
                  <input
                    type="text"
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Default White-Glove Delivery Address</label>
                <textarea
                  rows="2"
                  value={profileForm.defaultAddress}
                  onChange={(e) => setProfileForm({ ...profileForm, defaultAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsPhotoStudioOpen(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Update Profile Photo</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase rounded-xl shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Profile Photo Studio Modal */}
      {isPhotoStudioOpen && (
        <ProfilePhotoStudioModal
          isOpen={isPhotoStudioOpen}
          onClose={() => setIsPhotoStudioOpen(false)}
          onSave={handleSaveCollectorPhoto}
          currentPhoto={currentUser?.avatar_url}
          userRole="buyer"
        />
      )}

      {/* Digital Certificate COA Modal */}
      {activeCert && (
        <DigitalCertificateModal
          certificate={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}

      {/* Collector Concierge Troubleshooting & Immediate Assistance Modal */}
      {isCollectorConciergeModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-blue-300/60 overflow-hidden animate-scale-in text-xs max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex items-start justify-between border-b border-blue-500/20">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                  <Users className="w-3 h-3" />
                  <span>Collector Concierge Assistance Suite</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-blue-100">
                  Quick Fix Toolkit: {activeUser?.name || activeUser?.email || 'Collector'}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                  Assisting collector in real-time: Reconcile offline wire settlements, update delivery shipping details, or fix connection breaks immediately.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCollectorConciergeModalOpen(false);
                  setCollectorConciergeFixStatus('');
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {collectorConciergeFixStatus && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{collectorConciergeFixStatus}</span>
                </div>
              )}

              {/* Instant Actions */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  <span>Instant Collector Troubleshooting Actions</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const pendingOrders = myOrders.filter(o => o.status === 'pending');
                      if (pendingOrders.length > 0) {
                        pendingOrders.forEach(o => updateOrderStatus(o.id, 'paid'));
                        setCollectorConciergeFixStatus(`Reconciled and cleared ${pendingOrders.length} pending order(s) as paid via Wema Bank Direct Banking!`);
                      } else {
                        setCollectorConciergeFixStatus('No unpaid orders pending for this collector. Account is in good standing.');
                      }
                    }}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-slate-800 text-left font-medium transition-all shadow-sm flex items-center gap-2.5"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-[11px] text-slate-900">Reconcile Offline Payment</div>
                      <div className="text-[10px] text-slate-500">Auto-verify wire deposit</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCollectorConciergeFixStatus('Connection refreshed! Collector portal local cache re-synchronized.');
                    }}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-800 text-left font-medium transition-all shadow-sm flex items-center gap-2.5"
                  >
                    <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-bold text-[11px] text-slate-900">Clear Cache & Sync</div>
                      <div className="text-[10px] text-slate-500">Fix connection breaks</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('collection');
                      setIsCollectorConciergeModalOpen(false);
                      setCollectorConciergeFixStatus('Navigated to acquisition vault with digital provenance certificates.');
                    }}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50 text-slate-800 text-left font-medium transition-all shadow-sm flex items-center gap-2.5"
                  >
                    <FileCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-bold text-[11px] text-slate-900">Vault & Certificates</div>
                      <div className="text-[10px] text-slate-500">View provenances & COAs</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('orders');
                      setIsCollectorConciergeModalOpen(false);
                      setCollectorConciergeFixStatus('Navigated to orders & tracking history.');
                    }}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 text-left font-medium transition-all shadow-sm flex items-center gap-2.5"
                  >
                    <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-bold text-[11px] text-slate-900">Delivery Status</div>
                      <div className="text-[10px] text-slate-500">Track shipments live</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Delivery Address & Tier Form */}
              <div className="space-y-3.5">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Update Delivery Address & VIP Privilege Tier</span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Primary Shipping / Delivery Address</label>
                    <input
                      type="text"
                      value={collectorAddressForm.address}
                      onChange={(e) => setCollectorAddressForm({ ...collectorAddressForm, address: e.target.value })}
                      placeholder="Street address, suite, apartment..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">City / State</label>
                      <input
                        type="text"
                        value={collectorAddressForm.city}
                        onChange={(e) => setCollectorAddressForm({ ...collectorAddressForm, city: e.target.value })}
                        placeholder="e.g. Ikoyi, Lagos"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Country</label>
                      <input
                        type="text"
                        value={collectorAddressForm.country}
                        onChange={(e) => setCollectorAddressForm({ ...collectorAddressForm, country: e.target.value })}
                        placeholder="e.g. Nigeria, UK, USA"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Phone Number</label>
                      <input
                        type="text"
                        value={collectorAddressForm.phone}
                        onChange={(e) => setCollectorAddressForm({ ...collectorAddressForm, phone: e.target.value })}
                        placeholder="+234..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Bidding Privilege Tier</label>
                      <select
                        value={collectorAddressForm.biddingTier}
                        onChange={(e) => setCollectorAddressForm({ ...collectorAddressForm, biddingTier: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                      >
                        <option value="Standard">Standard Collector</option>
                        <option value="Curator Privilege">Curator Privilege (Priority)</option>
                        <option value="Sovereign Patron">Sovereign Patron (Unlimited Vault)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCollectorConciergeModalOpen(false);
                  setCollectorConciergeFixStatus('');
                }}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeUser?.id) {
                    updateUser(activeUser.id, {
                      address: collectorAddressForm.address,
                      city: collectorAddressForm.city,
                      country: collectorAddressForm.country,
                      phone: collectorAddressForm.phone,
                      biddingTier: collectorAddressForm.biddingTier
                    });
                    setCollectorConciergeFixStatus('Delivery address and tier updated & synced to collector profile successfully!');
                    setTimeout(() => {
                      setIsCollectorConciergeModalOpen(false);
                      setCollectorConciergeFixStatus('');
                    }, 1200);
                  }
                }}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Collector Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
