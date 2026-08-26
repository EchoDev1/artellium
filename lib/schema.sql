-- =========================================================================
-- ARTELLIUM AFRICA — COMPLETE PRODUCTION DATABASE SCHEMA
-- Target Engine: PostgreSQL / Supabase
-- Core Entities: Users, Sellers, Artworks, Orders, Payments, Commissions,
--                Provenance Ledger, Flash Deals, Royal Heirlooms,
--                Curator Picks, Auction Bidders, Q&A, and Collector Offers
-- =========================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'artist', 'admin')),
    phone TEXT,
    country TEXT DEFAULT 'Nigeria',
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'standard',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SELLERS / MASTER ATELIERS TABLE
CREATE TABLE IF NOT EXISTS public.sellers (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    bio TEXT,
    country TEXT NOT NULL DEFAULT 'Nigeria',
    city TEXT NOT NULL DEFAULT 'Lagos',
    country_flag TEXT DEFAULT '🇳🇬',
    avatar_url TEXT,
    tier TEXT DEFAULT 'Standard' CHECK (tier IN ('Standard', 'Premium')),
    verification_badge TEXT CHECK (verification_badge IN ('gold', 'heritage', 'verified', NULL)),
    studio_notes TEXT,
    payout_bank TEXT DEFAULT 'Access Bank PLC',
    payout_account TEXT DEFAULT '0123456789',
    payout_account_name TEXT,
    commission_rate NUMERIC DEFAULT 0.15,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARTWORKS TABLE
CREATE TABLE IF NOT EXISTS public.artworks (
    id TEXT PRIMARY KEY,
    seller_id TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
    artist_name TEXT NOT NULL,
    artist_type TEXT DEFAULT 'Standard',
    artist_avatar TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    medium TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    price NUMERIC NOT NULL,
    price_usd NUMERIC,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'auction', 'upcoming', 'bourse')),
    year TEXT DEFAULT '2026',
    provenance TEXT,
    description TEXT,
    image TEXT NOT NULL,
    country TEXT DEFAULT 'Nigeria',
    city TEXT DEFAULT 'Lagos',
    country_flag TEXT DEFAULT '🇳🇬',
    ships_to JSONB DEFAULT '["Africa", "Europe", "North America"]'::jsonb,
    verification_badge TEXT CHECK (verification_badge IN ('gold', 'heritage', 'verified', NULL)),
    studio_notes TEXT,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    is_newly_listed BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    sold_to TEXT,
    sold_price NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    buyer_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_country TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    settlement_bank TEXT DEFAULT 'Wema Bank PLC',
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending_payment', 'paid', 'processing', 'in_transit', 'delivered', 'completed', 'cancelled')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENTS & SETTLEMENT TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    buyer_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    payment_method TEXT NOT NULL DEFAULT 'wema_corporate' CHECK (payment_method IN ('wema_corporate', 'paystack', 'flutterwave', 'monnify', 'bank_transfer', 'card', 'opay', 'palmpay')),
    payment_reference TEXT UNIQUE NOT NULL,
    settlement_account TEXT DEFAULT '0123456789 (Wema Bank PLC)',
    status TEXT NOT NULL DEFAULT 'settled_wema' CHECK (status IN ('initiated', 'settled_wema', 'disbursed_to_seller', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COMMISSIONS TABLE (Platform Fee vs Master Artist Net Remittance)
CREATE TABLE IF NOT EXISTS public.commissions (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_id TEXT REFERENCES public.payments(id) ON DELETE SET NULL,
    artwork_id TEXT REFERENCES public.artworks(id) ON DELETE SET NULL,
    artwork_title TEXT NOT NULL,
    seller_id TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
    seller_name TEXT NOT NULL,
    gross_amount NUMERIC NOT NULL,
    platform_fee_rate NUMERIC NOT NULL DEFAULT 0.15,
    platform_fee_amount NUMERIC NOT NULL,
    seller_net_payout NUMERIC NOT NULL,
    payout_status TEXT NOT NULL DEFAULT 'disbursed' CHECK (payout_status IN ('pending_settlement', 'ready_for_disbursement', 'disbursed', 'frozen')),
    disbursed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MUSEUM PROVENANCE LEDGER & PHYSICAL QR GUARANTEE BLOCKS
CREATE TABLE IF NOT EXISTS public.ledger_blocks (
    id TEXT PRIMARY KEY,
    block_height TEXT NOT NULL,
    artwork_title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    medium TEXT,
    dimensions TEXT,
    category TEXT,
    settlement_price NUMERIC NOT NULL,
    custodian TEXT NOT NULL,
    custodian_location TEXT NOT NULL,
    settlement_bank TEXT DEFAULT 'Wema Bank PLC / Dual Fiduciary Settlement',
    provenance_hash TEXT NOT NULL,
    physical_certificate_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Vault Verified & Transferred',
    hologram_type TEXT DEFAULT '24K Gold Emissary Hologram',
    curator_notes TEXT,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACCREDITED AUCTION BIDDERS DIRECTORY
CREATE TABLE IF NOT EXISTS public.auction_bidders (
    id TEXT PRIMARY KEY,
    bidder_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT NOT NULL DEFAULT 'Nigeria',
    city TEXT DEFAULT 'Lagos',
    id_type TEXT DEFAULT 'International Passport',
    id_number TEXT,
    bidding_tier TEXT DEFAULT 'Sovereign' CHECK (bidding_tier IN ('Sovereign', 'Continental Collector', 'Institutional Vault', 'Standard Bidder')),
    verified BOOLEAN DEFAULT true,
    high_value_approved BOOLEAN DEFAULT true,
    categories JSONB DEFAULT '["Paintings", "Sculptures", "Bronze"]'::jsonb,
    total_bids_placed INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FLASH DEALS
CREATE TABLE IF NOT EXISTS public.flash_deals (
    id TEXT PRIMARY KEY,
    artwork_id TEXT REFERENCES public.artworks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    original_price NUMERIC NOT NULL,
    deal_price NUMERIC NOT NULL,
    discount_percent INT NOT NULL,
    items_left INT DEFAULT 1,
    claimed_percent INT DEFAULT 0,
    image TEXT NOT NULL,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ROYAL HEIRLOOMS & CUSTODIAL PROVENANCE
CREATE TABLE IF NOT EXISTS public.royal_heirlooms (
    id TEXT PRIMARY KEY,
    artwork_id TEXT REFERENCES public.artworks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    origin_dynasty TEXT NOT NULL,
    era_century TEXT NOT NULL,
    custody_vault TEXT NOT NULL,
    valuation NUMERIC NOT NULL,
    certificate_serial TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CURATOR PICKS & EDITORIAL SPOTLIGHT
CREATE TABLE IF NOT EXISTS public.curator_picks (
    id TEXT PRIMARY KEY,
    artwork_id TEXT REFERENCES public.artworks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    curator_name TEXT NOT NULL,
    curator_title TEXT NOT NULL,
    curatorial_statement TEXT NOT NULL,
    featured_rank INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ARTWORK QUESTIONS & PUBLIC ADVISORY
CREATE TABLE IF NOT EXISTS public.artwork_questions (
    id TEXT PRIMARY KEY,
    artwork_id TEXT REFERENCES public.artworks(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    asked_by TEXT NOT NULL,
    answer TEXT,
    answered_by TEXT,
    answered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PRIVATE COLLECTOR OFFERS
CREATE TABLE IF NOT EXISTS public.collector_offers (
    id TEXT PRIMARY KEY,
    artwork_id TEXT REFERENCES public.artworks(id) ON DELETE CASCADE,
    collector_name TEXT NOT NULL,
    collector_email TEXT NOT NULL,
    offer_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'countered', 'rejected')),
    counter_amount NUMERIC,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SOVEREIGN TRANSACTIONS & AUCTION SETTLEMENT AUDIT LOG
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY,
    artwork_title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    artist_payout NUMERIC NOT NULL,
    platform_fee NUMERIC NOT NULL,
    settlement_bank TEXT DEFAULT 'Wema Bank PLC Direct',
    transaction_type TEXT DEFAULT 'Direct Purchase Settlement',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_artworks_status ON public.artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_seller ON public.artworks(seller_id);
CREATE INDEX IF NOT EXISTS idx_artworks_category ON public.artworks(category);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_commissions_seller ON public.commissions(seller_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(payout_status);
CREATE INDEX IF NOT EXISTS idx_ledger_blocks_status ON public.ledger_blocks(status);
CREATE INDEX IF NOT EXISTS idx_ledger_blocks_hash ON public.ledger_blocks(provenance_hash);
CREATE INDEX IF NOT EXISTS idx_auction_bidders_tier ON public.auction_bidders(bidding_tier);
CREATE INDEX IF NOT EXISTS idx_flash_deals_ends ON public.flash_deals(ends_at);

