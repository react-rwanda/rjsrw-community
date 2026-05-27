// scripts/create-issues.ts
//
// Bulk-creates labels, milestones, and the 89 issues from project-phases.md
// on the GitHub repo. Idempotent: skips items that already exist by name/title.
//
// Prerequisites:
//   - `gh` CLI installed and authenticated (`gh auth status`)
//   - Run from inside a git repo with `origin` pointing at the target repo,
//     OR set the GH_REPO env var to "owner/name"
//
// Usage:
//   pnpm tsx scripts/create-issues.ts            # dry-run preview
//   pnpm tsx scripts/create-issues.ts --apply    # actually create everything
//
// Re-running with --apply is safe — labels/milestones/issues are deduped by
// name/title before being created.

import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// ─── Repo target ────────────────────────────────────────────────────────────

const REPO = process.env.GH_REPO ?? detectRepo();
const APPLY = process.argv.includes("--apply");
// Re-sync the body of every issue that already exists. Useful when issue
// descriptions are edited in this script and need to be pushed to GitHub.
const UPDATE_BODIES = process.argv.includes("--update-bodies");
// Auto-assign issues marked `completed: true` to this user (the founding
// contributor who shipped Phase 1). Override with COMPLETED_ASSIGNEE.
const COMPLETED_ASSIGNEE = process.env.COMPLETED_ASSIGNEE ?? "MUKE-coder";

function detectRepo(): string {
  try {
    const remote = execSync("git remote get-url origin", { encoding: "utf8" }).trim();
    // Handles https://github.com/<owner>/<name>.git and git@github.com:<owner>/<name>.git
    const m = remote.match(/github\.com[/:]([^/]+)\/([^/.]+)(\.git)?$/);
    if (!m) throw new Error(`Could not parse remote ${remote}`);
    return `${m[1]}/${m[2]}`;
  } catch (e) {
    console.error("✗ Could not detect repo. Set GH_REPO=owner/name or run inside a git repo.");
    throw e;
  }
}

// ─── Shell helpers ──────────────────────────────────────────────────────────

