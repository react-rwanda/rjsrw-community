# React JS Rwanda — Build Phases

> **Open Source Note:** Every task in every phase maps 1:1 to a GitHub Issue. When setting up the repo, the maintainer should run the issue-creation script in `scripts/create-issues.sh` to bulk-create all issues with the correct labels and milestone assignments. Contributors pick up issues and submit PRs — see `CONTRIBUTING.md` for the full workflow.

---

## Phase 1 — Foundation
**Goal:** Repo scaffolded with standard file layout, design system applied, env files created, database connected, Redis cache configured, Better Auth working with GitHub OAuth, protected routes, and base layout components (navbar + footer + dashboard shell) committed so all future contributors have a stable base to branch from.

> **GitHub Milestone:** `v0.1 — Foundation`
> **Assignee:** First contributor / Repo maintainer

### Tasks
- [ ] **[ISSUE-001]** Initialize Next.js 16 + shadcn/ui: `pnpm dlx shadcn@latest init --preset b0 --template next`. Do NOT use `--src-dir`. Confirm `tsconfig` has `"paths": { "@/*": ["./*"] }`.
- [ ] **[ISSUE-002]** Install the Form shadcn fallback: `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/form.json`
- [ ] **[ISSUE-003]** Create the full standard directory structure (see `CONTRIBUTING.md` §3 for the exact layout). Commit empty `.gitkeep` files to preserve empty directories.
- [ ] **[ISSUE-004]** Create `.env.example` (committed) and `.env.local` (gitignored) with ALL env vars: `DATABASE_URL`, `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `RESEND_API_KEY`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`. Each var commented with description and where to get it.
- [ ] **[ISSUE-005]** Add `.env.local` to `.gitignore`. Add `node_modules`, `.next`, `out` as well.
- [ ] **[ISSUE-006]** Set up Prisma v7 with Neon PostgreSQL — schema.prisma, `lib/db.ts` client, `package.json` scripts: `db:push`, `db:generate`, `db:studio`, `db:seed`.
- [ ] **[ISSUE-007]** Set up Upstash Redis cache in `lib/cache.ts` with `getCachedOrFetch()` and `invalidateTag()` wrapper functions. Add `@upstash/redis` dependency.
- [ ] **[ISSUE-008]** Apply `design-style-guide.md` tokens to `app/globals.css` using Tailwind v4 CSS-first `@theme` directive. Add Inter font via `next/font/google`. No `tailwind.config.ts` — config is CSS-only.
- [ ] **[ISSUE-009]** Create root `app/layout.tsx` with correct font variable, `QueryClientProvider` (React Query), and Sonner `<Toaster />`. No ThemeProvider (dark mode is out of scope).
- [ ] **[ISSUE-010]** Build the public **Navbar** component (`components/layout/navbar.tsx`): logo "REACT JS RWANDA" bold uppercase, nav links (NEWS · EVENTS · MEMBERS · LIBRARY · FORUM) with active underline, search input, and SIGN IN black button. Fully responsive (mobile hamburger menu).
- [ ] **[ISSUE-011]** Build the public **Footer** component (`components/layout/footer.tsx`): copyright line left, nav links right (DOCUMENTATION · CODE OF CONDUCT · GITHUB · CONTRIBUTING · TWITTER).
- [ ] **[ISSUE-012]** Build the **Admin Sidebar** layout component (`components/layout/admin-sidebar.tsx`): collapsible, nav items for all dashboard sections, user section at bottom.
- [ ] **[ISSUE-013]** Build the **Admin Page Header** component (`components/layout/page-header.tsx`): breadcrumb + page title + actions slot.
- [ ] **[ISSUE-014]** Install JB Better Auth UI: `pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json`
- [ ] **[ISSUE-015]** Configure Better Auth in `lib/auth.ts` — email/password + GitHub OAuth provider. Set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` in env.
- [ ] **[ISSUE-016]** Create `/app/(auth)/login/page.tsx` and `/app/(auth)/register/page.tsx` using the installed Better Auth UI components. Do NOT overwrite root layout.
- [ ] **[ISSUE-017]** Create `middleware.ts` for edge-level protected route checks — `/dashboard/*` routes require ADMIN role, `/profile/*` and `/forum/new` and `/library/submit` require authenticated MEMBER.
- [ ] **[ISSUE-018]** Build custom `not-found.tsx`, `error.tsx`, and `loading.tsx` pages styled to match design system.
- [ ] **[ISSUE-019]** Write `prisma/seed.ts` with 50+ realistic Rwandan-context records covering Users, Events, Publications, ForumPosts, ForumReplies. Run: `pnpm db:seed`.
- [ ] **[ISSUE-020]** Verify: login, signup, GitHub OAuth, protected routes, navbar on mobile all work end-to-end.

### Dependencies
- Neon database created, `DATABASE_URL` in `.env.local`
- Upstash Redis database created, Redis env vars set
- GitHub OAuth app created, OAuth env vars set
- Resend account, `RESEND_API_KEY` set

---

## Phase 2 — Public Pages (Core Content)
**Goal:** All public-facing pages built and connected to real seeded data: Landing, Events Hub, Member Directory, Publications Library, Community Forum.

> **GitHub Milestone:** `v0.2 — Public Pages`

### Tasks

#### Landing Page
- [ ] **[ISSUE-021]** Define final Prisma schema for all models (User, Event, EventRegistration, Publication, Bookmark, ForumPost, ForumReply, NewsletterSubscriber). Run `pnpm db:push && pnpm db:generate`.
- [ ] **[ISSUE-022]** Build Landing Hero section (`components/home/hero.tsx`): "LIVE FROM KIGALI, RWANDA" pill badge, bold headline with cyan "React" highlight box, subtext, JOIN THE COMMUNITY + VIEW LOCAL PROJECTS buttons, hero image grid.
- [ ] **[ISSUE-023]** Build Community Stats bar (`components/home/stats-bar.tsx`): 3 stats (devs, meetups, open source projects) with bold numerals and muted labels.
- [ ] **[ISSUE-024]** Build Community Feed section (`components/home/community-feed.tsx`): 2-column card grid, category tag badges (EVENT, KIGALI, SHOWCASE, ANNOUNCEMENT, WORKSHOP), title, excerpt, author row with avatar + role, timestamp. "View Archive →" link.
- [ ] **[ISSUE-025]** Build CTA section (`components/home/cta-section.tsx`): dark (#111111) full-width banner, bold headline, JOIN DISCORD cyan button, SPONSOR COMMUNITY outline button.
- [ ] **[ISSUE-026]** Build `app/(public)/page.tsx` composing all home sections. Wire API route `GET /api/feed` with Redis cache.

#### Events Hub
- [ ] **[ISSUE-027]** Build Events Hub header with filter tag pills (Live Workshop · Community Night · Networking).
- [ ] **[ISSUE-028]** Build Featured Upcoming Event card (`components/events/featured-event-card.tsx`): large cover image, date stamp overlay, event title uppercase, location icon, description, attendee avatar stack + count, REGISTER SEAT black button, sidebar card with date/time detail.
- [ ] **[ISSUE-029]** Build Past Workshops grid (`components/events/past-workshop-card.tsx`): dark card, SESSION #N label in cyan, title, date, duration, SLIDES + VIDEO buttons (outlined).
- [ ] **[ISSUE-030]** Build `app/(public)/events/page.tsx` with Suspense boundaries. Wire `GET /api/events` with Redis cache + server-side pagination.
- [ ] **[ISSUE-031]** Build `app/(public)/events/[slug]/page.tsx` — Event detail: cover image, full description, date/time, location, attendee list (avatar grid), register button (disabled if already registered), back link.
- [ ] **[ISSUE-032]** Build `POST /api/events/[id]/register` route — authenticated members only, creates EventRegistration, invalidates events cache.

#### Member Directory
- [ ] **[ISSUE-033]** Build Member Directory page header with ACTIVE and VERIFIED count badges.
- [ ] **[ISSUE-034]** Build filter sidebar (`components/members/filter-sidebar.tsx`): FILTER BY STACK checkboxes (React JS, React Native, Next.js, TypeScript), AVAILABILITY dropdown (Open to Work, Open to Project, Available for Mentoring), CLEAR ALL FILTERS button.
- [ ] **[ISSUE-035]** Build Member Card (`components/members/member-card.tsx`): avatar (grayscale style), name bold, title, @handle in cyan, STACK tags (cyan outlined small badges), TOP CONTRIBUTIONS list (monospace font), availability status dot + label, VIEW FULL PROFILE link.
- [ ] **[ISSUE-036]** Build `app/(public)/members/page.tsx` with filter state in URL params. Wire `GET /api/members` with Redis cache + pagination.
- [ ] **[ISSUE-037]** Build `app/(public)/members/[username]/page.tsx` — Full member profile page with all fields, contribution history, forum activity.

#### Publications Library
- [ ] **[ISSUE-038]** Build Library page header with RWANDA REGIONAL + REACT 19 READY tag badges.
- [ ] **[ISSUE-039]** Build Category sidebar (`components/library/category-sidebar.tsx`): CATEGORIES list with counts (active = bold cyan), RESOURCE TYPE checkboxes (Guides, Articles, Case Studies), Contribute box with SUBMIT ARTICLE outlined button.
- [ ] **[ISSUE-040]** Build Featured Article layout (`components/library/featured-article.tsx`): large cover image (grayscale), category + read time label in cyan, title bold large, excerpt, author row with avatar/title, arrow CTA.
- [ ] **[ISSUE-041]** Build Article Card (`components/library/article-card.tsx`): category label cyan, read time, bold title, excerpt, date, bookmark icon (cyan on hover).
- [ ] **[ISSUE-042]** Build Newsletter subscribe widget (`components/library/newsletter-widget.tsx`): dark card, "Sync your knowledge base" headline, email input, SUBSCRIBE cyan button.
- [ ] **[ISSUE-043]** Build `app/(public)/library/page.tsx` with category + type filters in URL params. Wire `GET /api/library` with Redis cache.
- [ ] **[ISSUE-044]** Build `app/(public)/library/[slug]/page.tsx` — Full article reading page with markdown rendering (use `react-markdown` + `rehype-highlight`).
- [ ] **[ISSUE-045]** Build `app/(public)/library/submit/page.tsx` — Article submission form (members only, React Hook Form + Zod). Wire `POST /api/library/submit`.

#### Community Forum
- [ ] **[ISSUE-046]** Build Forum three-column layout (`app/(public)/forum/layout.tsx`): left nav (Dev Console / FORUM NAVIGATION + START DISCUSSION black button + category list with active left border indicator), center content, right sidebar.
- [ ] **[ISSUE-047]** Build Contribution Leaderboard widget (`components/forum/leaderboard.tsx`): dark card, numbered list, username + cyan points.
- [ ] **[ISSUE-048]** Build Trending Tags widget (`components/forum/trending-tags.tsx`): #HashTag links.
- [ ] **[ISSUE-049]** Build Community Stats widget (`components/forum/community-stats.tsx`): COMMUNITY STATS label, "Active Today" + count.
- [ ] **[ISSUE-050]** Build Thread Card (`components/forum/thread-card.tsx`): category badge (color-coded), "Posted Xh ago", title bold, excerpt, reply count (large bold), participant avatar stack.
- [ ] **[ISSUE-051]** Build `app/(public)/forum/page.tsx` with Latest / Top sort toggle. Wire `GET /api/forum/posts` with Redis cache + pagination (showing "01 / 14" style).
- [ ] **[ISSUE-052]** Build `app/(public)/forum/[category]/[slug]/page.tsx` — Full thread with post body (markdown), reply list, reply composer (members only, React Hook Form + Zod).
- [ ] **[ISSUE-053]** Build `app/(public)/forum/new/page.tsx` — New thread form (members only): title, body (markdown textarea), category select, tags input.
- [ ] **[ISSUE-054]** Wire all forum API routes: `GET /api/forum/posts`, `POST /api/forum/posts`, `GET /api/forum/posts/[id]`, `POST /api/forum/posts/[id]/replies`. All GET routes cached via Redis, all mutations invalidate cache.

#### Bookmark Feature
- [ ] **[ISSUE-055]** Build bookmark toggle for publication cards — `POST /api/library/[id]/bookmark` (authenticated). Optimistic update via React Query. Increment/decrement contributionPoints.

### Dependencies
- Phase 1 complete (auth + layout working)

---

## Phase 3 — File Uploads (Avatars & Cover Images)
**Goal:** Members can upload profile avatars; admins can upload event and publication cover images.

> **GitHub Milestone:** `v0.3 — File Uploads`

### Tasks
- [ ] **[ISSUE-056]** Install JB File Storage UI: `pnpm dlx shadcn@latest add https://file-storage.desishub.com/r/file-storage.json`
- [ ] **[ISSUE-057]** Configure Cloudflare R2 env vars: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`.
- [ ] **[ISSUE-058]** Build `POST /api/upload` route — handles file upload to R2, returns public URL. Validates file type (image/*), max 4MB.
- [ ] **[ISSUE-059]** Integrate avatar upload into `/profile/settings` page using JB File Storage UI.
- [ ] **[ISSUE-060]** Integrate cover image upload into admin Event create/edit form.
- [ ] **[ISSUE-061]** Integrate cover image upload into admin Publication create/edit form.

### Dependencies
- Phase 1 and 2 complete
- Cloudflare R2 bucket created

---

## Phase 4 — Email & Notifications
**Goal:** App communicates with users via transactional email.

> **GitHub Milestone:** `v0.4 — Email`

### Tasks
- [ ] **[ISSUE-062]** Install and configure Resend + React Email: `pnpm add resend @react-email/components`.
- [ ] **[ISSUE-063]** Build `emails/welcome.tsx` — React Email welcome template in brand style (dark header, cyan CTA button, community stats).
- [ ] **[ISSUE-064]** Build `emails/event-registration.tsx` — Confirmation email on event registration with event details.
- [ ] **[ISSUE-065]** Build `emails/newsletter-digest.tsx` — Monthly newsletter template pulling top publications and upcoming events.
- [ ] **[ISSUE-066]** Wire welcome email on `POST /api/auth/sign-up` completion via Resend.
- [ ] **[ISSUE-067]** Wire event registration confirmation email on `POST /api/events/[id]/register`.
- [ ] **[ISSUE-068]** Build `POST /api/newsletter/subscribe` route — validates email, saves NewsletterSubscriber, sends confirmation.

### Dependencies
- Phase 1 (auth) must be complete
- Resend account, verified sending domain

---

## Phase 5 — Admin Dashboard
**Goal:** Admin users have full CRUD management over all content with data tables, pagination, export, and analytics.

> **GitHub Milestone:** `v0.5 — Admin Dashboard`

### Tasks
- [ ] **[ISSUE-069]** Install JB Data Table: `pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json`
- [ ] **[ISSUE-070]** Build `app/dashboard/page.tsx` — Overview with 4 stat cards (total members, upcoming events, pending publications, active forum threads), quick-action buttons.
- [ ] **[ISSUE-071]** Build `app/dashboard/events/page.tsx` — Events data table (search, filter by type/upcoming, pagination, Excel + PDF export). Columns: title, type, date, location, registered count, actions.
- [ ] **[ISSUE-072]** Build `app/dashboard/events/new/page.tsx` and `/edit/[id]/page.tsx` — Event create/edit form (React Hook Form + Zod): title, slug, description, date, start/end time, location, type, cover image, isUpcoming toggle.
- [ ] **[ISSUE-073]** Build `app/dashboard/members/page.tsx` — Members data table (search, filter by role/stack/availability). Columns: avatar, name, username, email, role, stack, joined date, actions. Inline role update.
- [ ] **[ISSUE-074]** Build `app/dashboard/publications/page.tsx` — Publications data table with status filter (PENDING/PUBLISHED/REJECTED). Approve/Reject inline actions with confirmation modal.
- [ ] **[ISSUE-075]** Build `app/dashboard/forum/page.tsx` — Forum threads table with pin/delete/category filter actions.
- [ ] **[ISSUE-076]** Wire all admin API routes with ADMIN role guard: `GET/POST/PATCH/DELETE /api/admin/events`, `GET/PATCH /api/admin/members`, `GET/PATCH /api/admin/publications`, `GET/DELETE /api/admin/forum`.
- [ ] **[ISSUE-077]** Add Redis cache invalidation on all admin mutations.
- [ ] **[ISSUE-078]** Build `app/profile/settings/page.tsx` — Edit profile form for authenticated members (name, bio, title, stack multi-select, availability, social links, avatar upload).

### Dependencies
- Phases 1–3 complete

---

## Phase 6 — Polish & Deploy
**Goal:** App is production-ready, all pages responsive on mobile, zero critical bugs, deployed to Vercel.

> **GitHub Milestone:** `v1.0 — Launch`

### Tasks
- [ ] **[ISSUE-079]** Full responsive audit — test all pages on mobile (320px, 375px, 414px) and tablet (768px, 1024px). Fix all layout breaks.
- [ ] **[ISSUE-080]** Add loading skeletons for all data-fetching sections (feed, events list, members grid, library, forum threads).
- [ ] **[ISSUE-081]** Add empty states for all list pages (no events, no members found, no publications in category, empty forum).
- [ ] **[ISSUE-082]** Implement global search — `GET /api/search?q=` route searches across events, publications, and forum posts. Render results in a command palette (shadcn/ui `<Command />`).
- [ ] **[ISSUE-083]** Add Framer Motion page transition (fade) between public routes. Animate hero stats counter on load. Animate card hover states.
- [ ] **[ISSUE-084]** Run pre-deploy code review. Address all Critical findings.
- [ ] **[ISSUE-085]** Bundle analysis: `pnpm build && pnpm analyze`. Identify and code-split any heavy imports over 100kb using `next/dynamic`.
- [ ] **[ISSUE-086]** Set all environment variables in Vercel dashboard.
- [ ] **[ISSUE-087]** Deploy to Vercel. Configure custom domain via Cloudflare DNS. Verify SSL.
- [ ] **[ISSUE-088]** Verify Resend sending domain (DKIM/SPF records in Cloudflare). Test all transactional emails in production.
- [ ] **[ISSUE-089]** Run full production checklist (see below).

### Production Checklist
- [ ] All env vars set in Vercel
- [ ] Database migrations applied to production Neon instance
- [ ] Auth flows (email + GitHub OAuth) work on production URL
- [ ] Custom domain live with SSL
- [ ] R2 bucket CORS configured for production domain
- [ ] Emails land in inbox (not spam)
- [ ] File uploads work in production
- [ ] All admin CRUD operations work end-to-end
- [ ] Mobile responsive confirmed on real device
- [ ] 404 and error pages styled correctly
- [ ] GitHub repo is public with README, LICENSE (MIT), CONTRIBUTING.md
