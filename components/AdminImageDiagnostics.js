'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/store-context';
import {
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Sliders,
  Upload,
  Layers,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  Zap,
  Eye,
  Check,
  X,
  Database,
  HardDrive
} from 'lucide-react';
import { 
  CURATED_AFRICAN_ART_LIBRARY, 
  DEFAULT_FALLBACK_IMAGE, 
  getCategoryFallback,
  compressAndOptimizeImage,
  formatBytes,
  isValidImageSource
} from '@/lib/image-utils';
import { getStorageDiagnostics } from '@/lib/safe-storage';
import ArtworkPhotoUploader from '@/components/ArtworkPhotoUploader';

export default function AdminImageDiagnostics() {
  const { artworks = [], updateArtwork, deleteArtwork } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'broken' | 'base64' | 'remote'
  const [storageMetrics, setStorageMetrics] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  const [editingImageArt, setEditingImageArt] = useState(null);
  const [newImageValue, setNewImageValue] = useState('');
  const [newAdditionalImages, setNewAdditionalImages] = useState([]);
  const [previewModalImg, setPreviewModalImg] = useState(null);

  // Refresh storage metrics on load
  const refreshDiagnostics = () => {
    const diag = getStorageDiagnostics();
    setStorageMetrics(diag);
  };

  useEffect(() => {
    refreshDiagnostics();
  }, [artworks]);

  // Image health calculations
  const totalArtworks = artworks.length;
  const brokenImages = artworks.filter(a => !a.image || !isValidImageSource(a.image));
  const base64Images = artworks.filter(a => a.image && a.image.startsWith('data:image/'));
  const remoteImages = artworks.filter(a => a.image && (a.image.startsWith('http://') || a.image.startsWith('https://')));
  const multiAngleArtworks = artworks.filter(a => a.additionalImages && a.additionalImages.length > 0);

  // 1-Click Auto-Repair All Broken Images Engine
  const handleAutoRepairAllBroken = () => {
    setIsScanning(true);
    let repairedCount = 0;

    artworks.forEach((art) => {
      if (!art.image || !isValidImageSource(art.image)) {
        const replacementUrl = getCategoryFallback(art.category);
        updateArtwork(art.id, { image: replacementUrl });
        repairedCount++;
      }
    });

    setIsScanning(false);
    refreshDiagnostics();
    setActionNotice(`Auto-repair complete! Restored and cured ${repairedCount} broken artwork images.`);
    setTimeout(() => setActionNotice(''), 5000);
  };

  // Bulk Compress and Optimize all Base64 images
  const handleBulkCompressArtworks = async () => {
    setIsOptimizing(true);
    let compressedCount = 0;

    for (const art of artworks) {
      if (art.image && art.image.startsWith('data:image/') && art.image.length > 300000) {
        try {
          const result = await compressAndOptimizeImage(art.image, {
            maxWidth: 1400,
            maxHeight: 1400,
            quality: 0.82
          });
          updateArtwork(art.id, { image: result.dataUrl });
          compressedCount++;
        } catch (e) {
          console.warn('Skipped image compression for', art.title, e);
        }
      }
    }

    setIsOptimizing(false);
    refreshDiagnostics();
    setActionNotice(`Storage optimization complete! Compressed ${compressedCount} heavy artwork images.`);
    setTimeout(() => setActionNotice(''), 5000);
  };

  // Save manual image replacement
  const handleSaveImageReplacement = () => {
    if (!editingImageArt || !newImageValue) return;
    updateArtwork(editingImageArt.id, {
      image: newImageValue,
      additionalImages: newAdditionalImages
    });
    setEditingImageArt(null);
    setNewImageValue('');
    setNewAdditionalImages([]);
    refreshDiagnostics();
    setActionNotice(`Artwork "${editingImageArt.title}" image updated successfully!`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  // Filter artworks
  const filteredList = artworks.filter((art) => {
    const matchesSearch = 
      art.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.artistName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.category?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'broken') return !art.image || !isValidImageSource(art.image);
    if (filterType === 'base64') return art.image && art.image.startsWith('data:image/');
    if (filterType === 'remote') return art.image && (art.image.startsWith('http://') || art.image.startsWith('https://'));
    return true;
  });

  return (
    <div className="space-y-6 text-xs font-sans">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white border border-art-gold/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-art-gold">
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                ZERO-ERROR MEDIA & STORAGE TELEMETRY
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Artwork Media Health, Auto-Compression & Storage Diagnostic Suite
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Real-time monitor and auto-healing suite for artwork photo uploads. Automatically downsamples high-res camera captures, repairs broken URLs, and eliminates browser storage quota overruns.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleAutoRepairAllBroken}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-art-gold via-amber-400 to-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider text-xs transition shadow-gold-glow flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isScanning ? 'Scanning...' : '1-Click Auto-Repair Broken Images'}</span>
            </button>

            <button
              onClick={handleBulkCompressArtworks}
              disabled={isOptimizing}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 text-art-gold ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Optimizing...' : 'Bulk Compress Heavy Media'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {actionNotice && (
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 4 Core Health Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs font-mono">
          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Total Artworks</span>
            <p className="text-white font-bold text-lg">{totalArtworks} Catalog Works</p>
            <span className="text-[10px] text-emerald-400 block">{multiAngleArtworks.length} with Multi-Angle Shots</span>
          </div>

          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Broken / Missing Photos</span>
            <p className={`font-bold text-lg ${brokenImages.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {brokenImages.length} Broken
            </p>
            <span className="text-[10px] text-slate-400 block">
              {brokenImages.length === 0 ? '✓ 100% Healthy Assets' : 'Action Required'}
            </span>
          </div>

          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Asset Format Distribution</span>
            <p className="text-art-gold font-bold text-sm">{remoteImages.length} CDN / {base64Images.length} Client Base64</p>
            <span className="text-[10px] text-slate-400 block">WebP / JPEG Compressed</span>
          </div>

          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase block">Storage Quota Pressure</span>
            <div className="flex items-baseline justify-between">
              <p className="text-white font-bold text-lg">{storageMetrics?.formatted || '0 KB'}</p>
              <span className="text-art-gold font-bold text-xs">{storageMetrics?.percentage || 0}% / 5MB</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  (storageMetrics?.percentage || 0) > 80 ? 'bg-red-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, storageMetrics?.percentage || 0)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Storage Breakdown and Sentinel Controls */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-art-gold" />
            <h4 className="font-serif font-bold text-slate-900 text-sm">
              Zero-Quota Storage Sentinel & Table Footprint
            </h4>
          </div>
          <button
            onClick={refreshDiagnostics}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh Diagnostics</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {(storageMetrics?.keys || []).slice(0, 8).map((k) => (
            <div key={k.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div className="truncate pr-2">
                <p className="font-mono font-bold text-slate-800 truncate text-[11px]">{k.key.replace('artellium_', '')}</p>
                <span className="text-[10px] text-slate-400">LocalStorage Key</span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-[11px] shrink-0">{k.formatted}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Catalogue Artwork Media Table & Inspection Suite */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-art-gold" />
              <span>Catalogue Artwork Photos Inspector</span>
            </h4>
            <p className="text-slate-500 text-xs">
              Review live resolution, preview full frame, and update or replace any artwork photo.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search title, artist, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-art-gold"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Media ({artworks.length})</option>
              <option value="broken">Broken / Missing ({brokenImages.length})</option>
              <option value="base64">Client Base64 ({base64Images.length})</option>
              <option value="remote">Remote CDN ({remoteImages.length})</option>
            </select>
          </div>
        </div>

        {/* Artworks Media Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-3 font-semibold">Masterpiece & Thumbnail</th>
                <th className="pb-3 font-semibold">Artist & Origin</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Media Type & Size</th>
                <th className="pb-3 font-semibold">Health Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((art) => {
                const isBase64 = art.image && art.image.startsWith('data:image/');
                const isHealthy = art.image && isValidImageSource(art.image);
                const approxSize = art.image ? formatBytes(Math.round((art.image.length * 3) / 4)) : '0 B';

                return (
                  <tr key={art.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 pr-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-900">
                        <img
                          src={art.image || DEFAULT_FALLBACK_IMAGE}
                          alt={art.title}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewModalImg(art.image || DEFAULT_FALLBACK_IMAGE)}
                          className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition"
                          title="Preview full image"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-0.5">
                        <p className="font-serif font-bold text-slate-900 truncate max-w-xs">{art.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {art.id}</span>
                      </div>
                    </td>

                    <td className="py-3 pr-4">
                      <span className="font-semibold text-slate-800 block">{art.artistName}</span>
                      <span className="text-[10px] text-slate-400">{art.countryFlag || '🌍'} {art.city}, {art.country}</span>
                    </td>

                    <td className="py-3 pr-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        {art.category}
                      </span>
                    </td>

                    <td className="py-3 pr-4 font-mono text-[11px]">
                      <span className="text-slate-800 font-bold block">
                        {isBase64 ? 'Compressed Base64' : 'Remote CDN URL'}
                      </span>
                      <span className="text-slate-400 text-[10px]">{approxSize}</span>
                    </td>

                    <td className="py-3 pr-4">
                      {isHealthy ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Healthy</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span>Corrupted / Missing</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingImageArt(art);
                          setNewImageValue(art.image || '');
                          setNewAdditionalImages(art.additionalImages || []);
                        }}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] transition inline-flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3 text-art-gold" />
                        <span>Update Photo</span>
                      </button>

                      <button
                        onClick={() => {
                          const fallback = getCategoryFallback(art.category);
                          updateArtwork(art.id, { image: fallback });
                          refreshDiagnostics();
                          setActionNotice(`Repaired "${art.title}" with curated ${art.category} masterpiece!`);
                          setTimeout(() => setActionNotice(''), 4000);
                        }}
                        className="p-1 text-slate-500 hover:text-art-gold"
                        title="Auto-Cure with Category Preset"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Artwork Photo Modal */}
      {editingImageArt && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-art-gold uppercase font-bold tracking-wider block">
                  Media Replacement Suite
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Update Artwork Photo · {editingImageArt.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingImageArt(null)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Photo Uploader Tool */}
            <ArtworkPhotoUploader
              mainImage={newImageValue}
              additionalImages={newAdditionalImages}
              onMainImageChange={setNewImageValue}
              onAdditionalImagesChange={setNewAdditionalImages}
              artworkCategory={editingImageArt.category}
              artworkTitle={editingImageArt.title}
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingImageArt(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveImageReplacement}
                className="px-6 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow"
              >
                Apply & Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Full Image Modal */}
      {previewModalImg && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#0c0f17] border border-art-gold/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-serif font-bold text-white text-sm">Full Image Inspection</span>
              <button
                onClick={() => setPreviewModalImg(null)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center">
              <img
                src={previewModalImg}
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
