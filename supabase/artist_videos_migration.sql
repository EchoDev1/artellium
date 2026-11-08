-- =========================================================================
-- ARTELLIUM AFRICA — MASTER ARTIST VIDEOS & SPOTLIGHT PERSISTENCE MIGRATION
-- Authoritative Schema & Security Policies for Live Multi-Device Video Sync
--
-- Instructions:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/lczxzijwarbxggffaemi/sql
-- 2. Paste this entire script into the SQL Editor and click "Run".
-- =========================================================================

-- 1. CREATE TABLE IF NOT EXISTS
CREATE TABLE IF NOT EXISTS public.artist_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artist_name TEXT NOT NULL,
    artist_title TEXT NOT NULL DEFAULT 'Master Artist',
    country TEXT DEFAULT 'Nigeria',
    country_flag TEXT DEFAULT '🇳🇬',
    city TEXT DEFAULT 'Lagos',
    artwork_title TEXT DEFAULT 'Atelier Masterpiece Showcase',
    thumbnail_url TEXT,
    video_url TEXT NOT NULL,
    quote TEXT,
    history TEXT,
    duration TEXT DEFAULT '2:30',
    status TEXT DEFAULT 'approved',
    featured_on_hero BOOLEAN DEFAULT true,
    is_demo BOOLEAN DEFAULT false,
    price_ngn NUMERIC DEFAULT 1850000,
    price_usd NUMERIC DEFAULT 1250,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENSURE ALL COLUMNS EXIST (IN CASE TABLE WAS PREVIOUSLY PARTIAL)
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS artist_title TEXT NOT NULL DEFAULT 'Master Artist';
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Nigeria';
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS country_flag TEXT DEFAULT '🇳🇬';
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Lagos';
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS artwork_title TEXT DEFAULT 'Atelier Masterpiece Showcase';
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS quote TEXT;
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS history TEXT;
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '2:30';
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved';
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS featured_on_hero BOOLEAN DEFAULT true;
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS price_ngn NUMERIC DEFAULT 1850000;
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS price_usd NUMERIC DEFAULT 1250;
ALTER TABLE public.artist_videos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. ROW-LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.artist_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved artist videos" ON public.artist_videos;
CREATE POLICY "Public can view approved artist videos" ON public.artist_videos
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert artist videos" ON public.artist_videos;
CREATE POLICY "Public can insert artist videos" ON public.artist_videos
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update artist videos" ON public.artist_videos;
CREATE POLICY "Public can update artist videos" ON public.artist_videos
    FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete artist videos" ON public.artist_videos;
CREATE POLICY "Public can delete artist videos" ON public.artist_videos
    FOR DELETE USING (true);

-- 4. REALTIME PUBLICATION REGISTRATION
-- Automatically broadcasts video additions and updates to all connected devices in realtime
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.artist_videos;
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 5. STORAGE BUCKET FOR HIGH-DEFINITION MASTER VIDEOS
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view uploaded videos" ON storage.objects;
CREATE POLICY "Public can view uploaded videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Public can upload videos" ON storage.objects;
CREATE POLICY "Public can upload videos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "Public can update videos" ON storage.objects;
CREATE POLICY "Public can update videos" ON storage.objects
    FOR UPDATE USING (bucket_id = 'videos');
