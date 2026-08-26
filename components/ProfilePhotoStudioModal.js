'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Check,
  X,
  Camera,
  Sparkles,
  User,
  Crop,
  Layers,
  Sliders,
  CheckCircle2,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

// Curated high-res portraits for Artists and Collectors
export const CURATED_PORTRAIT_GALLERY = [
  {
    id: 'port-1',
    name: 'Master Sculptor (Studio Foundry)',
    role: 'Artist',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
    tag: 'Bronze & Lost Wax'
  },
  {
    id: 'port-2',
    name: 'Fine Art Painter (Atelier)',
    role: 'Artist',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    tag: 'Gold Leaf & Oils'
  },
  {
    id: 'port-3',
    name: 'Pigment Explorer & Mixed Media',
    role: 'Artist',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
    tag: 'Natural Pigments'
  },
  {
    id: 'port-4',
    name: 'Guild Elder & Wood Master',
    role: 'Artist',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800',
    tag: 'Ancestral Carvings'
  },
  {
    id: 'port-5',
    name: 'Afrofuturist 3D Creator',
    role: 'Artist',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    tag: 'Digital & Spatial'
  },
  {
    id: 'port-6',
    name: 'Heritage Patron & Collector',
    role: 'Collector',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
    tag: 'Fine Art Collector'
  },
  {
    id: 'port-7',
    name: 'Continental Bourse Investor',
    role: 'Collector',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    tag: 'Private Acquisitions'
  },
  {
    id: 'port-8',
    name: 'Pan-African Cultural Trustee',
    role: 'Collector',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    tag: 'Museum Board'
  },
  {
    id: 'port-9',
    name: 'Lagos Modernist Connoisseur',
    role: 'Collector',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800',
    tag: 'Contemporary Patron'
  },
  {
    id: 'port-10',
    name: 'Textile & Tapestry Virtuoso',
    role: 'Artist',
    url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=800',
    tag: 'Woven Heritage'
  }
];

