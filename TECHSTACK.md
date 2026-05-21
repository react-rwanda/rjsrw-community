# React JS Rwanda — Approved Tech Stack

> This document defines the approved technology stack for the React JS Rwanda Community Platform. All contributors **must** use these tools and versions. Do not introduce new libraries without opening a Discussion issue and getting approval from two maintainers first.
>
> The goal is a consistent, maintainable codebase where every contributor can understand every other contributor's code.

---

## Core Framework

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Next.js** | 16.x | Full-stack React framework | App Router only. No Pages Router. No `--src-dir`. |
| **React** | 19.x | UI library | Included with Next.js 16 |
| **TypeScript** | 5.x | Type safety | Strict mode on. No `any` types. |
| **Node.js** | 20.x LTS | Runtime | Required for development |
| **pnpm** | 9.x | Package manager | **Use pnpm only. No npm or yarn.** |

---

## Database & ORM

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Neon PostgreSQL** | Latest | Production database | Serverless PostgreSQL |
| **Prisma** | 7.x | ORM + migrations | Use Prisma v7 patterns. See patterns below. |

### Prisma v7 Required Patterns

```ts
// ✅ lib/db.ts — singleton pattern
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

```prisma
// ✅ Prisma v7 schema — use @default(cuid()) for IDs
model User {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ...
}
```

---

## Caching

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Upstash Redis** | Latest | API-layer caching | Use `getCachedOrFetch()` wrapper only |
| **@upstash/redis** | Latest | Redis client | Serverless-compatible |

### Required Cache Patterns

All GET API routes must cache via Redis. All mutations must invalidate cache.

```ts
// ✅ lib/cache.ts — required wrappers
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 60 * 5 // 5 minutes default
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached) return cached;
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

export async function invalidateTag(tag: string): Promise<void> {
  const keys = await redis.keys(`${tag}:*`);
  if (keys.length > 0) await redis.del(...keys);
}
```

---

## Authentication

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Better Auth** | Latest | Auth system | Email+password + GitHub OAuth |
| **Better Auth UI (JB)** | Latest | Pre-built auth components | Install via JB registry |

```bash
# Install
pnpm add better-auth
pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json
```

---

## UI Components & Styling

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Tailwind CSS** | v4.x | Utility-first CSS | CSS-first config only. No `tailwind.config.ts`. Use `@theme` in `globals.css`. |
| **shadcn/ui** | Latest | Component primitives | Do not edit `components/ui/` manually. |
| **Lucide React** | Latest | Icons | Stroke width `1.5`. Standard sizes: 14/18/20/40px. |
| **Sonner** | Latest | Toast notifications | Bottom-right position. |

### Tailwind v4 Rule
Configuration goes in `app/globals.css` using `@theme` directive. There is no `tailwind.config.ts` in this project.

```css
/* ✅ Correct */
@theme {
  --color-primary-500: #1DB8C3;
}

/* ❌ Wrong — do not create tailwind.config.ts */
```

---

## Data Fetching (Client)

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **TanStack Query (React Query)** | v5.x | Client-side data fetching | **Never `useEffect` for data fetching.** |
| **Zod** | 3.x | Schema validation | All API inputs + form schemas |

### Required Data Fetching Pattern

```tsx
// ✅ Correct — React Query for client data
import { useQuery } from "@tanstack/react-query";

function EventsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["events", page],
    queryFn: () => fetch(`/api/events?page=${page}`).then(r => r.json()),
  });
  // ...
}

// ❌ Wrong — never useEffect for data
useEffect(() => {
  fetch("/api/events").then(r => r.json()).then(setEvents);
}, []);
```

Server Components can fetch directly without React Query.

---

## Forms

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **React Hook Form** | 7.x | Form state management | Always paired with Zod |
| **@hookform/resolvers** | Latest | Zod adapter for RHF | `zodResolver(schema)` |

---

## Animation

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Framer Motion** | 11.x | Animations | **Only** animation library. Do not add GSAP, Anime.js, etc. |

Use only for: page transitions, stat counter on viewport enter, subtle card enter animations. No bouncing, no rotation, no animations > 300ms.

---

## File Storage

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Cloudflare R2** | Latest | Object storage | Avatars, cover images |
| **JB File Storage UI** | Latest | Upload UI component | |

```bash
pnpm dlx shadcn@latest add https://file-storage.desishub.com/r/file-storage.json
```

---

## Email

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **Resend** | Latest | Transactional email delivery | |
| **React Email** | Latest | Email template builder | `@react-email/components` |

---

## Content Rendering

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **react-markdown** | Latest | Markdown rendering | For forum posts, articles |
| **rehype-highlight** | Latest | Code syntax highlighting | Paired with react-markdown |

---

## Admin Data Tables

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **JB Data Table** | Latest | Advanced data tables | Includes search, filter, sort, Excel+PDF export |

```bash
pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json
```

---

## Export

| Technology | Version | Purpose | Notes |
|-----------|---------|---------|-------|
| **xlsx** | Latest | Excel export | Used in admin data tables |
| **@react-pdf/renderer** | Latest | PDF export/generation | Never jsPDF |

---

## Deployment

| Technology | Purpose | Notes |
|-----------|---------|-------|
| **Vercel** | Hosting + CI/CD | Auto-deploys from `main` branch |
| **Cloudflare** | DNS + CDN | Custom domain, proxy to Vercel |
| **Neon** | Production database | Serverless PostgreSQL |
| **Upstash** | Production Redis | Serverless Redis |

---

## Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.x | Linting (Next.js config) |
| **Prettier** | 3.x | Code formatting |
| **tsx** | Latest | TypeScript script runner (for seed) |

### Required VS Code Extensions

Install these for the best development experience (`.vscode/extensions.json` in repo):
- `bradlc.vscode-tailwindcss` — Tailwind CSS IntelliSense
- `Prisma.prisma` — Prisma schema syntax highlighting
- `esbenp.prettier-vscode` — Prettier formatter
- `ms-vscode.vscode-typescript-next` — TypeScript language server
- `dbaeumer.vscode-eslint` — ESLint integration

---

## Explicitly Prohibited

The following are **not approved** for this project. Do not install them:

| Prohibited | Reason |
|-----------|--------|
| `npm` or `yarn` | Use pnpm only |
| `axios` | Use native `fetch` (Next.js optimizes it) |
| `redux` / `zustand` / `jotai` | React Query handles server state; React `useState` for local state |
| `styled-components` / `emotion` | Tailwind CSS only |
| `moment.js` | Use `date-fns` or native `Intl.DateTimeFormat` |
| `lodash` | Use native JS methods or small focused utilities |
| `jquery` | Never |
| `GSAP` / `anime.js` | Framer Motion only |
| `jsPDF` | @react-pdf/renderer only |
| `mysql` / `mongodb` | Neon PostgreSQL + Prisma only |
| `next-auth` | Better Auth only |
| `supabase` | Neon + Better Auth covers this |
| `firebase` | Not part of our stack |
| Any AI SDK | Out of scope for v1 |

---

## Proposing a New Library

If you need a library not in this list:

1. Open a **GitHub Discussion** titled `[Tech Proposal] library-name`
2. Explain: what problem it solves, why existing stack can't solve it, bundle size impact, license
3. Get 2 maintainer approvals
4. A maintainer will add it to this document
5. Only then can it be used in a PR

---

*This tech stack was chosen for developer familiarity, performance, and open-source sustainability. Every choice is deliberate.*
