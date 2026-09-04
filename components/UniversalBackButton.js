'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Home, ChevronRight, Compass } from 'lucide-react';

// Comprehensive human-readable title directory for all platform subpages
const ROUTE_TITLES = {
  '/auctions': 'Live Fine Art Auctions',
  '/auctions/register': 'Bidder Registration',
  '/artist-voices': 'Voices of Master Artists',
  '/explore': 'Curated Marketplace',
  '/flash-deals': 'Fine Art Flash Deals',
  '/exhibitions': 'Curated Pan-African Exhibitions',
  '/curator-picks': "Curator's Elite Selection",
  '/royal-heirlooms': 'Royal African Heirlooms',
  '/verified-masters': 'Verified Living Masters',
  '/provenance-ledger': 'Immutable Provenance Ledger',
  '/recently-sold': 'Recently Acquired Masterworks',
  '/newly-listed': 'Newly Listed Fine Art',
  '/under-1m': 'Curated Works Under ₦1,000,000',
  '/admin/dashboard': 'Executive Admin Console',
  '/artist/dashboard': 'Artist Studio & Gallery',
  '/artist/register': 'Artist Verification & Onboarding',
  '/buyer/account': 'Collector Dashboard',
  '/bidder-registration': 'Live Bidder Registration',
  '/about': 'About Artellium Africa',
  '/contact': 'Concierge & Inquiries',
  '/policies': 'Platform Governance & Policies',
  '/history': 'Bidding History',
  '/catalog': 'Permanent Collection Catalog',
  '/login': 'Collector & Artist Sign In',
  '/register': 'Create Collector Account',
  '/reset-password': 'Password Recovery',
  '/verify-email': 'Email Verification',
  '/lost-masterpiece': 'Provenance Verification',
  '/original-hero': 'Hero Archives',
};

function getPageTitle(pathname) {
  if (!pathname) return '';
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];

  // Dynamic routes handling
  if (pathname.startsWith('/artwork/')) {
    return 'Masterwork Details';
  }
  if (pathname.startsWith('/categories/')) {
    const rawCategory = pathname.replace('/categories/', '').replace(/-/g, ' ');
    return `Collection: ${rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1)}`;
  }
  if (pathname.startsWith('/exhibitions/')) {
    return 'Exhibition Showcase';
  }

  // Fallback: parse last segment
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'Marketplace';
  const last = segments[segments.length - 1];
  return last
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function UniversalBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll for floating quick-back pill on long pages
  useEffect(() => {
    if (typeof window === 'undefined' || pathname === '/') return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // NEVER show back navigation on homepage
  if (!pathname || pathname === '/') {
    return null;
  }

  const pageTitle = getPageTitle(pathname);

  // Safe navigation back to previous screen or fallback to home
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      const referrer = document.referrer || '';
      const isInternal = referrer && referrer.includes(window.location.host);
      if (isInternal || (window.history && window.history.length > 2)) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  return (
    <>
      {/* 1. Universal Top Subpage Navigation Bar */}
      <nav 
        aria-label="Subpage navigation" 
        className="w-full bg-gradient-to-r from-[#0C0F17] via-[#090B10] to-[#0C0F17] border-b border-art-gold/20 py-2.5 px-4 sm:px-6 lg:px-8 relative z-20 shadow-md backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left Group: Back Button + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Primary Back Button */}
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-art-gold hover:text-art-black text-slate-200 hover:border-art-gold border border-white/10 text-xs font-semibold tracking-wide transition-all shadow-sm group cursor-pointer active:scale-95 select-none"
              title="Return to previous page"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back</span>
            </button>

            {/* Subtle Divider */}
            <span className="text-slate-700 hidden sm:inline select-none" aria-hidden="true">|</span>

            {/* Breadcrumb Trail */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 min-w-0">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-art-gold transition font-medium shrink-0"
                title="Return to Artellium Home"
              >
                <Home className="w-3.5 h-3.5 text-art-gold" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" aria-hidden="true" />
              <span className="text-art-gold font-medium truncate max-w-[200px] md:max-w-xs">
                {pageTitle}
              </span>
            </div>
          </div>

          {/* Right Group: Quick Navigation Links */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-xs transition"
              title="Direct link to Home"
            >
              <Home className="w-3.5 h-3.5 sm:hidden" />
              <span className="hidden sm:inline">Return to Home</span>
            </Link>
            <Link
              href="/explore"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-art-gold hover:bg-art-gold/10 text-xs font-medium border border-art-gold/25 transition"
              title="Explore all Artworks"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse Artworks</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Floating Quick-Back Pill for deep scrolling on subpages */}
      {isScrolled && (
        <aside 
          aria-label="Quick back floating navigation" 
          className="fixed bottom-20 md:bottom-8 left-4 sm:left-6 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0E121A]/95 hover:bg-art-gold hover:text-art-black text-slate-100 hover:border-art-gold border border-art-gold/40 shadow-[0_8px_24px_rgba(0,0,0,0.6)] backdrop-blur-md text-xs font-bold tracking-wide transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer"
            title="Go back to previous page"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
        </aside>
      )}
    </>
  );
}
