# ClayLabs

> Intimate pottery classes in small groups — a calm, welcoming community studio in Australia.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tests](https://img.shields.io/badge/tests-33%20passing-22c55e)](#testing)
[![WCAG](https://img.shields.io/badge/WCAG-2.1%20AA-4f46e5)](#accessibility)
[![License](https://img.shields.io/badge/license-private-64748b)](#license)

---

## Overview

The official website for **ClayLabs** — a small-group pottery studio in Australia focused on calm, hands-on craft experiences. The site is built for trust, clarity, and warmth: fast load times, full accessibility, hardened security, and a design system built to scale gracefully as the business grows.

---

## Features

| Feature | Detail |
|---|---|
| App Router | Next.js 16 with Turbopack — static by default, selective dynamism |
| React 19 + React Compiler | Automatic memoisation — no manual `useMemo` / `useCallback` |
| Theme system | Light/dark with zero flash-of-wrong-theme, persisted to `localStorage` |
| Design system | 4-colour brand palette, 8px spacing scale, fluid type scale |
| Email capture | Hero form → Server Action → Zod validation → inline success state |
| Security | CSP, HSTS, Permissions-Policy (27 directives), Privacy Sandbox opt-out |
| PWA | Web manifest, maskable icon, 192/512px icons, Apple touch icon |
| Accessibility | WCAG 2.1 AA — skip link, visible focus rings, semantic HTML, full ARIA |
| Test coverage | 33 tests — Jest + RTL, interaction-level coverage, no implementation details |
| Core Web Vitals | LCP-optimised images, zero CLS, lightweight client JS |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | [Next.js](https://nextjs.org) App Router | 16.2 |
| UI | [React](https://react.dev) + React Compiler | 19.2 |
| Language | [TypeScript](https://typescriptlang.org) | 5 |
| Styling | SCSS Modules | — |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | 7 / 4 |
| Icons | [Lucide React](https://lucide.dev) | 1.14 |
| Animation | [Framer Motion](https://framer.com/motion) | 12 |
| Testing | [Jest](https://jestjs.io) + [React Testing Library](https://testing-library.com) | 30 / 16 |
| Fonts | Inter (body), Poxe (display) via `next/font` | — |
| Bundler | Turbopack | built-in |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10

### Install

```bash
git clone https://github.com/your-org/claylabs.git
cd claylabs
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000) with hot reload via Turbopack.

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

### Testing

```bash
npm test                 # single run
npm run test:watch       # watch mode
npm run test:coverage    # with coverage report
```

---

## Project Structure

```
claylabs/
├── public/
│   ├── assets/
│   │   ├── favicons/            # Favicon set — ICO, SVG, PNG 192/512, maskable, Apple touch
│   │   ├── landing/             # Landing page images (hero, session cards, footer)
│   │   └── og/                  # Open Graph images (1200×630 px)
│   └── site.webmanifest         # PWA manifest
│
└── src/
    ├── app/
    │   ├── _components/
    │   │   ├── (landing)/       # Landing page sections (one directory per section)
    │   │   │   └── Hero/        # Hero section + EmailForm client component
    │   │   └── (root)/          # Shared chrome
    │   │       └── Navbar/      # Sticky nav with theme toggle
    │   ├── actions/
    │   │   └── submitEmail.ts   # Server Action — email validation (transport: TBD)
    │   ├── fonts/               # Local font files (Poxe OTF)
    │   ├── layout.tsx           # Root layout, global metadata, JSON-LD, theme script
    │   └── page.tsx             # Homepage — sections composed here
    └── styles/
        ├── _variables.scss      # Design tokens — colours, spacing, type, radii, shadows
        ├── _mixins.scss         # Reusable helpers — container, respond-to, focus-ring, etc.
        └── globals.scss         # CSS reset, base styles, theme custom properties
```

Each component lives in its own directory alongside its SCSS module and `__tests__/` folder:

```
Hero/
├── Hero.tsx
├── Hero.module.scss
├── EmailForm.tsx
└── __tests__/
    ├── Hero.test.tsx
    └── EmailForm.test.tsx
```

---

## Design System

### Brand Colours

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--color-bg` | `#FDF4ED` | `#2A1101` | Page background |
| `--color-text-primary` | `#2A1101` | `#FDF4ED` | Headings, primary text |
| `--color-text-secondary` | `#7A5C44` | `#C4977A` | Body copy, captions |
| `--color-border` | `#E8D5C4` | `#4A2E15` | Borders, dividers |

Theme tokens are defined as CSS custom properties in `globals.scss` and toggled via `data-theme` on `<html>`. The blocking inline theme script in `layout.tsx` prevents any flash of the wrong theme.

### Spacing

Strict 8px base scale. All spacing uses `$space-N` tokens — no arbitrary pixel values.

| Token | Value |
|---|---|
| `$space-1` | 8px |
| `$space-2` | 16px |
| `$space-3` | 24px |
| `$space-4` | 32px |
| `$space-6` | 48px |
| `$space-8` | 64px |
| `$space-10` | 80px |
| `$space-12` | 96px |

### Breakpoints

Mobile-first. All responsive rules use `@include respond-to('X')`.

| Name | Min-width | Target |
|---|---|---|
| `sm` | 480px | Large mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Ultra-wide |

**Max content width: 1440px.** Set via `$max-content-width` in `_variables.scss` and enforced by `@mixin container`. Nothing exceeds this (except the footer).

### Typography

| Role | Font | Notes |
|---|---|---|
| Display / Logo | Poxe (local OTF) | Letter-spacing −2%, `preload: false` |
| Body / UI | Inter (Google Font) | Weights 400 + 500, `display: swap` |

---

## Security

Security headers are configured in [`next.config.ts`](./next.config.ts) and applied to every route. They are never overridden at the page or component level.

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'` — deny by default, no wildcards |
| `Strict-Transport-Security` | 2-year HSTS + `includeSubDomains` + `preload` |
| `Permissions-Policy` | 27 directives — Privacy Sandbox fully opted out |
| `X-Frame-Options` | `DENY` (belt-and-suspenders alongside `frame-ancestors: none`) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` |

Full security rule set and guidance for adding third-party integrations: [AGENTS.md](./AGENTS.md).

---

## Accessibility

Every component targets WCAG 2.1 AA:

- One `<h1>` per page, logical heading hierarchy
- Skip-to-main-content link as the first focusable element
- All interactive elements keyboard-accessible with visible `focus-visible` rings
- Meaningful `alt` text on all images; decorative images use `alt=""`
- ARIA labels on icon-only buttons
- Form success/error states announced via `role="status"` + `aria-live="polite"`
- No colour as the sole means of conveying information

---

## Environment Variables

No environment variables are required to run locally.

When email delivery is wired up, add to `.env.local`:

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key for [Resend](https://resend.com) email delivery |

Never prefix server-side secrets with `NEXT_PUBLIC_`.

---

## Page Architecture

Landing page build order per design spec:

```
Hero  ✅  →  Problem  →  Solution  →  What We Do  →  Stages & Services
          →  Work / Concept  →  Testimonials  →  Footer
```

Each section is built one at a time, verified against the Figma design, and committed independently.

---

## Contributing

This is a private client project managed by [Qera Studio](https://qera.studio).

Before making any changes, read:
- [CLAUDE.md](./CLAUDE.md) — project context, philosophy, collaboration rules
- [AGENTS.md](./AGENTS.md) — production standards, coding rules, security and accessibility requirements

All four production standards must be met before any task is considered done: **Accessibility · Tests · Security · Performance**.

---

## License

Private — all rights reserved. © ClayLabs Australia.
