import { describe, it, expect, beforeEach, vi } from "vitest";

// Inline the rate limiter logic for isolated testing
// Mirrors lib/rate-limit.ts in-memory sliding window implementation
function createRateLimiter(limit: number, windowMs: number) {
  const store = new Map<string, number[]>();

  return function rateLimit(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const windowStart = now - windowMs;
    const hits = (store.get(key) ?? []).filter((t) => t > windowStart);
    if (hits.length >= limit) {
      return { allowed: false, remaining: 0 };
    }
    hits.push(now);
    store.set(key, hits);
    return { allowed: true, remaining: limit - hits.length };
  };
}

describe("In-memory rate limiter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("allows requests up to the limit", () => {
    const rl = createRateLimiter(3, 60_000);
    expect(rl("user-1").allowed).toBe(true);
    expect(rl("user-1").allowed).toBe(true);
    expect(rl("user-1").allowed).toBe(true);
  });

  it("blocks the request that exceeds the limit", () => {
    const rl = createRateLimiter(3, 60_000);
    rl("user-1");
    rl("user-1");
    rl("user-1");
    expect(rl("user-1").allowed).toBe(false);
    expect(rl("user-1").remaining).toBe(0);
  });

  it("counts remaining correctly", () => {
    const rl = createRateLimiter(5, 60_000);
    rl("user-1");
    rl("user-1");
    const result = rl("user-1");
    expect(result.remaining).toBe(2);
  });

  it("allows again after window expires", () => {
    const rl = createRateLimiter(2, 60_000);
    rl("user-1");
    rl("user-1");
    expect(rl("user-1").allowed).toBe(false);

    // Advance past the window
    vi.advanceTimersByTime(61_000);
    expect(rl("user-1").allowed).toBe(true);
  });

  it("tracks different keys independently", () => {
    const rl = createRateLimiter(1, 60_000);
    rl("user-1");
    expect(rl("user-1").allowed).toBe(false);
    expect(rl("user-2").allowed).toBe(true);
  });
});
