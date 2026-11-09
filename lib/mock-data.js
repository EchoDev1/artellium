export const INITIAL_ARTWORKS = [];

export const getArtistBriefHistory = (artistName = '', country = '', medium = '') => {
  const normalized = String(artistName || '').toLowerCase();

  if (normalized.includes('ebuka') || normalized.includes('echo')) {
    return 'Ebuka Eke Echo is a verified sovereign master artist based in Lagos, Nigeria. His creative philosophy unites ancient bronze craftsmanship, royal heritage iconography, and contemporary African sovereign expression into monumental visual statements recognized across the African continent and globally.';
  }

  return `${artistName || 'This master artist'} is a distinguished African visual creator recognized for dedication to cultural preservation, material mastery, and authentic creative sovereignty. Working across traditional techniques and contemporary mediums, their works document the enduring vibrancy of African heritage for global collectors and archival institutions.`;
};

export const ARTIST_VIDEOS = [];

export const VIRTUAL_EXHIBITIONS = [
  {
    id: 'ex-101',
    slug: 'dynasties-of-the-niger',
    title: 'Dynasties of the Niger: Benin Bronze & Sacred Timber',
    timingCategory: 'current',
    format: 'Physical exhibitions',
    formatLabel: 'Physical Exhibition',
    location: 'National Museum Pavilion, Lagos, Nigeria',
    accessibleCities: ['Lagos', 'Abuja', 'London', 'New York'],
    sdgDiscussion: 'SDG 11: Sustainable Cities & Cultural Heritage Preservation',
    sdgTag: 'SDG 11',
    curator: 'Artellium Curatorial Directorate',
    curatorTitle: 'Senior Directorate of Pan-African Antiquities',
    curatorAvatar: '',
    curatorStatement: 'Dynasties of the Niger stands as a profound inquiry into the metallurgical mastery and sacred woodcraft of the Niger Basin kingdoms. By uniting ancestral lost-wax bronze castings with sustainably harvested sacred timbers, this exhibition demonstrates how ancient African craft ecosystems established timeless models of environmental stewardship long before contemporary sustainability frameworks.',
    status: 'Live Now',
    startDate: 'Feb 1, 2026',
    endDate: 'Mar 30, 2026',
    openingHours: 'Tuesday – Sunday: 10:00 AM – 7:00 PM WAT',
    coverImage: '',
    featuredArtworksCount: 24,
    participatingArtists: [
      { name: 'Ebuka Eke Echo', role: 'Verified Sovereign Master Artist', country: 'Nigeria 🇳🇬', avatar: '' },
      { name: 'Ekele Ojogbe Mercy', role: 'Contemporary Fine Art Painter', country: 'Nigeria 🇳🇬', avatar: '' },
      { name: 'Nkechi Uduma', role: 'Fine Art Creator', country: 'Nigeria 🇳🇬', avatar: '' }
    ],
    exhibitedArtworks: [],
    virtualGalleryAvailable: true,
    description: 'A physical landmark museum exhibition examining the monumental heritage of West African bronze foundry casting, sacred timber carving, and indigenous sustainability practices.',
  },
  {
    id: 'ex-102',
    slug: 'pan-african-3d-spatial',
    title: 'Pan-African 3D Spatial Continuum',
    timingCategory: 'virtual',
    format: 'Virtual exhibitions',
    formatLabel: '3D Virtual Exhibition Room',
    location: 'Interactive 3D WebGL Spatial Gallery (Global Access: Lagos • Abuja • London • New York)',
    accessibleCities: ['Abuja', 'Lagos', 'London', 'New York', 'Worldwide'],
    sdgDiscussion: 'SDG 9: Industry, Innovation & Digital Infrastructure in Fine Art',
    sdgTag: 'SDG 9',
    curator: 'Artellium Spatial Curatorial Council',
    curatorTitle: 'Digital Fine Art & Spatial Curatorial Division',
    curatorAvatar: '',
    curatorStatement: 'The 3D Spatial Continuum dismantles geographical barriers between African creators and global collectors. Whether stepping in from an office in London, an apartment in Manhattan, or a salon in Abuja and Lagos, visitors explore ultra-high resolution masterworks in a physics-simulated architectural gallery space.',
    status: 'Live Now',
    startDate: 'Jan 15, 2026',
    endDate: 'Ongoing (24/7 Global Immersion)',
    openingHours: 'Always Open (24/7 WebGL 3D Immersion)',
    coverImage: '',
    featuredArtworksCount: 18,
    participatingArtists: [
      { name: 'Ebuka Eke Echo', role: 'Master Creator', country: 'Nigeria 🇳🇬', avatar: '' },
      { name: 'Esther Moses', role: 'Visual Artist', country: 'Nigeria 🇳🇬', avatar: '' }
    ],
    exhibitedArtworks: [],
    virtualGalleryAvailable: true,
    description: 'An interactive virtual museum journey connecting global collectors with certified African master painters, sculptors, and digital creators worldwide.',
  },
  {
    id: 'ex-103',
    slug: 'earth-pigments-salon',
    title: 'Earth Pigments & Sustainable Living Salon',
    timingCategory: 'current',
    format: 'Pop-up galleries',
    formatLabel: 'Pop-Up Gallery',
    location: 'Victoria Island Curatorial Lounge, Lagos (Virtual Access Global)',
    accessibleCities: ['Lagos', 'Abuja', 'London', 'New York'],
    sdgDiscussion: 'SDG 12: Responsible Consumption & Eco-Friendly Raw Earth Pigments',
    sdgTag: 'SDG 12',
    curator: 'Artellium Eco-Art Curatorial Desk',
    curatorTitle: 'Eco-Art Practitioners & Curators',
    curatorAvatar: '',
    curatorStatement: 'Earth Pigments & Sustainable Living explores the tactile dialogue between African mineral soils, botanical vegetable tinctures, and contemporary easel practice.',
    status: 'Live Now',
    startDate: 'Feb 10, 2026',
    endDate: 'Apr 10, 2026',
    openingHours: 'Wednesday – Sunday: 11:00 AM – 8:00 PM WAT',
    coverImage: '',
    featuredArtworksCount: 14,
    participatingArtists: [
      { name: 'Peace Ogbua', role: 'Contemporary Artist', country: 'Nigeria 🇳🇬', avatar: '' },
      { name: 'Dorcas Daniel', role: 'Sculptor', country: 'Nigeria 🇳🇬', avatar: '' }
    ],
    exhibitedArtworks: [],
    virtualGalleryAvailable: true,
    description: 'An intimate pop-up gallery and curatorial salon hosting live discussions on zero-waste art creation, natural vegetable dyes, and sustainable living through traditional arts.',
  }
];

