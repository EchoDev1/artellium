import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { isDummyArtworkRecord } from '@/lib/uuid-utils';
import { INITIAL_REAL_ARTWORKS } from '@/lib/real-artworks-seed';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const DELETED_ARTWORKS_FILE = path.join(process.cwd(), 'data', 'deleted-artworks.json');
const SEED_FILE = path.join(process.cwd(), 'lib', 'real-artworks-seed.js');

function readDeletedArtworksRegistry() {
  try {
    if (!fs.existsSync(DELETED_ARTWORKS_FILE)) return [];
    const raw = fs.readFileSync(DELETED_ARTWORKS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((k) => String(k).trim().toLowerCase()).filter(Boolean) : [];
  } catch (e) {
    return [];
  }
}

function writeDeletedArtworksRegistry(keys = []) {
  try {
    const dir = path.dirname(DELETED_ARTWORKS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const unique = Array.from(new Set((Array.isArray(keys) ? keys : []).map((k) => String(k).trim().toLowerCase()).filter(Boolean)));
    fs.writeFileSync(DELETED_ARTWORKS_FILE, JSON.stringify(unique, null, 2), 'utf8');
    return unique;
  } catch (e) {
    return keys;
  }
}

function pruneSeedFileIfNeeded(deletedSet) {
  try {
    if (!Array.isArray(INITIAL_REAL_ARTWORKS) || INITIAL_REAL_ARTWORKS.length === 0) return;
    const remaining = INITIAL_REAL_ARTWORKS.filter((art) => {
      if (!art) return false;
      const id = String(art.id || '').trim().toLowerCase();
      const comp = `title:${String(art.title || '').trim().toLowerCase()}::artist:${String(art.artistName || art.artist_name || '').split(' (')[0].trim().toLowerCase()}`;
      return !deletedSet.has(id) && !deletedSet.has(comp);
    });
    if (remaining.length !== INITIAL_REAL_ARTWORKS.length && fs.existsSync(SEED_FILE)) {
      const fileContent = `export const INITIAL_REAL_ARTWORKS = ${JSON.stringify(remaining, null, 2)};\n`;
      fs.writeFileSync(SEED_FILE, fileContent, 'utf8');
    }
  } catch (e) {
    // Ignore read-only filesystem in serverless environments
  }
}

export async function GET() {
  try {
    const deletedKeys = readDeletedArtworksRegistry();
    const deletedSet = new Set(deletedKeys);

    const { data, error } = await supabaseServer.from('artworks').select('*');
    const dbArtworks = (!error && Array.isArray(data)) ? data : [];

    const filtered = dbArtworks.filter((a) => {
      if (!a || isDummyArtworkRecord(a)) return false;
      const id = String(a.id || '').trim().toLowerCase();
      const comp = `title:${String(a.title || '').trim().toLowerCase()}::artist:${String(a.artistName || a.artist_name || '').split(' (')[0].trim().toLowerCase()}`;
      return !deletedSet.has(id) && !deletedSet.has(comp);
    });

    return NextResponse.json(
      {
        success: true,
        artworks: filtered,
        deletedIds: deletedKeys,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (err) {
    return NextResponse.json({
      success: true,
      artworks: [],
      deletedIds: readDeletedArtworksRegistry(),
      warning: err.message,
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = String(searchParams.get('id') || '').trim();
    const title = String(searchParams.get('title') || '').trim();
    const artistName = String(searchParams.get('artistName') || '').trim();

    if (!id && !title) {
      return NextResponse.json({ success: false, error: 'Artwork id or title is required' }, { status: 400 });
    }

    const existingDeleted = readDeletedArtworksRegistry();
    const toAdd = [];
    if (id) toAdd.push(id.toLowerCase());
    if (title) {
      const cleanArtist = artistName.split(' (')[0].trim().toLowerCase();
      toAdd.push(`title:${title.toLowerCase()}::artist:${cleanArtist}`);
    }

    // Check Supabase for any matching rows by id or title+artist_name so all duplicates are purged
    try {
      if (id) {
        await supabaseServer.from('artworks').delete().eq('id', id);
      }
      if (title) {
        const { data: allRows } = await supabaseServer.from('artworks').select('id, title, artist_name');
        if (Array.isArray(allRows)) {
          const normTitle = title.toLowerCase();
          const normArtist = artistName.split(' (')[0].trim().toLowerCase();
          const matchingIds = allRows
            .filter((r) => {
              const rId = String(r.id || '').trim();
              const rTitle = String(r.title || '').trim().toLowerCase();
              const rArtist = String(r.artist_name || '').split(' (')[0].trim().toLowerCase();
              if (id && rId.toLowerCase() === id.toLowerCase()) return true;
              if (normTitle && rTitle === normTitle && (!normArtist || !rArtist || rArtist.includes(normArtist) || normArtist.includes(rArtist))) {
                return true;
              }
              return false;
            })
            .map((r) => r.id);

          if (matchingIds.length > 0) {
            matchingIds.forEach((mId) => toAdd.push(String(mId).trim().toLowerCase()));
            await supabaseServer.from('artworks').delete().in('id', matchingIds);
          }
        }
      }
    } catch (dbErr) {
      console.warn('Supabase DELETE /api/artworks warning:', dbErr.message);
    }

    const updatedDeleted = writeDeletedArtworksRegistry([...existingDeleted, ...toAdd]);
    pruneSeedFileIfNeeded(new Set(updatedDeleted));

    return NextResponse.json({
      success: true,
      deletedId: id,
      deletedIds: updatedDeleted,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
