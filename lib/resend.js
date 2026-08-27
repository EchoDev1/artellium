import { Resend } from 'resend';
import {
  generateVerificationEmailHtml,
  generateLoginAlertEmailHtml,
  generatePaymentReceiptEmailHtml,
  generateArtistSaleEmailHtml,
  generateArtistWelcomeEmailHtml,
  generateOutbidAlertEmailHtml,
  generateBidConfirmationEmailHtml,
  generatePasswordResetEmailHtml
} from './email-templates';

// Retrieve API key from environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

// Initialize Resend Client
export const resend = new Resend(RESEND_API_KEY || 're_dummy_fallback');

// Configurable sender identity
export const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Artellium Africa <onboarding@resend.dev>';
export const DOMAIN_FROM_EMAIL = process.env.RESEND_DOMAIN_FROM || 'Artellium Africa <notifications@artellium.africa>';

/**
 * Universal Core Send Function
 */
export async function sendEmail({ to, subject, html, text, from = DEFAULT_FROM_EMAIL }) {
  if (!to) {
    console.warn('[Resend] Cannot send email: missing recipient (to).');
    return { success: false, error: 'Recipient email is required.' };
  }

  try {
    const payload = {
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || subject
    };

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.warn('[Resend Service Notice]:', error.message);
      if (from !== DEFAULT_FROM_EMAIL && error.message?.includes('domain')) {
        console.info('[Resend] Retrying with onboarding sandbox address...');
        const fallbackRes = await resend.emails.send({ ...payload, from: DEFAULT_FROM_EMAIL });
        return { success: !fallbackRes.error, data: fallbackRes.data, error: fallbackRes.error?.message };
      }
      return { success: false, error: error.message };
    }

    console.info(`[Resend] Successfully dispatched email "${subject}" to ${to} (ID: ${data?.id})`);
    return { success: true, data };
  } catch (err) {
    console.error('[Resend Exception]:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 1. Send Account Verification OTP Email
 */
export async function sendAccountVerificationEmail({ to, name, code, role = 'buyer' }) {
  const html = generateVerificationEmailHtml({ name, code, role });
  return sendEmail({
    to,
    subject: `🔐 Verify Your Artellium Africa Account (${code})`,
    html
  });
}

/**
 * 2. Send Login Security Alert Email
 */
export async function sendLoginSecurityAlertEmail({ to, name, role = 'buyer', ipAddress, userAgent }) {
  const html = generateLoginAlertEmailHtml({ name, role, ipAddress, userAgent });
  return sendEmail({
    to,
    subject: '🔒 Security Alert: New Login to Artellium.africa',
    html
  });
}

/**
 * 3. Send Official Payment Confirmation & Acquisition Receipt Email
 */
export async function sendPaymentConfirmationEmail({ to, name, orderId, paymentReference, items, totalAmount, currency, settlementBank }) {
  const html = generatePaymentReceiptEmailHtml({ name, orderId, paymentReference, items, totalAmount, currency, settlementBank });
  return sendEmail({
    to,
    subject: `🧾 Payment Verified: Order ${orderId} · Artellium Africa`,
    html
  });
}

/**
 * 4. Send Artist Artwork Sold & Net Payout Notification Email
 */
export async function sendArtistSaleAlertEmail({ to, artistName, buyerName, artworkTitle, grossAmount, netPayout, platformFee, currency, orderId }) {
  const html = generateArtistSaleEmailHtml({ artistName, buyerName, artworkTitle, grossAmount, netPayout, platformFee, currency, orderId });
  return sendEmail({
    to,
    subject: `🎉 Masterpiece Sold: "${artworkTitle}" (${currency === 'USD' ? '$' : '₦'}${netPayout.toLocaleString()} Payout)`,
    html
  });
}

/**
 * 5. Send Artist Welcome & Subscription Onboarding Email
 */
export async function sendArtistWelcomeEmail({ to, name, plan, billingCycle, price }) {
  const html = generateArtistWelcomeEmailHtml({ name, plan, billingCycle, price });
  return sendEmail({
    to,
    subject: `👑 Welcome to the Artellium Artist Network, ${name}!`,
    html
  });
}

/**
 * 6. Send Outbid Alert Email
 */
export async function sendOutbidAlertEmail({ to, name, lotNumber, artworkTitle, artistName, currentBid, previousBid, currency, auctionUrl }) {
  const html = generateOutbidAlertEmailHtml({ name, lotNumber, artworkTitle, artistName, currentBid, previousBid, currency, auctionUrl });
  return sendEmail({
    to,
    subject: `⚡ Outbid Alert: ${lotNumber} (${artworkTitle}) · Artellium Africa`,
    html
  });
}

/**
 * 7. Send Bid Confirmation Email
 */
export async function sendBidConfirmationEmail({ to, name, lotNumber, artworkTitle, artistName, bidAmount, currency, auctionUrl }) {
  const html = generateBidConfirmationEmailHtml({ name, lotNumber, artworkTitle, artistName, bidAmount, currency, auctionUrl });
  return sendEmail({
    to,
    subject: `✓ Bid Confirmed: ${lotNumber} (${artworkTitle}) · Artellium Africa`,
    html
  });
}

/**
 * 8. Send Password Reset Email
 */
export async function sendPasswordResetEmail({ to, name, code, resetLink }) {
  const html = generatePasswordResetEmailHtml({ name, code, resetLink });
  return sendEmail({
    to,
    subject: `🔑 Reset Your Artellium Password (${code})`,
    html
  });
}
