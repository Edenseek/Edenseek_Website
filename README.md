# Edenseek Publishing — Website (Version 1)

The public-facing website for **Edenseek Publishing**, a publisher of cinematic comics and children's books. Static HTML/CSS/JS, built for **GitHub Pages**. No frameworks, no backend, no build step.

> **Design & architecture:** see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). Governance references: [`docs/Brand_Guide.md`](docs/Brand_Guide.md), [`docs/Asset_Pipeline.md`](docs/Asset_Pipeline.md), [`docs/Deployment_Guide.md`](docs/Deployment_Guide.md), [`docs/Future_Website_Agent.md`](docs/Future_Website_Agent.md).

## Preview locally

The site uses root-absolute paths (`/css/…`) and clean directory URLs (`/about/`), so it must be served by a static file server (not opened via `file://`):

```bash
# from the project root
py -m http.server 8765      # Windows (Python launcher)
# or: python3 -m http.server 8765
# then open http://127.0.0.1:8765/
```

Any static server works (VS Code Live Server, `npx serve`, etc.). No server-side code runs — the server just serves files.

## How it's organized (clean separation)

| Concern | Location |
|---|---|
| **Content (canonical, source of truth)** | `/data/*.json` |
| **Content (render bundle, generated)** | `/data/edenseek-data.js` → `window.EDEN` |
| **Presentation** | `/css` — `tokens.css` (design tokens) → `fonts.css` → `main.css` |
| **Behavior** | `/js/edenseek.js` (deferred, progressive enhancement) |
| **Web assets (generated)** | `/assets/{brand,covers,creators,posters,site,fonts}` |
| **Source art (preserved, untouched)** | `/Projects`, `/Logo`, `/source-originals` |
| **Pages** | root + `/comics`, `/books`, `/creators`, `/about`, `/news`, `/contact` |
| **Config** | `.nojekyll`, `CNAME`, `robots.txt`, `sitemap.xml` |
| **Docs** | `/docs` |

## Editing content

1. Edit the canonical JSON in `/data` (e.g. add an issue to `series.json`).
2. Mirror the change into `/data/edenseek-data.js` (the render bundle the pages load).
3. For new art: generate optimized derivatives into `/assets` per [`docs/Asset_Pipeline.md`](docs/Asset_Pipeline.md) — **never modify the originals**.
4. Update `sitemap.xml` if you add a page.

Grids, issue lists, creator cards, and news are rendered from data via stable `data-render` / `data-entity` hooks, so this is the only place most content changes are needed. This is also what makes the site ready for the future autonomous Website Agent ([`docs/Future_Website_Agent.md`](docs/Future_Website_Agent.md)).

## Deploy

Push to GitHub → Settings → Pages → deploy from `main` / root. `CNAME` targets `edenseek.com`. Full runbook + SEO/performance checklist in [`docs/Deployment_Guide.md`](docs/Deployment_Guide.md).

## Status

Version 1 — locally functional and verified (all routes 200, data-driven rendering confirmed via headless render). Cover synopses and news entries are placeholder copy (`draft: true` in `/data`) pending client-approved text.
