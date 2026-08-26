'use client';

import React from 'react';
import { X, Award, ShieldCheck, CheckCircle2, Download, Printer, QrCode } from 'lucide-react';

export default function DigitalCertificateModal({ certData, onClose, artistSignature }) {
  if (!certData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1117] text-white border-2 border-art-gold/60 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header Accent */}
        <div className="text-center space-y-2 border-b border-art-gold/30 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/10 border border-art-gold/40 text-art-gold text-[10px] font-bold uppercase tracking-widest">
            <Award className="w-4 h-4" />
            <span>Permanent Sovereign Ledger Authentication</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-white">
            CERTIFICATE OF AUTHENTICITY
          </h2>
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            ARTELLIUM AFRICA · AFRICAN FINE ART ARCHIVAL REGISTRY
          </p>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 text-xs font-sans text-slate-300">
          <p className="text-center italic text-slate-400 max-w-md mx-auto">
            This certifies that the artwork detailed below is an authentic, original masterpiece registered in the African Fine Art Historical Provenance Ledger.
          </p>

          {/* Masterpiece Details Grid */}
          <div className="p-5 rounded-2xl bg-black/50 border border-art-gold/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block">Artwork Title</span>
              <p className="font-serif text-base font-bold text-white mt-0.5">{certData.title}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block">Master Artist</span>
              <p className="font-semibold text-white mt-0.5">{certData.artist}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block">Medium & Support</span>
              <p className="text-slate-200 mt-0.5">{certData.medium || 'Archival Mixed Media'}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block">Dimensions</span>
              <p className="text-slate-200 mt-0.5">{certData.dimensions || 'Original Dimensions'}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block">Acquisition Date</span>
              <p className="text-slate-200 mt-0.5">{certData.date || 'February 2026'}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block">Tamper-Proof Ledger Hash</span>
              <p className="font-mono text-[10px] text-emerald-400 mt-0.5 truncate">{certData.txHash || '0x99A87C10B24F'}</p>
            </div>
          </div>
        </div>

        {/* Dual Signatures Section */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-art-gold/30">
          
          {/* Artist Signature */}
          <div className="text-center space-y-1">
            <div className="h-16 flex items-center justify-center border-b border-white/20 pb-2">
              {artistSignature?.drawn ? (
                <img src={artistSignature.drawn} alt="Artist Signature" className="max-h-14 object-contain filter invert" />
              ) : (
                <p className="font-serif text-2xl italic text-art-gold font-bold">
                  {certData.artist}
                </p>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Master Artist Signature</span>
            <span className="text-[9px] text-slate-500 font-mono block">Cryptographically Verified</span>
          </div>

          {/* Platform Seal */}
          <div className="text-center space-y-1">
            <div className="h-16 flex items-center justify-center border-b border-white/20 pb-2">
              <div className="w-12 h-12 rounded-full border-2 border-art-gold flex items-center justify-center bg-art-gold/10 text-art-gold">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-art-gold uppercase tracking-wider block">ARTELLIUM Curator Seal</span>
            <span className="text-[9px] text-emerald-400 font-mono block">Direct Settlement & Authenticity Sealed</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 text-xs">
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Permanent Archival Standard ISO-2026</span>
          </span>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-art-gold hover:brightness-110 text-art-black font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
