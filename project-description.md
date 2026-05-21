# React JS Rwanda — Community Platform Project Description

## What This App Does
React JS Rwanda Community Platform is the official digital home for Rwanda's React developer community. It gives members a single place to discover and register for events, read and publish technical articles, connect with other developers, and participate in a community forum. The platform is fully open-source and community-built, following strict contribution standards so that dozens of developers can collaborate without chaos.

## Target Users
- **Primary user (Community Member):** A Rwandan React/web developer who wants to stay connected to the local ecosystem — finding meetups, discovering collaborators, reading technical guides, and participating in technical discussions.
- **Secondary user (Admin/Organizer):** A React JS Rwanda core team member who manages events, approves publications, moderates forum threads, and oversees member profiles from the admin dashboard.
- **Tertiary user (Guest/Visitor):** An unregistered visitor who can browse the landing page, events, publications, and member directory in read-only mode.

## Core Value Proposition
The single professional hub for Rwanda's React ecosystem — events, knowledge, community, and opportunity in one place, built by the community for the community.

## User Roles & Permissions

- **GUEST (unauthenticated):** Can view landing page, events list, publications list, member directory (read-only), and forum threads (read-only). Cannot register for events, post forum threads, or submit articles.
- **MEMBER (authenticated):** Can register for events, submit forum threads and replies, submit publications for review, bookmark articles, update their own profile (stack, availability, bio, social links), and view the full member directory.
- **ADMIN:** Full access to all MEMBER permissions plus: create/edit/delete events, approve/reject publication submissions, moderate forum posts, manage member roles, and access the admin dashboard with analytics.

## Features — Complete List

1. **Landing Page / Hero** — Full-page hero with community stats (total devs, monthly meetups, open source projects), CTA buttons to join and explore, and a component spotlight card showing the latest library release.
2. **Community Feed** — Paginated feed of latest community updates (events, announcements, showcases) with category tags, author info, and timestamps on the homepage.
3. **Events Hub** — Upcoming meetups section with a featured large card + sidebar card layout, event type filter tags (Live Workshop, Community Night, Networking), date/time display, attendee avatars with count, and a "Register Seat" CTA.
4. **Past Workshops Archive** — Grid of past sessions with session number labels, date, duration, and direct Slides + Video resource buttons.
5. **Event Detail Page** — Full event page with cover image, description, date/time, location, attendee list, and registration button.
6. **Member Directory** — Searchable, filterable member grid. Filters by stack (React JS, React Native, Next.js, TypeScript) and availability (Open to Work, Open to Project, Available for Mentoring). Cards show avatar, name, title, handle, stack tags, top contributions, and availability status.
7. **Member Profile Page** — Full profile view with bio, stack, contributions, social links, forum activity, and bookmarked articles.
8. **Publications & Technical Library** — Article library with left-side category filter (Infrastructure, State Management, Performance, Testing, React Native, Ecosystem) and resource type filter (Guides, Articles, Case Studies). Featured article hero layout + article cards with category, read time, date, and bookmark action.
9. **Publication Detail Page** — Full article reading experience with author info, read time, category, and content.
10. **Submit Article** — Form for members to submit a technical guide/article for admin review. Fields: title, summary, category, type, content (markdown), cover image.
11. **Community Forum** — Three-column layout: left navigation (categories: General, Announcements, Technical Help, Showcase, Career), center thread list with tag badges, reply counts, and participant avatars, right sidebar (Contribution Leaderboard, Trending Tags, community stats).
12. **Forum Thread Detail** — Full thread view with original post, replies, markdown rendering, and a reply composer.
13. **Start Discussion** — Authenticated members can create a new forum thread with title, body, category, and tags.
14. **Newsletter Subscription** — Email capture widget in the library page footer section for monthly digest.
15. **Admin Dashboard** — Overview stats cards (total members, upcoming events, publications pending review, active forum threads). Quick-action panels.
16. **Admin Events Management** — Full CRUD for events with data table, search, filters, Excel/PDF export.
17. **Admin Members Management** — View/manage all members, change roles, filter by stack/availability.
18. **Admin Publications Management** — Review pending submissions, approve or reject, view published articles.
19. **Admin Forum Moderation** — View all threads, delete/pin threads, manage reported posts.
20. **Auth (Sign In / Sign Up)** — Email + password registration and login. GitHub OAuth. Profile setup step after registration (username, role/title, stack selection).
21. **User Profile Settings** — Edit profile: name, bio, avatar upload, stack tags, availability, GitHub/Twitter/LinkedIn URLs.
22. **Search** — Global search across events, publications, and forum threads (search bar in navbar).
23. **Contribution Leaderboard** — Points-based leaderboard in forum sidebar showing top community contributors.

## Data Model

