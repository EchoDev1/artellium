'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { Sparkles, Flame, ArrowRight, ShieldCheck, Award, Crown, Play, Pause, Volume2, VolumeX, Video as VideoIcon, Image as ImageIcon } from 'lucide-react';

export default function HeroBanner() {
  const { heroConfig } = useStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const cfg = heroConfig || {
    badgeText: 'AFRICAN ROYALTY MEETS GLOBAL FINE ART COMMERCE',
    titleLine1: "The World's Premier",
    titleHighlight: 'Pan-African Fine Art',
    titleLine2: '& Auction House',
    description: 'Connecting elite African painters, bronze sculptors, and digital creators with global collectors, museums, and investors. Structured with verified settlement authenticity and museum-grade freight.',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoPoster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
    featuredLot: {
      badge: 'LOT OF THE MONTH',
      title: 'The Ancestral Horizon',
      artist: 'Kofi Mensah (Ghana)',
      price: '₦1,850,000',
      medium: 'Oil & 24K Gold Leaf on Canvas',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
      isVisible: true
    },
    primaryCta: { label: 'Explore Catalog', href: '/explore', isVisible: true },
    secondaryCta: { label: 'Enter Live Auction', href: '/auctions', isVisible: true },
    tertiaryCta: { label: 'Artist Onboarding (₦30k - ₦50k/mo)', href: '/artist/register', isVisible: true },
    stats: [
      { id: 'stat-1', label: 'Fine Art Transacted', value: '₦4.5B+', color: 'gold' },
      { id: 'stat-2', label: 'Verified Masterpieces', value: '1,200+', color: 'white' },
      { id: 'stat-3', label: 'African Nations Represented', value: '54', color: 'emerald' }
    ]
  };

  const isVideo = cfg.mediaType === 'video' || (cfg.videoUrl && cfg.heroType === 'video_showcase');
  const lot = cfg.featuredLot || {};

  // Check if video is YouTube embed, mp4, etc.
  const isEmbedVideo = cfg.videoUrl && (cfg.videoUrl.includes('youtube') || cfg.videoUrl.includes('youtu.be') || cfg.videoUrl.includes('vimeo'));

  return (
    <section className="relative w-full overflow-hidden bg-art-black py-12 lg:py-20 border-b border-art-gold/20">
      {/* Background Glow Overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-art-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-art-green/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text & CTA Content */}
          <div className="lg:col-span-7 space-y-6">
            {cfg.badgeText && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-art-gold/10 border border-art-gold/40 text-art-gold text-xs font-semibold tracking-wide">
                <Crown className="w-4 h-4 text-art-gold" />
                <span>{cfg.badgeText}</span>
              </div>
            )}

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-wide">
              {cfg.titleLine1 || "The World's Premier"} <br />
              <span className="gold-text-gradient">{cfg.titleHighlight || "Pan-African Fine Art"}</span> <br />
              {cfg.titleLine2 || "& Auction House"}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              {cfg.description || "Connecting elite African painters, bronze sculptors, and digital creators with global collectors, museums, and investors."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              {cfg.primaryCta?.isVisible !== false && cfg.primaryCta?.label && (
                <Link
                  href={cfg.primaryCta.href || '/explore'}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-art-gold via-[#9E7720] to-art-gold-dark hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition shadow-gold-glow flex items-center gap-2"
                >
                  <span>{cfg.primaryCta.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {cfg.secondaryCta?.isVisible !== false && cfg.secondaryCta?.label && (
                <Link
                  href={cfg.secondaryCta.href || '/auctions'}
                  className="px-6 py-3.5 rounded-xl bg-art-black-card hover:bg-art-black border border-art-red/50 text-red-400 font-bold text-xs uppercase tracking-wider transition shadow-crimson-glow flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>{cfg.secondaryCta.label}</span>
                </Link>
              )}

              {cfg.tertiaryCta?.isVisible !== false && cfg.tertiaryCta?.label && (
                <Link
                  href={cfg.tertiaryCta.href || '/artist/register'}
                  className="px-6 py-3.5 rounded-xl bg-art-green/30 hover:bg-art-green/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider transition"
                >
                  <span>{cfg.tertiaryCta.label}</span>
                </Link>
              )}
            </div>

            {/* Quick Metrics Bar */}
            {cfg.stats && cfg.stats.length > 0 && (
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-slate-300">
                {cfg.stats.map((stat, idx) => (
                  <div key={stat.id || idx}>
                    <span className={`font-serif text-2xl sm:text-3xl font-bold block ${
                      stat.color === 'emerald' ? 'text-emerald-400' :
                      stat.color === 'white' ? 'text-white' : 'text-art-gold'
                    }`}>
                      {stat.value}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase font-medium">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Media (Video Player OR High-Res Photo / Lot Feature) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden glass-card-gold p-3 shadow-2xl border border-art-gold/50 group">
              
              {/* If Video Mode is active */}
              {isVideo ? (
                <div className="relative aspect-[4/5] sm:aspect-video lg:aspect-[4/5] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                  {isEmbedVideo ? (
                    <iframe
                      src={`${cfg.videoUrl}?autoplay=1&mute=1&loop=1&controls=1`}
                      title="Hero Spotlight Video"
                      className="w-full h-full object-cover rounded-xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={cfg.videoUrl || cfg.mediaUrl}
                      poster={cfg.videoPoster || cfg.mediaUrl}
                      autoPlay={cfg.videoAutoplay !== false}
                      muted={isMuted}
                      loop={cfg.videoLoop !== false}
                      playsInline
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )}

                  {/* Video Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-art-gold/40 text-art-gold font-serif text-xs font-bold flex items-center gap-1.5 shadow-gold-glow pointer-events-none">
                    <VideoIcon className="w-3.5 h-3.5 text-art-gold animate-pulse" />
                    <span>HERO VIDEO SPOTLIGHT</span>
                  </div>

                  {/* Artwork / Video Overlay Title */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-art-black-card/90 backdrop-blur-md border border-white/10">
                    <span className="text-[10px] text-art-gold font-mono uppercase tracking-widest block mb-1">
                      {lot.medium || 'Cinema Video Showcase'}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white mb-0.5">
                      {lot.title || cfg.titleHighlight || 'African Heritage Masterpiece'}
                    </h3>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                      <span className="text-slate-300">{lot.artist || 'Curated Atelier Feature'}</span>
                      {lot.price && <span className="font-serif text-art-gold font-bold text-sm">{lot.price}</span>}
                    </div>
                  </div>
                </div>
              ) : (
                /* High-Res Photo / Artwork Lot Display */
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black">
                  <img
                    src={cfg.mediaUrl || lot.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000'}
                    alt={lot.title || 'Featured Artwork'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-art-black via-art-black/20 to-transparent" />

                  {/* Floating Badge */}
                  <div className="absolute top-4 left-4 bg-art-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-art-gold/40 text-art-gold font-serif text-xs font-bold flex items-center gap-1.5 shadow-gold-glow">
                    <Award className="w-4 h-4 text-art-gold" />
                    <span>{lot.badge || 'LOT OF THE MONTH'}</span>
                  </div>

                  {/* Artwork Title & Artist Overlay */}
                  {lot.isVisible !== false && (
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-art-black-card/90 backdrop-blur-md border border-white/10">
                      <span className="text-[10px] text-art-gold font-mono uppercase tracking-widest block mb-1">
                        {lot.medium || 'Oil & 24K Gold Leaf on Canvas'}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-white mb-0.5">
                        {lot.title || 'The Ancestral Horizon'}
                      </h3>
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                        <span className="text-slate-300">By {lot.artist || 'Kofi Mensah (Ghana)'}</span>
                        <span className="font-serif text-art-gold font-bold text-sm">{lot.price || '₦1,850,000'}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

