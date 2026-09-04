'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Video, 
  Play, 
  Sparkles, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  Globe, 
  X, 
  Quote, 
  Film, 
  Plus, 
  Trash2 
} from 'lucide-react';

export default function ArtistVoicesPage() {
  const { videos, addVideo, deleteVideo, submitArtistVideo, currentUser } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isAdminAddOpen, setIsAdminAddOpen] = useState(false);
  const [newVideoForm, setNewVideoForm] = useState({
    artistName: '',
    artistTitle: '',
    country: '',
    artworkTitle: '',
    thumbnail: '',
    videoUrl: '',
    quote: '',
    duration: '1:30',
  });

  const handleCreateVideo = (e) => {
    e.preventDefault();
    if (!newVideoForm.artistName || !newVideoForm.videoUrl) return;

    if (currentUser?.role === 'admin') {
      addVideo({ ...newVideoForm, status: 'approved' });
      alert(`Master video for "${newVideoForm.artistName}" published directly!`);
    } else {
      submitArtistVideo({ ...newVideoForm, status: 'pending' });
      alert('Your 1–2 minute video story has been submitted for Admin Review! Once approved, it will be published to the Homepage Hero.');
    }

    setNewVideoForm({
      artistName: '',
      artistTitle: '',
      country: '',
      artworkTitle: '',
      thumbnail: '',
      videoUrl: '',
      quote: '',
      duration: '1:30',
    });
    setIsAdminAddOpen(false);
  };

  const filteredVideos = (videos || [])
    .filter(vid => currentUser?.role === 'admin' || vid.status === 'approved')
    .filter(vid => {
      if (selectedCategory === 'All') return true;
      return vid.country?.toLowerCase().includes(selectedCategory.toLowerCase()) || 
             vid.artistTitle?.toLowerCase().includes(selectedCategory.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-[#07080A] text-slate-100 pb-24">
      
      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#0E121A] border border-art-gold/40 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#090C12]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-art-gold/20 flex items-center justify-center text-art-gold font-bold">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">{selectedVideo.artistName}</h3>
                  <p className="text-xs text-art-gold font-medium">{selectedVideo.artistTitle} · {selectedVideo.country}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video w-full bg-black">
              {selectedVideo.videoUrl && selectedVideo.videoUrl.includes('youtube') ? (
                <iframe
                  src={selectedVideo.videoUrl.replace('watch?v=', 'embed/')}
                  title={selectedVideo.artistName}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedVideo.videoUrl ? (
                <video
                  src={selectedVideo.videoUrl}
                  poster={selectedVideo.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4 bg-gradient-to-b from-[#151B26] to-[#0A0D14]">
                  <Film className="w-16 h-16 text-art-gold animate-pulse" />
                  <div className="max-w-md space-y-2">
                    <h4 className="font-serif text-xl font-bold text-white">Studio Documentary Session</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      &ldquo;{selectedVideo.quote}&rdquo;
                    </p>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-art-gold/15 text-art-gold font-mono text-xs font-bold border border-art-gold/30">
                    Artellium Master Archives · {selectedVideo.duration}
                  </span>
                </div>
              )}
            </div>

            {/* Video Footer Info */}
            <div className="p-5 sm:p-6 bg-[#090C12] border-t border-white/10 space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 block font-bold">
                Featured Artwork In Focus: <strong className="text-white">{selectedVideo.artworkTitle}</strong>
              </span>
              <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
                &ldquo;{selectedVideo.quote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Modal */}
      {isAdminAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0E121A] border border-art-gold/40 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-serif text-xl font-bold text-white">Add Master Artist Video</h3>
              <button onClick={() => setIsAdminAddOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateVideo} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Artist Name</label>
                <input
                  type="text"
                  required
                  value={newVideoForm.artistName}
                  onChange={e => setNewVideoForm({ ...newVideoForm, artistName: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none"
                  placeholder="e.g. Kofi Mensah"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Artist Title & Craft</label>
                <input
                  type="text"
                  required
                  value={newVideoForm.artistTitle}
                  onChange={e => setNewVideoForm({ ...newVideoForm, artistTitle: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none"
                  placeholder="e.g. Master Painter & Gold Leaf Specialist"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={newVideoForm.country}
                    onChange={e => setNewVideoForm({ ...newVideoForm, country: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none"
                    placeholder="e.g. Ghana 🇬🇭"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Discussing Artwork</label>
                  <input
                    type="text"
                    required
                    value={newVideoForm.artworkTitle}
                    onChange={e => setNewVideoForm({ ...newVideoForm, artworkTitle: e.target.value })}
                    className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none"
                    placeholder="e.g. The Ancestral Horizon"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={newVideoForm.thumbnail}
                  onChange={e => setNewVideoForm({ ...newVideoForm, thumbnail: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Video Stream / YouTube URL</label>
                <input
                  type="text"
                  required
                  value={newVideoForm.videoUrl}
                  onChange={e => setNewVideoForm({ ...newVideoForm, videoUrl: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Spiritual Quote / Philosophy</label>
                <textarea
                  rows={3}
                  value={newVideoForm.quote}
                  onChange={e => setNewVideoForm({ ...newVideoForm, quote: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none"
                  placeholder="The spiritual origins behind the work..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-art-gold text-art-black font-bold font-serif uppercase tracking-wider rounded-xl hover:brightness-110 transition shadow-gold-glow"
              >
                Publish Master Video
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative bg-gradient-to-b from-[#1C1404] via-[#0E0B02] to-[#07080A] border-b border-art-gold/30 pt-12 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-art-gold/15 border border-art-gold/40 text-art-gold text-xs font-mono font-bold tracking-widest uppercase">
                <Video className="w-4 h-4 text-art-gold" />
                <span>SPOTLIGHT VOICES & PROVENANCE ARCHIVE</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
                Voices of Master Artists
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                Watch master African painters, sculptors, and digital creators speak directly about the spiritual origins, lost-wax casting techniques, sacred carvings, and personal philosophies behind their works.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/artist/dashboard"
                className="flex items-center gap-2 bg-[#1C1405] hover:bg-[#2A1D08] border border-art-gold/50 text-art-gold font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-xl transition shadow-sm shrink-0"
              >
                <Film className="w-4 h-4 text-art-gold" />
                <span>Submit 1–2 Min Story</span>
              </Link>

              {/* Admin Add Video Trigger */}
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => setIsAdminAddOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition shadow-gold-glow shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Master Video</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-4 border-t border-white/10 text-xs scrollbar-none">
            {['All', 'Ghana', 'Nigeria', 'Painter', 'Sculptor', 'Carver'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedCategory(tag)}
                className={`px-4 py-2 rounded-xl font-medium tracking-wide transition shrink-0 cursor-pointer ${
                  selectedCategory === tag
                    ? 'bg-art-gold text-art-black font-bold shadow-lg shadow-art-gold/20 border border-amber-300'
                    : 'bg-[#141722] text-slate-300 hover:bg-[#1C2230] border border-white/10'
                }`}
              >
                {tag === 'All' ? 'All Master Voices' : tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              className="group relative rounded-3xl overflow-hidden bg-[#0D1017] border border-white/10 hover:border-art-gold/60 transition-all duration-300 shadow-2xl flex flex-col justify-between hover:-translate-y-1.5"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={vid.thumbnail || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600'}
                  alt={vid.artistName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-black/30 to-transparent" />

                {/* Play Button Overlay */}
                <button
                  onClick={() => setSelectedVideo(vid)}
                  className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition transform cursor-pointer"
                  aria-label={`Play documentary by ${vid.artistName}`}
                >
                  <div className="w-14 h-14 rounded-full bg-art-gold text-art-black flex items-center justify-center shadow-gold-glow group-hover:bg-amber-300 transition">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </button>

                {/* Video Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-white/10">
                  {vid.duration}
                </span>

                {/* Country Tag */}
                <span className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                  {vid.country}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-art-gold transition-colors">
                      {vid.artistName}
                    </h3>
                    <UserCheck className="w-4 h-4 text-art-gold shrink-0" />
                  </div>
                  <p className="text-xs text-art-gold font-medium mb-3">
                    {vid.artistTitle}
                  </p>

                  <blockquote className="text-xs italic text-slate-300 border-l-2 border-art-gold/50 pl-3 py-1 mb-4 line-clamp-3 font-serif">
                    &ldquo;{vid.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <span className="text-slate-400 font-medium truncate max-w-[180px]">
                    Discussing: <strong className="text-slate-200">{vid.artworkTitle}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVideo(vid)}
                      className="text-art-gold font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Watch Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Admin Delete */}
                    {currentUser?.role === 'admin' && (
                      <button
                        onClick={() => deleteVideo(vid.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete video (Admin)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
