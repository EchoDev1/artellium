import { NextResponse } from 'next/server';
import { sendAccountVerificationEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

// In-memory OTP code store for active verification sessions
// In production, this can also be backed by Supabase auth/cache
const otpStore = new Map();

export async function POST(request) {
  try {
    const { email, name, role = 'buyer' } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 });
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

    otpStore.set(email.toLowerCase(), { code, expiresAt, name, role });

    // Send verification email via Resend
    const emailResult = await sendAccountVerificationEmail({
      to: email,
      name: name || 'Art Patron',
      code,
      role
    });

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
      // Return code in dev environment to allow instant testing if email delivery is delayed
      debugCode: process.env.NODE_ENV === 'development' ? code : undefined,
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('[API send-verification Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
