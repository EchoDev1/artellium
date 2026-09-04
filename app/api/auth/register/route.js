import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, name, email, password, role = 'buyer', subscription_tier, phone, country } = body;

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required.' }, { status: 400 });
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must contain at least 6 characters.' }, { status: 400 });
    }

    // Check if user already exists in Supabase
    const { data: existingUser, error: queryError } = await supabaseServer
      .from('users')
      .select('id, email')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (queryError && queryError.code !== 'PGRST116') {
      console.warn('[Register DB Check Notice]:', queryError.message);
    }

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.'
      }, { status: 409 });
    }

    const userId = id || `user-${Date.now()}`;
    const newUser = {
      id: userId,
      name: (name || 'Art Collector').trim(),
      email: cleanEmail,
      password: cleanPassword,
      role: role || 'buyer',
      subscription_tier: subscription_tier || (role === 'artist' ? 'standard' : 'free'),
      phone: phone || null,
      country: country || 'Nigeria',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: insertError } = await supabaseServer
      .from('users')
      .upsert([newUser], { onConflict: 'email' });

    if (insertError) {
      console.error('[Register Supabase Insert Error]:', insertError);
      return NextResponse.json({
        success: false,
        error: 'Database registration error. ' + insertError.message
      }, { status: 500 });
    }

    const clientUser = {
      ...newUser,
      status: 'active',
      statusReason: '',
      cloudflareVerified: true,
      securityIncidents: []
    };

    return NextResponse.json({
      success: true,
      user: clientUser,
      message: 'Account registered and persisted successfully across all browsers.'
    }, { status: 201 });

  } catch (error) {
    console.error('[Register API Error]:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error during registration.'
    }, { status: 500 });
  }
}
