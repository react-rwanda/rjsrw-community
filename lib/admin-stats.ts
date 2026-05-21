import { db } from "@/lib/db";
import { getCachedOrFetch, tags } from "@/lib/cache";

export interface AdminStats {
  totalMembers: number;
  upcomingEvents: number;
  pendingPublications: number;
  forumThreads: number;
}

const CACHE_TTL_SECONDS = 60;

export async function getAdminStats(): Promise<AdminStats> {
  // If Upstash isn't configured the cache lookup will throw — fall back to a direct read
  // so the dashboard still works for new contributors who haven't set up Redis yet.
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
    return computeAdminStats();
  }

  return getCachedOrFetch(
    `tag:${tags.dashboard}:admin-stats`,
    computeAdminStats,
    CACHE_TTL_SECONDS,
  );
}

async function computeAdminStats(): Promise<AdminStats> {
  const [totalMembers, upcomingEvents, pendingPublications, forumThreads] = await Promise.all([
    db.user.count(),
    db.event.count({ where: { isUpcoming: true } }),
    db.publication.count({ where: { status: "PENDING" } }),
    db.forumPost.count(),
  ]);
  return { totalMembers, upcomingEvents, pendingPublications, forumThreads };
}
