-- =========================================================================
-- ARTELLIUM AFRICA — DATABASE SCHEMA
-- Target: PostgreSQL / Supabase
-- Core Entities: Users, Sellers, Artworks, Orders, Payments, Commissions
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

-- 2. SELLERS / ARTISTS TABLE
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
    commission_rate NUMERIC DEFAULT 0.15, -- Platform takes 15%, Seller receives 85%
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
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending_payment', 'paid', 'processing', 'in_transit', 'delivered', 'completed', 'cancelled')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    buyer_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('paystack', 'flutterwave', 'monnify', 'bank_transfer', 'card', 'opay', 'palmpay')),
    payment_reference TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'held_in_escrow' CHECK (status IN ('initiated', 'held_in_escrow', 'disbursed_to_seller', 'failed', 'refunded')),
    paid_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COMMISSIONS TABLE (Platform Fee vs Seller Payout)
CREATE TABLE IF NOT EXISTS public.commissions (
    id TEXT PRIMARY KEY,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_id TEXT REFERENCES public.payments(id) ON DELETE SET NULL,
    artwork_id TEXT REFERENCES public.artworks(id) ON DELETE SET NULL,
    artwork_title TEXT NOT NULL,
    seller_id TEXT REFERENCES public.sellers(id) ON DELETE SET NULL,
    seller_name TEXT NOT NULL,
    gross_amount NUMERIC NOT NULL,
    platform_fee_rate NUMERIC NOT NULL DEFAULT 0.15, -- 15% platform commission
    platform_fee_amount NUMERIC NOT NULL,           -- e.g. ₦277,500
    seller_net_payout NUMERIC NOT NULL,             -- e.g. ₦1,572,500 (85%)
    payout_status TEXT NOT NULL DEFAULT 'pending_escrow' CHECK (payout_status IN ('pending_escrow', 'ready_for_disbursement', 'disbursed', 'frozen')),
    disbursed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_artworks_status ON public.artworks(status);
CREATE INDEX IF NOT EXISTS idx_artworks_seller ON public.artworks(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_seller ON public.commissions(seller_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON public.commissions(payout_status);
