import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { INITIAL_USERS } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let dbUsers = [];
    try {
      const { data, error } = await supabaseServer
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase users fetch warning]:', error.message);
      } else if (Array.isArray(data)) {
        dbUsers = data;
      }
    } catch (e) {
      console.warn('[Supabase users fetch exception]:', e.message);
    }

    // Merge DB users with INITIAL_USERS, prioritizing DB entries
    const emailMap = new Set();
    const merged = [];

    // 1. Add DB users first
    for (const u of dbUsers) {
      const em = (u.email || '').trim().toLowerCase();
      if (em && !emailMap.has(em)) {
        emailMap.add(em);
        merged.push({
          ...u,
          status: u.status || 'active',
          statusReason: u.statusReason || '',
          cloudflareVerified: true,
          securityIncidents: []
        });
      }
    }

    // 2. Add INITIAL_USERS fallback
    for (const u of (INITIAL_USERS || [])) {
      const em = (u.email || '').trim().toLowerCase();
      if (em && !emailMap.has(em)) {
        emailMap.add(em);
        merged.push(u);
      }
    }

    return NextResponse.json({ success: true, users: merged });

  } catch (error) {
    console.error('[Users GET API Error]:', error);
    return NextResponse.json({ success: true, users: INITIAL_USERS || [] });
  }
}

export async function POST(request) {
  try {
    const { users } = await request.json();
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    // Fetch existing emails to avoid duplicates
    const { data: existing } = await supabaseServer.from('users').select('email');
    const existingEmails = new Set((existing || []).map(u => (u.email || '').toLowerCase().trim()));

    let insertedCount = 0;
    for (const u of users) {
      const em = (u.email || '').toLowerCase().trim();
      if (em && em.includes('@') && !existingEmails.has(em)) {
        const toInsert = {
          id: u.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: u.name || 'Art Patron',
          email: em,
          password: u.password || null,
          role: u.role || 'buyer',
          subscription_tier: u.subscription_tier || 'standard',
          phone: u.phone || null,
          country: u.country || 'Nigeria',
          created_at: u.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error } = await supabaseServer.from('users').insert([toInsert]);
        if (!error) {
          existingEmails.add(em);
          insertedCount++;
        }
      }
    }

    return NextResponse.json({ success: true, count: insertedCount });
  } catch (error) {
    console.error('[Users POST Sync API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