function sh(cmd: string): string {
  return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function shJSON<T = unknown>(cmd: string): T {
  return JSON.parse(sh(cmd));
}

function shTry(cmd: string): { ok: true; out: string } | { ok: false; err: string } {
  try {
    return { ok: true, out: sh(cmd) };
  } catch (e) {
    return { ok: false, err: (e as Error).message };
  }
}

function dryOrApply(label: string, cmd: string) {
  if (!APPLY) {
    console.log(`  [dry] ${label}`);
    return null;
  }
  return sh(cmd);
}

// ─── Labels ─────────────────────────────────────────────────────────────────

interface LabelDef {
  name: string;
  color: string;
  description: string;
}

const LABELS: LabelDef[] = [
  // status
  { name: "status: open", color: "1DB8C3", description: "Available to pick up" },
  { name: "status: in-progress", color: "FBCA04", description: "Someone is working on it" },
  { name: "status: review", color: "0E8A16", description: "PR submitted, awaiting review" },
  { name: "status: blocked", color: "B60205", description: "Waiting on another issue" },
  // phase
  { name: "phase: 1", color: "1F1F1F", description: "v0.1 Foundation" },
  { name: "phase: 2", color: "2D2D2D", description: "v0.2 Public Pages" },
  { name: "phase: 3", color: "3D3D3D", description: "v0.3 File Uploads" },
  { name: "phase: 4", color: "4D4D4D", description: "v0.4 Email" },
  { name: "phase: 5", color: "5D5D5D", description: "v0.5 Admin Dashboard" },
  { name: "phase: 6", color: "6D6D6D", description: "v1.0 Launch" },
  // difficulty
  { name: "difficulty: starter", color: "C2E0C6", description: "Good first issue (< 2h)" },
  { name: "difficulty: medium", color: "FEF2C0", description: "2–8h of work" },
  { name: "difficulty: hard", color: "F9D0C4", description: "8h+ or deep domain knowledge" },
  // type
  { name: "type: feature", color: "0075CA", description: "New feature" },
  { name: "type: bug", color: "D73A4A", description: "Bug fix" },
  { name: "type: design", color: "D4C5F9", description: "UI / styling work" },
  { name: "type: docs", color: "0052CC", description: "Documentation" },
];

function ensureLabels() {
  console.log(`\n→ Ensuring ${LABELS.length} labels exist on ${REPO}...`);
  const existing = new Set(
    shJSON<{ name: string }[]>(`gh label list --repo ${REPO} --limit 200 --json name`).map(
      (l) => l.name,
    ),
  );

  for (const l of LABELS) {
    if (existing.has(l.name)) {
      console.log(`  ✓ exists: ${l.name}`);
      continue;
    }
    dryOrApply(
      `create label: ${l.name}`,
      `gh label create "${l.name}" --color "${l.color}" --description "${l.description}" --repo ${REPO}`,
    );
    if (APPLY) console.log(`  + created: ${l.name}`);
  }
}

// ─── Milestones ─────────────────────────────────────────────────────────────

interface MilestoneDef {
  title: string;
  description: string;
}

const MILESTONES: MilestoneDef[] = [
  { title: "v0.1 — Foundation", description: "Repo scaffold, design system, auth, dashboard shell" },
  { title: "v0.2 — Public Pages", description: "Landing, events hub, member directory, library, forum" },
  { title: "v0.3 — File Uploads", description: "Avatars + cover images via Cloudflare R2" },
  { title: "v0.4 — Email", description: "Welcome, event confirmations, newsletter via Resend" },
  { title: "v0.5 — Admin Dashboard", description: "Admin CRUD for events, members, publications, forum" },
  { title: "v1.0 — Launch", description: "Polish, responsive audit, deploy to Vercel" },
];

const milestoneNumbers = new Map<string, number>();

function ensureMilestones() {
  console.log(`\n→ Ensuring ${MILESTONES.length} milestones exist on ${REPO}...`);
  const existing = shJSON<{ number: number; title: string }[]>(
    `gh api "repos/${REPO}/milestones?state=all&per_page=100"`,
  );
  for (const m of existing) milestoneNumbers.set(m.title, m.number);

  for (const m of MILESTONES) {
    if (milestoneNumbers.has(m.title)) {
      console.log(`  ✓ exists: ${m.title}`);
      continue;
    }
    if (!APPLY) {
      console.log(`  [dry] create milestone: ${m.title}`);
      continue;
    }
    const out = sh(
      `gh api repos/${REPO}/milestones -f title="${m.title}" -f description="${m.description}"`,
    );
    const created = JSON.parse(out) as { number: number; title: string };
    milestoneNumbers.set(created.title, created.number);
    console.log(`  + created: ${created.title} (#${created.number})`);
  }
}

// ─── Issue definitions ──────────────────────────────────────────────────────

type Difficulty = "starter" | "medium" | "hard";
type IssueType = "feature" | "bug" | "design" | "docs";

interface IssueDef {
  number: number;
  phase: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  difficulty: Difficulty;
  type: IssueType;
  body: string;
  /** Issues already completed by the founding scaffold commit. Closed immediately. */
  completed?: boolean;
  /** Other ISSUE-NNN refs this depends on, formatted as numbers. */
  deps?: number[];
}

function dep(deps?: number[]): string {
  if (!deps || deps.length === 0) return "None.";
  return deps.map((n) => `Requires #${n} to be merged first.`).join(" ");
}

const ISSUES: IssueDef[] = [
  // ─── PHASE 1 — Foundation (all completed in the initial scaffold) ─────────
  {
    number: 1,
    phase: 1,
    title: "ISSUE-001 — Initialize Next.js 16 + shadcn/ui",
    difficulty: "starter",
    type: "feature",
    completed: true,
    body: `## Task

Initialize a Next.js 16 + shadcn/ui project at the repo root using:
\`\`\`bash
pnpm dlx shadcn@latest init --preset b0 --template next
\`\`\`
Do NOT pass \`--src-dir\`. Confirm \`tsconfig.json\` has \`"paths": { "@/*": ["./*"] }\`.

## Acceptance criteria

- [ ] Project root has \`app/\`, \`components/\`, \`lib/\`, \`public/\` (no \`src/\`)
- [ ] \`components.json\` is present
- [ ] \`pnpm build\` passes

## Dependencies

${dep()}`,
  },
  {
    number: 2,
    phase: 1,
    title: "ISSUE-002 — Install Form shadcn fallback",
    difficulty: "starter",
    type: "feature",
    completed: true,
    body: `## Task

Install the canonical shadcn Form primitive (the upstream registry no longer ships it):
\`\`\`bash
pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/form.json
\`\`\`
If the registry is unreachable, write \`components/ui/form.tsx\` manually — the canonical shadcn Form source (FormProvider wrapper + useFormField hook + the six FormItem/FormLabel/FormControl/FormDescription/FormMessage/FormField primitives wired through ARIA) lives in the founding scaffold commit.

## Acceptance criteria

- [ ] \`components/ui/form.tsx\` exists with Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage
- [ ] \`useFormField()\` hook is exported

## Dependencies

${dep([1])}`,
  },
  {
    number: 3,
    phase: 1,
    title: "ISSUE-003 — Standard directory structure with .gitkeep",
    difficulty: "starter",
    type: "feature",
    completed: true,
    body: `## Task

Create the full canonical directory tree from \`CONTRIBUTING.md\` §3. Commit empty \`.gitkeep\` files so git tracks the empty directories — this prevents contributors from creating ad-hoc folders.

## Acceptance criteria

- [ ] All directories listed in \`CONTRIBUTING.md\` §3 exist
- [ ] Each empty directory contains a \`.gitkeep\` (or a real file)
- [ ] \`pnpm build\` still passes

## Dependencies

${dep([1])}`,
  },
  {
    number: 4,
    phase: 1,
    title: "ISSUE-004 — Create .env.example and .env.local",
    difficulty: "starter",
    type: "feature",
    completed: true,
    body: `## Task

Create \`.env.example\` (committed) and \`.env.local\` (gitignored) with every env var the project needs. Each var must be commented with a description and where to get it.

Required keys: \`DATABASE_URL\`, \`UPSTASH_REDIS_URL\`, \`UPSTASH_REDIS_TOKEN\`, \`BETTER_AUTH_SECRET\`, \`BETTER_AUTH_URL\`, \`GITHUB_CLIENT_ID\`, \`GITHUB_CLIENT_SECRET\`, \`GOOGLE_CLIENT_ID\`, \`GOOGLE_CLIENT_SECRET\`, \`RESEND_API_KEY\`, \`RESEND_EMAIL_FROM\`, \`CLOUDFLARE_R2_*\` (5 vars), \`NEXT_PUBLIC_APP_URL\`.

## Acceptance criteria

- [ ] \`.env.example\` is committed with empty values
- [ ] \`.env.local\` is gitignored
- [ ] Every var has a comment explaining what it's for

## Dependencies

${dep([3])}`,
  },
  {
    number: 5,
    phase: 1,
    title: "ISSUE-005 — Update .gitignore (env.local, node_modules, .next, out)",
    difficulty: "starter",
    type: "feature",
    completed: true,
    body: `## Task

Ensure \`.gitignore\` ignores: \`.env.local\`, \`.env.*.local\`, \`node_modules\`, \`.next\`, \`out\`, \`build\`, \`dist\`, \`lib/generated\` (Prisma output), \`.vercel\`.

## Acceptance criteria

- [ ] \`git status\` after \`pnpm install + pnpm db:generate\` shows zero new tracked files in those directories

## Dependencies

${dep()}`,
  },
  {
    number: 6,
    phase: 1,
    title: "ISSUE-006 — Set up Prisma v7 + Neon PostgreSQL",
    difficulty: "medium",
    type: "feature",
    completed: true,
    body: `## Task

Set up Prisma v7 with Neon Postgres following the **v7** pattern (NOT v6). Specifically:

- \`prisma/schema.prisma\` with \`generator client { provider = "prisma-client"; output = "../lib/generated/prisma" }\` and \`datasource db { provider = "postgresql" }\` (NO url in the datasource block)
- \`prisma.config.ts\` with \`dotenv\` loading \`.env.local\` and \`datasource: { url: env("DATABASE_URL") }\`
- \`lib/db.ts\` with the \`@prisma/adapter-pg\` driver adapter (singleton pattern)
- Package scripts: \`db:push\`, \`db:generate\`, \`db:studio\`, \`db:seed\`, \`db:reset\`, \`postinstall: prisma generate\`

## Acceptance criteria

- [ ] \`pnpm db:push\` connects to Neon and applies the schema
- [ ] \`pnpm db:generate\` outputs to \`lib/generated/prisma/\`
- [ ] Importing \`db\` from \`@/lib/db\` works in any route handler
- [ ] No \`@prisma/client\` import or \`url\` in datasource — those are v6 patterns

## Dependencies

${dep([4])}`,
  },
  {
    number: 7,
    phase: 1,
    title: "ISSUE-007 — Upstash Redis cache helpers",
    difficulty: "medium",
    type: "feature",
    completed: true,
    body: `## Task

Install \`@upstash/redis\` and create \`lib/cache.ts\` with two functions:

- \`getCachedOrFetch<T>(key, fn, ttlSeconds)\` — returns cached value if present, else calls \`fn\`, caches result, returns it
- \`invalidateTag(tag)\` — scans keys matching \`tag:<tag>:*\` and deletes them

Export a \`tags\` constant with all cache namespaces: \`feed\`, \`events\`, \`members\`, \`library\`, \`forum\`, \`dashboard\`.

## Acceptance criteria

- [ ] Both functions exist and are typed
- [ ] Gracefully no-ops or falls back when Upstash env vars are missing (so the app boots without Redis configured)

## Dependencies

${dep([4])}`,
  },
  {
    number: 8,
    phase: 1,
    title: "ISSUE-008 — Apply design-style-guide tokens to globals.css",
    difficulty: "medium",
    type: "design",
    completed: true,
    body: `## Task

Translate \`design-style-guide.md\` §13 into Tailwind v4 \`@theme\` directives inside \`app/globals.css\`. Include all color tokens (primary, neutrals, semantic), font tokens (\`--font-sans\`, \`--font-mono\`), shadow tokens, radius tokens (0px default, 4px for code, 9999px for avatars), and spacing base.

Add a global \`* { border-radius: 0 }\` reset with avatar + code-block exceptions.

## Acceptance criteria

- [ ] Tokens from \`design-style-guide.md\` §13 are present verbatim
- [ ] No \`tailwind.config.ts\` file exists (Tailwind v4 is CSS-only config)
- [ ] Sharp corners apply globally
- [ ] Avatars (via \`.avatar\` class or \`[data-slot="avatar"]\`) are pills
- [ ] \`prefers-reduced-motion\` is respected

## Dependencies

${dep([1])}`,
  },
  {
    number: 9,
    phase: 1,
    title: "ISSUE-009 — Root app/layout.tsx (Inter + JetBrains Mono + QueryProvider + Sonner)",
    difficulty: "starter",
    type: "feature",
    completed: true,
    body: `## Task

Build \`app/layout.tsx\` as the root layout. Load Inter and JetBrains Mono via \`next/font/google\` with \`display: "swap"\` and \`preload: true\` on Inter. Wrap children in a \`QueryProvider\` (React Query, 30s staleTime, refetchOnWindowFocus: false) and include a Sonner \`<Toaster position="bottom-right" />\`.

No \`ThemeProvider\` — dark mode is out of scope.

## Acceptance criteria

- [ ] Font CSS variables are applied on \`<html>\`
- [ ] \`QueryClientProvider\` wraps the tree
- [ ] Toaster is mounted
- [ ] \`<html lang="en" suppressHydrationWarning>\` (avoids spurious warnings from browser extensions)

## Dependencies

${dep([1, 8])}`,
  },
  {
    number: 10,
    phase: 1,
    title: "ISSUE-010 — Public Navbar component",
    difficulty: "medium",
    type: "feature",
    completed: true,
    body: `## Task

Build \`components/layout/navbar.tsx\` per \`design-style-guide.md\` §7.5. Default export, client component (\`usePathname()\` for active link).

- 64px tall, sticky, white bg, 1px \`#E5E5E5\` bottom border
- Logo "REACT JS RWANDA" (Inter 800, uppercase, 0.06em tracking)
- Center nav: NEWS · EVENTS · MEMBERS · LIBRARY · FORUM (13px, 500, uppercase, 0.08em tracking). Active item: \`#0A0A0A\` color + 2px cyan bottom underline.
- Right: 200px search input expanding to 280px on focus + black SIGN IN button (44px tall). When session is present, swap SIGN IN for an avatar dropdown (Profile, Dashboard if ADMIN, Sign out).
- Mobile (<lg): hamburger reveals full-screen overlay with all nav links + SIGN IN.

Render it in \`app/(public)/layout.tsx\` so it doesn't show on dashboard/auth routes.

## Acceptance criteria

- [ ] Matches screenshots/Heander and Hero.png on desktop
- [ ] Mobile overlay works (open + close + closes on route change)
- [ ] Body scroll locks while overlay is open
- [ ] No \`rounded-*\` classes anywhere

## Dependencies

${dep([8, 9])}`,
  },
  {
    number: 11,
    phase: 1,
    title: "ISSUE-011 — Public Footer component",
    difficulty: "starter",
    type: "feature",
    body: `## What to build

The public-site footer, shown at the bottom of every page inside \`(public)/\`. Single horizontal bar: copyright text on the left, nav links on the right (DOCUMENTATION · CODE OF CONDUCT · GITHUB · CONTRIBUTING · TWITTER).

## Files to create or change

- \`components/layout/footer.tsx\` — server component, default export
- \`app/(public)/layout.tsx\` — render \`<Footer />\` below \`{children}\`

## Specs

- \`design-style-guide.md\` §11 — last paragraph describes the footer
- \`screenshots/Community_3.png\` — visual reference (the footer at the bottom of the dark CTA section)

## Acceptance criteria

- [ ] Light variant: \`bg-neutral-0\` with a \`border-t border-neutral-200\`. Copyright reads \`© 2024 REACT JS RWANDA. BUILT FOR THE COMMUNITY BY DEVELOPERS.\` in 11px ALL CAPS \`text-neutral-400\` with 0.08em tracking.
- [ ] Nav links use the same 11px ALL CAPS \`text-neutral-400\` style, hover \`text-neutral-900\`. Spaced with \`gap-8\` on desktop.
- [ ] Responsive: stack vertically below \`sm\` breakpoint.
- [ ] All \`<a>\` tags have proper \`href\` (link to GitHub repo for GITHUB, \`/contributing\` for CONTRIBUTING, etc.).
- [ ] No \`rounded-*\` or \`shadow-*\` classes.

## Dependencies

${dep([10])}`,
  },
  {
    number: 12,
    phase: 1,
    title: "ISSUE-012 — Admin Sidebar layout component",
    difficulty: "medium",
    type: "feature",
    completed: true,
    body: `## Task

Build \`components/layout/admin-sidebar.tsx\` per \`design-style-guide.md\` §7.7. 260px wide, white bg, right border 1px \`#E5E5E5\`. Brand block at top, 5 nav items (Overview, Events, Members, Publications, Forum) with Lucide icons. Active item: \`bg-neutral-50\` + 2px cyan left border + \`text-neutral-900\`. User block + Sign Out at the bottom.

Mobile: hamburger top bar + slide-in 280px drawer with backdrop.

## Acceptance criteria

- [ ] Default export, client component
- [ ] Sign Out is wired to \`signOut()\` from \`lib/auth-client\`
- [ ] Body scroll locks while mobile drawer is open
- [ ] Drawer closes on route change

## Dependencies

${dep([8, 9])}`,
  },
  {
    number: 13,
    phase: 1,
    title: "ISSUE-013 — Admin Page Header component",
    difficulty: "starter",
    type: "feature",
    completed: true,
    body: `## Task

Build \`components/layout/page-header.tsx\`. Server component, default export.

Props: \`title: string\`, \`description?: string\`, \`actions?: React.ReactNode\`. Title is 32px weight 800 \`#0A0A0A\`. Description is 14px \`#737373\`. Actions slot is right-aligned. Bottom border 1px \`#E5E5E5\`, \`pb-6 mb-8\`.

## Acceptance criteria

- [ ] Used by all dashboard pages (\`/dashboard/*\`)
- [ ] \`actions\` slot renders inline buttons properly

## Dependencies

${dep([8])}`,
  },
  {
    number: 14,
    phase: 1,
    title: "ISSUE-014 — Install JB Better Auth UI (or write own)",
    difficulty: "medium",
    type: "feature",
    completed: true,
    body: `## Task

Either:

- Install the JB Better Auth UI registry: \`pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json\`, OR
- Write the auth UI ourselves with React Hook Form + Zod to match design-style-guide.md exactly (this is what the founding scaffold did, because the JB registry ships a competing Prisma schema).

## Acceptance criteria

- [ ] Auth pages render with our design tokens (0px radius, black uppercase buttons)
- [ ] Email/password + OAuth provider buttons present

## Dependencies

${dep([10])}`,
  },
  {
    number: 15,
    phase: 1,
    title: "ISSUE-015 — Configure Better Auth (email/password + GitHub + Google OAuth)",
    difficulty: "medium",
    type: "feature",
    completed: true,
    body: `## Task

Configure \`lib/auth.ts\` using \`better-auth\` + \`prismaAdapter\`. Enable:

- \`emailAndPassword\` with \`autoSignIn: true\` and \`minPasswordLength: 8\`
- \`socialProviders.github\` and \`socialProviders.google\` (auto-enabled if env vars present)
- \`additionalFields\` exposing our domain fields: \`username\`, \`role\`, \`title\`, \`bio\`, \`availability\`, \`githubUrl\`, \`twitterUrl\`, \`linkedinUrl\`, \`contributionPoints\`
- 7-day sessions with daily refresh

Add the catchall handler at \`app/api/auth/[...all]/route.ts\` via \`toNextJsHandler(auth)\`.

## Acceptance criteria

- [ ] \`getCurrentSession()\` returns the user with all additional fields
- [ ] Sign-in via email and GitHub both work end-to-end
- [ ] \`BETTER_AUTH_SECRET\` warning is silenced (env var set)

## Dependencies

${dep([6, 14])}`,
  },
  {
    number: 16,
    phase: 1,
    title: "ISSUE-016 — Login + Register + Profile setup pages",
    difficulty: "medium",
    type: "feature",
    completed: true,
    body: `## Task

Build the (auth) route group:

- \`app/(auth)/layout.tsx\` — centered card layout, header logo, neutral-50 background
- \`app/(auth)/login/page.tsx\` — email + password form + GitHub + Google buttons. "Don't have an account? Join →" link in cyan.
- \`app/(auth)/register/page.tsx\` — name + email + password form + OAuth buttons. After submit, redirect to \`/register/profile\`.
- \`app/(auth)/register/profile/page.tsx\` — React Hook Form + Zod. Fields: username (monospace, uppercase, live @preview), title, stack (multi-checkbox), availability (radio). Primary "COMPLETE PROFILE →" button.

Both password fields use the \`PasswordInput\` component with eye toggle.

## Acceptance criteria

- [ ] Sign-up via email lands on \`/register/profile\` with the new user signed in
- [ ] Profile setup writes username + title + stack + availability to the DB and redirects to \`/members/[username]\`
- [ ] Forms use shadcn Form + Zod resolver (no bare useState)

## Dependencies

${dep([15])}`,
  },
  {
    number: 17,
    phase: 1,
    title: "ISSUE-017 — Edge proxy for protected routes",
    difficulty: "medium",
    type: "feature",
    completed: true,
    body: `## Task

Create \`proxy.ts\` at the repo root (Next.js 16 renamed \`middleware.ts\` to \`proxy.ts\`). At the edge, check Better Auth's session cookie. Routes:

- \`/dashboard/*\` → must have a session (role check happens server-side in the dashboard layout)
- \`/profile/*\`, \`/forum/new\`, \`/library/submit\` → must have a session

If no session, redirect to \`/login?redirect=<pathname>\`.

Use \`getSessionCookie\` from \`better-auth/cookies\` for the edge-safe check.

## Acceptance criteria

- [ ] Unauthenticated requests to gated paths bounce to \`/login\`
- [ ] Public routes (\`/\`, \`/events\`, etc.) are unaffected
- [ ] Edge runtime — no DB access

## Dependencies

${dep([15])}`,
  },
  {
    number: 18,
    phase: 1,
    title: "ISSUE-018 — Custom not-found, error, loading pages",
    difficulty: "starter",
    type: "design",
    completed: true,
    body: `## Task

Build branded versions of:

- \`app/not-found.tsx\` — large "404" headline, ERROR 404 eyebrow in cyan, "Back to home" black button
- \`app/error.tsx\` — error UI with "Try again" button (\`reset\`)
- \`app/loading.tsx\` — skeleton grid matching the typical content shape

All match \`design-style-guide.md\` (Inter weight 800 headlines, sharp corners, cyan accent).

## Acceptance criteria

- [ ] Visit any unknown URL → custom 404 renders
- [ ] No bare Lucide icons in the empty state — design system reserves that for affordances

## Dependencies

${dep([8])}`,
  },
  {
    number: 19,
    phase: 1,
    title: "ISSUE-019 — Seed script with 50+ Rwandan-context records",
    difficulty: "medium",
    type: "feature",
    completed: true,
    body: `## Task

Write \`prisma/seed.ts\` that inserts 50+ realistic records covering Users (with 1 admin), Events (mix of upcoming + past), Publications (mix of statuses), ForumPosts + replies, NewsletterSubscribers. Use Rwandan names and Kigali-specific context.

Wire \`pnpm db:seed\` to \`tsx prisma/seed.ts\`. The script must load \`.env.local\` explicitly (tsx doesn't auto-load it) and use the same \`PrismaPg\` adapter pattern as \`lib/db.ts\`.

## Acceptance criteria

- [ ] \`pnpm db:seed\` completes successfully against a fresh DB
- [ ] 20+ users, 5+ events, 10+ publications, 10+ forum posts
- [ ] At least one user has \`role: "ADMIN"\`

## Dependencies

${dep([6])}`,
  },
  {
    number: 20,
    phase: 1,
    title: "ISSUE-020 — End-to-end verification of foundation",
    difficulty: "starter",
    type: "feature",
    completed: true,
    body: `## Task

Verify the foundation works end-to-end before considering Phase 1 done:

- Sign up by email → completes profile → lands on member profile
- Sign in by email → navbar swaps to avatar dropdown
- Sign in by GitHub OAuth (if credentials configured)
- Hit \`/dashboard\` while signed-out → redirects to \`/login\`
- Hit \`/dashboard\` while signed-in as MEMBER → redirects to \`/\`
- Hit \`/dashboard\` while signed-in as ADMIN → renders sidebar + stat cards
- Mobile (<lg): navbar hamburger overlay opens + closes
- \`pnpm build && pnpm lint\` both pass

## Acceptance criteria

- [ ] All bullets above verified manually with screenshots in the PR (or in a follow-up comment)

## Dependencies

${dep([10, 12, 15, 16, 17, 19])}`,
  },

  // ─── PHASE 2 — Public Pages ───────────────────────────────────────────────
  {
    number: 21,
    phase: 2,
    title: "ISSUE-021 — Finalize Prisma schema (8 models) and run migrations",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

The complete Prisma schema covering every model in \`project-description.md\` → "Data Model". The founding scaffold already ships the schema, but **this issue is the gate** for Phase 2 — any field change discovered while building public pages should land here first.

## Files to change

- \`prisma/schema.prisma\`
- run \`pnpm db:push && pnpm db:generate\`

## Specs

- \`project-description.md\` — "Data Model" section (lines 47–57)

## Acceptance criteria

- [ ] All 8 models present: User, Event, EventRegistration, Publication, Bookmark, ForumPost, ForumReply, NewsletterSubscriber
- [ ] All enums present: Role, Availability, EventType, PublicationCategory, PublicationType, PublicationStatus, ForumCategory
- [ ] Indexes on commonly-filtered columns (\`@@index([role])\`, \`@@index([category, createdAt])\`, etc.)
- [ ] \`pnpm db:push --accept-data-loss\` succeeds against a clean Neon DB
- [ ] \`pnpm db:seed\` still runs successfully

## Dependencies

${dep([6, 19])}`,
  },
  {
    number: 22,
    phase: 2,
    title: "ISSUE-022 — Landing Hero section",
    difficulty: "medium",
    type: "design",
    body: `## What to build

The hero section for \`/\`. Two-column split: left has a "LIVE FROM KIGALI, RWANDA" pill, an ultra-heavy headline with a cyan-highlighted "React" word, supporting copy, and dual CTAs; right has a bordered photograph with a small "component spotlight" overlay card.

## Files to create

- \`components/home/hero.tsx\` — server component, default export

## Specs

- \`design-style-guide.md\` §11 — Landing Page Specifics
- \`screenshots/Heander and Hero.png\`, \`Hero_2.png\`

## Acceptance criteria

- [ ] Pill badge "LIVE FROM KIGALI, RWANDA" with cyan dot prefix, ALL CAPS, 0.08em tracking
- [ ] Headline at 56px desktop / responsive down to ~32px mobile, Inter weight 900, tracking -0.03em, line-height 1.0
- [ ] "React" wraps in \`bg-neutral-950 text-primary-500 px-2\` and stays on one line (\`whitespace-nowrap\` if needed)
- [ ] Primary CTA "JOIN THE COMMUNITY" (black, 44px) + secondary "VIEW LOCAL PROJECTS" (outlined)
- [ ] Right column: bordered black-and-white photograph with a small component-spotlight overlay card
- [ ] Mobile: stack vertically
- [ ] No \`rounded-*\` or \`shadow-*\`

## Dependencies

${dep([8, 10])}`,
  },
  {
    number: 23,
    phase: 2,
    title: "ISSUE-023 — Community Stats bar",
    difficulty: "starter",
    type: "design",
    body: `## What to build

A 3-stat row directly below the hero: 1.2k+ DEVS IN KIGALI / 45 MONTHLY MEETUPS / 12 OPEN SOURCE PROJECTS. Bold numerals in Inter weight 800, ALL CAPS muted labels below, no dividers between stats.

## Files to create

- \`components/home/stats-bar.tsx\`

## Specs

- \`design-style-guide.md\` §11 — "Stats row"
- \`screenshots/Hero_2.png\`

## Acceptance criteria

- [ ] Numerals at ~40px Inter weight 800, \`text-neutral-900\`, \`tabular-nums\`
- [ ] Labels 11px ALL CAPS \`text-neutral-500\` with 0.08em tracking
- [ ] Stats pulled from real counts (or hardcoded for v1 — wire to API in a follow-up)
- [ ] Three columns on desktop, single column on mobile

## Dependencies

${dep([21])}`,
  },
  {
    number: 24,
    phase: 2,
    title: "ISSUE-024 — Community Feed section",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

The "Community Feed" 2-column card grid. First card is a 2× featured card; remaining cards are standard size. Each card has: category tag badges (EVENT, KIGALI, SHOWCASE, ANNOUNCEMENT, WORKSHOP — colors per design-style-guide.md §3), title, excerpt, horizontal rule, and author row at bottom with avatar + role + timestamp.

## Files to create

- \`components/home/community-feed.tsx\` — client component (React Query)
- \`app/api/feed/route.ts\` — GET, returns latest mix of events + publications + forum posts as a unified feed, cached via Redis

## Specs

- \`screenshots/Community Feed.png\`, \`Community_2.png\`
- \`design-style-guide.md\` §7.3 — Community Feed Card variant

## Acceptance criteria

- [ ] First card spans 2 columns and is visually emphasized
- [ ] Category tag uses the right color per \`design-style-guide.md\` "Community Feed Tag Colors" table
- [ ] "View Archive →" link in cyan on the section header
- [ ] Real data via \`GET /api/feed\` (cached 60s via \`getCachedOrFetch\`)
- [ ] Loading state uses skeleton (no spinners)

## Dependencies

${dep([21])}`,
  },
  {
    number: 25,
    phase: 2,
    title: "ISSUE-025 — Landing CTA banner",
    difficulty: "starter",
    type: "design",
    body: `## What to build

Full-width dark (\`#111111\`) section near the bottom of \`/\`. Bold white headline "Ready to build the Rwandan Digital Renaissance?", supporting copy in muted gray, dual buttons: JOIN DISCORD (cyan filled) + SPONSOR COMMUNITY (outlined). Right side has faded code snippet text as decorative background.

## Files to create

- \`components/home/cta-section.tsx\`

## Specs

- \`screenshots/Community_2.png\`, \`Community_3.png\`
- \`design-style-guide.md\` §11 — "CTA banner"

## Acceptance criteria

- [ ] \`bg-neutral-950\` (\`#111111\`)
- [ ] Headline at 40–48px Inter weight 800 in white
- [ ] Buttons match design system: accent cyan + outlined secondary
- [ ] Faded code snippet text decoration on the right column (just SVG or pre, opacity ~0.1)
- [ ] Mobile: stack, buttons full-width

## Dependencies

${dep([8])}`,
  },
  {
    number: 26,
    phase: 2,
    title: "ISSUE-026 — Compose landing page (app/(public)/page.tsx)",
    difficulty: "starter",
    type: "feature",
    body: `## What to build

Replace the placeholder at \`app/(public)/page.tsx\` with the composed landing page: Hero → Stats → Community Feed → CTA → (Footer comes from layout). Each section wrapped in \`<section>\` with appropriate vertical rhythm (\`py-20 sm:py-32\`).

## Files to change

- \`app/(public)/page.tsx\`

## Specs

- \`design-style-guide.md\` §11 — Landing Page Specifics
- All four section components must exist (depends on #022..025)

## Acceptance criteria

- [ ] All four sections render
- [ ] Vertical rhythm between sections is generous (\`py-20 sm:py-32\`)
- [ ] Server component (no \`"use client"\` at the page level)
- [ ] Lighthouse Performance ≥ 90 on first load

## Dependencies

${dep([22, 23, 24, 25])}`,
  },
  {
    number: 27,
    phase: 2,
    title: "ISSUE-027 — Events Hub header with filter tag pills",
    difficulty: "starter",
    type: "design",
    body: `## What to build

The page header of \`/events\`: title "Events Hub", description sentence, and a row of filter pill tags (Live Workshop · Community Night · Networking) below the description. Pills are clickable and filter the upcoming-meetups list.

## Files to create

- \`components/events/event-filter-tags.tsx\` — client component

## Specs

- \`screenshots/Events_1.png\`
- \`design-style-guide.md\` — color-coded category badges

## Acceptance criteria

- [ ] Filter state in URL params (\`?type=WORKSHOP\`)
- [ ] Selected pill: filled in its category color (green/yellow/blue)
- [ ] Unselected pill: outlined, hover state changes border

## Dependencies

${dep([21])}`,
  },
  {
    number: 28,
    phase: 2,
    title: "ISSUE-028 — Featured Upcoming Event card",
    difficulty: "medium",
    type: "design",
    body: `## What to build

The big featured upcoming-event card on \`/events\`. Layout: large cover image with a dark date stamp overlay top-left, title in UPPERCASE below image, MapPin icon + location, description, attendee avatar stack with \`+42\` cyan pill + "DEVELOPERS ATTENDING" label, sidebar mini-card with calendar/clock icons + REGISTER SEAT black button.

## Files to create

- \`components/events/featured-event-card.tsx\`

## Specs

- \`screenshots/events_2.png\`, \`event_3.png\`
- \`design-style-guide.md\` §10 — "Event cover images"

## Acceptance criteria

- [ ] Date stamp overlay uses \`bg-neutral-950/80\` + white \`font-mono\` text
- [ ] Attendee avatars are 32×32 grayscale, overlapping with \`-ml-2\`
- [ ] "+42" pill is filled cyan, font-bold
- [ ] Mobile: stack the sidebar card below the main content

## Dependencies

${dep([21])}`,
  },
  {
    number: 29,
    phase: 2,
    title: "ISSUE-029 — Past Workshops grid card",
    difficulty: "starter",
    type: "design",
    body: `## What to build

The dark card for past workshops. Top half is \`#111111\` containing "SESSION #N" label in cyan + the title in white. Bottom half is white with date + duration on a single line, then two outlined buttons SLIDES + VIDEO each with a small play/slides icon.

## Files to create

- \`components/events/past-workshop-card.tsx\`

## Specs

- \`screenshots/events_4.png\`

## Acceptance criteria

- [ ] "SESSION #N" label is monospace, cyan, ALL CAPS
- [ ] Title is white, weight 700, 24px
- [ ] Date is monospace 12px in neutral-500
- [ ] Buttons are equal width, gap-2
- [ ] No \`rounded-*\` anywhere

## Dependencies

${dep([21])}`,
  },
  {
    number: 30,
    phase: 2,
    title: "ISSUE-030 — Events Hub page with Suspense + Redis cache",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/(public)/events/page.tsx\` composing the header (#027), upcoming meetups (#028), and past workshops grid (#029). Wire \`GET /api/events?upcoming=true|false&type=...&page=...\` with server-side pagination + Redis cache.

## Files to create

- \`app/(public)/events/page.tsx\`
- \`app/api/events/route.ts\`

## Specs

- \`CONTRIBUTING.md\` §8 — API route + pagination patterns. Every list API route must return \`{ data, total, page, limit, totalPages }\` with server-side filtering.
- \`screenshots/Events_1.png\`

## Acceptance criteria

- [ ] API returns \`{ data, total, page, limit, totalPages }\`
- [ ] Redis cache key includes filters (\`tag:events:upcoming:WORKSHOP:1\`)
- [ ] Suspense boundary around the upcoming list and the past list independently

## Dependencies

${dep([27, 28, 29])}`,
  },
  {
    number: 31,
    phase: 2,
    title: "ISSUE-031 — Event detail page",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/(public)/events/[slug]/page.tsx\` — full event detail. Cover image, date stamp overlay, title, location with MapPin, full description (markdown), date/time, attendees avatar grid, REGISTER SEAT button (disabled if already registered or past), back link to \`/events\`.

## Files to create

- \`app/(public)/events/[slug]/page.tsx\` — server component
- \`app/api/events/[id]/route.ts\` — GET single event

## Specs

- \`project-description.md\` — Feature #5

## Acceptance criteria

- [ ] 404 if event not found
- [ ] Register button hidden if signed-out (show "Sign in to register" instead)
- [ ] Register button disabled if already registered (show "You're registered")
- [ ] Register button hidden if event is past

## Dependencies

${dep([30])}`,
  },
  {
    number: 32,
    phase: 2,
    title: "ISSUE-032 — POST /api/events/[id]/register",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

Route handler that creates an \`EventRegistration\` for the authenticated user + event. Returns 401 if no session, 409 if already registered, 410 if event is past. Invalidates the events cache on success.

## Files to create

- \`app/api/events/[id]/register/route.ts\`

## Specs

- \`CONTRIBUTING.md\` §8 — Route Handler patterns: every handler starts with \`requireSession()\` or \`requireRole()\` from \`lib/auth-guard.ts\`, validates input with Zod, and uses \`getCachedOrFetch\` / \`invalidateTag\` from \`lib/cache.ts\`.

## Acceptance criteria

- [ ] Uses \`requireSession()\` from \`lib/auth-guard\`
- [ ] Unique constraint \`(eventId, userId)\` handles double-registration cleanly
- [ ] \`invalidateTag('events')\` after success

## Dependencies

${dep([31])}`,
  },
  {
    number: 33,
    phase: 2,
    title: "ISSUE-033 — Member Directory page header",
    difficulty: "starter",
    type: "design",
    body: `## What to build

The header of \`/members\`: title "Member Directory", description, and two badges on the right showing ACTIVE count + VERIFIED count.

## Files to change

- \`app/(public)/members/page.tsx\` (header portion only — full page is #036)

## Specs

- \`screenshots/members_1.png\`

## Acceptance criteria

- [ ] Counts pulled from real DB (cached via Redis)
- [ ] Badges sit right of the title on desktop, stack on mobile

## Dependencies

${dep([21])}`,
  },
  {
    number: 34,
    phase: 2,
    title: "ISSUE-034 — Member filter sidebar",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

Left sidebar on \`/members\`. FILTER BY STACK checkboxes (React JS, React Native, Next.js, TypeScript). AVAILABILITY dropdown (Open to Work, Open to Project, Available for Mentoring, Not Currently Looking). CLEAR ALL FILTERS outlined button at the bottom.

All filter state lives in URL params (\`?stack=ReactJS,Nextjs&availability=OPEN_TO_WORK\`).

## Files to create

- \`components/members/filter-sidebar.tsx\` — client component

## Specs

- \`screenshots/members_1.png\`, \`members_2.png\`

## Acceptance criteria

- [ ] Checkbox states sync with URL on mount + on change
- [ ] Selected checkbox uses cyan (Checkbox component already styled)
- [ ] Selected dropdown option is highlighted
- [ ] CLEAR ALL FILTERS removes all params from URL

## Dependencies

${dep([21])}`,
  },
  {
    number: 35,
    phase: 2,
    title: "ISSUE-035 — Member Card component",
    difficulty: "medium",
    type: "design",
    body: `## What to build

The standard member card per \`design-style-guide.md\` §7.3. Grayscale 64×64 avatar (pill), name (bold), title, @handle in cyan monospace, terminal-icon button top-right, STACK tags (cyan outlined small badges), TOP CONTRIBUTIONS as monospace bullet list, footer row with status dot + ALL CAPS availability label (left) + VIEW FULL PROFILE cyan link (right).

## Files to create

- \`components/members/member-card.tsx\`

## Specs

- \`screenshots/members_2.png\`
- \`design-style-guide.md\` §7.3 "Member Card"

## Acceptance criteria

- [ ] Status dot color matches availability (green/blue/gray)
- [ ] Stack tags use \`border border-primary-500 text-primary-500\`, ALL CAPS, 11px
- [ ] Contributions list uses \`font-mono text-[13px] text-neutral-500\`
- [ ] Card is keyboard-focusable (whole card is a link wrap)

## Dependencies

${dep([21])}`,
  },
  {
    number: 36,
    phase: 2,
    title: "ISSUE-036 — Member Directory page with filtering + pagination",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/(public)/members/page.tsx\` composing the header (#033), filter sidebar (#034), and grid of member cards (#035). Server-side pagination (24 per page) with filter + page in URL params. Wire \`GET /api/members\` with Redis cache.

## Files to create

- \`app/(public)/members/page.tsx\`
- \`app/api/members/route.ts\`

## Specs

- \`CONTRIBUTING.md\` §8 — server-side pagination contract: API routes return \`{ data, total, page, limit, totalPages }\` with filters applied server-side.

## Acceptance criteria

- [ ] Filtering by stack uses Postgres array overlap operator
- [ ] Filtering by availability is a simple equality match
- [ ] Empty state when no results: illustration + "Adjust your filters" message
- [ ] Pagination shows numbered buttons (1, 2, 3) with active = black filled square

## Dependencies

${dep([33, 34, 35])}`,
  },
  {
    number: 37,
    phase: 2,
    title: "ISSUE-037 — Full Member Profile page",
    difficulty: "hard",
    type: "feature",
    body: `## What to build

\`app/(public)/members/[username]/page.tsx\` — full member profile (replaces the stub in the founding scaffold). Adds: bio, full stack, top contributions (real, pulled from publications + forum posts), forum activity (last 5 threads + replies), bookmarked articles, social links sidebar, registered events.

## Files to change

- \`app/(public)/members/[username]/page.tsx\`

## Specs

- \`project-description.md\` — Feature #7

## Acceptance criteria

- [ ] Real contributions list (not seeded strings) — derive from latest publications + forum posts authored by this user
- [ ] Bookmark count + most recent 5 bookmarks shown
- [ ] Forum activity shown as compact thread list
- [ ] Events: list of registered + authored events
- [ ] 404 if username doesn't exist

## Dependencies

${dep([36])}`,
  },
  {
    number: 38,
    phase: 2,
    title: "ISSUE-038 — Publications Library page header",
    difficulty: "starter",
    type: "design",
    body: `## What to build

Header of \`/library\`: title "Publications & Technical Library", description, and two badges on the right (RWANDA REGIONAL + REACT 19 READY).

## Specs

- \`screenshots/publications_1.png\`

## Acceptance criteria

- [ ] Badges use \`bg-neutral-100 text-neutral-700\` with ALL CAPS labels
- [ ] Responsive: badges wrap below title on mobile

## Dependencies

${dep([21])}`,
  },
  {
    number: 39,
    phase: 2,
    title: "ISSUE-039 — Library Category sidebar",
    difficulty: "medium",
    type: "design",
    body: `## What to build

Left sidebar on \`/library\`. CATEGORIES list with live counts per category (Infrastructure, State Management, Performance, Testing, React Native, Ecosystem). RESOURCE TYPE checkboxes (Guides, Articles, Case Studies). "Contribute" box at the bottom with SUBMIT ARTICLE outlined button.

Active category is bold cyan with the count displayed in a small badge.

## Files to create

- \`components/library/category-sidebar.tsx\`

## Specs

- \`screenshots/publications_2.png\`, \`publications_3.png\`

## Acceptance criteria

- [ ] Category counts are real (cached via Redis)
- [ ] SUBMIT ARTICLE button links to \`/library/submit\`
- [ ] Active category state in URL (\`?category=STATE_MANAGEMENT\`)

## Dependencies

${dep([21])}`,
  },
  {
    number: 40,
    phase: 2,
    title: "ISSUE-040 — Featured Article hero",
    difficulty: "medium",
    type: "design",
    body: `## What to build

A large featured article block at the top of \`/library\`. Cover image (grayscale) on the left, on the right: category + read time label in cyan, title bold large, excerpt, author row (avatar + name + role), and a right-arrow CTA.

## Files to create

- \`components/library/featured-article.tsx\`

## Specs

- \`screenshots/publications_2.png\`

## Acceptance criteria

- [ ] Cover image: \`filter: grayscale(100%)\`, aspect-ratio 4/3
- [ ] Layout flips on mobile (image above text)
- [ ] Whole card is a link to \`/library/[slug]\`

## Dependencies

${dep([21])}`,
  },
  {
    number: 41,
    phase: 2,
    title: "ISSUE-041 — Article Card",
    difficulty: "starter",
    type: "design",
    body: `## What to build

The standard article card on \`/library\`. Category label cyan (e.g. STATE MANAGEMENT) + read time (e.g. 10 MIN READ). Title bold. Excerpt 2-line clamp. Date at bottom. Bookmark icon top-right (cyan on hover / when bookmarked).

## Files to create

- \`components/library/article-card.tsx\`

## Specs

- \`screenshots/publications_3.png\`, \`publications_4.png\`

## Acceptance criteria

- [ ] 1px \`#E5E5E5\` border, no shadow
- [ ] Bookmark icon: filled cyan when bookmarked, outlined otherwise
- [ ] Bookmark toggle is an optimistic React Query mutation

## Dependencies

${dep([21])}`,
  },
  {
    number: 42,
    phase: 2,
    title: "ISSUE-042 — Newsletter subscribe widget",
    difficulty: "starter",
    type: "feature",
    body: `## What to build

Dark card on the right side of \`/library\` (replaces the last grid slot). "Sync your knowledge base" headline in white, subtitle in muted gray, email input (dark variant), full-width SUBSCRIBE cyan button.

## Files to create

- \`components/library/newsletter-widget.tsx\`
- \`app/api/newsletter/subscribe/route.ts\`

## Specs

- \`screenshots/publications_4.png\`
- \`design-style-guide.md\` §7.2 "Dark Input"

## Acceptance criteria

- [ ] Dark card: \`bg-neutral-950\`, input \`bg-neutral-900 text-neutral-100\`, placeholder \`dev@example.rw\`
- [ ] On submit: creates a NewsletterSubscriber, toast success, clears input
- [ ] Duplicate email returns 409 with a friendly message

## Dependencies

${dep([21])}`,
  },
  {
    number: 43,
    phase: 2,
    title: "ISSUE-043 — Library index page",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/(public)/library/page.tsx\` composing header + category sidebar + featured article + article grid + newsletter widget. Filter state in URL (\`?category=&type=&page=\`). Pagination at the bottom shows "01 / 14" style.

## Files to create

- \`app/(public)/library/page.tsx\`
- \`app/api/library/route.ts\`

## Specs

- \`screenshots/publications_4.png\` (pagination style at the bottom)

## Acceptance criteria

- [ ] Only PUBLISHED articles shown
- [ ] Server-side pagination, 12 per page
- [ ] Redis cache keyed by filter combination
- [ ] Pagination control uses chevron buttons + "NN / NN" indicator

## Dependencies

${dep([38, 39, 40, 41, 42])}`,
  },
  {
    number: 44,
    phase: 2,
    title: "ISSUE-044 — Article reading page (markdown render)",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/(public)/library/[slug]/page.tsx\` — full article reading experience. Header with category + read time + date. Author row. Body rendered from markdown using \`react-markdown\` + \`rehype-highlight\` (already in deps). Code blocks get the 4px radius exception. Bookmark toggle in the header.

## Files to create

- \`app/(public)/library/[slug]/page.tsx\`

## Specs

- \`project-description.md\` — Feature #9

## Acceptance criteria

- [ ] Headings, paragraphs, lists, code blocks all styled per design-style-guide.md typography rules
- [ ] Code blocks use \`bg-neutral-950 text-neutral-100 rounded-sm\` (the 4px exception)
- [ ] Reading time is shown ("12 MIN READ" cyan label)
- [ ] 404 if slug not found or status != PUBLISHED

## Dependencies

${dep([43])}`,
  },
  {
    number: 45,
    phase: 2,
    title: "ISSUE-045 — Article submission form",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/(public)/library/submit/page.tsx\` — gated form for members to submit articles for admin review. Fields: title, summary (textarea), category (select — searchable Combobox), type (radio), content (markdown textarea with preview tab), cover image (Phase 3 — for now just URL input). Submitting POSTs to \`/api/library/submit\` which creates a Publication with \`status: PENDING\`.

## Files to create

- \`app/(public)/library/submit/page.tsx\`
- \`app/api/library/submit/route.ts\`

## Specs

- \`CONTRIBUTING.md\` §8 — Forms always use React Hook Form + \`zodResolver\`. Long selects (>5 options) use a searchable Combobox, not plain \`<select>\`. Dates use the shadcn Calendar Popover, not \`<input type="date">\`.

## Acceptance criteria

- [ ] Members-only (proxy.ts already gates this)
- [ ] Zod validates: title (3–120 chars), summary (≥ 50 chars), content (≥ 200 chars)
- [ ] Success: toast + redirect to \`/library\`
- [ ] Edits to a draft: out of scope (separate issue)

## Dependencies

${dep([44])}`,
  },
  {
    number: 46,
    phase: 2,
    title: "ISSUE-046 — Forum three-column layout",
    difficulty: "medium",
    type: "design",
    body: `## What to build

\`app/(public)/forum/layout.tsx\` — three-column layout. Left: "Dev Console / FORUM NAVIGATION" header + small avatar + START DISCUSSION black button + category list with icons. Center: \`{children}\`. Right: leaderboard + trending tags + community stats widgets (#047..049).

Active category in the left nav: \`bg-neutral-50\` + 2px cyan left border + \`text-neutral-900\`.

## Files to create

- \`app/(public)/forum/layout.tsx\`

## Specs

- \`screenshots/forum_1.png\`

## Acceptance criteria

- [ ] Mobile: collapse to single column, left nav slides in from a top button
- [ ] START DISCUSSION button is hidden for unauthenticated users (or links to /login)

## Dependencies

${dep([21])}`,
  },
  {
    number: 47,
    phase: 2,
    title: "ISSUE-047 — Contribution Leaderboard widget",
    difficulty: "starter",
    type: "design",
    body: `## What to build

Dark card in the forum right sidebar. White "Contribution Leaderboard" title, numbered list (01, 02, 03 in monospace), each row: name + cyan points value. Top 5 users by \`contributionPoints\`.

## Files to create

- \`components/forum/leaderboard.tsx\`

## Specs

- \`screenshots/forum_1.png\`

## Acceptance criteria

- [ ] \`bg-neutral-950\` card, white text
- [ ] Points formatted with commas ("2.4k pts" or "2,400 pts")
- [ ] Server component, cached 5 minutes

## Dependencies

${dep([21])}`,
  },
  {
    number: 48,
    phase: 2,
    title: "ISSUE-048 — Trending Tags widget",
    difficulty: "starter",
    type: "design",
    body: `## What to build

Forum right sidebar widget. Title "Trending Tags". List of #HashTag links in cyan, each clickable to filter the forum by that tag.

## Files to create

- \`components/forum/trending-tags.tsx\`

## Specs

- \`screenshots/forum_1.png\`, \`forum_2.png\`

## Acceptance criteria

- [ ] Top 10 tags computed from ForumPost.tags
- [ ] Clicking a tag navigates to \`/forum?tag=#TagName\`

## Dependencies

${dep([21])}`,
  },
  {
    number: 49,
    phase: 2,
    title: "ISSUE-049 — Community Stats widget",
    difficulty: "starter",
    type: "design",
    body: `## What to build

Small forum sidebar card showing "COMMUNITY STATS" label + "Active Today" count.

## Files to create

- \`components/forum/community-stats.tsx\`

## Specs

- \`screenshots/forum_2.png\`

## Acceptance criteria

- [ ] "Active Today" = users with any post/reply in last 24h
- [ ] Server component, cached 1 minute

## Dependencies

${dep([21])}`,
  },
  {
    number: 50,
    phase: 2,
    title: "ISSUE-050 — Forum Thread Card",
    difficulty: "medium",
    type: "design",
    body: `## What to build

Standard thread card. Color-coded category badge top-left (per design-style-guide §3 Forum Category Tag Colors). "Posted Xh ago" timestamp. Title in bold. 2-line clamp excerpt. Right side: huge reply count (Inter weight 800, 32px, tabular-nums) + "REPLIES" label below. Participant avatar stack (3 overlapping, 28×28).

## Files to create

- \`components/forum/thread-card.tsx\`

## Specs

- \`screenshots/forum_1.png\`, \`forum_2.png\`

## Acceptance criteria

- [ ] Whole card is a link to the thread
- [ ] Pinned threads get a small pin icon next to the title

## Dependencies

${dep([21])}`,
  },
  {
    number: 51,
    phase: 2,
    title: "ISSUE-051 — Forum index page",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/(public)/forum/page.tsx\` — composed inside the forum 3-col layout. Center column has a Latest/Top sort toggle at the top, then the thread list. Pagination at the bottom with the "01 / 14" style.

## Files to create

- \`app/(public)/forum/page.tsx\`
- \`app/api/forum/posts/route.ts\` (GET — with pagination + sort + category filter)

## Specs

- \`screenshots/forum_1.png\`

## Acceptance criteria

- [ ] Latest = ORDER BY createdAt DESC; Top = ORDER BY replyCount DESC
- [ ] 10 per page
- [ ] Redis cached, invalidated on new post

## Dependencies

${dep([46, 47, 48, 49, 50])}`,
  },
  {
    number: 52,
    phase: 2,
    title: "ISSUE-052 — Forum Thread detail page",
    difficulty: "hard",
    type: "feature",
    body: `## What to build

\`app/(public)/forum/[category]/[slug]/page.tsx\` — full thread view. Original post (markdown rendered). Reply list (newest at top or bottom — pick newest-at-bottom). Reply composer at the bottom (members only, RHF + Zod, markdown textarea).

## Files to create

- \`app/(public)/forum/[category]/[slug]/page.tsx\`
- \`app/api/forum/posts/[id]/route.ts\` (GET single thread + replies)
- \`app/api/forum/posts/[id]/replies/route.ts\` (POST a reply)

## Specs

- \`project-description.md\` — Feature #12

## Acceptance criteria

- [ ] Markdown bodies render via react-markdown + rehype-highlight
- [ ] Posting a reply optimistically appends, then refetches on server response
- [ ] Reply composer disabled if not signed in (shows "Sign in to reply")
- [ ] Reply mutation increments author's contributionPoints by 5

## Dependencies

${dep([51])}`,
  },
  {
    number: 53,
    phase: 2,
    title: "ISSUE-053 — New Forum Thread form",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/(public)/forum/new/page.tsx\` — form to create a new thread. Fields: title, body (markdown textarea), category (searchable Combobox of the 5 categories), tags (tags input from JB Advanced Form Elements or custom).

## Files to create

- \`app/(public)/forum/new/page.tsx\`
- \`app/api/forum/posts/route.ts\` (POST already partly in #054)

## Specs

- \`CONTRIBUTING.md\` §8 — Forms use RHF + Zod. Tags input: see the JB Tags Input from the Advanced Form Elements registry, or roll a small custom input with Enter-to-add / Backspace-to-remove.

## Acceptance criteria

- [ ] Slug auto-generated from title (kebab-case + unique-ifier)
- [ ] Tags: up to 5, each up to 24 chars
- [ ] On success: toast + redirect to the new thread

## Dependencies

${dep([52])}`,
  },
  {
    number: 54,
    phase: 2,
    title: "ISSUE-054 — Forum API routes with Redis caching",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

All forum API routes follow the standard pattern from CONTRIBUTING.md §8:

- \`GET /api/forum/posts\` — list with filters + pagination + cache
- \`POST /api/forum/posts\` — create thread (already in #053)
- \`GET /api/forum/posts/[id]\` — single thread + replies
- \`POST /api/forum/posts/[id]/replies\` — create reply

All GETs use \`getCachedOrFetch\` with \`tag:forum:*\` keys. All POSTs call \`invalidateTag('forum')\`.

## Files to create / change

- \`app/api/forum/posts/route.ts\`
- \`app/api/forum/posts/[id]/route.ts\`
- \`app/api/forum/posts/[id]/replies/route.ts\`

## Specs

- \`CONTRIBUTING.md\` §8 — Route Handler patterns: \`requireSession()\` / \`requireRole()\` at the top, Zod input validation, \`getCachedOrFetch\` for reads, \`invalidateTag\` after mutations.

## Acceptance criteria

- [ ] All mutations use \`requireSession()\`
- [ ] Zod validates all POST bodies
- [ ] Cache invalidation tested manually (mutate → next GET returns fresh)

## Dependencies

${dep([51, 52, 53])}`,
  },
  {
    number: 55,
    phase: 2,
    title: "ISSUE-055 — Bookmark toggle for publication cards",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

Click the bookmark icon on any article card → toggle a Bookmark row for the current user. POST \`/api/library/[id]/bookmark\`. Optimistic update via React Query: bookmark icon fills cyan instantly. On error, rollback.

Incrementing the author's contributionPoints by 1 (and decrementing on un-bookmark) is part of this issue.

## Files to create

- \`app/api/library/[id]/bookmark/route.ts\` (POST = toggle)

## Specs

- \`project-description.md\` — Feature "Bookmark feature" (referenced in member profile)

## Acceptance criteria

- [ ] 401 for signed-out users (Bookmark icon shows "Sign in" tooltip)
- [ ] Toggle: if bookmark exists, delete; else create
- [ ] Author's contributionPoints adjusted atomically (transaction)

## Dependencies

${dep([41])}`,
  },

  // ─── PHASE 3 — File Uploads ──────────────────────────────────────────────
  {
    number: 56,
    phase: 3,
    title: "ISSUE-056 — Install JB File Storage UI",
    difficulty: "starter",
    type: "feature",
    body: `## Task

Install: \`pnpm dlx shadcn@latest add https://file-storage.desishub.com/r/file-storage.json\`. This adds a dropzone component and API helpers for R2.

## Acceptance criteria

- [ ] Components installed under \`components/file-storage/\` (or similar)
- [ ] No conflicts with our existing schema (the registry ships a File model — review and merge or skip)

## Dependencies

${dep([1])}`,
  },
  {
    number: 57,
    phase: 3,
    title: "ISSUE-057 — Configure Cloudflare R2 env vars",
    difficulty: "starter",
    type: "feature",
    body: `## Task

Add R2 vars to \`.env.example\` and \`.env.local\`: \`CLOUDFLARE_R2_ACCESS_KEY_ID\`, \`CLOUDFLARE_R2_SECRET_ACCESS_KEY\`, \`CLOUDFLARE_R2_ENDPOINT\`, \`CLOUDFLARE_R2_BUCKET_NAME\`, \`CLOUDFLARE_R2_PUBLIC_DEV_URL\`. Already in \`.env.example\` from the founding scaffold.

Set up the R2 bucket in Cloudflare dashboard, generate API tokens, and add the public dev URL.

## Acceptance criteria

- [ ] Bucket exists in Cloudflare
- [ ] CORS rules allow PUT/GET from your dev origin
- [ ] Env vars set locally and in Vercel dashboard

## Dependencies

${dep([4])}`,
  },
  {
    number: 58,
    phase: 3,
    title: "ISSUE-058 — POST /api/upload route",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/api/upload/route.ts\` — accepts a multipart form with an image, validates type (image/*) + size (≤ 4MB), uploads to R2 via the AWS SDK, returns the public URL.

## Acceptance criteria

- [ ] \`requireSession()\` (only authenticated users can upload)
- [ ] Validates Content-Type starts with \`image/\`
- [ ] Validates size ≤ 4 × 1024 × 1024
- [ ] Returns \`{ url: string }\`
- [ ] Returns 413 if too large, 415 if wrong type

## Dependencies

${dep([56, 57])}`,
  },
  {
    number: 59,
    phase: 3,
    title: "ISSUE-059 — Avatar upload on /profile/settings",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/profile/settings/page.tsx\` — edit profile form. Includes avatar upload (dropzone) that calls \`/api/upload\` and writes the returned URL to \`User.image\`.

## Acceptance criteria

- [ ] Dropzone or click-to-browse, single image
- [ ] Live preview before submit
- [ ] On save: PATCH /api/profile (already exists from #016), update local image
- [ ] Navbar avatar refreshes immediately (router.refresh)

## Dependencies

${dep([58])}`,
  },
  {
    number: 60,
    phase: 3,
    title: "ISSUE-060 — Cover image upload in admin Event form",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

Add cover image upload to the admin Event create/edit form (will be built fully in #072). The image upload component should be reusable across Event and Publication forms.

## Acceptance criteria

- [ ] Drop or click-to-upload, single image
- [ ] Preview shows the current cover image (if editing)
- [ ] Saves URL to \`Event.coverImage\`

## Dependencies

${dep([58, 72])}`,
  },
  {
    number: 61,
    phase: 3,
    title: "ISSUE-061 — Cover image upload in admin Publication form",
    difficulty: "starter",
    type: "feature",
    body: `## What to build

Reuse the image upload component from #060 in the Publication form. Same UX.

## Acceptance criteria

- [ ] Cover image upload works in the publication create/edit form
- [ ] Saves URL to \`Publication.coverImage\`

## Dependencies

${dep([58, 74])}`,
  },

  // ─── PHASE 4 — Email ──────────────────────────────────────────────────────
  {
    number: 62,
    phase: 4,
    title: "ISSUE-062 — Install Resend + React Email",
    difficulty: "starter",
    type: "feature",
    body: `## Task

\`pnpm add resend @react-email/components\`. Add a verified sender domain in Resend dashboard. Set \`RESEND_API_KEY\` and \`RESEND_EMAIL_FROM\` env vars.

## Acceptance criteria

- [ ] \`resend\` SDK importable
- [ ] Sender domain DKIM/SPF verified in Cloudflare DNS

## Dependencies

${dep([4])}`,
  },
  {
    number: 63,
    phase: 4,
    title: "ISSUE-063 — Welcome email template",
    difficulty: "medium",
    type: "design",
    body: `## What to build

\`emails/welcome.tsx\` — React Email template, sent on signup. Dark header with "REACT JS RWANDA" bold white, body welcoming the new member, cyan CTA button "Explore the community" linking to \`/\`, community stats (3 numbers), footer with social links.

## Specs

- \`design-style-guide.md\` §12 — Email template rules (max 600px, neutral-50 bg, system fonts)

## Acceptance criteria

- [ ] Renders in Gmail, Outlook, Apple Mail without breakage
- [ ] All inline styles, no Tailwind utility classes
- [ ] Cyan CTA contrast meets WCAG AA

## Dependencies

${dep([62])}`,
  },
  {
    number: 64,
    phase: 4,
    title: "ISSUE-064 — Event registration confirmation email",
    difficulty: "medium",
    type: "design",
    body: `## What to build

\`emails/event-registration.tsx\` — sent after a member registers for an event. Includes event title, date/time, location with map link, attendee count, "View event details" cyan CTA.

## Acceptance criteria

- [ ] Same design system as welcome email
- [ ] Calendar invite as .ics attachment is a nice-to-have for v2

## Dependencies

${dep([63])}`,
  },
  {
    number: 65,
    phase: 4,
    title: "ISSUE-065 — Monthly newsletter digest template",
    difficulty: "medium",
    type: "design",
    body: `## What to build

\`emails/newsletter-digest.tsx\` — template for the monthly digest pulling top 3 publications + top 3 upcoming events. Cron-scheduled in Phase 6.

## Acceptance criteria

- [ ] Dynamic data: top 3 publications by bookmark count this month, next 3 events
- [ ] Unsubscribe footer link

## Dependencies

${dep([63])}`,
  },
  {
    number: 66,
    phase: 4,
    title: "ISSUE-066 — Send welcome email on sign-up",
    difficulty: "starter",
    type: "feature",
    body: `## Task

Hook into Better Auth's \`after.signUp\` lifecycle (or run after the \`/api/profile\` PATCH that completes signup) to send the welcome email via Resend.

## Acceptance criteria

- [ ] Welcome email delivered within 30s of signup
- [ ] Failure to send doesn't block signup (fire-and-forget with error log)

## Dependencies

${dep([63])}`,
  },
  {
    number: 67,
    phase: 4,
    title: "ISSUE-067 — Send event registration confirmation",
    difficulty: "starter",
    type: "feature",
    body: `## Task

In \`POST /api/events/[id]/register\` (from #032), after creating the EventRegistration, send the confirmation email from #064.

## Acceptance criteria

- [ ] Email contains the correct event info
- [ ] Resend failure is logged but doesn't fail the API response

## Dependencies

${dep([32, 64])}`,
  },
  {
    number: 68,
    phase: 4,
    title: "ISSUE-068 — POST /api/newsletter/subscribe + confirmation email",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

Already partially built in #042. This issue extends it to send a confirmation email and handle unsubscribe tokens.

## Files to change

- \`app/api/newsletter/subscribe/route.ts\`
- \`emails/newsletter-confirm.tsx\` (new)

## Acceptance criteria

- [ ] Confirmation email sent on subscribe
- [ ] Unsubscribe link in every newsletter email works (decodes token, deletes subscriber)

## Dependencies

${dep([42, 62])}`,
  },

  // ─── PHASE 5 — Admin Dashboard ────────────────────────────────────────────
  {
    number: 69,
    phase: 5,
    title: "ISSUE-069 — Install JB Data Table",
    difficulty: "starter",
    type: "feature",
    body: `## Task

\`pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json\`. This adds a powerful table built on TanStack React Table with search, sort, pagination, column visibility, Excel + PDF export.

## Acceptance criteria

- [ ] Components installed
- [ ] No style conflicts (override rounded corners to 0px)

## Dependencies

${dep([1])}`,
  },
  {
    number: 70,
    phase: 5,
    title: "ISSUE-070 — Dashboard overview (extend stat cards + add quick actions)",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

The founding scaffold already has the 4 stat cards. This issue extends the dashboard home with quick-action buttons (New event, Review publications, Moderate forum) and a small "Recent activity" feed.

## Files to change

- \`app/dashboard/page.tsx\`

## Acceptance criteria

- [ ] Quick actions link to the relevant create/list pages
- [ ] Recent activity: 5 most recent events, publications, or forum posts (mixed)

## Dependencies

${dep([13])}`,
  },
  {
    number: 71,
    phase: 5,
    title: "ISSUE-071 — Admin Events data table",
    difficulty: "hard",
    type: "feature",
    body: `## What to build

\`app/dashboard/events/page.tsx\` — replaces the placeholder. Data table with columns: title, type, date, location, registered count, actions. Search + filter by type + filter by upcoming/past. Pagination. Excel + PDF export buttons.

## Files to change

- \`app/dashboard/events/page.tsx\`
- \`app/api/admin/events/route.ts\` (GET, POST)
- \`app/api/admin/events/[id]/route.ts\` (PATCH, DELETE)

## Specs

- \`design-style-guide.md\` §7.8 — Tables (Admin)

## Acceptance criteria

- [ ] All API routes use \`requireRole("ADMIN")\`
- [ ] Server-side pagination (10 per page default, configurable)
- [ ] Excel export uses \`xlsx\` (lazy-loaded via \`next/dynamic\`)
- [ ] PDF export uses \`@react-pdf/renderer\` (lazy-loaded)

## Dependencies

${dep([69])}`,
  },
  {
    number: 72,
    phase: 5,
    title: "ISSUE-072 — Admin Event create / edit forms",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/dashboard/events/new/page.tsx\` and \`app/dashboard/events/[id]/edit/page.tsx\`. Same form (RHF + Zod). Fields: title, slug (auto + editable), description, date (DatePicker), startTime + endTime (time inputs), location, type (radio cards), cover image (upload from #060), isUpcoming toggle.

## Acceptance criteria

- [ ] Slug auto-generated from title, editable, unique check
- [ ] Date uses shadcn Calendar (no native date input)
- [ ] On save: invalidates \`tag:events:*\` cache

## Dependencies

${dep([60, 71])}`,
  },
  {
    number: 73,
    phase: 5,
    title: "ISSUE-073 — Admin Members data table",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/dashboard/members/page.tsx\` — table of all users. Columns: avatar, name, username, email, role, stack (chips), joined date, actions. Search by name/email/username. Filter by role + availability. **Inline role update** via a dropdown in the role column.

## Files to change

- \`app/dashboard/members/page.tsx\`
- \`app/api/admin/members/route.ts\`
- \`app/api/admin/members/[id]/route.ts\` (PATCH for role updates)

## Acceptance criteria

- [ ] Cannot demote the last ADMIN (constraint enforced in API)
- [ ] Cannot delete users via this UI (separate flow with confirmation)

## Dependencies

${dep([69])}`,
  },
  {
    number: 74,
    phase: 5,
    title: "ISSUE-074 — Admin Publications review queue",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/dashboard/publications/page.tsx\` — table of all publications. Default filter: PENDING. Status filter dropdown (PENDING / PUBLISHED / REJECTED / All). Approve and Reject inline actions with a confirmation modal. View the full article in a side drawer.

## Files to change

- \`app/dashboard/publications/page.tsx\`
- \`app/api/admin/publications/route.ts\`
- \`app/api/admin/publications/[id]/route.ts\` (PATCH for status)

## Acceptance criteria

- [ ] AlertDialog confirmation before rejecting
- [ ] Approving sends a notification email to the author (if email phase done)
- [ ] Markdown preview in the side drawer

## Dependencies

${dep([45, 69])}`,
  },
  {
    number: 75,
    phase: 5,
    title: "ISSUE-075 — Admin Forum moderation table",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/dashboard/forum/page.tsx\` — table of all forum threads. Columns: title, category, author, reply count, created. Actions: pin/unpin, delete (AlertDialog confirm), open in new tab. Filter by category, search by title/body.

## Files to change

- \`app/dashboard/forum/page.tsx\`
- \`app/api/admin/forum/route.ts\`
- \`app/api/admin/forum/[id]/route.ts\`

## Acceptance criteria

- [ ] Pin toggle updates ForumPost.isPinned, invalidates forum cache
- [ ] Delete cascades to replies (already in schema onDelete: Cascade)

## Dependencies

${dep([54, 69])}`,
  },
  {
    number: 76,
    phase: 5,
    title: "ISSUE-076 — Wire all admin API routes with ADMIN role guard",
    difficulty: "medium",
    type: "feature",
    body: `## Task

Audit every \`/api/admin/*\` route. Each must call \`requireRole("ADMIN")\` from \`lib/auth-guard\` at the top. Each must validate inputs with Zod. Each must use the cached helpers + invalidate on mutation.

## Acceptance criteria

- [ ] No admin route can be hit without the ADMIN role
- [ ] All mutations invalidate the relevant cache tag

## Dependencies

${dep([71, 73, 74, 75])}`,
  },
  {
    number: 77,
    phase: 5,
    title: "ISSUE-077 — Redis cache invalidation on all admin mutations",
    difficulty: "starter",
    type: "feature",
    body: `## Task

Cross-cutting audit. Every POST/PATCH/DELETE in the admin API surface should end with \`await invalidateTag('<tag>')\` for the affected entity.

## Acceptance criteria

- [ ] Manual test: edit an event in admin → \`/events\` reflects change within seconds
- [ ] Same for publications, forum, members

## Dependencies

${dep([76])}`,
  },
  {
    number: 78,
    phase: 5,
    title: "ISSUE-078 — Profile settings page (members)",
    difficulty: "medium",
    type: "feature",
    body: `## What to build

\`app/profile/settings/page.tsx\` — authenticated members can edit their profile. Fields: name, bio (textarea), title, stack (multi-checkbox), availability (radio), social links (github / twitter / linkedin URLs), avatar upload.

## Files to change

- \`app/profile/settings/page.tsx\`
- \`app/api/profile/route.ts\` (extend the PATCH from #016)

## Acceptance criteria

- [ ] Authenticated members only (proxy.ts already gates this)
- [ ] Avatar upload via #058
- [ ] Save → toast + navbar avatar refresh

## Dependencies

${dep([59])}`,
  },

  // ─── PHASE 6 — Polish & Deploy ────────────────────────────────────────────
  {
    number: 79,
    phase: 6,
    title: "ISSUE-079 — Full responsive audit",
    difficulty: "medium",
    type: "bug",
    body: `## Task

Test every page at 320px, 375px, 414px (mobile), 768px (tablet), 1024px (small desktop), 1440px (wide). Fix all layout breaks. Aim for zero horizontal scroll on mobile.

## Acceptance criteria

- [ ] All pages render correctly at every breakpoint
- [ ] No horizontal scroll on mobile
- [ ] Touch targets ≥ 44×44px
- [ ] Screenshots posted to the PR for each fix

## Dependencies

${dep([55, 78])}`,
  },
  {
    number: 80,
    phase: 6,
    title: "ISSUE-080 — Loading skeletons for every async section",
    difficulty: "starter",
    type: "design",
    body: `## Task

Every Suspense fallback and React Query loading state should render a skeleton (no spinners). Define \`<SkeletonCard />\`, \`<SkeletonTable />\`, \`<SkeletonStatsGrid />\` once and reuse.

## Acceptance criteria

- [ ] No \`<Loader2 className="animate-spin" />\` outside of buttons
- [ ] Skeletons match the real layout (same heights, gaps, radii)

## Dependencies

${dep([26, 36, 43, 51])}`,
  },
  {
    number: 81,
    phase: 6,
    title: "ISSUE-081 — Empty states for every list page",
    difficulty: "starter",
    type: "design",
    body: `## Task

Empty states for: no upcoming events, no members match filters, no publications in category, empty forum category. Each needs an illustration (NOT a lonely Lucide icon), a headline, supporting copy, and a primary CTA.

## Acceptance criteria

- [ ] Each list page has a distinct empty state with appropriate copy
- [ ] No bare Lucide icons used as the only visual element

## Dependencies

${dep([30, 36, 43, 51])}`,
  },
  {
    number: 82,
    phase: 6,
    title: "ISSUE-082 — Global search via ⌘K command palette",
    difficulty: "hard",
    type: "feature",
    body: `## What to build

\`GET /api/search?q=<query>\` searches across events (title, description), publications (title, summary, content), and forum posts (title, body). Returns top 5 results per category. Render in a ⌘K command palette using shadcn \`<Command />\` (or install JB Command Palette).

## Acceptance criteria

- [ ] ⌘K / Ctrl-K opens from anywhere
- [ ] Results grouped by category with icons
- [ ] Keyboard navigation, Enter to navigate
- [ ] Debounced 300ms

## Dependencies

${dep([30, 43, 51])}`,
  },
  {
    number: 83,
    phase: 6,
    title: "ISSUE-083 — Framer Motion polish",
    difficulty: "medium",
    type: "design",
    body: `## What to build

- Page transitions between public routes (opacity fade, 250ms)
- Stats counter on landing animates up from 0 on viewport enter (800ms, ease-out)
- Card hover lifts subtly (\`hover:-translate-y-0.5\`)

Respect \`prefers-reduced-motion\` everywhere.

## Acceptance criteria

- [ ] Bundle stays under 35KB for Framer Motion (already accounted)
- [ ] No animations > 800ms
- [ ] Reduced-motion test: all animations should be instant

## Dependencies

${dep([23, 79])}`,
  },
  {
    number: 84,
    phase: 6,
    title: "ISSUE-084 — Pre-deploy code review",
    difficulty: "medium",
    type: "docs",
    body: `## Task

Run a manual review against \`pre-deploy-review.md\` (in the repo root). Address every Critical finding. Document findings + resolutions in the PR.

## Acceptance criteria

- [ ] Zero Critical findings open
- [ ] Major findings either resolved or tracked as a follow-up issue

## Dependencies

${dep([78])}`,
  },
  {
    number: 85,
    phase: 6,
    title: "ISSUE-085 — Bundle analysis + code splitting",
    difficulty: "medium",
    type: "feature",
    body: `## Task

Run \`ANALYZE=true pnpm build\`. Identify any route chunk > 100KB. Code-split with \`next/dynamic\` for known heavy imports: \`@react-pdf/renderer\`, \`xlsx\`, chart libraries, rich text editors.

## Acceptance criteria

- [ ] First Load JS < 100KB per public route
- [ ] LCP < 2.5s on a 3G Android emulator

## Dependencies

${dep([83])}`,
  },
  {
    number: 86,
    phase: 6,
    title: "ISSUE-086 — Set env vars in Vercel",
    difficulty: "starter",
    type: "docs",
    body: `## Task

In the Vercel project dashboard, set every var from \`.env.example\` with production values. Use Vercel's "Encrypted" secret type for everything sensitive.

## Acceptance criteria

- [ ] All env vars set for Production
- [ ] Preview deployments use the same vars (or staging variants)

## Dependencies

${dep()}`,
  },
  {
    number: 87,
    phase: 6,
    title: "ISSUE-087 — Deploy to Vercel + custom domain",
    difficulty: "medium",
    type: "feature",
    body: `## Task

Connect the GitHub repo to Vercel. Configure custom domain (e.g. \`reactjsrwanda.com\`) via Cloudflare DNS. Verify SSL.

## Acceptance criteria

- [ ] Production deploy succeeds
- [ ] Custom domain serves over HTTPS
- [ ] Cloudflare proxy on (orange cloud)

## Dependencies

${dep([86])}`,
  },
  {
    number: 88,
    phase: 6,
    title: "ISSUE-088 — Verify Resend sending domain in production",
    difficulty: "starter",
    type: "feature",
    body: `## Task

Add DKIM + SPF records to Cloudflare DNS for the Resend sending domain. Test welcome, event-confirmation, and newsletter emails — verify they land in inbox (not spam).

## Acceptance criteria

- [ ] DKIM and SPF verified green in Resend
- [ ] Test emails land in primary inbox (Gmail, Outlook, Apple Mail)

## Dependencies

${dep([66, 87])}`,
  },
  {
    number: 89,
    phase: 6,
    title: "ISSUE-089 — Run full production checklist",
    difficulty: "medium",
    type: "docs",
    body: `## Task

Go through the Production Checklist at the bottom of \`project-phases.md\`. Tick every item. File follow-up issues for anything that fails.

## Acceptance criteria

- [ ] All checklist items green
- [ ] v1.0 milestone closed

## Dependencies

${dep([87, 88])}`,
  },
];

// ─── Issue creation ────────────────────────────────────────────────────────

function ensureIssues() {
  console.log(`\n→ Ensuring ${ISSUES.length} issues exist on ${REPO}...`);
  // Fetch existing issues by title so we don't duplicate.
  const existing = shJSON<{ number: number; title: string; state: string }[]>(
    `gh issue list --repo ${REPO} --limit 500 --state all --json number,title,state`,
  );
  const existingByTitle = new Map(existing.map((i) => [i.title, i]));

  let created = 0;
  let skipped = 0;
  let closed = 0;

  for (const issue of ISSUES) {
    const milestoneTitle = MILESTONES[issue.phase - 1].title;
    const milestoneNumber = milestoneNumbers.get(milestoneTitle);
    const labels = [
      "status: open",
      `phase: ${issue.phase}`,
      `difficulty: ${issue.difficulty}`,
      `type: ${issue.type}`,
    ].join(",");

    const found = existingByTitle.get(issue.title);
    if (found) {
      console.log(`  ✓ exists: #${found.number} ${issue.title}`);
      skipped++;
      // If --update-bodies, re-sync the description from the source of truth.
      if (UPDATE_BODIES && APPLY) {
        const tmpPath = join(tmpdir(), `gh-issue-${issue.number}-update.md`);
        writeFileSync(tmpPath, issue.body, "utf8");
        try {
          sh(`gh issue edit ${found.number} --repo ${REPO} --body-file "${tmpPath}"`);
          console.log(`    ↳ body updated on #${found.number}`);
        } finally {
          try {
            unlinkSync(tmpPath);
          } catch {
            /* ignore */
          }
        }
      }
      // If marked completed: ensure assignee is set and the issue is closed.
      if (issue.completed && APPLY) {
        if (COMPLETED_ASSIGNEE) {
          shTry(
            `gh issue edit ${found.number} --repo ${REPO} --add-assignee ${COMPLETED_ASSIGNEE}`,
          );
        }
        if (found.state === "OPEN") {
          sh(
            `gh issue close ${found.number} --repo ${REPO} --comment "Already shipped in the initial foundation commit. Closing as part of the issue catalog seed."`,
          );
          closed++;
          console.log(`    ↳ closed #${found.number} (assignee: ${COMPLETED_ASSIGNEE})`);
        }
      }
      continue;
    }

    if (!APPLY) {
      console.log(`  [dry] create: ${issue.title} [${labels}] → ${milestoneTitle}`);
      continue;
    }

    const tmpPath = join(tmpdir(), `gh-issue-${issue.number}.md`);
    writeFileSync(tmpPath, issue.body, "utf8");

    try {
      const milestoneFlag = milestoneNumber ? `--milestone "${milestoneTitle}"` : "";
      const out = sh(
        `gh issue create --repo ${REPO} --title "${issue.title.replace(/"/g, '\\"')}" --body-file "${tmpPath}" --label "${labels}" ${milestoneFlag}`,
      );
      console.log(`  + ${out.trim()}`);
      created++;
      // The output is the URL; the trailing segment is the issue number.
      const numMatch = out.trim().match(/\/(\d+)$/);
      if (numMatch && issue.completed) {
        const n = Number(numMatch[1]);
        if (COMPLETED_ASSIGNEE) {
          shTry(
            `gh issue edit ${n} --repo ${REPO} --add-assignee ${COMPLETED_ASSIGNEE}`,
          );
        }
        sh(
          `gh issue close ${n} --repo ${REPO} --comment "Already shipped in the initial foundation commit (Phase 1 scaffold). Closing as part of the issue catalog seed — kept for traceability."`,
        );
        closed++;
        console.log(`    ↳ closed #${n} (assignee: ${COMPLETED_ASSIGNEE})`);
      }
    } finally {
      try {
        unlinkSync(tmpPath);
      } catch {
        /* ignore */
      }
    }
  }

  console.log(`\n  Summary: ${created} created, ${skipped} already existed, ${closed} closed.`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

console.log(`React JS Rwanda — Issue catalog`);
console.log(`Target repo: ${REPO}`);
console.log(`Mode: ${APPLY ? "APPLY (live changes)" : "DRY RUN (preview only)"}`);

ensureLabels();
ensureMilestones();
ensureIssues();

console.log(`\nDone.`);
if (!APPLY) {
  console.log(`\nRe-run with --apply to actually create everything:`);
  console.log(`  pnpm tsx scripts/create-issues.ts --apply`);
}