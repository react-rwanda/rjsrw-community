// React JS Rwanda — Database seed (50+ realistic Rwandan-context records).
// Run with: pnpm db:seed (requires DATABASE_URL in .env.local)

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

// ─── Helpers ────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ─── Member seed data ───────────────────────────────────────────────────────

const MEMBERS: Array<{
  name: string;
  username: string;
  email: string;
  title: string;
  bio: string;
  stack: string[];
  availability: "OPEN_TO_WORK" | "OPEN_TO_PROJECT" | "MENTORING" | "NOT_LOOKING";
  role?: "MEMBER" | "ADMIN";
  contributionPoints: number;
  githubUrl?: string;
  twitterUrl?: string;
}> = [
  { name: "Innocent Habimana", username: "INNOCENT_DEV", email: "innocent@reactjsrwanda.com", title: "Senior Mobile Engineer", bio: "Building Rwanda-first mobile apps with React Native and Expo.", stack: ["React Native", "TypeScript", "Redux"], availability: "OPEN_TO_WORK", role: "ADMIN", contributionPoints: 2400, githubUrl: "https://github.com/innocent-dev" },
  { name: "Divine Umulisa", username: "DIVINE_CODE", email: "divine@reactjsrwanda.com", title: "Fullstack Web Developer", bio: "Next.js + Node.js. Open to mentoring junior devs across East Africa.", stack: ["Next.js", "Node.js", "PostgreSQL"], availability: "MENTORING", contributionPoints: 1800 },
  { name: "Patrick Mugisha", username: "PATO_MUG", email: "patrick@reactjsrwanda.com", title: "Frontend Specialist", bio: "Design systems and UI engineering. Passionate about Kinyarwanda typography.", stack: ["React JS", "Tailwind CSS", "Framer Motion"], availability: "OPEN_TO_PROJECT", contributionPoints: 1500 },
  { name: "Angelique Keza", username: "KEZA_MOBILE", email: "angelique@reactjsrwanda.com", title: "React Native Expert", bio: "Built three production apps used by 100k+ Rwandans.", stack: ["React Native", "Expo", "Firebase"], availability: "NOT_LOOKING", contributionPoints: 2100 },
  { name: "Jean-Claude Nyongabo", username: "JC_LEAD", email: "jc@reactjsrwanda.com", title: "Lead Architect", bio: "Building Rwanda's next-gen civic tech stack. React + Go.", stack: ["React JS", "Go", "PostgreSQL"], availability: "MENTORING", role: "ADMIN", contributionPoints: 3100, githubUrl: "https://github.com/jc-lead" },
  { name: "Aimé Mugisha", username: "AIME_ARCH", email: "aime@reactjsrwanda.com", title: "Infrastructure Engineer", bio: "Local infra & deployment patterns for African markets.", stack: ["Next.js", "Docker", "Kubernetes"], availability: "OPEN_TO_PROJECT", contributionPoints: 1900 },
  { name: "Marie Uwase", username: "MARIE_U", email: "marie@reactjsrwanda.com", title: "Product Engineer", bio: "Shipping at the intersection of design and code.", stack: ["React JS", "TypeScript", "GraphQL"], availability: "OPEN_TO_WORK", contributionPoints: 1300 },
  { name: "David Ndayisaba", username: "DAVID_NDR", email: "david@reactjsrwanda.com", title: "DevOps Engineer", bio: "CI/CD, observability, and SRE for fast-moving teams.", stack: ["Next.js", "Terraform", "AWS"], availability: "NOT_LOOKING", contributionPoints: 1100 },
  { name: "Yvette Ingabire", username: "YVETTE_DEV", email: "yvette@reactjsrwanda.com", title: "Software Engineer", bio: "React Native + fintech. Building inclusive financial tooling.", stack: ["React Native", "TypeScript", "Tailwind CSS"], availability: "OPEN_TO_PROJECT", contributionPoints: 850 },
  { name: "Eric Kayitare", username: "ERIC_K", email: "eric@reactjsrwanda.com", title: "Backend Developer", bio: "API design, Postgres performance, and event-driven architectures.", stack: ["Node.js", "PostgreSQL", "Redis"], availability: "MENTORING", contributionPoints: 1450 },
  { name: "Sandrine Mukamana", username: "SANDRINE_M", email: "sandrine@reactjsrwanda.com", title: "UI Engineer", bio: "Animations, accessibility, and component libraries.", stack: ["React JS", "Framer Motion", "Storybook"], availability: "OPEN_TO_WORK", contributionPoints: 720 },
  { name: "Pacifique Nshimiyimana", username: "PACIFIQUE_N", email: "pacifique@reactjsrwanda.com", title: "Full Stack Engineer", bio: "Building B2B SaaS for Rwandan startups.", stack: ["Next.js", "Prisma", "tRPC"], availability: "OPEN_TO_PROJECT", contributionPoints: 1620 },
  { name: "Alice Mutoni", username: "ALICE_MUT", email: "alice@reactjsrwanda.com", title: "Mobile Engineer", bio: "Mobile money integrations and offline-first UX.", stack: ["React Native", "Expo", "TypeScript"], availability: "MENTORING", contributionPoints: 980 },
  { name: "Bruno Karenzi", username: "BRUNO_K", email: "bruno@reactjsrwanda.com", title: "React Engineer", bio: "Component-driven development and design tokens.", stack: ["React JS", "Tailwind CSS", "TypeScript"], availability: "OPEN_TO_WORK", contributionPoints: 540 },
  { name: "Claudine Iradukunda", username: "CLAUDINE_I", email: "claudine@reactjsrwanda.com", title: "Tech Lead", bio: "Leading a team of 8 across the FinTech & EduTech verticals.", stack: ["Next.js", "Node.js", "PostgreSQL"], availability: "NOT_LOOKING", contributionPoints: 2200 },
  { name: "Olivier Habineza", username: "OLIVIER_H", email: "olivier@reactjsrwanda.com", title: "Junior Developer", bio: "First-year out of ALU. Building my first open-source project.", stack: ["React JS", "JavaScript", "HTML/CSS"], availability: "OPEN_TO_WORK", contributionPoints: 240 },
  { name: "Grace Niyibizi", username: "GRACE_N", email: "grace@reactjsrwanda.com", title: "Senior Developer", bio: "React + accessibility advocate. WCAG 2.2 nerd.", stack: ["React JS", "TypeScript", "Testing Library"], availability: "MENTORING", contributionPoints: 1740 },
  { name: "Samuel Bizimana", username: "SAM_BIZ", email: "samuel@reactjsrwanda.com", title: "Engineering Manager", bio: "Helping engineers grow. Ex-Andela, ex-Tunga.", stack: ["React JS", "Node.js", "GraphQL"], availability: "MENTORING", role: "ADMIN", contributionPoints: 2850 },
  { name: "Christine Uwimana", username: "CHRIS_UW", email: "christine@reactjsrwanda.com", title: "Frontend Developer", bio: "Currently obsessed with React Server Components.", stack: ["Next.js", "React JS", "Tailwind CSS"], availability: "OPEN_TO_PROJECT", contributionPoints: 690 },
  { name: "Emmanuel Rugamba", username: "EMMA_R", email: "emmanuel@reactjsrwanda.com", title: "Solutions Architect", bio: "Architecting platforms for Rwandan financial institutions.", stack: ["Next.js", "PostgreSQL", "AWS"], availability: "NOT_LOOKING", contributionPoints: 2050 },
];