export const SUBSCRIPTION_PLANS = [
  {
    id: 'standard',
    name: 'Standard Artist',
    monthlyPrice: 30000, // ₦30,000
    yearlyPrice: 200000, // ₦200,000 (discounted)
    currency: 'NGN',
    badge: 'Standard Badge',
    features: [
      'Upload up to 15 Artworks per month',
      'Personalized Artist Profile & Bio',
      'Standard Marketplace Catalog Listing',
      'Buyer Direct Messaging & Inquiries',
      'Standard Sales Analytics Dashboard',
    ],
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Premium Artist',
    monthlyPrice: 50000, // ₦50,000
    yearlyPrice: 350000, // ₦350,000 (discounted)
    currency: 'NGN',
    badge: 'Premium Verified Gold Crest',
    features: [
      'Unlimited High-Resolution Art Uploads',
      'Priority Homepage Hero Spotlight Placement',
      'Access to ARTELLIUM Live Auction Arena',
      'Pop-up Video Interview Inclusion (Admin Crated)',
      'Virtual Exhibition Gallery Solo Rooms',
      'Dedicated Curator Concierge & Global Logistics Support',
    ],
    recommended: true,
  },
];

export const CUSTOMER_REVIEWS = [];


export const INITIAL_USERS = [
  { 
    id: 'user-admin-1', 
    name: 'Executive Administrator (Dakore Ekpendu)', 
    email: 'Ekpendudakore@gmail.com', 
    role: 'admin', 
    password: 'ladydakore@artellium90', 
    phone: '', 
    country: 'Nigeria', 
    subscription_tier: 'premium',
    status: 'active',
    statusReason: '',
    created_at: '2026-01-01T00:00:00Z',
    lastActive: '2026-02-22T17:00:00Z',
    cloudflareVerified: true,
    ipAddress: '',
    securityIncidents: []
  }
];

export const INITIAL_SELLERS = [];

export const INITIAL_ORDERS = [];

export const INITIAL_PAYMENTS = [];

export const INITIAL_COMMISSIONS = [];

