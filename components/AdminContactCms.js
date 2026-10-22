'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink,
  Clock,
  Globe,
  Headphones,
  ShieldAlert
} from 'lucide-react';

export default function AdminContactCms() {
  const { 
    contactConfig, 
    updateContactConfig, 
    resetContactConfig 
  } = useStore();

  const [formData, setFormData] = useState(contactConfig || {});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (contactConfig) {
      setFormData(contactConfig);
    }
  }, [contactConfig]);

  const handleHeaderChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    updateContactConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all Contact Us information, offices, and channels to platform defaults?')) {
      resetContactConfig();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Office management
  const updateOfficeField = (index, field, value) => {
    const list = [...(formData.offices || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setFormData(prev => ({ ...prev, offices: list }));
    }
  };

  const addOffice = () => {
    const list = [...(formData.offices || [])];
    list.push({
      id: `office-${Date.now()}`,
      city: 'Nairobi Bureau & Gallery',
      country: 'Kenya 🇰🇪',
      address: '22 Kenyatta Avenue, Nairobi',
      phone: '+254 20 892 1000',
      hours: 'Mon – Fri: 9:00 AM – 6:00 PM EAT'
    });
    setFormData(prev => ({ ...prev, offices: list }));
  };

  const deleteOffice = (index) => {
    const list = [...(formData.offices || [])].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, offices: list }));
  };

  // Contact channel management
  const updateChannelField = (index, field, value) => {
    const list = [...(formData.contactChannels || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setFormData(prev => ({ ...prev, contactChannels: list }));
    }
  };

  const addChannel = () => {
    const list = [...(formData.contactChannels || [])];
    list.push({
      id: `chan-${Date.now()}`,
      title: 'VIP Concierge Desk',
      email: 'concierge@artellium.com',
      desc: 'Dedicated private client services and museum loan inquiries.'
    });
    setFormData(prev => ({ ...prev, contactChannels: list }));
  };

  const deleteChannel = (index) => {
    const list = [...(formData.contactChannels || [])].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, contactChannels: list }));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-1">
            <Headphones className="w-3.5 h-3.5 text-blue-600" />
            <span>GLOBAL LIAISON & CONCIERGE CMS</span>
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-900">
            Contact Us & Regional Hubs — Editorial CMS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin has total sovereignty to edit, update, add, or remove regional gallery offices, customer support channels, phone numbers, and emergency hotlines.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Page</span>
          </Link>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 hover:brightness-105"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Contact Info</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Contact Us write-ups, offices, and channels saved successfully! Live page updated instantly.</span>
        </div>
      )}

      {/* Page Header Settings */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Top Header & Emergency Hotline Banner
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Top Badge</label>
            <input
              type="text"
              value={formData.headerBadge || ''}
              onChange={(e) => handleHeaderChange('headerBadge', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-mono"
              placeholder="DIRECT PAN-AFRICAN & GLOBAL LIAISON"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Page Title</label>
            <input
              type="text"
              value={formData.headerTitle || ''}
              onChange={(e) => handleHeaderChange('headerTitle', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-serif font-bold"
              placeholder="Contact Artellium Concierge"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={formData.headerSubtitle || ''}
              onChange={(e) => handleHeaderChange('headerSubtitle', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
              placeholder="Connect directly with our curatorial leadership..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Emergency Concierge & Escrow Verification Hotline Bar (Sticky Notification)
          </label>
          <input
            type="text"
            value={formData.emergencyBannerText || ''}
            onChange={(e) => handleHeaderChange('emergencyBannerText', e.target.value)}
            className="w-full text-xs p-2.5 rounded-lg border border-amber-300 bg-amber-50 font-bold text-amber-900"
            placeholder="Urgent Collector Inquiries & Escrow Verification: Direct Hotline +234 1 888 2783 · WEMA Bank Fiduciary Bureau"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Form Heading</label>
            <input
              type="text"
              value={formData.formTitle || ''}
              onChange={(e) => handleHeaderChange('formTitle', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-serif font-bold"
              placeholder="Send a Direct Curatorial Inquiry"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Form Instructions / Subtitle</label>
            <input
              type="text"
              value={formData.formSubtitle || ''}
              onChange={(e) => handleHeaderChange('formSubtitle', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
              placeholder="Whether inquiring about master lots, consignment..."
            />
          </div>
        </div>
      </div>

      {/* Regional Offices Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Regional Offices & Gallery Hubs ({formData.offices?.length || 0})</span>
            </h3>
            <p className="text-xs text-slate-500">Edit addresses, local phone numbers, operating hours, or add new hubs.</p>
          </div>

          <button
            type="button"
            onClick={addOffice}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Office</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(formData.offices || []).map((off, idx) => (
            <div key={off.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Office #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => deleteOffice(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">City & Bureau Name</label>
                  <input
                    type="text"
                    value={off.city || ''}
                    onChange={(e) => updateOfficeField(idx, 'city', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Country & Flag</label>
                  <input
                    type="text"
                    value={off.country || ''}
                    onChange={(e) => updateOfficeField(idx, 'country', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Physical Address</label>
                <input
                  type="text"
                  value={off.address || ''}
                  onChange={(e) => updateOfficeField(idx, 'address', e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Telephone / Mobile</label>
                  <input
                    type="text"
                    value={off.phone || ''}
                    onChange={(e) => updateOfficeField(idx, 'phone', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Operating Hours</label>
                  <input
                    type="text"
                    value={off.hours || ''}
                    onChange={(e) => updateOfficeField(idx, 'hours', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white text-[11px]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Channels Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Curatorial & Customer Channels ({formData.contactChannels?.length || 0})</span>
            </h3>
            <p className="text-xs text-slate-500">Edit department names, emails, and descriptive write-ups.</p>
          </div>

          <button
            type="button"
            onClick={addChannel}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Channel</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(formData.contactChannels || []).map((chan, idx) => (
            <div key={chan.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Channel #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => deleteChannel(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Department Title</label>
                  <input
                    type="text"
                    value={chan.title || ''}
                    onChange={(e) => updateChannelField(idx, 'title', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Email Address</label>
                  <input
                    type="text"
                    value={chan.email || ''}
                    onChange={(e) => updateChannelField(idx, 'email', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-mono text-blue-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Descriptive Write-up</label>
                <textarea
                  rows={2}
                  value={chan.desc || ''}
                  onChange={(e) => updateChannelField(idx, 'desc', e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Save Banner */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <p className="text-xs text-slate-500">
          All modifications save to localStorage & global memory, immediately updating <Link href="/contact" className="text-blue-700 underline font-bold" target="_blank">/contact</Link>.
        </p>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-2 hover:brightness-105"
        >
          <Save className="w-4 h-4" />
          <span>Save All Contact Info</span>
        </button>
      </div>
    </div>
  );
}
