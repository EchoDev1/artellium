'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { Play, Video, Plus, Trash2, X, Sparkles, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ArtistVideoModal() {
  const { videos, addVideo, deleteVideo, currentUser } = useStore();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isAdminAddOpen, setIsAdminAddOpen] = useState(false);

  // New Video Form state for Admin
  const [newVideoForm, setNewVideoForm] = useState({
    artistName: '',
    artistTitle: '',
    country: '',
    artworkTitle: '',
    thumbnail: '',
    videoUrl: '',
    quote: '',
    duration: '3:30',
  });

  const handleAddVideoSubmit = (e) => {
    e.preventDefault();
    if (!newVideoForm.artistName || !newVideoForm.videoUrl) return;

    addVideo(newVideoForm);
    setNewVideoForm({
      artistName: '',
      artistTitle: '',
      country: '',
      artworkTitle: '',
      thumbnail: '',
      videoUrl: '',
      quote: '',
      duration: '3:30',
    });
    setIsAdminAddOpen(false);
  };

  return (
    <section className="relative w-full py-16 border-t border-b border-art-gold/30 overflow-hidden bg-[#07080A]">
      {/* Full Section Background Graphic Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/voices-of-master-artists-bg.jpg')" }}
      />
      {/* Cinematic Vignette Overlay to ensure perfect contrast and text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07080A]/80 via-[#07080A]/60 to-[#07080A]/85 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-art-gold/10 text-art-gold border border-art-gold/30">
                <Video className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-art-gold tracking-widest uppercase">
                SPOTLIGHT VOICES & PROVENANCE
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-wide">
              Voices of Master Artists
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Watch master African painters, sculptors, and digital creators speak directly about the spiritual origins, techniques, and stories behind their works.
            </p>
          </div>

          {/* View More Full Page Link */}
          <Link
            href="/artist-voices"
            className="flex items-center gap-2 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-gold-glow cursor-pointer shrink-0"
          >
            <span>View More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="group relative rounded-2xl overflow-hidden glass-card-gold hover:border-art-gold transition duration-300 transform hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={vid.thumbnail || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600'}
                  alt={vid.artistName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-art-black via-art-black/30 to-transparent" />

                {/* Play Button Overlay */}
                <button
                  onClick={() => setSelectedVideo(vid)}
                  className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition transform"
                  aria-label={`Play video by ${vid.artistName}`}
                >
                  <div className="w-14 h-14 rounded-full bg-art-gold/90 text-art-black flex items-center justify-center shadow-gold-glow group-hover:bg-art-gold transition">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </button>

                {/* Video Duration Badge */}
                <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-white/10">
                  {vid.duration}
                </span>

                {/* Country Tag */}
                <span className="absolute top-3 left-3 bg-art-green/90 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  {vid.country}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-art-gold transition">
                      {vid.artistName}
                    </h3>
                    <UserCheck className="w-4 h-4 text-art-gold shrink-0" />
                  </div>
                  <p className="text-xs text-art-gold font-medium mb-3">
                    {vid.artistTitle}
                  </p>

                  <blockquote className="text-xs italic text-slate-300 border-l-2 border-art-gold/50 pl-3 py-0.5 mb-4 line-clamp-3">
                    "{vid.quote}"
                  </blockquote>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <span className="text-slate-400 font-medium truncate max-w-[180px]">
                    Discussing: <strong className="text-slate-200">{vid.artworkTitle}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedVideo(vid)}
                      className="text-art-gold font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Watch Story</span>
                    </button>

                    {/* Admin Delete Video */}
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

      {/* Pop-up Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-art-black-card border border-art-gold/40 rounded-2xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-art-black border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-art-gold" />
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white line-clamp-1">
                    {selectedVideo.artistName} — {selectedVideo.artworkTitle}
                  </h3>
                  <p className="text-xs text-art-gold font-medium">
                    {selectedVideo.artistTitle} ({selectedVideo.country})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-video w-full bg-black overflow-y-auto">
              {selectedVideo.videoUrl.includes('youtube.com') || selectedVideo.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={`${selectedVideo.videoUrl}?autoplay=1`}
                  title={selectedVideo.artistName}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-8 text-center">
                  <Play className="w-16 h-16 text-art-gold mb-4 animate-bounce" />
                  <p className="text-white font-serif text-xl font-bold mb-2">
                    Playing: {selectedVideo.artistName} Video Feature
                  </p>
                  <p className="text-slate-400 text-sm max-w-md italic mb-4">
                    "{selectedVideo.quote}"
                  </p>
                  <p className="text-xs text-art-gold font-mono">
                    Video Source: {selectedVideo.videoUrl}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Add Video Modal */}
      {isAdminAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-art-black-card border border-art-gold/40 rounded-2xl p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto pb-12 sm:pb-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-art-gold font-serif font-bold text-lg">
                <ShieldCheck className="w-5 h-5" />
                <span>Admin: Add Artist Spotlight Video</span>
              </div>
              <button
                onClick={() => setIsAdminAddOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideoSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Artist Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Bakare Ogundele"
                  value={newVideoForm.artistName}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, artistName: e.target.value })}
                  className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Title / Discipline</label>
                  <input
                    type="text"
                    placeholder="e.g. Master Wood Carver"
                    value={newVideoForm.artistTitle}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, artistTitle: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Nigeria"
                    value={newVideoForm.country}
                    onChange={(e) => setNewVideoForm({ ...newVideoForm, country: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Artwork Featured</label>
                <input
                  type="text"
                  placeholder="e.g. The Solitary Mask of Oyo"
                  value={newVideoForm.artworkTitle}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, artworkTitle: e.target.value })}
                  className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Video URL / YouTube Embed</label>
                <input
                  type="url"
                  required
                  placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                  value={newVideoForm.videoUrl}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, videoUrl: e.target.value })}
                  className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={newVideoForm.thumbnail}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, thumbnail: e.target.value })}
                  className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Artist Quote / Statement</label>
                <textarea
                  rows="2"
                  placeholder="Enter a brief quote from the artist..."
                  value={newVideoForm.quote}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, quote: e.target.value })}
                  className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminAddOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold rounded-lg shadow-gold-glow"
                >
                  Publish Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
