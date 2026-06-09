# Sebastian Liu — Portfolio

A personal portfolio built with **Next.js 16** (App Router) and **Aceternity UI** style
components, showcasing my projects.

## Featured projects

- **[Spotify Playlist Generator](https://github.com/jw7914/Spotify-Playlist-Generator)** —
  A full-stack AI "DJ" that pairs the Spotify API with Google Gemini to turn a plain-English
  mood into a playlist saved straight to your account. ([Live demo](https://spotifyplaylistgen.vercel.app/))
- **[Emotional Recognition](https://github.com/SebL2/Emotional_Recognition_Application)** —
  A from-scratch PyTorch CNN trained on FER2013 that classifies facial emotions from a live
  webcam feed in real time using OpenCV.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19
- [Tailwind CSS v4](https://tailwindcss.com)
- [Aceternity UI](https://ui.aceternity.com) components (Spotlight, Text Generate, Moving
  Border, Bento Grid, Infinite Moving Cards, Meteors) built on [Motion](https://motion.dev)
- [`@tabler/icons-react`](https://tabler.io/icons)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Structure

```
src/
├── app/                  # layout, page, global styles + theme/animations
├── components/
│   ├── sections/         # navbar, hero, projects, tech-stack, about, contact
│   └── ui/               # Aceternity-style primitives
└── lib/utils.ts          # cn() class-merge helper
```

Edit your details in `src/components/sections/` (links, copy) and the project data array in
`src/components/sections/projects.tsx`.
