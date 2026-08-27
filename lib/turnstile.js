/**
 * CANONICAL CLOUDFLARE TURNSTILE SERVER-SIDE SITEVERIFY
 * Validates cf-turnstile-response tokens via https://challenges.cloudflare.com/turnstile/v0/siteverify
 */

export async function verifyTurnstileToken({ token, clientIp, action, expectedHostnames }) {
  const secret = process.env.CLOUDFLARE_SECRET_KEY || process.env.TURNSTILE_SECRET || '';
  
  if (!token || typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return { success: false, error: 'Invalid or missing Turnstile token' };
  }

  // Handle local dev test simulation token
  if (token === 'cf-turnstile-dummy-token' && process.env.NODE_ENV === 'development') {
    return { success: true, hostname: 'localhost', action: action || 'signup' };
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: clientIp || '',
      }),
    });

    if (!response.ok) {
      console.warn(`[Turnstile] siteverify HTTP error: ${response.status}`);
      return { success: false, error: `siteverify HTTP ${response.status}` };
    }

    const data = await response.json();

    if (!data.success) {
      console.warn('[Turnstile] Verification failed:', data['error-codes']);
      return { success: false, errorCodes: data['error-codes'] };
    }

    // Validate action if provided
    if (action && data.action && data.action !== action) {
      console.warn(`[Turnstile] Action mismatch. Expected: ${action}, Received: ${data.action}`);
      return { success: false, error: 'Turnstile action mismatch' };
    }

    // Validate hostname if configured
    const allowedHostnames = expectedHostnames || (process.env.TURNSTILE_HOSTNAMES || 'localhost,127.0.0.1,artellium.africa,artellium-africa.vercel.app')
      .split(',')
      .map(h => h.trim())
      .filter(Boolean);

    if (allowedHostnames.length > 0 && data.hostname && !allowedHostnames.includes(data.hostname)) {
      console.warn(`[Turnstile] Hostname mismatch. Received: ${data.hostname}, Allowed: ${allowedHostnames.join(', ')}`);
      if (process.env.NODE_ENV !== 'development') {
        return { success: false, error: 'Turnstile hostname not permitted' };
      }
    }

    return {
      success: true,
      data
    };
  } catch (err) {
    console.error('[Turnstile] Exception during siteverify:', err.message);
    return { success: false, error: err.message };
  }
}
