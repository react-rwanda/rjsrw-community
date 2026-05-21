# Claude Code — First Contributor Build Prompt

> **This prompt is for the INITIAL CONTRIBUTOR only.** Your sole job is to create a clean, stable foundation that every other contributor can build on top of. Do NOT build features beyond what is listed here. Other contributors will pick up GitHub Issues for features.

Read the following files in full before doing anything:
1. `master_prompt.md` — Tech stack rules, Prisma v7 patterns, and coding standards. Follow EXACTLY.
2. `design-style-guide.md` — The visual design system. Apply to every component you build.
3. `jb-components.md` — JB component reference. Check before building from scratch.
4. `project-description.md` — What we are building. Every decision must align with this.
5. `project-phases.md` — The full build plan (phases 1–6). You are implementing **Phase 1 only**, plus the four foundation deliverables described below.
6. `CONTRIBUTING.md` — The contribution rules all members follow. Your repo setup MUST comply with every rule in this file.
7. `TECHSTACK.md` — The approved stack. Do not introduce any library not listed here.

---

## Your Role

You are the **founding contributor** for the React JS Rwanda Community Platform. You will:

1. Create the GitHub repository with a standard, well-documented file layout
2. Build the public **Navbar** component
3. Build the complete **Authentication system** (sign-in, sign-up, GitHub OAuth)
4. Build the **Admin Dashboard shell** (layout + sidebar + protected routes)

After you finish, commit and push. Other community contributors will branch from `main` and implement features by picking up GitHub Issues. Your scaffold must be clean enough that 20 developers can contribute simultaneously without stepping on each other.

---

## Rules

- Work through ONE task at a time. Stop and confirm before moving to the next major task.
- Follow `design-style-guide.md` tokens EXACTLY — 0px radius, no shadows on cards, Inter + JetBrains Mono fonts, `#1DB8C3` cyan accent, black primary buttons, ALL CAPS labels.
- Use Prisma v7 patterns (NOT v6). See `master_prompt.md`.
- Use React Query for all client data fetching. Never `useEffect` for data.
- Use React Hook Form + Zod for all forms.
- Use API Routes (Route Handlers) for all server-side logic.
- Use Framer Motion for animations.
- **Before building auth from scratch — use the JB Better Auth UI component.**
- **No dark mode.** Skip ThemeProvider and next-themes. Remove all `.dark:` classes.
- Follow the commit message convention in `CONTRIBUTING.md` exactly.
- Every file you create must go in the correct directory per the layout in `CONTRIBUTING.md` §3.

---

## Task 1 — Repository & Standard File Layout

Create the complete project directory structure as specified in `CONTRIBUTING.md` §3. After scaffolding:

```
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir
```

Then install all core dependencies:
```bash
pnpm add @prisma/client @upstash/redis @tanstack/react-query zod react-hook-form @hookform/resolvers framer-motion lucide-react sonner react-markdown rehype-highlight
pnpm add -D prisma tsx
pnpm dlx shadcn@latest init --preset b0
pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/form.json
```

Create:
- `.env.example` with ALL required variables (see `project-description.md` Integrations section). Comment every variable.
- `.env.local` (gitignored) — fill in actual values
- `.gitignore` entry for `.env.local`
- `lib/db.ts` — Prisma v7 client singleton
- `lib/cache.ts` — Upstash Redis `getCachedOrFetch()` and `invalidateTag()` wrappers
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `app/globals.css` — Full Tailwind v4 `@theme` config from `design-style-guide.md` §13
- `app/layout.tsx` — Root layout: Inter font, JetBrains Mono font, QueryClientProvider, Sonner Toaster, no ThemeProvider
- `prisma/schema.prisma` — Full schema for ALL models: User, Event, EventRegistration, Publication, Bookmark, ForumPost, ForumReply, NewsletterSubscriber (see `project-description.md` Data Model section for all fields)
- `prisma/seed.ts` — 50+ realistic Rwandan-context seed records
- `package.json` scripts: `db:push`, `db:generate`, `db:studio`, `db:seed`
- `README.md` — Project overview, setup instructions, contribution link
- Empty `.gitkeep` files in every empty directory so they are tracked by git

