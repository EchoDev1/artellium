-- =========================================================================
-- ARTELLIUM AFRICA — FIX ROW-LEVEL SECURITY & PERMISSIONS ON ALL TABLES
-- Run this in your Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard/project/lczxzijwarbxggffaemi/sql
-- 2. Click "New query"
-- 3. Paste this script and click "Run" (or press Ctrl+Enter)
-- =========================================================================

-- 1. DISABLE ROW LEVEL SECURITY ON CORE TABLES
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.commissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sellers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.artworks DISABLE ROW LEVEL SECURITY;

-- 2. GRANT PERMISSIONS TO ANON AND AUTHENTICATED ROLES
GRANT ALL ON TABLE public.users TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.payments TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.commissions TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.sellers TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.artworks TO postgres, anon, authenticated, service_role;

-- 3. ENSURE METADATA COLUMNS EXIST ON USERS
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS statusReason TEXT DEFAULT '';
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS cloudflareVerified BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS public.users ADD COLUMN IF NOT EXISTS securityIncidents JSONB DEFAULT '[]'::jsonb;
