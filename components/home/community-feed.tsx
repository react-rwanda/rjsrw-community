"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { FeedItem } from "@/app/api/feed/route";

// ─── Tag color mapping per design-style-guide.md §3 ────────────────────────

const TAG_STYLES: Record<string, string> = {
  EVENT: "bg-warning-100 text-warning-700",
  KIGALI: "bg-info-100 text-info-600",
  SHOWCASE: "bg-showcase-100 text-showcase-600",
  ANNOUNCEMENT: "bg-warning-100 text-warning-700",
  WORKSHOP: "bg-neutral-100 text-neutral-700",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Feed Card ──────────────────────────────────────────────────────────────

function FeedCard({ item, featured }: { item: FeedItem; featured?: boolean }) {
  const tagStyle = TAG_STYLES[item.tag] ?? TAG_STYLES.EVENT;

  return (
    <article
      className={`border border-neutral-200 bg-white p-6 flex flex-col justify-between ${
        featured ? "col-span-1 md:col-span-2" : ""
      }`}
    >
      <div>
        {/* Tag badge */}
        <span
          className={`inline-block px-2 py-[2px] text-[11px] font-semibold uppercase tracking-[0.06em] ${tagStyle}`}
        >
          {item.tag}
        </span>

        {/* Title */}
        <h3
          className={`mt-3 font-bold text-neutral-900 leading-tight ${
            featured ? "text-[24px]" : "text-[18px]"
          }`}
        >
          {item.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 text-[14px] text-neutral-500 leading-relaxed line-clamp-2">
          {item.excerpt}
        </p>
      </div>

      {/* Divider + Author row */}
      <div>
        <hr className="my-4 border-neutral-200" />
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <img
            src={
              item.author.image ??
              `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.author.name)}&backgroundColor=0a0a0a&textColor=ffffff`
            }
            alt={item.author.name}
            className="avatar w-8 h-8 object-cover grayscale"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-neutral-900 truncate">
              {item.author.name}
            </p>
            <p className="text-[11px] uppercase tracking-[0.06em] text-neutral-400">
              {item.author.role}
            </p>
          </div>
          <span className="text-[12px] text-neutral-400">
            {formatTimeAgo(item.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function FeedCardSkeleton({ featured }: { featured?: boolean }) {
  return (
    <div
      className={`border border-neutral-200 bg-white p-6 animate-pulse ${
        featured ? "col-span-1 md:col-span-2" : ""
      }`}
    >
      <div className="h-4 w-20 bg-neutral-100 mb-4" />
      <div className={`bg-neutral-100 mb-2 ${featured ? "h-7 w-3/4" : "h-5 w-2/3"}`} />
      <div className="h-4 w-full bg-neutral-100 mb-1" />
      <div className="h-4 w-4/5 bg-neutral-100" />
      <hr className="my-4 border-neutral-200" />
      <div className="flex items-center gap-3">
        <div className="avatar w-8 h-8 bg-neutral-100" />
        <div className="flex-1">
          <div className="h-3 w-24 bg-neutral-100 mb-1" />
          <div className="h-2 w-16 bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

// ─── Community Feed Section ─────────────────────────────────────────────────

export default function CommunityFeed() {
  const { data: feed, isLoading } = useQuery<FeedItem[]>({
    queryKey: ["feed"],
    queryFn: () => fetch("/api/feed").then((r) => r.json()),
  });

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-12 bg-neutral-50">
      <div className="mx-auto max-w-[1440px]">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
            Community Feed
          </h2>
          <Link
            href="/forum"
            className="text-[13px] font-semibold text-primary-500 hover:text-primary-700 transition-colors duration-[100ms]"
          >
            View Archive →
          </Link>
        </div>

        {/* Card grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeedCardSkeleton featured />
            <FeedCardSkeleton />
            <FeedCardSkeleton />
            <FeedCardSkeleton />
            <FeedCardSkeleton />
          </div>
        ) : feed && feed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feed.map((item, i) => (
              <FeedCard key={item.id} item={item} featured={i === 0} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[16px] font-bold text-neutral-900">No feed items yet</p>
            <p className="text-[14px] text-neutral-500 mt-1">
              Check back soon for community updates.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
