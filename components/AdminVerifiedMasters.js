'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Sparkles,
  MapPin,
  Building
} from 'lucide-react';

export default function AdminVerifiedMasters() {
  const { 
    artistVerifications = [], 
    updateArtistVerificationStatus, 
    sellers = [],
    setArtistVerificationBadge
  } = useStore();

  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = artistVerifications.filter(v => {
    if (filterStatus === 'All') return true;
    return v.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold uppercase border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>KYC & LIVING TREASURES ACCREDITATION</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Verified Masters & KYC Registry</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Review master artist biometric identity credentials, approve museum peer certifications, and grant Gold Crest & Heritage Master seals.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {['All', 'approved', 'pending_review'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-lg transition ${
                filterStatus === st ? 'bg-emerald-700 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'All' ? 'All Applications' : st === 'approved' ? 'Approved Masters' : 'Pending Review'}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Dossiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((verif) => (
          <div
            key={verif.id}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    {verif.artistName}
                  </h3>
                  <span className="text-sm">{verif.flag || '🌍'}</span>
                  {verif.status === 'approved' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500">{verif.country} · Atelier Studio Master</p>
              </div>

              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                verif.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {verif.badgeLabel || verif.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Accreditation & Guild Lineage</span>
                <p className="text-slate-800 font-medium">{verif.accreditation}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl font-mono text-[11px]">
                <span className="text-slate-400 text-[10px] uppercase block">KYC Hash:</span>
                <span className="text-emerald-700 font-bold">{verif.kycHash}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {verif.approvalDate ? `Approved on ${verif.approvalDate}` : 'Awaiting executive sign-off'}
              </span>

              <div className="flex items-center gap-2">
                {verif.status !== 'approved' ? (
                  <button
                    onClick={() => updateArtistVerificationStatus(verif.id, 'approved', 'gold', 'Gold Crest Certified')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Gold Crest</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateArtistVerificationStatus(verif.id, 'approved', 'heritage', 'Heritage Master Certified')}
                    className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs"
                  >
                    Upgrade to Heritage Master
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
