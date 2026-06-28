# Aidin Sahebi — Portfolio

Bilingual personal portfolio site built with Next.js, TypeScript, Tailwind CSS, and next-intl.

## Features

- English content from CV with Persian (`/fa`) UI scaffold and RTL support
- Sections: Hero, About, Experience, Skills, Projects, Contact
- Resume download (`/CV-en.pdf`)
- Social links: LinkedIn, Dribbble, CodePen, GitHub
- Dark mode and responsive mobile navigation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en`.

## Customization

- **Email:** set `email` in [`src/content/profile.ts`](src/content/profile.ts)
- **Persian copy:** update [`messages/fa.json`](messages/fa.json) and content files
- **Projects / experience:** edit files in [`src/content/`](src/content/)
- **Resume:** replace [`public/CV-en.pdf`](public/CV-en.pdf)

## Deploy

Deploy to [Vercel](https://vercel.com) or any Next.js host:

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- next-intl
- next-themes
- Lucide React
