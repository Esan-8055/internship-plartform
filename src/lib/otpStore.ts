/**
 * TARCIN OTP Store
 * ─────────────────────────────────────────────────────────
 * In-memory OTP store with:
 *  - 10-minute expiry
 *  - Max 3 attempts per OTP (brute-force protection)
 *  - Rate limiting: max 3 OTP sends per email per 15 min
 *  - Auto-cleanup of expired entries
 *
 * NOTE: This works correctly for single-process Node.js servers
 * (including Next.js dev and production with a custom server.mjs).
 * For multi-instance/serverless deployments, swap to Redis.
 */

interface OtpEntry {
  otp: string;
  expires: number;      // timestamp ms
  attempts: number;     // wrong guesses so far
}

interface RateLimitEntry {
  count: number;        // how many OTPs sent
  windowStart: number;  // timestamp ms
}

// Use globalThis to persist stores across HMR in development
const globalForOtp = globalThis as unknown as {
  otpStore: Map<string, OtpEntry>;
  rateStore: Map<string, RateLimitEntry>;
};

const OTP_STORE = globalForOtp.otpStore || new Map<string, OtpEntry>();
const RATE_STORE = globalForOtp.rateStore || new Map<string, RateLimitEntry>();

if (process.env.NODE_ENV !== 'production') {
  globalForOtp.otpStore = OTP_STORE;
  globalForOtp.rateStore = RATE_STORE;
}

const OTP_TTL_MS        = 10 * 60 * 1000;  // 10 minutes
const MAX_ATTEMPTS      = 3;               // wrong guesses before lock
const RATE_WINDOW_MS    = 15 * 60 * 1000;  // 15-minute window
const RATE_MAX_SENDS    = 3;               // max OTP sends in that window

// ── Auto-cleanup every 5 minutes ─────────────────────────────────────────────
if (!(globalForOtp as any).cleanupInterval) {
  (globalForOtp as any).cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [email, entry] of OTP_STORE) {
      if (now > entry.expires) {
        console.log(`[OTP_STORE] Cleaning up expired OTP for ${email}`);
        OTP_STORE.delete(email);
      }
    }
    for (const [email, entry] of RATE_STORE) {
      if (now > entry.windowStart + RATE_WINDOW_MS) RATE_STORE.delete(email);
    }
  }, 5 * 60 * 1000);
}

// ── Rate limit check ──────────────────────────────────────────────────────────
export function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const entry = RATE_STORE.get(email);

  if (!entry || now > entry.windowStart + RATE_WINDOW_MS) {
    return false;
  }

  return entry.count >= RATE_MAX_SENDS;
}

export function incrementRateLimit(email: string): void {
  const now = Date.now();
  const entry = RATE_STORE.get(email);

  if (!entry || now > entry.windowStart + RATE_WINDOW_MS) {
    RATE_STORE.set(email, { count: 1, windowStart: now });
  } else {
    entry.count += 1;
  }
}

// ── Save OTP ──────────────────────────────────────────────────────────────────
export function saveOtp(email: string, otp: string): void {
  console.log(`[OTP_STORE] Saving OTP for ${email}`);
  OTP_STORE.set(email, {
    otp,
    expires: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
}

// ── Check OTP ─────────────────────────────────────────────────────────────────
export type OtpCheckResult =
  | 'valid'
  | 'invalid'
  | 'expired'
  | 'not_found'
  | 'max_attempts';

export function checkOtp(email: string, otp: string): OtpCheckResult {
  const stored = OTP_STORE.get(email);

  if (!stored) {
    console.warn(`[OTP_STORE] No OTP found for ${email}. Current keys:`, Array.from(OTP_STORE.keys()));
    return 'not_found';
  }

  if (Date.now() > stored.expires) {
    OTP_STORE.delete(email);
    return 'expired';
  }

  if (stored.attempts >= MAX_ATTEMPTS) {
    OTP_STORE.delete(email);
    return 'max_attempts';
  }

  if (stored.otp !== otp) {
    stored.attempts += 1;
    return 'invalid';
  }

  // ✅ Correct — consume immediately
  OTP_STORE.delete(email);
  return 'valid';
}