export const INITIAL_HEADER_CONFIG = {
  topBarText: 'The Premier Pan-African & Global Fine Art Marketplace',
  topBarBadge: 'ARTELLIUM',
  announcementActive: true,
  brandName: 'ARTELLIUM',
  brandSubtitle: 'FINE ART & AUCTIONS',
  showLanguageSelector: true,
  showCurrencySelector: true,
  navLinks: [
    { id: 'nav-1', label: 'All Artworks', href: '/explore', isVisible: true, highlight: 'none' },
    { id: 'nav-2', label: 'Painters', href: '/explore?category=Painters', isVisible: true, highlight: 'none' },
    { id: 'nav-3', label: 'Sculpture Makers', href: '/explore?category=Sculpture Makers', isVisible: true, highlight: 'none' },
    { id: 'nav-4', label: 'Digital Art', href: '/explore?category=Digital Art', isVisible: true, highlight: 'none' },
    { id: 'nav-5', label: 'Live Auctions', href: '/auctions', isVisible: true, highlight: 'red', icon: 'Flame' },
    { id: 'nav-6', label: 'Virtual Exhibitions', href: '/exhibitions', isVisible: true, highlight: 'emerald', icon: 'Eye' }
  ]
};

export const INITIAL_HERO_CONFIG = {
  heroType: 'jumia_art_hero',
  brandName: 'ARTELLIUM',
  badgeText: 'AFRICAN ROYALTY MEETS GLOBAL FINE ART COMMERCE',
  tagline: 'The future of African art is safe',
  voiceText: 'Welcome to Artellium. The future of African art is safe.',
  titleLine1: "The World's Premier",
  titleHighlight: 'Pan-African Fine Art',
  titleLine2: '& Auction House',
  description: 'Connecting elite African painters, bronze sculptors, and digital creators with global collectors, museums, and investors. Structured with verifiable provenance and direct Wema Bank corporate settlement.',
  mediaType: 'video',
  mediaUrl: '',
  videoUrl: '',
  videoPoster: '',
  videoAutoplay: true,
  videoMuted: true,
  videoLoop: true,
  videoOverlayOpacity: 0.65,
  maxHeroSlides: 4,
  featuredLot: {
    badge: 'FEATURED MASTERWORK',
    title: 'Her Horizon',
    artist: 'Ekele Ojogbe Mercy (Nigeria)',
    price: '₦100,000',
    medium: 'Acrylic on Canvas',
    image: '',
    artworkId: 'art-live-1791514654559-upxk',
    isVisible: false,
  },
  primaryCta: { label: 'Explore Catalog', href: '/explore', isVisible: true },
  secondaryCta: { label: 'Enter Live Auction', href: '/auctions', isVisible: true },
  tertiaryCta: { label: 'Artist Onboarding (₦30k - ₦50k/mo)', href: '/artist/register', isVisible: true },
  stats: [],
  slides: []
};

export const INITIAL_HOMEPAGE_CONFIG = {
  sections: [
    { id: 'sec-hero', type: 'hero', title: 'Hero Section', isVisible: true },
    { id: 'sec-categories', type: 'categories', title: 'Category Filter Bar', isVisible: true },
    { 
      id: 'sec-auctions', 
      type: 'auctions', 
      title: 'Live Fine Art Auctions', 
      subtitle: 'Participate in real-time competitive bidding for high-value African masterworks.', 
      badge: 'LIVE BIDDING ARENA', 
      isVisible: true,
      maxItems: 6
    },
    { 
      id: 'sec-newly-listed', 
      type: 'newly_listed', 
      title: 'Newly Listed Artworks', 
      subtitle: 'Fresh creations uploaded directly by verified master painters, sculptors, and digital artists.', 
      badge: 'CURATED MARKETPLACE', 
      isVisible: true,
      maxItems: 9
    },
    { 
      id: 'sec-recently-sold', 
      type: 'recently_sold', 
      title: 'Recently Sold Masterpieces', 
      subtitle: 'Transactions logged in our immutable ledger of African creative heritage and authenticity registry.', 
      badge: 'HISTORICAL LEDGER & PROVENANCE', 
      isVisible: true,
      maxItems: 6
    },
    { 
      id: 'sec-exhibitions', 
      type: 'exhibitions', 
      title: 'Current Exhibitions', 
      subtitle: 'Explore curated virtual gallery halls from top African museum directors and curators.', 
      badge: 'VIRTUAL GALLERY ROOMS', 
      isVisible: true,
      maxItems: 4
    }
  ],
  customPromoBanners: []
};

