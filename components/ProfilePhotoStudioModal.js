'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  ZoomIn,
  Move,
  Check,
  X,
  Camera,
  Sparkles,
  User,
  Crop,
  CheckCircle2
} from 'lucide-react';

// Empty export preserved for backward import compatibility — zero AI/stock portraits
export const CURATED_PORTRAIT_GALLERY = [];

const isCleanPersonalPhoto = (src) => {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (!trimmed || trimmed.includes('unsplash.com') || trimmed.includes('pravatar.cc') || trimmed.includes('randomuser.me')) {
    return false;
  }
  return true;
};

export default function ProfilePhotoStudioModal({
  isOpen,
  onClose,
  currentPhoto,
  onSavePhoto,
  userRole = 'artist',
  userName = 'User'
}) {
  const initialCleanPhoto = isCleanPersonalPhoto(currentPhoto) ? currentPhoto : '';
  const [activeSourceTab, setActiveSourceTab] = useState('upload'); // 'upload' | 'crop'
  const [selectedImageSrc, setSelectedImageSrc] = useState(initialCleanPhoto);
  const [imageVersion, setImageVersion] = useState(0);

  // Cropper transform state
  const [scale, setScale] = useState(1.1);
  const [position, setPosition] = useState({ x: 0, y: -10 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [previewDataUrl, setPreviewDataUrl] = useState(initialCleanPhoto);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const viewportRef = useRef(null);
  const hasUserUploadedNewRef = useRef(false);

  // Reset upload flag when modal opens
  useEffect(() => {
    if (isOpen) {
      hasUserUploadedNewRef.current = false;
      const clean = isCleanPersonalPhoto(currentPhoto) ? currentPhoto : '';
      setSelectedImageSrc(clean);
      setPreviewDataUrl(clean);
      setActiveSourceTab(clean ? 'crop' : 'upload');
    }
  }, [isOpen, currentPhoto]);

  // Compute cropped 600x600 Data URL from imageRef & canvasRef
  const computeCroppedDataUrl = useCallback(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !img.width || !img.height) {
      return isCleanPersonalPhoto(selectedImageSrc) ? selectedImageSrc : '';
    }

    try {
      const ctx = canvas.getContext('2d');
      const outputSize = 600;
      canvas.width = outputSize;
      canvas.height = outputSize;

      ctx.clearRect(0, 0, outputSize, outputSize);
      ctx.save();

      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const imgAspect = img.width / img.height;
      let drawWidth, drawHeight;

      if (imgAspect > 1) {
        drawHeight = outputSize * scale;
        drawWidth = drawHeight * imgAspect;
      } else {
        drawWidth = outputSize * scale;
        drawHeight = drawWidth / imgAspect;
      }

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
      return dataUrl;
    } catch (err) {
      return isCleanPersonalPhoto(selectedImageSrc) ? selectedImageSrc : '';
    }
  }, [scale, position, rotation, selectedImageSrc]);

  // Load image object whenever selectedImageSrc changes
  useEffect(() => {
    if (!isCleanPersonalPhoto(selectedImageSrc)) {
      imageRef.current = null;
      setPreviewDataUrl('');
      return;
    }

    let cancelled = false;
    const img = new Image();
    if (!selectedImageSrc.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      if (cancelled) return;
      imageRef.current = img;
      setImageVersion((v) => v + 1);
    };
    img.onerror = () => {
      if (cancelled) return;
      setPreviewDataUrl(selectedImageSrc);
    };
    img.src = selectedImageSrc;

    return () => {
      cancelled = true;
    };
  }, [selectedImageSrc]);

  // Re-generate preview whenever transforms or loaded image change
  useEffect(() => {
    if (!imageRef.current) return;
    const cropped = computeCroppedDataUrl();
    if (cropped) {
      setPreviewDataUrl(cropped);
    }
  }, [scale, position, rotation, imageVersion, computeCroppedDataUrl]);

  // File Upload Handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultDataUrl = event.target?.result;
      if (typeof resultDataUrl === 'string' && resultDataUrl.startsWith('data:image/')) {
        hasUserUploadedNewRef.current = true;
        setSelectedImageSrc(resultDataUrl);
        setPreviewDataUrl(resultDataUrl);
        setScale(1.1);
        setPosition({ x: 0, y: -10 });
        setRotation(0);
        setActiveSourceTab('crop');
      }
    };
    reader.readAsDataURL(file);
  };

  // Mouse Drag Controls
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
      setScale(1.6);
      setPosition({ x: 0, y: 12 });
    } else if (preset === 'upper_body') {
      setScale(1.15);
      setPosition({ x: 0, y: -10 });
    } else if (preset === 'full_fit') {
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
    }
  };

  // Save Final Cropped or Original Profile Photo
  const handleSaveCroppedPhoto = (useOriginalUncropped = false) => {
    let finalPhoto = '';
    if (useOriginalUncropped && isCleanPersonalPhoto(selectedImageSrc)) {
      finalPhoto = selectedImageSrc;
    } else {
      const freshCrop = computeCroppedDataUrl();
      finalPhoto = isCleanPersonalPhoto(freshCrop)
        ? freshCrop
        : isCleanPersonalPhoto(previewDataUrl)
        ? previewDataUrl
        : isCleanPersonalPhoto(selectedImageSrc)
        ? selectedImageSrc
        : '';
    }

    if (!finalPhoto) return;

    onSavePhoto(finalPhoto);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-5 sm:p-7 shadow-2xl animate-scale-in text-xs font-sans space-y-5 my-auto max-h-[92vh] overflow-y-auto pb-12 sm:pb-7">
        {/* Always-mounted hidden canvas so cropping never fails regardless of active tab */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-art-gold/10 border border-art-gold/30 flex items-center justify-center text-amber-800">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900">
                {userRole === 'artist' ? 'Master Artist Personal Portrait' : 'Collector Personal Profile Photo'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Upload your personal photo from your device and save it to your profile.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Source Navigation Tabs (Device Upload & Framing Only — Zero AI/Stock Photos) */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveSourceTab('upload')}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSourceTab === 'upload'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Personal Photo from Device</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSourceTab('crop')}
            disabled={!selectedImageSrc}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 ${
              activeSourceTab === 'crop'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crop className="w-3.5 h-3.5 text-amber-600" />
            <span>Adjust & Frame Photo</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD FROM DEVICE */}
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
                  Click to choose your personal photo from your device
                </p>
                <p className="text-slate-400 text-[11px]">
                  Supports JPG, PNG, WEBP directly from your phone or computer gallery.
                </p>
              </div>

              <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider shadow">
                Choose Personal Photo
              </span>
            </div>

            {selectedImageSrc && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={previewDataUrl || selectedImageSrc}
                    alt="Selected"
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-400"
                  />
                  <div>
                    <p className="font-bold text-emerald-950 text-xs">Personal Photo Ready</p>
                    <p className="text-[11px] text-emerald-700">Click &ldquo;Save Profile Photo&rdquo; below or adjust framing.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSourceTab('crop')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-bold text-[11px] cursor-pointer"
                >
                  Frame / Crop
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UPPER-BODY CROPPER CANVAS & CONTROLS */}
        {activeSourceTab === 'crop' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Left Viewport */}
              <div className="sm:col-span-7 flex flex-col items-center">
                <div
                  ref={viewportRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-slate-950 overflow-hidden border-2 border-slate-800 shadow-inner cursor-grab active:cursor-grabbing select-none"
                >
                  {(previewDataUrl || selectedImageSrc) && (
                    <img
                      src={previewDataUrl || selectedImageSrc}
                      alt="Crop Active"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  )}

                  <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
                    <span className="text-[9.5px] font-mono text-white/80 bg-black/70 px-2 py-0.5 rounded-full backdrop-blur-xs">
                      Drag to position your portrait
                    </span>
                  </div>
                </div>

                {/* Preset Framing Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                  <button
                    type="button"
                    onClick={() => applyPreset('head_shoulders')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition cursor-pointer"
                  >
                    Head & Shoulders
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('upper_body')}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] transition border border-amber-300 cursor-pointer"
                  >
                    Upper Body
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('full_fit')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition cursor-pointer"
                  >
                    Original Fit
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-art-gold font-bold text-[10px] transition cursor-pointer"
                  >
                    Change Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Right: Live Preview & Transform Sliders */}
              <div className="sm:col-span-5 space-y-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Live Profile Avatar Preview
                  </span>

                  <div className="flex items-center gap-4">
                    <div className="text-center space-y-1">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-art-gold shadow-sm bg-slate-200 mx-auto">
                        {previewDataUrl || selectedImageSrc ? (
                          <img src={previewDataUrl || selectedImageSrc} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-full h-full p-3 text-slate-400" />
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono block">Profile Circle</span>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-sm bg-slate-200 mx-auto">
                        {previewDataUrl || selectedImageSrc ? (
                          <img src={previewDataUrl || selectedImageSrc} alt="Studio Badge" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-full h-full p-3 text-slate-400" />
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono block">Dashboard Frame</span>
                    </div>
                  </div>
                </div>

                {/* Fine Adjustment Sliders */}
                <div className="space-y-2.5 text-xs">
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
                      onChange={(e) => setPosition({ ...position, y: parseInt(e.target.value, 10) })}
                      className="w-full accent-art-gold cursor-pointer"
                    />
                  </div>

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
                      onChange={(e) => setPosition({ ...position, x: parseInt(e.target.value, 10) })}
                      className="w-full accent-art-gold cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-3">
          {saveSuccess ? (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Your Personal Photo Has Been Saved to Your Profile!</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">
              Your exact uploaded photo will be saved permanently to your profile.
            </span>
          )}

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            {selectedImageSrc && (
              <button
                type="button"
                onClick={() => handleSaveCroppedPhoto(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Save Original Photo
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSaveCroppedPhoto(false)}
              disabled={!previewDataUrl && !selectedImageSrc}
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
