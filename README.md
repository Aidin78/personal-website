# Aidin Sahebi — Portfolio

Personal portfolio site for **Aidin Sahebi**, Front-End Developer & UI Designer. A bilingual (English / Persian), editorial-style Next.js site with dark mode, live GitHub project stats, and a full retro **Snake game** built into the page as an interaction/animation showcase.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Playwright](https://img.shields.io/badge/Tested_with-Playwright-2EAD33?logo=playwright)

## Live Demo

Production domain: [aidinsahebi.ir](https://aidinsahebi.ir). Set `NEXT_PUBLIC_SITE_URL` for correct Open Graph metadata and sitemap URLs.

## Features

- **Bilingual** — `/en` (default) and `/fa` with full RTL support via [next-intl](https://next-intl.dev)
- **Dark / light mode** — custom theme provider, no flash of unstyled theme
- **Content-driven** — profile, experience, skills, and home copy live in typed TypeScript files, separate from UI strings
- **Live GitHub proof section** — pulls star/fork counts for pinned repos from the GitHub API
- **SEO** — per-locale metadata, JSON-LD, sitemap, and robots.txt, all static-export friendly
- **Static export** — ships as plain HTML/CSS/JS for cPanel-style shared hosting, no Node server required

### 🐍 Gaming mode

An optional arcade overlay, toggled from a banner on the home page — a full one-life Snake game rather than a gimmick:

- Keyboard (WASD / arrows), on-screen D-pad (touch), and gamepad input
- 6 selectable snake color palettes
- Collectible orbs, static obstacles, and temporary power-ups (shield, slow-down, double score)
- Two modes: endless play and a 60-second Time Attack
- Level-based speed scaling, particle bursts, boost trail, and a level-up screen flash
- Synthesized 8-bit sound effects and a looping background arpeggio (Web Audio API, no audio files)
- Optional no-login Top 10 leaderboard (today / week / all-time) via Supabase, with a plausibility check against fabricated scores
- Share your result via the Web Share API or clipboard fallback

## Tech Stack

| Layer | Tools |
|-------|--------|
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl |
| Theme | Custom provider (light / dark) |
| Icons | Lucide React |
| Fonts | Space Grotesk, DM Sans (EN) · Yekan Bakh (FA) · Press Start 2P (gaming HUD) |
| Leaderboard | Supabase (REST API only, no SDK) |
| E2E testing | Playwright |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install & run

```bash
git clone https://github.com/Aidin78/aidin-resume.git
cd aidin-resume
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en`.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build → static export in `out/` |
| `npm run start` | Serve the production build (Node mode only) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run test:e2e` | Run the Playwright e2e suite (auto-starts the dev server) |
| `npm run test:e2e:ui` | Run Playwright in UI mode |
| `npm run htaccess` | Regenerate `public/.htaccess` manually |
| `npm run optimize:assets` | Optimize images/assets in `public/` |

## Environment Variables

All optional except the site URL, which only matters for correct absolute links in metadata. Copy [`.env.example`](.env.example) to `.env.local` and fill in what you need:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Base URL used for Open Graph tags, JSON-LD, and the sitemap |
| `GITHUB_TOKEN` | Raises GitHub API rate limits for the home page's live proof section |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Enables the gaming-mode leaderboard. Run [`supabase/leaderboard.sql`](supabase/leaderboard.sql) in a free Supabase project's SQL editor first |

Without the Supabase variables the leaderboard silently disables itself — the game still works fully offline.

## Project Structure

```
aidin-resume/
├── e2e/                # Playwright end-to-end tests
├── messages/           # en.json, fa.json — UI translations
├── public/
│   ├── CV-en.pdf       # Downloadable resume
│   ├── fonts/          # Yekan Bakh (Persian)
│   └── images/         # Profile & hero images
├── scripts/            # Build helpers (.htaccess generation, asset optimization)
├── src/
│   ├── app/[locale]/   # Pages (home, about, projects, contact)
│   ├── components/     # UI, layout, gaming, pages
│   ├── content/        # profile, projects, experience, skills, proof
│   └── i18n/           # Routing & locale config
├── supabase/           # SQL schema for the optional leaderboard
└── ...
```

## Customization

| What | Where |
|------|--------|
| Name, social links, images | [`src/content/profile.ts`](src/content/profile.ts) |
| Work experience | [`src/content/experience.ts`](src/content/experience.ts) |
| Projects & galleries | [`src/content/projects.ts`](src/content/projects.ts) |
| Skills | [`src/content/skills.ts`](src/content/skills.ts) |
| Home GitHub proof repos | [`src/content/proof.ts`](src/content/proof.ts) |
| English UI copy | [`messages/en.json`](messages/en.json) |
| Persian UI copy | [`messages/fa.json`](messages/fa.json) |
| Resume PDF | Replace [`public/CV-en.pdf`](public/CV-en.pdf) |
| Site URL (OG tags) | `NEXT_PUBLIC_SITE_URL` in [`.env.example`](.env.example) |

## Routes

| Path | Description |
|------|-------------|
| `/en`, `/fa` | Homepage |
| `/en/about`, `/fa/about` | About & experience |
| `/en/projects`, `/fa/projects` | Project grid — currently redirects to home; flip `projectsEnabled` in [`src/content/projects.ts`](src/content/projects.ts) to enable |
| `/en/projects/[slug]` | Project detail |
| `/en/contact`, `/fa/contact` | Contact |

## Testing

End-to-end coverage lives in [`e2e/`](e2e) and runs against a real browser via Playwright, covering the core pages, locale/theme switching, and a full gaming-mode run.

```bash
npm run test:e2e                                    # full suite
npx playwright test e2e/gaming.spec.ts               # just the gaming-mode tests
npx playwright test e2e/smoke.spec.ts -g "test name"  # a single test by name
```

## Deploy on cPanel (static export)

This project builds to a static `out/` folder suitable for shared hosting with File Manager.

1. Set the public site URL (PowerShell example):

```powershell
Set-Content -Path .env.local -Value "NEXT_PUBLIC_SITE_URL=https://aidinsahebi.ir"
```

2. Build:

```bash
npm run build
```

`prebuild` regenerates `public/.htaccess` from `projectsEnabled` (301s for disabled project stubs, HTTPS, www→apex, `/`→`/en/`).

3. In cPanel File Manager, open `public_html` for `aidinsahebi.ir`.
4. Upload **the contents** of the `out/` folder (not the folder itself) — or zip `out/` contents, upload, and extract.
5. Confirm DNS for `aidinsahebi.ir` points at the host, then open `https://aidinsahebi.ir/en/`.

`public/.htaccess` is copied into `out/` and redirects `/` → `/en/`.

### Deploy on Vercel (Node)

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_SITE_URL=https://aidinsahebi.ir`
4. Note: current `next.config.ts` uses `output: "export"` for cPanel. For Vercel SSR you would remove that setting.

## Author

**Aidin Sahebi** — Front-End Developer & UI Designer

- [GitHub](https://github.com/Aidin78)
- [LinkedIn](https://www.linkedin.com/in/aidin78)
- [Dribbble](https://dribbble.com/aidin78)

## License

Private portfolio project. All rights reserved.
