// ponytail: in-memory fixed-window limiter, per-process only. Fine for a
// single long-running server; on serverless/multi-instance (e.g. Vercel)
// each instance keeps its own counters so the limit isn't global. Swap for
// @upstash/ratelimit (or any Redis-backed limiter) if that gap matters.
const buckets = new Map();

export function rateLimit(key, { limit = 5, windowMs = 5 * 60 * 1000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { allowed: true };
}

export function clientIp(request) {
  // Safe to trust on this app's deployment target (Vercel): their edge
  // network sets/overwrites x-forwarded-for itself, so a client can't spoof
  // it by sending its own value - requests never reach the function
  // without going through that edge first. This would NOT be safe on a
  // self-hosted origin reachable directly, where a client fully controls
  // this header.
  return request?.headers?.get?.("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}
