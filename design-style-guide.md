# React JS Rwanda — Design Style Guide

> Single source of truth for all visual and interaction decisions in the React JS Rwanda Community Platform. Reference this file before writing any UI code.
>
> **Dark mode: NOT supported in this project.** Light-only. Skip ThemeProvider and next-themes entirely. Remove all `.dark:` Tailwind classes.
>
> **Aesthetic**: Editorial-Tech / Developer Publication (Vercel meets a developer newspaper)
> **Scope**: Public site, Community pages, Admin Dashboard

---

## Visual Reference

The design references the React JS Rwanda site mockups provided directly as design source. The aesthetic is a high-contrast editorial developer publication — white backgrounds with near-black text, a single electric cyan accent (`#1DB8C3`), zero border radius (everything is sharp-cornered rectangles), 1px light-gray borders, and extremely heavy (800–900 weight) display typography. Section labels are ALL CAPS with wide letter-spacing. The primary CTA is a solid black filled rectangle with uppercase white text. The secondary CTA is an outlined rectangle. Dark sections use a near-black `#111111` background with white text and the same cyan CTA. The energy is: **editorial · techy · confident** — like Linear's marketing meets a developer news site.

Key visual anchors:
- Hero: Split layout, ultra-heavy headline with a cyan highlight box around a keyword
- Cards: 1px `#E5E5E5` border, 0px radius, flat (no shadow), generous internal padding
- Buttons: Sharp rectangle, filled black primary, outlined secondary, filled cyan for discord/subscribe CTAs
- Navigation: Top bar, logo in bold uppercase, nav items in uppercase with wide tracking, active = cyan underline
- Dark sections: Full-width `#111111` banners for CTAs and past-workshop cards
- Forum: Three-column layout with a left category nav (active = 2px left cyan border)
- Code snippets: Dark `#1A1A1A` rounded blocks inside cards

---

## 1. Design Philosophy

React JS Rwanda is the official community platform for professional React developers in Rwanda. The UI must feel **developer-grade, publication-quality, and community-owned** — the kind of platform you'd expect from a serious technical community, not a generic SaaS template.

**Three core principles:**

1. **Editorial precision** — Heavy typography, clear hierarchy, generous whitespace. Content leads, chrome is invisible.
2. **Cyan as the single signal** — One electric accent color for all interactive states, links, category labels, and CTAs. Everything else is black, white, or gray.
3. **Sharp confidence** — Zero border radius on cards and buttons. The design doesn't try to be friendly — it's confident and professional, like the community it represents.

---

## 2. Typography

### Font Family

