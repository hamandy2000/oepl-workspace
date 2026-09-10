/**
 * Fixed-window login throttle.
 *
 * Scope and limits: this counter lives in the process, so it is per-instance. On a
 * single long-lived server that is the whole story; on serverless it is not — each
 * cold instance starts at zero, and an attacker spraying across instances gets more
 * attempts than the numbers below suggest. It is a speed bump, not a wall.
 *
 * Two things behind it do hold globally: Supabase Auth applies its own server-side
 * rate limit to signInWithPassword, and passwords are Supabase-hashed rather than
 * compared against a shared secret. For a lab site that combination is proportionate.
 * If this ever needs a real global limiter, move the counter to Postgres or Redis —
 * the call sites don't change.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const MAX_TRACKED_KEYS = 5000;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  // Pathological cardinality (spoofed XFF, say) shouldn't grow without bound.
  if (buckets.size > MAX_TRACKED_KEYS) buckets.clear();
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkLoginRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  if (bucket.count > MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - bucket.count,
    retryAfterSeconds: 0,
  };
}

/** Clears the caller's counter — call after a successful sign-in. */
export function resetLoginRateLimit(key: string) {
  buckets.delete(key);
}

/**
 * Best-effort client identity. Proxies can forge these headers, so this is only ever
 * a throttling key — never an authorization input.
 */
export function clientKeyFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown";
  return `login:${ip}`;
}
