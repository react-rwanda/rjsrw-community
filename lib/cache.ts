import { Redis } from "@upstash/redis";

export const cache = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

const DEFAULT_TTL_SECONDS = 60;

export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): Promise<T> {
  const cached = await cache.get<T>(key);
  if (cached !== null && cached !== undefined) return cached;

  const data = await fetchFn();
  await cache.set(key, data, { ex: ttlSeconds });
  return data;
}

export const tags = {
  feed: "feed",
  events: "events",
  members: "members",
  library: "library",
  forum: "forum",
  dashboard: "dashboard",
} as const;

export type CacheTag = (typeof tags)[keyof typeof tags];

export async function invalidateTag(tag: CacheTag): Promise<void> {
  let cursor: string | number = 0;
  do {
    const result: [string | number, string[]] = await cache.scan(cursor, {
      match: `tag:${tag}:*`,
      count: 100,
    });
    const [nextCursor, keys] = result;
    if (keys.length > 0) await cache.del(...keys);
    cursor = nextCursor;
  } while (cursor !== "0" && cursor !== 0);
}
