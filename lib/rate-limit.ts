const WINDOW_MS = 60_000;

function createSlidingWindowLimiter(limit: number) {
  const hits = new Map<string, number[]>();

  return {
    async limit(key: string): Promise<{ success: boolean }> {
      const now = Date.now();
      const cutoff = now - WINDOW_MS;
      const keyHits = (hits.get(key) ?? []).filter((t) => t > cutoff);
      if (keyHits.length >= limit) {
        return { success: false };
      }
      keyHits.push(now);
      hits.set(key, keyHits);
      return { success: true };
    },
  };
}

export const authRateLimit = createSlidingWindowLimiter(5);
export const uploadRateLimit = createSlidingWindowLimiter(10);
