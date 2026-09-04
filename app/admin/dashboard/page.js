'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { 
  ShieldCheck, 
  Video, 
  Plus, 
  Trash2, 
  Award, 
  Sparkles, 
  DollarSign, 
  Package, 
  Users, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  FileText, 
  Calendar, 
  Layers, 
  Heart, 
  Briefcase, 
  Terminal, 
  Grid, 
  CheckCircle, 
  Settings, 
  CreditCard, 
  Zap, 
  Globe, 
  Sliders, 
  Bell, 
  MessageCircle, 
  Edit, 
  Send, 
  MapPin, 
  ExternalLink, 
  Tag, 
  ShoppingBag, 
  Percent, 
  CheckCircle2, 
  Truck, 
  UserPlus, 
  UserCheck, 
  Navigation, 
  FileCheck, 
  Building,
  Crown,
  Image as ImageIcon,
  Film,
  Layout,
  Home,
  Columns,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Play,
  SlidersHorizontal,
  RefreshCw,
  Check,
  X,
  Lock,
  Palette,
  Upload,
  Leaf,
  Flame,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import VerificationBadge from '@/components/VerificationBadge';
import AdminUserGovernance from '@/components/AdminUserGovernance';
import AdminSystemStatus from '@/components/AdminSystemStatus';
import AdminLiveAuctionOversight from '@/components/AdminLiveAuctionOversight';
import AdminAuctionBidders from '@/components/AdminAuctionBidders';
import AdminFlashDeals from '@/components/AdminFlashDeals';
import AdminRoyalHeirlooms from '@/components/AdminRoyalHeirlooms';
import AdminCuratorPicks from '@/components/AdminCuratorPicks';
import AdminProvenanceLedger from '@/components/AdminProvenanceLedger';
import AdminVerifiedMasters from '@/components/AdminVerifiedMasters';
import AdminPanAfricanHub from '@/components/AdminPanAfricanHub';
import AdminPayoutGovernance from '@/components/AdminPayoutGovernance';
import AdminImageDiagnostics from '@/components/AdminImageDiagnostics';
import AdminDemoTransitionSuite from '@/components/AdminDemoTransitionSuite';
import AdminVideoModeration from '@/components/AdminVideoModeration';
import ArtworkPhotoUploader from '@/components/ArtworkPhotoUploader';

