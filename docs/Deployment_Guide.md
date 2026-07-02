# Edenseek Deployment Guide (GitHub Pages)
**Canonical deployment + SEO/performance runbook.** Version 1.0 — 2026-07-02.

The site is 100% static (HTML/CSS/JS). No build step, no backend. It is designed to hit **Lighthouse Performance 95+, Accessibility 100, Best Practices 100, SEO 100.**

---

## 1. Repository → GitHub Pages

1. `git init` (done). Commit in logical milestones (see §7).
2. Create the GitHub repo and push `main`.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / root (`/`).**
4. Required root files (all shipped):
   - **`_config.yml`** — Jekyll `exclude:` list so branch-deploy publishes **only the production site** (~5.6 MB), keeping `Projects/`, `Logo/`, `source-originals/`, `docs/` in the repo but unpublished. (Replaces the earlier `.nojekyll`; do not re-add `.nojekyll` or the excludes stop applying. Pages have no front matter, so Jekyll copies them verbatim.)
   - **`CNAME`** — contains `edenseek.com`.
   - **`404.html`** — on-brand, `noindex`.
   - **`robots.txt`**, **`sitemap.xml`** — SEO (see §3).
5. **Custom domain:** set `edenseek.com` in Pages settings; DNS: apex `A`/`ALIAS` → GitHub Pages IPs (185.199.108–111.153) and/or `www` `CNAME` → `<user>.github.io`. **Enforce HTTPS** (checkbox) once the cert provisions.

> Absolute canonical + Open Graph URLs assume `https://edenseek.com/`. If the domain changes, update the `SITE_ORIGIN` in `/js/edenseek.js` and the canonical/OG tags + `sitemap.xml`.

---

## 2. Directory contract (clean separation)

| Concern | Location |
|---|---|
| **Presentation** | `/css` (tokens → base → components → pages) |
| **Behavior** | `/js` (deferred, progressive enhancement) |
| **Content (canonical)** | `/data/*.json` |
| **Content (render bundle)** | `/data/edenseek-data.js` (generated) |
| **Assets (derived)** | `/assets/{brand,covers,creators,posters,site,fonts}` |
| **Assets (source, untouched)** | `/Projects`, `/Logo`, `/About` |
| **Configuration** | root: `.nojekyll`, `CNAME`, `robots.txt`, `sitemap.xml`, meta |
| **Docs** | `/docs` |

Source-art folders and `/docs` are content/reference and can remain in the repo; they are not linked from pages and don't affect Pages output.

---

## 3. SEO checklist (every deploy)

Per-page (verified on all 11 pages):
- [ ] Unique `<title>` (`Page — Edenseek Publishing`).
- [ ] Unique meta description (140–160 chars).
- [ ] `<link rel="canonical">` absolute, self-referencing, trailing slash.
- [ ] Open Graph: type, site_name, title, description, url, image (1200×630 absolute), image:alt.
- [ ] Twitter: `summary_large_image`, title, description, image, image:alt.
- [ ] Exactly one `<h1>`; logical `<h2>/<h3>`; no skipped levels.
- [ ] `<html lang="en">`, charset, viewport.
- [ ] JSON-LD (see §3.1).

Site-level:
- [ ] **`robots.txt`** allows all + `Sitemap: https://edenseek.com/sitemap.xml`.
- [ ] **`sitemap.xml`** lists every canonical URL with `<lastmod>`.
- [ ] `404.html` is `noindex`.
- [ ] Internal links use clean directory URLs (no `.html`); consistent trailing slash.

### 3.1 JSON-LD coverage
- `Organization` — every page. · `WebSite` — home. · `ComicSeries` (contentRating "Mature") — comic series pages. · `Book`/`BookSeries` (audience children) — book pages. · `Person` — creators. · `BreadcrumbList` — detail pages. All generated from `/data`.

### 3.2 Image SEO
Descriptive `alt`; optimized lowercase-hyphenated filenames; `width`/`height` or `aspect-ratio` set; only responsive derivatives served; `<picture>` WebP + fallback.

---

## 4. Core Web Vitals / performance

Targets: **LCP < 2.5s, CLS < 0.1, INP < 200ms.**
- **Images:** responsive `srcset`/`sizes`; **eager + `fetchpriority="high"`** on the LCP hero only; **`loading="lazy"`** on everything below the fold; every image in an `aspect-ratio` box + LQIP (no layout shift).
- **Fonts:** self-hosted WOFF2, `font-display: swap`; **preload only the critical fonts** (Fraunces + Inter) used above the fold; Fredoka loads normally (kids zone only). Subset to latin.
- **CSS:** small, token-driven, load order tokens→base→components→pages; critical rules kept minimal; no external stylesheet requests (no CDN).
- **JS:** single deferred script (`<script src="/js/edenseek.js" defer>`); no framework; no render-blocking; enhancement only.
- **No third-party requests** on load (no external fonts/analytics/embeds) → strong Best-Practices/Privacy score.

---

## 5. Accessibility (target 100)

WCAG 2.2 AA: contrast (§Brand_Guide), visible ≥2px focus rings, one `<h1>`/page, landmark regions (`header`/`nav`/`main`/`footer`), descriptive `alt` + link text, `aria` on menu/lightbox, `prefers-reduced-motion` honored, keyboard-operable nav/dropdowns/lightbox, skip-to-content link.

---

## 6. Pre-launch verification

1. Serve locally (any static server, e.g. `npx serve`, VS Code Live Server) **or** open `index.html` directly — the `window.EDEN` bundle means grids render without a server.
2. Run **Lighthouse** (mobile) on Home + one comic + one book + creators; confirm 95/100/100/100.
3. Validate: [Rich Results Test] (JSON-LD), [OG debugger] (social cards), HTML validator, and a link check (no `.html`, no broken assets, no references to originals).
4. Verify no image request > its budget (§Asset_Pipeline) and no `.tif`/oversized PNG is fetched.

---

## 7. Incremental commit plan

Build/commit in milestones (not one mega-commit):
1. `chore: scaffold, git, docs, design tokens`
2. `feat: canonical data model + render bundle`
3. `feat: base styles, fonts, core components`
4. `feat: home page (company-first, data-driven grids)`
5. `feat: comics + books hubs and series detail pages`
6. `feat: creators, about, news, contact, 404`
7. `perf: optimized image derivatives + LQIP + OG images`
8. `feat: SEO files (robots, sitemap, JSON-LD) + final a11y/perf pass`

Each commit should leave the site in a working state.

---

## 8. Post-launch / future

The **Website Agent** ([`Future_Website_Agent.md`](Future_Website_Agent.md)) will own regeneration of `edenseek-data.js`, `sitemap.xml`, OG images, and image derivatives, plus deployment automation and health monitoring — without changing this deployment contract.
