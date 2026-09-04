import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { userId, email, updatedFields } = await request.json();

    if (!userId && !email) {
      return NextResponse.json({ success: false, error: 'User ID or email is required.' }, { status: 400 });
    }

    const allowedFields = ['name', 'password', 'role', 'phone', 'country', 'avatar_url', 'subscription_tier'];
    const sanitized = {};
    for (const key of allowedFields) {
      if (updatedFields && updatedFields[key] !== undefined) {
        sanitized[key] = updatedFields[key];
      }
    }
    sanitized.updated_at = new Date().toISOString();

    let query = supabaseServer.from('users').update(sanitized);
    if (userId) {
      query = query.eq('id', userId);
    } else if (email) {
      query = query.ilike('email', email.trim().toLowerCase());
    }

    const { error } = await query;
    if (error) {
      console.warn('[Supabase update user warning]:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Update User API Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
