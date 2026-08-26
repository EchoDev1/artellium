-- =========================================================================
-- ARTELLIUM AFRICA — SELF-HEALING MIGRATION PATCH
-- Safely adds all missing columns to existing Supabase tables
-- =========================================================================

-- 1. PATCH ARTWORKS TABLE
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS starting_bid NUMERIC;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS current_bid NUMERIC;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS total_bids INT DEFAULT 0;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS auction_end_time TIMESTAMPTZ;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS artist_type TEXT DEFAULT 'Standard';
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS artist_avatar TEXT;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS verification_badge TEXT;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS studio_notes TEXT;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS country_flag TEXT DEFAULT '🇳🇬';
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Lagos';
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Nigeria';
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS ships_to JSONB DEFAULT '["Africa", "Europe", "North America"]'::jsonb;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS is_newly_listed BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS sold_to TEXT;
ALTER TABLE IF EXISTS public.artworks ADD COLUMN IF NOT EXISTS sold_price NUMERIC;

-- 2. PATCH SELLERS TABLE
ALTER TABLE IF EXISTS public.sellers ADD COLUMN IF NOT EXISTS payout_account_name TEXT;
ALTER TABLE IF EXISTS public.sellers ADD COLUMN IF NOT EXISTS verification_badge TEXT;
ALTER TABLE IF EXISTS public.sellers ADD COLUMN IF NOT EXISTS studio_notes TEXT;
ALTER TABLE IF EXISTS public.sellers ADD COLUMN IF NOT EXISTS country_flag TEXT DEFAULT '🇳🇬';
ALTER TABLE IF EXISTS public.sellers ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'Standard';

-- 3. PATCH ORDERS & PAYMENTS TABLE
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS settlement_bank TEXT DEFAULT 'Wema Bank PLC';
ALTER TABLE IF EXISTS public.payments ADD COLUMN IF NOT EXISTS settlement_account TEXT DEFAULT '0123456789 (Wema Bank PLC)';

-- 4. PATCH FLASH DEALS TABLE
CREATE TABLE IF NOT EXISTS public.flash_deals (
    id TEXT PRIMARY KEY,
    artwork_id TEXT,
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
ALTER TABLE IF EXISTS public.flash_deals ADD COLUMN IF NOT EXISTS artwork_id TEXT;

-- 5. PATCH ROYAL HEIRLOOMS TABLE
CREATE TABLE IF NOT EXISTS public.royal_heirlooms (
    id TEXT PRIMARY KEY,
    artwork_id TEXT,
    title TEXT NOT NULL,
    origin_dynasty TEXT NOT NULL,
    era_century TEXT NOT NULL,
    custody_vault TEXT NOT NULL,
    valuation NUMERIC NOT NULL,
    certificate_serial TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE IF EXISTS public.royal_heirlooms ADD COLUMN IF NOT EXISTS artwork_id TEXT;

-- 6. PATCH CURATOR PICKS TABLE
CREATE TABLE IF NOT EXISTS public.curator_picks (
    id TEXT PRIMARY KEY,
    artwork_id TEXT,
    title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    curator_name TEXT NOT NULL,
    curator_title TEXT NOT NULL,
    curatorial_statement TEXT NOT NULL,
    featured_rank INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE IF EXISTS public.curator_picks ADD COLUMN IF NOT EXISTS artwork_id TEXT;

-- 7. PATCH ARTWORK QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.artwork_questions (
    id TEXT PRIMARY KEY,
    artwork_id TEXT,
    question TEXT NOT NULL,
    asked_by TEXT NOT NULL,
    answer TEXT,
    answered_by TEXT,
    answered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE IF EXISTS public.artwork_questions ADD COLUMN IF NOT EXISTS artwork_id TEXT;

-- 8. PATCH COLLECTOR OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.collector_offers (
    id TEXT PRIMARY KEY,
    artwork_id TEXT,
    collector_name TEXT NOT NULL,
    collector_email TEXT NOT NULL,
    offer_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    counter_amount NUMERIC,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE IF EXISTS public.collector_offers ADD COLUMN IF NOT EXISTS artwork_id TEXT;

-- 9. PATCH BIDS TABLE
CREATE TABLE IF NOT EXISTS public.bids (
    id TEXT PRIMARY KEY,
    artwork_id TEXT,
    bidder_id TEXT,
    bidder_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE IF EXISTS public.bids ADD COLUMN IF NOT EXISTS artwork_id TEXT;
