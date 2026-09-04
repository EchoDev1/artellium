'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Video, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Film, 
  Plus, 
  ExternalLink, 
  UserCheck, 
  Eye, 
  Sparkles,
  X,
  RotateCcw,
  Check
} from 'lucide-react';

export default function AdminVideoModeration() {
  const { 
    videos = [], 
    approveVideo, 
    rejectVideo, 
    deleteVideo, 
    addVideo,
    heroConfig,
    updateHeroConfig
  } = useStore();

  const maxSlides = typeof heroConfig?.maxHeroSlides === 'number' ? heroConfig.maxHeroSlides : 4;

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [selectedPreviewVideo, setSelectedPreviewVideo] = useState(null);
  const [isDirectAddOpen, setIsDirectAddOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Unverified identity or did not meet platform guidelines');
  const [actionNotice, setActionNotice] = useState('');
  const [directVideoFileMeta, setDirectVideoFileMeta] = useState(null);

  // Form state for direct admin add
  const [directForm, setDirectForm] = useState({
    artistName: '',
    artistTitle: '',
    country: 'Nigeria',
    countryFlag: '🇳🇬',
    city: 'Lagos',
    thumbnail: '',
    videoUrl: '',
    quote: '',
    duration: '1:30',
  });

  const handleUpdateMaxSlides = (newCount) => {
    if (typeof updateHeroConfig === 'function') {
      updateHeroConfig({ maxHeroSlides: newCount });
    }
    setActionNotice(`Hero carousel capacity updated to ${newCount}! (Now rotating up to ${newCount} slides on the homepage)`);
    setTimeout(() => setActionNotice(''), 5000);
  };

  const handleDirectVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, WebM, MOV) from your device gallery.');
      return;
    }

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const objectUrl = URL.createObjectURL(file);
    setDirectVideoFileMeta({
      name: file.name,
      sizeMB,
      type: file.type
    });
    setDirectForm(prev => ({
      ...prev,
      videoUrl: objectUrl,
      thumbnail: prev.thumbnail || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600'
    }));
  };

  const pendingVideos = videos.filter((v) => v.status === 'pending');
  const approvedVideos = videos.filter((v) => v.status === 'approved');
  const rejectedVideos = videos.filter((v) => v.status === 'rejected');

  const displayedVideos = 
    activeTab === 'pending' ? pendingVideos :
    activeTab === 'approved' ? approvedVideos :
    activeTab === 'rejected' ? rejectedVideos : videos;

  const handleApprove = (id, artistName) => {
    approveVideo(id);
    setActionNotice(`Approved! Video by "${artistName}" is now streaming live on the Homepage Hero!`);
    setTimeout(() => setActionNotice(''), 5000);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectingId) return;
    const target = videos.find(v => v.id === rejectingId);
    rejectVideo(rejectingId, rejectionReason);
    setActionNotice(`Submission by "${target?.artistName || 'Artist'}" has been rejected and taken off the queue.`);
    setRejectingId(null);
    setRejectionReason('Unverified identity or did not meet platform guidelines');
    setTimeout(() => setActionNotice(''), 5000);
  };

  const handleDirectAddSubmit = (e) => {
    e.preventDefault();
    if (!directForm.artistName || !directForm.videoUrl) {
      alert('Please select a video file from your device gallery before publishing.');
      return;
    }

    addVideo({
      ...directForm,
      status: 'approved',
      videoFileName: directVideoFileMeta?.name || 'admin_video.mp4',
      videoSizeMB: directVideoFileMeta?.sizeMB || '0',
    });

    setActionNotice(`Master video by "${directForm.artistName}" published directly from gallery to the Hero slider!`);
    setDirectVideoFileMeta(null);
    setDirectForm({
      artistName: '',
      artistTitle: '',
      country: 'Nigeria',
      countryFlag: '🇳🇬',
      city: 'Lagos',
      thumbnail: '',
      videoUrl: '',
      quote: '',
      duration: '1:30',
    });
    setIsDirectAddOpen(false);
    setTimeout(() => setActionNotice(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-mono font-bold uppercase border border-amber-200">
            <Film className="w-3.5 h-3.5 text-amber-700" />
            <span>HOMEPAGE HERO CURATION & ANTI-IMPERSONATION OVERSIGHT</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Artist Story Videos & Moderation Portal
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Review incoming 1–2 minute artist video stories. Verify identity, inspect video content for safety, and approve or reject submissions. Only approved videos rotate live on the homepage Hero.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDirectAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Direct Publish Video</span>
          </button>
        </div>
      </div>

      {/* Hero Carousel Slide Capacity Controller */}
      <div className="bg-slate-900 border border-art-gold/40 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-art-gold/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-art-gold text-xs font-mono font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-art-gold animate-ping" />
            <span>HERO SLIDE CAPACITY CONTROLLER</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-white">
            Homepage Hero Video Slide Count
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Increase or decrease the amount of approved artist video slides that rotate on the Homepage Hero carousel. Currently set to rotate up to <strong className="text-art-gold">{maxSlides} slides</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/60 px-5 py-3 rounded-2xl border border-white/15 relative z-10 shrink-0">
          <span className="text-xs font-mono text-slate-300 font-semibold uppercase">Slide Limit:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleUpdateMaxSlides(Math.max(1, maxSlides - 1))}
              disabled={maxSlides <= 1}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-white flex items-center justify-center transition cursor-pointer text-base"
              title="Decrease hero slide count"
            >
              -
            </button>
            <span className="font-mono text-xl font-black text-art-gold min-w-[3rem] text-center">
              {maxSlides}
            </span>
            <button
              type="button"
              onClick={() => handleUpdateMaxSlides(Math.min(20, maxSlides + 1))}
              disabled={maxSlides >= 20}
              className="w-9 h-9 rounded-xl bg-art-gold/25 hover:bg-art-gold/40 text-art-gold font-bold flex items-center justify-center transition border border-art-gold/50 cursor-pointer text-base"
              title="Increase hero slide count"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Total Submissions</span>
            <span className="font-serif text-2xl font-black text-slate-900">{videos.length}</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm flex items-center gap-3 ${
          pendingVideos.length > 0 
            ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/50' 
            : 'bg-white border-slate-200'
        }`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            pendingVideos.length > 0 ? 'bg-amber-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
          }`}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-900 uppercase block font-semibold">Pending Review</span>
            <span className="font-serif text-2xl font-black text-amber-900">
              {pendingVideos.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Live on Hero</span>
            <span className="font-serif text-2xl font-black text-emerald-700">{approvedVideos.length}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase block font-semibold">Rejected / Impersonation</span>
            <span className="font-serif text-2xl font-black text-red-700">{rejectedVideos.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review Queue</span>
            {pendingVideos.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-amber-800 text-[10px] font-black">
                {pendingVideos.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Live on Hero ({approvedVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-red-700 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected Archive ({rejectedVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>All Submissions ({videos.length})</span>
          </button>
        </div>

        {/* Live Hero Link */}
        <Link
          href="/"
          target="_blank"
          className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1.5 hover:underline"
        >
          <span>View Live Hero Carousel</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Video Dossiers Grid */}
      {displayedVideos.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-800">
            {activeTab === 'pending' ? 'No Pending Submissions' : 'No Videos Found in this Category'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {activeTab === 'pending' 
              ? 'All artist videos have been reviewed and verified. New submissions from artists will appear here for security and authenticity checks.'
              : 'You can directly add or test a new artist video using the "+ Direct Publish Video" button above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedVideos.map((vid) => {
            const isPending = vid.status === 'pending';
            const isApproved = vid.status === 'approved';
            const isRejected = vid.status === 'rejected';

            return (
              <div
                key={vid.id}
                className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition hover:shadow-md ${
                  isPending ? 'border-amber-300 ring-1 ring-amber-300' : 
                  isApproved ? 'border-slate-200' : 'border-red-200 opacity-90'
                }`}
              >
                {/* Card Media Preview Header */}
                <div className="relative aspect-video w-full bg-black overflow-hidden group">
                  {vid.videoUrl?.includes('youtube') || vid.videoUrl?.includes('youtu.be') ? (
                    <iframe
                      src={`${vid.videoUrl.replace('watch?v=', 'embed/')}?autoplay=0`}
                      title={vid.artistName}
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      src={vid.videoUrl}
                      poster={vid.thumbnail}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Top Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase shadow-sm pointer-events-auto ${
                      isApproved ? 'bg-emerald-700 text-white' :
                      isPending ? 'bg-amber-600 text-white animate-pulse' :
                      'bg-red-700 text-white'
                    }`}>
                      {isApproved ? '● LIVE ON HERO' : isPending ? '⏳ PENDING REVIEW' : '✕ REJECTED'}
                    </span>

                    <span className="bg-black/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-mono pointer-events-auto">
                      ⏱ {vid.duration || '1:30'}
                    </span>
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{vid.artistName}</span>
                          <span className="text-xs font-mono font-normal text-slate-500">
                            ({vid.countryFlag || '🌍'} {vid.city ? `${vid.city}, ${vid.country}` : vid.country})
                          </span>
                        </h3>
                        <p className="text-xs text-amber-800 font-semibold font-sans">
                          {vid.artistTitle}
                        </p>
                      </div>

                      {vid.priceNGN && (
                        <span className="font-serif text-sm font-black text-slate-800 text-right shrink-0">
                          ₦{vid.priceNGN.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {vid.artworkTitle && (
                      <p className="text-xs text-slate-600">
                        Featured Masterpiece: <strong className="text-slate-900 font-serif">"{vid.artworkTitle}"</strong>
                      </p>
                    )}

                    {vid.quote && (
                      <blockquote className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border-l-2 border-amber-600 line-clamp-3 leading-relaxed">
                        &ldquo;{vid.quote}&rdquo;
                      </blockquote>
                    )}

                    {isRejected && vid.rejectionReason && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                        <span className="font-bold block">Rejection Rationale:</span>
                        <span>{vid.rejectionReason}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                      {vid.submittedAt && (
                        <span>Submitted: {new Date(vid.submittedAt).toLocaleDateString()}</span>
                      )}
                      {vid.artistEmail && (
                        <span className="truncate">Email: {vid.artistEmail}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedPreviewVideo(vid)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Preview</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => setRejectingId(vid.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>

                          <button
                            onClick={() => handleApprove(vid.id, vid.artistName)}
                            className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve for Hero</span>
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <>
                          <button
                            onClick={() => setRejectingId(vid.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="Take down from hero"
                          >
                            <span>Unpublish</span>
                          </button>
                        </>
                      )}

                      {isRejected && (
                        <button
                          onClick={() => handleApprove(vid.id, vid.artistName)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reconsider & Approve</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Permanently delete video record for ${vid.artistName}?`)) {
                            deleteVideo(vid.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete video record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-700 font-bold font-serif text-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>Reject Video Submission</span>
              </div>
              <button onClick={() => setRejectingId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Provide a reason for rejection. This prevents malicious impersonators and maintains high-integrity physical provenance.
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Rejection</label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <option value="Unverified identity or did not meet platform guidelines">Unverified identity / Potential impersonation</option>
                  <option value="Audio or video quality is below museum showcase standards">Audio / Video quality below standards</option>
                  <option value="Content is off-topic or contains illicit/abusive material">Off-topic or abusive material</option>
                  <option value="Artwork discussed is not registered in Artellium catalog">Artwork discussed not registered</option>
                  <option value="Video duration exceeds the 1–2 minute format">Video duration exceeds 1-2 min format</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional internal notes for audit ledger..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-red-700 text-white hover:bg-red-800 shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Add Video Modal */}
      {isDirectAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold font-serif text-lg">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>Admin Direct Publish to Hero</span>
              </div>
              <button onClick={() => setIsDirectAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDirectAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Artist Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Bakare Ogundele"
                  value={directForm.artistName}
                  onChange={(e) => setDirectForm({ ...directForm, artistName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Title / Craft</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Wood Carver"
                    value={directForm.artistTitle}
                    onChange={(e) => setDirectForm({ ...directForm, artistTitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Country & Flag</label>
                  <input
                    type="text"
                    placeholder="e.g. Nigeria 🇳🇬"
                    value={directForm.country}
                    onChange={(e) => setDirectForm({ ...directForm, country: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Video Upload from Gallery Only (No External Links) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Artist Video from Gallery (No Links Allowed) *
                </label>

                {directForm.videoUrl ? (
                  <div className="p-3 rounded-xl bg-slate-900 text-white border border-art-gold/40 space-y-2">
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black border border-white/10">
                      <video
                        src={directForm.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-mono text-art-gold font-bold block truncate max-w-[200px]">
                          🎬 {directVideoFileMeta?.name || 'Selected Video File'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {directVideoFileMeta?.sizeMB ? `${directVideoFileMeta.sizeMB} MB` : 'Gallery Video Ready'}
                        </span>
                      </div>

                      <label className="px-2.5 py-1 rounded-lg bg-art-gold/20 hover:bg-art-gold/30 text-art-gold border border-art-gold/50 cursor-pointer font-bold transition text-[11px]">
                        <span>Change Video</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleDirectVideoFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/50 transition cursor-pointer group">
                    <Video className="w-8 h-8 text-slate-400 group-hover:text-amber-600 mb-2 transition" />
                    <span className="font-bold text-slate-800 text-xs mb-0.5">
                      Click to Select Video from Device Gallery
                    </span>
                    <span className="text-[10px] text-slate-500 text-center">
                      MP4, WebM, MOV (Max 150MB) · Gallery Upload Only
                    </span>
                    <input
                      type="file"
                      accept="video/*"
                      required
                      onChange={handleDirectVideoFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thumbnail / Poster Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or leave blank"
                  value={directForm.thumbnail}
                  onChange={(e) => setDirectForm({ ...directForm, thumbnail: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 1:45"
                  value={directForm.duration}
                  onChange={(e) => setDirectForm({ ...directForm, duration: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Artist Statement / Philosophy Quote</label>
                <textarea
                  rows={2}
                  placeholder="Brief quote explaining their artwork and platform thoughts..."
                  value={directForm.quote}
                  onChange={(e) => setDirectForm({ ...directForm, quote: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDirectAddOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-amber-700 text-white hover:bg-amber-800 shadow-sm"
                >
                  Publish Directly to Hero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {selectedPreviewVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0E14] text-white rounded-3xl max-w-3xl w-full overflow-hidden border border-art-gold/40 shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <h3 className="font-serif text-lg font-bold">
                {selectedPreviewVideo.artistName} — {selectedPreviewVideo.artworkTitle}
              </h3>
              <button onClick={() => setSelectedPreviewVideo(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              {selectedPreviewVideo.videoUrl?.includes('youtube') || selectedPreviewVideo.videoUrl?.includes('youtu.be') ? (
                <iframe
                  src={`${selectedPreviewVideo.videoUrl.replace('watch?v=', 'embed/')}?autoplay=1`}
                  title={selectedPreviewVideo.artistName}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : (
                <video
                  src={selectedPreviewVideo.videoUrl}
                  poster={selectedPreviewVideo.thumbnail}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="p-4 space-y-2 text-xs">
              <p className="italic text-slate-300">&ldquo;{selectedPreviewVideo.quote}&rdquo;</p>
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-slate-400 font-mono">
                <span>Country: {selectedPreviewVideo.country}</span>
                <span>Status: <strong className="uppercase text-amber-400">{selectedPreviewVideo.status}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
