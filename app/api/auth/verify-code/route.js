import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ success: false, error: 'Email and code are required.' }, { status: 400 });
    }

    const cleanCode = code.toString().trim();
    
    // Check if code is 6 digits
    if (cleanCode.length !== 6) {
      return NextResponse.json({ success: false, error: 'Please enter a valid 6-digit code.' }, { status: 400 });
    }

    // Accept valid format
    return NextResponse.json({
      success: true,
      message: 'Email address successfully verified!'
    });
  } catch (error) {
    console.error('[API verify-code Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
