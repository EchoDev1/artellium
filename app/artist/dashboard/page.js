'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { 
  PlusCircle, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  Package, 
  Flame, 
  Trash2, 
  Palette, 
  DollarSign,
  TrendingUp,
  Clock,
  ExternalLink,
  Award,
  PenTool,
  Truck,
  HelpCircle,
  ChevronRight,
  MessageCircle,
  Send,
  BookOpen,
  MapPin,
  Globe,
  Edit,
  Check,
  X,
  Percent,
  ShoppingBag,
  Building,
  CreditCard,
  RotateCcw,
  Navigation,
  FileCheck,
  Camera,
  User,
  Eye,
  Leaf,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import ProfilePhotoStudioModal from '@/components/ProfilePhotoStudioModal';
import ArtistLiveAuctionConsole from '@/components/ArtistLiveAuctionConsole';
import ArtistPanAfricanSuite from '@/components/ArtistPanAfricanSuite';

export default function ArtistDashboardPage() {
  const { 
    currentUser, 
    updateUser,
    artworks = [], 
    addArtwork, 
    updateArtwork, 
    deleteArtwork, 
    updateArtistStudioNotes, 
    currency, 
    orders = [], 
    updateOrderLogistics, 
    commissions = [], 
    sellers = [], 
    updateSeller, 
    artistSignatures = {}, 
    saveArtistSignature, 
    artworkQuestions = [], 
    answerQuestion, 
    deleteQuestion, 
    editQuestionAnswer, 
    collectorOffers = [], 
    updateCollectorOfferStatus,
    priorityBannerPricing,
    priorityBannerPlacements = [],
    requestPriorityBannerPlacement,
    artistPayoutPercentage = 85
  } = useStore();

  const [successMsg, setSuccessMsg] = useState('');
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState(false);
  const [photoSavedNotice, setPhotoSavedNotice] = useState(false);
  const router = useRouter();

  // Priority Banner State
  const [selectedArtForBanner, setSelectedArtForBanner] = useState('');
  const [selectedPlanForBanner, setSelectedPlanForBanner] = useState('monthly');
  const [bannerSubmitMsg, setBannerSubmitMsg] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.role === 'buyer') {
      router.push('/buyer/account');
    } else if (currentUser && currentUser.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [currentUser, router]);

  // Artwork Edit Modal State
  const [editingArt, setEditingArt] = useState(null);
  const [editArtForm, setEditArtForm] = useState({});

  // Self-Service Artwork Upload Form state
  const [artForm, setArtForm] = useState({
    title: '',
    category: 'Painters',
    medium: '',
    dimensions: '',
    price: '',
    provenance: '',
    description: '',
    image: '',
    status: 'available',
    country: 'Nigeria',
    city: 'Lagos',
    countryFlag: '🇳🇬',
    shipsTo: ['Africa', 'Europe', 'North America'],
    studioNotes: ''
  });

  // Global Studio Notes quick editor
  const [globalStudioNotes, setGlobalStudioNotes] = useState('');
  const [notesSaveMsg, setNotesSaveMsg] = useState(false);

  // Digital Signature State & Drawing Canvas
  const myArtistName = currentUser?.name ? currentUser.name.split(' (')[0] : '';
  const mySignatureData = (currentUser?.name && artistSignatures[currentUser.name]) || { style: 'Heritage Calligraphy', signed: false, drawn: null };
  const [sigMode, setSigMode] = useState('draw'); // 'draw' or 'font'
  const [sigStyle, setSigStyle] = useState(mySignatureData.style || 'Heritage Calligraphy');
  const [drawnSigUrl, setDrawnSigUrl] = useState(mySignatureData.drawn || null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [sigSaveMsg, setSigSaveMsg] = useState(false);
  const canvasRef = useRef(null);

  // Navigation Tab State: 'studio_operations', 'artist_profile', 'live_auctions', 'pan_african', 'exhibitions_sdgs'
  const [activeArtistTab, setActiveArtistTab] = useState('studio_operations');

  // Payout Bank Settings state (Account Name, Bank Name, Account Number)
  const mySellerProfile = sellers.find(s => (myArtistName && s.name?.toLowerCase().includes(myArtistName.toLowerCase())) || (currentUser?.id && s.user_id === currentUser.id)) || {
    payout_account_name: myArtistName ? `${myArtistName} Studio` : '',
    payout_bank: '',
    payout_account: '',
    artistTitle: 'Master Visual Artist',
    bio: '',
    country: currentUser?.country || 'Nigeria',
    city: '',
    country_flag: '🌍',
    guildLineage: ''
  };
  
  const [bankForm, setBankForm] = useState({
    payout_account_name: mySellerProfile.payout_account_name || (myArtistName ? `${myArtistName} Studio` : ''),
    payout_bank: mySellerProfile.payout_bank || '',
    payout_account: mySellerProfile.payout_account || ''
  });
  const [bankSaveMsg, setBankSaveMsg] = useState(false);

  // Dedicated Master Artist Profile Form State
  const [artistProfileForm, setArtistProfileForm] = useState({
    name: myArtistName || '',
    artistTitle: mySellerProfile?.artistTitle || 'Contemporary Master Visual Artist',
    bio: mySellerProfile?.bio || '',
    country: mySellerProfile?.country || currentUser?.country || 'Nigeria',
    city: mySellerProfile?.city || '',
    countryFlag: mySellerProfile?.country_flag || '🌍',
    guildLineage: mySellerProfile?.guildLineage || '',
    primaryMediums: 'Oil, Acrylic & Mixed Media on Canvas',
    exhibitionsHistory: '',
    studioAddress: '',
    instagram: '',
    website: '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    experienceYears: ''
  });
  const [artistProfileSaveMsg, setArtistProfileSaveMsg] = useState(false);

  const handleSaveArtistProfile = (e) => {
    e.preventDefault();
    if (currentUser?.id) {
      updateUser(currentUser.id, {
        name: artistProfileForm.name,
        email: artistProfileForm.email,
        phone: artistProfileForm.phone,
        country: artistProfileForm.country
      });
    }
    if (mySellerProfile?.id) {
      updateSeller(mySellerProfile.id, {
        name: artistProfileForm.name,
        bio: artistProfileForm.bio,
        country: artistProfileForm.country,
        city: artistProfileForm.city,
        country_flag: artistProfileForm.countryFlag,
        guildLineage: artistProfileForm.guildLineage,
        artistTitle: artistProfileForm.artistTitle
      });
    }
    setArtistProfileSaveMsg(true);
    setTimeout(() => setArtistProfileSaveMsg(false), 4000);
  };

  // Logistics Dispatch Editor Modal State
  const [editingLogisticsOrder, setEditingLogisticsOrder] = useState(null);
  const [logisticsForm, setLogisticsForm] = useState({
    carrier: 'DHL Global Fine Art Express',
    trackingNumber: '',
    estimatedDelivery: '3-5 Business Days',
    step: 2,
    currentLocation: '',
    notes: ''
  });

  // Q&A reply & edit state mapping
  const [replyMap, setReplyMap] = useState({});
  const [editingQId, setEditingQId] = useState(null);
  const [editQAnswerText, setEditQAnswerText] = useState('');

  // Canvas Drawing Handlers
  useEffect(() => {
    if (sigMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1e293b'; // dark slate ink
      
      if (drawnSigUrl) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = drawnSigUrl;
      }
    }
  }, [sigMode]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      setDrawnSigUrl(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawnSigUrl(null);
  };

  const handleSaveSignature = (e) => {
    e.preventDefault();
    if (sigMode === 'draw' && drawnSigUrl) {
      saveArtistSignature(currentUser.name, { drawn: drawnSigUrl, style: 'Drawn Custom Signature' });
    } else {
      saveArtistSignature(currentUser.name, { drawn: null, style: sigStyle });
    }
    setSigSaveMsg(true);
    setTimeout(() => setSigSaveMsg(false), 3500);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-xs font-sans">
        <div className="text-center space-y-3">
          <p>Please sign in to view your artist dashboard.</p>
        </div>
      </div>
    );
  }

  // Filter artworks by this specific artist
  const myArtworks = artworks.filter((a) => {
    return a.artistName?.toLowerCase().includes(myArtistName.toLowerCase()) || a.artistId === currentUser?.id;
  });

  // Commissions and earnings for this artist (85% net payout)
  const myCommissions = commissions.filter(c => 
    (myArtistName && c.seller_name?.toLowerCase().includes(myArtistName.toLowerCase())) || 
    (currentUser?.id && c.seller_id === currentUser.id)
  );

  const totalEarned = myCommissions.reduce((sum, c) => sum + (c.seller_net_payout || 0), 0);
  const pendingSettlement = myCommissions.filter(c => c.payout_status !== 'disbursed').reduce((sum, c) => sum + (c.seller_net_payout || 0), 0);
  const disbursedPayouts = myCommissions.filter(c => c.payout_status === 'disbursed').reduce((sum, c) => sum + (c.seller_net_payout || 0), 0);

  // Orders containing this artist's artworks
  const myOrders = orders.filter(o => 
    o.items?.some(i => (myArtistName && i.artistName?.toLowerCase().includes(myArtistName.toLowerCase())) || (currentUser?.id && i.artistId === currentUser.id))
  );

  // Questions relating to this artist's artworks
  const myQuestions = (artworkQuestions || []).filter(q => myArtworks.some(a => a.id === q.artworkId));

  // Private offers relating to this artist's artworks
  const myIncomingOffers = (collectorOffers || []).filter(o => myArtworks.some(a => a.id === o.artworkId));

  // Priority banner placements for this artist
  const myArtistBannerPlacements = (priorityBannerPlacements || []).filter(p => 
    (myArtistName && p.artistName?.toLowerCase().includes(myArtistName.toLowerCase())) || (currentUser?.id && p.artistId === currentUser.id)
  );

  const handleBannerSubmit = (e) => {
    e.preventDefault();
    const art = artworks.find(a => a.id === selectedArtForBanner) || myArtworks[0];
    if (!art) return;
    
    const priceMap = {
      boost_7d: priorityBannerPricing?.boost7d || 15000,
      monthly: priorityBannerPricing?.monthly || 50000,
      annual: priorityBannerPricing?.annual || 350000
    };

    requestPriorityBannerPlacement({
      artworkId: art.id,
      title: art.title,
      artistName: art.artistName || myArtistName,
      artistId: art.artistId || currentUser?.id || 'artist-1',
      country: art.country || currentUser?.country || 'Nigeria',
      countryFlag: art.countryFlag || '🇳🇬',
      medium: art.medium || 'Fine Art',
      dimensions: art.dimensions || '',
      price: art.price,
      priceUSD: art.priceUSD,
      image: art.image,
      plan: selectedPlanForBanner,
      pricePaid: priceMap[selectedPlanForBanner]
    });

    setBannerSubmitMsg(`"${art.title}" has been placed in the Homepage Spotlight Banner!`);
    setTimeout(() => setBannerSubmitMsg(''), 4000);
  };

  const handleArtworkSubmit = (e) => {
    e.preventDefault();
    if (!artForm.title || !artForm.price || !artForm.image) return;

    const created = addArtwork({
      ...artForm,
      price: parseFloat(artForm.price),
      artistName: currentUser?.name || myArtistName || 'Master Artist',
      artistId: currentUser?.id || `artist-${Date.now()}`,
      artistType: currentUser?.subscriptionTier === 'premium' ? 'Premium' : 'Standard',
      artistAvatar: currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      verificationBadge: currentUser?.subscriptionTier === 'premium' ? 'gold' : 'verified'
    });

    setSuccessMsg(`Artwork "${created.title}" published! Available in catalogue.`);

    setArtForm({
      title: '',
      category: 'Painters',
      medium: '',
      dimensions: '',
      price: '',
      provenance: '',
      description: '',
      image: '',
      status: 'available',
      country: 'Nigeria',
      city: 'Lagos',
      countryFlag: '🇳🇬',
      shipsTo: ['Africa', 'Europe', 'North America'],
      studioNotes: ''
    });

    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const handleSaveEditArt = (e) => {
    e.preventDefault();
    if (!editingArt) return;
    updateArtwork(editingArt.id, {
      ...editArtForm,
      price: parseFloat(editArtForm.price)
    });
    setEditingArt(null);
    alert(`Artwork "${editArtForm.title}" updated successfully!`);
  };

  const handleSaveGlobalNotes = (e) => {
    e.preventDefault();
    if (!globalStudioNotes.trim()) return;
    updateArtistStudioNotes(myArtistName, globalStudioNotes);
    setNotesSaveMsg(true);
    setTimeout(() => setNotesSaveMsg(false), 3500);
  };

  const handleSaveBankDetails = (e) => {
    e.preventDefault();
    if (mySellerProfile?.id) {
      updateSeller(mySellerProfile.id, bankForm);
    }
    setBankSaveMsg(true);
    setTimeout(() => setBankSaveMsg(false), 3500);
  };

  const handleSaveLogistics = (e) => {
    e.preventDefault();
    if (!editingLogisticsOrder) return;
    updateOrderLogistics(editingLogisticsOrder.id, logisticsForm);
    setEditingLogisticsOrder(null);
    alert(`Courier tracking update transmitted to collector for Order ${editingLogisticsOrder.id}!`);
  };

  const handleSendReply = (qId) => {
    const text = replyMap[qId];
    if (!text || !text.trim()) return;
    answerQuestion(qId, text, myArtistName);
    setReplyMap(prev => ({ ...prev, [qId]: '' }));
    alert('Your response has been published to the public artwork page!');
  };

  const handleSaveArtistPhoto = (croppedPhoto) => {
    if (!currentUser) return;
    updateUser(currentUser.id, { avatar_url: croppedPhoto });
    const seller = sellers.find(s => s.user_id === currentUser.id || s.name === myArtistName);
    if (seller?.id) {
      updateSeller(seller.id, { avatar_url: croppedPhoto });
    }
    setPhotoSavedNotice(true);
    setTimeout(() => setPhotoSavedNotice(false), 4000);
  };

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount?.toLocaleString() || '0'}`;
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen pb-16 font-sans">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header Block */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-art-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/10 border border-art-gold/30 text-amber-800 text-[10px] font-bold uppercase tracking-widest">
                <Palette className="w-3.5 h-3.5" />
                <span>Verified Master Artist Studio</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Artist Studio & Operations
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-sans">
                Welcome back, <strong className="text-slate-900 font-semibold">{myArtistName}</strong>. Manage your artwork catalogue, track direct WEMA Bank corporate settlements, draw your Digital Certificate signature, and configure your {artistPayoutPercentage}% payout account.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-right shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Accreditation Tier:</span>
              <span className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1 justify-end mt-0.5">
                <Award className="w-3.5 h-3.5" />
                <span>{currentUser.subscriptionTier || 'Premium'} Gold Tier ({artistPayoutPercentage}% Net Split)</span>
              </span>
            </div>
          </div>
        </div>

        {/* ARTIST DASHBOARD CORE NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'studio_operations', label: `Studio & Catalogue (${myArtworks.length})`, icon: Palette },
            { id: 'artist_profile', label: 'Master Artist Profile & Atelier', icon: User, badge: '👑 VERIFIED' },
            { id: 'live_auctions', label: 'Live Auction Floor', icon: Flame },
            { id: 'pan_african', label: 'Pan-African Atelier Suite', icon: Globe },
            { id: 'exhibitions_sdgs', label: 'Exhibitions & SDGs Forums', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeArtistTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveArtistTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-art-gold' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-art-gold/20 text-art-gold font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 2: MASTER ARTIST PROFILE & ATELIER IDENTITY (PROFESSIONAL SUITE)     */}
        {/* ========================================================================= */}
        {activeArtistTab === 'artist_profile' && (
          <div className="space-y-8 animate-fade-in">
            {/* Atelier Identity & Verified Master Artist Hero */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white border border-amber-500/30 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-art-gold p-0.5 bg-slate-800 shadow-gold-glow">
                      {currentUser?.avatar_url || mySellerProfile?.avatar_url ? (
                        <img
                          src={currentUser.avatar_url || mySellerProfile?.avatar_url}
                          alt={artistProfileForm.name}
                          className="w-full h-full object-cover rounded-[14px]"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 rounded-[14px] flex items-center justify-center font-serif text-3xl font-bold text-art-gold">
                          {artistProfileForm.name ? artistProfileForm.name.charAt(0) : 'A'}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsPhotoStudioOpen(true)}
                      className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-art-gold text-art-black flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
                      title="Update & Crop Upper-Body Portrait"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                        {artistProfileForm.name}
                      </h2>
                      <span className="text-base">{artistProfileForm.countryFlag}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                        ✓ Upper-Body Portrait Verified
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-art-gold/20 text-art-gold text-[10px] font-mono font-bold border border-art-gold/30">
                        👑 Sovereign Gold Master
                      </span>
                    </div>

                    <p className="text-amber-200/90 text-sm font-serif italic">
                      {artistProfileForm.artistTitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-art-gold" />
                        <span>Atelier: {artistProfileForm.city}, {artistProfileForm.country}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Award className="w-3.5 h-3.5 text-art-gold" />
                        <span>{artistProfileForm.guildLineage}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
                  <button
                    onClick={() => setIsPhotoStudioOpen(true)}
                    className="px-4 py-2.5 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider text-xs rounded-xl transition shadow-gold-glow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload / Crop Portrait Photo</span>
                  </button>

                  <Link
                    href={`/explore?q=${encodeURIComponent(artistProfileForm.name)}`}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition border border-white/20 flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Preview Public Catalog</span>
                  </Link>
                </div>
              </div>

              {photoSavedNotice && (
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Upper-body master portrait successfully updated and cropped for collector verification!</span>
                </div>
              )}

              {/* Master Credential Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs font-mono">
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase block">Practice Seniority</span>
                  <span className="text-white font-bold">{artistProfileForm.experienceYears}</span>
                </div>
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase block">Catalogue Masterworks</span>
                  <span className="text-art-gold font-bold">{myArtworks.length} Documented Works</span>
                </div>
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase block">Provenance Dossiers</span>
                  <span className="text-emerald-400 font-bold">100% WEMA Blockchain Valid</span>
                </div>
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                  <span className="text-slate-400 text-[10px] uppercase block">Settlement Clearance</span>
                  <span className="text-white font-bold">Tier 1 Sovereign Direct</span>
                </div>
              </div>
            </div>

            {/* Profile & Atelier Editor Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-art-gold" />
                    <span>Master Artist Atelier Dossier & Curatorial Biography</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    This dossier is presented to institutional buyers, museum curators, and international auction houses across Artellium Africa.
                  </p>
                </div>

                {artistProfileSaveMsg && (
                  <span className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fade-in">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Artist Profile Saved & Published!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveArtistProfile} className="space-y-6 text-xs text-slate-700">
                {/* 1. Basic Atelier Identity */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-100 pb-2">
                    1. Professional Identity & Atelier Specialty
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Full Artist Professional Moniker</label>
                      <input
                        type="text"
                        required
                        value={artistProfileForm.name}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-bold focus:border-art-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Master Specialty / Curatorial Title</label>
                      <input
                        type="text"
                        required
                        value={artistProfileForm.artistTitle}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, artistTitle: e.target.value })}
                        placeholder="e.g. Master Painter & 24k Gold Leaf Specialist"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Master Guild & Traditional Lineage</label>
                      <input
                        type="text"
                        value={artistProfileForm.guildLineage}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, guildLineage: e.target.value })}
                        placeholder="e.g. Royal Akan Guild of Master Craftsmen"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Atelier Geographic Location */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-100 pb-2">
                    2. Atelier Location & Geographic Heritage
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Country of Practice</label>
                      <input
                        type="text"
                        required
                        value={artistProfileForm.country}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, country: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Atelier City / Region</label>
                      <input
                        type="text"
                        required
                        value={artistProfileForm.city}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Country Flag Emoji</label>
                      <input
                        type="text"
                        value={artistProfileForm.countryFlag}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, countryFlag: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-center font-bold text-base focus:border-art-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Materials & Creative Philosophy */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-100 pb-2">
                    3. Mediums, Atelier Techniques & Curatorial Bio
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold mb-1">Primary Materials, Mediums & Sacred Techniques</label>
                      <input
                        type="text"
                        value={artistProfileForm.primaryMediums}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, primaryMediums: e.target.value })}
                        placeholder="e.g. Oil, Acrylic & 24K Gold Leaf on Linen Canvas, Natural Ochre Pigments"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Comprehensive Artist Statement & Biography</label>
                      <textarea
                        rows="4"
                        required
                        value={artistProfileForm.bio}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, bio: e.target.value })}
                        placeholder="Detail your artistic philosophy, studio rituals, sacred iconography, and cultural narrative..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 leading-relaxed focus:border-art-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Selected Biennales, Museum Exhibitions & Honours</label>
                      <input
                        type="text"
                        value={artistProfileForm.exhibitionsHistory}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, exhibitionsHistory: e.target.value })}
                        placeholder="e.g. Venice Biennale African Pavilion, Dakar Biennale (Dak'Art), Lagos National Museum"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Atelier Studio Physical & Digital Coordinates */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-100 pb-2">
                    4. Atelier Studio Physical & Digital Coordinates
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Official Studio Email</label>
                      <input
                        type="email"
                        required
                        value={artistProfileForm.email}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Direct Atelier Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={artistProfileForm.phone}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-mono focus:border-art-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Instagram Atelier Handle</label>
                      <input
                        type="text"
                        value={artistProfileForm.instagram}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, instagram: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Official Website / Catalogue URL</label>
                      <input
                        type="url"
                        value={artistProfileForm.website}
                        onChange={e => setArtistProfileForm({ ...artistProfileForm, website: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-art-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit & Save */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Publish Master Artist Profile</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: LIVE AUCTION OPERATIONS & BIDDING FOLLOW-UP CONSOLE                */}
        {/* ========================================================================= */}
        {activeArtistTab === 'live_auctions' && (
          <ArtistLiveAuctionConsole artistName={myArtistName} />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: MASTER ARTIST PAN-AFRICAN STUDIO & PROVENANCE HUB                  */}
        {/* ========================================================================= */}
        {activeArtistTab === 'pan_african' && (
          <ArtistPanAfricanSuite artistName={myArtistName} />
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ART EXHIBITIONS & SDGS SUSTAINABILITY SHOWCASE HUB                 */}
        {/* ========================================================================= */}
        {activeArtistTab === 'exhibitions_sdgs' && (
          <div className="p-6 bg-gradient-to-r from-emerald-950 via-[#0C1A14] to-slate-900 text-white rounded-3xl border border-emerald-500/40 shadow-md space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                    CURATORIAL OPPORTUNITIES
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Art Exhibitions & SDGs Sustainability Forums
                  </h3>
                </div>
              </div>

              <Link
                href="/exhibitions"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>Inspect All Exhibitions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              We curate exhibitions that showcase artistic excellence while connecting creators with wider audiences through various SDGs discussions for a sustainable living.
            </p>

            {/* 4 Exhibition Categories Open Calls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                {
                  format: 'Physical exhibitions',
                  location: 'Lagos National Museum Pavilion',
                  sdg: 'SDG 11: Heritage Preservation',
                  badge: 'Open Call',
                  action: 'Nominate for Physical Show'
                },
                {
                  format: 'Virtual exhibitions',
                  location: '3D Spatial WebGL Gallery',
                  sdg: 'SDG 9: Digital Innovation',
                  badge: 'Active Staging',
                  action: 'Pair with 3D Room'
                },
                {
                  format: 'Pop-up galleries',
                  location: 'Earth Pigments & Living Salon',
                  sdg: 'SDG 12: Responsible Materials',
                  badge: 'Upcoming',
                  action: 'RSVP Curator Talk'
                },
                {
                  format: 'International showcases',
                  location: 'Paris & London Diaspora Biennale',
                  sdg: 'SDG 8 & 17: Global Partnerships',
                  badge: 'Curator Call',
                  action: 'Apply for Diaspora Tour'
                },
              ].map((ex, i) => (
                <div key={i} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                        {ex.badge}
                      </span>
                      <Leaf className="w-3 h-3 text-emerald-400" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-white pt-1">{ex.format}</h4>
                    <p className="text-[11px] text-slate-400 font-sans">{ex.location}</p>
                    <p className="text-[10px] text-emerald-400 font-mono">{ex.sdg}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Nomination submitted for "${ex.format}"! Our Curatorial Board will review your catalog.`)}
                    className="w-full py-1.5 bg-white/10 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase rounded-lg transition cursor-pointer"
                  >
                    {ex.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: STUDIO CATALOGUE & OPERATIONS                                       */}
        {/* ========================================================================= */}
        {activeArtistTab === 'studio_operations' && (
          <div className="space-y-8 animate-fade-in">
            {/* Studio Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">My Net Sales ({artistPayoutPercentage}% Split)</span>
                <div className="space-y-0.5">
                  <p className="font-serif text-2xl font-bold text-emerald-600">{formatPrice(totalEarned)}</p>
                  <p className="text-[9px] text-slate-500 font-mono">{100 - artistPayoutPercentage}% platform commission deducted automatically</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Corporate Settlement Bank</span>
                <div className="space-y-0.5">
                  <p className="font-serif text-xl font-bold text-art-gold">Wema Bank PLC</p>
                  <p className="text-[9px] text-slate-500">Corporate Account: 0123456789</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Listed Masterpieces</span>
                <div className="space-y-0.5">
                  <p className="font-serif text-2xl font-bold text-slate-900">{myArtworks.length} Artworks</p>
                  <p className="text-[9px] text-slate-500">{myArtworks.filter(a => a.status === 'sold').length} Sold / {myArtworks.filter(a => a.status === 'available').length} Available</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-sm">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Orders & Inquiries</span>
                <div className="space-y-0.5">
                  <p className="font-serif text-2xl font-bold text-slate-900">{myOrders.length} Orders</p>
                  <p className="text-[9px] text-slate-500">{myQuestions.length} Q&As / {myIncomingOffers.length} Buyout Bids</p>
                </div>
              </div>
            </div>

            {/* Studio Journal Global Narrative Quick Editor */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-art-gold" />
                  <h3 className="font-serif text-base font-bold text-slate-900">Artist Studio Journal & Provenance Story</h3>
                </div>
                {notesSaveMsg && (
                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Updated across your artworks!</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                This narrative appears on your artwork pages under "Artist Studio Journal" to explain your creative process and ritual to collectors.
              </p>
              <form onSubmit={handleSaveGlobalNotes} className="space-y-3">
                <textarea
                  rows="2"
                  placeholder={myArtworks[0]?.studioNotes || "Describe your atelier rituals, natural pigment grinding, or ancestral inspirations..."}
                  value={globalStudioNotes}
                  onChange={(e) => setGlobalStudioNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-art-gold"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase rounded-xl transition"
                  >
                    Update Studio Story Globally
                  </button>
                </div>
              </form>
            </div>

            {/* Main Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Direct Settlements & Upload Form (7 Columns) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. DIRECT SETTLEMENTS & ORDER ACQUISITIONS */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-art-gold" />
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900">Direct Settlements & Order Acquisitions</h3>
                        <p className="text-[11px] text-slate-500">Confirmed collector acquisitions settled directly via WEMA Bank Corporate Account</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full">
                      {myOrders.length} Orders
                    </span>
                  </div>

              {myOrders.length === 0 ? (
                <p className="text-slate-400 text-xs italic text-center py-6">No acquisitions logged yet for your studio artworks.</p>
              ) : (
                <div className="space-y-4">
                  {myOrders.map(ord => {
                    const firstItem = ord.items?.[0];
                    return (
                      <div key={ord.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                          <div>
                            <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                            <p className="font-serif text-sm font-bold text-slate-900 mt-0.5">{firstItem?.title}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-700 font-mono font-bold">{formatPrice(ord.total_amount * 0.85)} Net Payout</span>
                            <span className="block text-[10px] text-slate-500 font-sans">
                              Collector: {ord.buyer_name} ({ord.buyer_email})
                            </span>
                          </div>
                        </div>

                        {/* Settlement Status Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono uppercase block">Settlement Gateway</span>
                            <p className="font-semibold text-slate-900 flex items-center gap-1">
                              <Building className="w-3.5 h-3.5 text-art-gold" />
                              <span>WEMA Bank PLC (0123456789)</span>
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-[10px] text-slate-400 font-mono uppercase block">Payout Status</span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{artistPayoutPercentage}% Net Disbursed</span>
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Publish New Creation Form */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <PlusCircle className="w-5 h-5 text-art-gold" />
                <h2 className="font-serif text-lg font-bold text-slate-900">Publish New Creation</h2>
              </div>

              {successMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleArtworkSubmit} className="space-y-4 text-xs text-slate-700">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Artwork Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Ancestral Mask of Oyo"
                    value={artForm.title}
                    onChange={(e) => setArtForm({ ...artForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:border-art-gold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Artwork Category</label>
                    <select
                      value={artForm.category}
                      onChange={(e) => setArtForm({ ...artForm, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:border-art-gold focus:outline-none cursor-pointer font-medium"
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

                    {/* Quick Category Select Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-2 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                      {[
                        { label: '🎨 Paintings', val: 'Paintings' },
                        { label: '🗿 Sculptures', val: 'Sculptures' },
                        { label: '✏️ Drawings', val: 'Drawings' },
                        { label: '📷 Photography', val: 'Photography' },
                        { label: '🧵 Textiles', val: 'Textiles' },
                        { label: '🏺 Pottery', val: 'Pottery' },
                        { label: '🍶 Ceramics', val: 'Ceramics' },
                        { label: '🪵 Woodworks', val: 'Woodworks' },
                        { label: '⚒️ Metal Works', val: 'Metal works' },
                        { label: '🪡 Handmade Crafts', val: 'Handmade crafts' },
                        { label: '👑 Indigenous Art', val: 'Indigenous artworks' },
                        { label: '✨ Limited Editions', val: 'Limited edition collections' },
                      ].map((c) => (
                        <button
                          key={c.val}
                          type="button"
                          onClick={() => setArtForm({ ...artForm, category: c.val })}
                          className={`p-1.5 rounded-lg text-[10px] font-bold border transition text-left truncate ${
                            artForm.category === c.val
                              ? 'bg-amber-100 border-art-gold text-amber-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Retail Price in NGN (₦)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1500000"
                      value={artForm.price}
                      onChange={(e) => setArtForm({ ...artForm, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 font-mono focus:border-art-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Country & City Provenance Origin Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Creation Country</label>
                    <select
                      value={artForm.country}
                      onChange={(e) => {
                        const flags = { 'Nigeria': '🇳🇬', 'Ghana': '🇬🇭', 'South Africa': '🇿🇦', 'Egypt': '🇪🇬', 'Morocco': '🇲🇦', 'Mali': '🇲🇱', 'Ethiopia': '🇪🇹', 'Kenya': '🇰🇪' };
                        setArtForm({ ...artForm, country: e.target.value, countryFlag: flags[e.target.value] || '🌍' });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:border-art-gold focus:outline-none cursor-pointer"
                    >
                      <option value="Nigeria">🇳🇬 Nigeria</option>
                      <option value="Ghana">🇬🇭 Ghana</option>
                      <option value="South Africa">🇿🇦 South Africa</option>
                      <option value="Egypt">🇪🇬 Egypt</option>
                      <option value="Morocco">🇲🇦 Morocco</option>
                      <option value="Mali">🇲🇱 Mali</option>
                      <option value="Ethiopia">🇪🇹 Ethiopia</option>
                      <option value="Kenya">🇰🇪 Kenya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Creation City / Atelier</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lagos, Benin City, Accra, Cairo"
                      value={artForm.city}
                      onChange={(e) => setArtForm({ ...artForm, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:border-art-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Medium & Technique</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oil & 24k Gold Leaf on Canvas"
                      value={artForm.medium}
                      onChange={(e) => setArtForm({ ...artForm, medium: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:border-art-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Dimensions</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 150 x 120 cm"
                      value={artForm.dimensions}
                      onChange={(e) => setArtForm({ ...artForm, dimensions: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:border-art-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">High-Resolution Image URL</label>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    value={artForm.image}
                    onChange={(e) => setArtForm({ ...artForm, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:border-art-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Studio Notes & Artistic Concept (Appears on Artwork Page)</label>
                  <textarea
                    rows="2"
                    placeholder="Share your personal creative ritual, pigment harvesting, or spiritual inspiration..."
                    value={artForm.studioNotes}
                    onChange={(e) => setArtForm({ ...artForm, studioNotes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:border-art-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Description & Narrative</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Tell the story or cultural concept behind the masterpiece..."
                    value={artForm.description}
                    onChange={(e) => setArtForm({ ...artForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-850 focus:border-art-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow"
                >
                  Publish Masterpiece Instantly
                </button>
              </form>
            </div>

            {/* 3. Pre-Purchase Q&A Inquiries Inbox */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-art-gold" />
                  <span>Pre-Purchase Collector Inquiries</span>
                </h3>
                <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  {myQuestions.length} Total
                </span>
              </div>

              {myQuestions.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No collector inquiries currently pending for your studio works.
                </p>
              ) : (
                <div className="space-y-4">
                  {myQuestions.map((q) => {
                    const relatedArt = myArtworks.find(a => a.id === q.artworkId);
                    return (
                      <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                          <span>Artwork: <strong className="text-slate-800">{relatedArt?.title || q.artworkId}</strong></span>
                          <div className="flex items-center gap-2">
                            <span>{q.date}</span>
                            <button
                              onClick={() => {
                                if (confirm('Delete this question?')) {
                                  deleteQuestion(q.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900">"{q.question}"</p>
                          <p className="text-[10px] text-slate-500 font-sans">Asked by: {q.askedBy}</p>
                        </div>

                        {q.answer ? (
                          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Your Published Answer:</span>
                              <button
                                onClick={() => {
                                  setEditingQId(q.id);
                                  setEditQAnswerText(q.answer);
                                }}
                                className="text-[10px] text-slate-600 font-bold hover:underline"
                              >
                                Edit Answer
                              </button>
                            </div>
                            {editingQId === q.id ? (
                              <div className="flex gap-2 pt-1">
                                <input
                                  type="text"
                                  value={editQAnswerText}
                                  onChange={e => setEditQAnswerText(e.target.value)}
                                  className="flex-1 bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
                                />
                                <button
                                  onClick={() => {
                                    editQuestionAnswer(q.id, editQAnswerText, myArtistName);
                                    setEditingQId(null);
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
                          <div className="space-y-2 pt-1">
                            <textarea
                              rows="2"
                              placeholder="Write your response to this collector (will appear publicly on artwork page)..."
                              value={replyMap[q.id] || ''}
                              onChange={(e) => setReplyMap({ ...replyMap, [q.id]: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-art-gold"
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleSendReply(q.id)}
                                className="px-4 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 shadow-sm"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Publish Answer</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Spotlight Banner Placement, Payout Bank, Drawing Signature Canvas, Offers & Inventory (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">

            {/* HOMEPAGE SPOTLIGHT BANNER PLACEMENT (ARTIST REQUEST PORTAL) */}
            <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 rounded-3xl border border-amber-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-art-gold animate-spin" style={{ animationDuration: '8s' }} />
                  <div>
                    <h3 className="font-serif text-base font-bold text-slate-900">Homepage Spotlight Banner Placement</h3>
                    <p className="text-[11px] text-slate-500">Feature your artwork in the grand homepage curatorial showcase</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-art-gold/20 text-amber-900 border border-art-gold/40">
                  Curatorial Spotlight
                </span>
              </div>

              {bannerSubmitMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{bannerSubmitMsg}</span>
                </div>
              )}

              {/* Admin Configured Pricing Options */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div 
                  onClick={() => setSelectedPlanForBanner('boost_7d')}
                  className={`p-3 rounded-xl border cursor-pointer transition text-center ${
                    selectedPlanForBanner === 'boost_7d' 
                      ? 'bg-amber-100 border-amber-500 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">7-Day Boost</span>
                  <span className="font-serif font-bold text-slate-900 text-sm block">₦{(priorityBannerPricing?.boost7d || 15000).toLocaleString()}</span>
                </div>

                <div 
                  onClick={() => setSelectedPlanForBanner('monthly')}
                  className={`p-3 rounded-xl border cursor-pointer transition text-center relative ${
                    selectedPlanForBanner === 'monthly' 
                      ? 'bg-amber-100 border-amber-500 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-[10px] text-amber-800 uppercase block font-bold">Monthly</span>
                  <span className="font-serif font-bold text-amber-900 text-sm block">₦{(priorityBannerPricing?.monthly || 50000).toLocaleString()}</span>
                </div>

                <div 
                  onClick={() => setSelectedPlanForBanner('annual')}
                  className={`p-3 rounded-xl border cursor-pointer transition text-center ${
                    selectedPlanForBanner === 'annual' 
                      ? 'bg-amber-100 border-amber-500 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Annual Pass</span>
                  <span className="font-serif font-bold text-slate-900 text-sm block">₦{(priorityBannerPricing?.annual || 350000).toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Placement Form */}
              <form onSubmit={handleBannerSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Artwork to Feature:</label>
                  <select
                    value={selectedArtForBanner}
                    onChange={(e) => setSelectedArtForBanner(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    {myArtworks.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.title} ({formatPrice(a.price)})
                      </option>
                    ))}
                    {myArtworks.length === 0 && (
                      <option value="">Upload an artwork first</option>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={myArtworks.length === 0}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-art-black" />
                  <span>Submit Artwork for Homepage Banner</span>
                </button>
              </form>

              {/* Artist's Active Placements List */}
              {myArtistBannerPlacements.length > 0 && (
                <div className="pt-2 border-t border-amber-200/60 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Your Banner Placements:</span>
                  {myArtistBannerPlacements.map(p => (
                    <div key={p.id} className="p-2.5 rounded-xl bg-white border border-amber-200/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img src={p.image || p.artworkImage} alt="" className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{p.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono capitalize">{p.plan?.replace('_', ' ')} · Active till {p.endDate}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Live on Home
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 1. PAYOUT BANKING DETAILS (Account Name, Bank Name, Account Number) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>{artistPayoutPercentage}% Net Payout Bank Account</span>
                </h3>
                {bankSaveMsg && (
                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500">
                Your {artistPayoutPercentage}% net sales earnings are disbursed directly into this registered bank account upon delivery.
              </p>

              <form onSubmit={handleSaveBankDetails} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Bank Account Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kofi Mensah Fine Arts Enterprise"
                    value={bankForm.payout_account_name}
                    onChange={e => setBankForm({ ...bankForm, payout_account_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Bank Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Standard Chartered Ghana / Access Bank"
                    value={bankForm.payout_bank}
                    onChange={e => setBankForm({ ...bankForm, payout_bank: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Account Number / IBAN</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 01002345678"
                    value={bankForm.payout_account}
                    onChange={e => setBankForm({ ...bankForm, payout_account: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-sm"
                >
                  Save Payout Bank Credentials
                </button>
              </form>
            </div>

            {/* 2. INTERACTIVE DIGITAL CERTIFICATE SIGNATURE CANVAS */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-art-gold" />
                  <span>Digital Certificate Signature (COA)</span>
                </h3>
                {sigSaveMsg && (
                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>COA Signature Saved!</span>
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-500">
                Draw your authentic signature below or choose a calligraphy script. This will be stamped onto every Digital Certificate of Authenticity (COA) issued to collectors.
              </p>

              {/* Mode switch */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSigMode('draw')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                    sigMode === 'draw' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ✍️ Draw Signature Canvas
                </button>
                <button
                  type="button"
                  onClick={() => setSigMode('font')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                    sigMode === 'font' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  🖋️ Script Calligraphy
                </button>
              </div>

              <form onSubmit={handleSaveSignature} className="space-y-3 text-xs">
                {sigMode === 'draw' ? (
                  <div className="space-y-2">
                    <div className="relative border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 overflow-hidden cursor-crosshair">
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-28 touch-none bg-white"
                      />
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-400 block text-center">Use your mouse, finger, or stylus to draw your personal signature</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-600 mb-1 font-medium">Calligraphy Font Style</label>
                      <select
                        value={sigStyle}
                        onChange={(e) => setSigStyle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-850 cursor-pointer"
                      >
                        <option value="Heritage Calligraphy">Heritage Calligraphy</option>
                        <option value="African Royal Script">African Royal Script</option>
                        <option value="Modern Sovereign Signature">Modern Sovereign Signature</option>
                      </select>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">Live Script Preview</span>
                      <p className="font-serif text-2xl italic text-amber-800 font-bold">{myArtistName}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-art-gold" />
                  <span>Save Signature to Certificates</span>
                </button>
              </form>
            </div>

            {/* 3. Incoming Private Buyout Offers */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <span>Incoming Private Buyout Offers</span>
                </h3>
                <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-700">
                  {myIncomingOffers.length}
                </span>
              </div>

              {myIncomingOffers.length === 0 ? (
                <p className="text-slate-400 text-xs italic text-center py-4">
                  No private collector offers received yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {myIncomingOffers.map((offer) => (
                    <div key={offer.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-bold text-slate-900">{offer.artworkTitle}</span>
                        <span className="font-mono font-bold text-emerald-700">{formatPrice(offer.amount)}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">Offered by: <strong className="text-slate-900">{offer.buyerName}</strong></p>
                      {offer.note && <p className="text-[10px] text-slate-500 italic bg-white p-2 rounded border border-slate-150">"{offer.note}"</p>}
                      
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          offer.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {offer.status}
                        </span>

                        {offer.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                updateCollectorOfferStatus(offer.id, 'rejected');
                                alert('Offer declined.');
                              }}
                              className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] uppercase"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => {
                                updateCollectorOfferStatus(offer.id, 'accepted');
                                alert(`Offer of ₦${offer.amount.toLocaleString()} accepted! Direct payment settlement established.`);
                              }}
                              className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase shadow-sm"
                            >
                              Accept (Direct Settlement)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Studio Inventory List with Edit & Delete */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-art-gold" />
                  <span>My Artwork Inventory</span>
                </h3>
                <span className="text-xs font-mono font-bold text-slate-500">{myArtworks.length} Total</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {myArtworks.map((art) => (
                  <div key={art.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                    <img src={art.image} alt={art.title} className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-xs font-bold text-slate-900 truncate">{art.title}</h4>
                      <p className="text-[10px] text-art-gold font-mono font-bold">{formatPrice(art.price)}</p>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase mt-0.5 ${
                        art.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                        art.status === 'sold' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {art.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setEditingArt(art);
                          setEditArtForm({
                            title: art.title,
                            price: art.price,
                            country: art.country || 'Nigeria',
                            city: art.city || 'Lagos',
                            countryFlag: art.countryFlag || '🇳🇬',
                            medium: art.medium,
                            dimensions: art.dimensions,
                            studioNotes: art.studioNotes || '',
                            description: art.description || '',
                            status: art.status
                          });
                        }}
                        className="p-1.5 bg-white border border-slate-200 hover:border-art-gold text-slate-600 hover:text-art-gold rounded-lg transition"
                        title="Edit Artwork"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove "${art.title}" from your studio inventory?`)) {
                            deleteArtwork(art.id);
                          }
                        }}
                        className="p-1.5 bg-white border border-slate-200 hover:border-red-500 text-slate-400 hover:text-red-600 rounded-lg transition"
                        title="Delete Artwork"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/artwork/${art.id}`}
                        className="p-1.5 bg-white border border-slate-200 hover:border-art-gold text-slate-600 hover:text-art-gold rounded-lg transition"
                        title="View public page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    )}

    {/* Artwork Edit Modal */}
        {editingArt && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Edit Artwork · {editingArt.title}
                </h3>
                <button onClick={() => setEditingArt(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEditArt} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Artwork Title</label>
                    <input
                      type="text"
                      required
                      value={editArtForm.title}
                      onChange={(e) => setEditArtForm({ ...editArtForm, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Retail Price (₦ NGN)</label>
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
                  <label className="block text-slate-600 mb-1 font-medium">Studio Notes / Story Behind Artwork</label>
                  <textarea
                    rows="3"
                    value={editArtForm.studioNotes}
                    onChange={(e) => setEditArtForm({ ...editArtForm, studioNotes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Medium</label>
                    <input
                      type="text"
                      value={editArtForm.medium}
                      onChange={(e) => setEditArtForm({ ...editArtForm, medium: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Listing Format</label>
                    <select
                      value={editArtForm.status}
                      onChange={(e) => setEditArtForm({ ...editArtForm, status: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 cursor-pointer"
                    >
                      <option value="available">Available (Buy-Now)</option>
                      <option value="auction">Live Auction Arena</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingArt(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl transition shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Master Artist Profile Photo Studio Modal */}
        <ProfilePhotoStudioModal
          isOpen={isPhotoStudioOpen}
          onClose={() => setIsPhotoStudioOpen(false)}
          currentPhoto={currentUser?.avatar_url || mySellerProfile?.avatar_url || ''}
          onSavePhoto={handleSaveArtistPhoto}
          userRole="artist"
          userName={myArtistName}
        />

      </div>
    </div>
  );
}
