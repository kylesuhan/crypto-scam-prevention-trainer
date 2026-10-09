import "server-only";

// Per-instance guards for the analyzer endpoint. On Vercel each serverless instance keeps its own
// memory, so these are best-effort; move to a shared store (e.g. Upstash Redis) before scaling up.

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 8;
const CACHE_TTL_MS = 5 * 60_000;
const MAX_ENTRIES = 500;

const hits = new Map<string, number[]>();

/** Sliding-window limit per client key. Returns seconds to wait, or 0 if allowed. */
export function rateLimit(key: string, now = Date.now()): number {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, recent);
    return Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_ENTRIES) hits.delete(hits.keys().next().value!);
  return 0;
}

const cache = new Map<string, { at: number; value: unknown }>();

export function cached<T>(key: string, now = Date.now()): T | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (now - entry.at > CACHE_TTL_MS) {
    cache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function remember(key: string, value: unknown, now = Date.now()) {
  cache.set(key, { at: now, value });
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value!);
}