Run: `pnpm db:push && pnpm db:generate && pnpm db:seed`

Confirm the build compiles cleanly before moving to Task 2.

---

## Task 2 — Public Navbar

Build `components/layout/navbar.tsx`.

**Exact spec from design references:**
- Full-width, `64px` tall, white background, `1px solid #E5E5E5` bottom border, sticky
- Left: Logo — "REACT JS RWANDA" in Inter weight 800, ALL CAPS, `#0A0A0A`, letter-spacing `0.06em`
- Center: Nav links — NEWS · EVENTS · MEMBERS · LIBRARY · FORUM. Each link is `13px` weight 500 uppercase `0.08em` tracking. Default color `#737373`. Hover `#0A0A0A`. Active page = `#0A0A0A` + `2px solid #1DB8C3` bottom underline (offset `4px`)
- Right: Search input (`200px` wide, `38px` tall, `1px #E5E5E5` border, magnifier icon left, placeholder "Search docs...", expands to `280px` on focus) + SIGN IN black button (`44px` tall, uppercase, sharp edges)
- Mobile: hamburger icon reveals full-screen nav overlay with all links + SIGN IN button
- Use `next/link` for all nav links. Use `usePathname()` for active detection.
- If user is authenticated, replace SIGN IN button with user avatar dropdown (Profile, Dashboard if ADMIN, Sign Out)

Export as default from `components/layout/navbar.tsx`. Include it in `app/layout.tsx` inside `<body>`.

Stop and confirm this looks correct before Task 3.

---

## Task 3 — Authentication System

Build the complete auth system for React JS Rwanda.

**Step 1 — Configure Better Auth:**
```bash
pnpm add better-auth
pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json
```

