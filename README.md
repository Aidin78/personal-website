# Aidin Sahebi — Portfolio

Personal portfolio website for **Aidin Sahebi**, Front-End Developer & UI Designer. Built with Next.js, TypeScript, and Tailwind CSS — bilingual (English / Persian), dark mode, and an optional arcade-style gaming mode.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

## Live Demo

Deploy to Vercel and set `NEXT_PUBLIC_SITE_URL` for correct Open Graph metadata.

## Features

- **Multi-page layout** — Home, About, Projects, Project details, Contact
- **Bilingual** — `/en` (default) and `/fa` with RTL support via [next-intl](https://next-intl.dev)
- Dark mode — light / dark / system cycle via the theme toggle
- Gaming mode — optional arcade overlay with snake game, collectibles, and mini-games (Neon Blaster, Star Catcher)
- **Content-driven** — projects, experience, and skills live in typed TypeScript files
- **Responsive** — mobile nav, bento project grid, animated homepage background
- **SEO** — per-locale metadata and Open Graph images

## Tech Stack

| Layer | Tools |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| i18n | next-intl |
| Theme | Custom provider (light / dark / system) |
| Icons | Lucide React |
| Fonts | Space Grotesk, DM Sans (EN) · Yekan Bakh (FA) · Press Start 2P (gaming HUD) |

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
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
aidin-resume/
├── messages/           # en.json, fa.json — UI translations
├── public/
│   ├── CV-en.pdf       # Downloadable resume
│   ├── fonts/          # Yekan Bakh (Persian)
│   └── images/         # Profile & hero images
├── src/
│   ├── app/[locale]/   # Pages (home, about, projects, contact)
│   ├── components/     # UI, layout, gaming, pages
│   ├── content/        # profile, projects, experience, skills
│   └── i18n/           # Routing & middleware config
└── ...
```

## Customization

| What | Where |
|------|--------|
| Name, social links, images | [`src/content/profile.ts`](src/content/profile.ts) |
| Work experience | [`src/content/experience.ts`](src/content/experience.ts) |
| Projects & galleries | [`src/content/projects.ts`](src/content/projects.ts) |
| Skills | [`src/content/skills.ts`](src/content/skills.ts) |
| English UI copy | [`messages/en.json`](messages/en.json) |
| Persian UI copy | [`messages/fa.json`](messages/fa.json) |
| Resume PDF | Replace [`public/CV-en.pdf`](public/CV-en.pdf) |
| Site URL (OG tags) | `NEXT_PUBLIC_SITE_URL` in [`.env.example`](.env.example) |

## Routes

| Path | Description |
|------|-------------|
| `/en`, `/fa` | Homepage |
| `/en/about`, `/fa/about` | About & experience |
| `/en/projects`, `/fa/projects` | Project grid |
| `/en/projects/[slug]` | Project detail |
| `/en/contact`, `/fa/contact` | Contact |

## Deploy on Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
4. Deploy

```bash
npm run build
```

## Author

**Aidin Sahebi** — Front-End Developer & UI Designer

- [GitHub](https://github.com/Aidin78)
- [LinkedIn](https://linkedin.com/in/aidin78)
- [Dribbble](https://dribbble.com/aidin78)
- [CodePen](https://codepen.io/Aidin-Sahebi)

## License

Private portfolio project. All rights reserved.
