-- =========================================================================
-- ARTELLIUM AFRICA — STORAGE, AUTH TRIGGERS & RPC FUNCTIONS SUITE
-- Adds Supabase Storage Buckets, Auth Triggers, and Stored Procedures
-- =========================================================================

-- =========================================================================
-- 1. SUPABASE STORAGE BUCKETS CONFIGURATION
-- =========================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
('artworks', 'artworks', true),
('avatars', 'avatars', true),
('certificates', 'certificates', true),
('dossiers', 'dossiers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies: Public Read Access
DROP POLICY IF EXISTS "Public can view artwork images" ON storage.objects;
CREATE POLICY "Public can view artwork images" ON storage.objects 
FOR SELECT USING (bucket_id IN ('artworks', 'avatars', 'certificates', 'dossiers'));

-- Storage Policies: Authenticated Upload Access
DROP POLICY IF EXISTS "Authenticated users can upload artwork images" ON storage.objects;
CREATE POLICY "Authenticated users can upload artwork images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id IN ('artworks', 'avatars', 'certificates', 'dossiers'));

-- =========================================================================
-- 2. SUPABASE AUTH TO PUBLIC USERS AUTO-SYNC TRIGGER
-- Automatically creates a public.users row whenever someone signs up via Supabase Auth
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
    INSERT INTO public.users (id, name, email, role, avatar_url, phone, country)
    VALUES (
        NEW.id::text,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'country', 'Nigeria')
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url);

    -- If registered as artist, automatically create seller record
    IF (NEW.raw_user_meta_data->>'role') = 'artist' THEN
        INSERT INTO public.sellers (id, user_id, name, bio, country, city, country_flag, avatar_url, tier, verification_badge)
        VALUES (
            'seller-' || NEW.id::text,
            NEW.id::text,
            COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            COALESCE(NEW.raw_user_meta_data->>'bio', 'Verified Pan-African Fine Artist & Studio Master.'),
            COALESCE(NEW.raw_user_meta_data->>'country', 'Nigeria'),
            COALESCE(NEW.raw_user_meta_data->>'city', 'Lagos'),
            '🇳🇬',
            NEW.raw_user_meta_data->>'avatar_url',
            'Standard',
            'verified'
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 3. ATOMIC LIVE AUCTION BIDDING STORED PROCEDURE (RPC)
-- Prevents race conditions and guarantees bid integrity during live auctions
-- =========================================================================
CREATE OR REPLACE FUNCTION public.place_live_bid(
    p_artwork_id TEXT,
    p_bidder_id TEXT,
    p_bidder_name TEXT,
    p_amount NUMERIC
)
RETURNS JSONB AS $
DECLARE
    v_current_bid NUMERIC;
    v_starting_bid NUMERIC;
    v_status TEXT;
    v_new_total INT;
BEGIN
    -- Fetch artwork pricing and auction status with row lock
    SELECT COALESCE(current_bid, starting_bid, price), starting_bid, status, total_bids
    INTO v_current_bid, v_starting_bid, v_status, v_new_total
    FROM public.artworks
    WHERE id = p_artwork_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Artwork not found');
    END IF;

    IF v_status != 'auction' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Artwork is not currently in live auction');
    END IF;

    IF p_amount <= v_current_bid THEN
        RETURN jsonb_build_object('success', false, 'message', 'Bid must be higher than current valuation of ' || v_current_bid);
    END IF;

    -- Update artwork current bid and increment total bids
    UPDATE public.artworks
    SET 
        current_bid = p_amount,
        total_bids = COALESCE(total_bids, 0) + 1,
        updated_at = NOW()
    WHERE id = p_artwork_id;

    -- Log bid record
    INSERT INTO public.bids (id, artwork_id, bidder_id, bidder_name, amount, created_at)
    VALUES (
        'bid-' || extract(epoch from now())::bigint || '-' || floor(random()*1000)::text,
        p_artwork_id,
        p_bidder_id,
        p_bidder_name,
        p_amount,
        NOW()
    );

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Bid placed successfully',
        'current_highest_bid', p_amount,
        'total_bids', COALESCE(v_new_total, 0) + 1
    );
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
