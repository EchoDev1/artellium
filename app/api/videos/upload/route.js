import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No video file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isImage = file.type ? file.type.startsWith('image/') : false;
    const defaultExt = isImage ? '.jpg' : '.mp4';
    const ext = path.extname(file.name || (isImage ? 'thumb.jpg' : 'video.mp4')) || defaultExt;
    const baseName = (file.name || (isImage ? 'video-thumbnail' : 'artist-video')).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${Date.now()}-${baseName.slice(0, 30)}${ext}`;

    // 1. Dual Persistence: Local public filesystem mirror
    let localPublicUrl = null;
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', isImage ? 'thumbnails' : 'videos');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const localFilePath = path.join(uploadDir, uniqueFileName);
      fs.writeFileSync(localFilePath, buffer);
      localPublicUrl = `/uploads/${isImage ? 'thumbnails' : 'videos'}/${uniqueFileName}`;
    } catch (fsErr) {
      console.warn('Local media filesystem write notice:', fsErr.message);
    }

    // 2. Upload to Supabase Storage Bucket 'videos'
    let cloudPublicUrl = null;
    try {
      const contentType = file.type || (isImage ? 'image/jpeg' : 'video/mp4');
      const { data: uploadData, error: uploadErr } = await supabaseServer.storage
        .from('videos')
        .upload(uniqueFileName, buffer, {
          contentType,
          upsert: true
        });

      if (!uploadErr && uploadData) {
        const { data: urlData } = supabaseServer.storage
          .from('videos')
          .getPublicUrl(uniqueFileName);
        cloudPublicUrl = urlData?.publicUrl || null;
      } else if (uploadErr) {
        console.warn('Supabase media bucket upload notice:', uploadErr.message);
      }
    } catch (storageErr) {
      console.warn('Supabase storage execution notice:', storageErr.message);
    }

    // Prefer permanent Supabase Cloud CDN URL so videos work across all browsers and deployments, fallback to local URL
    const finalUrl = cloudPublicUrl || localPublicUrl;

    if (!finalUrl) {
      return NextResponse.json({ success: false, error: 'Failed to process and store video file' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      cloudUrl: cloudPublicUrl,
      localUrl: localPublicUrl,
      fileName: uniqueFileName,
      sizeMB: (buffer.length / (1024 * 1024)).toFixed(2)
    });
  } catch (err) {
    console.error('API /api/videos/upload error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
