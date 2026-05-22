# Contributing to React JS Rwanda Community Platform

> Welcome to the React JS Rwanda Community Platform — a fully open-source project built by the community, for the community. This document is the single source of truth for contribution rules. Read it in full before opening your first PR.

---

## Table of Contents

1. [Code of Conduct](#1-code-of-conduct)
2. [Getting Started](#2-getting-started)
3. [Standard File Layout](#3-standard-file-layout)
4. [How Issues Work](#4-how-issues-work)
5. [Branching Strategy](#5-branching-strategy)
6. [Commit Message Convention](#6-commit-message-convention)
7. [Pull Request Process](#7-pull-request-process)
8. [Coding Standards](#8-coding-standards)
9. [Design Standards](#9-design-standards)
10. [Testing Requirements](#10-testing-requirements)
11. [Review Checklist](#11-review-checklist)
12. [Getting Help](#12-getting-help)

---

## 1. Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating you agree to uphold it.

Key expectations:
- Respectful, constructive feedback only in PRs and issues
- No gatekeeping — all skill levels are welcome
- Credit others when building on their work
- English is the working language for code, comments, and PRs

---

## 2. Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Git
- A Neon PostgreSQL account (free tier works)
- An Upstash Redis account (free tier works)

### Setup

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/rjsrw-community.git
cd rjsrw-community

# 2. Install dependencies
pnpm install

# 3. Copy env file
cp .env.example .env.local
# Fill in your values in .env.local (see .env.example for instructions)

# 4. Push schema to your Neon database
pnpm db:push
pnpm db:generate

# 5. Seed the database
pnpm db:seed

# 6. Start dev server
pnpm dev
```

The app will be at `http://localhost:3000`.

---

## 3. Standard File Layout

Every contributor MUST place files in the correct location. Do not create ad-hoc folders.

```
rjsrw-community/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes (no auth required)
│   │   ├── layout.tsx            # Public layout (navbar + footer)
│   │   ├── page.tsx              # Home / Landing page
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── members/
│   │   │   ├── page.tsx
│   │   │   └── [username]/
│   │   │       └── page.tsx
│   │   ├── library/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── submit/
│   │   │       └── page.tsx
│   │   └── forum/
│   │       ├── page.tsx
│   │       ├── new/
│   │       │   └── page.tsx
│   │       └── [category]/
│   │           ├── page.tsx
│   │           └── [slug]/
│   │               └── page.tsx
│   ├── (auth)/                   # Auth routes
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       ├── page.tsx
│   │       └── profile/
│   │           └── page.tsx
│   ├── dashboard/                # Admin dashboard (protected)
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Overview
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── members/
│   │   │   └── page.tsx
│   │   ├── publications/
│   │   │   └── page.tsx
│   │   └── forum/
│   │       └── page.tsx
│   ├── profile/
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                      # Route Handlers
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts
│   │   ├── feed/
│   │   │   └── route.ts
│   │   ├── events/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── register/
│   │   │           └── route.ts
│   │   ├── members/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   ├── library/
│   │   │   ├── route.ts
│   │   │   ├── submit/
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── bookmark/
│   │   │           └── route.ts
│   │   ├── forum/
│   │   │   ├── posts/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── replies/
│   │   │   │           └── route.ts
│   │   ├── newsletter/
│   │   │   └── subscribe/
│   │   │       └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts
│   │   ├── search/
│   │   │   └── route.ts
│   │   └── admin/
│   │       ├── stats/
│   │       │   └── route.ts
│   │       ├── events/
│   │       │   └── route.ts
│   │       ├── members/
│   │       │   └── route.ts
│   │       ├── publications/
│   │       │   └── route.ts
│   │       └── forum/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx
│   ├── error.tsx
│   └── loading.tsx
│
├── components/                   # All React components
│   ├── ui/                       # shadcn/ui primitives (DO NOT edit manually)
│   ├── layout/                   # Global layout components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── admin-sidebar.tsx
│   │   └── page-header.tsx
│   ├── home/                     # Landing page sections
│   │   ├── hero.tsx
│   │   ├── stats-bar.tsx
│   │   ├── community-feed.tsx
│   │   └── cta-section.tsx
│   ├── events/                   # Events components
│   │   ├── featured-event-card.tsx
│   │   ├── past-workshop-card.tsx
│   │   └── event-filter-tags.tsx
│   ├── members/                  # Members components
│   │   ├── member-card.tsx
│   │   └── filter-sidebar.tsx
│   ├── library/                  # Library components
│   │   ├── article-card.tsx
│   │   ├── featured-article.tsx
│   │   ├── category-sidebar.tsx
│   │   └── newsletter-widget.tsx
│   ├── forum/                    # Forum components
│   │   ├── thread-card.tsx
│   │   ├── leaderboard.tsx
│   │   ├── trending-tags.tsx
│   │   └── community-stats.tsx
│   └── shared/                   # Reusable across features
│       ├── avatar.tsx
│       ├── tag-badge.tsx
│       ├── pagination.tsx
│       ├── search-command.tsx
│       └── markdown-renderer.tsx
│
├── lib/                          # Utilities and clients
│   ├── db.ts                     # Prisma client singleton
│   ├── cache.ts                  # Upstash Redis cache helpers
│   ├── auth.ts                   # Better Auth config
│   ├── auth-client.ts            # Better Auth client
│   └── utils.ts                  # cn(), slugify(), etc.
│
├── hooks/                        # Custom React hooks
│   ├── use-current-user.ts
│   └── use-debounce.ts
│
├── types/                        # TypeScript types
│   └── index.ts
│
├── emails/                       # React Email templates
│   ├── welcome.tsx
│   ├── event-registration.tsx
│   └── newsletter-digest.tsx
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│   └── images/
│       └── (all figma/design image assets go here)
│
├── scripts/
│   └── create-issues.sh          # Creates GitHub Issues from project-phases.md
│
├── .env.example                  # Template env file (committed)
├── .env.local                    # Your secrets (gitignored, NEVER commit)
├── .gitignore
├── middleware.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── CONTRIBUTING.md               # This file
├── TECHSTACK.md
├── README.md
├── LICENSE                       # MIT
├── project-description.md
├── project-phases.md
└── design-style-guide.md
```

### Rules
- **Never create folders outside this layout** without opening a Discussion issue first.
- `components/ui/` is managed by shadcn/ui. Do not edit files here manually.
- Each component file exports a single default export named after the file (`member-card.tsx` → `export default function MemberCard`).
- Place TypeScript types in `types/index.ts` or co-locate as `component-name.types.ts` in the same folder.

---

## 4. How Issues Work

Every task in `project-phases.md` is a GitHub Issue. Issues are the only unit of work.

### Picking Up an Issue

1. Browse open issues at `github.com/reactjsrwanda/community/issues`
2. Find an unassigned issue with label `status: open`
3. Comment: "I'd like to work on this" — a maintainer will assign it to you within 24h
4. Once assigned, create your branch (see §5) and start work
5. **Do not start work before being assigned.** Two people working on the same issue wastes effort.

### Issue Labels

| Label | Meaning |
|-------|---------|
| `status: open` | Available to pick up |
| `status: in-progress` | Someone is working on it |
| `status: review` | PR submitted, awaiting review |
| `status: blocked` | Waiting on another issue |
| `phase: 1` through `phase: 6` | Which phase it belongs to |
| `difficulty: starter` | Good first issue (< 2h of work) |
| `difficulty: medium` | 2–8h of work |
| `difficulty: hard` | 8h+ or requires deep domain knowledge |
| `type: feature` | New feature |
| `type: bug` | Bug fix |
| `type: design` | UI/styling work |
| `type: docs` | Documentation |

### Issue Dependency Rule

Issues have dependencies listed in their description. Do not start an issue until all its dependencies are merged into `main`. The milestone structure in `project-phases.md` defines the correct order.

---

## 5. Branching Strategy

We use **GitHub Flow** — `main` is always deployable.

### Branch naming convention

```
<type>/<issue-number>-<short-description>

Examples:
feat/022-hero-section
feat/030-events-page
fix/035-member-card-overflow
design/040-article-card-hover
docs/090-readme-setup-guide
```

### Rules

- **Always branch from `main`** — never from another feature branch.
- **One issue = one branch = one PR.**
- Keep your branch up to date: `git fetch origin && git rebase origin/main` regularly.
- Delete your branch after your PR is merged.

---

## 6. Commit Message Convention

We use **[Conventional Commits](https://www.conventionalcommits.org/)**.

```
<type>(<scope>): <short description>

[optional body]

[optional footer: Closes #issue-number]
```

### Types

| Type | When to use |
|------|------------|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `design` | Style/UI changes with no logic change |
| `refactor` | Code restructuring with no behavior change |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |
| `chore` | Build, config, dependencies |

### Examples

```
feat(events): add featured event card component

Builds the FeaturedEventCard component from design-style-guide.md spec.
Includes attendee avatar stack and register button.

Closes #028
```

```
fix(navbar): correct active link detection on dynamic routes

usePathname() was returning null during hydration. Added null check.

Closes #010
```

```
design(forum): fix thread card border to 1px #E5E5E5

Cards were using neutral-300 instead of neutral-200. Corrected to match
design-style-guide.md §7.3.

Closes #050
```

### Rules
- Lowercase subject line, no period at the end
- Subject line max 72 characters
- Always include `Closes #<issue-number>` in the footer
- Atomic commits — one logical change per commit

---

## 7. Pull Request Process

### Before Opening a PR

- [ ] `pnpm build` passes with no TypeScript errors
- [ ] `pnpm lint` passes with no warnings
- [ ] Your component matches `design-style-guide.md` (0px radius, correct colors, correct typography)
- [ ] No `.dark:` Tailwind classes
- [ ] No `rounded-*` classes on cards/buttons/inputs
- [ ] API routes use `getCachedOrFetch()` for GET requests and `invalidateTag()` on mutations
- [ ] No hardcoded colors (use CSS custom properties or Tailwind tokens)
- [ ] No `console.log` statements left in code
- [ ] All new components have TypeScript types for props

### PR Title Format

```
feat(scope): short description (#issue-number)

Examples:
feat(events): events hub page with filter tags (#027)
fix(auth): github oauth redirect url (#015)
design(members): member card stack tag badges (#035)
```

### PR Description Template

When you open a PR, fill in the template:

```markdown
## What this PR does
[2-3 sentences describing what you built or fixed]

## Issue
Closes #[issue-number]

## Screenshots
[Paste screenshots of your UI — required for all visual changes]

## Design checklist
- [ ] Matches design-style-guide.md
- [ ] 0px border radius on cards/buttons/inputs
- [ ] Correct color tokens used
- [ ] Mobile responsive
- [ ] No .dark: classes

## Technical checklist
- [ ] TypeScript types defined
- [ ] API routes cached via Redis (if applicable)
- [ ] pnpm build passes
- [ ] pnpm lint passes
```

### Review Process

- PRs require **1 approval** from a maintainer (for starter/medium issues) or **2 approvals** (for hard issues)
- Reviews will be done within 48 hours
- Address all review comments with a new commit (do not force-push after review starts)
- Once approved, a maintainer will merge using **Squash and Merge**

### Merge Rules
- Only maintainers merge PRs
- `main` branch is protected — no direct pushes
- PRs that fail CI (build/lint) will not be reviewed until passing

---

## 8. Coding Standards

### TypeScript

- Strict mode is on (`tsconfig.json` has `"strict": true`). No `any` types.
- Define prop interfaces above the component, named `[ComponentName]Props`.
- Use `type` for unions/intersections, `interface` for object shapes.

```tsx
// ✅ Correct
interface MemberCardProps {
  name: string;
  username: string;
  title: string;
  stack: string[];
  availability: "OPEN_TO_WORK" | "OPEN_TO_PROJECT" | "MENTORING" | "NOT_LOOKING";
}

export default function MemberCard({ name, username, title, stack, availability }: MemberCardProps) {
  // ...
}
```

### Components

- One component per file. File name = kebab-case. Component name = PascalCase.
- Use `"use client"` only when absolutely necessary (event handlers, browser APIs). Prefer Server Components.
- All data fetching in Server Components or API routes. Never `useEffect` for data.
- Wrap data-fetching sections in `<Suspense>`. Add `<ErrorBoundary>` on major blocks.

### API Routes (Route Handlers)

```ts
// Pattern for all GET routes with caching
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  
  const data = await getCachedOrFetch(
    `events:list:page:${page}`,
    () => db.event.findMany({ skip: (page - 1) * 10, take: 10 }),
    60 * 5 // 5 minute TTL
  );
  
  return Response.json(data);
}

// Pattern for mutations — always invalidate cache
export async function POST(request: Request) {
  const body = await request.json();
  // validate with zod...
  const result = await db.event.create({ data: body });
  await invalidateTag("events");
  return Response.json(result, { status: 201 });
}
```

### Forms

Always use React Hook Form + Zod. Never raw `<form>` `onSubmit` without validation.

```tsx
const schema = z.object({
  title: z.string().min(3).max(100),
  category: z.enum(["GENERAL", "TECHNICAL_HELP", "SHOWCASE", "CAREER"]),
});

type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({ resolver: zodResolver(schema) });
```

### Imports

- Use `@/` path alias for all internal imports (never relative `../../../`)
- Import order: React/Next → external packages → internal components → internal lib/utils → types

### No unused code

- Remove all `console.log` before committing
- Remove commented-out code blocks
- No TODO comments in committed code (open a GitHub issue instead)

---

## 9. Design Standards

This is the most commonly violated rule in PRs. Read `design-style-guide.md` fully. The hard rules are:

### The Sharp Rule
**Zero border radius on all UI elements except avatars (pill) and code snippets (4px).** If your component has `rounded`, `rounded-md`, `rounded-lg`, or any `rounded-*` class on anything except an avatar or code block, your PR will be requested-changes immediately.

### The Flat Rule
**No box shadows on cards or buttons.** Use `1px solid #E5E5E5` borders. The only exceptions are modals (`shadow-md`) and dropdowns (`shadow-xs`).

### The Color Rule
**Only use tokens defined in `design-style-guide.md` §3.** No hardcoded hex colors in JSX. If you need a color not in the system, open a Discussion issue.

### The Dark Mode Rule
**No `.dark:` Tailwind classes. Ever.** Dark mode is explicitly out of scope.

### The Typography Rule
**Section labels are ALL CAPS with `tracking-widest` or `letter-spacing: 0.08em`.** Page titles use `font-weight: 800`. Nav items use `font-weight: 500` ALL CAPS.

### Screenshot Required
All PRs with UI changes require at least one screenshot. PRs without screenshots for visual changes will not be reviewed.

---

## 10. Testing Requirements

For v1, we require:
- `pnpm build` must pass (TypeScript + Next.js compilation)
- `pnpm lint` must pass (ESLint)
- Manual test of your feature in browser before opening PR

Unit/integration tests are encouraged but not yet required for v1. A testing infrastructure will be set up in a future phase.

---

## 11. Review Checklist

Maintainers use this checklist when reviewing PRs:

**Code Quality**
- [ ] TypeScript strict — no `any`, all props typed
- [ ] Server Components used where possible
- [ ] React Query used for client data (no useEffect for data)
- [ ] Zod validation on all form inputs and API inputs
- [ ] API routes follow GET=cache, mutation=invalidate pattern
- [ ] No unused imports or variables
- [ ] No console.log statements

**Design Quality**
- [ ] Matches design-style-guide.md
- [ ] 0px radius on cards/buttons/inputs
- [ ] Correct color tokens (no hardcoded hex)
- [ ] ALL CAPS + wide tracking on section labels
- [ ] Heavy weight (800) on page/section titles
- [ ] No `.dark:` classes
- [ ] Screenshot provided

**Architecture**
- [ ] File placed in correct directory (§3)
- [ ] Branch named correctly (§5)
- [ ] Commit messages follow convention (§6)
- [ ] PR title correct (§7)
- [ ] `Closes #issue-number` in PR footer

---

## 12. Getting Help

- **Discord:** Join `#rjsrw-platform-dev` channel for questions
- **GitHub Discussions:** For design decisions, architecture questions, or proposing new features
- **GitHub Issues:** For bugs and tracked work items only
- **Weekly Dev Call:** Every Saturday 10am EAT — open to all contributors (link in Discord)

If you're stuck on an issue for more than 2 hours, post in Discord with your branch link and what you've tried. Don't go silent — we'd rather help you move forward than have you blocked for days.

---

*Built by the React JS Rwanda community. Every line of code is a contribution to Rwanda's digital renaissance.*
