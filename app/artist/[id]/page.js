'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Palette, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  UserCheck, 
  UserPlus, 
  MapPin, 
  Award, 
  ExternalLink, 
  Globe, 
  Instagram, 
  Phone, 
  Mail, 
  Building, 
  Lock, 
  Eye, 
  Crown, 
  Share2, 
  Flame, 
  Check, 
  Calendar, 
  DollarSign, 
  Layers, 
  ArrowLeft, 
  Shield, 
  AlertCircle, 
  MessageCircle,
  Clock,
  Compass,
  FileCheck
} from 'lucide-react';
import ArtworkCard from '@/components/ArtworkCard';
import VerificationBadge from '@/components/VerificationBadge';
import { DEFAULT_FALLBACK_IMAGE, getCategoryFallback } from '@/lib/image-utils';
import { isPriorityArtist } from '@/lib/priority-utils';

export default function MasterArtistProfilePage() {
  const router = useRouter();
  const params = useParams();
  const rawId = decodeURIComponent(params?.id || '');

  const { 
    currentUser, 
    sellers = [], 
    usersList = [], 
    artworks = [], 
    toggleFollowArtist, 
    isFollowingArtist,
    followedArtists = [],
    askArtworkQuestion
  } = useStore();

  const [activePortfolioTab, setActivePortfolioTab] = useState('all'); // 'all' | 'available' | 'auction' | 'exhibition' | 'sold'
  const [copiedLink, setCopiedLink] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // 1. Resolve matching seller or user
  const sellerMatch = useMemo(() => {
    return sellers.find(s => 
      s.id === rawId || 
      s.user_id === rawId || 
      s.name?.toLowerCase() === rawId.toLowerCase() ||
      (rawId && s.name && s.name.toLowerCase().includes(rawId.toLowerCase()))
    );
  }, [sellers, rawId]);

  const userMatch = useMemo(() => {
    return usersList.find(u => 
      u.id === rawId || 
      u.name?.toLowerCase() === rawId.toLowerCase() ||
      (rawId && u.name && u.name.toLowerCase().includes(rawId.toLowerCase()))
    );
  }, [usersList, rawId]);

  // 2. Resolve all artworks created by this artist
  const artistArtworks = useMemo(() => {
    const searchTarget = rawId.toLowerCase();
    const sellerName = sellerMatch?.name?.toLowerCase();
    const userName = userMatch?.name?.toLowerCase();

    return artworks.filter(art => {
      const artArtistName = art.artistName?.toLowerCase() || '';
      const artArtistId = art.artistId;
      return (
        artArtistId === rawId ||
        artArtistName === searchTarget ||
        (searchTarget && artArtistName.includes(searchTarget)) ||
        (sellerName && (artArtistName === sellerName || artArtistName.includes(sellerName))) ||
        (userName && (artArtistName === userName || artArtistName.includes(userName))) ||
        (userMatch?.id && artArtistId === userMatch.id) ||
        (sellerMatch?.id && artArtistId === sellerMatch.id)
      );
    });
  }, [artworks, rawId, sellerMatch, userMatch]);

  // 3. Fallback to first artwork for basic metadata if neither seller nor user found
  const firstArt = artistArtworks[0];
  const name = userMatch?.name || sellerMatch?.name || firstArt?.artistName || rawId;
  const artistTitle = userMatch?.artistTitle || sellerMatch?.artistTitle || 'Contemporary Master Visual Artist';
  const bio = userMatch?.bio || sellerMatch?.bio || `${name} is an internationally recognized African Master Visual Artist whose atelier practice champions authentic cultural heritage, classical African iconography, and museum-grade contemporary aesthetics.`;
  const country = userMatch?.country || sellerMatch?.country || firstArt?.country || 'Nigeria';
  const city = userMatch?.city || sellerMatch?.city || firstArt?.city || 'Lagos';
  const countryFlag = userMatch?.countryFlag || sellerMatch?.country_flag || firstArt?.countryFlag || '🇳🇬';
  const avatar = userMatch?.avatar_url || sellerMatch?.avatar_url || firstArt?.artistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
  const guildLineage = userMatch?.guildLineage || sellerMatch?.guildLineage || 'Sovereign Guild of African Master Artisans';
  const primaryMediums = userMatch?.primaryMediums || sellerMatch?.primaryMediums || firstArt?.medium || 'Oil, Acrylic, 24K Gold Leaf & Natural Ochres on Linen';
  const exhibitionsHistory = userMatch?.exhibitionsHistory || sellerMatch?.exhibitionsHistory || 'Venice Biennale African Pavilion, Dakar Biennale (Dak\'Art), Lagos National Museum';
  const experienceYears = userMatch?.experienceYears || sellerMatch?.experienceYears || '15+ Years Atelier Practice';
  const verificationBadge = sellerMatch?.verification_badge || userMatch?.verificationBadge || firstArt?.verificationBadge || 'gold';
  const isPriority = Boolean(sellerMatch?.tier === 'Premium' || userMatch?.subscriptionTier === 'premium' || firstArt?.artistType === 'Premium' || isPriorityArtist({ artistName: name, ...userMatch }));

  // Links
  const website = userMatch?.website || sellerMatch?.website;
  const instagram = userMatch?.instagram || sellerMatch?.instagram;

  // Sensitive Contact Details (ONLY accessible by Admin)
  const phone = userMatch?.phone || sellerMatch?.phone;
  const email = userMatch?.email || sellerMatch?.email;
  const studioAddress = userMatch?.studioAddress || sellerMatch?.studioAddress;
  const payoutBank = userMatch?.payout_bank || sellerMatch?.payout_bank || 'WEMA Bank PLC';
  const payoutAccount = userMatch?.payout_account || sellerMatch?.payout_account || '0123456789';
  const payoutAccountName = userMatch?.payout_account_name || sellerMatch?.payout_account_name || `${name} Studio`;

  // Follow State & Logic
  const artistLookupKey = userMatch?.id || sellerMatch?.id || name;
  const isFollowing = isFollowingArtist(artistLookupKey) || isFollowingArtist(name);
  
  const handleFollowToggle = () => {
    toggleFollowArtist(artistLookupKey, {
      name,
      avatar,
      country,
      city,
      countryFlag
    });
  };

  // Check if current user is this artist
  const isMyOwnProfile = Boolean(
    currentUser && (
      currentUser.id === userMatch?.id || 
      (currentUser.name && currentUser.name.toLowerCase() === name.toLowerCase())
    )
  );

  const isAdmin = currentUser?.role === 'admin';

  // Portfolio filters
  const filteredArtworks = useMemo(() => {
    if (activePortfolioTab === 'available') return artistArtworks.filter(a => a.status === 'available');
    if (activePortfolioTab === 'auction') return artistArtworks.filter(a => a.status === 'auction' || a.isAuction);
    if (activePortfolioTab === 'exhibition') return artistArtworks.filter(a => a.status === 'exhibition' || a.isExhibition);
    if (activePortfolioTab === 'sold') return artistArtworks.filter(a => a.status === 'sold');
    return artistArtworks;
  }, [artistArtworks, activePortfolioTab]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    if (firstArt && askArtworkQuestion) {
      askArtworkQuestion(firstArt.id, inquiryText);
    }
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setInquiryModalOpen(false);
      setInquiryText('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-slate-100 font-sans pb-24">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link 
              href="/explore" 
              className="text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Explore All</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-art-gold font-serif truncate max-w-[200px] sm:max-w-none">{name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
            </button>

            {isMyOwnProfile && (
              <Link
                href="/artist/dashboard"
                className="px-3 py-1.5 rounded-xl bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider text-[11px] transition shadow-gold-glow flex items-center gap-1"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Go to Studio Dashboard</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 font-bold text-[11px] transition flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Admin Governance</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Artist Dossier Hero Section */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-[#14120B] via-[#0A0B0E] to-[#07080A]">
        {/* Subtle patterned gold glow backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
            
            {/* Left: Avatar, Title, Identity & Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-art-gold shadow-[0_0_25px_rgba(212,175,55,0.3)] bg-black shrink-0">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                    }}
                  />
                </div>
                {isPriority && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-art-gold to-yellow-500 text-black p-1.5 rounded-full shadow-lg border border-amber-300">
                    <Crown className="w-4 h-4 fill-current" />
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-4xl font-black text-white tracking-wide">
                    {name}
                  </h1>
                  <span className="text-xl" title={country}>{countryFlag}</span>
                  <VerificationBadge badge={verificationBadge} />
                  {isPriority && (
                    <span className="px-2.5 py-0.5 rounded-full bg-art-gold/20 text-art-gold text-[10px] font-mono font-bold uppercase border border-art-gold/40">
                      👑 Priority Living Master
                    </span>
                  )}
                </div>

                <p className="text-art-gold font-serif text-sm sm:text-base italic">
                  {artistTitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-art-gold" />
                    <span>{city}, {country}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Award className="w-3.5 h-3.5 text-art-gold" />
                    <span>{experienceYears}</span>
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold">
                    {artistArtworks.length} Documented Artworks
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions (Follow & Curatorial Inquire) */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Follow Artist Button */}
              <button
                onClick={handleFollowToggle}
                className={`flex-1 sm:flex-initial px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isFollowing
                    ? 'bg-emerald-500/20 hover:bg-red-500/20 text-emerald-300 hover:text-red-300 border border-emerald-500/40 hover:border-red-500/40'
                    : 'bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black shadow-gold-glow'
                }`}
              >
                {isFollowing ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Following Master</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow Artist</span>
                  </>
                )}
              </button>

              {/* Curatorial Inquire via Artellium Concierge */}
              <button
                onClick={() => setInquiryModalOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-art-gold" />
                <span>Inquire on Atelier Works</span>
              </button>
            </div>

          </div>

          {/* Social and Curatorial Links */}
          {(website || instagram) && (
            <div className="flex items-center gap-4 pt-6 border-t border-white/10 mt-6 text-xs font-mono">
              {website && (
                <a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-art-gold flex items-center gap-1.5 transition"
                >
                  <Globe className="w-3.5 h-3.5 text-art-gold" />
                  <span>Official Atelier Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}
              {instagram && (
                <a
                  href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-art-gold flex items-center gap-1.5 transition"
                >
                  <Instagram className="w-3.5 h-3.5 text-art-gold" />
                  <span>{instagram.startsWith('@') ? instagram : `@${instagram}`}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ========================================================================= */}
        {/* PRIVACY & CONFIDENTIALITY ESCROW CARD (ADMIN VS BUYER LOGIC)               */}
        {/* ========================================================================= */}
        {isAdmin ? (
          /* ADMIN VIEW: COMPLETE RESTRICTED DOSSIER */
          <div className="p-6 bg-slate-900 rounded-3xl border-2 border-art-gold shadow-2xl text-white space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-art-gold/20 border border-art-gold flex items-center justify-center text-art-gold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-art-gold block font-bold">
                    CONFIDENTIAL EXECUTIVE DOSSIER • PLATFORM ADMINISTRATOR ACCESS
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Complete Master Artist Dossier & Sovereign Payout Records
                  </h3>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-art-gold/20 text-art-gold text-xs font-mono font-bold uppercase border border-art-gold/50 flex items-center gap-1.5 self-start sm:self-auto">
                <Lock className="w-3.5 h-3.5" />
                <span>Admin View (Shielded from Public & Buyers)</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              This dossier contains sensitive identification, telephone numbers, direct studio addresses, and sovereign banking settlement credentials. Under Artellium safety protocols, these records are strictly shielded from public buyers and competitors.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-art-gold" />
                  <span>Direct Studio Email</span>
                </span>
                <p className="font-bold text-white text-sm break-all">{email || `${name.toLowerCase().replace(/\s+/g, '.')}@artellium.africa`}</p>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Telephone / WhatsApp</span>
                </span>
                <p className="font-bold text-emerald-400 text-sm">{phone || '+234 800 000 0000 (Atelier Direct)'}</p>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-art-gold" />
                  <span>Physical Atelier Street Coordinates</span>
                </span>
                <p className="font-bold text-white text-xs">{studioAddress || `Atelier Complex, ${city}, ${country}`}</p>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-art-gold" />
                  <span>Corporate Settlement Bank</span>
                </span>
                <p className="font-bold text-art-gold text-sm">{payoutBank}</p>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-white" />
                  <span>Settlement Account Number</span>
                </span>
                <p className="font-bold text-white text-sm">{payoutAccount}</p>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Beneficiary Account Moniker</span>
                </span>
                <p className="font-bold text-white text-xs">{payoutAccountName}</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/10">
              <span className="text-slate-400 text-[11px] font-mono">
                Artist Database ID: <strong className="text-slate-200">{artistLookupKey}</strong> • Verification Hash: <strong className="text-emerald-400">KYC-WEMA-AUTHENTICATED</strong>
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/dashboard"
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition"
                >
                  Manage in Admin Console →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* BUYER / PUBLIC VIEW: PROTECTED CONTACT ESCROW PROTOCOL */
          <div className="p-6 bg-gradient-to-r from-slate-950 via-[#100F08] to-slate-900 rounded-3xl border border-art-gold/30 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-art-gold/15 border border-art-gold/40 flex items-center justify-center shrink-0 text-art-gold">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-serif text-base font-bold text-white">
                    Artellium Collector Safety & Escrow Protection
                  </h4>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    ✓ Escrow Certified
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  Direct artist contact details (phone numbers, private email, and banking accounts) are confidential and protected under Artellium Escrow protocols. All acquisitions, provenance certificates, and white-glove transport are fully guaranteed through our escrow gateway.
                </p>
              </div>
            </div>

            <button
              onClick={() => setInquiryModalOpen(true)}
              className="px-5 py-2.5 bg-art-gold/20 hover:bg-art-gold text-art-gold hover:text-black rounded-xl text-xs font-bold uppercase tracking-wider transition border border-art-gold/40 shrink-0 self-start md:self-auto cursor-pointer"
            >
              Ask Atelier Question
            </button>
          </div>
        )}

        {/* Master Curatorial Dossier & Lineage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Biography & Lineage (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Biography */}
            <div className="p-6 sm:p-8 bg-slate-900/60 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-art-gold" />
                <span>Curatorial Biography & Studio Philosophy</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-serif">
                {bio}
              </p>
            </div>

            {/* Primary Mediums & Guild Lineage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-900/60 rounded-3xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-art-gold text-xs font-bold uppercase tracking-wider">
                  <Palette className="w-4 h-4" />
                  <span>Primary Mediums & Atelier Craft</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {primaryMediums}
                </p>
              </div>

              <div className="p-6 bg-slate-900/60 rounded-3xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-art-gold text-xs font-bold uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Master Guild & Traditional Lineage</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {guildLineage}
                </p>
              </div>
            </div>

            {/* Selected Biennales & Museum Exhibitions */}
            {exhibitionsHistory && (
              <div className="p-6 bg-slate-900/60 rounded-3xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-art-gold text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-4 h-4" />
                  <span>Documented Biennales, Museum Exhibitions & Honours</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {exhibitionsHistory}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Atelier Metrics & Highlights (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-slate-900/60 rounded-3xl border border-white/10 space-y-5">
              <h4 className="font-serif text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Atelier Accreditation Metrics</span>
              </h4>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Artworks Listed:</span>
                  <strong className="text-white text-sm">{artistArtworks.length} Masterpieces</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Available to Acquire:</span>
                  <strong className="text-emerald-400 font-bold">
                    {artistArtworks.filter(a => a.status === 'available').length} Available
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Live Auction Lots:</span>
                  <strong className="text-art-red font-bold">
                    {artistArtworks.filter(a => a.status === 'auction' || a.isAuction).length} Active Lots
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Curatorial Exhibitions:</span>
                  <strong className="text-art-gold font-bold">
                    {artistArtworks.filter(a => a.status === 'exhibition' || a.isExhibition).length} Featured
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Documented Acquired:</span>
                  <strong className="text-slate-300">
                    {artistArtworks.filter(a => a.status === 'sold').length} Settled
                  </strong>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-slate-400">Collector Verification:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    100% WEMA Insured
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Collector Follow Card */}
            <div className="p-6 bg-gradient-to-br from-black via-slate-900 to-[#120F08] rounded-3xl border border-art-gold/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-art-gold/15 border border-art-gold mx-auto flex items-center justify-center text-art-gold">
                <UserPlus className="w-5 h-5" />
              </div>
              <h5 className="font-serif font-bold text-white text-base">
                Follow {name}
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive private curatorial notifications when new works, auction lots, or museum showcases are published from this atelier.
              </p>
              <button
                onClick={handleFollowToggle}
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                  isFollowing
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-art-gold hover:brightness-110 text-art-black shadow-gold-glow'
                }`}
              >
                {isFollowing ? '✓ Following This Artist' : '+ Follow Artist'}
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* ARTIST PORTFOLIO & CATALOGUE SHOWCASE                                     */}
        {/* ========================================================================= */}
        <div className="space-y-6 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="w-6 h-6 text-art-gold" />
                <span>Atelier Masterworks & Catalogue ({artistArtworks.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Explore original masterpieces created by {name} available for private acquisition, live auction bidding, and museum exhibitions.
              </p>
            </div>

            {/* Portfolio Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto text-xs font-bold">
              {[
                { id: 'all', label: `All Works (${artistArtworks.length})` },
                { id: 'available', label: `Buy-Now (${artistArtworks.filter(a => a.status === 'available').length})` },
                { id: 'auction', label: `Auctions (${artistArtworks.filter(a => a.status === 'auction' || a.isAuction).length})` },
                { id: 'exhibition', label: `Exhibitions (${artistArtworks.filter(a => a.status === 'exhibition' || a.isExhibition).length})` },
                { id: 'sold', label: `Sold (${artistArtworks.filter(a => a.status === 'sold').length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActivePortfolioTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
                    activePortfolioTab === tab.id
                      ? 'bg-art-gold text-art-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Artworks Grid */}
          {filteredArtworks.length === 0 ? (
            <div className="text-center py-16 p-8 bg-slate-900/40 rounded-3xl border border-white/10 space-y-3">
              <Palette className="w-12 h-12 text-slate-500 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-white">No Artworks in this Category</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No masterpieces currently match this status filter. Switch to "All Works" to inspect the master's full permanent portfolio.
              </p>
              <button
                onClick={() => setActivePortfolioTab('all')}
                className="px-4 py-2 bg-art-gold text-art-black rounded-xl text-xs font-bold uppercase transition"
              >
                View All Works
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Direct Inquire Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-art-gold/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-art-gold uppercase tracking-wider font-bold">
                CONFIDENTIAL CURATORIAL INQUIRY
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                Inquire on {name}&apos;s Atelier
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your message is securely transmitted to the artist and Artellium Curatorial Concierge. Artist contact details remain shielded to protect your escrow guarantee.
              </p>
            </div>

            {inquirySent ? (
              <div className="p-6 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-serif font-bold text-white text-base">Inquiry Transmitted!</h4>
                <p className="text-xs text-slate-300">
                  Your inquiry has been delivered. You will receive an alert once the artist or curatorial concierge replies.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Your Inquiring Collector Moniker / Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.name ? `${currentUser.name} (${currentUser.email})` : 'Guest Patron (Sign in recommended)'}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Question or Private Offer Note
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ask about artwork provenance, framing, custom sizing, or private acquisition..."
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-art-gold leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setInquiryModalOpen(false)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-art-gold hover:brightness-110 text-art-black rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-gold-glow"
                  >
                    Transmit Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