export default function AdminDashboardPage() {
  const { 
    currentUser,
    artworks = [], 
    addArtwork,
    updateArtwork,
    deleteArtwork,
    setArtistVerificationBadge,
    videos = [], 
    addVideo, 
    deleteVideo, 
    currency, 
    transactions = [], 
    settleTransaction, 
    freezeTransaction,
    exhibitions = [], 
    usersList = [],
    addUser,
    updateUser,
    deleteUser,
    setUserStatus,
    addUserSecurityIncident,
    sellers = [],
    addSeller,
    updateSeller,
    deleteSeller,
    orders = [],
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    updateOrderLogistics,
    payments = [],
    updatePayment,
    deletePayment,
    commissions = [],
    updateCommission,
    deleteCommission,
    disburseCommission,
    artistPayoutPercentage = 85,
    updateArtistPayoutPercentage,
    artworkQuestions = [],
    deleteQuestion,
    editQuestionAnswer,
    collectorOffers = [],
    updateCollectorOfferStatus,
    notifications = [],
    broadcastNotification,
    deleteNotification,
    auctionBidders = [],
    // Page Customization
    headerConfig,
    updateHeaderConfig,
    addHeaderNavLink,
    updateHeaderNavLink,
    deleteHeaderNavLink,
    resetHeaderConfig,
    heroConfig,
    updateHeroConfig,
    setHeroMediaFromGallery,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    resetHeroConfig,
    homePageConfig,
    updateHomePageConfig,
    updateHomeSection,
    toggleSectionVisibility,
    reorderHomeSections,
    addPromoBanner,
    updatePromoBanner,
    deletePromoBanner,
    resetHomePageConfig,
    footerConfig,
    updateFooterConfig,
    addTrustBadge,
    updateTrustBadge,
    deleteTrustBadge,
    addFooterColumn,
    updateFooterColumn,
    deleteFooterColumn,
    addFooterLink,
    updateFooterLink,
    deleteFooterLink,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    resetFooterConfig,
    priorityBannerPricing,
    updatePriorityBannerPricing,
    priorityBannerPlacements = [],
    approvePriorityBannerPlacement,
    rejectPriorityBannerPlacement,
    deletePriorityBannerPlacement,
    addDirectPriorityBannerPlacement
  } = useStore();

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Priority Banner Admin State
  const [pricingForm, setPricingForm] = useState({
    boost7d: priorityBannerPricing?.boost7d || 15000,
    monthly: priorityBannerPricing?.monthly || 50000,
    annual: priorityBannerPricing?.annual || 350000
  });
  const [selectedArtForDirectBanner, setSelectedArtForDirectBanner] = useState('');
  const [bannerSaveNotice, setBannerSaveNotice] = useState(false);

  useEffect(() => {
    if (priorityBannerPricing) {
      setPricingForm({
        boost7d: priorityBannerPricing.boost7d || 15000,
        monthly: priorityBannerPricing.monthly || 50000,
        annual: priorityBannerPricing.annual || 350000
      });
    }
  }, [priorityBannerPricing]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (currentUser && currentUser.role === 'buyer') {
        router.push('/buyer/account');
      } else if (currentUser && currentUser.role === 'artist') {
        router.push('/artist/dashboard');
      }
    }
  }, [currentUser, isMounted, router]);

  const [activeTab, setActiveTab] = useState('overview'); // overview, header, hero, homepage, footer, priority_banner, logistics, orders, commissions, payments, artworks, qa, broadcasts, sellers, settings
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Modals state
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [editArtForm, setEditArtForm] = useState({});
  const [isAddArtModalOpen, setIsAddArtModalOpen] = useState(false);
  const [newArtForm, setNewArtForm] = useState({
    title: '',
    artistName: 'Kofi Mensah',
    artistId: 'artist-1',
    category: 'Painters',
    medium: 'Oil & Gold Leaf on Canvas',
    dimensions: '120 x 100 cm',
    price: 1500000,
    country: 'Ghana',
    city: 'Accra',
    countryFlag: '🇬🇭',
    shipsTo: ['Africa', 'Europe', 'North America'],
    verificationBadge: 'gold',
    studioNotes: '',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
    status: 'available'
  });

  const [editingOrder, setEditingOrder] = useState(null);
  const [editOrderForm, setEditOrderForm] = useState({});

  const [editingSeller, setEditingSeller] = useState(null);
  const [editSellerForm, setEditSellerForm] = useState({});
  const [isAddSellerModalOpen, setIsAddSellerModalOpen] = useState(false);
  const [newSellerForm, setNewSellerForm] = useState({
    name: '',
    bio: '',
    country: 'Nigeria',
    city: 'Lagos',
    country_flag: '🇳🇬',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    tier: 'Premium',
    verification_badge: 'gold',
    payout_account_name: 'Studio Enterprise',
    payout_bank: 'Access Bank PLC',
    payout_account: '0123456789'
  });

  // ==========================================
  // PAGE MANAGEMENT MODALS & FORMS
  // ==========================================
  // Header Nav Link Modal
  const [isAddNavModalOpen, setIsAddNavModalOpen] = useState(false);
  const [editingNavLink, setEditingNavLink] = useState(null);
  const [navLinkForm, setNavLinkForm] = useState({ label: '', href: '', isVisible: true, highlight: 'none', icon: '' });

  // Hero Gallery Picker & Slides Modals
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);
  const [gallerySearchTerm, setGallerySearchTerm] = useState('');
  const [isAddHeroSlideModalOpen, setIsAddHeroSlideModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState(null);
  const [heroSlideForm, setHeroSlideForm] = useState({ title: '', artist: '', country: '', mediaType: 'image', mediaUrl: '', price: 1500000, badge: 'Featured' });
  const heroVideoInputRef = React.useRef(null);
  const [heroVideoUploading, setHeroVideoUploading] = useState(false);

  const handleHeroVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert('Please select a valid video file (MP4, WebM, MOV) or graphic image.');
      return;
    }

    setHeroVideoUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (isVideo) {
        updateHeroConfig({
          videoUrl: dataUrl,
          mediaType: 'video',
          mediaUrl: dataUrl,
          bgVideoEnabled: true
        });
        logSandboxAction(`Admin uploaded full-page Hero background video: "${file.name}"`);
        alert(`Hero cinematic video "${file.name}" uploaded successfully and applied to the full page!`);
      } else {
        updateHeroConfig({
          mediaUrl: dataUrl,
          mediaType: 'image'
        });
        logSandboxAction(`Admin uploaded full-page Hero background graphic: "${file.name}"`);
        alert(`Hero graphic "${file.name}" uploaded successfully!`);
      }
      setHeroVideoUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to read file. Please try a different video or image file.');
      setHeroVideoUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Home Page Section & Promo Banner Modals
  const [editingHomeSection, setEditingHomeSection] = useState(null);
  const [editHomeSectionForm, setEditHomeSectionForm] = useState({});
  const [isAddBannerModalOpen, setIsAddBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    tag: 'CURATORIAL SPOTLIGHT',
    buttonText: 'Explore Collection',
    buttonLink: '/explore',
    bgGradient: 'from-amber-950 via-slate-900 to-black',
    borderColor: 'border-art-gold/40'
  });

  // Footer Trust Badges, Columns & Socials Modals
  const [isAddBadgeModalOpen, setIsAddBadgeModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [badgeForm, setBadgeForm] = useState({ title: '', description: '', icon: 'Award', color: 'gold', isVisible: true });

  const [isAddColModalOpen, setIsAddColModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState(null);
  const [colForm, setColForm] = useState({ title: '' });

  const [isAddFooterLinkModalOpen, setIsAddFooterLinkModalOpen] = useState(false);
  const [activeColIdForLink, setActiveColIdForLink] = useState(null);
  const [editingFooterLink, setEditingFooterLink] = useState(null);
  const [footerLinkForm, setFooterLinkForm] = useState({ label: '', href: '', highlight: 'none', isVisible: true });

  const [isAddSocialModalOpen, setIsAddSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [socialForm, setSocialForm] = useState({ platform: '', url: '', isVisible: true });

  // Broadcast notification form state
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Q&A Edit answer state
  const [editingQId, setEditingQId] = useState(null);
  const [editQAnswer, setEditQAnswer] = useState('');

  // Search terms
  const [artSearchTerm, setArtSearchTerm] = useState('');
  const [artBadgeFilter, setArtBadgeFilter] = useState('All');

  const [videoForm, setVideoForm] = useState({
    artistName: '',
    artistTitle: '',
    country: '',
    artworkTitle: '',
    thumbnail: '',
    videoUrl: '',
    quote: '',
    duration: '3:30',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    wemaBankName: 'Wema Bank PLC',
    wemaAccountName: 'Artellium Global Marketplace Ltd',
    wemaAccountNumber: '0123456789',
    wemaSortCode: '035150103',
    alatpayMerchantId: 'ALAT-MERCHANT-88942',
    wemaApiKey: 'wema_sec_live_99218417',
    paystackPublicKey: 'pk_live_51M789ac72f10d9e83b4b5c6d',
    flutterwavePublicKey: 'FLWPUBK_TEST-a72f1b83c5d6e7-X',
    monnifyApiKey: 'MK_PROD_7a8f9c10d3e5',
  });

  const [sandboxLogs, setSandboxLogs] = useState([]);

  const logSandboxAction = (msg) => {
    const timestamp = new Date().toLocaleTimeString();
    setSandboxLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleVideoSubmit = (e) => {
    e.preventDefault();
    if (!videoForm.artistName || !videoForm.videoUrl) return;

    addVideo(videoForm);
    setVideoForm({
      artistName: '',
      artistTitle: '',
      country: '',
      artworkTitle: '',
      thumbnail: '',
      videoUrl: '',
      quote: '',
      duration: '3:30',
    });
    setIsVideoModalOpen(false);
    logSandboxAction(`Spotlight added for artist ${videoForm.artistName}`);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;
    broadcastNotification(broadcastMsg);
    setBroadcastSuccess(true);
    setBroadcastMsg('');
    logSandboxAction(`Broadcast alert transmitted: "${broadcastMsg.substring(0, 30)}..."`);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  const handleSaveArtworkEdit = (e) => {
    e.preventDefault();
    if (!editingArtwork) return;
    updateArtwork(editingArtwork.id, {
      ...editArtForm,
      price: parseFloat(editArtForm.price)
    });
    logSandboxAction(`Updated artwork "${editArtForm.title}" metadata.`);
    setEditingArtwork(null);
    alert('Artwork details updated successfully!');
  };

  const handleCreateArtwork = (e) => {
    e.preventDefault();
    if (!newArtForm.title || !newArtForm.price) return;
    addArtwork({
      ...newArtForm,
      price: parseFloat(newArtForm.price)
    });
    setIsAddArtModalOpen(false);
    logSandboxAction(`Admin added new catalog masterpiece "${newArtForm.title}"`);
    alert(`Artwork "${newArtForm.title}" created successfully in catalog!`);
  };

  const handleSaveOrderEdit = (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateOrder(editingOrder.id, {
      ...editOrderForm,
      total_amount: parseFloat(editOrderForm.total_amount)
    });
    logSandboxAction(`Updated order ${editingOrder.id} destination & status.`);
    setEditingOrder(null);
    alert('Order details updated successfully!');
  };

  const handleSaveSellerEdit = (e) => {
    e.preventDefault();
    if (!editingSeller) return;
    updateSeller(editingSeller.id, editSellerForm);
    logSandboxAction(`Updated seller profile "${editSellerForm.name}"`);
    setEditingSeller(null);
    alert('Seller profile updated successfully!');
  };

  const handleCreateSeller = (e) => {
    e.preventDefault();
    if (!newSellerForm.name) return;
    addSeller(newSellerForm);
    setIsAddSellerModalOpen(false);
    logSandboxAction(`Admin accredited new master seller "${newSellerForm.name}"`);
    alert(`Master Seller "${newSellerForm.name}" registered successfully!`);
  };

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  // Financial aggregates
  const totalGrossSales = orders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);
  const totalPlatformCommissions = commissions.reduce((sum, c) => sum + (c.platform_fee_amount || 0), 0);
  const totalSellerDisbursements = commissions.filter(c => c.payout_status === 'disbursed').reduce((sum, c) => sum + (c.seller_net_payout || 0), 0);
  const totalSettlementHeld = payments.filter(p => p.status === 'held_in_custody' || p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);

  if (!isMounted) return null;

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#07080A] flex items-center justify-center p-4 font-sans text-xs">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0c0f17] border border-amber-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
          </div>
          <h2 className="font-serif text-lg font-bold text-white">Access Restricted</h2>
          <p className="text-slate-400 leading-relaxed text-xs">
            The Admin Executive Center is strictly restricted to platform administrators.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            {currentUser?.role === 'artist' && (
              <Link
                href="/artist/dashboard"
                className="py-2.5 px-4 bg-art-gold text-art-black font-bold rounded-xl hover:brightness-110 transition"
              >
                Go to Artist Studio
              </Link>
            )}
            {currentUser?.role === 'buyer' && (
              <Link
                href="/buyer/account"
                className="py-2.5 px-4 bg-emerald-500 text-white font-bold rounded-xl hover:brightness-110 transition"
              >
                Go to Collector Portal
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

  // Filter artworks
  const filteredArtworks = artworks.filter(art => {
    const matchesSearch = 
      art.title?.toLowerCase().includes(artSearchTerm.toLowerCase()) ||
      art.artistName?.toLowerCase().includes(artSearchTerm.toLowerCase()) ||
      art.country?.toLowerCase().includes(artSearchTerm.toLowerCase()) ||
      art.city?.toLowerCase().includes(artSearchTerm.toLowerCase());
    
    const matchesBadge = 
      artBadgeFilter === 'All' ? true :
      artBadgeFilter === 'none' ? !art.verificationBadge :
      art.verificationBadge === artBadgeFilter;

    return matchesSearch && matchesBadge;
  });

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16 font-sans">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header Block */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-art-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/10 border border-art-gold/30 text-amber-800 text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Executive Office Master Operations</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                ARTELLIUM Admin Console
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-sans">
                Full administrative oversight to Monitor Freight Logistics, Audit Orders, Settle {artistPayoutPercentage}% Creator Payouts, Moderate Q&As, and Manage Master Sellers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddArtModalOpen(true)}
                className="bg-art-gold hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition shadow flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Artwork</span>
              </button>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition flex items-center gap-2"
              >
                <Video className="w-4 h-4 text-art-gold" />
                <span>Spotlight Video</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categorized Tab Controls Bar */}
        <div className="space-y-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          {/* Main Module Category Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
            {/* Group 1: CMS */}
            <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-200/70 space-y-1.5">
              <span className="text-[10px] text-amber-800 font-mono font-bold uppercase tracking-wider block flex items-center gap-1">
                <Layout className="w-3 h-3 text-amber-600" />
                <span>Home Page CMS</span>
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('header')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'header' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200/50'
                  }`}
                >
                  <Navigation className="w-3 h-3" />
                  <span>Header</span>
                </button>
                <button
                  onClick={() => setActiveTab('hero')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'hero' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200/50'
                  }`}
                >
                  <Crown className="w-3 h-3 text-art-gold" />
                  <span>Hero Video</span>
                </button>
                <button
                  onClick={() => setActiveTab('artist_videos')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'artist_videos' ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400' : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200/50'
                  }`}
                >
                  <Film className="w-3 h-3 text-amber-700" />
                  <span>Artist Videos</span>
                  {videos.filter(v => v.status === 'pending').length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-black animate-pulse">
                      {videos.filter(v => v.status === 'pending').length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('homepage')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'homepage' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200/50'
                  }`}
                >
                  <Home className="w-3 h-3" />
                  <span>Sections</span>
                </button>
                <button
                  onClick={() => setActiveTab('footer')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'footer' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200/50'
                  }`}
                >
                  <Columns className="w-3 h-3" />
                  <span>Footer</span>
                </button>
              </div>
            </div>

            {/* Group 2: Catalog & Media */}
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] text-slate-600 font-mono font-bold uppercase tracking-wider block flex items-center gap-1">
                <Package className="w-3 h-3 text-slate-500" />
                <span>Catalog & Curation</span>
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('artworks')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'artworks' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Palette className="w-3 h-3" />
                  <span>Artworks ({artworks.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('live_auctions')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'live_auctions' ? 'bg-red-700 text-white shadow-sm ring-2 ring-red-400' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/60'
                  }`}
                >
                  <Flame className="w-3 h-3 text-red-500 animate-pulse" />
                  <span>Live Arena ({artworks.filter(a => a.status === 'auction').length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('auction_bidders')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'auction_bidders' ? 'bg-gradient-to-r from-red-700 to-amber-700 text-white shadow-sm ring-2 ring-amber-400' : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                  }`}
                >
                  <Users className="w-3 h-3 text-amber-700" />
                  <span>Auction Bidders ({auctionBidders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('exhibitions')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'exhibitions' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                  }`}
                >
                  <Eye className="w-3 h-3 text-emerald-600" />
                  <span>Exhibitions</span>
                </button>
                <button
                  onClick={() => setActiveTab('priority_banner')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'priority_banner' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-art-gold" />
                  <span>Banners</span>
                </button>
                <button
                  onClick={() => setActiveTab('media_diagnostics')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'media_diagnostics' ? 'bg-gradient-to-r from-amber-600 to-art-gold text-art-black font-bold shadow-sm ring-2 ring-art-gold' : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Camera className="w-3 h-3 text-amber-700" />
                  <span>📸 Photo Uploads & Auto-Repair</span>
                </button>
                <button
                  onClick={() => setActiveTab('demo_transition')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'demo_transition' ? 'bg-gradient-to-r from-art-gold to-amber-600 text-art-black font-bold shadow-sm ring-2 ring-art-gold' : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-700 animate-pulse" />
                  <span>⚡ Catalog & Demo Transition Engine</span>
                </button>
              </div>
            </div>

            {/* Group 3: Commerce & WEMA */}
            <div className="p-2 bg-emerald-50/70 rounded-xl border border-emerald-200/70 space-y-1.5">
              <span className="text-[10px] text-emerald-800 font-mono font-bold uppercase tracking-wider block flex items-center gap-1">
                <Building className="w-3 h-3 text-emerald-600" />
                <span>WEMA & Commerce</span>
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('logistics')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'logistics' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-emerald-100 border border-emerald-200/50'
                  }`}
                >
                  <CreditCard className="w-3 h-3 text-emerald-600" />
                  <span>WEMA ({orders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'orders' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-emerald-100 border border-emerald-200/50'
                  }`}
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('commissions')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'commissions' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-emerald-100 border border-emerald-200/50'
                  }`}
                >
                  <Percent className="w-3 h-3" />
                  <span>Payouts</span>
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'payments' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-emerald-100 border border-emerald-200/50'
                  }`}
                >
                  <DollarSign className="w-3 h-3" />
                  <span>Vault</span>
                </button>
              </div>
            </div>

            {/* Group 4: Users & Governance */}
            <div className="p-2 bg-blue-50/70 rounded-xl border border-blue-200/70 space-y-1.5">
              <span className="text-[10px] text-blue-800 font-mono font-bold uppercase tracking-wider block flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-600" />
                <span>Users & Settings</span>
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'overview' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-blue-100 border border-blue-200/50'
                  }`}
                >
                  <Grid className="w-3 h-3" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'users' ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-400' : 'bg-white text-slate-700 hover:bg-blue-100 border border-blue-200/50'
                  }`}
                >
                  <ShieldAlert className="w-3 h-3 text-amber-500" />
                  <span>Users Council ({usersList.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('sellers')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'sellers' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-blue-100 border border-blue-200/50'
                  }`}
                >
                  <Crown className="w-3 h-3" />
                  <span>Sellers ({sellers.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'qa' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-blue-100 border border-blue-200/50'
                  }`}
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Q&A ({artworkQuestions.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('broadcasts')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'broadcasts' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-blue-100 border border-blue-200/50'
                  }`}
                >
                  <Bell className="w-3 h-3" />
                  <span>Alerts</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'settings' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-blue-100 border border-blue-200/50'
                  }`}
                >
                  <Settings className="w-3 h-3" />
                  <span>Gateways</span>
                </button>
                <button
                  onClick={() => setActiveTab('system_status')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    activeTab === 'system_status' ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400' : 'bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-200/60'
                  }`}
                >
                  <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                  <span>System Status</span>
                </button>
              </div>
            </div>

            {/* Group 5: Pan-African Features & Provenance */}
            <div className="p-2 bg-purple-50/70 rounded-xl border border-purple-200/70 space-y-1.5 col-span-2 sm:col-span-4">
              <span className="text-[10px] text-purple-800 font-mono font-bold uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                <span>Pan-African Features, Provenance & Curation Suite</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveTab('flash_deals')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'flash_deals' ? 'bg-red-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-red-50 border border-purple-200/50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  <span>⚡ Flash Deals Control</span>
                </button>
                <button
                  onClick={() => setActiveTab('royal_heirlooms')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'royal_heirlooms' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-amber-50 border border-purple-200/50'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-art-gold" />
                  <span>👑 Royal Heirlooms & Custody</span>
                </button>
                <button
                  onClick={() => setActiveTab('curator_picks')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'curator_picks' ? 'bg-purple-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-purple-50 border border-purple-200/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>✨ Curator Picks Editorial</span>
                </button>
                <button
                  onClick={() => setActiveTab('provenance_ledger')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'provenance_ledger' ? 'bg-teal-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-teal-50 border border-purple-200/50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>🏛️ Museum Settlement & Physical QR Ledger</span>
                </button>
                <button
                  onClick={() => setActiveTab('verified_masters')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'verified_masters' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-emerald-50 border border-purple-200/50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🏅 Verified Masters KYC</span>
                </button>
                <button
                  onClick={() => setActiveTab('pan_african_hub')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'pan_african_hub' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-blue-50 border border-purple-200/50'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>🌍 Pan-African Regional Hubs (9)</span>
                </button>
                <button
                  onClick={() => setActiveTab('payout_governance')}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'payout_governance' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-300'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5 text-emerald-600" />
                  <span>💰 Artist Payout Rate ({artistPayoutPercentage}%)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PAN-AFRICAN FEATURES TAB PANELS */}
        {activeTab === 'flash_deals' && <AdminFlashDeals />}
        {activeTab === 'royal_heirlooms' && <AdminRoyalHeirlooms />}
        {activeTab === 'curator_picks' && <AdminCuratorPicks />}
        {activeTab === 'provenance_ledger' && <AdminProvenanceLedger />}
        {activeTab === 'verified_masters' && <AdminVerifiedMasters />}
        {activeTab === 'pan_african_hub' && <AdminPanAfricanHub />}
        {activeTab === 'payout_governance' && <AdminPayoutGovernance />}
        {activeTab === 'media_diagnostics' && <AdminImageDiagnostics />}
        {activeTab === 'demo_transition' && <AdminDemoTransitionSuite />}
        {activeTab === 'artist_videos' && <AdminVideoModeration />}

        {/* 1. OVERVIEW TAB PANEL */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Live Infrastructure Health Quick Pulse */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute inset-0 opacity-75" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 relative" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-emerald-400">All Infrastructure Systems Healthy</span>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-slate-300 border border-white/10">
                      99.98% 90-Day Uptime
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Cloudflare TLS 1.3 Active · WEMA Bank Direct Bridge Connected · Live WebSocket Arena 248 Online
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('system_status')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-200" />
                <span>Open Telemetry Console</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Gross Marketplace Volume</span>
                <p className="font-serif text-3xl font-bold text-slate-900">{formatPrice(totalGrossSales)}</p>
                <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{orders.length} Total Orders Recorded</span>
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Net Revenue ({100 - artistPayoutPercentage}%)</span>
                <p className="font-serif text-3xl font-bold text-art-gold">{formatPrice(totalPlatformCommissions)}</p>
                <p className="text-[10px] text-slate-500 font-mono">{100 - artistPayoutPercentage}% commission on all transacted art</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Settlement Custody Funds</span>
                <p className="font-serif text-3xl font-bold text-amber-700">{formatPrice(totalSettlementHeld)}</p>
                <p className="text-[10px] text-slate-500">Awaiting collector delivery confirmation</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Seller Payouts Disbursed</span>
                <p className="font-serif text-3xl font-bold text-emerald-600">{formatPrice(totalSellerDisbursements)}</p>
                <p className="text-[10px] text-emerald-600 font-bold">{artistPayoutPercentage}% net split settled</p>
              </div>
            </div>

            {/* Core Database Entities Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Freight Pipeline</span>
                  </h4>
                  <button onClick={() => setActiveTab('logistics')} className="text-art-gold font-bold hover:underline">View Pipeline</button>
                </div>
                <div className="space-y-2">
                  {orders.slice(0, 3).map(o => (
                    <div key={o.id} className="p-2.5 bg-slate-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">{o.items?.[0]?.title || o.id}</p>
                        <p className="text-[10px] text-slate-500">{o.logistics?.carrier || 'DHL'} · {o.logistics?.trackingNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                          o.collectorConfirmedDelivery ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.collectorConfirmedDelivery ? 'Confirmed' : 'In Transit'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-600" />
                    <span>Commissions (15%)</span>
                  </h4>
                  <button onClick={() => setActiveTab('commissions')} className="text-art-gold font-bold hover:underline">Disburse Payouts</button>
                </div>
                <div className="space-y-2">
                  {commissions.slice(0, 3).map(c => (
                    <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900 truncate max-w-[130px]">{c.artwork_title}</p>
                        <p className="text-[10px] text-slate-500">{c.seller_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-emerald-600">+{formatPrice(c.platform_fee_amount)}</p>
                        <span className="text-[9px] text-slate-500 font-mono">Net: {formatPrice(c.seller_net_payout)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Master Sellers</span>
                  </h4>
                  <button onClick={() => setActiveTab('sellers')} className="text-art-gold font-bold hover:underline">Manage Sellers</button>
                </div>
                <div className="space-y-2">
                  {sellers.slice(0, 3).map(s => (
                    <div key={s.id} className="p-2.5 bg-slate-50 rounded-xl flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <img src={s.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-500">{s.city}, {s.country}</p>
                        </div>
                      </div>
                      <VerificationBadge badge={s.verification_badge} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. HEADER PAGE MANAGEMENT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'header' && (
          <div className="space-y-6 animate-fade-in text-xs">
            {/* Header Identity & Announcement Banner Settings */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-amber-600" />
                    <span>Header Page & Navigation Settings</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Control brand identity, top announcement message, currency/language toggles, and main navigation links.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Reset header settings to default?')) {
                      resetHeaderConfig();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* General Brand Details & Announcement Bar Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-slate-900 text-sm">Brand Identity</h4>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Brand Title / Logo Text</label>
                    <input
                      type="text"
                      value={headerConfig?.brandName || 'ARTELLIUM'}
                      onChange={(e) => updateHeaderConfig({ brandName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Brand Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={headerConfig?.brandSubtitle || 'AFRICA'}
                      onChange={(e) => updateHeaderConfig({ brandSubtitle: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-slate-900 text-sm">Top Announcement Bar</h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={headerConfig?.announcementActive !== false}
                        onChange={(e) => updateHeaderConfig({ announcementActive: e.target.checked })}
                        className="rounded border-slate-300 text-art-gold focus:ring-art-gold w-4 h-4"
                      />
                      <span className="font-semibold text-slate-700">Display Top Bar</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Top Bar Badge</label>
                    <input
                      type="text"
                      value={headerConfig?.topBarBadge || 'PAN-AFRICAN HERITAGE FIDUCIARY PROTOCOL'}
                      onChange={(e) => updateHeaderConfig({ topBarBadge: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Announcement Message</label>
                    <input
                      type="text"
                      value={headerConfig?.topBarText || 'Physical Authenticity Certificates Signed by Artist & Curator with Museum-Grade Freight to 120+ Countries.'}
                      onChange={(e) => updateHeaderConfig({ topBarText: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Links CRUD Table */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-base">Navigation Menu Links</h4>
                    <p className="text-slate-500">Manage all links displayed in the primary header and mobile drawer.</p>
                  </div>
                  <button
                    onClick={() => {
                      setNavLinkForm({ label: '', href: '', isVisible: true, highlight: 'none', icon: '' });
                      setEditingNavLink(null);
                      setIsAddNavModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Navigation Link</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                        <th className="py-3 px-4 font-semibold">Label</th>
                        <th className="py-3 px-4 font-semibold">Target Route / URL</th>
                        <th className="py-3 px-4 font-semibold">Highlight Style</th>
                        <th className="py-3 px-4 font-semibold">Icon</th>
                        <th className="py-3 px-4 font-semibold">Visibility</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(headerConfig?.navLinks || []).map((link) => (
                        <tr key={link.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                            <span>{link.label}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {link.href}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              link.highlight === 'red' ? 'bg-red-50 text-red-600 border border-red-200' :
                              link.highlight === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                              link.highlight === 'gold' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {link.highlight || 'Normal'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono">
                            {link.icon || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => updateHeaderNavLink(link.id, { isVisible: !link.isVisible })}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                link.isVisible !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {link.isVisible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{link.isVisible !== false ? 'Visible' : 'Hidden'}</span>
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingNavLink(link);
                                setNavLinkForm({
                                  label: link.label,
                                  href: link.href,
                                  isVisible: link.isVisible !== false,
                                  highlight: link.highlight || 'none',
                                  icon: link.icon || ''
                                });
                                setIsAddNavModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${link.label}" navigation link?`)) {
                                  deleteHeaderNavLink(link.id);
                                }
                              }}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. HERO PAGE & MEDIA MANAGEMENT TAB (VIDEO / PHOTO / GALLERY PICKER) */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Tab Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-[10px] font-bold uppercase tracking-wider mb-2 border border-amber-300/60">
                    <Crown className="w-3.5 h-3.5 text-art-gold" />
                    <span>Hero Cinematic Studio</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <span>Hero Section & Full-Screen Video Background</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    Publish high-impact graphic videos or artwork visuals that take the entire hero stage seamlessly behind <strong className="text-slate-700">"ARTELLIUM · The future of African art is safe"</strong>. Upload directly from your device gallery or paste a video link.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm('Reset hero section configuration to defaults?')) {
                        resetHeroConfig();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Controls Column */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Hero Presentation Mode */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block font-serif font-bold text-slate-900 text-sm">Hero Presentation Mode</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {[
                        { id: 'jumia_art_hero', label: 'Jumia Art Marketplace', desc: 'Flagship Traditional 3-Panel Hero with Departments & Live Action Rails (Recommended)' },
                        { id: 'split_banner', label: 'Split Hero Banner', desc: 'Left Typography + Right Curatorial Media Card' },
                        { id: 'gold_reveal', label: 'Gold Reveal Animation', desc: '3D Gold Particle Reveal with Video Background' },
                        { id: 'video_showcase', label: 'Video Showcase Hero', desc: 'Focus on Center Stage Video Player' }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => updateHeroConfig({ heroType: mode.id })}
                          className={`p-3 rounded-xl border text-left transition ${
                            (heroConfig?.heroType || 'jumia_art_hero') === mode.id
                              ? 'border-art-gold bg-amber-50 text-slate-900 shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span className="font-bold text-xs block">{mode.label}</span>
                          <span className="text-[10px] text-slate-500 leading-tight mt-0.5 block">{mode.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brand Typography & Official Slogan Editor */}
                  <div className="p-5 bg-gradient-to-br from-amber-950/20 via-slate-900 to-black text-white rounded-2xl border border-art-gold/40 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-art-gold" />
                        <span className="font-serif font-bold text-sm text-art-gold">Brand Identity & Slogan Governance</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Live on Hero Stage</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium text-[11px]">Brand Name Header</label>
                        <input
                          type="text"
                          value={heroConfig?.brandName || 'ARTELLIUM'}
                          onChange={(e) => updateHeroConfig({ brandName: e.target.value.toUpperCase() })}
                          placeholder="ARTELLIUM"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-art-gold font-serif font-bold tracking-wider text-sm focus:border-art-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 mb-1 font-medium text-[11px]">Official Slogan Tagline</label>
                        <input
                          type="text"
                          value={heroConfig?.tagline || 'The future of African art is safe'}
                          onChange={(e) => updateHeroConfig({ tagline: e.target.value })}
                          placeholder="The future of African art is safe"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-amber-200 font-serif font-semibold text-xs focus:border-art-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-medium text-[11px]">Royal Authenticity Badge / Ribbon</label>
                      <input
                        type="text"
                        value={heroConfig?.badgeText || 'AFRICAN ROYALTY MEETS GLOBAL FINE ART COMMERCE'}
                        onChange={(e) => updateHeroConfig({ badgeText: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[10px] focus:border-art-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Dual Video Publishing Hub: Local Gallery Upload OR Direct Link */}
                  <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-amber-600" />
                        <span className="font-serif font-bold text-sm text-slate-900">Publish Full-Screen Video / Graphic</span>
                      </div>
                      
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => updateHeroConfig({ mediaType: 'video' })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            heroConfig?.mediaType !== 'image' ? 'bg-art-gold text-art-black shadow-sm' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Film className="w-3.5 h-3.5" />
                          <span>Video Spotlight</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateHeroConfig({ mediaType: 'image' })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                            heroConfig?.mediaType === 'image' ? 'bg-art-gold text-art-black shadow-sm' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Static Graphic</span>
                        </button>
                      </div>
                    </div>

                    {/* Local File Upload Dropzone (Gallery Upload) */}
                    <div className="space-y-2">
                      <label className="block text-slate-700 font-semibold text-xs">
                        Option 1: Upload Video / Graphic Directly from Device or Gallery
                      </label>
                      <input
                        type="file"
                        ref={heroVideoInputRef}
                        onChange={handleHeroVideoUpload}
                        accept="video/mp4,video/webm,video/ogg,video/quicktime,image/jpeg,image/png,image/webp"
                        className="hidden"
                      />
                      <div
                        onClick={() => heroVideoInputRef.current?.click()}
                        className="border-2 border-dashed border-amber-300 hover:border-art-gold bg-amber-50/50 hover:bg-amber-50 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                      >
                        <div className="w-12 h-12 rounded-full bg-art-gold/20 flex items-center justify-center text-amber-800 group-hover:scale-110 transition">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">
                            {heroVideoUploading ? 'Processing & Optimizing Video...' : 'Click to Upload Video or Graphic from Gallery'}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Supports MP4, WebM, MOV video files & High-Res PNG, JPG, WebP artwork graphics. Takes entire page seamlessly.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Direct Video Link / Embed URL */}
                    <div className="space-y-3 pt-2">
                      <label className="block text-slate-700 font-semibold text-xs">
                        Option 2: Paste Direct Video URL (Cloudinary, AWS S3, YouTube, Vimeo, MP4 direct)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={heroConfig?.videoUrl || ''}
                          onChange={(e) => updateHeroConfig({ videoUrl: e.target.value, mediaType: 'video' })}
                          placeholder="https://cdn.example.com/artellium-cinematic-reel.mp4"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono text-xs focus:border-art-gold focus:outline-none"
                        />
                        {heroConfig?.videoUrl && (
                          <button
                            type="button"
                            onClick={() => updateHeroConfig({ videoUrl: '' })}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100"
                            title="Clear Video URL"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Catalog Gallery Picker */}
                    <div className="pt-2">
                      <label className="block text-slate-700 font-semibold text-xs mb-1.5">
                        Option 3: Pick Directly from 1,200+ Verified Artworks Catalog
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsGalleryPickerOpen(true)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-sm"
                      >
                        <Palette className="w-4 h-4 text-art-gold" />
                        <span>Browse Verified Masterpieces Catalog</span>
                      </button>
                    </div>

                    {/* Hero Video Carousel Slide Count Controller */}
                    <div className="p-4 bg-slate-900 text-white rounded-2xl border border-art-gold/30 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="font-bold text-art-gold text-xs block">Hero Video Carousel Slide Capacity</span>
                          <p className="text-[11px] text-slate-300">
                            Increase or decrease the maximum number of approved video slides that rotate on the Homepage Hero.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => updateHeroConfig({ maxHeroSlides: Math.max(1, (heroConfig?.maxHeroSlides ?? 4) - 1) })}
                            disabled={(heroConfig?.maxHeroSlides ?? 4) <= 1}
                            className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 font-bold text-white flex items-center justify-center transition disabled:opacity-30"
                          >
                            -
                          </button>
                          <span className="font-mono text-base font-bold text-art-gold min-w-[2rem] text-center">
                            {heroConfig?.maxHeroSlides ?? 4}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateHeroConfig({ maxHeroSlides: Math.min(20, (heroConfig?.maxHeroSlides ?? 4) + 1) })}
                            disabled={(heroConfig?.maxHeroSlides ?? 4) >= 20}
                            className="w-7 h-7 rounded bg-art-gold/20 hover:bg-art-gold/30 text-art-gold font-bold flex items-center justify-center transition border border-art-gold/40 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Video Overlay Dark Contrast & Particle Slider */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs">Background Dark Overlay Contrast</span>
                        <span className="font-mono text-xs font-bold text-amber-700">
                          {Math.round((heroConfig?.videoOverlayOpacity ?? 0.65) * 100)}% Darkness
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="0.95"
                        step="0.05"
                        value={heroConfig?.videoOverlayOpacity ?? 0.65}
                        onChange={(e) => updateHeroConfig({ videoOverlayOpacity: parseFloat(e.target.value) })}
                        className="w-full accent-amber-600 cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-500">
                        Adjust to keep the 3D spinning gold ARTELLIUM letters, embers, and tagline vibrant and crisp over any background video.
                      </p>
                    </div>
                  </div>

                  {/* Secondary Copy & CTAs */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="font-serif font-bold text-slate-900 text-sm">Action Buttons (CTAs)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-900 block">Primary Button</span>
                        <input
                          type="text"
                          value={heroConfig?.primaryCta?.label || 'Explore Catalog'}
                          onChange={(e) => updateHeroConfig({ primaryCta: { ...heroConfig.primaryCta, label: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 text-[11px]"
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={heroConfig?.primaryCta?.href || '/explore'}
                          onChange={(e) => updateHeroConfig({ primaryCta: { ...heroConfig.primaryCta, href: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 text-[11px] font-mono"
                          placeholder="Route"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-red-600 block">Secondary Button</span>
                        <input
                          type="text"
                          value={heroConfig?.secondaryCta?.label || 'Enter Live Auction'}
                          onChange={(e) => updateHeroConfig({ secondaryCta: { ...heroConfig.secondaryCta, label: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 text-[11px]"
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={heroConfig?.secondaryCta?.href || '/auctions'}
                          onChange={(e) => updateHeroConfig({ secondaryCta: { ...heroConfig.secondaryCta, href: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 text-[11px] font-mono"
                          placeholder="Route"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-emerald-600 block">Tertiary Button</span>
                        <input
                          type="text"
                          value={heroConfig?.tertiaryCta?.label || 'Artist Onboarding'}
                          onChange={(e) => updateHeroConfig({ tertiaryCta: { ...heroConfig.tertiaryCta, label: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 text-[11px]"
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={heroConfig?.tertiaryCta?.href || '/artist/register'}
                          onChange={(e) => updateHeroConfig({ tertiaryCta: { ...heroConfig.tertiaryCta, href: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-slate-800 text-[11px] font-mono"
                          placeholder="Route"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Live Stage Preview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-art-gold" />
                      <span>Live 1:1 Hero Stage Simulator</span>
                    </h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[9px] font-bold">
                      ACTIVE PREVIEW
                    </span>
                  </div>

                  {/* Realtime Hero Stage Box */}
                  <div className="relative rounded-3xl overflow-hidden bg-black text-white p-6 border-2 border-art-gold/50 shadow-2xl space-y-4 min-h-[380px] flex flex-col items-center justify-center select-none">
                    
                    {/* Background Video / Graphic Player */}
                    {heroConfig?.videoUrl ? (
                      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        {heroConfig.videoUrl.includes('youtube') || heroConfig.videoUrl.includes('vimeo') ? (
                          <iframe
                            src={`${heroConfig.videoUrl}?autoplay=1&mute=1&controls=0`}
                            title="Hero Preview"
                            className="w-full h-full object-cover scale-150 opacity-50"
                          />
                        ) : (
                          <video
                            src={heroConfig.videoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/85" 
                          style={{ opacity: heroConfig?.videoOverlayOpacity ?? 0.65 }}
                        />
                      </div>
                    ) : heroConfig?.mediaUrl && heroConfig?.mediaType === 'image' ? (
                      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <img
                          src={heroConfig.mediaUrl}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/85" 
                          style={{ opacity: heroConfig?.videoOverlayOpacity ?? 0.65 }}
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#1c1408_0%,#0d0802_50%,#000000_100%)] z-0" />
                    )}

                    {/* Authenticity Seal Mini Stamp */}
                    <div className="absolute top-4 right-4 z-10 w-16 h-16 rounded-full border border-art-gold/40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                      <Crown className="w-6 h-6 text-art-gold animate-pulse" />
                    </div>

                    {/* 3D Gold Typography Replica */}
                    <div className="relative z-10 text-center space-y-3 px-4">
                      <div className="inline-block px-3 py-0.5 rounded-full bg-art-gold/20 text-art-gold border border-art-gold/40 text-[9px] font-mono uppercase tracking-widest">
                        {heroConfig?.badgeText || 'AFRICAN ROYALTY MEETS GLOBAL FINE ART'}
                      </div>

                      <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-art-gold to-amber-500 drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]">
                        {heroConfig?.brandName || 'ARTELLIUM'}
                      </h2>

                      <p className="font-serif text-xs uppercase tracking-[3px] text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {heroConfig?.tagline || 'The future of African art is safe'}
                      </p>

                      <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
                        <span className="px-3 py-1 rounded-lg bg-art-gold text-art-black font-bold text-[10px] uppercase">
                          {heroConfig?.primaryCta?.label || 'Explore Catalog'}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-red-600/80 text-white font-bold text-[10px] uppercase">
                          {heroConfig?.secondaryCta?.label || 'Enter Live Auction'}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-3 left-4 z-10 text-[9px] font-mono text-slate-400 bg-black/80 px-2.5 py-1 rounded-lg border border-white/10">
                      {heroConfig?.videoUrl ? '🎬 Full-Bleed Video Background Active' : '✨ Gold Void Embers Active'}
                    </div>
                  </div>

                  {/* Quick Video Presets */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 text-xs block">Curated African Fine Art Video Presets</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateHeroConfig({
                            videoUrl: '/videos/artist-savannah.mp4',
                            mediaType: 'video'
                          });
                          alert('African Savannah Video Preset Applied!');
                        }}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:border-art-gold text-left text-[11px] font-medium text-slate-700"
                      >
                        🌟 African Savannah Master Reel (MP4)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateHeroConfig({
                            videoUrl: '/videos/artist-studio.mp4',
                            mediaType: 'video'
                          });
                          alert('Master Atelier Studio Reel Preset Applied!');
                        }}
                        className="p-2 rounded-xl bg-white border border-slate-200 hover:border-art-gold text-left text-[11px] font-medium text-slate-700"
                      >
                        🎨 Master Atelier Painting Reel (MP4)
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. HOME PAGE SECTIONS & PROMO BANNERS MANAGEMENT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'homepage' && (
          <div className="space-y-6 animate-fade-in text-xs">
            
            {/* Sections Control */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Home className="w-5 h-5 text-emerald-600" />
                    <span>Home Page Sections Management</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Toggle visibility and edit titles, subtitles, and item display limits for all home page sections.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Reset home page section configuration to defaults?')) {
                      resetHomePageConfig();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* Sections Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                      <th className="py-3 px-4 font-semibold">Section Name / Type</th>
                      <th className="py-3 px-4 font-semibold">Display Title</th>
                      <th className="py-3 px-4 font-semibold">Badge Tag</th>
                      <th className="py-3 px-4 font-semibold">Max Items</th>
                      <th className="py-3 px-4 font-semibold">Visibility</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {(homePageConfig?.sections || []).filter(s => s.type !== 'hero').map((sec) => (
                      <tr key={sec.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <span className="capitalize">{sec.type?.replace('_', ' ')}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-serif">
                          {sec.title || '— (Default)'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                          {sec.badge || '—'}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {sec.maxItems || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleSectionVisibility(sec.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                              sec.isVisible !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {sec.isVisible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{sec.isVisible !== false ? 'Active on Home' : 'Disabled'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingHomeSection(sec);
                              setEditHomeSectionForm({
                                title: sec.title || '',
                                subtitle: sec.subtitle || '',
                                badge: sec.badge || '',
                                maxItems: sec.maxItems || 6
                              });
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Custom Promotional Banners Manager */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                      <Tag className="w-4 h-4 text-art-gold" />
                      <span>Custom Promotional Banners</span>
                    </h4>
                    <p className="text-slate-500">Add highlight banner ribbons between home sections for seasonal auctions or VIP exhibitions.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBanner(null);
                      setBannerForm({
                        title: '',
                        subtitle: '',
                        tag: 'VIP EXHIBITION',
                        buttonText: 'Explore Collection',
                        buttonLink: '/explore',
                        bgGradient: 'from-amber-950 via-slate-900 to-black',
                        borderColor: 'border-art-gold/40'
                      });
                      setIsAddBannerModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Promo Banner</span>
                  </button>
                </div>

                {/* Banners List */}
                <div className="space-y-3">
                  {(homePageConfig?.customPromoBanners || []).length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                      No custom promo banners active. Click "+ Add Promo Banner" to create one.
                    </div>
                  ) : (
                    (homePageConfig?.customPromoBanners || []).map((banner) => (
                      <div
                        key={banner.id}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${banner.bgGradient || 'from-amber-950 via-slate-900 to-black'} p-5 border ${banner.borderColor || 'border-art-gold/40'} text-white flex flex-col md:flex-row md:items-center justify-between gap-4`}
                      >
                        <div className="space-y-1 max-w-xl">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-art-gold/20 text-art-gold font-mono text-[9px] font-bold uppercase tracking-wider border border-art-gold/30">
                            {banner.tag}
                          </span>
                          <h4 className="font-serif text-lg font-bold text-white">{banner.title}</h4>
                          <p className="text-xs text-slate-300">{banner.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingBanner(banner);
                              setBannerForm({
                                title: banner.title,
                                subtitle: banner.subtitle,
                                tag: banner.tag,
                                buttonText: banner.buttonText,
                                buttonLink: banner.buttonLink,
                                bgGradient: banner.bgGradient || 'from-amber-950 via-slate-900 to-black',
                                borderColor: banner.borderColor || 'border-art-gold/40'
                              });
                              setIsAddBannerModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this promo banner?')) {
                                deletePromoBanner(banner.id);
                              }
                            }}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. FOOTER PAGE MANAGEMENT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'footer' && (
          <div className="space-y-6 animate-fade-in text-xs">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Columns className="w-5 h-5 text-blue-600" />
                    <span>Footer Page Management</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Control heritage trust guarantee badges, brand story, newsletter texts, footer columns, links, and social platforms.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Reset footer settings to default?')) {
                      resetFooterConfig();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* Brand & Newsletter Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-slate-900 text-sm">Footer Brand & Copyright</h4>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Brand Title</label>
                    <input
                      type="text"
                      value={footerConfig?.brandTitle || 'ARTELLIUM'}
                      onChange={(e) => updateFooterConfig({ brandTitle: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Brand Story / Mission</label>
                    <textarea
                      rows={3}
                      value={footerConfig?.brandDescription || ''}
                      onChange={(e) => updateFooterConfig({ brandDescription: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Copyright Line (Use {'{year}'} for auto-year)</label>
                    <input
                      type="text"
                      value={footerConfig?.copyrightNotice || '© {year} ARTELLIUM AFRICA. All rights reserved.'}
                      onChange={(e) => updateFooterConfig({ copyrightNotice: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-slate-900 text-sm">Newsletter & Subtext</h4>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Newsletter Placeholder</label>
                    <input
                      type="text"
                      value={footerConfig?.newsletterTitle || 'Join collector newsletter...'}
                      onChange={(e) => updateFooterConfig({ newsletterTitle: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Newsletter Button Text</label>
                    <input
                      type="text"
                      value={footerConfig?.newsletterButtonText || 'Join'}
                      onChange={(e) => updateFooterConfig({ newsletterButtonText: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Bottom Accent Tagline</label>
                    <input
                      type="text"
                      value={footerConfig?.bottomSubtext || 'Crafted with cultural pride & global excellence for African Master Creators.'}
                      onChange={(e) => updateFooterConfig({ bottomSubtext: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Trust Badges Management */}
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Heritage Trust Guarantee Badges</span>
                    </h4>
                    <p className="text-slate-500">Badges displayed across the top banner of the footer.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingBadge(null);
                      setBadgeForm({ title: '', description: '', icon: 'Award', color: 'gold', isVisible: true });
                      setIsAddBadgeModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Trust Badge</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(footerConfig?.trustBadges || []).map((badge) => (
                    <div key={badge.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{badge.icon} ({badge.color})</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingBadge(badge);
                              setBadgeForm({
                                title: badge.title,
                                description: badge.description,
                                icon: badge.icon,
                                color: badge.color,
                                isVisible: badge.isVisible !== false
                              });
                              setIsAddBadgeModalOpen(true);
                            }}
                            className="p-1 text-slate-600 hover:text-slate-900"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${badge.title}" badge?`)) {
                                deleteTrustBadge(badge.id);
                              }
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm">{badge.title}</h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Columns & Links Management */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                      <Columns className="w-4 h-4 text-blue-600" />
                      <span>Footer Navigation Columns & Links</span>
                    </h4>
                    <p className="text-slate-500">Group navigation and informational links by columns.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCol(null);
                      setColForm({ title: '' });
                      setIsAddColModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Column</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(footerConfig?.columns || []).map((col) => (
                    <div key={col.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <h5 className="font-serif font-bold text-slate-900 uppercase text-xs tracking-wider">{col.title}</h5>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingCol(col);
                              setColForm({ title: col.title });
                              setIsAddColModalOpen(true);
                            }}
                            className="p-1 text-slate-600 hover:text-slate-900"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete column "${col.title}" and all its links?`)) {
                                deleteFooterColumn(col.id);
                              }
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Links in this column */}
                      <ul className="space-y-1.5">
                        {(col.links || []).map((link) => (
                          <li key={link.id} className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                            <div>
                              <span className="font-medium text-slate-800 block">{link.label}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{link.href}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setActiveColIdForLink(col.id);
                                  setEditingFooterLink(link);
                                  setFooterLinkForm({
                                    label: link.label,
                                    href: link.href,
                                    highlight: link.highlight || 'none',
                                    isVisible: link.isVisible !== false
                                  });
                                  setIsAddFooterLinkModalOpen(true);
                                }}
                                className="p-1 text-slate-600 hover:text-slate-900"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete link "${link.label}"?`)) {
                                    deleteFooterLink(col.id, link.id);
                                  }
                                }}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => {
                          setActiveColIdForLink(col.id);
                          setEditingFooterLink(null);
                          setFooterLinkForm({ label: '', href: '', highlight: 'none', isVisible: true });
                          setIsAddFooterLinkModalOpen(true);
                        }}
                        className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-center text-[11px] flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Link to {col.title}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Links Management */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                      <Globe className="w-4 h-4 text-art-gold" />
                      <span>Social Media Channels</span>
                    </h4>
                    <p className="text-slate-500">Manage social links rendered in the footer brand box.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSocial(null);
                      setSocialForm({ platform: '', url: '', isVisible: true });
                      setIsAddSocialModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Social Channel</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(footerConfig?.socialLinks || []).map((soc) => (
                    <div key={soc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{soc.platform}</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[160px] block">{soc.url}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingSocial(soc);
                            setSocialForm({ platform: soc.platform, url: soc.url, isVisible: soc.isVisible !== false });
                            setIsAddSocialModalOpen(true);
                          }}
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${soc.platform} link?`)) {
                              deleteSocialLink(soc.id);
                            }
                          }}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* PRIORITY BANNER PLACEMENT & PRICING MANAGEMENT TAB */}
        {activeTab === 'priority_banner' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>Homepage Spotlight Banner & Priority Pricing Management</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Set priority banner sponsorship rates for artists, approve placement requests, and direct-pin artworks to the top curatorial showcase.
                </p>
              </div>
              {bannerSaveNotice && (
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pricing saved & active in artist portals!</span>
                </span>
              )}
            </div>

            {/* Section 1: Admin Price Settings */}
            <div className="p-6 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 rounded-2xl border border-amber-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                <h4 className="font-serif font-bold text-slate-900 text-base">
                  Priority Banner Sponsorship Rates (Set by Platform Admin)
                </h4>
              </div>
              <p className="text-xs text-slate-600">
                These rates are automatically reflected in all artist dashboards when artists subscribe to promote their artwork on the homepage curatorial banner.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  updatePriorityBannerPricing({
                    boost7d: parseFloat(pricingForm.boost7d),
                    monthly: parseFloat(pricingForm.monthly),
                    annual: parseFloat(pricingForm.annual)
                  });
                  setBannerSaveNotice(true);
                  setTimeout(() => setBannerSaveNotice(false), 3500);
                }} 
                className="space-y-4 pt-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">7-Day Priority Boost Rate (₦)</label>
                    <input
                      type="number"
                      required
                      value={pricingForm.boost7d}
                      onChange={(e) => setPricingForm({ ...pricingForm, boost7d: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-900 font-mono focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400">Short-term single piece banner boost</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-amber-300 shadow-sm space-y-1.5">
                    <label className="font-bold text-amber-900 uppercase tracking-wider block">Monthly Priority Tier Rate (₦)</label>
                    <input
                      type="number"
                      required
                      value={pricingForm.monthly}
                      onChange={(e) => setPricingForm({ ...pricingForm, monthly: e.target.value })}
                      className="w-full bg-amber-50/50 border border-amber-300 rounded-xl p-2.5 text-sm font-bold text-amber-950 font-mono focus:border-amber-600 focus:outline-none"
                    />
                    <span className="text-[10px] text-amber-700">Full 30-day banner rotation for all atelier works</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <label className="font-bold text-slate-700 uppercase tracking-wider block">Annual VIP Pass Rate (₦)</label>
                    <input
                      type="number"
                      required
                      value={pricingForm.annual}
                      onChange={(e) => setPricingForm({ ...pricingForm, annual: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-900 font-mono focus:border-amber-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400">Year-round permanent top banner slot</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Priority Pricing Structure</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Direct Admin Placement */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-art-gold" />
                <h4 className="font-serif font-bold text-slate-900 text-base">
                  Direct Admin Masterpiece Pin to Homepage Banner
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                Immediately pin any masterwork from the catalog to the Curatorial Spotlight banner slideshow without waiting for an artist request.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={selectedArtForDirectBanner}
                  onChange={(e) => setSelectedArtForDirectBanner(e.target.value)}
                  className="w-full sm:w-2/3 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Select Artwork to Pin to Homepage Spotlight --</option>
                  {artworks.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.title} by {a.artistName} ({formatPrice(a.price)})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={!selectedArtForDirectBanner}
                  onClick={() => {
                    const art = artworks.find(a => a.id === selectedArtForDirectBanner);
                    if (!art) return;
                    addDirectPriorityBannerPlacement({
                      artworkId: art.id,
                      title: art.title,
                      artistName: art.artistName,
                      artistId: art.artistId || 'artist-1',
                      country: art.country || 'Nigeria',
                      countryFlag: art.countryFlag || '🇳🇬',
                      medium: art.medium || 'Fine Art',
                      dimensions: art.dimensions || '',
                      price: art.price,
                      priceUSD: art.priceUSD,
                      image: art.image,
                      plan: 'admin_curated',
                      pricePaid: 0
                    });
                    setSelectedArtForDirectBanner('');
                    alert(`"${art.title}" is now active in the Curatorial Spotlight banner!`);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Pin to Banner</span>
                </button>
              </div>
            </div>

            {/* Section 3: Active & Pending Banner Placements Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
                  <Package className="w-5 h-5 text-art-gold" />
                  <span>Curatorial Spotlight Banner Rotation ({priorityBannerPlacements.length})</span>
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  {priorityBannerPlacements.filter(p => p.status === 'active').length} Active on Live Homepage
                </span>
              </div>

              {priorityBannerPlacements.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  No artworks in priority banner queue. Pin an artwork above or approve artist submissions.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Artwork</th>
                        <th className="py-3 px-4">Artist</th>
                        <th className="py-3 px-4">Plan / Duration</th>
                        <th className="py-3 px-4">Rate Paid</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {priorityBannerPlacements.map((placement) => (
                        <tr key={placement.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={placement.image || placement.artworkImage}
                                alt=""
                                className="w-12 h-10 rounded-lg object-cover border border-slate-200"
                              />
                              <div>
                                <span className="font-serif font-bold text-slate-900 block">{placement.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{placement.artworkId}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {placement.artistName}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 capitalize">
                              {placement.plan?.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Ends: {placement.endDate || 'Active'}</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {placement.pricePaid ? `₦${placement.pricePaid.toLocaleString()}` : 'Admin Free'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              placement.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : placement.status === 'rejected' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {placement.status === 'active' ? 'Active on Home' : placement.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {placement.status !== 'active' && (
                              <button
                                onClick={() => approvePriorityBannerPlacement(placement.id)}
                                className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold text-[11px]"
                              >
                                Approve
                              </button>
                            )}
                            {placement.status === 'active' && (
                              <button
                                onClick={() => rejectPriorityBannerPlacement(placement.id)}
                                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg font-bold text-[11px]"
                              >
                                Pause
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`Remove "${placement.title}" from banner queue?`)) {
                                  deletePriorityBannerPlacement(placement.id);
                                }
                              }}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-[11px]"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* LIVE AUCTION ARENA SOVEREIGN OVERSIGHT TAB */}
        {activeTab === 'live_auctions' && (
          <div className="animate-fade-in">
            <AdminLiveAuctionOversight />
          </div>
        )}

        {/* AUCTION BIDDERS & PATRON LEAD DIRECTORY TAB */}
        {activeTab === 'auction_bidders' && (
          <div className="animate-fade-in">
            <AdminAuctionBidders />
          </div>
        )}

        {/* ART EXHIBITIONS & SDGS SUSTAINABILITY CMS MANAGEMENT TAB */}
        {activeTab === 'exhibitions' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  <span>Art Exhibitions & SDGs Curatorial Program Control</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We curate exhibitions that showcase artistic excellence while connecting creators with wider audiences through various SDGs discussions for a sustainable living.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/exhibitions"
                  target="_blank"
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public 3D Hall</span>
                </Link>
              </div>
            </div>

            {/* 4 Exhibition Types Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                {
                  format: 'Physical exhibitions',
                  title: 'Dynasties of the Niger: Benin Bronze & Sacred Timber',
                  location: 'National Museum Pavilion, Lagos, Nigeria',
                  sdg: 'SDG 11: Cultural Heritage',
                  status: 'Live Now'
                },
                {
                  format: 'Virtual exhibitions',
                  title: 'Pan-African 3D Spatial Continuum',
                  location: 'Immersive 3D WebGL Gallery Hall',
                  sdg: 'SDG 9: Digital Infrastructure',
                  status: 'Live Now'
                },
                {
                  format: 'Pop-up galleries',
                  title: 'Earth Pigments & Sustainable Living Salon',
                  location: 'Victoria Island Curatorial Lounge, Lagos',
                  sdg: 'SDG 12: Eco Raw Materials',
                  status: 'Live Now'
                },
                {
                  format: 'International showcases',
                  title: 'African Master Creators: London & Paris Diaspora Biennale',
                  location: 'Grand Palais Diaspora Pavilion, Paris & London',
                  sdg: 'SDG 8 & 17: Creator Growth & Global Partnerships',
                  status: 'Upcoming'
                },
              ].map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        {ex.format}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-500">{ex.status}</span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-xs pt-1">{ex.title}</h4>
                    <p className="text-[10px] text-slate-500">{ex.location}</p>
                    <div className="p-1.5 bg-emerald-50 text-emerald-800 rounded font-mono text-[9px] flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{ex.sdg}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Status & Curator settings for "${ex.title}" updated!`)}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase rounded-lg transition"
                  >
                    Manage Curatorial Staging
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. WEMA BANK DIRECT SETTLEMENTS TAB */}
        {activeTab === 'logistics' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-600" />
                  <span>WEMA Bank Direct Settlements & Corporate Invoices</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Verified corporate inflows settled directly into Artellium WEMA Bank Account (0123456789) and direct artist disbursements.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                {orders.length} Verified Settlements
              </span>
            </div>

            <div className="space-y-4">
              {orders.map(ord => {
                const item = ord.items?.[0];
                const comm = commissions.find(c => c.order_id === ord.id);
                const seller = sellers.find(s => s.name?.toLowerCase().includes(item?.artistName?.toLowerCase()) || s.id === item?.artistId);

                return (
                  <div key={ord.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                    
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm">{ord.id}</span>
                          <span className="font-serif font-bold text-slate-900 text-sm">· {item?.title}</span>
                          <span className="text-[10px] text-slate-500 font-sans">by {item?.artistName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Collector: <strong className="text-slate-800">{ord.buyer_name}</strong> · {ord.buyer_email} · {ord.buyer_phone}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 text-sm">{formatPrice(ord.total_amount)} Gross</span>
                        <span className="block text-[10px] text-emerald-700 font-bold font-mono">
                          {artistPayoutPercentage}% Net Payout: {formatPrice(ord.total_amount * (artistPayoutPercentage / 100))}
                        </span>
                      </div>
                    </div>

                    {/* Settlement Details Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                      
                      {/* Corporate Settlement Bank */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Settlement Gateway & Bank</span>
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-art-gold" />
                          <span>{ord.settlement_bank || 'Wema Bank PLC'}</span>
                        </p>
                        <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] inline-block border border-amber-200">
                          Acct: 0123456789 (Corporate Settlement)
                        </span>
                      </div>

                      {/* Settlement Status */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Fiduciary Status</span>
                        <p className="font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Direct Settlement Confirmed</span>
                        </p>
                        <p className="text-[10px] text-slate-500">Certificate of Authenticity Active</p>
                      </div>

                      {/* Settlement Action Bar */}
                      <div className="space-y-2 text-right md:border-l md:border-slate-100 md:pl-4">
                        <span className="text-[10px] text-slate-400 font-mono uppercase block">Artist Net Payout</span>
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{artistPayoutPercentage}% Net Reserved</span>
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Artist Payout Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200">
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          Artist Payout Account: <strong className="text-slate-800 font-semibold">{seller?.payout_account_name || `${item?.artistName} Enterprise`}</strong> · {seller?.payout_bank || 'Access Bank'} ({seller?.payout_account || '01002345678'})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {comm && comm.payout_status !== 'disbursed' ? (
                          <button
                            onClick={() => {
                              disburseCommission(comm.id);
                              logSandboxAction(`Admin disbursed ${artistPayoutPercentage}% payout (₦${comm.seller_net_payout.toLocaleString()}) to ${comm.seller_name}`);
                              alert(`${artistPayoutPercentage}% Net Payout (₦${comm.seller_net_payout.toLocaleString()}) disbursed to ${seller?.payout_account_name || comm.seller_name}'s bank account!`);
                            }}
                            className="px-4 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800"
                          >
                            <DollarSign className="w-4 h-4" />
                            <span>Disburse {artistPayoutPercentage}% Net Payout</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{artistPayoutPercentage}% Payout Disbursed & Settled</span>
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. ORDERS LIFECYCLE TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-art-gold" />
                  <span>Orders Lifecycle & Acquisition Ledger</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage confirmed collector acquisitions, buyer contact profiles, and settlement lifecycle states.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                {orders.length} Orders Registered
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Collector Contact</th>
                    <th className="pb-3 font-semibold">Purchased Masterpiece</th>
                    <th className="pb-3 font-semibold">Gross Amount</th>
                    <th className="pb-3 font-semibold">Settlement Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 font-mono font-bold text-slate-900">
                        {ord.id}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="py-4">
                        <p className="font-bold text-slate-900">{ord.buyer_name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{ord.buyer_email}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{ord.buyer_phone}</p>
                      </td>

                      <td className="py-4">
                        <div className="space-y-1">
                          {ord.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-art-gold" />
                              <span className="font-medium text-slate-800">{item.title}</span>
                              <span className="text-[10px] text-slate-500 font-mono">({formatPrice(item.price)})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 font-mono font-bold text-slate-900">
                        {formatPrice(ord.total_amount)}
                      </td>

                      <td className="py-4">
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            updateOrderStatus(ord.id, e.target.value);
                            logSandboxAction(`Order ${ord.id} status changed to ${e.target.value}`);
                          }}
                          className="bg-slate-100 border border-slate-200 text-xs font-semibold rounded-lg px-2 py-1 text-slate-800 cursor-pointer focus:outline-none focus:border-art-gold"
                        >
                          <option value="paid">Paid & Settled (WEMA)</option>
                          <option value="completed">Completed & Closed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingOrder(ord);
                            setEditOrderForm({
                              buyer_name: ord.buyer_name,
                              buyer_email: ord.buyer_email,
                              buyer_phone: ord.buyer_phone || '',
                              total_amount: ord.total_amount,
                              status: ord.status
                            });
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                          title="Edit Order"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete order ${ord.id} from ledger?`)) {
                              deleteOrder(ord.id);
                              logSandboxAction(`Deleted order ${ord.id}`);
                            }
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Order Modal */}
            {editingOrder && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-900">Edit Order · {editingOrder.id}</h3>
                    <button onClick={() => setEditingOrder(null)} className="text-slate-400 font-bold">✕</button>
                  </div>
                  <form onSubmit={handleSaveOrderEdit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1">Buyer Full Name</label>
                      <input
                        type="text"
                        value={editOrderForm.buyer_name}
                        onChange={e => setEditOrderForm({ ...editOrderForm, buyer_name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Buyer Email</label>
                        <input
                          type="email"
                          value={editOrderForm.buyer_email}
                          onChange={e => setEditOrderForm({ ...editOrderForm, buyer_email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Buyer Phone</label>
                        <input
                          type="text"
                          value={editOrderForm.buyer_phone}
                          onChange={e => setEditOrderForm({ ...editOrderForm, buyer_phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Settlement Status</label>
                      <select
                        value={editOrderForm.status}
                        onChange={e => setEditOrderForm({ ...editOrderForm, status: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 cursor-pointer"
                      >
                        <option value="paid">Paid & Settled (WEMA)</option>
                        <option value="completed">Completed & Closed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button type="button" onClick={() => setEditingOrder(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                      <button type="submit" className="px-5 py-2 bg-art-gold text-art-black font-bold uppercase rounded-xl">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. COMMISSIONS TAB */}
        {activeTab === 'commissions' && (
          <div className="space-y-8 animate-fade-in">
            {/* Embedded Live Payout Governance Portal */}
            <AdminPayoutGovernance />

            {/* Commissions Table Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Percent className="w-5 h-5 text-emerald-600" />
                    <span>Real-Time Commission Auditing & Seller Disbursements</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {100 - artistPayoutPercentage}% Platform Commission Fee applied automatically to gross art sales; {artistPayoutPercentage}% net payout reserved for master artists.
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-right">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Platform Revenue Total:</span>
                  <span className="font-serif text-lg font-bold text-emerald-700">{formatPrice(totalPlatformCommissions)}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                      <th className="pb-3 font-semibold">Masterpiece Sold</th>
                      <th className="pb-3 font-semibold">Master Artist (Seller)</th>
                      <th className="pb-3 font-semibold">Gross Sale</th>
                      <th className="pb-3 font-semibold">Platform Commission ({100 - artistPayoutPercentage}%)</th>
                      <th className="pb-3 font-semibold">Seller Net Payout ({artistPayoutPercentage}%)</th>
                      <th className="pb-3 font-semibold">Payout Status</th>
                      <th className="pb-3 font-semibold text-right">Disbursement / Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {commissions.map((c) => {
                      const seller = sellers.find(s => s.name?.toLowerCase().includes(c.seller_name?.toLowerCase()) || s.id === c.seller_id);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition">
                          <td className="py-4">
                            <p className="font-serif font-bold text-slate-900">{c.artwork_title}</p>
                            <span className="text-[10px] font-mono text-slate-400">Order: {c.order_id}</span>
                          </td>

                          <td className="py-4">
                            <p className="font-medium text-slate-800">{c.seller_name}</p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {seller?.payout_account_name || 'Studio'} · {seller?.payout_bank}
                            </span>
                          </td>

                          <td className="py-4 font-mono font-bold text-slate-900">
                            {formatPrice(c.gross_amount)}
                          </td>

                          <td className="py-4 font-mono font-bold text-art-gold">
                            {formatPrice(c.platform_fee_amount)}
                            <span className="block text-[9px] text-slate-400 font-sans font-normal">{100 - artistPayoutPercentage}% platform cut</span>
                          </td>

                          <td className="py-4 font-mono font-bold text-emerald-700">
                            {formatPrice(c.seller_net_payout)}
                            <span className="block text-[9px] text-slate-400 font-sans font-normal">{artistPayoutPercentage}% artist net</span>
                          </td>

                          <td className="py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                              c.payout_status === 'disbursed' ? 'bg-emerald-100 text-emerald-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {c.payout_status}
                            </span>
                          </td>

                          <td className="py-4 text-right space-x-2">
                            {c.payout_status !== 'disbursed' ? (
                              <button
                                onClick={() => {
                                  disburseCommission(c.id);
                                  logSandboxAction(`Disbursed ₦${c.seller_net_payout.toLocaleString()} to ${c.seller_name}`);
                                  alert(`Payout of ₦${c.seller_net_payout.toLocaleString()} released directly to ${seller?.payout_account_name || c.seller_name}!`);
                                }}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase rounded-lg transition shadow-sm"
                              >
                                Disburse {artistPayoutPercentage}% Payout
                              </button>
                            ) : (
                              <span className="text-emerald-700 text-[10px] font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Settled</span>
                              </span>
                            )}

                          <button
                            onClick={() => {
                              if (confirm(`Delete commission record ${c.id}?`)) {
                                deleteCommission(c.id);
                                logSandboxAction(`Deleted commission ${c.id}`);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg inline-block align-middle"
                            title="Delete Commission Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

        {/* 5. PAYMENTS & SETTLEMENT LEDGER TAB */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-art-gold" />
                  <span>Payments & Gateway Vault Ledger</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Full transaction audit log with gateway payment references, amounts, and settlement vault status.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                {payments.length} Payments Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-3 font-semibold">Payment ID</th>
                    <th className="pb-3 font-semibold">Order Reference</th>
                    <th className="pb-3 font-semibold">Payer / Collector</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Gateway Method</th>
                    <th className="pb-3 font-semibold">Payment Reference</th>
                    <th className="pb-3 font-semibold">Vault Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 font-mono font-bold text-slate-900">{p.id}</td>
                      <td className="py-3.5 font-mono text-art-gold font-bold">{p.order_id}</td>
                      <td className="py-3.5 font-medium text-slate-800">{p.buyer_name}</td>
                      <td className="py-3.5 font-mono font-bold text-slate-900">{formatPrice(p.amount)}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded uppercase font-bold text-[9px] bg-slate-100 text-slate-700 font-mono">
                          {p.payment_method}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-[10px] text-slate-500">{p.payment_reference}</td>
                      <td className="py-3.5">
                        <select
                          value={p.status}
                          onChange={(e) => {
                            updatePayment(p.id, { status: e.target.value });
                            logSandboxAction(`Payment ${p.id} status changed to ${e.target.value}`);
                          }}
                          className="bg-slate-100 border border-slate-200 text-[10px] font-semibold rounded px-2 py-1 text-slate-800 cursor-pointer"
                        >
                          <option value="settled_wema">🏦 Settled (WEMA Corporate)</option>
                          <option value="disbursed_to_seller">✅ Disbursed to Seller</option>
                          <option value="refunded">↩️ Direct Bank Refund</option>
                          <option value="failed">❌ Failed</option>
                        </select>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove payment record ${p.id}?`)) {
                              deletePayment(p.id);
                              logSandboxAction(`Deleted payment ${p.id}`);
                            }
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                          title="Delete Payment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. ARTWORKS & BADGES MANAGEMENT TAB */}
        {activeTab === 'artworks' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-art-gold" />
                  <span>Master Artwork Catalogue & Verification Control</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add new catalog masterpieces, edit provenance origins, and assign Gold or Heritage badges.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsAddArtModalOpen(true)}
                  className="px-3 py-1.5 bg-art-gold text-art-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Artwork</span>
                </button>

                <input
                  type="text"
                  placeholder="Filter artwork, artist, country..."
                  value={artSearchTerm}
                  onChange={(e) => setArtSearchTerm(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-art-gold"
                />
                <select
                  value={artBadgeFilter}
                  onChange={(e) => setArtBadgeFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Badges</option>
                  <option value="gold">👑 Gold Only</option>
                  <option value="heritage">🏆 Heritage Only</option>
                  <option value="verified">✅ Verified Only</option>
                  <option value="none">No Badge</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-3 font-semibold">Masterpiece</th>
                    <th className="pb-3 font-semibold">Artist</th>
                    <th className="pb-3 font-semibold">Origin Location</th>
                    <th className="pb-3 font-semibold">Verification Badge</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredArtworks.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 pr-4 flex items-center gap-3">
                        <img src={art.image} alt={art.title} className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" />
                        <div>
                          <p className="font-serif font-bold text-slate-900 line-clamp-1">{art.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{art.medium}</span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4">
                        <span className="font-semibold text-slate-800">{art.artistName}</span>
                      </td>

                      <td className="py-3.5 pr-4">
                        <span className="text-slate-700 flex items-center gap-1 font-medium">
                          <span>{art.countryFlag || '🌍'}</span>
                          <span>{art.city}, {art.country}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Ships: {art.shipsTo?.join(', ') || 'Worldwide'}
                        </span>
                      </td>

                      <td className="py-3.5 pr-4">
                        <div className="space-y-1">
                          <VerificationBadge badge={art.verificationBadge} />
                          <select
                            value={art.verificationBadge || ''}
                            onChange={(e) => {
                              const newBadge = e.target.value || null;
                              updateArtwork(art.id, { verificationBadge: newBadge });
                              logSandboxAction(`Updated badge for "${art.title}" to ${newBadge || 'None'}`);
                            }}
                            className="bg-slate-100 border border-slate-200 text-[10px] rounded px-1.5 py-0.5 mt-1 block cursor-pointer"
                          >
                            <option value="">No Badge</option>
                            <option value="gold">👑 Gold</option>
                            <option value="heritage">🏆 Heritage</option>
                            <option value="verified">✅ Verified</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4 font-mono font-bold text-slate-900">
                        {formatPrice(art.price)}
                      </td>

                      <td className="py-3.5 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          art.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                          art.status === 'sold' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {art.status}
                        </span>
                      </td>

                      <td className="py-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingArtwork(art);
                            setEditArtForm({
                              title: art.title,
                              price: art.price,
                              country: art.country || 'Nigeria',
                              city: art.city || 'Lagos',
                              countryFlag: art.countryFlag || '🇳🇬',
                              medium: art.medium,
                              dimensions: art.dimensions,
                              studioNotes: art.studioNotes || '',
                              category: art.category || 'Paintings',
                              image: art.image || '',
                              additionalImages: art.additionalImages || [],
                              status: art.status
                            });
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                          title="Edit Artwork Metadata"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete "${art.title}" from marketplace?`)) {
                              deleteArtwork(art.id);
                              logSandboxAction(`Deleted artwork "${art.title}"`);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-semibold"
                          title="Delete Artwork"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Artwork Modal */}
            {isAddArtModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-900">Add New Masterpiece to Catalogue</h3>
                    <button onClick={() => setIsAddArtModalOpen(false)} className="text-slate-400 font-bold">✕</button>
                  </div>
                  <form onSubmit={handleCreateArtwork} className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={newArtForm.title}
                          onChange={e => setNewArtForm({ ...newArtForm, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Artist Name</label>
                        <input
                          type="text"
                          required
                          value={newArtForm.artistName}
                          onChange={e => setNewArtForm({ ...newArtForm, artistName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Price (₦ NGN)</label>
                        <input
                          type="number"
                          required
                          value={newArtForm.price}
                          onChange={e => setNewArtForm({ ...newArtForm, price: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Category</label>
                        <select
                          value={newArtForm.category}
                          onChange={e => setNewArtForm({ ...newArtForm, category: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
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
                          <option value="Handmade crafts">Handmade crafts</option>
                          <option value="Indigenous artworks">Indigenous artworks</option>
                          <option value="Limited edition collections">Limited edition collections</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Origin Country</label>
                        <input
                          type="text"
                          value={newArtForm.country}
                          onChange={e => setNewArtForm({ ...newArtForm, country: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Origin City / Atelier</label>
                        <input
                          type="text"
                          value={newArtForm.city}
                          onChange={e => setNewArtForm({ ...newArtForm, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Artwork Photography & Studio Proof Suite */}
                    <div>
                      <label className="block text-slate-600 mb-1.5 font-medium">Artwork Photography</label>
                      <ArtworkPhotoUploader
                        mainImage={newArtForm.image}
                        additionalImages={newArtForm.additionalImages || []}
                        onMainImageChange={(img) => setNewArtForm({ ...newArtForm, image: img })}
                        onAdditionalImagesChange={(imgs) => setNewArtForm({ ...newArtForm, additionalImages: imgs })}
                        artworkCategory={newArtForm.category}
                        artworkTitle={newArtForm.title || 'New Masterpiece'}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">Studio Journal Notes</label>
                      <textarea
                        rows="2"
                        value={newArtForm.studioNotes}
                        onChange={e => setNewArtForm({ ...newArtForm, studioNotes: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button type="button" onClick={() => setIsAddArtModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                      <button type="submit" className="px-5 py-2 bg-art-gold text-art-black font-bold uppercase rounded-xl">Add Artwork</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Artwork Edit Modal */}
            {editingArtwork && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-900">
                      Edit Artwork Metadata · {editingArtwork.title}
                    </h3>
                    <button onClick={() => setEditingArtwork(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveArtworkEdit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Title</label>
                        <input
                          type="text"
                          required
                          value={editArtForm.title}
                          onChange={(e) => setEditArtForm({ ...editArtForm, title: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Price (₦ NGN)</label>
                        <input
                          type="number"
                          required
                          value={editArtForm.price}
                          onChange={(e) => setEditArtForm({ ...editArtForm, price: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Origin Country</label>
                        <input
                          type="text"
                          value={editArtForm.country}
                          onChange={(e) => setEditArtForm({ ...editArtForm, country: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-medium">Origin City / Atelier</label>
                        <input
                          type="text"
                          value={editArtForm.city}
                          onChange={(e) => setEditArtForm({ ...editArtForm, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Artist Studio Journal / Notes</label>
                      <textarea
                        rows="3"
                        value={editArtForm.studioNotes}
                        onChange={(e) => setEditArtForm({ ...editArtForm, studioNotes: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                      />
                    </div>

                    {/* Artwork Photography & Studio Proof Suite */}
                    <div>
                      <label className="block text-slate-600 mb-1.5 font-medium">Update Artwork Photography</label>
                      <ArtworkPhotoUploader
                        mainImage={editArtForm.image}
                        additionalImages={editArtForm.additionalImages || []}
                        onMainImageChange={(img) => setEditArtForm({ ...editArtForm, image: img })}
                        onAdditionalImagesChange={(imgs) => setEditArtForm({ ...editArtForm, additionalImages: imgs })}
                        artworkCategory={editArtForm.category || 'Paintings'}
                        artworkTitle={editArtForm.title || editingArtwork.title}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditingArtwork(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl transition shadow"
                      >
                        Save Metadata
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. Q&A MODERATION TAB */}
        {activeTab === 'qa' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-art-gold" />
                <span>Pre-Purchase Inquiries & Q&A Moderation</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Moderate, edit, or delete public collector inquiries across all listed artworks.
              </p>
            </div>

            <div className="space-y-4">
              {artworkQuestions.map((q) => {
                const relatedArt = artworks.find(a => a.id === q.artworkId);
                return (
                  <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-slate-400">
                        Artwork: <strong className="text-slate-900">{relatedArt?.title || q.artworkId}</strong> · Asked by {q.askedBy} on {q.date}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('Delete this question from public artwork page?')) {
                            deleteQuestion(q.id);
                            logSandboxAction(`Deleted question ${q.id}`);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 font-semibold text-[10px] uppercase flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-slate-900">Q: "{q.question}"</p>

                    {q.answer ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase">Answer (by {q.answeredBy || 'Artist'}):</span>
                          <button
                            onClick={() => {
                              setEditingQId(q.id);
                              setEditQAnswer(q.answer);
                            }}
                            className="text-[10px] font-bold text-slate-500 hover:text-slate-800 underline"
                          >
                            Edit Answer
                          </button>
                        </div>
                        {editingQId === q.id ? (
                          <div className="flex gap-2 pt-1">
                            <input
                              type="text"
                              value={editQAnswer}
                              onChange={(e) => setEditQAnswer(e.target.value)}
                              className="flex-1 bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                            />
                            <button
                              onClick={() => {
                                editQuestionAnswer(q.id, editQAnswer, 'Admin Editor');
                                setEditingQId(null);
                                logSandboxAction(`Edited answer for question ${q.id}`);
                              }}
                              className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <p className="text-slate-700 italic">"{q.answer}"</p>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                        <span className="text-amber-800 italic">Awaiting artist response...</span>
                        <button
                          onClick={() => {
                            const ans = prompt('Provide admin curatorial answer:');
                            if (ans) {
                              editQuestionAnswer(q.id, ans, 'ARTELLIUM Curator');
                              logSandboxAction(`Admin answered inquiry ${q.id}`);
                            }
                          }}
                          className="px-3 py-1 bg-art-gold text-art-black rounded text-[10px] font-bold uppercase"
                        >
                          Answer as Curator
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 8. BROADCASTS & PRIVATE BUYOUTS TAB */}
        {activeTab === 'broadcasts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-art-gold" />
                    <span>Broadcast Notification / Alert</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Send platform alerts, price reduction bulletins, or exhibition invites to all collectors.
                  </p>
                </div>

                {broadcastSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Alert transmitted to all collector dashboards!</span>
                  </div>
                )}

                <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Broadcast Alert Message</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="e.g. 🌟 Flash Curatorial Release: 3 new lost-wax bronze sculptures listed from Benin City..."
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-art-gold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Platform Alert</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                    <span>Private Buyout Bourse Oversight</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Audit all private acquisition proposals across the marketplace.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  {collectorOffers.map((o) => (
                    <div key={o.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-bold text-slate-900">{o.artworkTitle}</span>
                        <span className="font-mono font-bold text-emerald-700">{formatPrice(o.amount)}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">Proposed by: <strong className="text-slate-900">{o.buyerName}</strong> on {o.date}</p>
                      {o.note && <p className="text-[10px] text-slate-500 italic bg-white p-2 rounded border border-slate-150">"{o.note}"</p>}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          o.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {o.status}
                        </span>
                        {o.status === 'pending' && (
                          <button
                            onClick={() => {
                              updateCollectorOfferStatus(o.id, 'accepted');
                              logSandboxAction(`Admin accepted offer ${o.id} for ${o.artworkTitle}`);
                            }}
                            className="text-[10px] font-bold text-emerald-700 hover:underline"
                          >
                            Approve to Settlement
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. SOVEREIGN USER GOVERNANCE & SECURITY COUNCIL TAB */}
        {activeTab === 'users' && (
          <AdminUserGovernance
            usersList={usersList}
            sellers={sellers}
            setUserStatus={setUserStatus}
            addUserSecurityIncident={addUserSecurityIncident}
            addUser={addUser}
            updateUser={updateUser}
            deleteUser={deleteUser}
            currentUser={currentUser}
          />
        )}

        {/* 10. USERS & SELLERS DIRECTORY TAB */}
        {activeTab === 'sellers' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-art-gold" />
                  <span>Users & Master Sellers Directory</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Accredited artists and buyers with payout banking account names and commission configurations.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddSellerModalOpen(true)}
                  className="px-3 py-1.5 bg-art-gold text-art-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Seller</span>
                </button>
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
                  {sellers.length} Sellers / {usersList.length} Accounts
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="pb-3 font-semibold">Artist / Seller</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Accreditation Tier</th>
                    <th className="pb-3 font-semibold">Commission Split</th>
                    <th className="pb-3 font-semibold">Payout Banking Credentials</th>
                    <th className="pb-3 font-semibold">Verification</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 flex items-center gap-3">
                        <img src={s.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {s.id}</p>
                        </div>
                      </td>

                      <td className="py-4">
                        <span className="font-medium text-slate-800">{s.city}, {s.country}</span>
                        <span className="ml-1">{s.country_flag}</span>
                      </td>

                      <td className="py-4">
                        <span className="badge-gold px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">
                          {s.tier || 'Standard'}
                        </span>
                      </td>

                      <td className="py-4 font-mono font-bold text-slate-900">
                        {artistPayoutPercentage}% Net ({100 - artistPayoutPercentage}% platform)
                      </td>

                      <td className="py-4 text-[11px]">
                        <p className="font-bold text-slate-900">{s.payout_account_name || `${s.name} Studio`}</p>
                        <p className="text-slate-500 font-mono">{s.payout_bank} · {s.payout_account}</p>
                      </td>

                      <td className="py-4">
                        <VerificationBadge badge={s.verification_badge} />
                      </td>

                      <td className="py-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingSeller(s);
                            setEditSellerForm({
                              name: s.name,
                              bio: s.bio || '',
                              country: s.country,
                              city: s.city,
                              tier: s.tier || 'Premium',
                              verification_badge: s.verification_badge || 'gold',
                              payout_account_name: s.payout_account_name || `${s.name} Enterprise`,
                              payout_bank: s.payout_bank || 'Access Bank PLC',
                              payout_account: s.payout_account || '0123456789'
                            });
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                          title="Edit Seller"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove seller "${s.name}"?`)) {
                              deleteSeller(s.id);
                              logSandboxAction(`Deleted seller ${s.name}`);
                            }
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                          title="Delete Seller"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Seller Modal */}
            {editingSeller && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-900">Edit Seller · {editingSeller.name}</h3>
                    <button onClick={() => setEditingSeller(null)} className="text-slate-400 font-bold">✕</button>
                  </div>
                  <form onSubmit={handleSaveSellerEdit} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1">Seller Full Name</label>
                      <input
                        type="text"
                        value={editSellerForm.name}
                        onChange={e => setEditSellerForm({ ...editSellerForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Payout Account Name</label>
                      <input
                        type="text"
                        value={editSellerForm.payout_account_name}
                        onChange={e => setEditSellerForm({ ...editSellerForm, payout_account_name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Country</label>
                        <input
                          type="text"
                          value={editSellerForm.country}
                          onChange={e => setEditSellerForm({ ...editSellerForm, country: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">City</label>
                        <input
                          type="text"
                          value={editSellerForm.city}
                          onChange={e => setEditSellerForm({ ...editSellerForm, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Payout Bank Name</label>
                        <input
                          type="text"
                          value={editSellerForm.payout_bank}
                          onChange={e => setEditSellerForm({ ...editSellerForm, payout_bank: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Bank Account Number</label>
                        <input
                          type="text"
                          value={editSellerForm.payout_account}
                          onChange={e => setEditSellerForm({ ...editSellerForm, payout_account: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Accreditation Tier</label>
                        <select
                          value={editSellerForm.tier}
                          onChange={e => setEditSellerForm({ ...editSellerForm, tier: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 cursor-pointer"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Premium">Premium</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Verification Badge</label>
                        <select
                          value={editSellerForm.verification_badge}
                          onChange={e => setEditSellerForm({ ...editSellerForm, verification_badge: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 cursor-pointer"
                        >
                          <option value="gold">👑 Gold</option>
                          <option value="heritage">🏆 Heritage</option>
                          <option value="verified">✅ Verified</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button type="button" onClick={() => setEditingSeller(null)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                      <button type="submit" className="px-5 py-2 bg-art-gold text-art-black font-bold uppercase rounded-xl">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add Seller Modal */}
            {isAddSellerModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-900">Accredit New Master Seller</h3>
                    <button onClick={() => setIsAddSellerModalOpen(false)} className="text-slate-400 font-bold">✕</button>
                  </div>
                  <form onSubmit={handleCreateSeller} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1">Artist / Seller Name</label>
                      <input
                        type="text"
                        required
                        value={newSellerForm.name}
                        onChange={e => setNewSellerForm({ ...newSellerForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Payout Account Name</label>
                      <input
                        type="text"
                        required
                        value={newSellerForm.payout_account_name}
                        onChange={e => setNewSellerForm({ ...newSellerForm, payout_account_name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Country</label>
                        <input
                          type="text"
                          value={newSellerForm.country}
                          onChange={e => setNewSellerForm({ ...newSellerForm, country: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">City</label>
                        <input
                          type="text"
                          value={newSellerForm.city}
                          onChange={e => setNewSellerForm({ ...newSellerForm, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 mb-1">Payout Bank Name</label>
                        <input
                          type="text"
                          value={newSellerForm.payout_bank}
                          onChange={e => setNewSellerForm({ ...newSellerForm, payout_bank: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1">Bank Account Number</label>
                        <input
                          type="text"
                          value={newSellerForm.payout_account}
                          onChange={e => setNewSellerForm({ ...newSellerForm, payout_account: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button type="button" onClick={() => setIsAddSellerModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
                      <button type="submit" className="px-5 py-2 bg-art-gold text-art-black font-bold uppercase rounded-xl">Register Seller</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 10. SETTINGS TAB PANEL */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm animate-fade-in text-xs">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-art-gold" />
                <span>WEMA Bank Corporate Gateway & Settlement Parameters</span>
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Configure corporate settlement accounts, AlatPay Merchant credentials, and payment routing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Corporate Bank Name</label>
                <input
                  type="text"
                  value={paymentSettings.wemaBankName}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, wemaBankName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Corporate Settlement Account Name</label>
                <input
                  type="text"
                  value={paymentSettings.wemaAccountName}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, wemaAccountName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">WEMA Corporate Account Number</label>
                <input
                  type="text"
                  value={paymentSettings.wemaAccountNumber}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, wemaAccountNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">WEMA Sort Code / Routing</label>
                <input
                  type="text"
                  value={paymentSettings.wemaSortCode}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, wemaSortCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">AlatPay Merchant ID (by Wema)</label>
                <input
                  type="text"
                  value={paymentSettings.alatpayMerchantId}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, alatpayMerchantId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">WEMA Bank Webhook Secret / API Key</label>
                <input
                  type="password"
                  value={paymentSettings.wemaApiKey}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, wemaApiKey: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Paystack Fallback Public Key</label>
                <input
                  type="text"
                  value={paymentSettings.paystackPublicKey}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, paystackPublicKey: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Flutterwave Fallback Public Key</label>
                <input
                  type="text"
                  value={paymentSettings.flutterwavePublicKey}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, flutterwavePublicKey: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-slate-800"
                />
              </div>
            </div>

            <button
              onClick={() => alert('WEMA Bank corporate payment gateway parameters updated successfully!')}
              className="px-6 py-2.5 bg-art-gold text-art-black font-bold uppercase rounded-xl shadow-gold-glow transition hover:brightness-110"
            >
              Save WEMA Banking Settings
            </button>
          </div>
        )}

        {/* 11. SYSTEM STATUS & INFRASTRUCTURE HEALTH TAB */}
        {activeTab === 'system_status' && (
          <AdminSystemStatus currentUser={currentUser} />
        )}

        {/* ========================================================================= */}
        {/* PAGE MANAGEMENT MODAL DIALOGS */}
        {/* ========================================================================= */}

        {/* 1. Header Navigation Link Modal */}
        {isAddNavModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {editingNavLink ? 'Edit Navigation Link' : 'Add Header Navigation Link'}
                </h3>
                <button onClick={() => setIsAddNavModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingNavLink) {
                    updateHeaderNavLink(editingNavLink.id, navLinkForm);
                  } else {
                    addHeaderNavLink(navLinkForm);
                  }
                  setIsAddNavModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Link Label / Display Name</label>
                  <input
                    type="text"
                    required
                    value={navLinkForm.label}
                    onChange={(e) => setNavLinkForm({ ...navLinkForm, label: e.target.value })}
                    placeholder="e.g. Virtual Exhibitions"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Target Route / URL</label>
                  <input
                    type="text"
                    required
                    value={navLinkForm.href}
                    onChange={(e) => setNavLinkForm({ ...navLinkForm, href: e.target.value })}
                    placeholder="e.g. /exhibitions"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Highlight Badge Accent</label>
                  <select
                    value={navLinkForm.highlight || 'none'}
                    onChange={(e) => setNavLinkForm({ ...navLinkForm, highlight: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 cursor-pointer"
                  >
                    <option value="none">Normal (Slate)</option>
                    <option value="gold">Gold Crest (Heritage highlight)</option>
                    <option value="red">Red Glow (Live Auctions pulse)</option>
                    <option value="emerald">Emerald (Subscriptions / Exhibitions)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Icon Indicator (Optional)</label>
                  <select
                    value={navLinkForm.icon || ''}
                    onChange={(e) => setNavLinkForm({ ...navLinkForm, icon: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 cursor-pointer"
                  >
                    <option value="">None</option>
                    <option value="Flame">Flame (Fire / Live Auctions)</option>
                    <option value="Sparkles">Sparkles (Gold Star)</option>
                    <option value="Crown">Crown (Royalty / Artists)</option>
                    <option value="Shield">Shield (Authenticity)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddNavModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl"
                  >
                    {editingNavLink ? 'Save Changes' : 'Add Navigation Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. Hero "Choose from Artwork Gallery" Catalog Picker Modal */}
        {isGalleryPickerOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 text-xs animate-scale-in flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-art-gold" />
                    <span>Select Artwork from Catalog Gallery for Hero Spotlight</span>
                  </h3>
                  <p className="text-slate-500">
                    Click "Apply to Hero" on any artwork to automatically set hero image, medium, pricing, and artist details.
                  </p>
                </div>
                <button
                  onClick={() => setIsGalleryPickerOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-slate-100 bg-white">
                <input
                  type="text"
                  placeholder="Search catalog by title, artist name, country, or medium..."
                  value={gallerySearchTerm}
                  onChange={(e) => setGallerySearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-art-gold"
                />
              </div>

              {/* Gallery Grid */}
              <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-slate-50/50">
                {artworks
                  .filter(a => 
                    !gallerySearchTerm ||
                    a.title?.toLowerCase().includes(gallerySearchTerm.toLowerCase()) ||
                    a.artistName?.toLowerCase().includes(gallerySearchTerm.toLowerCase()) ||
                    a.country?.toLowerCase().includes(gallerySearchTerm.toLowerCase()) ||
                    a.medium?.toLowerCase().includes(gallerySearchTerm.toLowerCase())
                  )
                  .map((art) => (
                    <div
                      key={art.id}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                    >
                      <div className="relative aspect-[4/3] bg-black overflow-hidden">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-art-gold text-[9px] font-bold border border-art-gold/30">
                          {art.category}
                        </span>
                      </div>

                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 text-sm line-clamp-1">{art.title}</h4>
                          <p className="text-slate-500 text-[11px]">By {art.artistName} ({art.country || 'Africa'})</p>
                          <p className="text-slate-400 text-[10px] truncate mt-0.5">{art.medium}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="font-mono font-bold text-amber-800 text-xs">{formatPrice(art.price)}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setHeroMediaFromGallery(art.id);
                              setIsGalleryPickerOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider text-[10px] shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Apply to Hero</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsGalleryPickerOpen(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Close Catalog Picker
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 3. Homepage Section Edit Modal */}
        {editingHomeSection && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Edit Section: <span className="capitalize text-amber-700">{editingHomeSection.type?.replace('_', ' ')}</span>
                </h3>
                <button onClick={() => setEditingHomeSection(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateHomeSection(editingHomeSection.id, editHomeSectionForm);
                  setEditingHomeSection(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Display Title</label>
                  <input
                    type="text"
                    value={editHomeSectionForm.title || ''}
                    onChange={(e) => setEditHomeSectionForm({ ...editHomeSectionForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Subtitle / Explanation</label>
                  <textarea
                    rows={2}
                    value={editHomeSectionForm.subtitle || ''}
                    onChange={(e) => setEditHomeSectionForm({ ...editHomeSectionForm, subtitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Badge Tag (Uppercase)</label>
                  <input
                    type="text"
                    value={editHomeSectionForm.badge || ''}
                    onChange={(e) => setEditHomeSectionForm({ ...editHomeSectionForm, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Max Items Displayed</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={editHomeSectionForm.maxItems || 6}
                    onChange={(e) => setEditHomeSectionForm({ ...editHomeSectionForm, maxItems: parseInt(e.target.value) || 6 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingHomeSection(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl"
                  >
                    Save Section Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. Custom Promo Banner Modal */}
        {isAddBannerModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {editingBanner ? 'Edit Promotional Banner' : 'Add Custom Promotional Banner'}
                </h3>
                <button onClick={() => setIsAddBannerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingBanner) {
                    updatePromoBanner(editingBanner.id, bannerForm);
                  } else {
                    addPromoBanner(bannerForm);
                  }
                  setIsAddBannerModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Badge / Ribbon Tag</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.tag}
                    onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                    placeholder="e.g. VIP AUCTION PREVIEW"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Banner Headline</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="e.g. 2026 Pan-African Masters Collection"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-serif font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Banner Subtitle / Description</label>
                  <textarea
                    rows={2}
                    required
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    placeholder="e.g. Curated fine art selections from over 30 African nations."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Button Text</label>
                    <input
                      type="text"
                      value={bannerForm.buttonText}
                      onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                      placeholder="e.g. Explore Now"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Button Link</label>
                    <input
                      type="text"
                      value={bannerForm.buttonLink}
                      onChange={(e) => setBannerForm({ ...bannerForm, buttonLink: e.target.value })}
                      placeholder="e.g. /explore"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Background Styling Theme</label>
                  <select
                    value={bannerForm.bgGradient}
                    onChange={(e) => setBannerForm({ ...bannerForm, bgGradient: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 cursor-pointer"
                  >
                    <option value="from-amber-950 via-slate-900 to-black">Gold & Onyx (from-amber-950 via-slate-900 to-black)</option>
                    <option value="from-emerald-950 via-slate-900 to-black">African Emerald (from-emerald-950 via-slate-900 to-black)</option>
                    <option value="from-red-950 via-slate-900 to-black">Crimson Heritage (from-red-950 via-slate-900 to-black)</option>
                    <option value="from-indigo-950 via-slate-900 to-black">Royal Indigo (from-indigo-950 via-slate-900 to-black)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddBannerModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl"
                  >
                    {editingBanner ? 'Save Changes' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. Trust Guarantee Badge Modal */}
        {isAddBadgeModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {editingBadge ? 'Edit Trust Guarantee Badge' : 'Add Trust Guarantee Badge'}
                </h3>
                <button onClick={() => setIsAddBadgeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingBadge) {
                    updateTrustBadge(editingBadge.id, badgeForm);
                  } else {
                    addTrustBadge(badgeForm);
                  }
                  setIsAddBadgeModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Badge Title</label>
                  <input
                    type="text"
                    required
                    value={badgeForm.title}
                    onChange={(e) => setBadgeForm({ ...badgeForm, title: e.target.value })}
                    placeholder="e.g. Authenticity Guarantee"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={badgeForm.description}
                    onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                    placeholder="e.g. Physical certificate signed by artist & curator."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Icon</label>
                    <select
                      value={badgeForm.icon}
                      onChange={(e) => setBadgeForm({ ...badgeForm, icon: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 cursor-pointer"
                    >
                      <option value="Award">Award</option>
                      <option value="Truck">Truck (Freight)</option>
                      <option value="Lock">Lock (Fiduciary Custody)</option>
                      <option value="Shield">Shield (Security)</option>
                      <option value="Heart">Heart (Support)</option>
                      <option value="Sparkles">Sparkles</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Color Accent</label>
                    <select
                      value={badgeForm.color}
                      onChange={(e) => setBadgeForm({ ...badgeForm, color: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 cursor-pointer"
                    >
                      <option value="gold">Gold</option>
                      <option value="emerald">Emerald</option>
                      <option value="red">Red</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddBadgeModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl"
                  >
                    {editingBadge ? 'Save Changes' : 'Add Trust Badge'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 6. Footer Column Modal */}
        {isAddColModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {editingCol ? 'Edit Footer Column' : 'Add Footer Column'}
                </h3>
                <button onClick={() => setIsAddColModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingCol) {
                    updateFooterColumn(editingCol.id, colForm.title);
                  } else {
                    addFooterColumn(colForm.title);
                  }
                  setIsAddColModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Column Heading Title</label>
                  <input
                    type="text"
                    required
                    value={colForm.title}
                    onChange={(e) => setColForm({ ...colForm, title: e.target.value })}
                    placeholder="e.g. Curators & Museums"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddColModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl"
                  >
                    {editingCol ? 'Save Changes' : 'Add Column'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 7. Footer Column Link Modal */}
        {isAddFooterLinkModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {editingFooterLink ? 'Edit Footer Link' : 'Add Footer Link'}
                </h3>
                <button onClick={() => setIsAddFooterLinkModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingFooterLink) {
                    updateFooterLink(activeColIdForLink, editingFooterLink.id, footerLinkForm);
                  } else {
                    addFooterLink(activeColIdForLink, footerLinkForm);
                  }
                  setIsAddFooterLinkModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Link Text Label</label>
                  <input
                    type="text"
                    required
                    value={footerLinkForm.label}
                    onChange={(e) => setFooterLinkForm({ ...footerLinkForm, label: e.target.value })}
                    placeholder="e.g. Terms of Fiduciary Custody"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Route URL / Link Href</label>
                  <input
                    type="text"
                    required
                    value={footerLinkForm.href}
                    onChange={(e) => setFooterLinkForm({ ...footerLinkForm, href: e.target.value })}
                    placeholder="e.g. /terms or #"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Highlight Accent</label>
                  <select
                    value={footerLinkForm.highlight || 'none'}
                    onChange={(e) => setFooterLinkForm({ ...footerLinkForm, highlight: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 cursor-pointer"
                  >
                    <option value="none">Standard Link</option>
                    <option value="red">Red (Live Auctions)</option>
                    <option value="emerald">Emerald (Virtual Rooms)</option>
                    <option value="amber">Amber / Gold (Admin / Subscriptions)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddFooterLinkModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl"
                  >
                    {editingFooterLink ? 'Save Changes' : 'Add Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 8. Social Media Channel Modal */}
        {isAddSocialModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {editingSocial ? 'Edit Social Channel' : 'Add Social Media Channel'}
                </h3>
                <button onClick={() => setIsAddSocialModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingSocial) {
                    updateSocialLink(editingSocial.id, socialForm);
                  } else {
                    addSocialLink(socialForm);
                  }
                  setIsAddSocialModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Platform Name</label>
                  <input
                    type="text"
                    required
                    value={socialForm.platform}
                    onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                    placeholder="e.g. Instagram, Twitter/X, LinkedIn"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Profile URL</label>
                  <input
                    type="url"
                    required
                    value={socialForm.url}
                    onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddSocialModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl"
                  >
                    {editingSocial ? 'Save Changes' : 'Add Channel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