Configure `lib/auth.ts`:
- Email + password provider
- GitHub OAuth provider (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`)
- User model extended with: `username`, `role` (GUEST/MEMBER/ADMIN), `title`, `stack`, `availability`, `bio`, `githubUrl`, `twitterUrl`, `linkedinUrl`, `contributionPoints`
- `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` from env

**Step 2 — Auth Pages:**
Create `app/(auth)/layout.tsx` — centered card layout, white background, "REACT JS RWANDA" logo header.

Create `app/(auth)/login/page.tsx`:
- Use installed Better Auth UI component
- Style overrides: 0px radius everywhere, black primary button, Inter font
- GitHub OAuth button: outlined with GitHub icon
- "Don't have an account? Join →" link in cyan

Create `app/(auth)/register/page.tsx`:
- Use installed Better Auth UI component  
- After email+password form, redirect to `/register/profile` for profile setup

Create `app/(auth)/register/profile/page.tsx` (profile setup step):
- React Hook Form + Zod
- Fields: username (monospace preview with @), title/role (text), stack (multi-checkbox: React JS, React Native, Next.js, TypeScript, Node.js, Python, Other), availability (radio: Open to Work / Open to Project / Available for Mentoring / Not Currently Looking)
- Primary black submit button: "COMPLETE PROFILE →"

**Step 3 — API Route:**
Create `app/api/auth/[...all]/route.ts` — Better Auth handler.

**Step 4 — Protected Middleware:**
Create `middleware.ts` (edge runtime):
- `/dashboard/*` → requires authenticated user with role ADMIN. Redirect to `/login` if not.
- `/profile/settings` → requires authenticated user. Redirect to `/login` if not.
- `/forum/new` → requires authenticated user.
- `/library/submit` → requires authenticated user.
- All other routes are public.

Verify: register with email, login, GitHub OAuth, protected routes all work before Task 4.

---

## Task 4 — Admin Dashboard Shell

Build the admin dashboard layout so contributors can add dashboard pages without layout work.

**Step 1 — Dashboard Layout:**
Create `app/dashboard/layout.tsx`:
- Uses admin sidebar (left, `260px`) + main content area (right, fills remaining width)
- Border `1px solid #E5E5E5` separating sidebar from content
- White background throughout
- Suspense boundary wrapping `{children}`

**Step 2 — Admin Sidebar:**
Create `components/layout/admin-sidebar.tsx`:
- Width `260px`, white background, right border `1px solid #E5E5E5`
- Top: "REACT JS RWANDA" logo small + "ADMIN" label in `primary-500`
- Navigation items (use Lucide icons):
  - Overview (LayoutDashboard icon) → `/dashboard`
  - Events (Calendar icon) → `/dashboard/events`
  - Members (Users icon) → `/dashboard/members`
  - Publications (BookOpen icon) → `/dashboard/publications`
  - Forum (MessageSquare icon) → `/dashboard/forum`
- Active item: `bg-neutral-50` + left `2px solid #1DB8C3` border, text `#0A0A0A`
- Bottom: user avatar (32×32, grayscale, pill) + name (`14px` weight 600) + email (`12px` `#737373`) + Sign Out link
- Collapsible on mobile (slides in from left as an overlay)

**Step 3 — Page Header:**
Create `components/layout/page-header.tsx`:
- Props: `title: string`, `description?: string`, `actions?: React.ReactNode`
- `title`: `32px` weight 800 `#0A0A0A`
- `description`: `14px` `#737373`
- `actions`: right-aligned slot for buttons
- Bottom border `1px solid #E5E5E5`, `pb-6 mb-8`

**Step 4 — Dashboard Home:**
Create `app/dashboard/page.tsx`:
- `<PageHeader title="Dashboard" description="React JS Rwanda Admin" />`
- 4 stat cards in a grid (2×2 on tablet, 4×1 on desktop):
  - Total Members (Users icon)
  - Upcoming Events (Calendar icon)
  - Pending Publications (BookOpen icon)
  - Forum Threads (MessageSquare icon)
- Each stat card: white, `1px #E5E5E5` border, `0px` radius, `24px` padding, label in ALL CAPS `neutral-500`, number in `32px` weight 800 `neutral-900`
- Fetches real counts from `GET /api/admin/stats` (create this route, cached via Redis)

**Step 5 — Placeholder pages:**
Create these pages (placeholder only — just `<PageHeader>` and a "Coming soon" note — contributors will fill them in):
- `app/dashboard/events/page.tsx`
- `app/dashboard/members/page.tsx`
- `app/dashboard/publications/page.tsx`
- `app/dashboard/forum/page.tsx`

---

## Verification Before Committing

Run through this checklist before your final commit:

- [ ] `pnpm build` completes with no TypeScript errors
- [ ] `pnpm lint` passes with no errors
- [ ] Navbar renders correctly on desktop and mobile
- [ ] Login with email/password works
- [ ] Login with GitHub OAuth works
- [ ] New user registration + profile setup flow works
- [ ] Navigating to `/dashboard` as a non-authenticated user redirects to `/login`
- [ ] Admin user can access `/dashboard` and see the sidebar + stat cards
- [ ] All 4 dashboard placeholder pages load without error
- [ ] `.env.example` has every required variable with comments
- [ ] `prisma/seed.ts` runs successfully: `pnpm db:seed`
- [ ] Directory structure exactly matches `CONTRIBUTING.md` §3
- [ ] No `.dark:` Tailwind classes anywhere in the codebase
- [ ] No `rounded-*` classes on cards, buttons, or inputs (only on `.avatar` elements)

---

## Commit & Push

Use Conventional Commits format (see `CONTRIBUTING.md`):

```
feat: initial repo scaffold, navbar, auth system, and dashboard shell

- Standard Next.js 16 + shadcn/ui project structure
- Inter + JetBrains Mono fonts, Tailwind v4 @theme configured
- Prisma v7 schema with all models, Neon DB connected
- Upstash Redis cache (getCachedOrFetch + invalidateTag)
- Better Auth with email/password + GitHub OAuth
- Login, register, profile setup pages
- Edge middleware for protected routes
- Public navbar (desktop + mobile responsive)
- Admin dashboard layout (sidebar + page header + stat cards)
- Placeholder pages for all dashboard sections
- 50+ seed records via prisma/seed.ts

Closes #001 #002 #003 #004 #005 #006 #007 #008 #009 #010
Closes #011 #012 #013 #014 #015 #016 #017 #018 #019 #020
```

After pushing, post in the React JS Rwanda Discord: "Foundation is up! Repo is open. Pick an issue from the backlog and start contributing. Read CONTRIBUTING.md first."
