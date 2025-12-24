/**
 * Simple in-memory rate limiter for development/small scale.
 * In production, use Redis or a similar store.
 */

const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

export function isRateLimited(key: string, limit: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, lastRequest: now });
    return false;
  }

  if (now - entry.lastRequest > windowMs) {
    rateLimitMap.set(key, { count: 1, lastRequest: now });
    return false;
  }

  if (entry.count >= limit) {
    return true;
  }

  entry.count += 1;
  return false;
}
