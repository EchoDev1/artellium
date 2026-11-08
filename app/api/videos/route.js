import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { generateUuid, toValidUuid, isDummyVideoRecord } from '@/lib/uuid-utils';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const LOCAL_VIDEOS_FILE = path.join(process.cwd(), 'data', 'videos-registry.json');

function readLocalVideosRegistry() {
  try {
    if (!fs.existsSync(LOCAL_VIDEOS_FILE)) return [];
    const raw = fs.readFileSync(LOCAL_VIDEOS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => !isDummyVideoRecord(v)) : [];
  } catch (e) {
    console.warn('readLocalVideosRegistry warning:', e.message);
    return [];
  }
}

function writeLocalVideosRegistry(videos) {
  try {
    const dir = path.dirname(LOCAL_VIDEOS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const clean = (Array.isArray(videos) ? videos : []).filter((v) => !isDummyVideoRecord(v));
    fs.writeFileSync(LOCAL_VIDEOS_FILE, JSON.stringify(clean, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.warn('writeLocalVideosRegistry warning:', e.message);
    return false;
  }
}

function normalizeVideoRow(v) {
  const rawId = v.id || generateUuid();
  return {
    id: toValidUuid(rawId),
    originalId: String(rawId),
    artistId: v.artist_id || v.artistId || '',
    artistName: v.artist_name || v.artistName || 'Artellium Spotlight',
    artistTitle: v.artist_title || v.artistTitle || 'Master Creator',
    country: v.country || 'Nigeria',
    countryFlag: v.country_flag || v.countryFlag || '🇳🇬',
    city: v.city || 'Lagos',
    artworkId: v.artwork_id || v.artworkId || null,
    artworkTitle: v.artwork_title || v.artworkTitle || v.title || 'Studio Spotlight',
    thumbnail: v.thumbnail_url || v.thumbnail || '',
    videoUrl: v.video_url || v.videoUrl || '',
    quote: v.quote || '',
    history: v.history || '',
    duration: v.duration || '1:00',
    status: v.status || 'approved',
    featuredOnHero:
      typeof v.featured_on_hero === 'boolean'
        ? v.featured_on_hero
        : typeof v.featuredOnHero === 'boolean'
        ? v.featuredOnHero
        : true,
    isDemo: false,
    priceNGN: Number(v.price_ngn || v.priceNGN || 0),
    priceUSD: Number(v.price_usd || v.priceUSD || 0),
    createdAt: v.created_at || v.createdAt || new Date().toISOString(),
  };
}

// GET /api/videos — Fetch all real artist & spotlight videos (Supabase + Local JSON Registry)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const heroOnly = searchParams.get('hero') === 'true';
    const approvedOnly = searchParams.get('approved') === 'true';

    // 1. Read local persistent registry
    const localList = readLocalVideosRegistry();

    // 2. Read Supabase artist_videos table
    let cloudList = [];
    try {
      const { data, error } = await supabaseServer
        .from('artist_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        cloudList = data.filter((v) => !isDummyVideoRecord(v)).map(normalizeVideoRow);
      }
    } catch (cloudErr) {
      console.warn('Supabase GET /api/videos warning:', cloudErr.message);
    }

    // Merge Cloud + Local by ID (preferring Cloud first, then Local)
    const mergedMap = new Map();
    for (const item of [...cloudList, ...localList.map(normalizeVideoRow)]) {
      if (!item || !item.videoUrl || isDummyVideoRecord(item)) continue;
      if (!mergedMap.has(item.id)) {
        mergedMap.set(item.id, item);
      }
    }

    let finalVideos = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    if (approvedOnly) {
      finalVideos = finalVideos.filter((v) => v.status === 'approved');
    }
    if (heroOnly) {
      finalVideos = finalVideos.filter((v) => v.status === 'approved' && v.featuredOnHero !== false);
    }

    return NextResponse.json(
      {
        success: true,
        videos: finalVideos,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err) {
    console.error('GET /api/videos error:', err);
    return NextResponse.json({
      success: true,
      videos: readLocalVideosRegistry(),
      warning: err.message,
    });
  }
}

// POST /api/videos — Create or update an artist/spotlight video (Admin or Artist)
export async function POST(request) {
  try {
    const body = await request.json();

    const videoUrl = String(body.videoUrl || body.video_url || '').trim();
    const artistName = String(body.artistName || body.artist_name || 'Artellium Spotlight').trim() || 'Artellium Spotlight';

    if (!videoUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'videoUrl is required',
        },
        { status: 400 }
      );
    }

    if (isDummyVideoRecord({ ...body, videoUrl, artistName })) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dummy video entries are blocked',
        },
        { status: 400 }
      );
    }

    // Ensure valid UUID for PostgreSQL artist_videos.id
    const id = toValidUuid(body.id || generateUuid());
    const nowIso = new Date().toISOString();

    const normalizedItem = {
      id,
      artistId: body.artistId || body.artist_id || '',
      artistName,
      artistTitle: body.artistTitle || body.artist_title || 'Master Creator',
      country: body.country || 'Nigeria',
      countryFlag: body.countryFlag || body.country_flag || '🇳🇬',
      city: body.city || 'Lagos',
      artworkId: body.artworkId || body.artwork_id || null,
      artworkTitle: body.artworkTitle || body.artwork_title || body.title || 'Studio Spotlight',
      thumbnail: body.thumbnail || body.thumbnail_url || '',
      videoUrl,
      quote: body.quote || '',
      history: body.history || '',
      duration: body.duration || '1:00',
      status: body.status || 'approved',
      featuredOnHero:
        typeof body.featuredOnHero === 'boolean'
          ? body.featuredOnHero
          : typeof body.featured_on_hero === 'boolean'
          ? body.featured_on_hero
          : true,
      isDemo: false,
      priceNGN: Number(body.priceNGN || body.price_ngn || 0),
      priceUSD: Number(body.priceUSD || body.price_usd || 0),
      createdAt: body.createdAt || body.created_at || nowIso,
      updatedAt: nowIso,
    };

    // 1. Update local persistent JSON registry
    const existingLocal = readLocalVideosRegistry();
    const filteredLocal = existingLocal.filter((v) => toValidUuid(v.id) !== id);
    writeLocalVideosRegistry([normalizedItem, ...filteredLocal]);

    // 2. Upsert into Supabase artist_videos using exact verified schema columns
    let dbSaved = null;
    try {
      const dbRow = {
        id,
        artist_name: normalizedItem.artistName,
        artist_title: normalizedItem.artistTitle,
        country: normalizedItem.country,
        country_flag: normalizedItem.countryFlag,
        city: normalizedItem.city,
        artwork_title: normalizedItem.artworkTitle,
        thumbnail_url: normalizedItem.thumbnail,
        video_url: normalizedItem.videoUrl,
        quote: normalizedItem.quote,
        history: normalizedItem.history,
        duration: normalizedItem.duration,
        status: normalizedItem.status,
        featured_on_hero: normalizedItem.featuredOnHero,
        is_demo: false,
        price_ngn: normalizedItem.priceNGN,
        price_usd: normalizedItem.priceUSD,
        updated_at: nowIso,
      };

      const { data, error } = await supabaseServer
        .from('artist_videos')
        .upsert([dbRow], { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.warn('Supabase POST /api/videos upsert warning:', error.message);
      } else if (data) {
        dbSaved = normalizeVideoRow(data);
      }
    } catch (dbErr) {
      console.warn('Supabase POST /api/videos exception:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      video: dbSaved || normalizedItem,
    });
  } catch (err) {
    console.error('POST /api/videos error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/videos?id=xxx — Delete an artist video (or ?clearAll=true to purge all)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll') === 'true';

    if (clearAll) {
      writeLocalVideosRegistry([]);
      try {
        const { data: allRows } = await supabaseServer.from('artist_videos').select('id');
        if (Array.isArray(allRows) && allRows.length > 0) {
          await supabaseServer
            .from('artist_videos')
            .delete()
            .in(
              'id',
              allRows.map((r) => r.id)
            );
        }
      } catch (e) {
        console.warn('Supabase clearAll videos notice:', e.message);
      }
      return NextResponse.json({ success: true, clearedAll: true });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Video ID is required' }, { status: 400 });
    }

    const validId = toValidUuid(id);

    // 1. Remove from local registry
    const existingLocal = readLocalVideosRegistry();
    writeLocalVideosRegistry(
      existingLocal.filter((v) => String(v.id) !== String(id) && toValidUuid(v.id) !== validId)
    );

    // 2. Remove from Supabase
    try {
      await supabaseServer.from('artist_videos').delete().eq('id', validId);
    } catch (e) {
      console.warn('Supabase delete video notice:', e.message);
    }

    return NextResponse.json({ success: true, deletedId: validId });
  } catch (err) {
    console.error('DELETE /api/videos error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
