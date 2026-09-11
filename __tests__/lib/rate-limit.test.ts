/**
 * Tests for the in-memory rate limiter.
 *
 * The important property is that checking and consuming are separate, so a
 * rejected submission never costs the visitor their quota.
 */

import { describe, it, expect, beforeEach, spyOn } from "bun:test";
import {
  checkRateLimit,
  consumeRateLimit,
  getClientIP,
  resetRateLimits,
} from "@/lib/rate-limit";

const ONE_MINUTE = 60_000;

beforeEach(() => {
  resetRateLimits();
});

describe("checkRateLimit", () => {
  it("allows a client that has never been seen", () => {
    const result = checkRateLimit("1.2.3.4", { max: 1, windowMs: ONE_MINUTE });
    expect(result.allowed).toBe(true);
  });

  it("does not consume quota, so repeated checks stay allowed", () => {
    const options = { max: 1, windowMs: ONE_MINUTE };
    checkRateLimit("1.2.3.4", options);
    checkRateLimit("1.2.3.4", options);
    checkRateLimit("1.2.3.4", options);

    expect(checkRateLimit("1.2.3.4", options).allowed).toBe(true);
  });

  it("blocks once the quota has been consumed", () => {
    const options = { max: 1, windowMs: ONE_MINUTE };
    consumeRateLimit("1.2.3.4", options);

    expect(checkRateLimit("1.2.3.4", options).allowed).toBe(false);
  });

  it("honours a max of zero as a kill switch", () => {
    expect(
      checkRateLimit("1.2.3.4", { max: 0, windowMs: ONE_MINUTE }).allowed,
    ).toBe(false);
  });

  it("tracks clients independently", () => {
    const options = { max: 1, windowMs: ONE_MINUTE };
    consumeRateLimit("1.2.3.4", options);

    expect(checkRateLimit("5.6.7.8", options).allowed).toBe(true);
  });

  it("allows again once the window has expired", () => {
    const options = { max: 1, windowMs: 1 };
    consumeRateLimit("1.2.3.4", options);

    const later = Date.now() + 10;
    const spy = spyOn(Date, "now").mockReturnValue(later);
    try {
      expect(checkRateLimit("1.2.3.4", options).allowed).toBe(true);
    } finally {
      spy.mockRestore();
    }
  });
});

describe("consumeRateLimit", () => {
  it("counts each consumption against the quota", () => {
    const options = { max: 3, windowMs: ONE_MINUTE };

    expect(consumeRateLimit("1.2.3.4", options).remainingAttempts).toBe(2);
    expect(consumeRateLimit("1.2.3.4", options).remainingAttempts).toBe(1);
    expect(consumeRateLimit("1.2.3.4", options).remainingAttempts).toBe(0);
    expect(checkRateLimit("1.2.3.4", options).allowed).toBe(false);
  });

  it("never reports negative remaining attempts", () => {
    const options = { max: 1, windowMs: ONE_MINUTE };
    consumeRateLimit("1.2.3.4", options);
    consumeRateLimit("1.2.3.4", options);

    expect(
      consumeRateLimit("1.2.3.4", options).remainingAttempts,
    ).toBeGreaterThanOrEqual(0);
  });
});

describe("getClientIP", () => {
  it("prefers the Vercel-set header over the forgeable one", () => {
    const headers = new Headers({
      "x-vercel-forwarded-for": "203.0.113.1",
      "x-forwarded-for": "6.6.6.6",
      "x-real-ip": "198.51.100.1",
    });

    expect(getClientIP(headers)).toBe("203.0.113.1");
  });

  it("prefers x-real-ip over x-forwarded-for", () => {
    const headers = new Headers({
      "x-real-ip": "198.51.100.1",
      "x-forwarded-for": "6.6.6.6",
    });

    expect(getClientIP(headers)).toBe("198.51.100.1");
  });

  it("falls back to the first x-forwarded-for entry", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" });

    expect(getClientIP(headers)).toBe("203.0.113.9");
  });

  it("returns a stable placeholder when no headers identify the client", () => {
    expect(getClientIP(new Headers())).toBe("unknown");
  });
});
