// In-memory sliding-window / token bucket rate limiter for API routes
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to avoid memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Check if a client IP has exceeded the allowed request limit.
 * @param ip - Client identifier (IP address)
 * @param limit - Maximum requests allowed within the window
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  ip: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000 // default: 10 minutes
): { success: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetInSec: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetInSec: Math.ceil((record.resetAt - now) / 1000),
  };
}

