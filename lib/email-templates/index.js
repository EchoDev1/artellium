/**
 * ARTELLIUM AFRICA • LUXURY TRANSACTIONAL EMAIL TEMPLATES
 * Responsive HTML + Text Email Suite for Resend
 */

const APP_NAME = 'Artellium Africa';
const DEFAULT_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://artellium.africa';

// Base Email Wrapper
function baseTemplate({ title, preheader, content, appUrl = DEFAULT_URL }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #050608; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E2E8F0; }
    table { border-collapse: collapse; }
    a { color: #D4AF37; text-decoration: none; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #07080A !important; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 12px; text-align: center; text-decoration: none; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.35); }
    .badge { display: inline-block; padding: 4px 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; border-radius: 20px; }
  </style>
</head>
<body style="margin: 0; padding: 30px 10px; background-color: #050608;">
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${preheader || title}
  </div>
  
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #0C0F17; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.85);">
          
          <!-- Top African Heritage Gradient Ribbon -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #E11D48 0%, #D4AF37 50%, #059669 100%);"></td>
          </tr>

          <!-- Header Logo Bar -->
          <tr>
            <td align="center" style="padding: 36px 30px 24px 30px; background-color: #08090D; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <a href="${appUrl}" style="text-decoration: none; display: inline-block;">
                <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #FAF8EE;">
                  ARTELLIUM
                </div>
                <div style="font-size: 10px; letter-spacing: 3px; color: #D4AF37; font-weight: 700; text-transform: uppercase; margin-top: 2px;">
                  FINE ART & AUCTIONS • PAN-AFRICA
                </div>
              </a>
            </td>
          </tr>

          <!-- Main Email Body -->
          <tr>
            <td style="padding: 36px 32px; color: #CBD5E1; font-size: 15px; line-height: 1.6;">
              ${content}
            </td>
          </tr>

          <!-- Security Notice & Footer -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; background-color: #06070A; border-top: 1px solid rgba(255,255,255,0.06); color: #64748B; font-size: 11px; line-height: 1.6; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #94A3B8;">
                This official security notification was dispatched by the automated systems of <strong>Artellium Global Marketplace Ltd</strong> (<a href="${appUrl}" style="color: #D4AF37;">artellium.africa</a>).
              </p>
              <p style="margin: 0 0 10px 0;">
                Direct Wema Bank Corporate Settlement • Sovereign Provenance Registry • Verified Master Ateliers
              </p>
              <p style="margin: 0; color: #475569;">
                &copy; ${new Date().getFullYear()} Artellium Africa. All rights reserved. Victoria Island, Lagos • Kigali • Accra • Nairobi.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 1. ACCOUNT VERIFICATION EMAIL (6-Digit OTP & Activation Link)
export function generateVerificationEmailHtml({ name = 'Art Patron', code = '123456', role = 'buyer', appUrl = DEFAULT_URL }) {
  const isArtist = role === 'artist';
  const roleLabel = isArtist ? 'Master Creator & Artist' : 'Fine Art Collector & Patron';
  const verifyLink = `${appUrl}/verify-email?code=${code}`;

  const content = `
    <div style="text-align: center; margin-bottom: 28px;">
      <span class="badge" style="background-color: rgba(212, 175, 55, 0.15); color: #D4AF37; border: 1px solid rgba(212, 175, 55, 0.4);">
        🛡️ IDENTITY & SOVEREIGN VERIFICATION
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; margin: 16px 0 8px 0; font-weight: 700;">
        Verify Your ${roleLabel} Account
      </h1>
      <p style="color: #94A3B8; font-size: 14px; margin: 0;">
        Welcome to Artellium Africa, ${name}. Please verify your email to unlock seamless gallery bidding and marketplace acquisitions.
      </p>
    </div>

    <div style="background-color: #07090E; border: 1px dashed rgba(212, 175, 55, 0.5); border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
      <div style="font-size: 12px; letter-spacing: 2px; color: #94A3B8; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">
        Your 6-Digit Verification Passcode:
      </div>
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #D4AF37; margin: 10px 0; padding-left: 12px;">
        ${code}
      </div>
      <div style="font-size: 11px; color: #64748B; margin-top: 8px;">
        Valid for 15 minutes. Never share this code with anyone.
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyLink}" class="btn" style="background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);">
        Verify Account Now
      </a>
    </div>

    <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; font-size: 12px; color: #64748B;">
      <p style="margin: 0;">
        If you did not initiate this account registration on <strong>artellium.africa</strong>, you can safely disregard this email.
      </p>
    </div>
  `;

  return baseTemplate({
    title: `Verify Your Artellium Account (${code})`,
    preheader: `Your Artellium verification code is ${code}. Verify to unlock live auctions and curated marketplace access.`,
    content,
    appUrl
  });
}

// 2. LOGIN SECURITY ALERT NOTIFICATION
export function generateLoginAlertEmailHtml({ name = 'Collector', role = 'buyer', ipAddress = '102.89.23.14', userAgent = 'Web Browser', time = new Date().toUTCString(), appUrl = DEFAULT_URL }) {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge" style="background-color: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4);">
        🔒 NEW LOGIN DETECTED
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 24px; color: #FFFFFF; margin: 16px 0 8px 0;">
        Security Notice: Login on Artellium.africa
      </h1>
      <p style="color: #94A3B8; font-size: 14px; margin: 0;">
        Hello <strong>${name}</strong>, your Artellium account was recently accessed.
      </p>
    </div>

    <table width="100%" style="background-color: #07090E; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; margin: 20px 0; font-size: 13px;">
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94A3B8;">Time:</td>
        <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #F1F5F9; font-weight: 600; text-align: right;">${time}</td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94A3B8;">Account Role:</td>
        <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #D4AF37; font-weight: 600; text-align: right; text-transform: uppercase;">${role}</td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #94A3B8;">IP Address:</td>
        <td style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #F1F5F9; font-weight: 600; text-align: right;">${ipAddress}</td>
      </tr>
      <tr>
        <td style="padding: 14px 18px; color: #94A3B8;">Client Device:</td>
        <td style="padding: 14px 18px; color: #F1F5F9; font-weight: 600; text-align: right;">${userAgent}</td>
      </tr>
    </table>

    <p style="color: #94A3B8; font-size: 13px; margin: 20px 0;">
      If this was you, no action is needed. If you did not log into your account, please secure your profile immediately by resetting your password.
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${appUrl}/buyer/account#security" class="btn" style="background: linear-gradient(135deg, #334155 0%, #1E293B 100%); color: #F8FAFC !important; border: 1px solid rgba(255,255,255,0.2);">
        Manage Security Settings
      </a>
    </div>
  `;

  return baseTemplate({
    title: 'Security Alert: Login on Artellium.africa',
    preheader: `New login to your Artellium account at ${time}.`,
    content,
    appUrl
  });
}

// 3. PAYMENT CONFIRMATION & OFFICIAL RECEIPT (Paystack / Wema Bank Style)
export function generatePaymentReceiptEmailHtml({ 
  name = 'Dr. Evelyn Carter', 
  orderId = 'ORD-2026-88942', 
  paymentReference = 'WEMA-SETTLE-88942', 
  items = [], 
  totalAmount = 1850000, 
  currency = 'NGN', 
  settlementBank = 'Wema Bank PLC',
  date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  appUrl = DEFAULT_URL 
}) {
  const formattedTotal = currency === 'USD' 
    ? `$${Math.round(totalAmount / 1480).toLocaleString()}` 
    : `₦${Number(totalAmount).toLocaleString()}`;

  const itemsRows = (items.length > 0 ? items : [{ title: 'Masterpiece Artwork Acquisition', artistName: 'Pan-African Master', price: totalAmount }]).map(it => `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
        <div style="font-weight: 700; color: #FFFFFF; font-size: 14px;">${it.title || 'Fine Artwork'}</div>
        <div style="font-size: 12px; color: #D4AF37; margin-top: 2px;">Artist: ${it.artistName || 'Master Artist'}</div>
      </td>
      <td align="right" style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-weight: 700; color: #FAF8EE; font-size: 14px;">
        ${currency === 'USD' ? `$${Math.round((it.price || totalAmount) / 1480).toLocaleString()}` : `₦${Number(it.price || totalAmount).toLocaleString()}`}
      </td>
    </tr>
  `).join('');

  const content = `
    <div style="text-align: center; margin-bottom: 26px;">
      <span class="badge" style="background-color: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4);">
        ✓ PAYMENT VERIFIED & SETTLED
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; margin: 16px 0 6px 0;">
        Masterpiece Acquisition Confirmed
      </h1>
      <p style="color: #94A3B8; font-size: 14px; margin: 0;">
        Thank you, <strong>${name}</strong>. Your payment has been verified by <strong>artellium.africa</strong>.
      </p>
    </div>

    <!-- Payment Highlight Card -->
    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(12, 15, 23, 0.95) 100%); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 18px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 11px; letter-spacing: 2px; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Total Settled Amount</div>
      <div style="font-family: Georgia, serif; font-size: 34px; font-weight: 900; color: #D4AF37; margin: 8px 0;">
        ${formattedTotal}
      </div>
      <div style="font-size: 12px; color: #10B981; font-weight: 600;">
        ● Direct Corporate Banking via ${settlementBank}
      </div>
    </div>

    <!-- Order Metadata -->
    <table width="100%" style="font-size: 13px; margin-bottom: 24px;">
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Order Reference:</td>
        <td align="right" style="color: #FAF8EE; font-weight: 600; font-family: monospace;">${orderId}</td>
      </tr>
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Payment Transaction ID:</td>
        <td align="right" style="color: #D4AF37; font-weight: 600; font-family: monospace;">${paymentReference}</td>
      </tr>
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Date of Settlement:</td>
        <td align="right" style="color: #FAF8EE; font-weight: 600;">${date}</td>
      </tr>
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Provenance Ledger Status:</td>
        <td align="right" style="color: #10B981; font-weight: 600;">Recorded & Immutable</td>
      </tr>
    </table>

    <!-- Items Breakdown -->
    <h3 style="font-family: Georgia, serif; font-size: 16px; color: #FFFFFF; margin: 24px 0 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
      Acquired Pieces Breakdown
    </h3>
    <table width="100%" style="margin-bottom: 28px;">
      ${itemsRows}
      <tr>
        <td style="padding-top: 16px; font-weight: 700; color: #FFFFFF;">Total Paid:</td>
        <td align="right" style="padding-top: 16px; font-weight: 900; font-size: 16px; color: #D4AF37;">${formattedTotal}</td>
      </tr>
    </table>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${appUrl}/buyer/account" class="btn">
        View Order & Provenance Certificate
      </a>
    </div>
  `;

  return baseTemplate({
    title: `Payment Receipt: ${orderId} (Verified by artellium.africa)`,
    preheader: `Your payment of ${formattedTotal} has been verified and settled directly for Order ${orderId}.`,
    content,
    appUrl
  });
}

// 4. ARTIST SALE & PAYOUT NOTIFICATION EMAIL
export function generateArtistSaleEmailHtml({
  artistName = 'Kofi Mensah',
  buyerName = 'Dr. Evelyn Carter',
  artworkTitle = 'The Ancestral Horizon',
  grossAmount = 1850000,
  netPayout = 1572500,
  platformFee = 277500,
  currency = 'NGN',
  orderId = 'ORD-88942',
  date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
  appUrl = DEFAULT_URL
}) {
  const formattedGross = currency === 'USD' ? `$${Math.round(grossAmount / 1480).toLocaleString()}` : `₦${Number(grossAmount).toLocaleString()}`;
  const formattedNet = currency === 'USD' ? `$${Math.round(netPayout / 1480).toLocaleString()}` : `₦${Number(netPayout).toLocaleString()}`;
  const formattedFee = currency === 'USD' ? `$${Math.round(platformFee / 1480).toLocaleString()}` : `₦${Number(platformFee).toLocaleString()}`;

  const content = `
    <div style="text-align: center; margin-bottom: 26px;">
      <span class="badge" style="background-color: rgba(212, 175, 55, 0.15); color: #D4AF37; border: 1px solid rgba(212, 175, 55, 0.4);">
        🎉 ARTWORK SOLD & PAYOUT DISBURSED
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; margin: 16px 0 6px 0;">
        Congratulations, ${artistName}!
      </h1>
      <p style="color: #94A3B8; font-size: 14px; margin: 0;">
        Your masterpiece <strong>"${artworkTitle}"</strong> has just been acquired by patron <strong>${buyerName}</strong>.
      </p>
    </div>

    <!-- Payout Highlight -->
    <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(12, 15, 23, 0.95) 100%); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 18px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 11px; letter-spacing: 2px; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Your Net Artist Payout (85%)</div>
      <div style="font-family: Georgia, serif; font-size: 34px; font-weight: 900; color: #10B981; margin: 8px 0;">
        ${formattedNet}
      </div>
      <div style="font-size: 12px; color: #94A3B8;">
        Gross Sale: ${formattedGross} · Platform Fee (15%): ${formattedFee}
      </div>
    </div>

    <table width="100%" style="font-size: 13px; margin: 20px 0; background-color: #07090E; border-radius: 12px; padding: 12px 18px;">
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Artwork Title:</td>
        <td align="right" style="color: #FAF8EE; font-weight: 700;">${artworkTitle}</td>
      </tr>
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Buyer Patron:</td>
        <td align="right" style="color: #FAF8EE; font-weight: 600;">${buyerName}</td>
      </tr>
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Order Reference:</td>
        <td align="right" style="color: #D4AF37; font-weight: 600; font-family: monospace;">${orderId}</td>
      </tr>
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Disbursement Date:</td>
        <td align="right" style="color: #FAF8EE; font-weight: 600;">${date}</td>
      </tr>
    </table>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${appUrl}/artist/dashboard" class="btn">
        Access Artist Studio & Payout Ledger
      </a>
    </div>
  `;

  return baseTemplate({
    title: `Artwork Sold: ${artworkTitle} (${formattedNet} Payout)`,
    preheader: `Your artwork "${artworkTitle}" has been sold to ${buyerName}. Payout of ${formattedNet} disbursed.`,
    content,
    appUrl
  });
}

// 5. ARTIST ONBOARDING & SUBSCRIPTION WELCOME EMAIL
export function generateArtistWelcomeEmailHtml({
  name = 'Artist',
  plan = 'Premium Tier',
  billingCycle = 'Monthly',
  price = '₦50,000 / mo',
  appUrl = DEFAULT_URL
}) {
  const content = `
    <div style="text-align: center; margin-bottom: 26px;">
      <span class="badge" style="background-color: rgba(212, 175, 55, 0.15); color: #D4AF37; border: 1px solid rgba(212, 175, 55, 0.4);">
        👑 MASTER ARTIST NETWORK
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; margin: 16px 0 6px 0;">
        Welcome to the Artellium Atelier, ${name}
      </h1>
      <p style="color: #94A3B8; font-size: 14px; margin: 0;">
        Your verified creator profile is now active on <strong>artellium.africa</strong>.
      </p>
    </div>

    <div style="background-color: #07090E; border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 16px; padding: 22px; margin: 24px 0;">
      <h3 style="font-family: Georgia, serif; font-size: 16px; color: #D4AF37; margin: 0 0 12px 0;">
        Your Subscription Plan: ${plan} (${billingCycle})
      </h3>
      <ul style="margin: 0; padding-left: 20px; color: #CBD5E1; font-size: 13px; line-height: 1.8;">
        <li>Direct Uploads for Paintings, Sculptures, and Certified Textiles</li>
        <li>Live Fine Art Auctions Access & Realtime Power Bids Console</li>
        <li>Automated 85% Corporate Bank Direct Settlement</li>
        <li>International High-Res Gallery & 3D Exhibition Showcase</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${appUrl}/artist/dashboard" class="btn">
        Open Artist Studio Dashboard
      </a>
    </div>
  `;

  return baseTemplate({
    title: `Welcome to Artellium Africa, ${name}!`,
    preheader: `Your ${plan} artist subscription is active. Start uploading masterworks now.`,
    content,
    appUrl
  });
}
// 6. LIVE AUCTION OUTBID ALERT EMAIL (SOTHEBY'S / CHRISTIE'S GRADE)
export function generateOutbidAlertEmailHtml({
  name = 'Patron',
  lotNumber = 'LOT-104',
  artworkTitle = 'The Ancestral Horizon',
  artistName = 'Kofi Mensah',
  currentBid = 2200000,
  previousBid = 1950000,
  currency = 'NGN',
  auctionUrl = `${DEFAULT_URL}/auctions`
}) {
  const formattedCurrent = currency === 'USD' ? `$${Math.round(currentBid / 1480).toLocaleString()}` : `₦${Number(currentBid).toLocaleString()}`;
  const formattedPrev = currency === 'USD' ? `$${Math.round(previousBid / 1480).toLocaleString()}` : `₦${Number(previousBid).toLocaleString()}`;

  const content = `
    <div style="text-align: center; margin-bottom: 26px;">
      <span class="badge" style="background-color: rgba(225, 29, 72, 0.15); color: #F43F5E; border: 1px solid rgba(225, 29, 72, 0.4);">
        ⚡ LIVE AUCTION ALERT: OUTBID
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; margin: 16px 0 6px 0;">
        You've Been Outbid on ${lotNumber}
      </h1>
      <p style="color: #94A3B8; font-size: 14px; margin: 0;">
        Hello <strong>${name}</strong>, another collector just placed a higher bid on <strong>"${artworkTitle}"</strong>.
      </p>
    </div>

    <!-- Bid Contrast Card -->
    <div style="background: linear-gradient(135deg, rgba(225, 29, 72, 0.12) 0%, rgba(12, 15, 23, 0.95) 100%); border: 1px solid rgba(225, 29, 72, 0.4); border-radius: 18px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 11px; letter-spacing: 2px; color: #FDA4AF; text-transform: uppercase; font-weight: 700;">Current Highest Bid</div>
      <div style="font-family: Georgia, serif; font-size: 36px; font-weight: 900; color: #F43F5E; margin: 8px 0;">
        ${formattedCurrent}
      </div>
      <div style="font-size: 12px; color: #94A3B8;">
        Your previous lead bid: <span style="text-decoration: line-through; color: #64748B;">${formattedPrev}</span>
      </div>
    </div>

    <table width="100%" style="font-size: 13px; margin: 20px 0; background-color: #07090E; border-radius: 12px; padding: 12px 18px;">
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Lot Number:</td>
        <td align="right" style="color: #D4AF37; font-weight: 700;">${lotNumber}</td>
      </tr>
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Artwork Title:</td>
        <td align="right" style="color: #FAF8EE; font-weight: 600;">${artworkTitle}</td>
      </tr>
      <tr>
        <td style="color: #94A3B8; padding: 6px 0;">Master Creator:</td>
        <td align="right" style="color: #FAF8EE; font-weight: 600;">${artistName}</td>
      </tr>
    </table>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${auctionUrl}" class="btn" style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%); color: #FFFFFF !important; box-shadow: 0 4px 25px rgba(225, 29, 72, 0.45);">
        ⚡ Reclaim Your Lead · Place Next Bid
      </a>
    </div>

    <p style="text-align: center; font-size: 11px; color: #64748B; margin: 0;">
      Bids are processed with real-time WEMA Bank cryptographic settlement verification.
    </p>
  `;

  return baseTemplate({
    title: `⚡ Outbid Alert: ${lotNumber} (${artworkTitle}) · Artellium Africa`,
    preheader: `You have been outbid on ${lotNumber}. Current high bid is ${formattedCurrent}. Reclaim your lead now.`,
    content,
    appUrl: DEFAULT_URL
  });
}

// 7. LIVE AUCTION BID CONFIRMATION RECEIPT
export function generateBidConfirmationEmailHtml({
  name = 'Patron',
  lotNumber = 'LOT-104',
  artworkTitle = 'The Ancestral Horizon',
  artistName = 'Kofi Mensah',
  bidAmount = 2200000,
  currency = 'NGN',
  auctionUrl = `${DEFAULT_URL}/auctions`
}) {
  const formattedBid = currency === 'USD' ? `$${Math.round(bidAmount / 1480).toLocaleString()}` : `₦${Number(bidAmount).toLocaleString()}`;

  const content = `
    <div style="text-align: center; margin-bottom: 26px;">
      <span class="badge" style="background-color: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4);">
        ✓ BID CONFIRMED & ACTIVE LEAD
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; margin: 16px 0 6px 0;">
        Your Bid is Confirmed on ${lotNumber}
      </h1>
      <p style="color: #94A3B8; font-size: 14px; margin: 0;">
        Congratulations <strong>${name}</strong>, you currently hold the winning lead on <strong>"${artworkTitle}"</strong>.
      </p>
    </div>

    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(12, 15, 23, 0.95) 100%); border: 1px solid rgba(212, 175, 55, 0.4); border-radius: 18px; padding: 24px; margin: 24px 0; text-align: center;">
      <div style="font-size: 11px; letter-spacing: 2px; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Your Active Lead Bid</div>
      <div style="font-family: Georgia, serif; font-size: 36px; font-weight: 900; color: #D4AF37; margin: 8px 0;">
        ${formattedBid}
      </div>
      <div style="font-size: 12px; color: #10B981; font-weight: 600;">
        ● Registered & Authenticated on Provenance Ledger
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${auctionUrl}" class="btn">
        Enter Live Auction Arena
      </a>
    </div>
  `;

  return baseTemplate({
    title: `Bid Placed: ${lotNumber} (${formattedBid}) · Artellium Africa`,
    preheader: `Your bid of ${formattedBid} is confirmed on ${lotNumber} (${artworkTitle}).`,
    content,
    appUrl: DEFAULT_URL
  });
}

// 8. PASSWORD RESET & ACCOUNT RECOVERY EMAIL
export function generatePasswordResetEmailHtml({
  name = 'Patron',
  code = '892415',
  resetLink = `${DEFAULT_URL}/reset-password?code=892415`,
  appUrl = DEFAULT_URL
}) {
  const content = `
    <div style="text-align: center; margin-bottom: 26px;">
      <span class="badge" style="background-color: rgba(212, 175, 55, 0.15); color: #D4AF37; border: 1px solid rgba(212, 175, 55, 0.4);">
        🔑 CRYPTOGRAPHIC CREDENTIAL RECOVERY
      </span>
      <h1 style="font-family: Georgia, serif; font-size: 26px; color: #FFFFFF; margin: 16px 0 6px 0;">
        Reset Your Artellium Password
      </h1>
      <p style="color: #94A3B8; font-size: 14px; margin: 0;">
        Hello <strong>${name}</strong>, a password reset request was initiated for your sovereign account on <strong>artellium.africa</strong>.
      </p>
    </div>

    <div style="background-color: #07090E; border: 1px dashed rgba(212, 175, 55, 0.5); border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
      <div style="font-size: 12px; letter-spacing: 2px; color: #94A3B8; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">
        Your 6-Digit Password Reset Token:
      </div>
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #D4AF37; margin: 10px 0; padding-left: 12px;">
        ${code}
      </div>
      <div style="font-size: 11px; color: #64748B; margin-top: 8px;">
        Valid for 20 minutes. If you did not make this request, please secure your email account.
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" class="btn">
        Reset My Password Securely
      </a>
    </div>
  `;

  return baseTemplate({
    title: `Password Reset Token: ${code} · Artellium Africa`,
    preheader: `Your Artellium password reset token is ${code}. Click to set a new password.`,
    content,
    appUrl
  });
}
