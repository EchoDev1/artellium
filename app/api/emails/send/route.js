import { NextResponse } from 'next/server';
import {
  sendEmail,
  sendAccountVerificationEmail,
  sendLoginSecurityAlertEmail,
  sendPaymentConfirmationEmail,
  sendArtistSaleAlertEmail,
  sendArtistWelcomeEmail,
  sendOutbidAlertEmail,
  sendBidConfirmationEmail,
  sendPasswordResetEmail
} from '@/lib/resend';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, to, payload = {} } = body;

    if (!to) {
      return NextResponse.json({ success: false, error: 'Recipient email is required.' }, { status: 400 });
    }

    let result = { success: false };

    switch (type) {
      case 'verification': {
        result = await sendAccountVerificationEmail({
          to,
          name: payload.name || 'Collector',
          code: payload.code || '123456',
          role: payload.role || 'buyer'
        });
        break;
      }

      case 'login_alert': {
        const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '102.89.23.14';
        const clientAgent = request.headers.get('user-agent') || 'Modern Web Browser';
        result = await sendLoginSecurityAlertEmail({
          to,
          name: payload.name || 'Collector',
          role: payload.role || 'buyer',
          ipAddress: payload.ipAddress || clientIp,
          userAgent: payload.userAgent || clientAgent
        });
        break;
      }

      case 'payment_receipt': {
        result = await sendPaymentConfirmationEmail({
          to,
          name: payload.name || 'Collector',
          orderId: payload.orderId || `ORD-${Date.now().toString().slice(-6)}`,
          paymentReference: payload.paymentReference || `WEMA-${Math.random().toString(36).slice(-6).toUpperCase()}`,
          items: payload.items || [],
          totalAmount: payload.totalAmount || 0,
          currency: payload.currency || 'NGN',
          settlementBank: payload.settlementBank || 'Wema Bank PLC'
        });
        break;
      }

      case 'artist_sale': {
        result = await sendArtistSaleAlertEmail({
          to,
          artistName: payload.artistName || 'Master Artist',
          buyerName: payload.buyerName || 'Patron',
          artworkTitle: payload.artworkTitle || 'Fine Artwork',
          grossAmount: payload.grossAmount || 0,
          netPayout: payload.netPayout || Math.round((payload.grossAmount || 0) * 0.85),
          platformFee: payload.platformFee || Math.round((payload.grossAmount || 0) * 0.15),
          currency: payload.currency || 'NGN',
          orderId: payload.orderId || `ORD-${Date.now().toString().slice(-6)}`
        });
        break;
      }

      case 'artist_welcome': {
        result = await sendArtistWelcomeEmail({
          to,
          name: payload.name || 'Artist',
          plan: payload.plan || 'Premium Tier',
          billingCycle: payload.billingCycle || 'Monthly',
          price: payload.price || '₦50,000 / mo'
        });
        break;
      }

      case 'outbid_alert': {
        result = await sendOutbidAlertEmail({
          to,
          name: payload.name || 'Art Patron',
          lotNumber: payload.lotNumber || 'LOT-LIVE',
          artworkTitle: payload.artworkTitle || 'Fine Masterpiece',
          artistName: payload.artistName || 'Pan-African Master',
          currentBid: payload.currentBid || 0,
          previousBid: payload.previousBid || 0,
          currency: payload.currency || 'NGN',
          auctionUrl: payload.auctionUrl
        });
        break;
      }

      case 'bid_confirmation': {
        result = await sendBidConfirmationEmail({
          to,
          name: payload.name || 'Art Patron',
          lotNumber: payload.lotNumber || 'LOT-LIVE',
          artworkTitle: payload.artworkTitle || 'Fine Masterpiece',
          artistName: payload.artistName || 'Pan-African Master',
          bidAmount: payload.bidAmount || 0,
          currency: payload.currency || 'NGN',
          auctionUrl: payload.auctionUrl
        });
        break;
      }

      case 'password_reset': {
        result = await sendPasswordResetEmail({
          to,
          name: payload.name || 'Patron',
          code: payload.code || '892415',
          resetLink: payload.resetLink
        });
        break;
      }

      case 'custom': {
        result = await sendEmail({
          to,
          subject: payload.subject || 'Artellium Africa Notification',
          html: payload.html || '<p>Artellium Notification</p>',
          text: payload.text
        });
        break;
      }

      default:
        return NextResponse.json({ success: false, error: `Unsupported email type: ${type}` }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /api/emails/send Error]:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
