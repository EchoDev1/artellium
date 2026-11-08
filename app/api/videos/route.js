import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { randomUUID } from 'crypto';

const isValidUUID = (str) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str || ''));
};

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('artist_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('API /api/videos query notice:', error.message);
      return NextResponse.json({ success: false, videos: [], error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map((row) => ({
      id: row.id,
      artistName: row.artist_name || 'Master Artist',
      artistTitle: row.artist_title || 'Master Artist',
      country: row.country || 'Nigeria',
      countryFlag: row.country_flag || '🇳🇬',
      city: row.city || 'Lagos',
      artworkTitle: row.artwork_title || 'Atelier Masterpiece Showcase',
      thumbnail: row.thumbnail_url || '',
      videoUrl: row.video_url || '',
      quote: row.quote || '',
      history: row.history || '',
      duration: row.duration || '2:30',
      status: row.status || 'approved',
      featuredOnHero: row.featured_on_hero !== undefined ? row.featured_on_hero : true,
      isDemo: row.is_demo !== undefined ? row.is_demo : false,
      priceNGN: row.price_ngn ? Number(row.price_ngn) : 1850000,
      priceUSD: row.price_usd ? Number(row.price_usd) : 1250,
      submittedAt: row.created_at || new Date().toISOString(),
      createdAt: row.created_at || new Date().toISOString()
    }));

    return NextResponse.json({ success: true, videos: formatted });
  } catch (err) {
    console.error('API /api/videos unexpected error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload.artistName || !payload.videoUrl) {
      return NextResponse.json({ success: false, error: 'Artist Name and Video URL are required' }, { status: 400 });
    }

    const resolvedId = isValidUUID(payload.id) ? payload.id : randomUUID();

    // 1. Full schema payload
    const fullDbPayload = {
      id: resolvedId,
      artist_name: payload.artistName.trim(),
      artist_title: (payload.artistTitle || 'Master Artist').trim(),
      country: payload.country || 'Nigeria',
      country_flag: payload.countryFlag || '🇳🇬',
      city: payload.city || 'Lagos',
      artwork_title: (payload.artworkTitle || 'Atelier Masterpiece Showcase').trim(),
      thumbnail_url: payload.thumbnail || '',
      video_url: payload.videoUrl.trim(),
      quote: payload.quote || '',
      history: payload.history || '',
      duration: payload.duration || '2:30',
      status: payload.status || 'approved',
      featured_on_hero: payload.featuredOnHero !== undefined ? payload.featuredOnHero : true,
      is_demo: payload.isDemo !== undefined ? payload.isDemo : false,
      price_ngn: payload.priceNGN ? Number(payload.priceNGN) : 1850000,
      price_usd: payload.priceUSD ? Number(payload.priceUSD) : 1250,
      updated_at: new Date().toISOString()
    };

    // Attempt full insert/upsert
    let result = await supabaseServer
      .from('artist_videos')
      .upsert([fullDbPayload], { onConflict: 'id' })
      .select();

    // If schema cache doesn't have partial new columns yet, fallback gracefully to core schema
    if (result.error && (result.error.code === 'PGRST204' || result.error.message?.includes('column'))) {
      console.warn('Falling back to core artist_videos columns while migration pending:', result.error.message);
      const corePayload = {
        id: resolvedId,
        artist_name: fullDbPayload.artist_name,
        artist_title: fullDbPayload.artist_title,
        country: fullDbPayload.country,
        artwork_title: fullDbPayload.artwork_title,
        thumbnail_url: fullDbPayload.thumbnail_url,
        video_url: fullDbPayload.video_url,
        quote: fullDbPayload.quote,
        duration: fullDbPayload.duration
      };

      result = await supabaseServer
        .from('artist_videos')
        .upsert([corePayload], { onConflict: 'id' })
        .select();
    }

    if (result.error) {
      console.error('Supabase artist_videos insert failed:', result.error);
      return NextResponse.json({ success: false, error: result.error.message }, { status: 500 });
    }

    const inserted = result.data?.[0] || fullDbPayload;

    const formatted = {
      id: inserted.id,
      artistName: inserted.artist_name || payload.artistName,
      artistTitle: inserted.artist_title || payload.artistTitle || 'Master Artist',
      country: inserted.country || payload.country || 'Nigeria',
      countryFlag: inserted.country_flag || payload.countryFlag || '🇳🇬',
      city: inserted.city || payload.city || 'Lagos',
      artworkTitle: inserted.artwork_title || payload.artworkTitle || 'Atelier Masterpiece Showcase',
      thumbnail: inserted.thumbnail_url || payload.thumbnail || '',
      videoUrl: inserted.video_url || payload.videoUrl,
      quote: inserted.quote || payload.quote || '',
      history: inserted.history || payload.history || '',
      duration: inserted.duration || payload.duration || '2:30',
      status: inserted.status || payload.status || 'approved',
      featuredOnHero: inserted.featured_on_hero !== undefined ? inserted.featured_on_hero : true,
      isDemo: inserted.is_demo !== undefined ? inserted.is_demo : false,
      priceNGN: inserted.price_ngn ? Number(inserted.price_ngn) : (payload.priceNGN || 1850000),
      priceUSD: inserted.price_usd ? Number(inserted.price_usd) : (payload.priceUSD || 1250),
      submittedAt: inserted.created_at || new Date().toISOString()
    };

    return NextResponse.json({ success: true, video: formatted });
  } catch (err) {
    console.error('API /api/videos POST unexpected error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 });
    }

    const { error } = await supabaseServer.from('artist_videos').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
