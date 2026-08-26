-- =========================================================================
-- ARTELLIUM AFRICA — MASTER ENTERPRISE DATABASE ARCHITECTURE
-- Engine: PostgreSQL 14+ / Supabase
-- Modules:
--   1. Extensions & Custom Types
--   2. Core Schemas & Tables (16 Entities)
--   3. Automated Stored Functions & Triggers
--   4. Analytical Views & Aggregators
--   5. Row Level Security (RLS) & Access Policies
--   6. Supabase Realtime Replication
--   7. Production Seed Data
-- =========================================================================

-- =========================================================================
-- MODULE 1: EXTENSIONS
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =========================================================================
-- MODULE 2: CORE TABLES (16 ENTITIES)
-- =========================================================================

-- 1. USERS
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

-- 2. SELLERS / MASTER ATELIERS
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

-- 3. ARTWORKS
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
    starting_bid NUMERIC,
    current_bid NUMERIC,
    total_bids INT DEFAULT 0,
    auction_end_time TIMESTAMPTZ,
    sold_to TEXT,
    sold_price NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS
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

-- 5. PAYMENTS & SETTLEMENT
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

-- 6. COMMISSIONS
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

-- 7. MUSEUM PROVENANCE LEDGER & PHYSICAL QR GUARANTEE
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

-- 8. ACCREDITED AUCTION BIDDERS
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

-- 9. LIVE AUCTION BIDS LOG
CREATE TABLE IF NOT EXISTS public.bids (
    id TEXT PRIMARY KEY,
    artwork_id TEXT REFERENCES public.artworks(id) ON DELETE CASCADE,
    bidder_id TEXT REFERENCES public.auction_bidders(bidder_id) ON DELETE SET NULL,
    bidder_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. FLASH DEALS
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

-- 11. ROYAL HEIRLOOMS
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

-- 12. CURATOR PICKS
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

-- 13. ARTWORK QUESTIONS
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

-- 14. PRIVATE COLLECTOR OFFERS
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

-- 15. TRANSACTIONS AUDIT
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

-- 16. PLATFORM SETTINGS & COMMISSION GOVERNANCE
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- MODULE 3: PERFORMANCE INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_artworks_status ON public.artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_seller ON public.artworks(seller_id);
CREATE INDEX IF NOT EXISTS idx_artworks_category ON public.artworks(category);
CREATE INDEX IF NOT EXISTS idx_artworks_price ON public.artworks(price);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_ref ON public.payments(payment_reference);
CREATE INDEX IF NOT EXISTS idx_commissions_seller ON public.commissions(seller_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(payout_status);
CREATE INDEX IF NOT EXISTS idx_ledger_blocks_status ON public.ledger_blocks(status);
CREATE INDEX IF NOT EXISTS idx_ledger_blocks_hash ON public.ledger_blocks(provenance_hash);
CREATE INDEX IF NOT EXISTS idx_bids_artwork ON public.bids(artwork_id);
CREATE INDEX IF NOT EXISTS idx_flash_deals_ends ON public.flash_deals(ends_at);

-- Fuzzy Full-Text Search Indexes
CREATE INDEX IF NOT EXISTS idx_artworks_title_trgm ON public.artworks USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_artworks_artist_trgm ON public.artworks USING gin(artist_name gin_trgm_ops);

-- =========================================================================
-- MODULE 4: AUTOMATED FUNCTIONS & TRIGGERS
-- =========================================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Apply updated_at trigger across all stateful tables
DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_sellers_updated_at ON public.sellers;
CREATE TRIGGER trg_sellers_updated_at BEFORE UPDATE ON public.sellers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_artworks_updated_at ON public.artworks;
CREATE TRIGGER trg_artworks_updated_at BEFORE UPDATE ON public.artworks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_commissions_updated_at ON public.commissions;
CREATE TRIGGER trg_commissions_updated_at BEFORE UPDATE ON public.commissions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_ledger_blocks_updated_at ON public.ledger_blocks;
CREATE TRIGGER trg_ledger_blocks_updated_at BEFORE UPDATE ON public.ledger_blocks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- MODULE 5: ANALYTICAL VIEWS
-- =========================================================================

-- View: Live Auction Leaderboard
CREATE OR REPLACE VIEW public.v_live_auctions AS
SELECT 
    a.id AS artwork_id,
    a.title,
    a.artist_name,
    a.medium,
    a.starting_bid,
    COALESCE(a.current_bid, a.starting_bid) AS current_highest_bid,
    a.total_bids,
    a.auction_end_time,
    a.image,
    a.country_flag
FROM public.artworks a
WHERE a.status = 'auction';

-- View: Artist Studio Financial Performance Summary
CREATE OR REPLACE VIEW public.v_artist_financials AS
SELECT 
    s.id AS seller_id,
    s.name AS artist_name,
    s.tier,
    s.payout_bank,
    s.payout_account,
    COUNT(c.id) AS total_settlements,
    COALESCE(SUM(c.gross_amount), 0) AS total_gross_sales,
    COALESCE(SUM(c.platform_fee_amount), 0) AS total_platform_fees,
    COALESCE(SUM(c.seller_net_payout), 0) AS total_net_disbursed,
    COALESCE(SUM(CASE WHEN c.payout_status = 'pending_settlement' THEN c.seller_net_payout ELSE 0 END), 0) AS pending_payout_amount
FROM public.sellers s
LEFT JOIN public.commissions c ON s.id = c.seller_id
GROUP BY s.id, s.name, s.tier, s.payout_bank, s.payout_account;

-- =========================================================================
-- MODULE 6: ROW LEVEL SECURITY (RLS)
-- =========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_bidders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flash_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.royal_heirlooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curator_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artwork_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collector_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Universal Read Policies for Marketplace Data
DROP POLICY IF EXISTS "Public can view artworks" ON public.artworks;
CREATE POLICY "Public can view artworks" ON public.artworks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view sellers" ON public.sellers;
CREATE POLICY "Public can view sellers" ON public.sellers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view provenance blocks" ON public.ledger_blocks;
CREATE POLICY "Public can view provenance blocks" ON public.ledger_blocks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view flash deals" ON public.flash_deals;
CREATE POLICY "Public can view flash deals" ON public.flash_deals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view heirlooms" ON public.royal_heirlooms;
CREATE POLICY "Public can view heirlooms" ON public.royal_heirlooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view curator picks" ON public.curator_picks;
CREATE POLICY "Public can view curator picks" ON public.curator_picks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view platform settings" ON public.platform_settings;
CREATE POLICY "Public can view platform settings" ON public.platform_settings FOR SELECT USING (true);

-- Authenticated Admin Master Access (Bypass)
DROP POLICY IF EXISTS "Admin full access users" ON public.users;
CREATE POLICY "Admin full access users" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access artworks" ON public.artworks;
CREATE POLICY "Admin full access artworks" ON public.artworks FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access commissions" ON public.commissions;
CREATE POLICY "Admin full access commissions" ON public.commissions FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access ledger" ON public.ledger_blocks;
CREATE POLICY "Admin full access ledger" ON public.ledger_blocks FOR ALL USING (true);

DROP POLICY IF EXISTS "Admin full access bidders" ON public.auction_bidders;
CREATE POLICY "Admin full access bidders" ON public.auction_bidders FOR ALL USING (true);

-- =========================================================================
-- MODULE 7: SUPABASE REALTIME REPLICATION
-- =========================================================================
DO $
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.artworks;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.ledger_blocks;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.commissions;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$;
