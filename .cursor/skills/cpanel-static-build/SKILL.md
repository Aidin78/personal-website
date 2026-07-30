---
name: cpanel-static-build
description: >-
  Builds the aidin-resume Next.js portfolio as a static export for cPanel File
  Manager deployment to aidinsahebi.ir. Use when the user asks to build for
  cPanel, deploy to shared hosting, upload out/, prepare public_html, or
  regenerate the static site for aidinsahebi.ir.
---

# cPanel static build (aidin-resume)

## Goal

Produce a ready-to-upload **`out/`** folder. cPanel shared hosting cannot run Node — never tell the user to upload `.next`.

## Preconditions

Confirm these are already true (do not change unless broken):

- [`next.config.ts`](next.config.ts): `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`
- [`public/.htaccess`](public/.htaccess): redirects `/` → `/en/` (copied into `out/` on build)
- [`src/app/robots.ts`](src/app/robots.ts) and [`src/app/sitemap.ts`](src/app/sitemap.ts): `export const dynamic = "force-static"`
- Domain / public URL: `https://aidinsahebi.ir`

## Build steps (agent must run)

1. Ensure site URL for this machine (PowerShell):

```powershell
Set-Content -Path .env.local -Value "NEXT_PUBLIC_SITE_URL=https://aidinsahebi.ir"
```

2. From repo root:

```powershell
npm run build
```

3. Verify export artifacts exist:

- `out/en/index.html`
- `out/fa/index.html`
- `out/robots.txt`
- `out/sitemap.xml`
- `out/.htaccess`
- `out/images/` (profile / hero assets)

4. Tell the user what to upload:

- Upload **contents of `out/`** into cPanel `public_html` for `aidinsahebi.ir` (not the `out` folder name itself, not `.next`).
- After upload, open `https://aidinsahebi.ir/en/`.
- If the browser shows “connection not secure”, SSL is a host/cPanel certificate issue — not a build failure. Point them to Let’s Encrypt / AutoSSL in cPanel.

## Do not

- Do not remove `output: "export"` for a “normal” Node deploy unless the user explicitly switches hosts.
- Do not return `[]` from `generateStaticParams` on dynamic routes — static export rejects empty results; use a placeholder + `redirect` when a feature is disabled (see projects routes).
- Do not commit `.env.local`.

## After content-only edits

If the user only changed copy/stats/experience and asks to redeploy: run the build steps above again; no config changes needed.
