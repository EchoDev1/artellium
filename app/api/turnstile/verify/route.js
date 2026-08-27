import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { token, action } = await request.json();
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required.' }, { status: 400 });
    }

    const result = await verifyTurnstileToken({
      token,
      clientIp,
      action
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Cloudflare Turnstile verification passed.' });
    } else {
      return NextResponse.json({ success: false, error: result.error || 'Verification failed.' }, { status: 403 });
    }
  } catch (error) {
    console.error('[API /api/turnstile/verify Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