export const INITIAL_FOOTER_CONFIG = {
  brandTitle: 'ARTELLIUM',
  brandDescription: 'ARTELLIUM bridges ancient African artistic royalty with cutting-edge global fine art commerce. Empowering painters, sculptors, and digital creators through transparent auctions and authentic gallery exhibitions.',
  newsletterTitle: 'Join collector newsletter...',
  newsletterButtonText: 'Join',
  copyrightNotice: '© {year} ARTELLIUM AFRICA & GLOBAL MARKETPLACE. All rights reserved.',
  bottomSubtext: 'Crafted with cultural pride & global excellence for African Master Creators.',
  trustBadges: [
    {
      id: 'badge-1',
      title: 'Authenticity Guarantee',
      description: 'Physical certificate signed by artist & curator.',
      icon: 'Award',
      color: 'gold',
      isVisible: true
    },
    {
      id: 'badge-2',
      title: 'Curatorial Excellence',
      description: 'Accredited provenance & authentic gallery exhibitions.',
      icon: 'Shield',
      color: 'emerald',
      isVisible: true
    },
    {
      id: 'badge-3',
      title: 'Wema Bank Secured Settlement',
      description: 'Direct corporate banking & instant payment settlement.',
      icon: 'Lock',
      color: 'gold',
      isVisible: true
    },
    {
      id: 'badge-4',
      title: 'Master Artist Support',
      description: 'Directly empowering pan-African talent.',
      icon: 'Shield',
      color: 'gold',
      isVisible: true
    }
  ],
  columns: [
    {
      id: 'col-1',
      title: 'About Us',
      links: [
        { id: 'link-c1-1', label: 'Artellium Goal', href: '/about#goal', isVisible: true, highlight: 'gold' },
        { id: 'link-c1-2', label: 'Who We Are', href: '/about#who-we-are', isVisible: true },
        { id: 'link-c1-3', label: 'Our Vision', href: '/about#vision', isVisible: true },
        { id: 'link-c1-4', label: 'Our Mission', href: '/about#mission', isVisible: true },
        { id: 'link-c1-5', label: 'Our Core Values', href: '/about#core-values', isVisible: true }
      ]
    },
    {
      id: 'col-2',
      title: 'Policies',
      links: [
        { id: 'link-c2-1', label: 'Terms of Provenance & Authenticity', href: '/policies#provenance', isVisible: true },
        { id: 'link-c2-2', label: 'Wema Bank Direct Banking & Settlement', href: '/policies#wema-banking', isVisible: true },
        { id: 'link-c2-3', label: 'Authenticity Guarantee & Consignment', href: '/policies#consignment', isVisible: true },
        { id: 'link-c2-4', label: 'Direct Bank Refunds & Disputes', href: '/policies#refunds', isVisible: true, highlight: 'emerald' },
        { id: 'link-c2-5', label: 'Privacy & Financial Data Security', href: '/policies#privacy', isVisible: true },
        { id: 'link-c2-6', label: 'Artist & Seller Code of Conduct', href: '/policies#seller-conduct', isVisible: true }
      ]
    },
    {
      id: 'col-3',
      title: 'Contact Us',
      links: [
        { id: 'link-c3-1', label: 'Email: Ekpendudakore@gmail.com', href: 'mailto:Ekpendudakore@gmail.com', isVisible: true, highlight: 'gold' },
        { id: 'link-c3-4', label: 'Our Gallery Locations', href: '/contact#locations', isVisible: true },
        { id: 'link-c3-5', label: 'Send Us a Message', href: '/contact', isVisible: true, highlight: 'emerald' }
      ]
    }
  ],
  socialLinks: [
    { id: 'soc-1', platform: 'Instagram', url: 'https://instagram.com', isVisible: true },
    { id: 'soc-2', platform: 'Twitter / X', url: 'https://x.com', isVisible: true },
    { id: 'soc-3', platform: 'LinkedIn', url: 'https://linkedin.com', isVisible: true },
    { id: 'soc-4', platform: 'YouTube', url: 'https://youtube.com', isVisible: true }
  ]
};

// =========================================================================
// PAN-AFRICAN MULTI-CURRENCY & REGIONAL HUBS CONFIGURATION
// =========================================================================
export const PAN_AFRICAN_CURRENCIES = {
  NGN: { code: 'NGN', symbol: '₦', rate: 1, name: 'Nigerian Naira (₦)', flag: '🇳🇬', country: 'Nigeria' },
  USD: { code: 'USD', symbol: '$', rate: 1 / 1480, name: 'US Dollar ($)', flag: '🌐', country: 'International' },
  GHS: { code: 'GHS', symbol: 'GH₵', rate: 1 / 95, name: 'Ghanaian Cedi (GH₵)', flag: '🇬🇭', country: 'Ghana' },
  ZAR: { code: 'ZAR', symbol: 'R', rate: 1 / 80, name: 'South African Rand (R)', flag: '🇿🇦', country: 'South Africa' },
  KES: { code: 'KES', symbol: 'KSh', rate: 1 / 11.5, name: 'Kenyan Shilling (KSh)', flag: '🇰🇪', country: 'Kenya' },
  MAD: { code: 'MAD', symbol: 'MAD ', rate: 1 / 145, name: 'Moroccan Dirham (MAD)', flag: '🇲🇦', country: 'Morocco' },
  EGP: { code: 'EGP', symbol: 'E£', rate: 1 / 30, name: 'Egyptian Pound (E£)', flag: '🇪🇬', country: 'Egypt' },
  XOF: { code: 'XOF', symbol: 'CFA ', rate: 1 / 2.4, name: 'West African CFA (CFA)', flag: '🌍', country: 'UEMOA Region' }
};