**Primary font: [Inter](https://fonts.google.com/specimen/Inter)** (Google Fonts)

Load via `next/font/google`:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});
```

Apply via `className={inter.variable}` on the root layout.

**Monospace font: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)** — used for code snippets, handles (@username), session numbers.

```tsx
import { JetBrains_Mono } from "next/font/google";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
```

**Why Inter + JetBrains Mono**: Inter's high x-height and multiple weights (400–900) enable the editorial typography rhythm the design demands. JetBrains Mono grounds the developer identity of the platform.

### Type Scale

| Style | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| `display` | 56px | 900 | 1.0 | -0.03em | Landing hero headline |
| `display-sm` | 40px | 800 | 1.05 | -0.02em | Page titles (Events Hub, Member Directory) |
| `h1` | 32px | 800 | 1.1 | -0.02em | Section headers |
| `h2` | 24px | 700 | 1.2 | -0.01em | Card titles, forum thread titles |
| `h3` | 20px | 700 | 1.25 | -0.01em | Sub-section titles |
| `h4` | 16px | 600 | 1.35 | 0 | Labels, sidebar headers |
| `body-lg` | 16px | 400 | 1.6 | 0 | Hero subtext, article excerpts |
| `body` | 14px | 400 | 1.55 | 0 | Default body, card descriptions |
| `body-sm` | 13px | 400 | 1.5 | 0 | Secondary info, timestamps, captions |
| `label` | 12px | 600 | 1.3 | 0.08em | ALL CAPS section labels (UPCOMING MEETUPS, PAST WORKSHOPS) |
| `tag` | 11px | 600 | 1.2 | 0.06em | Category tags (EVENT, SHOWCASE, TECHNICAL HELP) |
| `mono` | 13px | 400 | 1.5 | 0 | Code snippets, @handles, session numbers |

**Rules:**
- Section headers (UPCOMING MEETUPS, PAST WORKSHOPS, FILTER BY STACK) use `label` style: ALL CAPS, 600 weight, `0.08em` tracking.
- Nav items use 500 weight, ALL CAPS, `0.06em` tracking.
- Display headings (hero, page titles) use 800–900 weight for maximum editorial impact.
- @handles and code always use `font-mono`.

---

## 3. Color Palette

Dark mode: NOT supported. No `.dark:` classes anywhere.

### Primary (Cyan)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#E6FAFB` | Subtle backgrounds, selected filter states |
| `primary-100` | `#B3EFF3` | Tag badge backgrounds (active), hover tints |
| `primary-500` | `#1DB8C3` | **Links, active nav underlines, @handles, category labels in articles** |
| `primary-600` | `#17A2AD` | **Primary accent — CTA buttons (Discord/Subscribe), active state borders** |
| `primary-700` | `#128E98` | Hover on cyan CTAs |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-0` | `#FFFFFF` | Page background, cards, navbar |
| `neutral-50` | `#F8F8F8` | Subtle section backgrounds |
| `neutral-100` | `#F2F2F2` | Tag badge backgrounds (default), filter sidebar bg, code block bg |
| `neutral-200` | `#E5E5E5` | Card borders, dividers, input borders |
| `neutral-300` | `#D4D4D4` | Disabled borders, placeholder icons |
| `neutral-400` | `#A3A3A3` | Placeholder text, secondary icons, muted labels |
| `neutral-500` | `#737373` | Secondary text, timestamps, captions |
| `neutral-700` | `#404040` | Body text secondary |
| `neutral-900` | `#0A0A0A` | **Primary text, headings — near black** |
| `neutral-950` | `#111111` | **Dark section backgrounds (CTA banner, past-workshop cards)** |

### Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| `success-100` | `#D1FAE5` | GENERAL tag badge background |
| `success-600` | `#059669` | GENERAL tag text, open-to-work status |
| `warning-100` | `#FEF3C7` | EVENT / ANNOUNCEMENT tag badge background |
| `warning-700` | `#B45309` | EVENT tag text |
| `error-100` | `#FEE2E2` | TECHNICAL HELP tag background |
| `error-600` | `#DC2626` | TECHNICAL HELP tag text, error states |
| `info-100` | `#DBEAFE` | KIGALI / NETWORKING tag background |
| `info-600` | `#2563EB` | KIGALI tag text |
| `showcase-100` | `#D1FAE5` | SHOWCASE badge background |
| `showcase-600` | `#059669` | SHOWCASE badge text |
| `career-100` | `#FEF3C7` | CAREER badge background |
| `career-700` | `#B45309` | CAREER badge text |

### Forum Category Tag Colors

| Category | Background | Text |
|----------|-----------|------|
| GENERAL | `neutral-100` | `neutral-700` |
| ANNOUNCEMENTS | `warning-100` | `warning-700` |
| TECHNICAL HELP | `error-100` | `error-600` |
| SHOWCASE | `showcase-100` | `showcase-600` |
| CAREER | `career-100` | `career-700` |

### Community Feed Tag Colors

| Tag | Background | Text |
|-----|-----------|------|
| EVENT | `warning-100` | `warning-700` |
| KIGALI | `info-100` | `info-600` |
| SHOWCASE | `showcase-100` | `showcase-600` |
| WORKSHOP | `neutral-100` | `neutral-700` |
| ANNOUNCEMENT | `warning-100` | `warning-700` |

---

## 4. Spacing

**8px base grid.** All spacing must be a multiple of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight badge padding |
| `space-2` | 8px | Between related inline elements |
| `space-3` | 12px | Input padding, tight card gaps |
| `space-4` | 16px | Standard gap between components |
| `space-6` | 24px | Card internal padding |
| `space-8` | 32px | Between sections within a page |
| `space-10` | 40px | Section separators |
| `space-12` | 48px | Large section breaks |
| `space-16` | 64px | Section vertical padding (public pages) |
| `space-24` | 96px | Hero vertical padding |

