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
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import DigitalCertificateModal from '@/components/DigitalCertificateModal';
import ProfilePhotoStudioModal from '@/components/ProfilePhotoStudioModal';
import CollectorPanAfricanSuite from '@/components/CollectorPanAfricanSuite';

export default function BuyerAccountPage() {
  const { 
    currentUser, 
    updateUser,
    artworks = [], 
    currency, 
    transactions = [], 
    orders = [], 
    updateOrder,
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

  const [activeCert, setActiveCert] = useState(null);
  // Navigation Tabs: 'orders', 'auction_registration', 'followed_artists', 'wishlist', 'collection', 'my_offers', 'my_questions', 'notifications', 'profile'
  const [activeTab, setActiveTab] = useState('orders');
  const [copiedTracking, setCopiedTracking] = useState(null);

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
    } else if (currentUser && currentUser.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [currentUser, router]);

  if (!currentUser || (currentUser.role !== 'buyer' && currentUser.role !== 'collector')) {
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
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  const cleanName = currentUser?.name ? currentUser.name.split(' (')[0] : '';
  const myCollection = artworks.filter(art => {
    return art.status === 'sold' && (
      (cleanName && art.soldTo && art.soldTo.toLowerCase().includes(cleanName.toLowerCase())) ||
      (cleanName && transactions.some(tx => tx.artworkTitle === art.title && tx.buyerName?.toLowerCase().includes(cleanName.toLowerCase()))) ||
      (orders.some(o => (o.buyer_id === currentUser.id || (cleanName && o.buyer_name?.toLowerCase().includes(cleanName.toLowerCase()))) && o.items?.some(i => i.id === art.id)))
    );
  });

  const portfolioValuation = myCollection.reduce((sum, art) => sum + (art.soldPrice || art.price || 0), 0);
  const totalItems = myCollection.length;

  // Active auction lots
  const activeAuctionLots = artworks.filter(art => art.status === 'auction');
  const wishlistedArtworks = artworks.filter(art => wishlist.includes(art.id));
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Orders placed by this collector
  const myOrders = orders.filter(o => 
    (currentUser?.id && o.buyer_id === currentUser.id) || 
    (currentUser?.email && o.buyer_email?.toLowerCase() === currentUser.email.toLowerCase()) ||
    (cleanName && o.buyer_name && o.buyer_name.toLowerCase().includes(cleanName.toLowerCase()))
  );

  // Offers sent by this collector
  const mySentOffers = collectorOffers.filter(o => 
    (currentUser?.id && o.buyerId === currentUser.id) || 
    (currentUser?.email && o.buyerEmail?.toLowerCase() === currentUser.email.toLowerCase()) ||
    (cleanName && o.buyerName && o.buyerName.toLowerCase().includes(cleanName.toLowerCase()))
  );

  // Questions asked by this collector
  const myQuestions = artworkQuestions.filter(q =>
    (currentUser?.id && q.askedById === currentUser.id) ||
    (cleanName && q.askedBy && q.askedBy.toLowerCase().includes(cleanName.toLowerCase()))
  );

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
    <div className="min-h-screen bg-slate-50/50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Profile Banner Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 flex-1">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-art-gold shadow-md bg-slate-100 flex items-center justify-center">
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover object-top" />
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
                    Sovereign Collector Account
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>KYC Verified Bidder</span>
                  </span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <p className="text-xs text-slate-500 font-sans">{currentUser.email} · Bidder Pass: <strong className="font-mono text-slate-800">ART-BID-88942</strong></p>
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
                          <img src={lot.image} alt={lot.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-lg shadow animate-pulse">
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
                          <h4 className="font-serif text-base font-bold text-slate-900 mt-0.5">{lot.title}</h4>
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
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-art-gold bg-black shadow-sm">
                        <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                      </div>

                      <div>
                        <h5 className="font-serif font-bold text-slate-900 text-sm">{artist.name}</h5>
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
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-emerald-300 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-500/40">
                        ✨ NEW STUDIO UPLOAD
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-art-gold font-bold uppercase tracking-wider block">
                          {art.category} • {art.country}
                        </span>
                        <h5 className="font-serif text-base font-bold text-slate-900 line-clamp-1">{art.title}</h5>
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
                      <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeFromWishlist(art.id)}
                        className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white text-red-500 rounded-xl shadow transition"
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
                        <h4 className="font-serif text-base font-bold text-slate-900 line-clamp-1">{art.title}</h4>
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
                  <img src={art.image} alt={art.title} className="w-16 h-16 object-cover rounded-xl border border-slate-300 shrink-0" />
                  <div className="flex-1 text-center sm:text-left">
                    <h4 className="font-serif text-sm font-bold text-slate-900">{art.title}</h4>
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

    </div>
  );
}
