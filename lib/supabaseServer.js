import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lczxzijwarbxggffaemi.supabase.co';
const PRODUCTION_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjenh6aWp3YXJieGdnZmZhZW1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Njg5MzcwMCwiZXhwIjoyMTAyNDY5NzAwfQ.s2fluC_4WLrhp2Pm-MWsOrObLdJCzWp284sNOY0MYus';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || PRODUCTION_SERVICE_ROLE_KEY;

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});
