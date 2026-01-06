/**
 * In-memory rate limiting for contact form submissions
 * Uses Map-based storage (suitable for low-traffic personal site)
 * For production scale, consider Redis or Vercel KV
 */

import { config } from "./config";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory storage for rate limiting
// Key: IP address, Value: { count, resetTime }
const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  },
  10 * 60 * 1000,
);

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number;
}

/**
 * Check if a request from the given IP is allowed
 * @param ip - IP address to check
 * @returns RateLimitResult indicating if request is allowed
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // No previous requests from this IP
  if (!entry) {
    const resetTime = now + config.rateLimitWindowMs;
    rateLimitMap.set(ip, { count: 1, resetTime });
    return {
      allowed: true,
      remainingAttempts: config.rateLimitMaxRequests - 1,
      resetTime,
    };
  }

  // Time window has expired, reset the counter
  if (now > entry.resetTime) {
    const resetTime = now + config.rateLimitWindowMs;
    rateLimitMap.set(ip, { count: 1, resetTime });
    return {
      allowed: true,
      remainingAttempts: config.rateLimitMaxRequests - 1,
      resetTime,
    };
  }

  // Within time window - check if limit exceeded
  if (entry.count >= config.rateLimitMaxRequests) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment counter and allow request
  entry.count++;
  rateLimitMap.set(ip, entry);

  return {
    allowed: true,
    remainingAttempts: config.rateLimitMaxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP from Next.js request headers
 * @param headers - Request headers
 * @returns IP address string
 */
export function getClientIP(headers: Headers): string {
  // Try various headers that might contain the real IP
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback to a generic identifier if no IP found
  // This shouldn't happen in production but prevents errors
  return "unknown";
}