- **User:** id (cuid), name (String), username (String unique), email (String unique), emailVerified (Boolean), image (String?), bio (String?), role (Enum: GUEST/MEMBER/ADMIN), title (String? — e.g. "Senior React Developer"), stack (String[]), availability (Enum: OPEN_TO_WORK/OPEN_TO_PROJECT/MENTORING/NOT_LOOKING), githubUrl (String?), twitterUrl (String?), linkedinUrl (String?), contributionPoints (Int default 0), createdAt, updatedAt
- **Event:** id, title (String), slug (String unique), description (String), date (DateTime), startTime (String), endTime (String), location (String), type (Enum: MEETUP/WORKSHOP/NETWORKING/CONFERENCE), coverImage (String?), isUpcoming (Boolean), authorId (User), createdAt, updatedAt
- **EventRegistration:** id, eventId (Event), userId (User), createdAt — unique(eventId, userId)
- **Publication:** id, title (String), slug (String unique), summary (String), content (String — markdown), category (Enum: INFRASTRUCTURE/STATE_MANAGEMENT/PERFORMANCE/TESTING/REACT_NATIVE/ECOSYSTEM/OPTIMIZATION), type (Enum: GUIDE/ARTICLE/CASE_STUDY), readTime (Int — minutes), coverImage (String?), status (Enum: PENDING/PUBLISHED/REJECTED), authorId (User), createdAt, updatedAt
- **Bookmark:** id, userId (User), publicationId (Publication), createdAt — unique(userId, publicationId)
- **ForumPost:** id, title (String), slug (String unique), body (String — markdown), category (Enum: GENERAL/ANNOUNCEMENTS/TECHNICAL_HELP/SHOWCASE/CAREER), tags (String[]), authorId (User), viewCount (Int default 0), isPinned (Boolean default false), createdAt, updatedAt
- **ForumReply:** id, body (String — markdown), postId (ForumPost), authorId (User), createdAt, updatedAt
- **NewsletterSubscriber:** id, email (String unique), subscribedAt
- **Relationships:** A User has many Events (author), EventRegistrations, Publications, ForumPosts, ForumReplies, Bookmarks. An Event has many EventRegistrations. A Publication has many Bookmarks. A ForumPost belongs to a User (author) and has many ForumReplies. A ForumReply belongs to a ForumPost and a User.

## Pages / Screens

1. `/` — Landing page: Hero section, community stats, community feed (latest events/announcements/showcases), CTA section, footer
2. `/events` — Events Hub: Upcoming meetups (featured layout), filter tags, past workshops archive grid
3. `/events/[slug]` — Event detail: Cover image, description, date/time, location, attendees, register button
4. `/members` — Member Directory: Filter sidebar + member card grid, pagination
5. `/members/[username]` — Member profile: Avatar, bio, stack, contributions, activity, social links
6. `/library` — Publications & Technical Library: Category sidebar, featured article, article card grid, newsletter widget
7. `/library/[slug]` — Publication reading page: Full article with author, category, read time
8. `/library/submit` — Article submission form (members only)
9. `/forum` — Community Forum: Category nav, thread list, contribution leaderboard, trending tags
10. `/forum/[category]` — Forum category view: Filtered thread list
11. `/forum/[category]/[slug]` — Forum thread: Full post + replies + reply composer
12. `/forum/new` — New thread form (members only)
13. `/login` — Sign in page: Email/password + GitHub OAuth
14. `/register` — Sign up page: Email/password + profile setup
15. `/profile/settings` — User settings: Edit profile, avatar upload, stack, availability, social links
16. `/dashboard` — Admin dashboard: Stats overview, quick actions
17. `/dashboard/events` — Admin events: Data table, create/edit/delete events
18. `/dashboard/members` — Admin members: Data table, role management
19. `/dashboard/publications` — Admin publications: Review queue, approve/reject
20. `/dashboard/forum` — Admin forum: Thread management, moderation

## Integrations

- **Auth:** Better Auth + GitHub OAuth + Email/Password
- **Email:** Resend (welcome email, newsletter digest)
- **Payments:** None
- **File uploads:** Cloudflare R2 (avatars, publication cover images, event cover images)
- **AI features:** None (v1)
- **Dark mode:** No — light-only. Skip ThemeProvider and next-themes entirely.

## JB Components to Install

- **Better Auth UI:** `pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json`
- **JB Data Table:** `pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json`
- **JB File Storage UI:** `pnpm dlx shadcn@latest add https://file-storage.desishub.com/r/file-storage.json`

## Out of Scope (v1)

- Real-time chat or messaging between members
- Mobile app (React Native)
- Job board / career listings feature (forum Career category covers this partially)
- Paid sponsorship or billing features
- Component library / code snippet showcase (Library covers this via articles)
- Video hosting (external links to YouTube/Vimeo used instead)
- Multi-language support (English only for v1)
- Advanced analytics dashboard