export const PAN_AFRICAN_REGIONS = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', hub: 'Lagos Headquarters', currency: 'NGN', status: 'Active (HQ)', taxRate: 7.5, artistsCount: 0, activeCollectors: 0 },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', hub: 'Accra Curatorial Bureau', currency: 'GHS', status: 'Active (Direct)', taxRate: 15.0, artistsCount: 0, activeCollectors: 0 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', hub: 'Johannesburg Regional Bureau', currency: 'ZAR', status: 'Active (Direct)', taxRate: 15.0, artistsCount: 0, activeCollectors: 0 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', hub: 'Nairobi East Africa Desk', currency: 'KES', status: 'Active (Direct)', taxRate: 16.0, artistsCount: 0, activeCollectors: 0 },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', hub: 'Marrakech Atelier Desk', currency: 'MAD', status: 'Active (Direct)', taxRate: 20.0, artistsCount: 0, activeCollectors: 0 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', hub: 'Cairo Nile Gallery', currency: 'EGP', status: 'Active (Direct)', taxRate: 14.0, artistsCount: 0, activeCollectors: 0 },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', hub: 'Kigali Cultural Hub', currency: 'USD', status: 'Active (Direct)', taxRate: 18.0, artistsCount: 0, activeCollectors: 0 },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', hub: 'Dakar Biennale Bureau', currency: 'XOF', status: 'Active (Direct)', taxRate: 18.0, artistsCount: 0, activeCollectors: 0 },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', hub: 'Abidjan Arts Center', currency: 'XOF', status: 'Active (Direct)', taxRate: 18.0, artistsCount: 0, activeCollectors: 0 }
];

export const INITIAL_FLASH_DEALS = [];

export const INITIAL_ROYAL_HEIRLOOMS = [];

export const INITIAL_ROYAL_INQUIRIES = [];

export const INITIAL_CURATOR_PICKS = [];

export const INITIAL_LEDGER_BLOCKS = [];

export const INITIAL_ARTIST_VERIFICATIONS = [];

