'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Flame, 
  Video, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  CreditCard, 
  Building, 
  Plus, 
  Check, 
  CheckCircle2, 
  X, 
  Play, 
  ExternalLink,
  DollarSign,
  Send,
  PenTool,
  Clock,
  Globe
} from 'lucide-react';

export default function ArtistPanAfricanSuite({ artistName = 'Kofi Mensah' }) {
  const { 
    artworks = [], 
    flashDeals = [], 
    addFlashDeal, 
    videos = [], 
    addVideo, 
    artistVerifications = [], 
    requestArtistVerification,
    curatorPicks = [],
    curatorApplications = [],
    ledgerBlocks = [],
    currency,
    formatCurrency,
    panAfricanCurrencies = {},
    sellers = [],
    updateSeller,
    currentUser,
    artistPayoutPercentage = 85
  } = useStore();

  const [activeTab, setActiveTab] = useState('flash_deals'); // 'flash_deals', 'videos', 'verification', 'curator_review', 'provenance_signing', 'payouts'
  const [successNotice, setSuccessNotice] = useState('');

  // Flash Deal Form
  const [selectedArtForDeal, setSelectedArtForDeal] = useState('');
  const [dealDiscount, setDealDiscount] = useState(25);
  const [dealUnits, setDealUnits] = useState(1);
  const [dealDuration, setDealDuration] = useState(24);

  // Video Story Form
  const [videoForm, setVideoForm] = useState({
    artworkTitle: '',
    videoUrl: '',
    quote: '',
    thumbnail: '',
    duration: '3:45'
  });

  // Master Verification Form
  const [verifForm, setVerifForm] = useState({
    country: 'Ghana',
    accreditation: '',
    guildLineage: '',
    yearsPracticing: 15,
    biometricAgreement: true
  });

  // Curator Submission Form
  const [curatorSubForm, setCuratorSubForm] = useState({
    artworkId: '',
    targetPavilion: 'West African Modernism Pavilion',
    artistStatement: '',
    conservationNotes: ''
  });

  // Pan-African Payout Bank Form
  const [payoutForm, setPayoutForm] = useState({
    payoutType: 'nigeria_bank', // 'nigeria_bank', 'ghana_momo', 'sa_eft', 'kenya_mpesa'
    accountName: `${artistName} Studio Enterprises`,
    bankOrProvider: 'Wema Bank PLC',
    accountNumber: '0123456789',
    currency: 'NGN'
  });

  const myArtworks = artworks.filter(a => 
    a.artistName?.toLowerCase().includes(artistName.toLowerCase()) || 
    a.artistId === currentUser?.id ||
    artistName === 'Kofi Mensah'
  );

  const myFlashDeals = flashDeals.filter(d => 
    d.artistName?.toLowerCase().includes(artistName.toLowerCase()) || 
    artistName === 'Kofi Mensah'
  );

  const myVideos = videos.filter(v => 
    v.artistName?.toLowerCase().includes(artistName.toLowerCase()) ||
    artistName === 'Kofi Mensah'
  );

  const myVerif = artistVerifications.find(v => 
    v.artistName?.toLowerCase().includes(artistName.toLowerCase()) ||
    artistName === 'Kofi Mensah'
  );

  const myLedgerBlocks = ledgerBlocks.filter(b => 
    b.artistName?.toLowerCase().includes(artistName.toLowerCase()) ||
    artistName === 'Kofi Mensah'
  );

  // Handle Flash Deal Submit
  const handleCreateFlashDeal = (e) => {
    e.preventDefault();
    const art = myArtworks.find(a => a.id === selectedArtForDeal) || myArtworks[0];
    if (!art) {
      alert('Please select an artwork to discount.');
      return;
    }
    const orig = art.price || 1500000;
    const discounted = Math.round(orig * (1 - dealDiscount / 100));

    addFlashDeal({
      artworkId: art.id,
      title: art.title,
      artistName: art.artistName || artistName,
      country: art.country ? `${art.country} ${art.countryFlag || '🌍'}` : 'Ghana 🇬🇭',
      category: art.category || 'Painters',
      medium: art.medium || 'Fine Art',
      originalPrice: orig,
      discountedPrice: discounted,
      discountPercent: Number(dealDiscount),
      availableUnits: Number(dealUnits),
      claimedPercent: 0,
      image: art.image,
      description: `Direct Atelier Vault Discount authorized by ${artistName}.`,
      durationHours: Number(dealDuration)
    });

    setSuccessNotice(`⚡ Flash deal for "${art.title}" submitted and live in the Vault!`);
    setSelectedArtForDeal('');
    setTimeout(() => setSuccessNotice(''), 4500);
  };

  // Handle Video Submit
  const handleCreateVideo = (e) => {
    e.preventDefault();
    if (!videoForm.videoUrl || !videoForm.artworkTitle) return;

    addVideo({
      artistName: artistName,
      artistTitle: 'Master Creator & Visual Storyteller',
      country: 'Ghana 🇬🇭',
      artworkTitle: videoForm.artworkTitle,
      thumbnail: videoForm.thumbnail || myArtworks[0]?.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600',
      videoUrl: videoForm.videoUrl,
      quote: videoForm.quote || 'The spiritual origins behind this masterwork.',
      duration: videoForm.duration || '3:45'
    });

    setSuccessNotice('🎬 Video story published to Spotlight Voices & Provenance archive!');
    setVideoForm({ artworkTitle: '', videoUrl: '', quote: '', thumbnail: '', duration: '3:45' });
    setTimeout(() => setSuccessNotice(''), 4500);
  };

  // Handle Master Verification Request
  const handleRequestVerification = (e) => {
    e.preventDefault();
    requestArtistVerification({
      artistId: currentUser?.id || 'artist-1',
      artistName: artistName,
      country: verifForm.country,
      flag: verifForm.country === 'Ghana' ? '🇬🇭' : verifForm.country === 'Nigeria' ? '🇳🇬' : '🇿🇦',
      accreditation: verifForm.accreditation || 'National Museum Fellow & Master Guildsman',
      badge: 'gold',
      badgeLabel: 'Gold Crest Certified'
    });

    setSuccessNotice('🏅 Master Verification dossier submitted for curatorial board review!');
    setTimeout(() => setSuccessNotice(''), 4500);
  };

  // Handle Curator Submission
  const handleCuratorSubmission = (e) => {
    e.preventDefault();
    const art = myArtworks.find(a => a.id === curatorSubForm.artworkId) || myArtworks[0];
    setSuccessNotice(`✨ Masterpiece "${art?.title || 'Artwork'}" submitted for ${curatorSubForm.targetPavilion} review!`);
    setCuratorSubForm({ artworkId: '', targetPavilion: 'West African Modernism Pavilion', artistStatement: '', conservationNotes: '' });
    setTimeout(() => setSuccessNotice(''), 4500);
  };

  // Handle Payout Save
  const handleSavePayouts = (e) => {
    e.preventDefault();
    const seller = sellers.find(s => s.user_id === currentUser?.id || s.name === artistName);
    if (seller?.id) {
      updateSeller(seller.id, {
        payout_account_name: payoutForm.accountName,
        payout_bank: `${payoutForm.bankOrProvider} (${payoutForm.payoutType.toUpperCase()})`,
        payout_account: payoutForm.accountNumber
      });
    }
    setSuccessNotice(`🏦 Payout destination configured for ${payoutForm.bankOrProvider}!`);
    setTimeout(() => setSuccessNotice(''), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successNotice && (
        <div className="p-4 bg-emerald-900/90 border-2 border-emerald-400 text-emerald-100 rounded-2xl flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold text-xs sm:text-sm">{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice('')} className="text-emerald-300 hover:text-white text-xs font-bold">✕</button>
        </div>
      )}

      {/* Main Feature Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/10 text-amber-900 text-[10px] font-mono font-bold uppercase border border-art-gold/30">
              <Sparkles className="w-3.5 h-3.5 text-art-gold" />
              <span>MASTER ARTIST ADVANCED ATELIER SUITE</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Pan-African Studio & Provenance Hub
            </h2>
            <p className="text-xs text-slate-500 max-w-xl">
              Publish direct atelier flash deals, submit master video storytelling, manage your Gold Verification KYC dossier, and configure multi-currency African payouts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{artistPayoutPercentage}% Net Split · Direct Settlement</span>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 text-xs font-bold scrollbar-none">
          {[
            { id: 'flash_deals', label: '⚡ Studio Flash Deals', count: myFlashDeals.length },
            { id: 'videos', label: '🎬 Video Storytelling', count: myVideos.length },
            { id: 'verification', label: '🏅 Master KYC Dossier', count: myVerif ? 'Approved' : 'Pending' },
            { id: 'curator_review', label: '✨ Curatorial Submissions', count: 'Active' },
            { id: 'provenance_signing', label: '📜 Provenance & COAs', count: myLedgerBlocks.length },
            { id: 'payouts', label: '🏦 Pan-African Payouts', count: payoutForm.currency }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{t.label}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{t.count}</span>
            </button>
          ))}
        </div>

        {/* 1. TAB: STUDIO FLASH DEALS */}
        {activeTab === 'flash_deals' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Submit New Flash Deal Form */}
              <div className="lg:col-span-5 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-red-500" />
                    <span>Launch Atelier Flash Discount</span>
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Slash prices on select studio reserve pieces to drive direct collector acquisitions.
                  </p>
                </div>

                <form onSubmit={handleCreateFlashDeal} className="space-y-3.5">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Select Artwork from Your Atelier *</label>
                    <select
                      required
                      value={selectedArtForDeal}
                      onChange={e => setSelectedArtForDeal(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                    >
                      <option value="">-- Choose One of Your Pieces --</option>
                      {myArtworks.map(a => (
                        <option key={a.id} value={a.id}>{a.title} ({formatCurrency(a.price)})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Discount % *</label>
                      <select
                        value={dealDiscount}
                        onChange={e => setDealDiscount(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-red-600"
                      >
                        <option value={15}>15% Off</option>
                        <option value={20}>20% Off</option>
                        <option value={25}>25% Off</option>
                        <option value={30}>30% Off</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Available Units</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={dealUnits}
                        onChange={e => setDealUnits(Number(e.target.value))}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Duration (Hours)</label>
                    <select
                      value={dealDuration}
                      onChange={e => setDealDuration(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono"
                    >
                      <option value={12}>12 Hours (Flash Drop)</option>
                      <option value={24}>24 Hours (Standard)</option>
                      <option value={48}>48 Hours (Weekend Vault)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs shadow-md transition cursor-pointer"
                  >
                    Publish to Flash Deals Vault
                  </button>
                </form>
              </div>

              {/* Right: Active Flash Deals List */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-serif text-base font-bold text-slate-900">Your Active Atelier Deals ({myFlashDeals.length})</h3>
                {myFlashDeals.length === 0 ? (
                  <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                    No active flash deals currently published. Launch one using the form on the left.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myFlashDeals.map(deal => (
                      <div key={deal.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={deal.image} alt={deal.title} className="w-14 h-14 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-serif font-bold text-slate-900 text-sm">{deal.title}</h4>
                            <p className="text-[11px] text-slate-500 font-mono">
                              Slashed: <strong className="text-red-600">{formatCurrency(deal.discountedPrice)}</strong> (was {formatCurrency(deal.originalPrice)})
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-xs font-mono">
                          <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                            {deal.discountPercent}% OFF
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-1">{deal.availableUnits} left</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: VIDEO STORYTELLING */}
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-amber-600" />
                    <span>Upload Studio Documentary Reel</span>
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Share your creative rituals, chisel strokes, or pigment grinding philosophy directly with patrons.
                  </p>
                </div>

                <form onSubmit={handleCreateVideo} className="space-y-3.5">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Discussing Masterpiece *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Ancestral Horizon"
                      value={videoForm.artworkTitle}
                      onChange={e => setVideoForm({ ...videoForm, artworkTitle: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Video Streaming / YouTube URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://youtube.com/watch?v=..."
                      value={videoForm.videoUrl}
                      onChange={e => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Thumbnail Cover URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={videoForm.thumbnail}
                      onChange={e => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Spiritual Quote / Atelier Philosophy *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Every stroke of gold leaf represents a prayer for our forebears..."
                      value={videoForm.quote}
                      onChange={e => setVideoForm({ ...videoForm, quote: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-serif italic"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-xs shadow-md transition cursor-pointer"
                  >
                    Publish to Voices of Master Artists
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <h3 className="font-serif text-base font-bold text-slate-900">Your Published Story Reels ({myVideos.length})</h3>
                <div className="space-y-3">
                  {myVideos.map(vid => (
                    <div key={vid.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-4">
                      <div className="relative aspect-video w-32 shrink-0 rounded-xl overflow-hidden bg-black">
                        <img src={vid.thumbnail} alt={vid.artistName} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className="w-5 h-5 text-art-gold fill-current" />
                        </div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <h4 className="font-serif font-bold text-slate-900 text-sm">{vid.artworkTitle}</h4>
                        <p className="text-slate-600 font-serif italic line-clamp-2">&ldquo;{vid.quote}&rdquo;</p>
                        <span className="text-[10px] text-art-gold font-mono font-bold block pt-1">{vid.duration} duration</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. TAB: MASTER KYC VERIFICATION */}
        {activeTab === 'verification' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Gold Crest Master Verification</span>
                  </h3>
                  <p className="text-emerald-800 text-[11px]">
                    Submit your museum fellowship credentials and atelier guild history to receive the verified gold rosette badge on all listed works.
                  </p>
                </div>

                <form onSubmit={handleRequestVerification} className="space-y-3.5">
                  <div>
                    <label className="block text-emerald-950 font-bold mb-1">Country of Practice *</label>
                    <select
                      value={verifForm.country}
                      onChange={e => setVerifForm({ ...verifForm, country: e.target.value })}
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl"
                    >
                      <option value="Ghana">Ghana 🇬🇭</option>
                      <option value="Nigeria">Nigeria 🇳🇬</option>
                      <option value="South Africa">South Africa 🇿🇦</option>
                      <option value="Morocco">Morocco 🇲🇦</option>
                      <option value="Kenya">Kenya 🇰🇪</option>
                      <option value="Egypt">Egypt 🇪🇬</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-emerald-950 font-bold mb-1">Museum / Guild Accreditation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. National Museum of Ghana Fellow · Royal Guildsman"
                      value={verifForm.accreditation}
                      onChange={e => setVerifForm({ ...verifForm, accreditation: e.target.value })}
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-950 font-bold mb-1">Guild Lineage & Atelier Heritage</label>
                    <textarea
                      rows={3}
                      placeholder="Describe your family casting lineage, apprenticeship under master carvers, or biennial exhibitions..."
                      value={verifForm.guildLineage}
                      onChange={e => setVerifForm({ ...verifForm, guildLineage: e.target.value })}
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase tracking-wider text-xs shadow-md transition cursor-pointer"
                  >
                    Submit Verification Dossier
                  </button>
                </form>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-slate-900">Your Current Verification Status</h3>
                {myVerif ? (
                  <div className="p-6 bg-white rounded-2xl border-2 border-emerald-500/40 shadow-sm space-y-4 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 text-base">{myVerif.badgeLabel}</h4>
                          <span className="text-[11px] text-emerald-700 font-mono font-bold">Status: {myVerif.status.toUpperCase()}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                        {myVerif.approvalDate || 'Active'}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl space-y-1 font-mono text-[11px]">
                      <span className="text-slate-400 text-[10px] uppercase block">Cryptographic KYC Hash</span>
                      <span className="text-emerald-700 font-bold">{myVerif.kycHash}</span>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed">
                      {myVerif.accreditation}
                    </p>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                    No active verification dossier found. Complete the application form to gain certified master status.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB: CURATORIAL REVIEW SUBMISSIONS */}
        {activeTab === 'curator_review' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 p-6 bg-purple-50/60 rounded-2xl border border-purple-200/80 space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-purple-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Submit Work for Museum Curatorial Review</span>
                  </h3>
                  <p className="text-purple-800 text-[11px]">
                    Have your artwork reviewed by Africa’s foremost museum directors for feature in the Curator Picks editorial pavilion.
                  </p>
                </div>

                <form onSubmit={handleCuratorSubmission} className="space-y-3.5">
                  <div>
                    <label className="block text-purple-950 font-bold mb-1">Select Artwork *</label>
                    <select
                      required
                      value={curatorSubForm.artworkId}
                      onChange={e => setCuratorSubForm({ ...curatorSubForm, artworkId: e.target.value })}
                      className="w-full p-2.5 bg-white border border-purple-300 rounded-xl"
                    >
                      <option value="">-- Choose Masterpiece --</option>
                      {myArtworks.map(a => (
                        <option key={a.id} value={a.id}>{a.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-950 font-bold mb-1">Target Exhibition Pavilion *</label>
                    <select
                      value={curatorSubForm.targetPavilion}
                      onChange={e => setCuratorSubForm({ ...curatorSubForm, targetPavilion: e.target.value })}
                      className="w-full p-2.5 bg-white border border-purple-300 rounded-xl"
                    >
                      <option value="West African Modernism Pavilion">West African Modernism Pavilion</option>
                      <option value="Imperial Bronzes & Metallurgical Heritage">Imperial Bronzes & Metallurgical Heritage</option>
                      <option value="North African Saharan Perspectives">North African Saharan Perspectives</option>
                      <option value="Sacred Yoruba Ceremonial Sculpture">Sacred Yoruba Ceremonial Sculpture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-950 font-bold mb-1">Curatorial Statement & Technique Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Explain the metaphysical significance and technical mastery of this work..."
                      value={curatorSubForm.artistStatement}
                      onChange={e => setCuratorSubForm({ ...curatorSubForm, artistStatement: e.target.value })}
                      className="w-full p-2.5 bg-white border border-purple-300 rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold uppercase tracking-wider text-xs shadow-md transition cursor-pointer"
                  >
                    Submit for Curatorial Critique
                  </button>
                </form>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-slate-900">Published Curatorial Reviews for Your Works</h3>
                {curatorPicks.filter(p => p.artistName?.toLowerCase().includes(artistName.toLowerCase())).map(pick => (
                  <div key={pick.id} className="p-6 bg-white rounded-2xl border border-purple-200 shadow-sm space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-slate-900 text-sm">{pick.title}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">
                        ★ {pick.rating} / 5.0
                      </span>
                    </div>
                    <p className="font-serif italic text-slate-600">&ldquo;{pick.curatorCritique}&rdquo;</p>
                    <p className="text-[11px] text-purple-700 font-bold">— {pick.curatorName} ({pick.curatorRole})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. TAB: PROVENANCE & CERTIFICATE SIGNING */}
        {activeTab === 'provenance_signing' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-serif text-base font-bold text-slate-900">Sold Works & Physical Certificate Ledgers ({myLedgerBlocks.length})</h3>
            <div className="space-y-4">
              {myLedgerBlocks.map(block => (
                <div key={block.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-bold text-[10px]">{block.blockHeight}</span>
                      <h4 className="font-serif font-bold text-slate-900 text-sm mt-1">{block.artworkTitle}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Settlement Payout ({artistPayoutPercentage}%)</span>
                      <span className="font-serif text-base font-bold text-emerald-600">{formatCurrency(Math.round(block.settlementPrice * (artistPayoutPercentage / 100)))}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                    <div className="p-2.5 bg-white rounded-xl">
                      <span className="text-slate-400 text-[10px] uppercase block">Acquiring Custodian</span>
                      <span className="text-slate-800 font-bold">{block.custodian}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl">
                      <span className="text-slate-400 text-[10px] uppercase block">Certificate Serial</span>
                      <span className="text-amber-800 font-bold">{block.physicalCertificateId}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl truncate">
                      <span className="text-slate-400 text-[10px] uppercase block">Provenance Hash</span>
                      <span className="text-teal-700 truncate block">{block.provenanceHash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB: PAN-AFRICAN PAYOUT SETUP */}
        {activeTab === 'payouts' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-art-gold" />
                    <span>Pan-African Settlement Payout Routing</span>
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Select your preferred regional payout channel for {artistPayoutPercentage}% net settlement on sold artworks.
                  </p>
                </div>

                <form onSubmit={handleSavePayouts} className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Payout Channel Type *</label>
                    <select
                      value={payoutForm.payoutType}
                      onChange={e => {
                        const t = e.target.value;
                        setPayoutForm({
                          ...payoutForm,
                          payoutType: t,
                          bankOrProvider: t === 'nigeria_bank' ? 'Wema Bank PLC' : t === 'ghana_momo' ? 'MTN Mobile Money Ghana' : t === 'sa_eft' ? 'Standard Bank SA' : 'Safaricom M-Pesa',
                          currency: t === 'nigeria_bank' ? 'NGN' : t === 'ghana_momo' ? 'GHS' : t === 'sa_eft' ? 'ZAR' : 'KES'
                        });
                      }}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                    >
                      <option value="nigeria_bank">🇳🇬 Nigerian Commercial Bank (NGN - Instant Wema Rail)</option>
                      <option value="ghana_momo">🇬🇭 Ghana Mobile Money (GHS - MTN / Vodafone / Telecel)</option>
                      <option value="sa_eft">🇿🇦 South Africa Electronic Funds Transfer (ZAR - EFT)</option>
                      <option value="kenya_mpesa">🇰🇪 Kenya Mobile Money (KES - Safaricom M-Pesa)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Account Holder / Studio Name *</label>
                    <input
                      type="text"
                      required
                      value={payoutForm.accountName}
                      onChange={e => setPayoutForm({ ...payoutForm, accountName: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Bank / Telco Provider *</label>
                      <input
                        type="text"
                        required
                        value={payoutForm.bankOrProvider}
                        onChange={e => setPayoutForm({ ...payoutForm, bankOrProvider: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Account / Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={payoutForm.accountNumber}
                        onChange={e => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider text-xs shadow-md transition cursor-pointer"
                  >
                    Save Pan-African Payout Profile
                  </button>
                </form>
              </div>

              <div className="lg:col-span-5 p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 text-xs">
                <h4 className="font-serif text-sm font-bold text-art-gold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Settlement SLA & Liquidity Guarantee</span>
                </h4>
                <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
                  <li>• <strong>Nigeria:</strong> Automated instant credit via WEMA Corporate API within 2 hours of delivery sign-off.</li>
                  <li>• <strong>Ghana MoMo:</strong> Direct MTN/Vodafone automated mobile wallet transfer in GHS.</li>
                  <li>• <strong>South Africa & Kenya:</strong> Same-day local currency settlement via EFT / M-Pesa.</li>
                  <li>• <strong>Fiduciary Protection:</strong> Funds held in tier-1 bank custody until patron delivery sign-off.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
