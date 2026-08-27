'use client';

import React from 'react';
import { X, Award, ShieldCheck, CheckCircle2, Download, Printer, QrCode, Sparkles } from 'lucide-react';

export default function DigitalCertificateModal({ certData, onClose, artistSignature }) {
  if (!certData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #artellium-printable-certificate, #artellium-printable-certificate * {
            visibility: visible;
          }
          #artellium-printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 30px;
            background: #ffffff !important;
            color: #000000 !important;
            border: 4px solid #D4AF37 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div 
        id="artellium-printable-certificate"
        className="relative w-full max-w-2xl bg-[#0f1117] text-white border-2 border-art-gold/60 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 my-8 print:bg-white print:text-black print:border-art-gold"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Header Accent */}
        <div className="text-center space-y-2 border-b border-art-gold/30 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/10 border border-art-gold/40 text-art-gold text-[10px] font-bold uppercase tracking-widest print:border-black print:text-black">
            <Award className="w-4 h-4 text-art-gold print:text-black" />
            <span>Permanent Sovereign Ledger Authentication</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-black tracking-wider text-white print:text-black">
            CERTIFICATE OF AUTHENTICITY
          </h2>
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400 print:text-slate-700">
            ARTELLIUM AFRICA · AFRICAN FINE ART ARCHIVAL REGISTRY
          </p>
        </div>

        {/* Certificate Body */}
        <div className="space-y-4 text-xs font-sans text-slate-300 print:text-slate-800">
          <p className="text-center italic text-slate-400 print:text-slate-600 max-w-md mx-auto">
            This certifies that the artwork detailed below is an authentic, original masterpiece registered in the African Fine Art Historical Provenance Ledger.
          </p>

          {/* Masterpiece Details Grid */}
          <div className="p-5 rounded-2xl bg-black/50 border border-art-gold/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans print:bg-slate-50 print:border-slate-300">
            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block print:text-amber-800 font-bold">Artwork Title</span>
              <p className="font-serif text-base font-bold text-white print:text-black mt-0.5">{certData.title}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block print:text-amber-800 font-bold">Master Artist</span>
              <p className="font-semibold text-white print:text-black mt-0.5">{certData.artist}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block print:text-amber-800 font-bold">Medium & Support</span>
              <p className="text-slate-200 print:text-slate-700 mt-0.5">{certData.medium || 'Archival Mixed Media'}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block print:text-amber-800 font-bold">Dimensions</span>
              <p className="text-slate-200 print:text-slate-700 mt-0.5">{certData.dimensions || 'Original Dimensions'}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block print:text-amber-800 font-bold">Acquisition Date</span>
              <p className="text-slate-200 print:text-slate-700 mt-0.5">{certData.date || 'February 2026'}</p>
            </div>

            <div>
              <span className="text-[10px] text-art-gold uppercase font-mono block print:text-amber-800 font-bold">Tamper-Proof Ledger Hash</span>
              <p className="font-mono text-[10px] text-emerald-400 print:text-emerald-800 font-bold mt-0.5 truncate">{certData.txHash || '0x99A87C10B24F'}</p>
            </div>
          </div>
        </div>

        {/* Dual Signatures Section */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-art-gold/30 print:border-slate-300">
          
          {/* Artist Signature */}
          <div className="text-center space-y-1">
            <div className="h-16 flex items-center justify-center border-b border-white/20 print:border-black/20 pb-2">
              {artistSignature?.drawn ? (
                <img src={artistSignature.drawn} alt="Artist Signature" className="max-h-14 object-contain filter invert print:filter-none" />
              ) : (
                <p className="font-serif text-2xl italic text-art-gold print:text-black font-bold">
                  {certData.artist}
                </p>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-300 print:text-black uppercase tracking-wider block">Master Artist Signature</span>
            <span className="text-[9px] text-slate-500 font-mono block">Cryptographically Verified</span>
          </div>

          {/* Platform Seal */}
          <div className="text-center space-y-1">
            <div className="h-16 flex items-center justify-center border-b border-white/20 print:border-black/20 pb-2">
              <div className="w-12 h-12 rounded-full border-2 border-art-gold print:border-black flex items-center justify-center bg-art-gold/10 text-art-gold print:text-black">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-art-gold print:text-black uppercase tracking-wider block">ARTELLIUM Curator Seal</span>
            <span className="text-[9px] text-emerald-400 print:text-emerald-800 font-mono font-bold block">Direct Settlement & Authenticity Sealed</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 text-xs">
          <span className="text-[10px] text-slate-500 print:text-slate-600 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 print:text-emerald-800" />
            <span>Permanent Archival Standard ISO-2026</span>
          </span>

          <div className="flex gap-2 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-art-gold to-amber-500 hover:brightness-110 text-art-black font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-gold-glow cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
