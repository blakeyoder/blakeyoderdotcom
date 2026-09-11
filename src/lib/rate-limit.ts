/**
 * In-memory rate limiting for contact form submissions
 * Uses Map-based storage (suitable for low-traffic personal site)
 *
 * Note: this is per-instance state. On serverless it resets on cold start and
 * is not shared between concurrent instances, so the effective limit is looser
 * than configured. Good enough as a courtesy throttle for a personal site; move
 * to Redis or Upstash if it ever needs to be a real guarantee.
 */

import { config } from "./config";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limiting
// Key: client identifier, Value: { count, resetTime }
const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Hard cap on tracked keys. A module-level setInterval is unreliable on
 * serverless (instances are frozen between invocations), so expired entries are
 * evicted lazily on access and the map is pruned when it grows past this.
 */
const MAX_TRACKED_KEYS = 10_000;

function pruneExpired(now: number): void {
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
  // If everything is still live and we are over the cap, drop oldest-first.
  if (rateLimitMap.size > MAX_TRACKED_KEYS) {
    const excess = rateLimitMap.size - MAX_TRACKED_KEYS;
    let dropped = 0;
    for (const key of rateLimitMap.keys()) {
      rateLimitMap.delete(key);
      if (++dropped >= excess) break;
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number;
}

export interface RateLimitOptions {
  /** Defaults to RATE_LIMIT_MAX_REQUESTS. */
  max?: number;
  /** Defaults to RATE_LIMIT_WINDOW_MS. */
  windowMs?: number;
}

function limits(options?: RateLimitOptions) {
  return {
    max: options?.max ?? config.rateLimitMaxRequests,
    windowMs: options?.windowMs ?? config.rateLimitWindowMs,
  };
}

/**
 * Reports whether a request from this client would be allowed, WITHOUT
 * consuming any quota.
 *
 * Checking and consuming are deliberately separate: the caller should only
 * consume once a submission actually succeeds, so a visitor who mistypes their
 * email is not locked out while correcting it.
 */
export function checkRateLimit(
  clientId: string,
  options?: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(clientId);
  const { max, windowMs } = limits(options);

  if (!entry || now > entry.resetTime) {
    return {
      allowed: max > 0,
      remainingAttempts: Math.max(0, max),
      resetTime: now + windowMs,
    };
  }

  return {
    allowed: entry.count < max,
    remainingAttempts: Math.max(0, max - entry.count),
    resetTime: entry.resetTime,
  };
}

/**
 * Records one successful request against this client's quota.
 */
export function consumeRateLimit(
  clientId: string,
  options?: RateLimitOptions,
): RateLimitResult {
  const now = Date.now();
  pruneExpired(now);

  const entry = rateLimitMap.get(clientId);
  const { max, windowMs } = limits(options);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(clientId, { count: 1, resetTime });
    return {
      allowed: max > 0,
      remainingAttempts: Math.max(0, max - 1),
      resetTime,
    };
  }

  entry.count += 1;
  rateLimitMap.set(clientId, entry);

  return {
    allowed: entry.count <= max,
    remainingAttempts: Math.max(0, max - entry.count),
    resetTime: entry.resetTime,
  };
}

/** Test seam: drops all tracked state. */
export function resetRateLimits(): void {
  rateLimitMap.clear();
}

/**
 * Derives a client identifier from request headers.
 *
 * Order matters. `x-forwarded-for` is the header a client can most easily
 * forge, so platform-set headers are preferred and it is only used as a
 * fallback. Vercel overwrites `x-forwarded-for` with the true client address,
 * which is why the fallback is still useful there.
 */
export function getClientIP(headers: Headers): string {
  const vercelForwarded = headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    return vercelForwarded.split(",")[0].trim();
  }

  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP.trim();
  }

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return "unknown";
}
