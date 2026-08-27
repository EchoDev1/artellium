/**
 * ARTELLIUM EMAIL CLIENT HELPER
 * Dispatches transactional email triggers to /api/emails/send
 */

export async function triggerEmailNotification(type, to, payload = {}) {
  if (!to) return { success: false, error: 'No recipient email provided' };

  try {
    const res = await fetch('/api/emails/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, to, payload })
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn(`[Email Client] Failed to trigger "${type}" email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

export async function requestVerificationOtp(email, name, role = 'buyer') {
  try {
    const res = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, role })
    });
    return await res.json();
  } catch (error) {
    console.warn('[Email Client] Verification OTP request failed:', error.message);
    return { success: false, error: error.message };
  }
}

export async function submitVerificationCode(email, code) {
  try {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    return await res.json();
  } catch (error) {
    console.warn('[Email Client] Code verification failed:', error.message);
    return { success: false, error: error.message };
  }
}