// =========================================================================
// INITIAL ABOUT US CONFIG (CMS EDITABLE)
// =========================================================================
export const INITIAL_ABOUT_CONFIG = {
  badge: 'PAN-AFRICAN DIGITAL ART MARKETPLACE & CREATIVE ENTERPRISE',
  title: 'Where Art Meets Culture, Commerce & Innovation.',
  titleHighlight: 'Culture, Commerce & Innovation.',
  creed: '“At Artellium, we believe that every artwork tells a story, every artist has a voice and a face”.',
  creedAuthor: '— The Artellium Creed',
  goalBadge: 'STRATEGIC MANDATE',
  goalTitle: 'Artellium Goal',
  goalTag: 'Creative Enterprise',
  goalQuote: '“At Artellium, we believe that every artwork tells a story, every artist has a voice and a face”.',
  goalParagraph1: 'Artellium is a digital art marketplace and creative enterprise dedicated to transforming the way art is discovered, appreciated, traded and preserved. We provide an innovative platform where artists, collectors, investors and art enthusiasts connect through technology to buy, sell, celebrate creativity and cultural heritage.',
  goalParagraph2: 'Artellium serves as a comprehensive ecosystem for the buying and selling of artworks and crafts, online and physical exhibitions, art auctions, artist promotion, creative storytelling, and the preservation of artistic history. By combining digital innovation with traditional artistic values, Artellium creates opportunities for artists to gain global visibility while making authentic works accessible to collectors and audiences worldwide.',
  ecosystemHighlights: [
    { id: 'eco-1', title: 'Art & Crafts Marketplace', desc: 'Authentic buying & selling of original masterworks.', icon: 'Sparkles' },
    { id: 'eco-2', title: 'Hybrid Exhibitions', desc: '3D WebGL virtual halls and physical museum showcases.', icon: 'Eye' },
    { id: 'eco-3', title: 'Live Arena Auctions', desc: 'Real-time competitive bidding and instant settlement.', icon: 'Flame' },
    { id: 'eco-4', title: 'History Preservation', desc: 'Immutable provenance records and digital certificates.', icon: 'BookOpen' }
  ],
  whoWeAreBadge: 'IDENTITY & COMMITMENT',
  whoWeAreTitle: 'Who We Are',
  whoWeAreTag: 'Artellium Limited',
  whoWeAreLead: 'Artellium Limited is more than an online art marketplace. It is a creative hub where art meets commerce, education, culture and technology.',
  forArtistsTitle: 'For Emerging & Established Artists',
  forArtistsText: 'We are committed to creating sustainable opportunities for emerging and established artists by providing a secure and transparent platform that enables them to showcase their works, build their brands, engage audiences and generate income.',
  forCollectorsTitle: 'For Collectors & Discerning Buyers',
  forCollectorsText: 'For collectors and buyers, we provide access to carefully curated original artworks, authentic crafts, limited editions, collectibles and exclusive pieces from diverse artistic traditions and contemporary Creators.',
  servicesBadge: 'DIGITAL COMMERCE & DISCOVERY',
  servicesTitle: 'Our Services',
  servicesTag: 'Online Art Marketplace',
  servicesSubtitle: 'Artellium provides a secure digital marketplace where collectors and buyers can discover and purchase authentic African masterworks, sculpture, prints, and traditional craft.',
  exhibitionsBadge: 'SDGs Dialogues for Sustainable Living',
  exhibitionsTitle: 'Art Exhibitions',
  exhibitionsLead: 'We curate exhibitions that showcase artistic excellence while connecting creators with wider audiences through various SDGs discussions for a sustainable living.',
  auctionsBadge: 'Live, Upcoming & Past Auctions',
  auctionsTitle: 'Online Auction House',
  auctionsLead: 'Our Online Auction House provides authenticated collectors, museum trusts, and international patrons with transparent real-time bidding for high-value African masterworks, lost-wax bronze castings, and limited museum editions.',
  visionBadge: 'FUTURE ASPIRATION',
  visionTitle: 'Our Vision',
  visionStatement: '“To become Africa’s leading digital art marketplace and one of the world’s most trusted platforms for promoting creativity, preserving artistic heritage and connecting artists with global audiences.”',
  visionPillars: 'Pan-African Leadership · Global Reach · Trust Infrastructure',
  missionBadge: 'CORE MANDATE',
  missionTitle: 'Our Mission',
  missionStatement: '“To expand access to art through innovative digital solutions, professional exhibitions, transparent marketplaces, educational initiatives and histories appreciation across generations.”',
  missionPillars: 'Digital Access · Education & Preservation · Generational Legacy',
  coreValuesBadge: 'FOUNDATIONAL PILLARS',
  coreValuesTitle: 'Our Core Values',
  coreValuesSubtitle: 'The Guiding Principles of Artellium',
  coreValues: [
    { id: 'val-1', title: 'Creativity', desc: 'We celebrate originality, imagination and artistic excellence.', icon: 'Sparkles' },
    { id: 'val-2', title: 'Integrity', desc: 'We uphold transparency, authenticity, fairness and professionalism in every transaction.', icon: 'ShieldCheck' },
    { id: 'val-3', title: 'Collaboration', desc: 'We build lasting relationships between artists, institutions, collectors, communities and creative industries.', icon: 'HeartHandshake' }
  ],
  ctaBadge: 'JOIN THE ARTELLIUM MOVEMENT',
  ctaTitle: 'Experience African Artistic Excellence',
  ctaSubtitle: 'Discover curated masterworks, participate in live auction arena broadcasts, or partner with us to empower creators across the globe.'
};

