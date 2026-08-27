'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_ARTWORKS, 
  ARTIST_VIDEOS, 
  VIRTUAL_EXHIBITIONS,
  INITIAL_USERS,
  INITIAL_SELLERS,
  INITIAL_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_COMMISSIONS,
  INITIAL_HEADER_CONFIG,
  INITIAL_HERO_CONFIG,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_FOOTER_CONFIG,
  INITIAL_FLASH_DEALS,
  INITIAL_ROYAL_HEIRLOOMS,
  INITIAL_ROYAL_INQUIRIES,
  INITIAL_CURATOR_PICKS,
  INITIAL_LEDGER_BLOCKS,
  INITIAL_ARTIST_VERIFICATIONS,
  PAN_AFRICAN_CURRENCIES,
  PAN_AFRICAN_REGIONS
} from '@/lib/mock-data';
import { supabase } from '@/lib/supabase';
import { 
  createDbOrder, 
  updateDbOrderStatus, 
  createDbPayment, 
  createDbCommission, 
  disburseDbCommission 
} from '@/lib/db';
const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usersList, setUsersList] = useState(INITIAL_USERS || []);
  const [sellers, setSellers] = useState(INITIAL_SELLERS || []);
  const [artworks, setArtworks] = useState(INITIAL_ARTWORKS);
  const [orders, setOrders] = useState(INITIAL_ORDERS || []);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS || []);
  const [commissions, setCommissions] = useState(INITIAL_COMMISSIONS || []);

  const [videos, setVideos] = useState(ARTIST_VIDEOS);
  const [exhibitions] = useState(VIRTUAL_EXHIBITIONS);

  // Cart & Checkout State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Active Video Modal Player state
  const [activeVideo, setActiveVideo] = useState(null);

  // Currency: NGN ₦ (Default) or USD $
  const [currency, setCurrency] = useState('NGN');

  // Legacy Transactions State
  const [transactions, setTransactions] = useState([
    {
      id: 'txn-royal-88942',
      artworkId: 'art-ancestral-horizon',
      artworkTitle: 'The Ancestral Horizon',
      artistName: 'Kofi Mensah',
      price: 1850000,
      buyerName: 'Dr. Evelyn Carter',
      buyerEmail: 'evelyn@artellium.com',
      paymentMethod: 'wema_bank',
      status: 'settled_wema',
      settlement_account: '0123456789 (Wema Bank PLC)',
      date: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    }
  ]);

  // Curator Applications Queue state
  const [curatorApplications, setCuratorApplications] = useState([
    { id: 'app-1', name: 'Dr. Koffi Badu', gallery: 'National Museum of Ghana', date: '2026-08-16', status: 'pending' },
    { id: 'app-2', name: 'Marie-Therese des Souzas', gallery: 'Musee des Civilisations (Abidjan)', date: '2026-08-15', status: 'pending' }
  ]);

  // Artist Digital Certificate Signatures
  const [artistSignatures, setArtistSignatures] = useState({
    'Kofi Mensah': { style: 'Heritage Calligraphy', signed: true, drawn: null },
    'Amina Diallo': { style: 'African Royal Script', signed: true, drawn: null }
  });

  // Collector Bourse Private Buyout Offers
  const [privateOffers, setPrivateOffers] = useState([
    {
      id: 'offer-1',
      artworkId: 'art-ancestral-horizon',
      artworkTitle: 'The Ancestral Horizon',
      collectorId: 'user-buyer-1',
      offererName: 'Aliko Dangote Jr.',
      offerAmount: 2100000,
      date: '2026-08-16',
      status: 'pending'
    }
  ]);

  // Wishlist, Followed Artists, Auction Reminders, Notifications, Q&A, Collector Offers
  const [wishlist, setWishlist] = useState([]);
  const [followedArtists, setFollowedArtists] = useState(['artist-1', 'artist-2', 'artist-4']);
  const [auctionReminders, setAuctionReminders] = useState(['art-102', 'art-108']);
  const [notifications, setNotifications] = useState([]);
  const [artworkQuestions, setArtworkQuestions] = useState([
    { id: 'q-1', artworkId: 'art-101', question: 'Is the gold leaf 24k as described? Does it tarnish over time?', askedBy: 'Dr. Yewande Okafor', date: '2026-02-11', answer: 'Yes, it is genuine 24k gold leaf applied over a gesso base. It will not tarnish. I seal it with a conservation-grade varnish.', answeredBy: 'Kofi Mensah', answeredDate: '2026-02-11' },
    { id: 'q-2', artworkId: 'art-104', question: 'Can the brass inlay be customized with a family crest or initials?', askedBy: 'James Whitfield', date: '2026-02-13', answer: null, answeredBy: null, answeredDate: null },
  ]);
  const [collectorOffers, setCollectorOffers] = useState([]);
  const [artistPayoutPercentage, setArtistPayoutPercentage] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('artellium_artist_payout_percentage');
      if (saved && !isNaN(Number(saved))) return Number(saved);
    }
    return 85;
  });

  const updateArtistPayoutPercentage = (newPercentage) => {
    const val = Math.max(1, Math.min(99, Number(newPercentage) || 85));
    setArtistPayoutPercentage(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('artellium_artist_payout_percentage', val.toString());
    }
    broadcastNotification(`👑 Platform Artist Payout Rate updated to ${val}% (Platform Fee: ${100 - val}%).`);
    return val;
  };

  // Pan-African Multi-Feature Datasets
  const [flashDeals, setFlashDeals] = useState(INITIAL_FLASH_DEALS || []);
  const [royalHeirlooms, setRoyalHeirlooms] = useState(INITIAL_ROYAL_HEIRLOOMS || []);
  const [royalInquiries, setRoyalInquiries] = useState(INITIAL_ROYAL_INQUIRIES || []);
  const [curatorPicks, setCuratorPicks] = useState(INITIAL_CURATOR_PICKS || []);
  const [ledgerBlocks, setLedgerBlocks] = useState(INITIAL_LEDGER_BLOCKS || []);
  const [artistVerifications, setArtistVerifications] = useState(INITIAL_ARTIST_VERIFICATIONS || []);
  const [artistCuratorSubmissions, setArtistCuratorSubmissions] = useState([]);
  const [panAfricanRegions, setPanAfricanRegions] = useState(PAN_AFRICAN_REGIONS || []);
  const [panAfricanCurrencies, setPanAfricanCurrencies] = useState(PAN_AFRICAN_CURRENCIES || {});

  // Auction Bidders & Patron Lead Directory (for Admin and Notification Broadcasts)
  const [auctionBidders, setAuctionBidders] = useState([
    {
      id: 'bidder-1',
      bidderId: 'ART-BID-88942',
      fullName: 'Dr. Folake Davies',
      email: 'folake@daviesholdings.com',
      phone: '+234 803 555 1290',
      country: 'Nigeria',
      city: 'Lagos',
      idType: 'International Passport',
      idNumber: 'A08942184',
      biddingTier: 'Sovereign',
      verified: true,
      highValueApproved: true,
      registeredAt: '2026-02-10T09:00:00Z',
      categories: ['Sculptures', 'Bronze', 'Paintings'],
      totalBidsPlaced: 14,
      totalVolumeBidded: 28500000,
      activeLots: ['Lot #803', 'Lot #801'],
      lastBidPlaced: {
        lotNumber: 'Lot #803',
        artworkTitle: 'The Golden Benin Queen',
        amount: 9100000,
        time: '2026-02-23T06:15:00Z'
      }
    },
    {
      id: 'bidder-2',
      bidderId: 'ART-BID-88901',
      fullName: 'Sotheby’s Patron Desk (London)',
      email: 'patron.desk@sothebys-london.co.uk',
      phone: '+44 20 7293 5000',
      country: 'United Kingdom',
      city: 'London',
      idType: 'Corporate Trust Entity ID',
      idNumber: 'GB-CORP-9921',
      biddingTier: 'Sovereign',
      verified: true,
      highValueApproved: true,
      registeredAt: '2026-02-12T14:30:00Z',
      categories: ['Paintings', 'Sculptures', 'Limited edition collections'],
      totalBidsPlaced: 22,
      totalVolumeBidded: 45000000,
      activeLots: ['Lot #803', 'Lot #802'],
      lastBidPlaced: {
        lotNumber: 'Lot #803',
        artworkTitle: 'The Golden Benin Queen',
        amount: 9000000,
        time: '2026-02-23T06:12:00Z'
      }
    },
    {
      id: 'bidder-3',
      bidderId: 'ART-BID-88764',
      fullName: 'Nairobi Fine Arts Circle',
      email: 'acquisitions@nairobiarts.org',
      phone: '+254 711 982 341',
      country: 'Kenya',
      city: 'Nairobi',
      idType: 'Institutional Trust ID',
      idNumber: 'KE-TRUST-4412',
      biddingTier: 'Sovereign',
      verified: true,
      highValueApproved: true,
      registeredAt: '2026-02-14T11:20:00Z',
      categories: ['Paintings', 'Drawings', 'Textiles'],
      totalBidsPlaced: 18,
      totalVolumeBidded: 32000000,
      activeLots: ['Lot #803', 'Lot #802'],
      lastBidPlaced: {
        lotNumber: 'Lot #803',
        artworkTitle: 'The Golden Benin Queen',
        amount: 8900000,
        time: '2026-02-23T06:05:00Z'
      }
    },
    {
      id: 'bidder-4',
      bidderId: 'ART-BID-88412',
      fullName: 'Dr. O. Adebayo',
      email: 'adebayo.collector@lagosart.ng',
      phone: '+234 802 334 8812',
      country: 'Nigeria',
      city: 'Lagos',
      idType: 'National Identification (NIN)',
      idNumber: 'NIN-9941289123',
      biddingTier: 'Standard',
      verified: true,
      highValueApproved: false,
      registeredAt: '2026-02-15T08:15:00Z',
      categories: ['Sculptures', 'Woodworks', 'Metal works'],
      totalBidsPlaced: 8,
      totalVolumeBidded: 12400000,
      activeLots: ['Lot #801'],
      lastBidPlaced: {
        lotNumber: 'Lot #801',
        artworkTitle: 'Warrior of the Bronze Empire',
        amount: 3400000,
        time: '2026-02-23T05:45:00Z'
      }
    },
    {
      id: 'bidder-5',
      bidderId: 'ART-BID-88390',
      fullName: 'Tariq A. (Dubai)',
      email: 'tariq.art@gulfpatrons.ae',
      phone: '+971 50 123 9876',
      country: 'United Arab Emirates',
      city: 'Dubai',
      idType: 'International Passport',
      idNumber: 'UAE-P-88914',
      biddingTier: 'Sovereign',
      verified: true,
      highValueApproved: true,
      registeredAt: '2026-02-16T16:40:00Z',
      categories: ['Paintings', 'Textiles', 'Ceramics'],
      totalBidsPlaced: 11,
      totalVolumeBidded: 24000000,
      activeLots: ['Lot #802'],
      lastBidPlaced: {
        lotNumber: 'Lot #802',
        artworkTitle: 'Daughters of the Nile',
        amount: 4800000,
        time: '2026-02-23T05:30:00Z'
      }
    }
  ]);

  // 4 Core Admin Page Configs: Header, Hero, Home, Footer
  const [headerConfig, setHeaderConfig] = useState(INITIAL_HEADER_CONFIG);
  const [heroConfig, setHeroConfig] = useState(INITIAL_HERO_CONFIG);
  const [homePageConfig, setHomePageConfig] = useState(INITIAL_HOMEPAGE_CONFIG);
  const [footerConfig, setFooterConfig] = useState(INITIAL_FOOTER_CONFIG);

  // WEMA Bank Gateway & Corporate Account Settings
  const [paymentSettings, setPaymentSettings] = useState({
    wemaBankName: 'Wema Bank PLC',
    wemaAccountName: 'Artellium Global Marketplace Ltd',
    wemaAccountNumber: '0123456789',
    wemaSortCode: '035150103',
    alatpayMerchantId: 'ALAT-MERCHANT-88942',
    wemaApiKey: 'wema_sec_live_99218417',
    paystackPublicKey: 'pk_live_88491298412984',
    flutterwavePublicKey: 'FLWPUBK_TEST-9921841',
    monnifyContractCode: 'MNFY-9921841'
  });

  // Priority Banner Feature State (Admin Pricing & Artist Placements)
  const [priorityBannerPricing, setPriorityBannerPricing] = useState({
    boost7d: 15000,
    monthly: 50000,
    annual: 350000,
    isEnabled: true
  });

  const [priorityBannerPlacements, setPriorityBannerPlacements] = useState([
    {
      id: 'pbp-101',
      artworkId: 'art-101',
      title: 'The Ancestral Horizon',
      artistName: 'Kofi Mensah',
      artistId: 'artist-1',
      country: 'Ghana',
      countryFlag: '🇬🇭',
      medium: 'Oil & 24K Gold Leaf on Canvas',
      dimensions: '150 x 120 cm',
      price: 1850000,
      priceUSD: 1250,
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
      plan: 'monthly',
      pricePaid: 50000,
      status: 'active',
      startDate: '2026-02-01',
      endDate: '2026-03-01'
    },
    {
      id: 'pbp-102',
      artworkId: 'art-102',
      title: 'Warrior of the Bronze Empire',
      artistName: 'Amina Diallo',
      artistId: 'artist-2',
      country: 'Nigeria',
      countryFlag: '🇳🇬',
      medium: 'Cast Bronze & Ebony Wood Base',
      dimensions: '85 x 40 x 35 cm',
      price: 3200000,
      priceUSD: 2150,
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
      plan: 'monthly',
      pricePaid: 50000,
      status: 'active',
      startDate: '2026-02-05',
      endDate: '2026-03-05'
    }
  ]);

  const MOCK_VERSION = 'v14-contact-update';

  // 1. Load from LocalStorage synchronously first
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem('artellium_mock_version');
      if (storedVersion !== MOCK_VERSION) {
        localStorage.removeItem('artellium_artworks');
        localStorage.removeItem('artellium_orders');
        localStorage.removeItem('artellium_payments');
        localStorage.removeItem('artellium_commissions');
        localStorage.removeItem('artellium_footer_config');
        localStorage.removeItem('artellium_hero_config');
        localStorage.setItem('artellium_mock_version', MOCK_VERSION);
      }

      const savedArtworks = localStorage.getItem('artellium_artworks');
      if (savedArtworks) {
        const parsed = JSON.parse(savedArtworks);
        const savedMap = {};
        parsed.forEach(a => { savedMap[a.id] = a; });
        const merged = INITIAL_ARTWORKS.map(a => savedMap[a.id] || a);
        parsed.forEach(a => {
          if (!merged.some(m => m.id === a.id)) merged.push(a);
        });
        setArtworks(merged);
      }

      const savedOrders = localStorage.getItem('artellium_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedPayments = localStorage.getItem('artellium_payments');
      if (savedPayments) setPayments(JSON.parse(savedPayments));

      const savedCommissions = localStorage.getItem('artellium_commissions');
      if (savedCommissions) setCommissions(JSON.parse(savedCommissions));

      const savedSellers = localStorage.getItem('artellium_sellers');
      if (savedSellers) setSellers(JSON.parse(savedSellers));

      const savedCart = localStorage.getItem('artellium_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedTxns = localStorage.getItem('artellium_transactions');
      if (savedTxns) setTransactions(JSON.parse(savedTxns));

      const savedWishlist = localStorage.getItem('artellium_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedQuestions = localStorage.getItem('artellium_questions');
      if (savedQuestions) setArtworkQuestions(JSON.parse(savedQuestions));

      const savedNotifications = localStorage.getItem('artellium_notifications');
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));

      const savedCollectorOffers = localStorage.getItem('artellium_collector_offers');
      if (savedCollectorOffers) setCollectorOffers(JSON.parse(savedCollectorOffers));

      const savedSignatures = localStorage.getItem('artellium_signatures');
      if (savedSignatures) setArtistSignatures(JSON.parse(savedSignatures));

      const savedUsers = localStorage.getItem('artellium_users');
      if (savedUsers) {
        setUsersList(JSON.parse(savedUsers));
      } else {
        setUsersList(INITIAL_USERS);
      }

      const savedHeader = localStorage.getItem('artellium_header_config');
      if (savedHeader) setHeaderConfig(JSON.parse(savedHeader));

      const savedHero = localStorage.getItem('artellium_hero_config');
      if (savedHero) {
        try {
          const parsed = JSON.parse(savedHero);
          setHeroConfig({ ...INITIAL_HERO_CONFIG, ...parsed, heroType: parsed.heroType || 'jumia_art_hero' });
        } catch (e) {
          setHeroConfig(INITIAL_HERO_CONFIG);
        }
      } else {
        setHeroConfig(INITIAL_HERO_CONFIG);
      }

      const savedHome = localStorage.getItem('artellium_home_config');
      if (savedHome) {
        try {
          const parsed = JSON.parse(savedHome);
          if (parsed && Array.isArray(parsed.sections)) {
            const mergedSections = INITIAL_HOMEPAGE_CONFIG.sections.map(initSec => {
              const existing = parsed.sections.find(s => s.id === initSec.id || s.type === initSec.type);
              return existing ? { ...initSec, ...existing, isVisible: existing.isVisible !== false } : initSec;
            });
            setHomePageConfig({ ...INITIAL_HOMEPAGE_CONFIG, ...parsed, sections: mergedSections });
          } else {
            setHomePageConfig(INITIAL_HOMEPAGE_CONFIG);
          }
        } catch (e) {
          setHomePageConfig(INITIAL_HOMEPAGE_CONFIG);
        }
      } else {
        setHomePageConfig(INITIAL_HOMEPAGE_CONFIG);
      }

      const savedFooter = localStorage.getItem('artellium_footer_config');
      if (savedFooter) {
        try {
          const parsed = JSON.parse(savedFooter);
          if (
            parsed.columns && 
            parsed.columns.some(c => 
              c.title === 'For Artists' || 
              c.title === 'Platform & Legal' || 
              (c.links && c.links.some(l => 
                l.label === 'Artist Subscriptions' || 
                l.label === 'Admin Dashboard' ||
                l.label === 'Our Pan-African Mission' ||
                l.label === 'Curatorial Heritage & Standards' ||
                l.label === 'Master Artist Living Archive' ||
                l.label === 'Wema Bank Fiduciary Partnership' ||
                l.label === 'Regional African Ateliers'
              ))
            )
          ) {
            setFooterConfig(INITIAL_FOOTER_CONFIG);
            localStorage.setItem('artellium_footer_config', JSON.stringify(INITIAL_FOOTER_CONFIG));
          } else {
            setFooterConfig(parsed);
          }
        } catch (e) {
          setFooterConfig(INITIAL_FOOTER_CONFIG);
        }
      } else {
        setFooterConfig(INITIAL_FOOTER_CONFIG);
      }

      const savedPriorityPricing = localStorage.getItem('artellium_priority_pricing');
      if (savedPriorityPricing) setPriorityBannerPricing(JSON.parse(savedPriorityPricing));

      const savedPriorityPlacements = localStorage.getItem('artellium_priority_placements');
      if (savedPriorityPlacements) setPriorityBannerPlacements(JSON.parse(savedPriorityPlacements));

      const savedLoginState = localStorage.getItem('artellium_login_state');
      if (savedLoginState) {
        try {
          const parsed = JSON.parse(savedLoginState);
          // Purge legacy demo auto-login states from previous sessions
          if (
            parsed?.user?.id === 'user-admin-1' || 
            parsed?.user?.email === 'admin@artellium.com' || 
            parsed?.user?.name === 'Executive Administrator' ||
            parsed?.user?.name === 'Dr. Evelyn Carter' ||
            parsed?.user?.email === 'evelyn@artellium.com'
          ) {
            localStorage.removeItem('artellium_login_state');
            setIsLoggedIn(false);
            setCurrentUser(null);
          } else if (parsed && parsed.user && parsed.isLoggedIn) {
            setIsLoggedIn(true);
            setCurrentUser(parsed.user);
          } else {
            setIsLoggedIn(false);
            setCurrentUser(null);
          }
        } catch (e) {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } catch (e) {
      console.warn('LocalStorage load notice:', e);
    }
  }, []);

  // 2. Async sync with Supabase tables
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data: dbArtworks, error: artError } = await supabase.from('artworks').select('*');
        if (!artError && dbArtworks && dbArtworks.length > 0) {
          const dbMap = {};
          dbArtworks.forEach(a => { dbMap[a.id] = a; });
          const merged = INITIAL_ARTWORKS.map(a => dbMap[a.id] || a);
          dbArtworks.forEach(a => {
            if (!merged.some(m => m.id === a.id)) merged.push(a);
          });
          setArtworks(merged);
        }

        const { data: dbOrders, error: ordError } = await supabase.from('orders').select('*');
        if (!ordError && dbOrders && dbOrders.length > 0) {
          setOrders(dbOrders);
        }

        const { data: dbPayments, error: payError } = await supabase.from('payments').select('*');
        if (!payError && dbPayments && dbPayments.length > 0) {
          setPayments(dbPayments);
        }

        const { data: dbCommissions, error: commError } = await supabase.from('commissions').select('*');
        if (!commError && dbCommissions && dbCommissions.length > 0) {
          setCommissions(dbCommissions);
        }
      } catch (e) {
        console.warn('Supabase sync notice:', e.message);
      }
    }
    loadSupabaseData();
  }, []);

  // 3. Keep LocalStorage in sync automatically
  useEffect(() => {
    try {
      localStorage.setItem('artellium_artworks', JSON.stringify(artworks));
      localStorage.setItem('artellium_orders', JSON.stringify(orders));
      localStorage.setItem('artellium_payments', JSON.stringify(payments));
      localStorage.setItem('artellium_commissions', JSON.stringify(commissions));
      localStorage.setItem('artellium_sellers', JSON.stringify(sellers));
      localStorage.setItem('artellium_users', JSON.stringify(usersList));
      localStorage.setItem('artellium_cart', JSON.stringify(cart));
      localStorage.setItem('artellium_transactions', JSON.stringify(transactions));
      localStorage.setItem('artellium_wishlist', JSON.stringify(wishlist));
      localStorage.setItem('artellium_questions', JSON.stringify(artworkQuestions));
      localStorage.setItem('artellium_notifications', JSON.stringify(notifications));
      localStorage.setItem('artellium_collector_offers', JSON.stringify(collectorOffers));
      localStorage.setItem('artellium_signatures', JSON.stringify(artistSignatures));
      localStorage.setItem('artellium_header_config', JSON.stringify(headerConfig));
      localStorage.setItem('artellium_hero_config', JSON.stringify(heroConfig));
      localStorage.setItem('artellium_home_config', JSON.stringify(homePageConfig));
      localStorage.setItem('artellium_footer_config', JSON.stringify(footerConfig));
      localStorage.setItem('artellium_priority_pricing', JSON.stringify(priorityBannerPricing));
      localStorage.setItem('artellium_priority_placements', JSON.stringify(priorityBannerPlacements));
      localStorage.setItem('artellium_login_state', JSON.stringify({ isLoggedIn, user: currentUser }));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }, [artworks, orders, payments, commissions, sellers, usersList, cart, transactions, wishlist, artworkQuestions, notifications, collectorOffers, artistSignatures, headerConfig, heroConfig, homePageConfig, footerConfig, priorityBannerPricing, priorityBannerPlacements, isLoggedIn, currentUser]);

  // Cart Functions
  const addToCart = (artwork) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === artwork.id);
      if (existing) {
        return prev.map((item) =>
          item.id === artwork.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...artwork, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // =========================================================================
  // ORDERS & LOGISTICS LIFECYCLE API
  // =========================================================================
  const createOrderWithPayment = async ({
    buyerId,
    buyerName,
    buyerEmail,
    buyerPhone,
    shippingAddress,
    shippingCity,
    shippingCountry,
    totalAmount,
    currency = 'NGN',
    paymentMethod = 'paystack',
    items = []
  }) => {
    const orderId = `ord-${Date.now()}`;
    const paymentId = `pay-${Date.now()}`;
    const paymentReference = `${paymentMethod.toUpperCase()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // 1. Create Order with Direct Wema Bank Settlement status
    const newOrder = {
      id: orderId,
      buyer_id: buyerId || currentUser?.id || 'user-buyer-1',
      buyer_name: buyerName || currentUser?.name || 'Dr. Evelyn Carter',
      buyer_email: buyerEmail || currentUser?.email || 'evelyn@artellium.com',
      buyer_phone: buyerPhone || '+234 803 123 4567',
      total_amount: parseFloat(totalAmount),
      currency,
      status: 'paid', // paid -> completed
      settlement_bank: 'Wema Bank PLC',
      items: items.map(item => ({
        id: item.id,
        title: item.title,
        artistName: item.artistName,
        artistId: item.artistId || 'artist-1',
        price: item.price,
        image: item.image
      })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 2. Create Payment (Settled Directly via Wema Bank)
    const newPayment = {
      id: paymentId,
      order_id: orderId,
      buyer_id: buyerId || currentUser?.id || 'user-buyer-1',
      buyer_name: buyerName || currentUser?.name || 'Dr. Evelyn Carter',
      amount: parseFloat(totalAmount),
      currency,
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      status: 'settled_wema',
      settlement_account: '0123456789 (Wema Bank PLC)',
      paid_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    // 3. Create Commission Calculations (Dynamic Platform Fee vs Artist Net Payout)
    const newCommissions = items.map(item => {
      const gross = parseFloat(item.price);
      const payoutPct = artistPayoutPercentage || 85;
      const platformFeeRate = (100 - payoutPct) / 100;
      const platformFeeAmount = Math.round(gross * platformFeeRate);
      const sellerNetPayout = Math.round(gross * (payoutPct / 100));

      return {
        id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        order_id: orderId,
        payment_id: paymentId,
        artwork_id: item.id,
        artwork_title: item.title,
        seller_id: item.artistId || 'artist-1',
        seller_name: item.artistName || 'Kofi Mensah',
        gross_amount: gross,
        platform_fee_rate: platformFeeRate,
        platform_fee_amount: platformFeeAmount,
        seller_net_payout: sellerNetPayout,
        payout_status: 'disbursed',
        disbursed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    setOrders(prev => [newOrder, ...prev]);
    setPayments(prev => [newPayment, ...prev]);
    setCommissions(prev => [...newCommissions, ...prev]);

    items.forEach(item => {
      setArtworkStatusSold(item.id, buyerName || currentUser?.name || 'Dr. Evelyn Carter', item.price);
    });

    items.forEach(item => {
      addTransaction({
        artworkId: item.id,
        artworkTitle: item.title,
        artistName: item.artistName,
        price: item.price,
        buyerName: buyerName || currentUser?.name || 'Dr. Evelyn Carter',
        buyerEmail: buyerEmail || currentUser?.email || 'evelyn@artellium.com',
        paymentMethod: paymentMethod,
        orderId: orderId,
        paymentReference: paymentReference,
        status: 'settled_wema'
      });
    });

    broadcastNotification(`Order ${orderId} confirmed & settled directly via Wema Bank PLC! Reference: ${paymentReference}`);

    try {
      supabase.from('orders').insert([newOrder]).then(() => {});
      supabase.from('payments').insert([newPayment]).then(() => {});
      supabase.from('commissions').insert(newCommissions).then(() => {});
    } catch (e) {
      console.warn('Database async sync notice:', e.message);
    }

    return { order: newOrder, payment: newPayment, commissions: newCommissions };
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o));
    updateDbOrderStatus(orderId, newStatus);
  };

  const updateOrder = (orderId, updatedFields) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updatedFields, updated_at: new Date().toISOString() } : o));
    supabase.from('orders').update(updatedFields).eq('id', orderId).then(() => {});
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    supabase.from('orders').delete().eq('id', orderId).then(() => {});
  };

  const updateOrderLogistics = (orderId, logisticsData) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, logistics: logisticsData, updated_at: new Date().toISOString() } : o));
  };

  const confirmCollectorDelivery = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, collectorConfirmedDelivery: true, collectorConfirmedAt: new Date().toISOString(), status: 'completed' } : o));
  };

  // Payments CRUD
  const updatePayment = (paymentId, updatedFields) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, ...updatedFields } : p));
    supabase.from('payments').update(updatedFields).eq('id', paymentId).then(() => {});
  };

  const deletePayment = (paymentId) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId));
    supabase.from('payments').delete().eq('id', paymentId).then(() => {});
  };

  // Commissions CRUD
  const disburseCommission = (commissionId) => {
    setCommissions(prev => prev.map(c => 
      c.id === commissionId ? { ...c, payout_status: 'disbursed', disbursed_at: new Date().toISOString(), updated_at: new Date().toISOString() } : c
    ));
    disburseDbCommission(commissionId);
  };

  const updateCommission = (commissionId, updatedFields) => {
    setCommissions(prev => prev.map(c => c.id === commissionId ? { ...c, ...updatedFields, updated_at: new Date().toISOString() } : c));
    supabase.from('commissions').update(updatedFields).eq('id', commissionId).then(() => {});
  };

  const deleteCommission = (commissionId) => {
    setCommissions(prev => prev.filter(c => c.id !== commissionId));
    supabase.from('commissions').delete().eq('id', commissionId).then(() => {});
  };

  // Users & Sellers CRUD
  const addUser = (newUser) => {
    const created = {
      ...newUser,
      id: `user-${Date.now()}`,
      status: newUser.status || 'active',
      statusReason: '',
      created_at: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      securityIncidents: [],
      cloudflareVerified: true
    };
    setUsersList(prev => {
      const updated = [...prev, created];
      try {
        localStorage.setItem('artellium_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      supabase.from('users').insert([created]).then(() => {});
    } catch (e) {}
    return created;
  };

  const updateUser = (userId, updatedFields) => {
    setUsersList(prev => {
      const updated = prev.map(u => u.id === userId ? { ...u, ...updatedFields, updated_at: new Date().toISOString() } : u);
      try {
        localStorage.setItem('artellium_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (currentUser?.id === userId) {
      const merged = { ...currentUser, ...updatedFields };
      setCurrentUser(merged);
      try {
        localStorage.setItem('artellium_login_state', JSON.stringify({ isLoggedIn: true, user: merged }));
      } catch (e) {}
    }
    try {
      supabase.from('users').update(updatedFields).eq('id', userId).then(() => {});
    } catch (e) {}
  };

  const deleteUser = (userId) => {
    setUsersList(prev => {
      const updated = prev.filter(u => u.id !== userId);
      try {
        localStorage.setItem('artellium_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      supabase.from('users').delete().eq('id', userId).then(() => {});
    } catch (e) {}
  };

  const addSeller = (newSeller) => {
    const created = { ...newSeller, id: `artist-${Date.now()}`, created_at: new Date().toISOString() };
    setSellers(prev => [...prev, created]);
    supabase.from('sellers').insert([created]).then(() => {});
    return created;
  };

  const updateSeller = (sellerId, updatedFields) => {
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, ...updatedFields, updated_at: new Date().toISOString() } : s));
    supabase.from('sellers').update(updatedFields).eq('id', sellerId).then(() => {});
  };

  const deleteSeller = (sellerId) => {
    setSellers(prev => prev.filter(s => s.id !== sellerId));
    supabase.from('sellers').delete().eq('id', sellerId).then(() => {});
  };

  // Artworks CRUD
  const addArtwork = (newArt) => {
    const created = {
      ...newArt,
      id: `art-${Date.now()}`,
      created_at: new Date().toISOString(),
      isNewlyListed: true,
      rating: 5.0,
      reviewsCount: 0,
      status: newArt.status || 'available',
    };
    setArtworks((prev) => [created, ...prev]);
    supabase.from('artworks').insert([created]).then(({ error }) => {
      if (error) console.warn('Supabase upload artwork notice:', error.message);
    });
    return created;
  };

  const updateArtwork = (artworkId, updatedFields) => {
    setArtworks((prev) =>
      prev.map((art) => (art.id === artworkId ? { ...art, ...updatedFields } : art))
    );
    supabase.from('artworks').update(updatedFields).eq('id', artworkId).then(({ error }) => {
      if (error) console.warn('Supabase update artwork notice:', error.message);
    });
  };

  const deleteArtwork = (artworkId) => {
    setArtworks((prev) => prev.filter((art) => art.id !== artworkId));
    supabase.from('artworks').delete().eq('id', artworkId).then(({ error }) => {
      if (error) console.warn('Supabase delete artwork notice:', error.message);
    });
  };

  const setArtworkStatusSold = (artworkId, buyerName, soldPrice) => {
    setArtworks((prev) =>
      prev.map((art) =>
        art.id === artworkId
          ? {
              ...art,
              status: 'sold',
              soldTo: buyerName,
              soldPrice: soldPrice || art.price,
              history: [
                ...(art.history || [
                  { event: 'Masterpiece Created', actor: art.artistName, price: 0, date: art.created_at || '2026-01-01' }
                ]),
                {
                  event: 'Ownership Transferred',
                  actor: buyerName,
                  price: soldPrice || art.price,
                  date: new Date().toISOString()
                }
              ]
            }
          : art
      )
    );
  };

  const setArtistVerificationBadge = (artistNameOrId, badge) => {
    setArtworks((prev) =>
      prev.map((art) =>
        art.artistName?.toLowerCase() === artistNameOrId?.toLowerCase() || art.artistId === artistNameOrId
          ? { ...art, verificationBadge: badge }
          : art
      )
    );
  };

  const updateArtistStudioNotes = (artistName, newNotes) => {
    setArtworks((prev) =>
      prev.map((art) =>
        art.artistName?.toLowerCase() === artistName?.toLowerCase()
          ? { ...art, studioNotes: newNotes }
          : art
      )
    );
  };

  // Video Management
  const addVideo = (newVideo) => {
    const created = { ...newVideo, id: `vid-${Date.now()}` };
    setVideos((prev) => [created, ...prev]);
  };
  const deleteVideo = (id) => setVideos((prev) => prev.filter((v) => v.id !== id));

  // Check if a given user or current user is an accredited registered bidder
  const isBidderRegistered = (user = currentUser) => {
    if (!user) return false;
    if (user.isBidder || user.isBidderRegistered || user.bidderId) return true;
    return auctionBidders.some(b => 
      (b.email && user.email && b.email.toLowerCase() === user.email.toLowerCase()) ||
      (b.id && user.id && b.id === user.id) ||
      (b.fullName && user.name && b.fullName.toLowerCase() === user.name.toLowerCase())
    );
  };

  // Auction Bidding & Bidder Lead Tracking
  const registerAuctionBidder = (bidderData) => {
    const newBidder = {
      id: `bidder-${Date.now()}`,
      bidderId: bidderData.bidderId || `ART-BID-${Date.now().toString().slice(-5)}`,
      fullName: bidderData.fullName,
      email: bidderData.email,
      phone: bidderData.phone || '+234 803 123 4567',
      country: bidderData.country || 'Nigeria',
      city: bidderData.city || 'Lagos',
      idType: bidderData.idType || 'International Passport',
      idNumber: bidderData.idNumber || 'A08942184',
      biddingTier: bidderData.biddingTier || 'Standard',
      verified: true,
      highValueApproved: bidderData.highValueApproved || bidderData.biddingTier === 'Sovereign',
      registeredAt: new Date().toISOString(),
      categories: bidderData.categories || ['Paintings', 'Sculptures'],
      totalBidsPlaced: 0,
      totalVolumeBidded: 0,
      activeLots: [],
      lastBidPlaced: null
    };

    setAuctionBidders(prev => [newBidder, ...prev.filter(b => b.email !== newBidder.email && b.bidderId !== newBidder.bidderId)]);

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        isBidder: true,
        isBidderRegistered: true,
        bidderId: newBidder.bidderId,
        biddingTier: newBidder.biddingTier,
        highValueApproved: newBidder.highValueApproved
      };
      setCurrentUser(updatedUser);
      setUsersList(prev => prev.map(u => u.id === currentUser.id || u.email === currentUser.email ? updatedUser : u));
    }

    broadcastNotification(`New accredited bidder registered: ${newBidder.fullName} (${newBidder.bidderId})`);
    return newBidder;
  };

  const updateBidderHighValueApproval = (bidderId, approved) => {
    setAuctionBidders(prev => prev.map(b => b.id === bidderId || b.bidderId === bidderId ? { ...b, highValueApproved: approved } : b));
    broadcastNotification(`Bidder ${bidderId} High-Value VIP clearance ${approved ? 'GRANTED' : 'REVOKED'}`);
  };

  const deleteAuctionBidder = (bidderId) => {
    setAuctionBidders(prev => prev.filter(b => b.id !== bidderId && b.bidderId !== bidderId));
  };

  const placeBid = (artworkId, bidAmount, bidderName = currentUser?.name || 'Verified Collector') => {
    // Strict Fiduciary Rule: Only accredited registered bidders can place bids in any live auction
    const hasBidderCredentials = isBidderRegistered(currentUser) || auctionBidders.some(b => b.fullName.toLowerCase() === bidderName.toLowerCase());
    if (!hasBidderCredentials) {
      console.warn(`[Live Auction Security]: Bid rejected for ${bidderName}. User is not an accredited registered bidder.`);
      return { success: false, error: 'Only accredited registered bidders can place bids in live auctions.' };
    }

    const targetArt = artworks.find(a => a.id === artworkId);
    const artTitle = targetArt?.title || 'Fine Art Lot';
    const lotNum = targetArt?.lotNumber || `Lot #${artworkId?.replace('art-', '80') || '801'}`;

    setArtworks((prev) =>
      prev.map((item) => {
        if (item.id === artworkId && item.auction) {
          return {
            ...item,
            auction: {
              ...item.auction,
              currentBid: bidAmount,
              totalBids: (item.auction.totalBids || 0) + 1,
              lastBidder: bidderName,
            },
          };
        }
        return item;
      })
    );

    // Record / Update Bidder in Admin Directory
    setAuctionBidders(prev => {
      const existing = prev.find(b => b.fullName.toLowerCase() === bidderName.toLowerCase() || b.email === currentUser?.email);
      if (existing) {
        return prev.map(b => b.id === existing.id ? {
          ...b,
          totalBidsPlaced: b.totalBidsPlaced + 1,
          totalVolumeBidded: b.totalVolumeBidded + bidAmount,
          activeLots: Array.from(new Set([...b.activeLots, lotNum])),
          lastBidPlaced: {
            lotNumber: lotNum,
            artworkTitle: artTitle,
            amount: bidAmount,
            time: new Date().toISOString()
          }
        } : b);
      } else {
        const autoBidder = {
          id: `bidder-${Date.now()}`,
          bidderId: `ART-BID-${Date.now().toString().slice(-5)}`,
          fullName: bidderName,
          email: currentUser?.email || `${bidderName.toLowerCase().replace(/[^a-z0-9]/g, '')}@artellium-patron.com`,
          phone: currentUser?.phone || '+234 803 000 0000',
          country: currentUser?.country || 'Nigeria',
          city: currentUser?.city || 'Lagos',
          idType: 'KYC Verified Account',
          idNumber: `ID-${Date.now().toString().slice(-6)}`,
          biddingTier: bidAmount > 5000000 ? 'Sovereign' : 'Standard',
          verified: true,
          highValueApproved: true,
          registeredAt: new Date().toISOString(),
          categories: [targetArt?.category || 'Paintings'],
          totalBidsPlaced: 1,
          totalVolumeBidded: bidAmount,
          activeLots: [lotNum],
          lastBidPlaced: {
            lotNumber: lotNum,
            artworkTitle: artTitle,
            amount: bidAmount,
            time: new Date().toISOString()
          }
        };
        return [autoBidder, ...prev];
      }
    });

    // 1. Dispatch Bid Confirmation Email to active bidder via Resend
    const bidderEmail = currentUser?.email || `${bidderName.toLowerCase().replace(/[^a-z0-9]/g, '')}@artellium-patron.com`;
    const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://artellium.africa';

    triggerEmailNotification('bid_confirmation', bidderEmail, {
      name: bidderName,
      lotNumber: lotNum,
      artworkTitle: artTitle,
      artistName: targetArt?.artistName || 'Pan-African Master',
      bidAmount: bidAmount,
      currency: currency || 'NGN',
      auctionUrl: `${appOrigin}/auctions`
    });

    // 2. Dispatch Outbid Alert Email to the displaced highest bidder
    const previousBidderName = targetArt?.auction?.lastBidder;
    const previousBidAmount = targetArt?.auction?.currentBid;

    if (previousBidderName && previousBidderName.toLowerCase() !== bidderName.toLowerCase()) {
      const prevBidderObj = auctionBidders.find(b => b.fullName.toLowerCase() === previousBidderName.toLowerCase());
      const prevEmail = prevBidderObj?.email || `${previousBidderName.toLowerCase().replace(/[^a-z0-9]/g, '')}@artellium-patron.com`;

      triggerEmailNotification('outbid_alert', prevEmail, {
        name: previousBidderName,
        lotNumber: lotNum,
        artworkTitle: artTitle,
        artistName: targetArt?.artistName || 'Pan-African Master',
        currentBid: bidAmount,
        previousBid: previousBidAmount,
        currency: currency || 'NGN',
        auctionUrl: `${appOrigin}/auctions`
      });
    }

    broadcastNotification(`⚡ New bid of ₦${bidAmount.toLocaleString()} placed on ${lotNum} (${artTitle}) by ${bidderName}`);
  };

  // Transactions & Direct Bank Settlement
  const addTransaction = (txn) => {
    const newTx = {
      ...txn,
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: txn.status || 'settled_wema',
      settlement_bank: 'Wema Bank PLC',
      date: new Date().toISOString(),
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const settleTransaction = (id) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: 'settled_wema' } : tx));
  };

  const freezeTransaction = (id) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: 'dispute_review' } : tx));
  };

  const updateFreightStatus = (id, status) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, freight_status: status } : tx));
  };

  const updatePaymentSettings = (updated) => {
    setPaymentSettings(prev => ({ ...prev, ...updated }));
    broadcastNotification('Wema Bank payment gateway settings successfully saved!');
  };

  // Curators & Signatures
  const approveCurator = (id) => setCuratorApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'approved' } : app));
  const rejectCurator = (id) => setCuratorApplications(prev => prev.map(app => app.id === id ? { ...app, status: 'rejected' } : app));
  
  const saveArtistSignature = (name, signatureData) => {
    const updated = typeof signatureData === 'string' 
      ? { style: signatureData, signed: true, drawn: null } 
      : { style: signatureData.style || 'Custom Canvas Signature', signed: true, drawn: signatureData.drawn };
    setArtistSignatures(prev => ({ ...prev, [name]: updated }));
  };

  // Bourse Buyout Offers
  const acceptPrivateOffer = (id) => setPrivateOffers(prev => prev.map(off => off.id === id ? { ...off, status: 'accepted' } : off));
  const rejectPrivateOffer = (id) => setPrivateOffers(prev => prev.map(off => off.id === id ? { ...off, status: 'rejected' } : off));
  const makeBuyoutOffer = (artworkId, amount, offererName, offererId) => {
    const newOffer = { id: `offer-${Date.now()}`, artworkId, artworkTitle: 'Secondary Bourse Asset', collectorId: offererId, offererName, offerAmount: amount, date: new Date().toISOString().split('T')[0], status: 'pending' };
    setPrivateOffers(prev => [newOffer, ...prev]);
  };
  const listArtworkOnBourse = (artworkId, askPrice) => {
    setArtworks(prev => prev.map(art => art.id === artworkId ? { ...art, status: 'bourse', price: askPrice } : art));
  };

  // Wishlist
  const addToWishlist = (artworkId) => {
    setWishlist((prev) => (prev.includes(artworkId) ? prev : [...prev, artworkId]));
    broadcastNotification('Artwork added to your saved wishlist.');
  };
  const removeFromWishlist = (artworkId) => setWishlist((prev) => prev.filter((id) => id !== artworkId));
  const clearWishlist = () => setWishlist([]);

  // Followed Artists
  const followArtist = (artistId) => {
    setFollowedArtists((prev) => (prev.includes(artistId) ? prev : [...prev, artistId]));
    broadcastNotification('You are now following this master artist. You will receive notifications when they upload new works.');
  };
  const unfollowArtist = (artistId) => {
    setFollowedArtists((prev) => prev.filter((id) => id !== artistId));
  };
  const toggleFollowArtist = (artistId) => {
    if (followedArtists.includes(artistId)) {
      unfollowArtist(artistId);
    } else {
      followArtist(artistId);
    }
  };

  // Auction Reminders
  const toggleAuctionReminder = (lotId) => {
    setAuctionReminders((prev) => {
      const exists = prev.includes(lotId);
      if (exists) {
        broadcastNotification(`Auction closing reminder removed for Lot.`);
        return prev.filter(id => id !== lotId);
      } else {
        broadcastNotification(`Auction closing reminder activated! You will receive countdown notifications before closing.`);
        return [...prev, lotId];
      }
    });
  };

  // Notifications
  const markNotificationRead = (notifId) => setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));
  const deleteNotification = (notifId) => setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  const broadcastNotification = (message) => {
    setNotifications((prev) => [{ id: `notif-${Date.now()}`, message, read: false, date: new Date().toISOString() }, ...prev]);
  };

  // Q&A
  const askQuestion = (artworkId, question, askedBy) => {
    const newQ = { id: `q-${Date.now()}`, artworkId, question, askedBy: askedBy || 'Anonymous Collector', date: new Date().toISOString().split('T')[0], answer: null, answeredBy: null, answeredDate: null };
    setArtworkQuestions((prev) => [...prev, newQ]);
  };
  const answerQuestion = (questionId, answer, answeredBy) => {
    setArtworkQuestions((prev) => prev.map((q) => q.id === questionId ? { ...q, answer, answeredBy, answeredDate: new Date().toISOString().split('T')[0] } : q));
  };
  const deleteQuestion = (questionId) => setArtworkQuestions((prev) => prev.filter((q) => q.id !== questionId));
  const editQuestionAnswer = (questionId, newAnswer, answeredBy) => {
    setArtworkQuestions((prev) => prev.map((q) => q.id === questionId ? { ...q, answer: newAnswer, answeredBy: answeredBy || q.answeredBy, answeredDate: new Date().toISOString().split('T')[0] } : q));
  };

  // Collector Offers
  const submitCollectorOffer = (artworkId, artworkTitle, amount, note, buyerName) => {
    const offer = { id: `coffer-${Date.now()}`, artworkId, artworkTitle, amount: parseFloat(amount), note, buyerName, buyerId: currentUser?.id || 'anon-buyer', date: new Date().toISOString().split('T')[0], status: 'pending' };
    setCollectorOffers((prev) => [...prev, offer]);
  };
  const updateCollectorOfferStatus = (offerId, status, counterAmount = null) => {
    setCollectorOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, status, ...(counterAmount ? { counterAmount: parseFloat(counterAmount) } : {}) } : o));
  };
  const updateCollectorOffer = (offerId, updatedFields) => {
    setCollectorOffers((prev) => prev.map((o) => o.id === offerId ? { ...o, ...updatedFields } : o));
  };
  const cancelCollectorOffer = (offerId) => setCollectorOffers((prev) => prev.filter((o) => o.id !== offerId));

  // =========================================================================
  // AUTHENTICATION & RESEND TRANSACTIONAL EMAIL REGISTRATION
  // =========================================================================
  const requestVerificationOtp = async (email, name, role = 'buyer') => {
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), role })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Failed to dispatch verification OTP:', err);
      return { success: false, error: 'Network error. Could not dispatch verification email.' };
    }
  };

  const verifyOtpAndRegister = async ({ email, code, name, password, role = 'buyer' }) => {
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanCode = (code || '').toString().trim();

      // 1. Verify 6-digit code via server endpoint
      const verifyRes = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, code: cleanCode })
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.success) {
        return { success: false, error: verifyData.error || 'Invalid 6-digit verification code.' };
      }

      // 2. Check if already exists in users list
      if (usersList.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email address already exists. Please sign in.' };
      }

      // 3. Create fresh verified user record
      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password,
        role: role || 'buyer',
        subscription_tier: role === 'artist' ? 'standard' : 'free',
        status: 'active',
        statusReason: '',
        created_at: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        cloudflareVerified: true,
        securityIncidents: []
      };

      const updatedUsers = [...usersList, newUser];
      setUsersList(updatedUsers);
      setCurrentUser(newUser);
      setIsLoggedIn(true);

      try {
        localStorage.setItem('artellium_users', JSON.stringify(updatedUsers));
        localStorage.setItem('artellium_login_state', JSON.stringify({ isLoggedIn: true, user: newUser }));
      } catch (e) {}

      // 4. Dispatch welcome and login security alert email via Resend
      try {
        fetch('/api/emails/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login_alert',
            to: cleanEmail,
            name: newUser.name,
            role: newUser.role,
            ipAddress: 'Verified Cloudflare IP',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Artellium Web Session'
          })
        }).catch(() => {});
      } catch (e) {}

      return { success: true, user: newUser };
    } catch (err) {
      console.error('Verify OTP and register error:', err);
      return { success: false, error: 'Registration error. Please retry.' };
    }
  };

  const switchUserRole = (role) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      try {
        localStorage.setItem('artellium_login_state', JSON.stringify({ isLoggedIn: true, user: updated }));
      } catch (e) {}
    }
  };

  const login = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Check credentials against users database
    const user = usersList.find(u => 
      u.email.toLowerCase() === cleanEmail && 
      (!u.password || u.password === password)
    );

    if (!user) {
      return { success: false, message: 'Invalid email address or password. Please verify your credentials.' };
    }

    if (user.status === 'blocked') {
      return { 
        success: false, 
        message: '⛔ This account has been permanently suspended by the Artellium Security Council.' 
      };
    }

    setCurrentUser(user);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('artellium_login_state', JSON.stringify({ isLoggedIn: true, user }));
    } catch (e) {}

    // Dispatch Login Security Alert Email via Resend
    try {
      fetch('/api/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login_alert',
          to: user.email,
          name: user.name,
          role: user.role,
          ipAddress: 'Verified Cloudflare IP',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Artellium Secure Web'
        })
      }).catch(() => {});
    } catch (e) {}

    return { success: true, user };
  };

  const signup = (name, email, password, role) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (usersList.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email address already registered.' };
    }
    const newUser = { 
      id: `user-${Date.now()}`, 
      name, 
      email: cleanEmail, 
      password, 
      role, 
      subscription_tier: role === 'artist' ? 'standard' : 'free',
      status: 'active',
      statusReason: '',
      created_at: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      cloudflareVerified: true,
      securityIncidents: []
    };
    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('artellium_users', JSON.stringify(updatedUsers));
      localStorage.setItem('artellium_login_state', JSON.stringify({ isLoggedIn: true, user: newUser }));
    } catch (e) {}
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('artellium_login_state');
    } catch (e) {}
  };

  // Sovereign User Governance Actions
  const setUserStatus = (userId, newStatus, reason = '') => {
    setUsersList(prev => {
      const updated = prev.map(u => {
        if (u.id === userId) {
          const incident = reason ? {
            id: `sec-${Date.now()}`,
            date: new Date().toISOString(),
            action: newStatus,
            reason: reason,
            recordedBy: currentUser?.name || 'Executive Administrator'
          } : null;

          return {
            ...u,
            status: newStatus,
            statusReason: reason || (newStatus === 'active' ? '' : u.statusReason || ''),
            securityIncidents: incident ? [incident, ...(u.securityIncidents || [])] : (u.securityIncidents || []),
            updated_at: new Date().toISOString()
          };
        }
        return u;
      });
      try {
        localStorage.setItem('artellium_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        status: newStatus,
        statusReason: reason || ''
      }));
    }
  };

  const addUserSecurityIncident = (userId, incidentData) => {
    setUsersList(prev => {
      const updated = prev.map(u => {
        if (u.id === userId) {
          const incident = {
            id: `sec-${Date.now()}`,
            date: new Date().toISOString(),
            type: incidentData.type || 'Foul Play Investigation',
            severity: incidentData.severity || 'Medium',
            reason: incidentData.reason || 'Unusual marketplace activity reported',
            reportedBy: incidentData.reportedBy || currentUser?.name || 'Executive Admin Council',
            status: incidentData.status || 'Active Audit'
          };
          return {
            ...u,
            securityIncidents: [incident, ...(u.securityIncidents || [])]
          };
        }
        return u;
      });
      try {
        localStorage.setItem('artellium_users', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // ==========================================
  // 1. HEADER PAGE CONFIG ACTIONS
  // ==========================================
  const updateHeaderConfig = (updatedFields) => {
    setHeaderConfig(prev => ({ ...prev, ...updatedFields }));
  };

  const addHeaderNavLink = (newLink) => {
    const created = {
      ...newLink,
      id: `nav-${Date.now()}`,
      isVisible: newLink.isVisible !== undefined ? newLink.isVisible : true,
      highlight: newLink.highlight || 'none'
    };
    setHeaderConfig(prev => ({
      ...prev,
      navLinks: [...(prev.navLinks || []), created]
    }));
    return created;
  };

  const updateHeaderNavLink = (linkId, updatedFields) => {
    setHeaderConfig(prev => ({
      ...prev,
      navLinks: (prev.navLinks || []).map(l => l.id === linkId ? { ...l, ...updatedFields } : l)
    }));
  };

  const deleteHeaderNavLink = (linkId) => {
    setHeaderConfig(prev => ({
      ...prev,
      navLinks: (prev.navLinks || []).filter(l => l.id !== linkId)
    }));
  };

  const resetHeaderConfig = () => {
    setHeaderConfig(INITIAL_HEADER_CONFIG);
  };

  // ==========================================
  // 2. HERO PAGE CONFIG ACTIONS
  // ==========================================
  const updateHeroConfig = (updatedFields) => {
    setHeroConfig(prev => ({ ...prev, ...updatedFields }));
  };

  const setHeroMediaFromGallery = (artworkId) => {
    const art = artworks.find(a => a.id === artworkId);
    if (!art) return false;
    setHeroConfig(prev => ({
      ...prev,
      mediaType: 'image',
      mediaUrl: art.image,
      videoPoster: art.image,
      featuredLot: {
        badge: 'LOT OF THE MONTH',
        title: art.title,
        artist: `${art.artistName} (${art.country || 'Africa'})`,
        price: `₦${art.price?.toLocaleString()}`,
        medium: art.medium || 'Fine Art',
        image: art.image,
        artworkId: art.id,
        isVisible: true
      }
    }));
    return true;
  };

  const addHeroSlide = (newSlide) => {
    const created = {
      ...newSlide,
      id: `slide-${Date.now()}`
    };
    setHeroConfig(prev => ({
      ...prev,
      slides: [...(prev.slides || []), created]
    }));
    return created;
  };

  const updateHeroSlide = (slideId, updatedFields) => {
    setHeroConfig(prev => ({
      ...prev,
      slides: (prev.slides || []).map(s => s.id === slideId ? { ...s, ...updatedFields } : s)
    }));
  };

  const deleteHeroSlide = (slideId) => {
    setHeroConfig(prev => ({
      ...prev,
      slides: (prev.slides || []).filter(s => s.id !== slideId)
    }));
  };

  const resetHeroConfig = () => {
    setHeroConfig(INITIAL_HERO_CONFIG);
  };

  // ==========================================
  // 3. HOME PAGE CONFIG ACTIONS
  // ==========================================
  const updateHomePageConfig = (updatedFields) => {
    setHomePageConfig(prev => ({ ...prev, ...updatedFields }));
  };

  const updateHomeSection = (sectionId, updatedFields) => {
    setHomePageConfig(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => s.id === sectionId ? { ...s, ...updatedFields } : s)
    }));
  };

  const toggleSectionVisibility = (sectionId) => {
    setHomePageConfig(prev => ({
      ...prev,
      sections: (prev.sections || []).map(s => s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s)
    }));
  };

  const reorderHomeSections = (newSections) => {
    setHomePageConfig(prev => ({
      ...prev,
      sections: newSections
    }));
  };

  const addPromoBanner = (newBanner) => {
    const created = {
      ...newBanner,
      id: `promo-${Date.now()}`,
      isVisible: true
    };
    setHomePageConfig(prev => ({
      ...prev,
      customPromoBanners: [...(prev.customPromoBanners || []), created]
    }));
    return created;
  };

  const updatePromoBanner = (bannerId, updatedFields) => {
    setHomePageConfig(prev => ({
      ...prev,
      customPromoBanners: (prev.customPromoBanners || []).map(b => b.id === bannerId ? { ...b, ...updatedFields } : b)
    }));
  };

  const deletePromoBanner = (bannerId) => {
    setHomePageConfig(prev => ({
      ...prev,
      customPromoBanners: (prev.customPromoBanners || []).filter(b => b.id !== bannerId)
    }));
  };

  const resetHomePageConfig = () => {
    setHomePageConfig(INITIAL_HOMEPAGE_CONFIG);
  };

  // ==========================================
  // 4. FOOTER PAGE CONFIG ACTIONS
  // ==========================================
  const updateFooterConfig = (updatedFields) => {
    setFooterConfig(prev => ({ ...prev, ...updatedFields }));
  };

  const addTrustBadge = (newBadge) => {
    const created = {
      ...newBadge,
      id: `badge-${Date.now()}`,
      isVisible: true
    };
    setFooterConfig(prev => ({
      ...prev,
      trustBadges: [...(prev.trustBadges || []), created]
    }));
    return created;
  };

  const updateTrustBadge = (badgeId, updatedFields) => {
    setFooterConfig(prev => ({
      ...prev,
      trustBadges: (prev.trustBadges || []).map(b => b.id === badgeId ? { ...b, ...updatedFields } : b)
    }));
  };

  const deleteTrustBadge = (badgeId) => {
    setFooterConfig(prev => ({
      ...prev,
      trustBadges: (prev.trustBadges || []).filter(b => b.id !== badgeId)
    }));
  };

  const addFooterColumn = (newCol) => {
    const created = {
      ...newCol,
      id: `col-${Date.now()}`,
      links: newCol.links || []
    };
    setFooterConfig(prev => ({
      ...prev,
      columns: [...(prev.columns || []), created]
    }));
    return created;
  };

  const updateFooterColumn = (colId, updatedFields) => {
    setFooterConfig(prev => ({
      ...prev,
      columns: (prev.columns || []).map(c => c.id === colId ? { ...c, ...updatedFields } : c)
    }));
  };

  const deleteFooterColumn = (colId) => {
    setFooterConfig(prev => ({
      ...prev,
      columns: (prev.columns || []).filter(c => c.id !== colId)
    }));
  };

  const addFooterLink = (columnId, newLink) => {
    const created = {
      ...newLink,
      id: `link-${Date.now()}`,
      isVisible: true
    };
    setFooterConfig(prev => ({
      ...prev,
      columns: (prev.columns || []).map(c => {
        if (c.id === columnId) {
          return { ...c, links: [...(c.links || []), created] };
        }
        return c;
      })
    }));
    return created;
  };

  const updateFooterLink = (columnId, linkId, updatedFields) => {
    setFooterConfig(prev => ({
      ...prev,
      columns: (prev.columns || []).map(c => {
        if (c.id === columnId) {
          return {
            ...c,
            links: (c.links || []).map(l => l.id === linkId ? { ...l, ...updatedFields } : l)
          };
        }
        return c;
      })
    }));
  };

  const deleteFooterLink = (columnId, linkId) => {
    setFooterConfig(prev => ({
      ...prev,
      columns: (prev.columns || []).map(c => {
        if (c.id === columnId) {
          return {
            ...c,
            links: (c.links || []).filter(l => l.id !== linkId)
          };
        }
        return c;
      })
    }));
  };

  const addSocialLink = (newSocial) => {
    const created = {
      ...newSocial,
      id: `soc-${Date.now()}`,
      isVisible: true
    };
    setFooterConfig(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), created]
    }));
    return created;
  };

  const updateSocialLink = (socialId, updatedFields) => {
    setFooterConfig(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).map(s => s.id === socialId ? { ...s, ...updatedFields } : s)
    }));
  };

  const deleteSocialLink = (socialId) => {
    setFooterConfig(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter(s => s.id !== socialId)
    }));
  };

  const resetFooterConfig = () => {
    setFooterConfig(INITIAL_FOOTER_CONFIG);
  };

  // ==========================================
  // 5. PRIORITY BANNER PLACEMENT & PRICING ACTIONS
  // ==========================================
  const updatePriorityBannerPricing = (updatedPricing) => {
    setPriorityBannerPricing(prev => ({ ...prev, ...updatedPricing }));
    broadcastNotification('Priority Banner placement pricing updated successfully by platform administrator.');
  };

  const requestPriorityBannerPlacement = (requestData) => {
    const created = {
      ...requestData,
      id: `pbp-${Date.now()}`,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + (requestData.plan === 'boost_7d' ? 7 : requestData.plan === 'annual' ? 365 : 30) * 86400000).toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    setPriorityBannerPlacements(prev => [created, ...prev]);
    broadcastNotification(`Artist "${requestData.artistName || 'Master Artist'}" placed "${requestData.title || 'Masterpiece'}" on the Homepage Spotlight Banner.`);
    return created;
  };

  const approvePriorityBannerPlacement = (placementId) => {
    setPriorityBannerPlacements(prev => prev.map(p => p.id === placementId ? { ...p, status: 'active' } : p));
    broadcastNotification('Priority Banner placement approved and now live on homepage.');
  };

  const rejectPriorityBannerPlacement = (placementId) => {
    setPriorityBannerPlacements(prev => prev.map(p => p.id === placementId ? { ...p, status: 'rejected' } : p));
  };

  const deletePriorityBannerPlacement = (placementId) => {
    setPriorityBannerPlacements(prev => prev.filter(p => p.id !== placementId));
  };

  const addDirectPriorityBannerPlacement = (placementData) => {
    const created = {
      ...placementData,
      id: `pbp-${Date.now()}`,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
    };
    setPriorityBannerPlacements(prev => [created, ...prev]);
    return created;
  };

  // =========================================================================
  // PAN-AFRICAN MULTI-FEATURE OPERATIONS & HELPER FUNCTIONS
  // =========================================================================
  
  // 1. Flash Deals Operations
  const addFlashDeal = (dealData) => {
    const newDeal = {
      id: `fd-${Date.now()}`,
      status: 'active',
      claimedPercent: 0,
      availableUnits: 1,
      endsAt: Date.now() + 1000 * 60 * 60 * 24,
      ...dealData
    };
    setFlashDeals(prev => [newDeal, ...prev]);
    broadcastNotification(`⚡ New Flash Deal launched: "${newDeal.title}" at ${newDeal.discountPercent}% discount!`);
    return newDeal;
  };

  const updateFlashDeal = (id, updates) => {
    setFlashDeals(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteFlashDeal = (id) => {
    setFlashDeals(prev => prev.filter(d => d.id !== id));
  };

  const claimFlashDeal = (dealId, collectorName = 'Collector') => {
    setFlashDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const nextClaimed = Math.min(100, (d.claimedPercent || 0) + 15);
        return { ...d, claimedPercent: nextClaimed };
      }
      return d;
    }));
    broadcastNotification(`⚡ Flash deal reserved by ${collectorName}.`);
  };

  // 2. Royal Heirlooms & Private Treaty Inquiries
  const addRoyalHeirloom = (heirloomData) => {
    const newHeirloom = {
      id: `art-royal-${Date.now()}`,
      status: 'Available for Private Treaty',
      provenanceHash: `ROYAL-${Math.floor(10000 + Math.random() * 90000)}-CERT`,
      ...heirloomData
    };
    setRoyalHeirlooms(prev => [newHeirloom, ...prev]);
    broadcastNotification(`👑 Royal Heirloom archived: "${newHeirloom.title}".`);
    return newHeirloom;
  };

  const updateRoyalHeirloom = (id, updates) => {
    setRoyalHeirlooms(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteRoyalHeirloom = (id) => {
    setRoyalHeirlooms(prev => prev.filter(h => h.id !== id));
  };

  const submitRoyalInquiry = (inquiryData) => {
    const newInq = {
      id: `inq-royal-${Date.now()}`,
      status: 'under_curatorial_review',
      date: new Date().toISOString(),
      ...inquiryData
    };
    setRoyalInquiries(prev => [newInq, ...prev]);
    broadcastNotification(`👑 Private inquiry received for "${inquiryData.heirloomTitle || 'Royal Heirloom'}" from ${inquiryData.collectorName || 'Collector'}.`);
    return newInq;
  };

  const updateRoyalInquiryStatus = (id, status, notes = '') => {
    setRoyalInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status, notes: notes || inq.notes } : inq));
  };

  // 3. Curator Picks & Reviews
  const addCuratorPick = (pickData) => {
    const newPick = {
      id: `cp-${Date.now()}`,
      status: 'published',
      rating: 5.0,
      ...pickData
    };
    setCuratorPicks(prev => [newPick, ...prev]);
    broadcastNotification(`✨ Curator Pick published: "${newPick.title}" by ${newPick.curatorName}.`);
    return newPick;
  };

  const updateCuratorPick = (id, updates) => {
    setCuratorPicks(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteCuratorPick = (id) => {
    setCuratorPicks(prev => prev.filter(p => p.id !== id));
  };

  // 4. Provenance Ledger Blocks Minting
  const mintLedgerBlock = (blockData) => {
    const newBlock = {
      id: `PL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      blockHeight: `#00${8943 + ledgerBlocks.length}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      provenanceHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
      physicalCertificateId: `ART-CERT-PAN-${Math.floor(10000 + Math.random() * 90000)}-SEALED`,
      status: 'Vault Verified & Transferred',
      ...blockData
    };
    setLedgerBlocks(prev => [newBlock, ...prev]);
    broadcastNotification(`🛡️ Immutable Provenance Block ${newBlock.blockHeight} minted for "${newBlock.artworkTitle}".`);
    return newBlock;
  };

  const updateLedgerBlock = (id, updates) => {
    setLedgerBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    broadcastNotification(`📜 Provenance block updated successfully.`);
  };

  const deleteLedgerBlock = (id) => {
    setLedgerBlocks(prev => prev.filter(b => b.id !== id));
    broadcastNotification(`🗑️ Provenance block removed from ledger.`);
  };

  // 5. Artist KYC Verification Dossier
  const requestArtistVerification = (verificationData) => {
    const newVerif = {
      id: `verif-${Date.now()}`,
      status: 'pending_review',
      kycHash: `VERIF-${(verificationData.country || 'AF').substring(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}-PENDING`,
      ...verificationData
    };
    setArtistVerifications(prev => [newVerif, ...prev]);
    broadcastNotification(`🏅 Verification application submitted by artist ${verificationData.artistName}.`);
    return newVerif;
  };

  const updateArtistVerificationStatus = (id, status, badge = 'gold', badgeLabel = 'Gold Crest Certified') => {
    setArtistVerifications(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          status,
          badge,
          badgeLabel,
          kycHash: v.kycHash.replace('-PENDING', `-${badge.toUpperCase()}`),
          approvalDate: new Date().toISOString().substring(0, 10)
        };
      }
      return v;
    }));
    broadcastNotification(`🏅 Artist verification status updated to "${status}".`);
  };

  // 6. Universal Multi-Currency Formatter
  const formatCurrency = (amountInNGN, targetCurrency = currency) => {
    if (!amountInNGN && amountInNGN !== 0) return '₦0';
    const currMeta = PAN_AFRICAN_CURRENCIES[targetCurrency] || PAN_AFRICAN_CURRENCIES.NGN;
    const converted = Math.round(amountInNGN * currMeta.rate);
    return `${currMeta.symbol}${converted.toLocaleString()}`;
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        login,
        signup,
        requestVerificationOtp,
        verifyOtpAndRegister,
        logout,
        usersList,
        addUser,
        updateUser,
        deleteUser,
        setUserStatus,
        addUserSecurityIncident,
        sellers,
        addSeller,
        updateSeller,
        deleteSeller,
        switchUserRole,
        artworks,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        setArtworkStatusSold,
        setArtistVerificationBadge,
        updateArtistStudioNotes,
        orders,
        updateOrder,
        deleteOrder,
        updateOrderLogistics,
        confirmCollectorDelivery,
        payments,
        updatePayment,
        deletePayment,
        commissions,
        updateCommission,
        deleteCommission,
        createOrderWithPayment,
        updateOrderStatus,
        disburseCommission,
        videos,
        addVideo,
        deleteVideo,
        exhibitions,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeVideo,
        setActiveVideo,
        currency,
        setCurrency,
        formatCurrency,
        panAfricanCurrencies,
        panAfricanRegions,
        flashDeals,
        addFlashDeal,
        updateFlashDeal,
        deleteFlashDeal,
        claimFlashDeal,
        royalHeirlooms,
        addRoyalHeirloom,
        updateRoyalHeirloom,
        deleteRoyalHeirloom,
        royalInquiries,
        submitRoyalInquiry,
        updateRoyalInquiryStatus,
        curatorPicks,
        addCuratorPick,
        updateCuratorPick,
        deleteCuratorPick,
        ledgerBlocks,
        mintLedgerBlock,
        updateLedgerBlock,
        deleteLedgerBlock,
        artistPayoutPercentage,
        updateArtistPayoutPercentage,
        artistVerifications,
        requestArtistVerification,
        updateArtistVerificationStatus,
        artistCuratorSubmissions,
        setArtistCuratorSubmissions,
        placeBid,
        auctionBidders,
        isBidderRegistered,
        registerAuctionBidder,
        updateBidderHighValueApproval,
        deleteAuctionBidder,
        transactions,
        addTransaction,
        settleTransaction,
        freezeTransaction,
        updateFreightStatus,
        curatorApplications,
        approveCurator,
        rejectCurator,
        artistSignatures,
        saveArtistSignature,
        privateOffers,
        acceptPrivateOffer,
        rejectPrivateOffer,
        makeBuyoutOffer,
        listArtworkOnBourse,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        followedArtists,
        followArtist,
        unfollowArtist,
        toggleFollowArtist,
        auctionReminders,
        toggleAuctionReminder,
        notifications,
        markNotificationRead,
        deleteNotification,
        broadcastNotification,
        artworkQuestions,
        askQuestion,
        answerQuestion,
        deleteQuestion,
        editQuestionAnswer,
        collectorOffers,
        submitCollectorOffer,
        updateCollectorOfferStatus,
        updateCollectorOffer,
        cancelCollectorOffer,
        // Header
        headerConfig,
        updateHeaderConfig,
        addHeaderNavLink,
        updateHeaderNavLink,
        deleteHeaderNavLink,
        resetHeaderConfig,
        // Hero
        heroConfig,
        updateHeroConfig,
        setHeroMediaFromGallery,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        resetHeroConfig,
        // Home Page
        homePageConfig,
        updateHomePageConfig,
        updateHomeSection,
        toggleSectionVisibility,
        reorderHomeSections,
        addPromoBanner,
        updatePromoBanner,
        deletePromoBanner,
        resetHomePageConfig,
        // Footer
        footerConfig,
        updateFooterConfig,
        addTrustBadge,
        updateTrustBadge,
        deleteTrustBadge,
        addFooterColumn,
        updateFooterColumn,
        deleteFooterColumn,
        addFooterLink,
        updateFooterLink,
        deleteFooterLink,
        addSocialLink,
        updateSocialLink,
        deleteSocialLink,
        resetFooterConfig,
        // Priority Banner Management & Pricing
        priorityBannerPricing,
        updatePriorityBannerPricing,
        priorityBannerPlacements,
        requestPriorityBannerPlacement,
        approvePriorityBannerPlacement,
        rejectPriorityBannerPlacement,
        deletePriorityBannerPlacement,
        addDirectPriorityBannerPlacement,
        // WEMA Bank Payment Settings
        paymentSettings,
        updatePaymentSettings
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}