**Page-level:**
- Max content width: `1440px` with `px-12` (96px) on desktop, `px-6` on tablet, `px-4` on mobile
- Admin dashboard max-width: `1280px` with `px-8`
- Sidebar width: `260px` (expanded), `72px` (collapsed)
- Navbar height: `64px`
- Section vertical padding: `64px` top + bottom on public pages
- Gap between feed cards: `24px`

---

## 5. Border Radius

**The entire design uses 0px radius.** Every card, button, input, badge, and container is a sharp rectangle.

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | **Everything** — cards, buttons, inputs, modals, nav |
| `radius-pill` | 9999px | Avatar images and status dots ONLY |
| `radius-sm` | 4px | Code snippet containers (only exception to flat UI) |

**Rule:** Never add `rounded-*` to any UI element except avatars and status indicator dots. All `rounded` classes default to `rounded-none`. This is non-negotiable — it defines the sharp editorial identity of the platform.

---

## 6. Shadows & Elevation

The design is **flat**. No box shadows on cards, buttons, or panels.

```
shadow-none:  no shadow — DEFAULT for all cards and panels
shadow-xs:    0 1px 2px 0 rgba(10, 10, 10, 0.04)  — only for floating dropdowns
shadow-md:    0 4px 12px 0 rgba(10, 10, 10, 0.10)  — modals only
```

**Usage:**
- All cards: border `1px solid #E5E5E5`, NO shadow
- Dropdowns / popovers: `shadow-xs` + `border border-neutral-200`
- Modals: `shadow-md`
- Focus rings: `0 0 0 2px rgba(29, 184, 195, 0.3)` (cyan)
- **No other shadows anywhere**

---

## 7. Component Specifications

### 7.1 Buttons

**Primary Button (Black)**
- Background: `#0A0A0A`
- Text: White, `13px` weight 600, ALL CAPS, letter-spacing `0.06em`
- Height: `44px` (default), `40px` (sm)
- Horizontal padding: `24px`
- Border radius: `0px`
- Hover: `#262626`
- Active: `#262626` + scale(0.99)
- Focus: `2px solid #1DB8C3` outline offset `2px`
- Example: "JOIN THE COMMUNITY", "SIGN IN", "REGISTER SEAT"

**Secondary Button (Outlined)**
- Background: Transparent
- Border: `1px solid #0A0A0A`
- Text: `#0A0A0A`, `13px` weight 600, ALL CAPS, letter-spacing `0.06em`
- Height: `44px`
- Hover: `bg-neutral-50`
- Example: "VIEW LOCAL PROJECTS", "SPONSOR COMMUNITY", "SLIDES", "VIDEO"

**Accent Button (Cyan)**
- Background: `#1DB8C3`
- Text: `#0A0A0A`, `13px` weight 700, ALL CAPS
- Height: `44px`
- Hover: `#17A2AD`
- Example: "JOIN DISCORD", "SUBSCRIBE", "BECOME A COMMUNITY CONTRIBUTOR →"

**Ghost / Text Link**
- Color: `#1DB8C3`
- No background, no border
- Hover: `#17A2AD`, text underline
- Example: "View Archive →", "VIEW ALL ARCHIVE", "VIEW FULL PROFILE"

---

### 7.2 Inputs

- Height: `44px`
- Background: White
- Border: `1px solid #E5E5E5`
- Radius: `0px` (sharp)
- Padding: `12px 16px`
- Text: `14px`, `#0A0A0A`
- Placeholder: `#A3A3A3`
- Focus: `1px solid #1DB8C3`, no outline
- Disabled: `bg-neutral-50`, `text-neutral-400`
- Invalid: `border-red-600`, error text `12px red-600` below

**Search Input in Navbar**
- Background: White
- Border: `1px solid #E5E5E5`
- Placeholder: "Search docs..."
- Search icon: `#A3A3A3`, left `12px`
- Height: `38px`
- Width: `200px` (expand to `280px` on focus)

**Dark Input (Newsletter widget)**
- Background: `#1A1A1A`
- Border: `1px solid #333333`
- Text: `#E5E5E5`
- Placeholder: `dev@example.rw` in `#737373`

---

### 7.3 Cards

