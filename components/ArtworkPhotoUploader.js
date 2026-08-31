'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Camera,
  X,
  Plus,
  RefreshCw,
  Eye,
  Sliders,
  Check,
  Layers,
  FileCheck
} from 'lucide-react';
import { 
  compressAndOptimizeImage, 
  CURATED_AFRICAN_ART_LIBRARY, 
  DEFAULT_FALLBACK_IMAGE,
  formatBytes 
} from '@/lib/image-utils';

export default function ArtworkPhotoUploader({
  mainImage = '',
  additionalImages = [],
  onMainImageChange,
  onAdditionalImagesChange,
  artworkCategory = 'Paintings',
  artworkTitle = 'Artwork'
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'library' | 'url'
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimizationStats, setOptimizationStats] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [previewModalImage, setPreviewModalImage] = useState(null);

  const fileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);

  // Handle Main Masterpiece Image Upload
  const handleMainFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Auto-compress and resize image client-side to prevent storage overflows
      const result = await compressAndOptimizeImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85
      });

      onMainImageChange(result.dataUrl);
      setOptimizationStats({
        originalSize: formatBytes(result.originalSize),
        compressedSize: formatBytes(result.compressedSize),
        savingsPct: result.savingsPct,
        width: result.width,
        height: result.height
      });
    } catch (err) {
      console.error('Image compression error:', err);
      setErrorMessage('Failed to optimize image. Please try a different photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Additional Angle / Detail Shots Upload
  const handleAdditionalFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const result = await compressAndOptimizeImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.82
      });

      const updated = [...(additionalImages || []), result.dataUrl];
      if (onAdditionalImagesChange) {
        onAdditionalImagesChange(updated);
      }
    } catch (err) {
      console.error('Additional photo error:', err);
      setErrorMessage('Failed to process detail photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeAdditionalImage = (index) => {
    if (!onAdditionalImagesChange) return;
    const updated = (additionalImages || []).filter((_, i) => i !== index);
    onAdditionalImagesChange(updated);
  };

  // Handle Direct URL Submission
  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      onMainImageChange(urlInput.trim());
      setUrlInput('');
      setOptimizationStats(null);
    } catch (err) {
      setErrorMessage('Invalid image URL format.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs">
      {/* Header Label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-art-gold" />
          <h4 className="font-serif font-bold text-slate-900 text-sm">
            Artwork Photography & Studio Proof Suite
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Zero-Error Client Auto-Compression Active
        </span>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
            activeTab === 'upload'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Device Photo / Camera</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
            activeTab === 'library'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-art-gold" />
          <span>Curated African Library</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition flex items-center justify-center gap-1.5 ${
            activeTab === 'url'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Paste Image URL</span>
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 1: DEVICE FILE UPLOAD & CAMERA CAPTURE                           */}
      {/* ===================================================================== */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center space-y-2.5 cursor-pointer transition group ${
              mainImage
                ? 'border-emerald-400 bg-emerald-50/20'
                : 'border-slate-300 hover:border-art-gold hover:bg-amber-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleMainFileSelect}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center group-hover:scale-110 transition text-amber-800">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-0.5">
              <p className="font-serif font-bold text-slate-900 text-sm">
                {isProcessing ? 'Optimizing & Compressing Photo...' : 'Click to Upload Artwork Photo or Drag & Drop'}
              </p>
              <p className="text-[11px] text-slate-500">
                Supports camera shots, high-res phone captures (JPG, PNG, WEBP). Auto-optimized to zero-error footprint.
              </p>
            </div>

            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider shadow">
              Select Image File
            </span>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: CURATED AFRICAN ART PRESETS LIBRARY                           */}
      {/* ===================================================================== */}
      {activeTab === 'library' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-slate-500 text-[11px]">
            <span>Choose an authentic high-resolution masterwork preset:</span>
            <span className="font-mono">{CURATED_AFRICAN_ART_LIBRARY.length} Masterpieces</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {CURATED_AFRICAN_ART_LIBRARY.map((item) => {
              const isSelected = mainImage === item.url;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onMainImageChange(item.url);
                    setOptimizationStats(null);
                  }}
                  className={`group relative rounded-xl overflow-hidden border-2 text-left transition cursor-pointer ${
                    isSelected
                      ? 'border-art-gold ring-2 ring-art-gold/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-1.5 bg-white space-y-0.5">
                    <p className="font-bold text-slate-900 text-[10px] truncate">{item.title}</p>
                    <span className="text-[9px] text-amber-800 block truncate">{item.category}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-art-gold text-art-black flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: DIRECT IMAGE URL INPUT                                        */}
      {/* ===================================================================== */}
      {activeTab === 'url' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-art-gold"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl uppercase text-[10px] tracking-wider transition shrink-0"
            >
              Apply URL
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PRIMARY MASTERPIECE LIVE PREVIEW & AUTO-COMPRESSION STATS            */}
      {/* ===================================================================== */}
      {mainImage && (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Primary Masterpiece Photo (Active)</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewModalImage(mainImage)}
                className="text-slate-500 hover:text-slate-800 text-[11px] font-semibold flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Full Frame</span>
              </button>
              <button
                type="button"
                onClick={() => onMainImageChange('')}
                className="text-red-500 hover:text-red-700 text-[11px] font-semibold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-900">
              <img
                src={mainImage}
                alt="Main Artwork Preview"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 text-[11px] text-slate-600">
              {optimizationStats ? (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-Optimized: {optimizationStats.compressedSize}</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                      -{optimizationStats.savingsPct}% Reduced
                    </span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-mono">
                    Original: {optimizationStats.originalSize} · Resolution: {optimizationStats.width}x{optimizationStats.height}px
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">Verified Web Image Asset</p>
                  <p className="text-slate-400 text-[10px] truncate max-w-xs font-mono">{mainImage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MULTI-ANGLE DETAIL & PROVENANCE SHOTS (SUPPLEMENTARY)                */}
      {/* ===================================================================== */}
      <div className="space-y-2 pt-1 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-art-gold" />
              <span>Multi-Angle & Studio Detail Proofs (Optional)</span>
            </span>
            <p className="text-[10px] text-slate-400">
              Add close-ups of signature, canvas texture, frame verso, or COA stamp.
            </p>
          </div>

          <button
            type="button"
            onClick={() => additionalFileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-[11px] flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Detail Photo</span>
          </button>
          <input
            ref={additionalFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAdditionalFileSelect}
            className="hidden"
          />
        </div>

        {additionalImages && additionalImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
            {additionalImages.map((imgUrl, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-900">
                <img src={imgUrl} alt={`Detail ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAdditionalImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow"
                  title="Remove photo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-Screen Preview Inspection Modal */}
      {previewModalImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#0c0f17] border border-art-gold/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-art-gold font-serif font-bold text-sm">
                <Camera className="w-4 h-4" />
                <span>High-Resolution Photo Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalImage(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center">
              <img
                src={previewModalImage}
                alt="Artwork Preview"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
