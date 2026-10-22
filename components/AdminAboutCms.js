'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  FileText, 
  Sparkles, 
  Target, 
  Users, 
  ShoppingBag, 
  Eye, 
  Compass, 
  Lightbulb, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Flame,
  BookOpen
} from 'lucide-react';

export default function AdminAboutCms() {
  const { aboutConfig, updateAboutConfig, resetAboutConfig } = useStore();
  const [formData, setFormData] = useState(aboutConfig || {});
  const [activeSubTab, setActiveSubTab] = useState('hero_goal'); // hero_goal, who_we_are, services, vision_mission, core_values
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (aboutConfig) {
      setFormData(aboutConfig);
    }
  }, [aboutConfig]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    updateAboutConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset About Us content to platform default text?')) {
      resetAboutConfig();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Ecosystem highlight helper
  const updateEcoHighlight = (index, field, value) => {
    const list = [...(formData.ecosystemHighlights || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setFormData(prev => ({ ...prev, ecosystemHighlights: list }));
    }
  };

  const addEcoHighlight = () => {
    const list = [...(formData.ecosystemHighlights || [])];
    list.push({
      id: `eco-${Date.now()}`,
      title: 'New Pillar Highlight',
      desc: 'Enter descriptive overview of this ecosystem capability.',
      icon: 'Sparkles'
    });
    setFormData(prev => ({ ...prev, ecosystemHighlights: list }));
  };

  const deleteEcoHighlight = (index) => {
    const list = [...(formData.ecosystemHighlights || [])].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, ecosystemHighlights: list }));
  };

  // Core values helper
  const updateCoreValue = (index, field, value) => {
    const list = [...(formData.coreValues || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      setFormData(prev => ({ ...prev, coreValues: list }));
    }
  };

  const addCoreValue = () => {
    const list = [...(formData.coreValues || [])];
    list.push({
      id: `val-${Date.now()}`,
      title: 'New Core Value',
      desc: 'Guiding principle statement regarding Artellium operations.',
      icon: 'Sparkles'
    });
    setFormData(prev => ({ ...prev, coreValues: list }));
  };

  const deleteCoreValue = (index) => {
    const list = [...(formData.coreValues || [])].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, coreValues: list }));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-1">
            <FileText className="w-3.5 h-3.5 text-art-gold-dark" />
            <span>ARTELLIUM MOTHER HOUSE CMS</span>
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-900">
            About Us — Full Write-up & Editorial CMS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin has total sovereignty to edit, write, rewrite, and add headings, paragraphs, creed, goal, services, mission, vision, and core values.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/about"
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
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-art-gold via-amber-600 to-art-gold-dark text-white text-xs font-bold uppercase tracking-wider transition shadow-gold-glow flex items-center gap-1.5 hover:brightness-105"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Content</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>About Us editorial changes saved successfully! Live page updated instantly.</span>
        </div>
      )}

      {/* Editorial Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
        {[
          { id: 'hero_goal', label: '1. Header, Creed & Goal', icon: Target },
          { id: 'who_we_are', label: '2. Who We Are & Audiences', icon: Users },
          { id: 'services', label: '3. Our Services & Exhibitions', icon: ShoppingBag },
          { id: 'vision_mission', label: '4. Vision & Mission', icon: Compass },
          { id: 'core_values', label: '5. Core Values & CTA', icon: Lightbulb },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Header, Creed & Goal */}
      {activeSubTab === 'hero_goal' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-4">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-art-gold-dark" />
              <span>Page Hero Banner & Artellium Creed</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Top Banner Badge</label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => handleChange('badge', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="e.g. PAN-AFRICAN DIGITAL ART MARKETPLACE & CREATIVE ENTERPRISE"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Main Heading</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-serif font-bold"
                  placeholder="Where Art Meets Culture, Commerce & Innovation."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Artellium Creed (Quote)</label>
                <textarea
                  rows={2}
                  value={formData.creed || ''}
                  onChange={(e) => handleChange('creed', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-serif italic"
                  placeholder="“At Artellium, we believe that every artwork tells a story, every artist has a voice and a face”."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Creed Attribution / Author</label>
                <input
                  type="text"
                  value={formData.creedAuthor || ''}
                  onChange={(e) => handleChange('creedAuthor', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
                  placeholder="— The Artellium Creed"
                />
              </div>
            </div>
          </div>

          {/* Goal Section */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-art-gold-dark" />
              <span>Section 1: Artellium Goal (Strategic Mandate)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={formData.goalBadge || ''}
                  onChange={(e) => handleChange('goalBadge', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-mono"
                  placeholder="STRATEGIC MANDATE"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={formData.goalTitle || ''}
                  onChange={(e) => handleChange('goalTitle', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-serif font-bold"
                  placeholder="Artellium Goal"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pill Tag</label>
                <input
                  type="text"
                  value={formData.goalTag || ''}
                  onChange={(e) => handleChange('goalTag', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  placeholder="Creative Enterprise"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Goal Opening Paragraph (Paragraph 1)</label>
              <textarea
                rows={3}
                value={formData.goalParagraph1 || ''}
                onChange={(e) => handleChange('goalParagraph1', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                placeholder="Artellium is a digital art marketplace and creative enterprise..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Goal Comprehensive Ecosystem Write-up (Paragraph 2)</label>
              <textarea
                rows={4}
                value={formData.goalParagraph2 || ''}
                onChange={(e) => handleChange('goalParagraph2', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
                placeholder="Artellium serves as a comprehensive ecosystem for the buying and selling of artworks and crafts..."
              />
            </div>

            {/* Ecosystem 4 Highlight Cards */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Ecosystem Highlight Cards</span>
                <button
                  type="button"
                  onClick={addEcoHighlight}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Highlight Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(formData.ecosystemHighlights || []).map((eco, idx) => (
                  <div key={eco.id || idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">Pillar #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => deleteEcoHighlight(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={eco.title || ''}
                      onChange={(e) => updateEcoHighlight(idx, 'title', e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-bold"
                      placeholder="Title"
                    />
                    <textarea
                      rows={2}
                      value={eco.desc || ''}
                      onChange={(e) => updateEcoHighlight(idx, 'desc', e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: Who We Are & Audiences */}
      {activeSubTab === 'who_we_are' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Section 2: Who We Are (Identity & Commitments)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.whoWeAreBadge || ''}
                  onChange={(e) => handleChange('whoWeAreBadge', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-mono"
                  placeholder="IDENTITY & COMMITMENT"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={formData.whoWeAreTitle || ''}
                  onChange={(e) => handleChange('whoWeAreTitle', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-serif font-bold"
                  placeholder="Who We Are"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tag</label>
                <input
                  type="text"
                  value={formData.whoWeAreTag || ''}
                  onChange={(e) => handleChange('whoWeAreTag', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  placeholder="Artellium Limited"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lead Introductory Statement</label>
              <textarea
                rows={2}
                value={formData.whoWeAreLead || ''}
                onChange={(e) => handleChange('whoWeAreLead', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 font-medium"
                placeholder="Artellium Limited is more than an online art marketplace..."
              />
            </div>

            {/* Split Audience Commitments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                <label className="block text-xs font-bold text-amber-900">For Emerging & Established Artists — Title</label>
                <input
                  type="text"
                  value={formData.forArtistsTitle || ''}
                  onChange={(e) => handleChange('forArtistsTitle', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-bold"
                  placeholder="For Emerging & Established Artists"
                />
                <label className="block text-xs font-bold text-slate-700 pt-1">Full Write-up Content</label>
                <textarea
                  rows={4}
                  value={formData.forArtistsText || ''}
                  onChange={(e) => handleChange('forArtistsText', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 leading-relaxed"
                  placeholder="We are committed to creating sustainable opportunities for emerging and established artists..."
                />
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <label className="block text-xs font-bold text-emerald-900">For Collectors & Discerning Buyers — Title</label>
                <input
                  type="text"
                  value={formData.forCollectorsTitle || ''}
                  onChange={(e) => handleChange('forCollectorsTitle', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-bold"
                  placeholder="For Collectors & Discerning Buyers"
                />
                <label className="block text-xs font-bold text-slate-700 pt-1">Full Write-up Content</label>
                <textarea
                  rows={4}
                  value={formData.forCollectorsText || ''}
                  onChange={(e) => handleChange('forCollectorsText', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 leading-relaxed"
                  placeholder="For collectors and buyers, we provide access to carefully curated original artworks..."
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: Our Services & Exhibitions */}
      {activeSubTab === 'services' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Section 3: Our Services & Marketplace Pillars</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.servicesBadge || ''}
                  onChange={(e) => handleChange('servicesBadge', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-mono"
                  placeholder="DIGITAL COMMERCE & DISCOVERY"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={formData.servicesTitle || ''}
                  onChange={(e) => handleChange('servicesTitle', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-serif font-bold"
                  placeholder="Our Services"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sub-service Tag</label>
                <input
                  type="text"
                  value={formData.servicesTag || ''}
                  onChange={(e) => handleChange('servicesTag', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200"
                  placeholder="Online Art Marketplace"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Services Overview Write-up</label>
              <textarea
                rows={2}
                value={formData.servicesSubtitle || ''}
                onChange={(e) => handleChange('servicesSubtitle', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200"
                placeholder="Artellium provides a secure digital marketplace where collectors and buyers..."
              />
            </div>

            {/* Exhibitions & SDGs Pillar */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3 pt-3">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                Art Exhibitions & Sustainability Dialogue
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exhibitions Badge</label>
                  <input
                    type="text"
                    value={formData.exhibitionsBadge || ''}
                    onChange={(e) => handleChange('exhibitionsBadge', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                    placeholder="SDGs Dialogues for Sustainable Living"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exhibitions Heading</label>
                  <input
                    type="text"
                    value={formData.exhibitionsTitle || ''}
                    onChange={(e) => handleChange('exhibitionsTitle', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-bold"
                    placeholder="Art Exhibitions"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exhibitions Lead Write-up</label>
                <textarea
                  rows={2}
                  value={formData.exhibitionsLead || ''}
                  onChange={(e) => handleChange('exhibitionsLead', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                  placeholder="We curate exhibitions that showcase artistic excellence while connecting creators..."
                />
              </div>
            </div>

            {/* Auctions Pillar */}
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 space-y-3 pt-3">
              <span className="text-xs font-bold text-red-950 uppercase tracking-wider block">
                Online Auction House & Live Bidding
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Auctions Badge</label>
                  <input
                    type="text"
                    value={formData.auctionsBadge || ''}
                    onChange={(e) => handleChange('auctionsBadge', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                    placeholder="Live, Upcoming & Past Auctions"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Auctions Heading</label>
                  <input
                    type="text"
                    value={formData.auctionsTitle || ''}
                    onChange={(e) => handleChange('auctionsTitle', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-bold"
                    placeholder="Online Auction House"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Auctions Lead Write-up</label>
                <textarea
                  rows={2}
                  value={formData.auctionsLead || ''}
                  onChange={(e) => handleChange('auctionsLead', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                  placeholder="Our Online Auction House provides authenticated collectors..."
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: Vision & Mission */}
      {activeSubTab === 'vision_mission' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vision Editor */}
            <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-4">
              <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-art-gold-dark" />
                <span>Our Vision (Future Aspiration)</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.visionBadge || ''}
                  onChange={(e) => handleChange('visionBadge', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
                  placeholder="FUTURE ASPIRATION"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={formData.visionTitle || ''}
                  onChange={(e) => handleChange('visionTitle', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-serif font-bold"
                  placeholder="Our Vision"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Vision Statement (Official Quote)</label>
                <textarea
                  rows={4}
                  value={formData.visionStatement || ''}
                  onChange={(e) => handleChange('visionStatement', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-serif font-bold leading-relaxed"
                  placeholder="“To become Africa’s leading digital art marketplace and one of the world’s most trusted platforms...”"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vision Strategic Pillars</label>
                <input
                  type="text"
                  value={formData.visionPillars || ''}
                  onChange={(e) => handleChange('visionPillars', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-medium text-amber-900"
                  placeholder="Pan-African Leadership · Global Reach · Trust Infrastructure"
                />
              </div>
            </div>

            {/* Mission Editor */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-4">
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Our Mission (Core Mandate)</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.missionBadge || ''}
                  onChange={(e) => handleChange('missionBadge', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
                  placeholder="CORE MANDATE"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={formData.missionTitle || ''}
                  onChange={(e) => handleChange('missionTitle', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-serif font-bold"
                  placeholder="Our Mission"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Mission Statement (Official Mandate)</label>
                <textarea
                  rows={4}
                  value={formData.missionStatement || ''}
                  onChange={(e) => handleChange('missionStatement', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-serif font-bold leading-relaxed"
                  placeholder="“To expand access to art through innovative digital solutions, professional exhibitions...”"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mission Strategic Pillars</label>
                <input
                  type="text"
                  value={formData.missionPillars || ''}
                  onChange={(e) => handleChange('missionPillars', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-medium text-emerald-900"
                  placeholder="Digital Access · Education & Preservation · Generational Legacy"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: Core Values & CTA */}
      {activeSubTab === 'core_values' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-art-gold-dark" />
                  <span>Section 5: Our Core Values & Foundational Pillars</span>
                </h3>
                <p className="text-xs text-slate-500">Edit or add core values guiding the Artellium enterprise.</p>
              </div>

              <button
                type="button"
                onClick={addCoreValue}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Value</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={formData.coreValuesBadge || ''}
                  onChange={(e) => handleChange('coreValuesBadge', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
                  placeholder="FOUNDATIONAL PILLARS"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={formData.coreValuesTitle || ''}
                  onChange={(e) => handleChange('coreValuesTitle', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-serif font-bold"
                  placeholder="Our Core Values"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.coreValuesSubtitle || ''}
                  onChange={(e) => handleChange('coreValuesSubtitle', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                  placeholder="The Guiding Principles of Artellium"
                />
              </div>
            </div>

            {/* Value Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {(formData.coreValues || []).map((val, idx) => (
                <div key={val.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">Value #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => deleteCoreValue(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={val.title || ''}
                    onChange={(e) => updateCoreValue(idx, 'title', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-bold"
                    placeholder="e.g. Creativity"
                  />
                  <textarea
                    rows={3}
                    value={val.desc || ''}
                    onChange={(e) => updateCoreValue(idx, 'desc', e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white leading-relaxed"
                    placeholder="We celebrate originality, imagination and artistic excellence."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Call to Action banner */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
              Bottom Call to Action (CTA) Banner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CTA Badge</label>
                <input
                  type="text"
                  value={formData.ctaBadge || ''}
                  onChange={(e) => handleChange('ctaBadge', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
                  placeholder="JOIN THE ARTELLIUM MOVEMENT"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CTA Heading</label>
                <input
                  type="text"
                  value={formData.ctaTitle || ''}
                  onChange={(e) => handleChange('ctaTitle', e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-serif font-bold"
                  placeholder="Experience African Artistic Excellence"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CTA Paragraph</label>
              <textarea
                rows={2}
                value={formData.ctaSubtitle || ''}
                onChange={(e) => handleChange('ctaSubtitle', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                placeholder="Discover curated masterworks, participate in live auction arena broadcasts..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Save Banner */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <p className="text-xs text-slate-500">
          All modifications save to localStorage & global memory, immediately updating <Link href="/about" className="text-amber-700 underline font-bold" target="_blank">/about</Link>.
        </p>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-art-gold via-amber-600 to-art-gold-dark text-white text-xs font-bold uppercase tracking-wider transition shadow-gold-glow flex items-center gap-2 hover:brightness-105"
        >
          <Save className="w-4 h-4" />
          <span>Save All Changes</span>
        </button>
      </div>
    </div>
  );
}