**Default Content Card**
- Background: White
- Border: `1px solid #E5E5E5`
- Radius: `0px`
- Shadow: none
- Padding: `24px`
- Hover (interactive): `border-neutral-400`

**Dark Workshop Card**
- Background: `#111111`
- Border: none
- Radius: `0px`
- Text: White
- Session label: `primary-500` (`#1DB8C3`), `mono` font, `label` size
- Title: White, `h2` weight 700
- Date / Duration: `#737373`, `label` size ALL CAPS

**Community Feed Card (2-column)**
- Background: White
- Border: `1px solid #E5E5E5`
- Padding: `24px`
- Tag badges top, title bold large, excerpt body, horizontal rule, author row at bottom

**Member Card**
- Background: White
- Border: `1px solid #E5E5E5`
- Padding: `24px`
- Avatar: grayscale, 64×64px, `radius-pill`
- Terminal icon button top-right: `16×16px` outlined square button
- Stack tags: cyan outlined (`border: 1px solid #1DB8C3`, text `#1DB8C3`), uppercase, `tag` size
- Contributions list: `mono` font, `13px`, `neutral-500`
- Footer: colored status dot + ALL CAPS availability label (left), VIEW FULL PROFILE cyan link (right)

---

### 7.4 Category Tag Badges

- Height: `22px`
- Padding: `2px 8px`
- Radius: `0px` (sharp)
- Font: `tag` (11px, 600, ALL CAPS, 0.06em tracking)
- Colors: per §3 tag color tables

**Example — TECHNICAL HELP:**
```
bg-error-100 text-error-600, uppercase, 0px radius
```

---

### 7.5 Navigation (Top Bar)

- Height: `64px`
- Background: White
- Border bottom: `1px solid #E5E5E5`
- Logo: "REACT JS RWANDA" — `font-sans` weight 800, `16px`, `#0A0A0A`, `0.06em` tracking
- Nav items: `13px` weight 500, ALL CAPS, `0.08em` tracking, `#737373` default, `#0A0A0A` hover, active = `#0A0A0A` + `2px solid #1DB8C3` bottom underline offset 4px
- Search: outlined input (see §7.2)
- SIGN IN button: primary black button (see §7.1)
- Sticky on scroll

---

### 7.6 Forum Layout

**Left Category Navigation**
- Width: `240px`
- "Dev Console" header: small avatar + "FORUM NAVIGATION" label
- "+ Start Discussion": primary black button, full width
- Category items: `14px` weight 500, `#404040`, icon left, `40px` tall
- Active category: left `2px solid #1DB8C3` border, `bg-neutral-50`, text `#0A0A0A`

**Thread List Item**
- Category badge (per §7.4)
- "Posted Xh ago": `body-sm` `#A3A3A3`
- Title: `h2` bold, `#0A0A0A`
- Excerpt: `body` `#737373`, 2-line clamp
- Reply count: `32px` weight 800, `#0A0A0A` — displayed prominently
- "REPLIES" label: `label` `#A3A3A3`
- Participant avatars: `28×28px` overlapping stack

**Right Sidebar**
- Contribution Leaderboard: dark card (`#111111`), white title, numbered list with cyan points
- Trending Tags: `#TagName` links in cyan
- Community Stats: bordered card, COMMUNITY STATS label, count

---

### 7.7 Admin Dashboard (Sidebar Navigation)

- Width: `260px`
- Background: White
- Border right: `1px solid #E5E5E5`
- Nav items: `14px` weight 500, icon `18px`, `40px` tall, `0px` radius
- Active: `bg-neutral-50`, left `2px solid #1DB8C3`, text `#0A0A0A`
- User block: avatar + name + email, border top, bottom of sidebar

---

### 7.8 Tables (Admin)

- Header: `bg-neutral-50`, `12px` weight 600, ALL CAPS, `0.06em` tracking, `neutral-500`
- Rows: `52px` tall, `14px` `neutral-700`, `border-bottom 1px #F2F2F2`
- Hover: `bg-neutral-50`
- Selected: `bg-primary-50`
- No `rounded` anywhere on table
- Actions: right-aligned, appear on row hover

---

### 7.9 Modals