export default function ProfilePhotoStudioModal({
  isOpen,
  onClose,
  currentPhoto,
  onSavePhoto,
  userRole = 'artist',
  userName = 'User'
}) {
  const [activeSourceTab, setActiveSourceTab] = useState('upload'); // 'upload' | 'gallery' | 'crop'
  const [selectedImageSrc, setSelectedImageSrc] = useState(currentPhoto || '');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Cropper transform state
  const [scale, setScale] = useState(1.2);
  const [position, setPosition] = useState({ x: 0, y: -20 }); // slight upper bias by default for upper body
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [previewDataUrl, setPreviewDataUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);

  // Initialize with current photo if available
  useEffect(() => {
    if (currentPhoto) {
      setSelectedImageSrc(currentPhoto);
    }
  }, [currentPhoto]);

  // Load image object
  useEffect(() => {
    if (!selectedImageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      generateCropPreview();
    };
    img.src = selectedImageSrc;
  }, [selectedImageSrc]);

  // File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImageSrc(event.target.result);
      setScale(1.2);
      setPosition({ x: 0, y: -25 }); // default to upper body
      setRotation(0);
      setActiveSourceTab('crop');
    };
    reader.readAsDataURL(file);
  };

  // Generate real-time crop on hidden/live canvas
  const generateCropPreview = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Output dimension: 600x600 square high-res portrait
    const outputSize = 600;
    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.clearRect(0, 0, outputSize, outputSize);
    ctx.save();

    // Move to center of canvas
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate aspect ratio scaling
    const imgAspect = img.width / img.height;
    let drawWidth, drawHeight;

    if (imgAspect > 1) {
      // Landscape: fit height to outputSize
      drawHeight = outputSize * scale;
      drawWidth = drawHeight * imgAspect;
    } else {
      // Portrait / Square: fit width to outputSize
      drawWidth = outputSize * scale;
      drawHeight = drawWidth / imgAspect;
    }

    // Apply offset translation
    const offsetX = (position.x / 100) * (outputSize / 2);
    const offsetY = (position.y / 100) * (outputSize / 2);

    ctx.drawImage(
      img,
      -drawWidth / 2 + offsetX,
      -drawHeight / 2 + offsetY,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setPreviewDataUrl(dataUrl);
  }, [scale, position, rotation]);

  // Re-generate preview whenever transforms change
  useEffect(() => {
    if (imageLoaded) {
      generateCropPreview();
    }
  }, [scale, position, rotation, imageLoaded, generateCropPreview]);

  // Mouse & Touch Drag Controls
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = Math.max(-100, Math.min(100, e.clientX - dragStart.x));
    const newY = Math.max(-100, Math.min(100, e.clientY - dragStart.y));
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Preset Framing Functions
  const applyPreset = (preset) => {
    if (preset === 'head_shoulders') {
      setScale(1.8);
      setPosition({ x: 0, y: 15 }); // push down to center head & shoulders
    } else if (preset === 'upper_body') {
      setScale(1.3);
      setPosition({ x: 0, y: -10 }); // upper torso
    } else if (preset === 'full_fit') {
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Save Final Cropped Profile Photo
  const handleSaveCroppedPhoto = () => {
    if (!previewDataUrl) return;

    onSavePhoto(previewDataUrl);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-7 shadow-2xl animate-scale-in text-xs font-sans space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-art-gold/10 border border-art-gold/30 flex items-center justify-center text-amber-800">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                {userRole === 'artist' ? 'Master Artist Portrait Studio' : 'Verified Collector Profile Photo'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Upload or select a portrait, crop to upper-body focus, and save.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveSourceTab('upload')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
              activeSourceTab === 'upload'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Device Photo</span>
          </button>

          <button
            onClick={() => setActiveSourceTab('gallery')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
              activeSourceTab === 'gallery'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-art-gold" />
            <span>Curated Portrait Gallery</span>
          </button>

          <button
            onClick={() => setActiveSourceTab('crop')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
              activeSourceTab === 'crop'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crop className="w-3.5 h-3.5 text-amber-600" />
            <span>Upper-Body Cropper</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: UPLOAD FROM DEVICE                                                 */}
        {/* ========================================================================= */}
        {activeSourceTab === 'upload' && (
          <div className="space-y-4 py-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-art-gold hover:bg-amber-50/30 rounded-3xl p-8 sm:p-10 text-center space-y-3 cursor-pointer transition group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center group-hover:scale-110 transition text-amber-800">
                <Upload className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <p className="font-serif font-bold text-slate-900 text-sm">
                  Click to browse or drop your portrait photo here
                </p>
                <p className="text-slate-400 text-[11px]">
                  Supports high-resolution JPG, PNG, WEBP (Full-body or Upper-body photos).
                </p>
              </div>

              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                Choose Image File
              </span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex items-center gap-2.5 text-[11px] text-amber-900">
              <Sparkles className="w-4 h-4 text-art-gold shrink-0" />
              <span>
                <strong>Smart Upper-Body Cropping:</strong> If you upload a full-length photo, you can zoom and position it to frame your head and torso perfectly.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CURATED PORTRAIT GALLERY                                           */}
        {/* ========================================================================= */}
        {activeSourceTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-slate-500 text-[11px]">
              <span>Select an authentic portrait from our curated African atelier gallery:</span>
              <span className="font-mono text-slate-400">{CURATED_PORTRAIT_GALLERY.length} Studio Portraits</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-72 overflow-y-auto pr-1">
              {CURATED_PORTRAIT_GALLERY.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedImageSrc(item.url);
                    setScale(1.2);
                    setPosition({ x: 0, y: -20 });
                    setRotation(0);
                    setActiveSourceTab('crop');
                  }}
                  className={`group relative rounded-2xl overflow-hidden border-2 text-left transition duration-200 cursor-pointer ${
                    selectedImageSrc === item.url
                      ? 'border-art-gold ring-2 ring-art-gold/50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="aspect-square bg-slate-100 overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-2 bg-white space-y-0.5">
                    <p className="font-bold text-slate-900 text-[10px] truncate">{item.name}</p>
                    <span className="text-[9px] text-amber-800 font-medium block truncate">{item.tag}</span>
                  </div>
                  {selectedImageSrc === item.url && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-art-gold text-art-black flex items-center justify-center shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: UPPER-BODY CROPPER CANVAS & CONTROLS                               */}
        {/* ========================================================================= */}
        {activeSourceTab === 'crop' && (
          <div className="space-y-4">
            
            {/* Split View: Interactive Viewport + Live Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              
              {/* Left Viewport (Interactive Drag & Framing) */}
              <div className="sm:col-span-7 flex flex-col items-center">
                <div
                  ref={viewportRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-slate-950 overflow-hidden border-2 border-slate-800 shadow-inner cursor-grab active:cursor-grabbing select-none"
                >
                  {/* Background Cropped Image Display */}
                  {previewDataUrl && (
                    <img
                      src={previewDataUrl}
                      alt="Crop Active"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}

                  {/* Upper-Body Framing Guide Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                    {/* Head & Torso Silhouette Guide */}
                    <div className="w-48 h-56 rounded-[40px] border-2 border-dashed border-art-gold/70 bg-art-gold/5 flex flex-col items-center justify-between p-3">
                      <div className="w-20 h-24 rounded-full border border-art-gold/50 bg-white/5 mt-1" />
                      <span className="text-[9px] font-mono font-bold text-art-gold uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        Upper Body Focus
                      </span>
                    </div>
                  </div>

                  {/* Helper Tip */}
                  <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
                    <span className="text-[9.5px] font-mono text-white/80 bg-black/70 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      Drag to adjust upper-body framing
                    </span>
                  </div>
                </div>

                {/* Preset Framing Buttons */}
                <div className="flex items-center gap-1.5 mt-3">
                  <button
                    type="button"
                    onClick={() => applyPreset('head_shoulders')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition"
                  >
                    Head & Shoulders
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('upper_body')}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] transition border border-amber-300"
                  >
                    Upper Body Focus
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('full_fit')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition"
                  >
                    Fit Full
                  </button>
                </div>
              </div>

              {/* Right: Live Preview & Transform Sliders */}
              <div className="sm:col-span-5 space-y-4">
                
                {/* Live Preview Cards */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Live Header & Certificate Avatar
                  </span>

                  <div className="flex items-center gap-4">
                    {/* Circle Avatar (Top Header) */}
                    <div className="text-center space-y-1">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-art-gold shadow-sm bg-slate-200 mx-auto">
                        {previewDataUrl ? (
                          <img src={previewDataUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-full h-full p-3 text-slate-400" />
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono block">Top Navbar</span>
                    </div>

                    {/* Square Badge (Studio & Cert) */}
                    <div className="text-center space-y-1">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-sm bg-slate-200 mx-auto">
                        {previewDataUrl ? (
                          <img src={previewDataUrl} alt="Studio Badge" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-full h-full p-3 text-slate-400" />
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono block">Certificate</span>
                    </div>
                  </div>
                </div>

                {/* Fine Adjustment Sliders */}
                <div className="space-y-2.5 text-xs">
                  {/* Zoom Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
                      <span className="flex items-center gap-1">
                        <ZoomIn className="w-3 h-3 text-slate-500" />
                        <span>Zoom / Scale:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800">{scale.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="3.0"
                      step="0.05"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="w-full accent-art-gold cursor-pointer"
                    />
                  </div>

                  {/* Vertical Position Slider (Upper-body bias) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
                      <span className="flex items-center gap-1">
                        <Move className="w-3 h-3 text-slate-500" />
                        <span>Vertical Position:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800">{position.y > 0 ? `+${position.y}` : position.y}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="2"
                      value={position.y}
                      onChange={(e) => setPosition({ ...position, y: parseInt(e.target.value) })}
                      className="w-full accent-art-gold cursor-pointer"
                    />
                  </div>

                  {/* Horizontal Position Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-medium text-slate-600">
                      <span className="flex items-center gap-1">
                        <Move className="w-3 h-3 text-slate-500" />
                        <span>Horizontal Position:</span>
                      </span>
                      <span className="font-mono font-bold text-slate-800">{position.x > 0 ? `+${position.x}` : position.x}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="2"
                      value={position.x}
                      onChange={(e) => setPosition({ ...position, x: parseInt(e.target.value) })}
                      className="w-full accent-art-gold cursor-pointer"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Hidden Processing Canvas */}
            <canvas ref={canvasRef} className="hidden" />

          </div>
        )}

        {/* Footer & Action Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          {saveSuccess ? (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Portrait Saved to Profile!</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400">
              Crop output: High-definition 600x600 upper-body avatar.
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveCroppedPhoto}
              disabled={!previewDataUrl}
              className="px-6 py-2.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Profile Photo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
