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

This is a bilingual (EN/FA) Next.js App Router portfolio site, permanently configured for **static export** (`output: "export"` in `next.config.ts`) so it can be hosted on cPanel shared hosting with no Node server. Do not remove `output: "export"` unless explicitly switching deploy targets — it forbids empty `generateStaticParams()` results and disables the image optimizer (`images.unoptimized: true`). `@/*` resolves to `src/*` (`tsconfig.json`).

**Routing & i18n**: Every real page lives under `src/app/[locale]/`; `src/i18n/routing.ts` defines locales (`en` default, `fa`, RTL) via `next-intl`, and `src/middleware.ts` handles locale routing (though middleware doesn't run in a static export — locale resolution for the export happens through the `[locale]` segment and `generateStaticParams`). `src/i18n/navigation.ts` provides locale-aware `Link`/`redirect`/`useRouter` wrappers — use these instead of `next/navigation` directly inside `[locale]` pages.

**Content is data, not markup**: page content (profile, experience, projects, skills, home copy, proof/stats) lives in typed files under `src/content/`, separate from UI copy in `messages/en.json` / `messages/fa.json`. Strings that vary by content item (e.g. a project description) use the `LocalizedString` type (`src/content/i18n.ts`, `{ en, fa }` objects resolved via `tContent`/`tContentList`), while chrome/UI text goes through `next-intl`'s `getTranslations`/`useTranslations` against the `messages/*.json` files. When adding content, don't hardcode English strings in components — extend the relevant `src/content/*.ts` file.

**Projects feature flag**: `src/content/projects.ts` exports `projectsEnabled` (currently `false` — real project case studies/galleries aren't ready). When disabled, project detail/list pages redirect to home and `generateStaticParams` emits a placeholder slug (`"unavailable"`) instead of an empty array, since static export rejects empty `generateStaticParams`. `scripts/generate-htaccess.mjs` (runs as `prebuild`) reads this same flag to emit 301s for `/en|fa/projects/*` in `public/.htaccess` so disabled routes don't get indexed. Follow this same placeholder-redirect pattern for any other route that might need to be feature-flagged off for static export.

**SEO**: `src/lib/seo.ts` centralizes `SITE_URL` (from `NEXT_PUBLIC_SITE_URL`), `buildPageMetadata`, `absoluteUrl`/`localePath`, and JSON-LD builders (`webPageJsonLd`, `breadcrumbJsonLd`) consumed via `src/components/seo/JsonLd.tsx`. `src/app/robots.ts` and `src/app/sitemap.ts` are `force-static` for the export. Follow the existing per-page pattern (`generateMetadata` + `<JsonLd data={[...]} />`) when adding pages.

**Gaming mode**: an optional arcade overlay (snake game, collectibles) toggled client-side. `GamingModeProvider` (`src/components/gaming/GamingModeProvider.tsx`) holds all game state (score, snake, elapsed time, chosen snake color palette, the last run's result) in React context + `localStorage` for the high score/name/palette. It's classic one-life Snake: the first self-collision plays a "self-eating" burn animation (`triggerDeath` in `GamingPlayer.tsx`) and then ends the run for real — there's no reset-and-continue. `GamingLayerGate` lazy-loads the actual `GamingLayer` (`next/dynamic`, `ssr: false`) only after gaming mode is toggled on once, so the game code never ships to users who don't use it. `GamingHUD.tsx` drives a three-screen flow gated by provider state: `StartGate` (name + palette pick, shown when `!arenaEntered && !runResult`) → live HUD once `enterArena()` fires (`arenaEntered` also gates `GamingPlayer`/`GamingCollectibles` mounting in `GamingLayer.tsx`) → `EndScreen` (`!arenaEntered && runResult`, shown after `endRun()`, reached either by pressing Exit or by dying) with a "Play again" button (`startAgain()`, skips back straight into a fresh run without re-asking for a name) and a "Leave" button (`toggleGaming()`, which fully exits and clears `runResult`). Both gate screens share one `GatePanel`/`LeaderboardList` chrome (`GamingHUD.tsx`, close button + backdrop-click both call `onClose`) with a corner-bracket frame and a `--accent` CSS var driven by the selected palette. The panel itself never scrolls and has no height cap — only the leaderboard rows do, via `.gaming-leaderboard-scroll` (`max-height: 210px; overflow-y: auto;` in `globals.css`), so the name form / palette / Start button stay fully visible no matter how many scores exist. The backdrop (`.gaming-startgate-backdrop`) keeps `overflow-y: auto` too as a last-resort fallback, with `align-items: safe center` (declared after a plain `center` for browsers that don't support `safe`) so that fallback scroll can actually reach content a plain `center` would otherwise clip. Keep new gaming features behind this same gate/dynamic-import pattern. `src/lib/gamingSound.ts` synthesizes all SFX and the looping background arpeggio via the Web Audio API — no audio files ship. `SNAKE_ROADMAP.md` (Persian) tracks planned/completed gaming-mode features; check it off when implementing an item from it. `GamingPlayer.tsx` accepts both keyboard (arrow/WASD) and touch input (an on-screen D-pad, CSS-shown only via `@media (hover: none), (pointer: coarse)`) through the same `queueDirection`/`syncBoost` helpers and two held-input sets (`heldKeysRef` for keys, `heldPointersRef` for active touches) — add a third input source the same way rather than duplicating the direction/boost logic. Move speed scales with `level` (`tickForLevel` in `GamingPlayer.tsx`), so the loop reads the current level from a ref (`levelRef`) rather than restarting its interval on every level-up. While `gaming-mode` is active, `html.gaming-mode`/`body` get `overflow: hidden` and `.site-content` gets `pointer-events: none` in addition to its blur — without both, the blurred background page stays scrollable and clickable underneath the overlay and can steal touches meant for on-screen controls.

**Leaderboard (optional, env-gated)**: a no-login top-10 leaderboard talks directly to Supabase's REST API via `src/lib/leaderboard.ts` (no server route — this is a static export). `leaderboardEnabled` is `true` only when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set; `fetchTopScores`/`submitScore` no-op when unset or on any fetch error, so the feature degrades silently. Every path that ends a run — the Exit button, the Escape-key handler in `GamingLayer.tsx`, and dying — funnels through one shared `finishRun(score, elapsedSeconds, endRun)` helper in `gamingLeaderboardExit.ts`, which awaits `submitScoreOnExit` then calls `endRun()`, so the score submission is never duplicated across call sites. `EndScreen` re-fetches the list afterward so it can highlight the player's own just-submitted row. Schema/RLS policy lives in `supabase/leaderboard.sql` — run it in the Supabase SQL editor when standing up a new project (it's safe to re-run against an existing table missing the `duration_seconds` column). There's no server to validate a submission actually came from real play (the anon key can insert directly), so the table has a `leaderboard_scores_plausible_rate` CHECK constraint capping `score` relative to `duration_seconds`, derived from the game's real max scoring rate (see the comment above the constraint in `leaderboard.sql`) — a loose anti-cheat floor, not a guarantee.

**GitHub proof repos**: `src/lib/github.ts` fetches the repos named in `proof.githubRepos` (`src/content/proof.ts`) from the GitHub API at request time (`revalidate: 3600`), optionally authenticated with `GITHUB_TOKEN` for higher rate limits. On a failed/rate-limited response it falls back to zero-stat cards built straight from `proof.githubRepos` rather than showing nothing. Note this fetch runs at request/build time, not client-side — fine for `next build`'s static generation, but be aware the data can go stale between rebuilds since there's no ISR server to revalidate it on a static export.

**Theming**: light/dark handled by a custom provider (`src/components/providers/ThemeProvider.tsx` + `theme.ts`), not next-themes.

**Fonts**: `src/lib/fonts.ts` centralizes font setup — Space Grotesk/DM Sans for EN, Yekan Bakh (self-hosted, `public/fonts/`) for FA, Press Start 2P for the gaming HUD.

## Git commit messages

Commit messages are a single subject line only — no body/description paragraph, and no `Co-Authored-By` trailer.