- Overlay: `rgba(10, 10, 10, 0.6)` + `backdrop-blur-sm`
- Modal: max-width `512px`
- Background: White
- Radius: `0px`
- Border: `1px solid #E5E5E5`
- Shadow: `shadow-md`
- Header: `20px` weight 700, `24px` padding, border-bottom `1px #E5E5E5`
- Body: `16px 24px`
- Footer: `16px 24px`, right-aligned buttons
- Open: scale(0.97) + opacity → scale(1), `180ms` ease-out

---

### 7.10 Empty States

- Centered in container
- Icon: `40px` `neutral-300`
- Title: `16px` weight 700 `neutral-900`
- Description: `14px` `neutral-500`, max `360px`
- CTA below: primary black button

---

### 7.11 Toasts (Sonner)

- Bottom-right
- White bg, `border 1px #E5E5E5`, `0px` radius
- Padding: `14px 16px`
- Title: `14px` weight 600 `#0A0A0A`
- Description: `13px` `#737373`
- Success: `#059669` icon
- Error: `#DC2626` icon

---

## 8. Iconography

Use **[Lucide Icons](https://lucide.dev)** (`lucide-react`).

**Sizing:**
- Navbar icons: `18px`
- Body inline: `14px`
- Card icons: `20px`
- Empty state: `40px`

**Stroke width:** `1.5` (slightly lighter than default to match the editorial feel).

**Special:** Location pin on events uses the Lucide `MapPin` icon at `14px` in `primary-500`.

---

## 9. Motion & Animation

**Fast and invisible.** Animation should enhance, never distract.

| Transition | Duration | Easing |
|-----------|----------|--------|
| Button hover | `120ms` | `ease-out` |
| Link hover | `100ms` | `ease-out` |
| Dropdown | `140ms` | `ease-out` |
| Modal enter | `180ms` | `ease-out` |
| Page fade | `250ms` | `ease-out` |
| Stat counter | `800ms` | `ease-out` (count-up on landing) |

**Use `framer-motion` for:**
- Hero stat counters (count-up animation on viewport enter)
- Page transitions (opacity fade)
- Card hover (border color transition via CSS, not framer)

**Never:**
- Bouncing, spring, or rotation animations
- Anything over `300ms`
- Parallax or scroll-jacking

---

## 10. Imagery

- **Hero image**: Black-and-white photography (developers working, Kigali skyline) inside a bordered frame with a small cyan accent card overlay
- **Event cover images**: Full-width, the dark date stamp overlay uses `bg-neutral-950/80` text white, `mono` font
- **Avatars**: Grayscale treatment (`filter: grayscale(100%)`), circular, `neutral-100` placeholder bg with initials
- **Article cover images**: Black-and-white or high-contrast photography
- **Past workshop cards**: Dark background (`#111111`) — no image, dark card with text only
- **Code snippets in cards**: `bg-neutral-950` rounded-sm block with syntax highlighting

---

## 11. Landing Page Specifics

- Hero: Two-column split — left: pill badge + ultra-heavy headline + subtext + 2 buttons + stats row; right: bordered image frame with component spotlight overlay card
- Hero headline: "Scaling the future of Rwanda with **[cyan highlight box]React[/]**." — The keyword "React" has a `bg-neutral-950 text-primary-500 px-2` highlight
- Stats row: 3 metrics, bold numerals `800` weight, muted ALL CAPS labels, no dividers between
- Section alternation: white → `neutral-50` → dark (`neutral-950`) → white
- Community Feed: 2-column masonry-style, first card is 2× larger featured card
- CTA banner: `bg-neutral-950`, full-width, bold white headline, JOIN DISCORD + SPONSOR COMMUNITY buttons
- Footer: `neutral-950` background, light gray copyright text, spaced-out nav links

---

## 12. Email Templates (React Email)

- Max width: `600px`
- Background: `#F8F8F8`
- Card: White, `border: 1px solid #E5E5E5`, `0px` radius
- Header: `#111111` bg, "REACT JS RWANDA" in white bold uppercase
- CTA button: `#1DB8C3` background, `#0A0A0A` text, `0px` radius, uppercase
- Body padding: `24px`
- Footer: `#A3A3A3`, centered, uppercase small
- Typography: `-apple-system, 'Segoe UI', Roboto, sans-serif` (Inter doesn't render in email clients)

---

## 13. Tailwind v4 CSS Configuration

Apply in `app/globals.css` using Tailwind v4 `@theme` directive — NO `tailwind.config.ts`:

```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Courier New", monospace;

  /* Primary — Cyan */
  --color-primary-50: #E6FAFB;
  --color-primary-100: #B3EFF3;
  --color-primary-500: #1DB8C3;
  --color-primary-600: #17A2AD;
  --color-primary-700: #128E98;

  /* Neutrals */
  --color-neutral-0: #FFFFFF;
  --color-neutral-50: #F8F8F8;
  --color-neutral-100: #F2F2F2;
  --color-neutral-200: #E5E5E5;
  --color-neutral-300: #D4D4D4;
  --color-neutral-400: #A3A3A3;
  --color-neutral-500: #737373;
  --color-neutral-700: #404040;
  --color-neutral-900: #0A0A0A;
  --color-neutral-950: #111111;

  /* Semantic */
  --color-success-100: #D1FAE5;
  --color-success-600: #059669;
  --color-warning-100: #FEF3C7;
  --color-warning-700: #B45309;
  --color-error-100: #FEE2E2;
  --color-error-600: #DC2626;
  --color-info-100: #DBEAFE;
  --color-info-600: #2563EB;

  /* Shadows */
  --shadow-none: none;
  --shadow-xs: 0 1px 2px 0 rgba(10, 10, 10, 0.04);
  --shadow-md: 0 4px 12px 0 rgba(10, 10, 10, 0.10);
  --shadow-focus: 0 0 0 2px rgba(29, 184, 195, 0.3);

  /* Border radius — SHARP EVERYWHERE */
  --radius: 0px;
  --radius-none: 0px;
  --radius-sm: 4px; /* code snippets only */
  --radius-pill: 9999px; /* avatars only */

  /* Spacing base */
  --spacing: 4px;
}

/* Base styles */
* {
  border-radius: 0 !important; /* Override shadcn defaults */
}

/* Exceptions */
img[class*="avatar"],
.avatar,
[data-slot="avatar"] {
  border-radius: 9999px !important;
}

.code-block {
  border-radius: 4px !important;
}
```

---

## 14. shadcn/ui Overrides

Since shadcn/ui defaults to rounded corners, override all component radius values in `components.json` and via the CSS theme:

```json
{
  "style": "default",
  "tailwind": {
    "cssVariables": true
  }
}
```

In `globals.css` after `@theme`:
```css
:root {
  --radius: 0rem;
}
```

This sets all shadcn components to `0px` radius globally, matching the design.

---

## 15. Accessibility

- Minimum touch target: `44×44px` on mobile
- Color contrast: `4.5:1` for body text (`#737373` on white passes at `4.48:1` — always verify)
- `#1DB8C3` cyan on white: `2.8:1` — do NOT use cyan as body text color, only for decorative/interactive labels. Always pair with another differentiator (underline, border, position).
- Focus rings: cyan `shadow-focus` ring on all interactive elements, never removed
- Icons used alone: `aria-label` required
- Form fields: `<label>` always linked via `htmlFor`
- Status tags: include text (not color-only communication)

---

## 16. Do's & Don'ts

**Do:**
- Use `font-mono` for @handles, session numbers, code, and API-like labels
- Use ALL CAPS + wide tracking (`0.06–0.08em`) for section labels and button text
- Use `1px solid #E5E5E5` borders on all cards — no shadow
- Use `#1DB8C3` cyan sparingly — only for interactive signals and the accent CTA
- Use black (`#0A0A0A`) filled buttons for primary actions
- Use grayscale treatment on member avatars and editorial photography
- Use heavy weights (800–900) for headlines and page titles
- Use `0px` border radius on everything except avatars (pill) and code snippets (4px)

**Don't:**
- Add `rounded-*` classes to cards, buttons, inputs, or modals — ever
- Use gradients anywhere (flat design only)
- Use more than one accent color (no purple, orange, red as brand colors)
- Use `.dark:` Tailwind classes (dark mode is explicitly not supported)
- Use font weights below 400 or above 900
- Use cyan as body text color (fails contrast)
- Use box shadows on cards or buttons
- Use emoji in UI chrome
- Hardcode pixel colors — always reference CSS custom properties
