<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portfolio site — agent guide

A single-page personal portfolio for Sebastian Liu, built with **Next.js 16** (App
Router, Turbopack, React 19), **Tailwind CSS v4**, and **Aceternity UI**-style components
on top of [Motion](https://motion.dev). It is fully static — no server data fetching, no
API routes, no database.

## Stack at a glance

| Concern    | Choice                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| Framework  | Next.js 16 App Router (`src/app`), Turbopack by default                |
| Styling    | Tailwind v4 — config lives in CSS (`globals.css`), **not** a JS config |
| Animation  | `motion/react` (import from `motion/react`, not `framer-motion`)       |
| Icons      | `@tabler/icons-react`                                                   |
| Utilities  | `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge)                  |

## Repository structure

```
src/
├── app/
│   ├── layout.tsx        # <html>/<body>, fonts (next/font Geist), <metadata>
│   ├── page.tsx          # composes the sections in render order — the page outline
│   ├── globals.css       # Tailwind import, theme tokens, @keyframes/animations
│   └── favicon.ico
├── components/
│   ├── sections/         # full-width page sections (the content)
│   │   ├── navbar.tsx        # floating nav, hides on scroll-down
│   │   ├── hero.tsx          # name, tagline, CTAs
│   │   ├── projects.tsx      # ⭐ project data + cards (also exports SectionHeading)
│   │   ├── tech-stack.tsx    # scrolling tech rows
│   │   ├── about.tsx         # bento grid
│   │   └── contact.tsx       # CTA + footer (email, GitHub)
│   └── ui/               # reusable Aceternity-style primitives (the building blocks)
│       ├── spotlight.tsx
│       ├── text-generate-effect.tsx
│       ├── moving-border.tsx          # exports MovingBorderButton
│       ├── bento-grid.tsx             # exports BentoGrid + BentoGridItem
│       ├── infinite-moving-cards.tsx
│       ├── meteors.tsx
│       └── card-hover-effect.tsx      # available primitive, not currently used
└── lib/
    └── utils.ts          # cn() class-merge helper
```

**Two-layer model:** `ui/` holds generic, content-agnostic primitives; `sections/` wires
them together with this site's actual copy and data. Keep that separation — primitives
should never hardcode portfolio content.

## How to make clear edits

Find the right file by *what* you're changing, not by guessing:

- **Change the page order / add or remove a section** → `src/app/page.tsx`. It's a flat
  list of `<Section />` components in visual order; reordering is moving one line.
- **Edit project content** (titles, descriptions, links, tech, accent color) → the
  `projects` array at the top of `src/components/sections/projects.tsx`. Add a project by
  appending one object to that array — the layout maps over it, no JSX changes needed.
- **Edit the tech list** → the `row1` / `row2` arrays in `tech-stack.tsx`.
- **Edit hero copy / tagline / CTAs** → `hero.tsx`.
- **Edit contact email or social links** → `contact.tsx` (and the GitHub link in
  `navbar.tsx`). These are the only places personal links live.
- **Edit page title / SEO / Open Graph** → the `metadata` export in `app/layout.tsx`.
- **Restyle a primitive globally** (e.g. all bento cards) → edit the component in `ui/`.
  **Restyle one instance** → pass `className` from the section; `cn()` merges it so the
  caller's classes win over defaults. Prefer the per-instance override.

### Conventions to follow

- Anything using a hook, event handler, or `motion/*` must start with `"use client"`.
  Section components are client components; primitives that animate are too.
- Add a new animation as `@keyframes` + an `--animate-*` token inside the `@theme inline`
  block in `globals.css`, then reference it with `animate-<name>`. There is **no**
  `tailwind.config.js` — do not create one.
- Import animation APIs from `motion/react`. Import icons from `@tabler/icons-react`.
- In-page navigation uses `#anchor` hrefs that match section `id`s; smooth scroll comes
  from `scroll-behavior: smooth` in `globals.css`. Keep `id`s and nav `href`s in sync.
- Use the `@/` path alias for imports (e.g. `@/components/ui/spotlight`).

## Verify before finishing

```bash
npm run dev      # http://localhost:3000 — visual check
npm run build    # must compile + pass TypeScript with no errors
npm run lint     # ESLint (flat config; next build does NOT lint)
```

A green `npm run build` is the bar for "done" — it runs the type-checker and statically
prerenders the page.
