'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { useLanguage } from '@/context/language-context';
import UserAccountMenu from '@/components/UserAccountMenu';
import {
  Search,
  ShoppingBag,
  ShieldCheck,
  Flame,
  Globe,
  PlusCircle,
  Sparkles,
  ChevronDown,
  Menu,
  Eye,
  Film,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    cart,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    currency,
    setCurrency,
    setIsSidebarOpen,
    headerConfig
  } = useStore();

  const { currentLanguage, setLanguage, t, languagesList } = useLanguage();

  const hConfig = headerConfig || {
    topBarText: 'The Premier Pan-African & Global Fine Art Marketplace',
    topBarBadge: 'ARTELLIUM',
    announcementActive: true,
    brandName: 'ARTELLIUM',
    brandSubtitle: 'FINE ART & AUCTIONS',
    showLanguageSelector: true,
    showCurrencySelector: true
  };

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);
  const searchCategories = [
    { value: 'All', label: 'All Categories', slug: '' },
    { value: 'Paintings', label: 'Paintings', slug: 'paintings' },
    { value: 'Sculptures', label: 'Sculptures', slug: 'sculptures' },
    { value: 'Drawings', label: 'Drawings', slug: 'drawings' },
    { value: 'Photography', label: 'Photography', slug: 'photography' },
    { value: 'Textiles', label: 'Textiles', slug: 'textiles' },
    { value: 'Pottery', label: 'Pottery', slug: 'pottery' },
    { value: 'Ceramics', label: 'Ceramics', slug: 'ceramics' },
    { value: 'Woodworks', label: 'Woodworks', slug: 'woodworks' },
    { value: 'Metal works', label: 'Metal Works', slug: 'metal-works' },
    { value: 'Handmade crafts', label: 'Handmade Crafts', slug: 'handmade-crafts' },
    { value: 'Indigenous artworks', label: 'Indigenous Artworks', slug: 'indigenous-artworks' },
    { value: 'Limited edition collections', label: 'Limited Edition Collections', slug: 'limited-editions' },
  ];

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    const catObj = searchCategories.find(c => c.value === val);
    if (catObj && catObj.slug && !searchQuery.trim()) {
      router.push(`/categories/${catObj.slug}`);
    } else if (catObj && catObj.slug && searchQuery.trim()) {
      router.push(`/categories/${catObj.slug}?q=${encodeURIComponent(searchQuery.trim())}`);
    } else if (val === 'All' && searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    const catObj = searchCategories.find(c => c.value === selectedCategory);
    if (catObj && catObj.slug) {
      router.push(`/categories/${catObj.slug}${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    } else {
      router.push(`/explore${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07080A]/95 backdrop-blur-md border-b border-art-gold/20 shadow-2xl">
      {/* Top Heritage & Role Switcher Bar */}
      {hConfig.announcementActive !== false && (
        <div className="bg-gradient-to-r from-art-green via-[#0D1512] to-art-red py-1.5 px-4 text-xs border-b border-art-gold/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-art-gold animate-pulse"></span>
              <span className="font-semibold text-art-gold tracking-wide">
                {hConfig.topBarBadge || 'ARTELLIUM'}
              </span>
              <span className="hidden md:inline text-slate-400">|</span>
              <span className="hidden md:inline text-slate-300">
                {t('topBarText', hConfig.topBarText || 'The Premier Pan-African & Global Fine Art Marketplace')}
              </span>
            </div>

            {/* Quick Role Switcher & Currency Toggle */}
            <div className="flex items-center gap-3">
              {/* Language Translator */}
              {hConfig.showLanguageSelector !== false && (
                <div className="flex items-center gap-1.5 bg-black/45 px-2.5 py-0.5 rounded-lg border border-art-gold/30 text-[11px] shadow-sm">
                  <span className="text-[11px]">🌐</span>
                  <select
                    value={currentLanguage}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-slate-200 text-[11px] focus:outline-none cursor-pointer pr-1 font-medium font-sans border-none select-none appearance-none"
                    title="Change Platform Language"
                  >
                    {languagesList.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-[#0b0c10] text-white">
                        {lang.flag} {lang.code} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Currency toggle */}
              {hConfig.showCurrencySelector !== false && (
                <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/10 text-[11px]">
                  <Globe className="w-3 h-3 text-art-gold" />
                  <button
                    onClick={() => setCurrency(currency === 'NGN' ? 'USD' : 'NGN')}
                    className="hover:text-art-gold transition font-mono font-medium"
                  >
                    {currency === 'NGN' ? '🇳🇬 NGN (₦)' : '🌍 USD ($)'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group shrink-0" title="ARTELLIUM - Fine Art & Auctions">
            <img
              src="/artellium_brand_logo.png"
              alt="ARTELLIUM Fine Art & Auctions"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Jumia-Style Main Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl items-center bg-art-black-card border border-art-gold/25 rounded-xl overflow-hidden focus-within:border-art-gold transition shadow-inner"
          >
            <div className="relative border-r border-art-black-border">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="bg-transparent text-slate-300 text-xs px-3 py-2.5 focus:outline-none appearance-none cursor-pointer pr-7 font-medium"
              >
                {searchCategories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-art-black-card text-white">
                    {cat.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <input
              type="text"
              placeholder={t('searchPlaceholder', 'Search painters, bronze sculptors, artwork titles...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-art-gold to-art-gold-dark hover:brightness-110 text-art-black px-4 py-2.5 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{t('searchBtn', 'SEARCH')}</span>
            </button>
          </form>

          {/* Right Action Icons & Directives */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Voices of Master Artists Quick Link */}
            <Link
              href="/artist-voices"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-art-gold hover:text-white bg-art-gold/10 border border-art-gold/30 px-3 py-1.5 rounded-full transition shadow-sm"
              title="Voices of Master Artists"
            >
              <Film className="w-3.5 h-3.5 text-art-gold" />
              <span>Voices of Artists</span>
            </Link>

            {/* Live Auction Quick Link */}
            <Link
              href="/auctions"
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/40 border border-red-800/40 px-3 py-1.5 rounded-full transition shadow-crimson-glow"
            >
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span>{t('liveAuctions', 'Live Auctions')}</span>
            </Link>

            {/* Virtual Exhibition */}
            <Link
              href="/exhibitions"
              className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full transition shadow-emerald-glow"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>{t('exhibitions', 'Exhibitions')}</span>
            </Link>

            {/* Artist Self-Service Portal */}
            <Link
              href="/artist/dashboard"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-art-gold hover:text-art-gold-bright bg-art-gold/10 border border-art-gold/30 px-3 py-1.5 rounded-lg transition"
            >
              <PlusCircle className="w-4 h-4 text-art-gold" />
              <span>{t('sellArtwork', 'Sell Artwork')}</span>
            </Link>

            {/* Admin Dashboard */}
            {currentUser?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1.5 rounded-lg transition animate-pulse-subtle"
              >
                <ShieldCheck className="w-4 h-4 text-art-gold" />
                <span>Admin</span>
              </Link>
            )}

            {/* Standard User Account Dropdown Menu */}
            <UserAccountMenu />

            {/* Cart Icon Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-art-black-card border border-art-gold/30 hover:border-art-gold transition text-white group"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-art-gold group-hover:scale-110 transition transform" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-art-red text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border border-art-gold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Premium Sliding Hamburger Menu Trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl bg-art-black-card border border-art-gold/30 hover:border-art-gold transition text-white group flex items-center justify-center"
              aria-label="Toggle Portal Menu"
            >
              <Menu className="w-5 h-5 text-art-gold group-hover:rotate-90 transition transform duration-300" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-2.5 md:hidden flex items-center relative">
          <div className="relative w-full flex items-center bg-[#0E121A] border border-art-gold/30 focus-within:border-art-gold rounded-xl overflow-hidden shadow-inner transition">
            <Search className="w-4 h-4 text-art-gold absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search African masters, titles, mediums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-9 pr-20 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 bg-gradient-to-r from-art-gold to-amber-600 text-art-black rounded-lg font-bold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
