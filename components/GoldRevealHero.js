'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@/context/store-context';
import { Volume2, VolumeX, Sparkles, Play, ShieldCheck, Crown } from 'lucide-react';

export default function GoldRevealHero() {
  const { heroConfig } = useStore();
  const [letters, setLetters] = useState([]);
  const [embers, setEmbers] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const stageRef = useRef(null);
  const audioStarted = useRef(false);
  const utteranceRef = useRef(null);

  const brandName = heroConfig?.brandName || 'ARTELLIUM';
  const tagline = heroConfig?.tagline || 'The future of African art is safe';
  const hasBackgroundVideo = Boolean(heroConfig?.videoUrl);
  const hasBackgroundImage = Boolean(heroConfig?.mediaType === 'image' && heroConfig?.mediaUrl);
  const overlayOpacity = heroConfig?.videoOverlayOpacity ?? 0.65;

  useEffect(() => {
    // Build letters configuration dynamically from brandName
    const letterArr = brandName.split('').map((ch, i) => ({
      ch,
      delayReveal: `${i * 0.09}s`,
      delayFloat: `${1.2 + i * 0.08}s`,
      id: i,
    }));
    setLetters(letterArr);

    // Trigger embers burst for each letter as it "lands"
    const timers = [];
    brandName.split('').forEach((_, i) => {
      const burstTime = i * 90 + 350;
      const timer = setTimeout(() => {
        burstEmbers(i);
      }, burstTime);
      timers.push(timer);
    });

    // Try initial auto speech
    const speechTimer = setTimeout(() => {
      speakWelcome();
    }, 600);
    timers.push(speechTimer);

    // Interaction fallback listeners to bypass browser autoplay voice restrictions
    const handleInteraction = () => {
      if (!audioStarted.current) {
        speakWelcome();
      }
    };

    window.addEventListener('click', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('pointerdown', handleInteraction, { passive: true });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('pointerdown', handleInteraction);
    };
  }, [brandName]);

  // Play a royal golden chime via Web Audio API (100% browser supported)
  const playRoyalChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const notes = [528, 660, 792, 1056]; // 528Hz Solfeggio gold transformation harmonic chord
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.9);
      });
    } catch (err) {
      console.warn('Royal chime skipped:', err);
    }
  };

  const speakWelcome = (force = false) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (!force && audioStarted.current) return;

    try {
      playRoyalChime();

      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();

      const text = `Welcome to ${brandName}. ${tagline}.`;
      const utter = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utter;

      utter.rate = 0.85;
      utter.pitch = 1.0;
      utter.volume = 1;

      utter.onstart = () => {
        audioStarted.current = true;
        setIsSpeaking(true);
        setHasSpoken(true);
      };

      utter.onend = () => {
        setIsSpeaking(false);
      };

      utter.onerror = (e) => {
        console.warn('Speech synthesis state:', e);
        setIsSpeaking(false);
      };

      const selectAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const male = voices.find(v => 
            v.name.includes('Daniel') || 
            v.name.includes('George') ||
            v.name.includes('Arthur') ||
            v.name.includes('Alex') || 
            v.name.includes('Google UK English Male') ||
            v.name.includes('Google US English Male') ||
            v.name.includes('Microsoft David') ||
            v.name.includes('Microsoft Mark') ||
            v.name.toLowerCase().includes('male')
          );
          if (male) {
            utter.voice = male;
          }
        }
        window.speechSynthesis.speak(utter);
      };

      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          selectAndSpeak();
        };
        window.speechSynthesis.speak(utter);
      } else {
        selectAndSpeak();
      }
    } catch (e) {
      console.warn('Speech error:', e);
    }
  };

  const burstEmbers = (letterIndex) => {
    if (!stageRef.current) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const letterEl = stageRef.current.querySelector(`[data-index="${letterIndex}"]`);
    if (!letterEl) return;
    
    const rect = letterEl.getBoundingClientRect();
    const cx = rect.left - stageRect.left + rect.width / 2;
    const cy = rect.top - stageRect.top + rect.height / 2;

    const newEmbers = [];
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.6;
      const dist = 50 + Math.random() * 80;
      const ex = Math.cos(angle) * dist;
      const ey = Math.sin(angle) * dist;
      const id = `${letterIndex}-${i}-${Math.random()}`;
      newEmbers.push({
        id,
        left: cx,
        top: cy,
        ex: `${ex}px`,
        ey: `${ey}px`,
        delay: `${Math.random() * 0.15}s`,
      });
    }

    setEmbers(prev => [...prev, ...newEmbers]);

    setTimeout(() => {
      setEmbers(prev => prev.filter(emb => !newEmbers.find(ne => ne.id === emb.id)));
    }, 1200);
  };

  return (
    <section className="artellium-hero relative w-full h-[540px] sm:h-[580px] overflow-hidden flex flex-col items-center justify-center border-b border-art-gold/20 select-none" id="heroStage" ref={stageRef}>
      
      {/* Background Graphic / Video Layer */}
      {hasBackgroundVideo ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {heroConfig.videoUrl.includes('youtube.com') || heroConfig.videoUrl.includes('youtu.be') || heroConfig.videoUrl.includes('vimeo.com') ? (
            <iframe
              src={heroConfig.videoUrl.includes('embed') ? heroConfig.videoUrl : `${heroConfig.videoUrl}?autoplay=1&mute=1&loop=1&controls=0`}
              title="Hero Background Video"
              className="absolute inset-0 w-full h-full object-cover scale-150 pointer-events-none opacity-50"
            />
          ) : (
            <video
              src={heroConfig.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            />
          )}
          {/* Dynamic Dark / Golden Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-black/75 to-black/85" 
            style={{ opacity: overlayOpacity }}
          />
        </div>
      ) : hasBackgroundImage ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <img
            src={heroConfig.mediaUrl}
            alt="Hero Background Graphic"
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-black/70 to-black/85" 
            style={{ opacity: overlayOpacity }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#1c1408_0%,#0d0802_50%,#000000_100%)] z-0" />
      )}

      {/* Scoped Styles for Golden Typography and Particles */}
      <style jsx global>{`
        .artellium-hero {
          perspective: 1500px;
        }
        .artellium-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 25% 40%, rgba(255,170,40,0.12) 0%, transparent 45%),
            radial-gradient(circle at 75% 60%, rgba(255,130,20,0.1) 0%, transparent 45%);
          pointer-events: none;
          z-index: 1;
        }
        .letter-track {
          display: flex;
          position: relative;
          z-index: 10;
          transform-style: preserve-3d;
          gap: 6px;
        }
        .hero-letter {
          font-family: 'Cinzel', serif, Georgia;
          font-size: clamp(38px, 8vw, 76px);
          font-weight: 900;
          color: #fff8e7;
          text-shadow: 
            0 0 8px rgba(255,180,60,0.95),
            0 0 24px rgba(255,140,30,0.75),
            0 0 48px rgba(200,100,0,0.55),
            0 0 80px rgba(160,80,0,0.35),
            0 6px 16px rgba(0,0,0,0.98);
          opacity: 0;
          transform: rotateY(720deg) rotateX(45deg) scale(0.3) translateZ(-200px);
          animation: spinReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards, floatGentle 4s ease-in-out infinite;
          display: inline-block;
          position: relative;
        }
        .hero-letter::before {
          content: attr(data-ch);
          position: absolute;
          left: 0;
          top: 0;
          background: linear-gradient(180deg, #fffbe8 0%, #e8b84a 35%, #b8860b 70%, #5c3a00 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.85;
          z-index: -1;
          transform: translateZ(-10px) translateY(4px);
          filter: blur(2px);
        }
        .hero-letter::after {
          content: '';
          position: absolute;
          left: -8px;
          right: -8px;
          bottom: -6px;
          height: 3px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,180,60,0.8) 50%, transparent 100%);
          border-radius: 50%;
          filter: blur(2px);
          opacity: 0;
          animation: underlineGlow 0.6s ease-out forwards;
        }
        @keyframes spinReveal {
          0% { opacity: 0; transform: rotateY(720deg) rotateX(45deg) scale(0.3) translateZ(-200px); filter: blur(12px); }
          40% { opacity: 1; transform: rotateY(-30deg) rotateX(-10deg) scale(1.15) translateZ(30px); filter: blur(0px); }
          60% { transform: rotateY(15deg) rotateX(5deg) scale(0.95) translateZ(-10px); }
          80% { transform: rotateY(-5deg) rotateX(-2deg) scale(1.02) translateZ(5px); }
          100% { opacity: 1; transform: rotateY(0deg) rotateX(0deg) scale(1) translateZ(0); filter: blur(0px); }
        }
        @keyframes floatGentle {
          0%, 100% { transform: translateY(0) rotateY(0deg); }
          25% { transform: translateY(-4px) rotateY(2deg); }
          75% { transform: translateY(4px) rotateY(-2deg); }
        }
        @keyframes underlineGlow {
          0% { opacity: 0; transform: scaleX(0); }
          100% { opacity: 1; transform: scaleX(1); }
        }
        .shimmer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,220,120,0.08) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: shimmerSweep 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 3;
        }
        @keyframes shimmerSweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .ember {
          position: absolute;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, #ffd700 0%, #ff6b00 60%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          animation: emberBurst 1.2s ease-out forwards;
          box-shadow: 0 0 8px 2px rgba(255,180,0,0.6);
          z-index: 15;
        }
        @keyframes emberBurst {
          0% { opacity: 1; transform: translate(0,0) scale(1); }
          100% { opacity: 0; transform: translate(var(--ex), var(--ey)) scale(0); }
        }
        .hero-tagline {
          margin-top: 24px;
          font-family: 'Cinzel', serif, Georgia;
          font-size: clamp(13px, 2.5vw, 18px);
          color: #f1d798;
          letter-spacing: 5px;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(20px);
          animation: taglineRise 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.8s forwards;
          text-shadow: 0 0 24px rgba(212,184,122,0.6), 0 2px 8px rgba(0,0,0,0.9);
          font-weight: 600;
          z-index: 10;
          text-align: center;
          padding: 0 16px;
        }
        @keyframes taglineRise {
          to { opacity: 1; transform: translateY(0); }
        }
        .light-sweep {
          position: absolute;
          top: -30%;
          left: 50%;
          width: 300px;
          height: 160%;
          background: linear-gradient(180deg, transparent 0%, rgba(255,170,50,0.07) 35%, rgba(255,130,20,0.04) 65%, transparent 100%);
          transform: translateX(-50%) rotate(-12deg);
          pointer-events: none;
          animation: sweepMotion 5s ease-in-out infinite;
          z-index: 2;
        }
        @keyframes sweepMotion {
          0%, 100% { opacity: 0.2; transform: translateX(-50%) rotate(-12deg) translateX(-50px); }
          50% { opacity: 0.6; transform: translateX(-50%) rotate(-12deg) translateX(50px); }
        }
      `}</style>

      <div className="light-sweep"></div>
      <div className="shimmer-overlay"></div>

      {/* Interactive Royal Welcome Voice Controller Pill */}
      <div className="absolute top-6 left-6 md:top-8 md:left-12 z-20">
        <button
          type="button"
          onClick={() => speakWelcome(true)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition duration-300 shadow-gold-glow backdrop-blur-md text-xs font-sans font-semibold cursor-pointer ${
            isSpeaking 
              ? 'bg-art-gold text-art-black border-art-gold animate-pulse' 
              : 'bg-black/70 hover:bg-black text-art-gold border-art-gold/40 hover:border-art-gold'
          }`}
          title="Click to play or replay the Royal Welcome Voice"
        >
          {isSpeaking ? (
            <>
              <Volume2 className="w-4 h-4 text-art-black animate-bounce" />
              <span className="tracking-wide uppercase text-[10px] font-bold">Speaking Welcome...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-art-gold" />
              <span className="tracking-wide uppercase text-[10px]">
                {hasSpoken ? 'Replay Royal Voice' : '🔊 Royal Voice Active'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Rotating Authenticity Stamp Badge */}
      <div 
        onClick={() => speakWelcome(true)}
        className="absolute top-6 right-6 md:top-8 md:right-12 z-20 select-none cursor-pointer group"
        title="Royal Authenticity Seal - Click to play Ceremony Welcome"
      >
        <div className="relative w-24 h-24 md:w-28 md:h-28 transition-transform duration-500 hover:scale-105">
          <div className="absolute inset-0 rounded-full bg-amber-500/5 blur-md group-hover:bg-amber-500/10 transition-colors duration-500" />
          
          <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_30s_linear_infinite] drop-shadow-[0_4px_12px_rgba(212,175,55,0.25)]">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF6D6" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#B8860B" />
              </linearGradient>
              <path
                id="circleTextPath"
                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
              />
            </defs>
            
            <circle cx="50" cy="50" r="43" fill="none" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />
            
            <text className="text-[7.5px] font-bold tracking-[0.25em] uppercase font-sans" fill="url(#goldGradient)">
              <textPath href="#circleTextPath" startOffset="0%">
                ★ ARTELLIUM ★ SECURED AUTHENTICITY ★ ORIGINAL ART
              </textPath>
            </text>
            
            <circle cx="50" cy="50" r="27" fill="none" stroke="url(#goldGradient)" strokeWidth="1.2" strokeDasharray="3 1.5" />
            <circle cx="50" cy="50" r="24" fill="none" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.4" />
            
            <g>
              <circle cx="38" cy="40" r="1.2" fill="url(#goldGradient)" />
              <circle cx="50" cy="36" r="1.5" fill="url(#goldGradient)" />
              <circle cx="62" cy="40" r="1.2" fill="url(#goldGradient)" />
              
              <path 
                d="M 36,53 L 38,42 L 44,47 L 50,38 L 56,47 L 62,42 L 64,53 Z" 
                fill="url(#goldGradient)" 
              />
              
              <rect x="36" y="55" width="28" height="2" rx="0.5" fill="url(#goldGradient)" />
              
              <circle cx="41" cy="56" r="0.6" fill="#1c1408" />
              <circle cx="47" cy="56" r="0.6" fill="#1c1408" />
              <circle cx="53" cy="56" r="0.6" fill="#1c1408" />
              <circle cx="59" cy="56" r="0.6" fill="#1c1408" />
            </g>
          </svg>
        </div>
      </div>
      
      {/* 3D Animated Letters */}
      <div className="letter-track" id="letterTrack">
        {letters.map((letter) => (
          <span
            key={letter.id}
            className="hero-letter"
            data-ch={letter.ch}
            data-index={letter.id}
            style={{
              animationDelay: `${letter.delayReveal}, ${letter.delayFloat}`,
            }}
          >
            {letter.ch}
          </span>
        ))}
      </div>
      
      {/* Dynamic Slogan Tagline */}
      <div className="hero-tagline" id="heroTagline">
        {tagline}
      </div>

      {/* Dynamic Embers Particles */}
      {embers.map((ember) => (
        <div
          key={ember.id}
          className="ember"
          style={{
            left: `${ember.left}px`,
            top: `${ember.top}px`,
            '--ex': ember.ex,
            '--ey': ember.ey,
            animationDelay: ember.delay,
          }}
        />
      ))}
    </section>
  );
}