// =========================================================================
// INITIAL POLICIES CONFIG (CMS EDITABLE)
// =========================================================================
export const INITIAL_POLICIES_CONFIG = {
  headerBadge: 'ARTELLIUM TRUST & LEGAL ARCHITECTURE',
  headerTitle: 'Policies & Collector Guarantees',
  headerSubtitle: 'Protecting African artistic heritage, ensuring immutable provenance, and safeguarding every fine art transaction with WEMA Bank secured corporate settlement.',
  sections: [
    {
      id: 'provenance',
      title: 'Terms of Provenance & Authenticity',
      shortTitle: 'Provenance & Authenticity',
      badge: 'IMMUTABLE GUARANTEE',
      badgeColor: 'bg-art-gold/15 text-art-gold border-art-gold/30',
      summary: 'Every masterpiece listed on ARTELLIUM is backed by verifiable physical and digital certificates of authenticity.',
      details: [
        {
          id: 'prov-1',
          heading: '1. Curatorial & Studio Verification',
          content: 'Every artwork on ARTELLIUM undergoes verification by accredited regional African curators and master ateliers. Physical works are inspected for medium accuracy, structural integrity, and verified studio origin before being approved for marketplace listing or live auction.'
        },
        {
          id: 'prov-2',
          heading: '2. Dual Certificate of Authenticity (CoA)',
          content: 'Upon acquisition, each collector receives both a high-security physical Certificate of Authenticity—hand-signed with archival ink by the master creator and platform curator—and an immutable digital provenance certificate cryptographically bound to the artwork ID.'
        },
        {
          id: 'prov-3',
          heading: '3. Historical Ledger Registration',
          content: 'All transacted masterworks are permanently cataloged in the Artellium Historical Provenance Ledger, establishing an unbreakable chain of custody that protects long-term collector value and museum resale legitimacy.'
        }
      ]
    },
    {
      id: 'wema-banking',
      title: 'WEMA Bank Secured Settlement & Direct Banking Policy',
      shortTitle: 'WEMA Bank Settlement',
      badge: '100% CAPITAL SECURITY',
      badgeColor: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
      summary: 'Collector acquisition funds are processed and settled directly into the Artellium Global Marketplace Corporate Account with Wema Bank PLC.',
      details: [
        {
          id: 'wema-1',
          heading: '1. Corporate Banking & Fiduciary Structure',
          content: 'All marketplace transactions, buyouts, and live auction lot settlements are routed directly to Artellium Global Marketplace Ltd corporate accounts held at Wema Bank PLC (Account No: 0123456789, Sort Code: 035150103, AlatPay Gateway by Wema). All funds are protected under Nigerian banking and international commercial trade regulations.'
        },
        {
          id: 'wema-2',
          heading: '2. Instant Payment Verification & Direct Inflow',
          content: 'Direct bank transfers, AlatPay merchant payments, and verified card checkouts are verified in real time. Upon settlement confirmation, the acquiring collector is immediately issued an official corporate payment voucher alongside the permanent Digital Certificate of Authenticity (COA).'
        },
        {
          id: 'wema-3',
          heading: '3. Transparent Commission Structure & Artist Net Disbursement',
          content: 'Under our curatorial charter, creator net earnings are disbursed directly into the master artist verified local or international bank account under verified fiduciary settlement protocol, while the platform commission covers curation, archival provenance cataloging, and digital certificate custody.'
        }
      ]
    },
    {
      id: 'consignment',
      title: 'Authenticity Guarantee & Consignment Policy',
      shortTitle: 'Authenticity & Consignment',
      badge: 'MUSEUM-GRADE ASSURANCE',
      badgeColor: 'bg-art-gold/15 text-art-gold border-art-gold/30',
      summary: 'Verified consignment terms, studio physical inspections, and certified collector ownership transfer.',
      details: [
        {
          id: 'consign-1',
          heading: '1. Master Studio Consignment Protocol',
          content: 'All original oil canvases, bronze castings, terracotta sculptures, and mixed media works listed on Artellium are consigned directly by verified African master artists or accredited artist estates under binding consignment covenants.'
        },
        {
          id: 'consign-2',
          heading: '2. Curatorial Inspection & Condition Reporting',
          content: 'Prior to marketplace accreditation, every consignment is evaluated for archival conservation quality, medium purity, and physical stability by regional curatorial partners across the continent.'
        },
        {
          id: 'consign-3',
          heading: '3. Digital & Physical Ownership Transfer',
          content: 'Once payment is confirmed through our Wema Bank corporate gateway, full legal and artistic title is irrevocably transferred to the collector, accompanied by physical and digital certificates of authenticity.'
        }
      ]
    },
    {
      id: 'refunds',
      title: 'Refunds & Dispute Resolution Policy',
      shortTitle: 'Refunds & Disputes',
      badge: 'COLLECTOR PROTECTION',
      badgeColor: 'bg-red-950/60 text-red-400 border-red-800/60',
      summary: 'Clear, fair refund protocols for material discrepancies or unverified authenticity claims.',
      details: [
        {
          id: 'ref-1',
          heading: '1. Eligibility for Full Refund',
          content: 'A collector is entitled to a 100% refund if: (a) the physical dimensions, medium, or signature materially differ from the catalog listing; or (b) an accredited curatorial panel challenges the authenticity of the piece.'
        },
        {
          id: 'ref-2',
          heading: '2. Dispute Filing Procedure',
          content: 'To initiate an inspection dispute, the collector must notify Artellium Curatorial Support within 7 calendar days of receipt via support@artellium.com, submitting high-resolution photographs of the seals and artwork condition.'
        },
        {
          id: 'ref-3',
          heading: '3. Resolution & Direct Bank Refund',
          content: 'Upon dispute approval, Artellium initiates a complete 100% direct bank refund to the collector account from our WEMA Bank corporate settlement ledger.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy Policy & Data Protection',
      shortTitle: 'Privacy & Security',
      badge: 'COLLECTOR CONFIDENTIALITY',
      badgeColor: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60',
      summary: 'Strict confidentiality of high-net-worth collector identities, bidding privacy, and bank-grade data encryption.',
      details: [
        {
          id: 'priv-1',
          heading: '1. Collector Anonymity & Bourse Discretion',
          content: 'We honor the tradition of fine art discretion. Private buyout offers and auction bids may be submitted under anonymous collector pseudonyms. Your legal identity and residential delivery address are strictly concealed from third parties and competing bidders.'
        },
        {
          id: 'priv-2',
          heading: '2. Payment Tokenization & PCI Compliance',
          content: 'Artellium never stores raw credit card numbers, CVVs, or online banking passwords on our servers. All financial transactions are tokenized with 256-bit SSL encryption through PCI-DSS Level 1 certified processors.'
        },
        {
          id: 'priv-3',
          heading: '3. Zero Data Monetization',
          content: 'We will never sell, rent, or lease collector or artist data to external marketing brokers. Information collected is used solely for order fulfillment, provenance verification, certificate issuance, and compliance with anti-money laundering (AML) fine art regulations.'
        },
        {
          id: 'priv-4',
          heading: '4. Delegated Administrative Concierge & Technical Diagnostics (NDPA & GDPR Compliance)',
          content: 'To deliver prompt technical support, resolve session desynchronizations, assist with catalog uploads, and reconcile direct bank settlements on user behalf, authorized Artellium administrators may access an artist studio or collector portal strictly in Delegated Concierge Support Mode. In accordance with the Nigeria Data Protection Act (NDPA 2023) and GDPR Article 6, this access is governed by strict statutory constraints: (a) raw login credentials and passwords are mathematically hashed and inaccessible to administrators; (b) financial authentication details and payment cards are tokenized and unexposed; (c) non-consensual financial mutations are technically restricted; and (d) every administrative session is immutably recorded in the platform Security Audit Ledger to guarantee full legal accountability.'
        }
      ]
    },
    {
      id: 'seller-conduct',
      title: 'Artist & Seller Code of Conduct',
      shortTitle: 'Seller Governance',
      badge: 'ETHICAL MARKETPLACE',
      badgeColor: 'bg-purple-950/60 text-purple-400 border-purple-800/60',
      summary: 'Standards of excellence, intellectual property protection, and authenticity obligations for verified creators.',
      details: [
        {
          id: 'cond-1',
          heading: '1. Originality & Authorship Guarantee',
          content: 'Sellers must be the direct creators or legally authorized estate representatives of the artworks listed. The upload of plagiarized work, unauthorized AI copies disguised as physical paintings, or forged heritage antiquities results in immediate lifetime ban and legal referral.'
        },
        {
          id: 'cond-2',
          heading: '2. Listing Accuracy & Studio Timelines',
          content: 'Artists are required to maintain accurate inventory status, ship sold works within 3 business days of sale confirmation, and use only Artellium-approved conservation materials for crate packaging.'
        },
        {
          id: 'cond-3',
          heading: '3. Fair Pricing & Commission Compliance',
          content: 'Artworks listed on Artellium must reflect fair global gallery pricing. Off-platform transaction circumvention intended to bypass verified settlement protection or platform commission is strictly prohibited.'
        }
      ]
    }
  ]
};

// =========================================================================
// INITIAL CONTACT US CONFIG (CMS EDITABLE)
// =========================================================================
export const INITIAL_CONTACT_CONFIG = {
  headerBadge: 'DIRECT PAN-AFRICAN & GLOBAL LIAISON',
  headerTitle: 'Contact Artellium Concierge',
  headerSubtitle: 'Connect directly with our curatorial leadership, regional offices, and 24/7 sovereign acquisition concierge.',
  emergencyBannerText: 'Urgent Collector Inquiries & Escrow Verification · WEMA Bank Fiduciary Bureau',
  formTitle: 'Send Us a Message',
  formSubtitle: 'Whether inquiring about master lots, consignment, corporate collections, or platform assistance, your message goes directly to Administration via Email and WhatsApp.',
  adminEmail: 'Ekpendudakore@gmail.com',
  adminWhatsApp: '',
  offices: [],
  contactChannels: [
    {
      id: 'support',
      title: 'Executive Administration & Concierge',
      email: 'Ekpendudakore@gmail.com',
      desc: 'Direct assistance with orders, delivery tracking, payments, and platform inquiries.'
    }
  ]
};
