import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawName = String(body.filename || 'spotlight-video.mp4');
    const bucket = String(body.bucket || 'videos');

    const safeExt =
      (rawName.includes('.') ? rawName.split('.').pop() : 'mp4')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') || 'mp4';

    const uniqueFileName = `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

    const { data, error } = await supabaseServer.storage
      .from(bucket)
      .createSignedUploadUrl(uniqueFileName);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Could not create signed upload URL' },
        { status: 500 }
      );
    }

    const { data: pubData } = supabaseServer.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path || uniqueFileName,
      publicUrl: pubData?.publicUrl || '',
    });
  } catch (error) {
    console.error('[POST /api/videos/upload-url error]:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Signed URL generation failed' },
      { status: 500 }
    );
  }
}
