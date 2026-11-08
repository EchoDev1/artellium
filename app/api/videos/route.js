import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const isValidUUID = (str) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str || ''));
};

const LOCAL_VIDEOS_DB_PATH = path.join(process.cwd(), 'public', 'uploads', 'videos_registry.json');

const readLocalVideosRegistry = () => {
  try {
    if (fs.existsSync(LOCAL_VIDEOS_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_VIDEOS_DB_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    console.warn('Local videos registry read notice:', e.message);
  }
  return [];
};

const writeLocalVideosRegistry = (videos) => {
  try {
    const dir = path.dirname(LOCAL_VIDEOS_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_VIDEOS_DB_PATH, JSON.stringify(videos, null, 2), 'utf8');
  } catch (e) {
    console.warn('Local videos registry write notice:', e.message);
  }
};

const isDummyVideoEntry = (v) => {
  if (!v) return true;
  if (v.isDemo === true || v.is_demo === true) return true;
  const idStr = String(v.id || '');
  if (['vid-1', 'vid-2', 'vid-3', 'vid-4'].includes(idStr)) return true;
  const urlStr = String(v.videoUrl || v.video_url || '');
  if (/\/videos\/artist-(savannah|studio|turtle|nature)\.mp4/i.test(urlStr)) return true;
  return false;
};

const sanitizeThumb = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (/unsplash\.com|pravatar\.cc|randomuser\.me|pexels\.com/i.test(url)) return '';
  return url;
};

export async function GET() {
  try {
    const localRegistry = readLocalVideosRegistry().filter(v => !isDummyVideoEntry(v));
    let dbFormatted = [];

    try {
      const { data, error } = await supabaseServer
        .from('artist_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        dbFormatted = data
          .filter((row) => !isDummyVideoEntry(row))
          .map((row) => ({
            id: row.id,
            artistName: row.artist_name || 'Master Artist',
            artistTitle: row.artist_title || 'Master Artist',
            country: row.country || 'Nigeria',
            countryFlag: row.country_flag || '🇳🇬',
            city: row.city || 'Lagos',
            artworkTitle: row.artwork_title || 'Atelier Masterpiece Showcase',
            thumbnail: sanitizeThumb(row.thumbnail_url),
            videoUrl: row.video_url || '',
            quote: row.quote || '',
            history: row.history || '',
            duration: row.duration || '2:30',
            status: 'approved',
            featuredOnHero: row.featured_on_hero !== undefined ? row.featured_on_hero : true,
            isDemo: false,
            priceNGN: row.price_ngn ? Number(row.price_ngn) : 1850000,
            priceUSD: row.price_usd ? Number(row.price_usd) : 1250,
            submittedAt: row.created_at || new Date().toISOString(),
            createdAt: row.created_at || new Date().toISOString()
          }));
      }
    } catch (supaErr) {
      console.warn('Supabase artist_videos fetch notice:', supaErr.message);
    }

    // Merge local registry + Supabase records without duplicates
    const seenIds = new Set();
    const seenUrls = new Set();
    const merged = [];

    for (const item of [...localRegistry, ...dbFormatted]) {
      if (!item || !item.videoUrl || isDummyVideoEntry(item)) continue;
      if (seenIds.has(item.id) || seenUrls.has(item.videoUrl)) continue;
      seenIds.add(item.id);
      seenUrls.add(item.videoUrl);
      merged.push({
        ...item,
        thumbnail: sanitizeThumb(item.thumbnail),
        status: 'approved',
        featuredOnHero: item.featuredOnHero !== undefined ? item.featuredOnHero : true,
        isDemo: false
      });
    }

    return NextResponse.json({ success: true, videos: merged });
  } catch (err) {
    console.error('API /api/videos unexpected error:', err);
    return NextResponse.json({ success: true, videos: readLocalVideosRegistry() });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload.artistName || !payload.videoUrl) {
      return NextResponse.json({ success: false, error: 'Artist Name and Video URL are required' }, { status: 400 });
    }

    const resolvedId = isValidUUID(payload.id) ? payload.id : randomUUID();
    const cleanThumb = sanitizeThumb(payload.thumbnail);
    const nowIso = new Date().toISOString();

    const formattedBase = {
      id: resolvedId,
      artistName: payload.artistName.trim(),
      artistTitle: (payload.artistTitle || 'Master Artist').trim(),
      country: payload.country || 'Nigeria',
      countryFlag: payload.countryFlag || '🇳🇬',
      city: payload.city || 'Lagos',
      artworkTitle: (payload.artworkTitle || 'Atelier Masterpiece Showcase').trim(),
      thumbnail: cleanThumb,
      videoUrl: payload.videoUrl.trim(),
      quote: payload.quote || '',
      history: payload.history || '',
      duration: payload.duration || '2:30',
      status: 'approved',
      featuredOnHero: payload.featuredOnHero !== undefined ? payload.featuredOnHero : true,
      isDemo: false,
      priceNGN: payload.priceNGN ? Number(payload.priceNGN) : 1850000,
      priceUSD: payload.priceUSD ? Number(payload.priceUSD) : 1250,
      submittedAt: nowIso,
      createdAt: nowIso
    };

    // Always persist immediately to local registry file so it never gets lost
    const existingLocal = readLocalVideosRegistry().filter(
      (v) => v.id !== resolvedId && v.id !== payload.id && v.videoUrl !== formattedBase.videoUrl && !isDummyVideoEntry(v)
    );
    writeLocalVideosRegistry([formattedBase, ...existingLocal]);

    // Also persist to Supabase artist_videos if available
    try {
      const fullDbPayload = {
        id: resolvedId,
        artist_name: formattedBase.artistName,
        artist_title: formattedBase.artistTitle,
        country: formattedBase.country,
        country_flag: formattedBase.countryFlag,
        city: formattedBase.city,
        artwork_title: formattedBase.artworkTitle,
        thumbnail_url: formattedBase.thumbnail,
        video_url: formattedBase.videoUrl,
        quote: formattedBase.quote,
        history: formattedBase.history,
        duration: formattedBase.duration,
        status: 'approved',
        featured_on_hero: formattedBase.featuredOnHero,
        is_demo: false,
        price_ngn: formattedBase.priceNGN,
        price_usd: formattedBase.priceUSD,
        updated_at: nowIso
      };

      let result = await supabaseServer
        .from('artist_videos')
        .upsert([fullDbPayload], { onConflict: 'id' })
        .select();

      if (result.error && (result.error.code === 'PGRST204' || result.error.message?.includes('column'))) {
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

        await supabaseServer
          .from('artist_videos')
          .upsert([corePayload], { onConflict: 'id' })
          .select();
      }
    } catch (supaErr) {
      console.warn('Supabase artist_videos insert notice (saved to local registry):', supaErr.message);
    }

    return NextResponse.json({ success: true, video: formattedBase });
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

    const existingLocal = readLocalVideosRegistry().filter((v) => String(v.id) !== String(id));
    writeLocalVideosRegistry(existingLocal);

    try {
      await supabaseServer.from('artist_videos').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase artist_videos delete notice:', e.message);
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
