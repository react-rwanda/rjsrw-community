import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCachedOrFetch, tags } from "@/lib/cache";

export type FeedItem = {
  id: string;
  type: "EVENT" | "PUBLICATION" | "FORUM";
  tag: "EVENT" | "KIGALI" | "SHOWCASE" | "ANNOUNCEMENT" | "WORKSHOP";
  title: string;
  excerpt: string;
  author: {
    name: string;
    image: string | null;
    role: string;
  };
  createdAt: string;
};

export async function GET() {
  try {
    const feed = await getCachedOrFetch<FeedItem[]>(
      `tag:${tags.feed}:latest`,
      async () => {
        // Fetch latest events
        const events = await db.event.findMany({
          take: 4,
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true, image: true, role: true } } },
        });

        // Fetch latest published publications
        const publications = await db.publication.findMany({
          take: 4,
          where: { status: "PUBLISHED" },
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true, image: true, role: true } } },
        });

        // Fetch latest forum posts
        const forumPosts = await db.forumPost.findMany({
          take: 4,
          orderBy: { createdAt: "desc" },
          include: { author: { select: { name: true, image: true, role: true } } },
        });

        // Map to unified feed items
        const feedItems: FeedItem[] = [
          ...events.map((e) => ({
            id: e.id,
            type: "EVENT" as const,
            tag: mapEventTag(e.type, e.location),
            title: e.title,
            excerpt: e.description.slice(0, 160),
            author: {
              name: e.author.name,
              image: e.author.image,
              role: e.author.role,
            },
            createdAt: e.createdAt.toISOString(),
          })),
          ...publications.map((p) => ({
            id: p.id,
            type: "PUBLICATION" as const,
            tag: "SHOWCASE" as const,
            title: p.title,
            excerpt: p.summary.slice(0, 160),
            author: {
              name: p.author.name,
              image: p.author.image,
              role: p.author.role,
            },
            createdAt: p.createdAt.toISOString(),
          })),
          ...forumPosts.map((f) => ({
            id: f.id,
            type: "FORUM" as const,
            tag: mapForumTag(f.category),
            title: f.title,
            excerpt: f.body.slice(0, 160),
            author: {
              name: f.author.name,
              image: f.author.image,
              role: f.author.role,
            },
            createdAt: f.createdAt.toISOString(),
          })),
        ];

        // Sort by date descending and take top 6
        feedItems.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return feedItems.slice(0, 6);
      },
      60
    );

    return NextResponse.json(feed);
  } catch (error) {
    console.error("Feed API error:", error);
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}

function mapEventTag(
  type: string,
  location: string
): "EVENT" | "KIGALI" | "WORKSHOP" | "ANNOUNCEMENT" {
  if (type === "WORKSHOP") return "WORKSHOP";
  if (location.toLowerCase().includes("kigali")) return "KIGALI";
  return "EVENT";
}

function mapForumTag(
  category: string
): "SHOWCASE" | "ANNOUNCEMENT" | "EVENT" | "KIGALI" | "WORKSHOP" {
  if (category === "SHOWCASE") return "SHOWCASE";
  if (category === "ANNOUNCEMENTS") return "ANNOUNCEMENT";
  return "EVENT";
}
