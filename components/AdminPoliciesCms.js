'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  ShieldCheck, 
  Lock, 
  Award, 
  RotateCcw, 
  Shield, 
  FileText, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit3,
  Search
} from 'lucide-react';

export default function AdminPoliciesCms() {
  const { 
    policiesConfig, 
    updatePoliciesConfig, 
    updatePolicySection, 
    addPolicySection, 
    deletePolicySection, 
    resetPoliciesConfig 
  } = useStore();

  const [formData, setFormData] = useState(policiesConfig || {});
  const [selectedSectionId, setSelectedSectionId] = useState('provenance');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newClauseHeading, setNewClauseHeading] = useState('');
  const [newClauseContent, setNewClauseContent] = useState('');

  useEffect(() => {
    if (policiesConfig) {
      setFormData(policiesConfig);
      if (!selectedSectionId && policiesConfig.sections?.length > 0) {
        setSelectedSectionId(policiesConfig.sections[0].id);
      }
    }
  }, [policiesConfig]);

  const handleHeaderChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    updatePoliciesConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all policies and write-ups to standard platform covenants?')) {
      resetPoliciesConfig();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const currentSection = (formData.sections || []).find(s => s.id === selectedSectionId) || (formData.sections || [])[0];

  const handleSectionFieldChange = (field, value) => {
    if (!currentSection) return;
    const updatedSections = (formData.sections || []).map(s => {
      if (s.id === currentSection.id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleClauseChange = (clauseIndex, field, value) => {
    if (!currentSection) return;
    const updatedDetails = [...(currentSection.details || [])];
    if (updatedDetails[clauseIndex]) {
      updatedDetails[clauseIndex] = { ...updatedDetails[clauseIndex], [field]: value };
      const updatedSections = (formData.sections || []).map(s => {
        if (s.id === currentSection.id) {
          return { ...s, details: updatedDetails };
        }
        return s;
      });
      setFormData(prev => ({ ...prev, sections: updatedSections }));
    }
  };

  const handleDeleteClause = (clauseIndex) => {
    if (!currentSection) return;
    const updatedDetails = [...(currentSection.details || [])].filter((_, i) => i !== clauseIndex);
    const updatedSections = (formData.sections || []).map(s => {
      if (s.id === currentSection.id) {
        return { ...s, details: updatedDetails };
      }
      return s;
    });
    setFormData(prev => ({ ...prev, sections: updatedSections }));
  };

  const handleAddClause = (e) => {
    e.preventDefault();
    if (!newClauseHeading.trim() || !newClauseContent.trim() || !currentSection) return;
    const newDetail = {
      id: `clause-${Date.now()}`,
      heading: newClauseHeading.trim(),
      content: newClauseContent.trim()
    };
    const updatedDetails = [...(currentSection.details || []), newDetail];
    const updatedSections = (formData.sections || []).map(s => {
      if (s.id === currentSection.id) {
        return { ...s, details: updatedDetails };
      }
      return s;
    });
    setFormData(prev => ({ ...prev, sections: updatedSections }));
    setNewClauseHeading('');
    setNewClauseContent('');
  };

  const handleCreateNewPolicySuite = () => {
    const title = window.prompt('Enter new Policy Suite Title (e.g. "International Maritime Fine Art Shipping Policy"):');
    if (!title || !title.trim()) return;
    const newSec = {
      id: `policy-${Date.now()}`,
      title: title.trim(),
      shortTitle: title.trim().substring(0, 20),
      badge: 'OFFICIAL POLICY',
      badgeColor: 'bg-art-gold/15 text-art-gold border-art-gold/30',
      summary: 'Comprehensive policy covenants protecting collectors and artists.',
      details: [
        {
          id: `det-${Date.now()}-1`,
          heading: '1. Policy Scope & Enforcement',
          content: 'Detailed terms and operational conditions established by Artellium Administration.'
        }
      ]
    };
    const updated = [...(formData.sections || []), newSec];
    setFormData(prev => ({ ...prev, sections: updated }));
    setSelectedSectionId(newSec.id);
  };

  const handleDeleteCurrentPolicySuite = () => {
    if (!currentSection) return;
    if (window.confirm(`Are you sure you want to permanently delete the "${currentSection.title}" policy suite?`)) {
      const updated = (formData.sections || []).filter(s => s.id !== currentSection.id);
      setFormData(prev => ({ ...prev, sections: updated }));
      if (updated.length > 0) setSelectedSectionId(updated[0].id);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>PLATFORM LEGAL & GOVERNANCE CMS</span>
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-900">
            Policies & Collector Guarantees — Full Write-up Editor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin has total sovereignty to edit, write, rewrite, add, or remove legal policies, clauses, WEMA Bank escrow terms, and collector protections.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/policies"
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
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 hover:brightness-105"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Policies</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Policies and write-up clauses saved successfully! Live page updated instantly.</span>
        </div>
      )}

      {/* Page Title & Subtitle Settings */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Top Header Write-ups & Subtitles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Top Badge</label>
            <input
              type="text"
              value={formData.headerBadge || ''}
              onChange={(e) => handleHeaderChange('headerBadge', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-mono"
              placeholder="ARTELLIUM TRUST & LEGAL ARCHITECTURE"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Page Title</label>
            <input
              type="text"
              value={formData.headerTitle || ''}
              onChange={(e) => handleHeaderChange('headerTitle', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-serif font-bold"
              placeholder="Policies & Collector Guarantees"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Header Subtitle</label>
            <input
              type="text"
              value={formData.headerSubtitle || ''}
              onChange={(e) => handleHeaderChange('headerSubtitle', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
              placeholder="Protecting African artistic heritage, ensuring immutable provenance..."
            />
          </div>
        </div>
      </div>

      {/* Policy Selector Navigation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Select Policy Suite to Edit
          </span>
          <button
            type="button"
            onClick={handleCreateNewPolicySuite}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Policy Suite</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(formData.sections || []).map((sec) => {
            const isSelected = sec.id === selectedSectionId;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSectionId(sec.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span>{sec.shortTitle || sec.title}</span>
                <span className="text-[10px] bg-slate-800/20 px-1.5 py-0.2 rounded font-mono">
                  {sec.details?.length || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Policy Editor */}
      {currentSection && (
        <div className="p-6 rounded-2xl border-2 border-slate-200 bg-white space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider block">
                POLICY IDENTIFIER: {currentSection.id}
              </span>
              <h3 className="text-lg font-serif font-black text-slate-900">
                {currentSection.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleDeleteCurrentPolicySuite}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Policy Suite</span>
            </button>
          </div>

          {/* Policy Meta Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Title</label>
              <input
                type="text"
                value={currentSection.title || ''}
                onChange={(e) => handleSectionFieldChange('title', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Nav Title</label>
              <input
                type="text"
                value={currentSection.shortTitle || ''}
                onChange={(e) => handleSectionFieldChange('shortTitle', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Badge Label</label>
              <input
                type="text"
                value={currentSection.badge || ''}
                onChange={(e) => handleSectionFieldChange('badge', e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Policy Summary Statement</label>
            <textarea
              rows={2}
              value={currentSection.summary || ''}
              onChange={(e) => handleSectionFieldChange('summary', e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 font-medium"
            />
          </div>

          {/* Detailed Clauses & Write-ups */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Detailed Clauses & Numbered Terms ({currentSection.details?.length || 0})
                </h4>
                <p className="text-[11px] text-slate-500">Edit headings and full descriptive paragraph text.</p>
              </div>
            </div>

            <div className="space-y-4">
              {(currentSection.details || []).map((detail, cIdx) => (
                <div key={detail.id || cIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Clause #{cIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteClause(cIdx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Clause</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Clause Heading</label>
                    <input
                      type="text"
                      value={detail.heading || ''}
                      onChange={(e) => handleClauseChange(cIdx, 'heading', e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Clause Full Write-up Content</label>
                    <textarea
                      rows={4}
                      value={detail.content || ''}
                      onChange={(e) => handleClauseChange(cIdx, 'content', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white leading-relaxed font-sans"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Clause Box */}
            <form onSubmit={handleAddClause} className="p-4 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 space-y-3 mt-4">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                + Add New Clause to this Policy
              </span>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Clause Heading (e.g. 4. Sovereign Fiduciary Custody)"
                  value={newClauseHeading}
                  onChange={(e) => setNewClauseHeading(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-emerald-200 bg-white font-bold"
                />
                <textarea
                  rows={3}
                  placeholder="Full Clause Paragraph Content..."
                  value={newClauseContent}
                  onChange={(e) => setNewClauseContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-emerald-200 bg-white leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={!newClauseHeading.trim() || !newClauseContent.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Clause</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Footer Save Banner */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <p className="text-xs text-slate-500">
          All modifications save to localStorage & global memory, immediately updating <Link href="/policies" className="text-emerald-700 underline font-bold" target="_blank">/policies</Link>.
        </p>

        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-2 hover:brightness-105"
        >
          <Save className="w-4 h-4" />
          <span>Save All Policies</span>
        </button>
      </div>
    </div>
  );
}
