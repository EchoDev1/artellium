import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lczxzijwarbxggffaemi.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjenh6aWp3YXJieGdnZmZhZW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTM3MDAsImV4cCI6MjEwMjQ2OTcwMH0.QjLq4Q-msRzAwLABdf6rNMuHULdXPM3YU4i2awFaBm8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
  }
});