const STACK_OPTIONS = ["React JS", "React Native", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"];

const EVENTS = [
  { title: "Kigali React Night", description: "Join us for our signature monthly meetup. We'll be discussing the latest React 19 features, Concurrent Rendering in production, and local success stories from Rwandan startups.", date: daysFromNow(12), startTime: "10:00 AM", endTime: "01:00 PM", location: "Norrsken House Kigali, Townhall", type: "MEETUP" as const, isUpcoming: true },
  { title: "Advanced Tailwind & React Patterns", description: "A deep-dive session into building maintainable UI libraries with Radix UI and Tailwind CSS.", date: daysFromNow(20), startTime: "02:00 PM", endTime: "05:00 PM", location: "Online (Zoom)", type: "WORKSHOP" as const, isUpcoming: true },
  { title: "React JS Rwanda Networking Night", description: "Meet hiring managers, recruiters, and senior engineers from Rwanda's top tech companies.", date: daysFromNow(35), startTime: "06:00 PM", endTime: "09:00 PM", location: "Westerwelle Startup Haus Kigali", type: "NETWORKING" as const, isUpcoming: true },
  { title: "Server Components Masterclass", description: "A 45-minute workshop on React Server Components, streaming, and the data-fetching primitives.", date: daysAgo(8), startTime: "10:00 AM", endTime: "10:45 AM", location: "Online", type: "WORKSHOP" as const, isUpcoming: false },
  { title: "State Management in 2024", description: "A comparison of Zustand, Jotai, Redux Toolkit, and React Query for modern apps.", date: daysAgo(36), startTime: "02:00 PM", endTime: "03:00 PM", location: "Online", type: "WORKSHOP" as const, isUpcoming: false },
  { title: "React Native for Web", description: "Sharing UI code across iOS, Android, and Web. Use cases from Rwandan fintech.", date: daysAgo(78), startTime: "11:00 AM", endTime: "12:00 PM", location: "Online", type: "WORKSHOP" as const, isUpcoming: false },
  { title: "Next.js 15 Deep Dive", description: "Intensive 4-hour session on performance optimization for low-bandwidth environments.", date: daysAgo(110), startTime: "09:00 AM", endTime: "01:00 PM", location: "Norrsken House Kigali", type: "WORKSHOP" as const, isUpcoming: false },
  { title: "FinTech Builders Roundtable", description: "Roundtable with engineers from BK, Equity, and local mobile-money startups.", date: daysAgo(150), startTime: "04:00 PM", endTime: "06:30 PM", location: "Kigali Innovation City", type: "NETWORKING" as const, isUpcoming: false },
];

const PUBLICATIONS = [
  { title: "Deploying React apps on local infrastructure", summary: "Navigating the complexities of deploying modern single-page applications within Rwandan local server environments.", category: "INFRASTRUCTURE" as const, type: "GUIDE" as const, readTime: 15 },
  { title: "State management in 2024: Beyond Redux", summary: "A comparative analysis of Zustand, Jotai, and Signals in the context of large-scale Rwandan fintech applications.", category: "STATE_MANAGEMENT" as const, type: "ARTICLE" as const, readTime: 10 },
  { title: "React Server Components for Low-Bandwidth", summary: "How RSC can significantly improve the UX for users browsing from areas with intermittent connectivity.", category: "OPTIMIZATION" as const, type: "ARTICLE" as const, readTime: 8 },
  { title: "Bridging the Gap: React Native & Kinyarwanda", summary: "Localization strategies and font rendering challenges for local languages in cross-platform mobile apps.", category: "ECOSYSTEM" as const, type: "CASE_STUDY" as const, readTime: 12 },
  { title: "Testing React apps on shaky networks", summary: "Patterns, fixtures, and tooling to make tests representative of real Rwandan network conditions.", category: "TESTING" as const, type: "GUIDE" as const, readTime: 11 },
  { title: "Performance budgets for African markets", summary: "What 'fast' actually means when your median user is on a 3G Android device.", category: "PERFORMANCE" as const, type: "ARTICLE" as const, readTime: 7 },
  { title: "From Expo to Bare: a migration playbook", summary: "Why and how we ejected three production apps from Expo to bare React Native.", category: "REACT_NATIVE" as const, type: "CASE_STUDY" as const, readTime: 14 },
  { title: "Building a Kigali Real Estate Portal", summary: "Architecture deep-dive: Next.js + Leaflet + Prisma + R2 for a marketplace serving Kigali.", category: "INFRASTRUCTURE" as const, type: "CASE_STUDY" as const, readTime: 18 },
  { title: "React Query patterns for offline-first apps", summary: "Strategies for caching, sync, and retry in apps that often work without connectivity.", category: "STATE_MANAGEMENT" as const, type: "GUIDE" as const, readTime: 9 },
  { title: "Accessibility in low-resource environments", summary: "Designing for screen readers, low-bandwidth assistive tech, and Kinyarwanda voiceover.", category: "ECOSYSTEM" as const, type: "ARTICLE" as const, readTime: 6 },
  { title: "Edge caching with Cloudflare for African users", summary: "How to use Cloudflare's African PoPs to cut page load time by 60%.", category: "OPTIMIZATION" as const, type: "GUIDE" as const, readTime: 13 },
  { title: "End-to-end testing with Playwright in CI", summary: "A pragmatic playbook for E2E tests that don't flake.", category: "TESTING" as const, type: "GUIDE" as const, readTime: 10 },
];

const FORUM_POSTS = [
  { title: "Best way to handle complex state in Next.js 14 Server Actions?", body: "Hi all — I'm working with managing form state when using Server Actions across multiple form steps. Has anyone found a pattern that works well with parallel routes? Looking for real-world examples.", category: "TECHNICAL_HELP" as const, tags: ["server-actions", "state", "nextjs"] },
  { title: "Built a Kigali Real Estate portal using React Native and Mapbox", body: "Finally launched my passion project. Used Supabase for the backend, Mapbox for the maps, and Expo Router for navigation. Sharing the journey and lessons learned.", category: "SHOWCASE" as const, tags: ["showcase", "react-native", "mapbox"] },
  { title: "[Hiring] Senior React Developer at BK Tech House", body: "Looking for a developer with 4+ years of experience in React + TypeScript. Remote-friendly, Kigali-based team. Full-time.", category: "CAREER" as const, tags: ["hiring", "senior", "kigali"] },
  { title: "React JS Rwanda Meetup #12: Discussion & Recap", body: "Great turnout last Saturday! Here are the slides and code from the Server Components talk. Drop your questions below and I'll answer over the week.", category: "GENERAL" as const, tags: ["meetup", "recap"] },
  { title: "Open-sourcing our React component library for Kinyarwanda apps", body: "We've been building this in-house for two years. Today we open-source it. Feedback welcome.", category: "ANNOUNCEMENTS" as const, tags: ["open-source", "components", "kinyarwanda"] },
  { title: "How do you structure feature folders in large Next.js apps?", body: "I keep going back and forth between feature-first and route-first layouts. What's working for you in 50k+ LOC projects?", category: "TECHNICAL_HELP" as const, tags: ["architecture", "nextjs"] },
  { title: "Shipped: Rwanda Tax Calculator built with React Native", body: "Released our tax calculator app on the Play Store this week. ~3k downloads in 48h. Tech stack thread inside.", category: "SHOWCASE" as const, tags: ["showcase", "react-native", "play-store"] },
  { title: "[Hiring] Full-stack engineer (React + Go) — Norrsken Foundation", body: "Building social-impact products. Hybrid Kigali. Salary band shared on request.", category: "CAREER" as const, tags: ["hiring", "fullstack", "norrsken"] },
  { title: "Tailwind v4 — is anyone using it in production yet?", body: "The CSS-first config is a big shift. Curious if folks have migrated their full design tokens over yet.", category: "TECHNICAL_HELP" as const, tags: ["tailwind", "v4"] },
  { title: "Welcome to the React JS Rwanda community 👋", body: "If you're new here — read the CONTRIBUTING.md, join the Discord, and pick an issue from the backlog. We do meetups every first Saturday at Norrsken.", category: "ANNOUNCEMENTS" as const, tags: ["welcome", "rules"] },
  { title: "Showcase: Mobile money payment flow with Better Auth + Stripe", body: "Built an MoMo integration for an EdTech client. Surprisingly painless. Sharing the architecture diagram.", category: "SHOWCASE" as const, tags: ["showcase", "mobile-money", "better-auth"] },
  { title: "Anyone using DGateway for card + Mobile Money in one checkout?", body: "Trying to consolidate payment providers. DGateway looks promising. Any pitfalls?", category: "TECHNICAL_HELP" as const, tags: ["dgateway", "payments"] },
];

// ─── Seed runner ────────────────────────────────────────────────────────────

async function main() {
  console.log("→ Cleaning existing seed data...");
  await db.forumReply.deleteMany();
  await db.forumPost.deleteMany();
  await db.bookmark.deleteMany();
  await db.publication.deleteMany();
  await db.eventRegistration.deleteMany();
  await db.event.deleteMany();
  await db.newsletterSubscriber.deleteMany();
  await db.user.deleteMany();

  console.log(`→ Seeding ${MEMBERS.length} users...`);
  const userIds: string[] = [];
  for (const m of MEMBERS) {
    const user = await db.user.create({
      data: {
        name: m.name,
        username: m.username,
        email: m.email,
        emailVerified: true,
        image: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(m.name)}&backgroundColor=0a0a0a&textColor=ffffff`,
        bio: m.bio,
        title: m.title,
        stack: m.stack,
        availability: m.availability,
        role: m.role ?? "MEMBER",
        contributionPoints: m.contributionPoints,
        githubUrl: m.githubUrl,
        twitterUrl: m.twitterUrl,
      },
    });
    userIds.push(user.id);
  }
  const adminId = userIds[0];

  console.log(`→ Seeding ${EVENTS.length} events...`);
  const eventIds: string[] = [];
  for (const e of EVENTS) {
    const event = await db.event.create({
      data: {
        title: e.title,
        slug: slugify(e.title),
        description: e.description,
        date: e.date,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        type: e.type,
        coverImage: `https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=1200&q=80&auto=format&fit=crop`,
        isUpcoming: e.isUpcoming,
        authorId: adminId,
      },
    });
    eventIds.push(event.id);
  }

  console.log(`→ Seeding event registrations...`);
  for (const eventId of eventIds.slice(0, 3)) {
    for (const userId of userIds.slice(1, 8)) {
      await db.eventRegistration.create({ data: { eventId, userId } });
    }
  }

  console.log(`→ Seeding ${PUBLICATIONS.length} publications...`);
  const publicationIds: string[] = [];
  for (const [i, p] of PUBLICATIONS.entries()) {
    const status: "PENDING" | "PUBLISHED" | "REJECTED" = i < 9 ? "PUBLISHED" : i < 11 ? "PENDING" : "REJECTED";
    const pub = await db.publication.create({
      data: {
        title: p.title,
        slug: slugify(p.title),
        summary: p.summary,
        content: `# ${p.title}\n\n${p.summary}\n\n## Why this matters in Rwanda\n\nMost articles on this topic assume San-Francisco-grade bandwidth and US-based users. This guide is written from Kigali — with realistic constraints — and the code samples ship in apps used by tens of thousands of Rwandans every month.\n\n\`\`\`tsx\n// example pattern\nexport function MyComponent() {\n  return <div>Hello from Kigali 🇷🇼</div>;\n}\n\`\`\`\n\n## Takeaways\n\n- Optimize for the median, not the mean.\n- Treat connectivity as a first-class concern.\n- Localize early — Kinyarwanda fonts have rendering quirks worth knowing.`,
        category: p.category,
        type: p.type,
        readTime: p.readTime,
        coverImage: `https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop`,
        status,
        authorId: userIds[(i + 1) % userIds.length],
      },
    });
    publicationIds.push(pub.id);
  }

  console.log(`→ Seeding bookmarks...`);
  for (const userId of userIds.slice(0, 8)) {
    for (const publicationId of publicationIds.slice(0, 3)) {
      await db.bookmark.create({ data: { userId, publicationId } });
    }
  }

  console.log(`→ Seeding ${FORUM_POSTS.length} forum posts + replies...`);
  for (const [i, p] of FORUM_POSTS.entries()) {
    const post = await db.forumPost.create({
      data: {
        title: p.title,
        slug: `${slugify(p.title)}-${i}`,
        body: `${p.body}\n\n---\n\nIf you have thoughts, drop them below. Always happy to chat through code samples too.`,
        category: p.category,
        tags: p.tags,
        authorId: userIds[i % userIds.length],
        viewCount: 80 + i * 47,
        isPinned: i === 4 || i === 9,
      },
    });

    const replyCount = (i * 7 + 3) % 12;
    for (let r = 0; r < replyCount; r++) {
      await db.forumReply.create({
        data: {
          postId: post.id,
          authorId: userIds[(i + r + 1) % userIds.length],
          body: `Great question — what I'd suggest is starting from the constraint and working backwards. Happy to share more context.`,
        },
      });
    }
  }

  console.log(`→ Seeding newsletter subscribers...`);
  const subscribers = [
    "dev@example.rw",
    "hello@kigalireact.dev",
    "team@norrsken.org",
    "contact@reactjsrwanda.com",
    "info@aluschools.com",
  ];
  for (const email of subscribers) {
    await db.newsletterSubscriber.create({ data: { email } });
  }

  console.log("\n✓ Seed complete");
  console.log(`  • ${MEMBERS.length} users (1 admin)`);
  console.log(`  • ${EVENTS.length} events (3 upcoming, 5 past)`);
  console.log(`  • ${PUBLICATIONS.length} publications`);
  console.log(`  • ${FORUM_POSTS.length} forum posts + replies`);
  console.log(`  • ${subscribers.length} newsletter subscribers`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
