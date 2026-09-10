# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev              # Dev server at http://localhost:3000 (redirects to /en)
npm run build            # Production build → static export in out/ (runs prebuild first)
npm run start            # Serve production build (Node mode only, not the static export)
npm run lint              # ESLint (eslint.config.mjs)
npm run typecheck        # tsc --noEmit
npm run test:e2e         # Playwright tests (e2e/*.spec.ts); auto-starts npm run dev
npm run test:e2e:ui      # Playwright UI mode
npm run htaccess         # Regenerate public/.htaccess manually (also runs as `prebuild`)
npm run optimize:assets  # scripts/optimize-assets.mjs
```

Run a single Playwright test: `npx playwright test e2e/smoke.spec.ts -g "test name"`.

Before deploying, see `.cursor/skills/cpanel-static-build/SKILL.md` for the full cPanel static-export workflow (set `NEXT_PUBLIC_SITE_URL` in `.env.local`, build, verify `out/` artifacts, upload contents of `out/` — never `.next` — to `public_html`).

## Architecture

This is a bilingual (EN/FA) Next.js App Router portfolio site, permanently configured for **static export** (`output: "export"` in `next.config.ts`) so it can be hosted on cPanel shared hosting with no Node server. Do not remove `output: "export"` unless explicitly switching deploy targets — it forbids empty `generateStaticParams()` results and disables the image optimizer (`images.unoptimized: true`).

**Routing & i18n**: Every real page lives under `src/app/[locale]/`; `src/i18n/routing.ts` defines locales (`en` default, `fa`, RTL) via `next-intl`, and `src/middleware.ts` handles locale routing (though middleware doesn't run in a static export — locale resolution for the export happens through the `[locale]` segment and `generateStaticParams`). `src/i18n/navigation.ts` provides locale-aware `Link`/`redirect`/`useRouter` wrappers — use these instead of `next/navigation` directly inside `[locale]` pages.

**Content is data, not markup**: page content (profile, experience, projects, skills, home copy, proof/stats) lives in typed files under `src/content/`, separate from UI copy in `messages/en.json` / `messages/fa.json`. Strings that vary by content item (e.g. a project description) use the `LocalizedString` type (`src/content/i18n.ts`, `{ en, fa }` objects resolved via `tContent`/`tContentList`), while chrome/UI text goes through `next-intl`'s `getTranslations`/`useTranslations` against the `messages/*.json` files. When adding content, don't hardcode English strings in components — extend the relevant `src/content/*.ts` file.

**Projects feature flag**: `src/content/projects.ts` exports `projectsEnabled` (currently `false` — real project case studies/galleries aren't ready). When disabled, project detail/list pages redirect to home and `generateStaticParams` emits a placeholder slug (`"unavailable"`) instead of an empty array, since static export rejects empty `generateStaticParams`. `scripts/generate-htaccess.mjs` (runs as `prebuild`) reads this same flag to emit 301s for `/en|fa/projects/*` in `public/.htaccess` so disabled routes don't get indexed. Follow this same placeholder-redirect pattern for any other route that might need to be feature-flagged off for static export.

**SEO**: `src/lib/seo.ts` centralizes `SITE_URL` (from `NEXT_PUBLIC_SITE_URL`), `buildPageMetadata`, `absoluteUrl`/`localePath`, and JSON-LD builders (`webPageJsonLd`, `breadcrumbJsonLd`) consumed via `src/components/seo/JsonLd.tsx`. `src/app/robots.ts` and `src/app/sitemap.ts` are `force-static` for the export. Follow the existing per-page pattern (`generateMetadata` + `<JsonLd data={[...]} />`) when adding pages.

**Gaming mode**: an optional arcade overlay (snake game, collectibles) toggled client-side. `GamingModeProvider` (`src/components/gaming/GamingModeProvider.tsx`) holds all game state (score, lives, snake) in React context + `localStorage` for the high score. `GamingLayerGate` lazy-loads the actual `GamingLayer` (`next/dynamic`, `ssr: false`) only after gaming mode is toggled on once, so the game code never ships to users who don't use it. Keep new gaming features behind this same gate/dynamic-import pattern.

**Theming**: light/dark handled by a custom provider (`src/components/providers/ThemeProvider.tsx` + `theme.ts`), not next-themes.

**Fonts**: `src/lib/fonts.ts` centralizes font setup — Space Grotesk/DM Sans for EN, Yekan Bakh (self-hosted, `public/fonts/`) for FA, Press Start 2P for the gaming HUD.
