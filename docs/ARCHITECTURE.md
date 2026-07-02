# Edenseek Website — Version 1 Architecture & Design System
**Status:** Approved (2026-07-02) with refinements — this is the implementation specification.
**Author:** Lead UI/UX Architect (Claude)
**Scope:** Public-facing static website (HTML/CSS/JS only) for GitHub Pages. No frameworks, no backend.

> **Companion documents:** [`Brand_Guide.md`](Brand_Guide.md) · [`Asset_Pipeline.md`](Asset_Pipeline.md) · [`Deployment_Guide.md`](Deployment_Guide.md) · [`Future_Website_Agent.md`](Future_Website_Agent.md)

---

## 0. Executive Summary

Edenseek Publishing is a comic and children's-book publisher with two very different audiences:

- **A mature, cinematic comic line** — *I Ride for Them* (sci-fi thriller), *Society of Killers* (noir crime), both explicitly **Rated M / Mature**.
- **A bright, playful children's line** — *Egypt the Cat*, a picture-book series co-created by a father and son.

The site presents **Edenseek as a premium publishing company first**, with its individual properties showcased beneath that identity — while keeping the two audiences cleanly and safely separated. **Artwork is always the hero.**

Three cross-cutting principles govern the whole build:

1. **Canonical Data First** — every listing/grid derives from structured data in `/data/*.json`, not hardcoded markup, so a future autonomous Website Agent can regenerate the site from data alone.
2. **Preserve Existing Assets** — `/Projects`, `/Logo`, `/About` are canonical source material and are **never modified**. All optimized web assets are generated into new `/assets` folders.
3. **SEO & Discoverability First** — every page is fully optimized for search and social sharing (see §13). This is a launch requirement, not a follow-up.

The largest engineering risk is image weight (covers 1–9 MB; some source files 20–29 MB). V1 ships **zero** original files directly — only optimized derivatives.

---

## 1. Guiding Principle — Canonical Data First

Although V1 is static, **content is modeled as data, not markup.** Canonical files live in `/data`:

```
/data
  series.json       Comic series (mature line) + their issues
  books.json        Children's book series + their volumes
  creators.json     People, roles, bios, links
  characters.json   In-story characters (light in V1, scaffolded for growth)
  news.json         News/updates (placeholder entries in V1)
```

**Rendering contract:**
- **Structured lists** (series/book/creator grids, issue lists, news) are rendered by JavaScript that consumes the canonical data. HTML ships a semantic container; JS populates it; a `<noscript>`/static fallback guarantees content and crawlability without JS.
- **SEO-critical prose** (page `<title>`/description, hero copy, series synopses, headings) is authored into static HTML so it is present in the initial response.
- A generated bundle `/data/edenseek-data.js` mirrors the JSON into a `window.EDEN` global so pages render with **no server and no CORS** (works opened locally *and* on GitHub Pages). The `.json` files are the **source of truth**; the `.js` bundle is a generated artifact (the future Agent regenerates it — see [`Future_Website_Agent.md`](Future_Website_Agent.md)).

**Why:** migration to an autonomous Website Agent becomes trivial — the Agent edits canonical JSON and re-emits the bundle; the presentation layer is never hand-touched.

---

## 2. Information Architecture

**Edenseek (the company) is the top of the hierarchy.** Beneath it, content segments **by audience/format** — Comics (Mature) and Children's Books — because Edenseek serves two fundamentally different readerships, and mature/children's content must never be mixed undifferentiated.

| Entity | Canonical file | Belongs to | Has many |
|---|---|---|---|
| **Imprint / Line** | (implicit) | Edenseek | Series |
| **Series / Title** | `series.json`, `books.json` | Imprint | Issues/Books, Creator credits |
| **Issue / Book** | (nested in series) | Series | — |
| **Creator** | `creators.json` | Edenseek | Credits (↔ Series) |
| **Character** | `characters.json` | Series | — |
| **News post** | `news.json` | Edenseek | — |

Relationships are bidirectional. The model is future-proof for shop/reader/accounts without over-building V1.

---

## 3. Site Map & URLs (Version 1)

**Clean, GitHub Pages–compatible, folder-based URLs** (each page an `index.html`, so the URL is a trailing-slash directory — no `.html` in links):

```
/                              Home
/comics/                       Comics hub (Mature)
/comics/i-ride-for-them/       Series detail
/comics/society-of-killers/    Series detail
/books/                        Children's Books hub
/books/egypt-the-cat/          Series detail
/creators/                     Creators index
/about/                        About Edenseek
/news/                         News / Updates
/contact/                      Contact (mailto)
/404.html                      Custom not-found
```

Supporting files at root: `.nojekyll`, `CNAME`, `robots.txt`, `sitemap.xml`, plus `/assets`, `/css`, `/js`, `/data`, `/docs`. Originals in `/Projects`, `/Logo`, `/About` remain untouched (§11).

---

## 4. Navigation Structure

Lean top bar — **5 primary items**, company-first, no mega-menu:

```
[ EDENSEEK ]     Comics   Children's Books   Creators   About      [ News → ]
```

- Logo → Home. **Comics** and **Children's Books** carry small keyboard/tap dropdowns (series + "See all"); never hover-only.
- **Sticky header:** transparent over the hero, solidifies on scroll.
- **Mobile (< 768px):** hamburger → full-screen overlay, ≥44px targets, focus-trapped, ESC to close.
- **Footer** repeats nav + Contact/Privacy/social + both imprint marks.
- **Breadcrumbs** on detail pages (also emitted as `BreadcrumbList` JSON-LD, §13).

---

## 5. Home Page — Company First, Worlds Beneath

Answers, in order: **Who is Edenseek? · What kinds of stories? · Which worlds can I explore? · Who creates them? · How do I learn more?** Artwork remains the hero.

```
HERO (full-bleed flagship art + scrim)  → WHO IS EDENSEEK (company statement + 2 CTAs)
WHAT WE PUBLISH (value pillars)          → WHAT KINDS OF STORIES
EXPLORE THE WORLDS (comics grid)         → WHICH WORLDS  [data-driven]
FOR YOUNG READERS (lighter band, books)  → children's zone, safely separated  [data-driven]
MEET THE CREATORS (portrait strip)       → WHO CREATES  [data-driven]
OUR STORY (studio statement + About CTA) → HOW TO LEARN MORE
STAY IN THE LOOP (newsletter/news)       → engagement
FOOTER
```

---

## 6. UI/UX Design Philosophy

1. Artwork is the hero. 2. Cinematic, not cluttered (hierarchy via scale/contrast). 3. Two worlds, one house (shared skeleton, swappable theme). 4. Safe by design (mature always framed/labelled/separated). 5. Fast is a feature (LCP < 2.5s, CLS < 0.1). 6. Accessible by default (WCAG 2.2 AA). 7. Progressive enhancement (full content/nav with zero JS). Full visual spec in [`Brand_Guide.md`](Brand_Guide.md).

---

## 7. Visual Style Guide (summary)

Dark shell `--ink #0F0F12` / `--surface #17171C` / `--paper #F5F1E9`; signature `--crimson #C8161D` (hover `#E63A2E`), `--blood #7A0E12`. Per-imprint accents (I Ride scarlet+toxic-glow, SOK blood-noir, Egypt brick-red+gold+sky). Children's zone cream/gold/sky. Covers at true ~2:3, text-on-art always scrimmed, grain/vignette only on hero. Full detail in [`Brand_Guide.md`](Brand_Guide.md).

---

## 8. Typography

Self-hosted **variable** fonts (WOFF2, subset) — no external font CDN. **Fraunces** (display serif, cinematic), **Inter** (UI/body), **Fredoka** (children's rounded display). Fluid `clamp()` scale; body line-height 1.6; measure ≤ 68ch. Full scale in [`Brand_Guide.md`](Brand_Guide.md).

---

## 9. Component Library

Header/nav, mobile menu, footer, hero, section header (kicker + "See all"), **cover card**, series card, **creator card**, issue/book row, tag chip, buttons (primary/ghost), breadcrumb, imprint badge (adaptive woman-in-arch), mature notice, **responsive-image primitive** (`<picture>` webp + srcset + LQIP), lightbox, newsletter/contact (mailto). Dark + light variants. Grids are **data-driven**.

---

## 10. Responsive Design Strategy

Mobile-first. Breakpoints base `<480`, `sm ≥480`, `md ≥768` (nav appears), `lg ≥1024`, `xl ≥1440` (max width ~1320px). Fluid type; Grid + Flexbox; `aspect-ratio` on every cover box; touch targets ≥44px; hero `srcset`/`sizes`. Verified 320/375/768/1024/1440.

---

## 11. Asset Organization Strategy (Preserve Originals)

**Originals are canonical and untouched.** Optimized derivatives are generated into new `/assets` folders only.

- Formats: **WebP** (+ original fallback) via `<picture>`; AVIF a documented future enhancement.
- Responsive widths (`-400w`/`-800w`/`-1200w`/`-1600w`) + LQIP blur-up.
- Budgets: cover thumb ≤ ~60 KB, hero ≤ ~250 KB, portrait ≤ ~40 KB.
- Names **lowercase-hyphenated, no spaces** (case-sensitive host; also image-SEO friendly, §13.5).
- Tool: **ffmpeg** (standalone binary, not a site dependency). Procedure in [`Asset_Pipeline.md`](Asset_Pipeline.md). Never ship `.tif` or 16–29 MB PNGs.

> **Documented deviation:** the original `/About` source folder collided with the `/about/` page route on case-sensitive hosting. Its three founder photos were relocated **unmodified** to `/source-originals/About/` so the clean `/about/` URL works and no raw source photos are published at the web root. Originals in `/Projects` and `/Logo` are untouched. See [`Asset_Pipeline.md`](Asset_Pipeline.md).

---

## 12. GitHub Pages Deployment Strategy

`git init` → GitHub repo → Pages from `main`/root. Ship `.nojekyll`, `CNAME` (`edenseek.com`), `404.html`, plus all SEO files (§13). Self-hosted fonts + CSS (no render-blocking external requests). Verify with Lighthouse (≥95 Perf / 100 A11y / 100 SEO). Full runbook in [`Deployment_Guide.md`](Deployment_Guide.md).

---

## 13. SEO & Discoverability (Launch Requirement)

SEO is a first-class V1 deliverable. Every page must satisfy the following before launch.

### 13.1 Per-page metadata (every page, no exceptions)
- **Unique `<title>`** — pattern `Page Name — Edenseek Publishing` (home: `Edenseek Publishing — Cinematic Comics & Children's Books`).
- **Unique meta description** — 140–160 chars, human-written, page-specific.
- **Canonical URL** — absolute `https://edenseek.com/<path>/` self-referencing canonical on every page.
- **Open Graph** — `og:type`, `og:site_name` (Edenseek Publishing), `og:title`, `og:description`, `og:url`, `og:image` (absolute, 1200×630), `og:image:alt`.
- **Twitter/X card** — `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`.
- **Heading hierarchy** — exactly one `<h1>` per page; logical `<h2>`/`<h3>` nesting; no skipped levels.
- **Lang + charset + viewport** — `<html lang="en">`, `<meta charset>`, responsive viewport.

### 13.2 Site-level SEO files
- **`robots.txt`** — allow all, reference the sitemap.
- **`sitemap.xml`** — every canonical URL with `<lastmod>`; kept in sync as pages/data grow (the Agent will regenerate it — see [`Future_Website_Agent.md`](Future_Website_Agent.md)).
- **`404.html`** — on-brand, `noindex`, links back into the IA.

### 13.3 Structured data (JSON-LD)
Emit JSON-LD in `<head>` per page:
- **`Organization`** — on every page (name, url, logo, sameAs socials). Edenseek as publisher.
- **`WebSite`** — on the homepage (name, url; `SearchAction` reserved for V2 search).
- **`ComicSeries`** — on each comic series page (name, author/creator, publisher, image, genre, contentRating "Mature").
- **`Book`** / **`BookSeries`** — on each children's book/series page (name, author, publisher, image, audience).
- **`Person`** — on creator entries (name, jobTitle/role, description); creators also referenced as `author`/`creator` on their works.
- **`CreativeWork`** — for works not covered above where useful.
- **`BreadcrumbList`** — on detail pages, mirroring the visible breadcrumb.

All JSON-LD is generated from the same `/data` canonical source, so it never drifts from visible content.

### 13.4 Clean URLs
Folder-based trailing-slash URLs exactly as §3. Internal links use directory paths (`/comics/i-ride-for-them/`), never `.html`. No query strings for content. Consistent trailing slash to avoid duplicate-URL dilution.

### 13.5 Image SEO
- **Descriptive `alt`** on every meaningful image: covers → `"{Title} #{n} cover by {artist}"`; portraits → `"{Name}, {role}"`. Decorative art → `alt=""`.
- **Optimized filenames** — lowercase-hyphenated, descriptive (`i-ride-for-them-01-cover-800w.webp`), never `IMG_6142.jpg`.
- **`width`/`height` (or `aspect-ratio`)** set on images to prevent CLS.
- **Never serve originals** — only responsive derivatives (§11).
- `<picture>` with WebP + fallback; eager-load LCP hero, lazy-load below-fold.

### 13.6 Social sharing / OG preview images
- Dedicated **1200×630 OG images** for: the homepage, each comic series page, each children's book series page, and the creators/about pages.
- Stored in `/assets/site/og/`, referenced via absolute URLs in OG/Twitter tags, each with descriptive `og:image:alt`.
- Generated from approved cover/brand art (see [`Asset_Pipeline.md`](Asset_Pipeline.md)); the Agent regenerates them when key art changes.

### 13.7 Performance-as-SEO & accessibility-as-SEO
Core Web Vitals (LCP/CLS/INP), semantic HTML, descriptive link text, and WCAG 2.2 AA all directly support ranking and are treated as SEO requirements, not just quality gates.

---

## 14. Future Growth (scales without redesign)

Scale by **adding data, not restructuring**: new universes/series → append to `series.json`/`books.json` + assets (grids/hubs/sitemap/JSON-LD populate automatically); character pages → `characters.json` already scaffolded; issue timelines, creator interviews → new fields on the same render layer; merchandise/reader/accounts/AI-search → new top-level sections beside existing ones. See [`Future_Website_Agent.md`](Future_Website_Agent.md).

---

## 15. Risks & Recommendations

| # | Risk | Recommendation |
|---|---|---|
| 1 | **No master Edenseek wordmark asset** (only series logos + cat crest; woman-in-arch embedded in cover JPEGs). | V1 ships a clean **SVG wordmark + redrawn woman-in-arch mark** (bare + fedora variants). Supply a vector if one exists. |
| 2 | **Massive unoptimized images** (up to 29 MB). | Mandatory derivative pipeline (§11). Non-negotiable. |
| 3 | **Mature ↔ children's adjacency.** | Structural IA separation + "Mature" labels + acknowledgment on mature pages. |
| 4 | **Case-sensitive URLs / spaces in filenames.** | Derivatives lowercase-hyphenated; paths from `/data`. |
| 5 | **Not yet a git repo.** | `git init` in setup (done). |
| 6 | **Public vs private material** (full scripts, `.tif`). | Ship previews only unless confirmed. |
| 7 | **Creator photo/artwork rights.** | Confirm publish rights for each. |
| 8 | **Domain/DNS for edenseek.com.** | Confirm control + DNS access (also required for absolute canonical/OG URLs). |
| 9 | **Content gaps** (synopses, dates, buy links). | Placeholder copy drafted from bios/scripts, flagged for review. |

---

## 16. Implementation Roadmap

- **Phase 0 — Approval.** ✅ Done (with refinements + SEO mandate).
- **Phase 1 — Foundation.** git, scaffold, design tokens + base CSS, self-hosted fonts, core components, canonical `/data` + render bundle.
- **Phase 2 — Pages.** Home, Comics hub + 2 series, Books hub + Egypt the Cat, Creators, About, News, Contact, 404 — each with full SEO metadata + JSON-LD (§13).
- **Phase 3 — Assets/perf/a11y/SEO.** Generate derivatives + LQIP + OG images, wire `<picture>`/srcset, lightbox, reduced-motion, focus, contrast; `robots.txt` + `sitemap.xml`; Lighthouse (Perf/A11y/SEO).
- **Phase 4 — Deploy.** `.nojekyll`, `CNAME`, `404`, README handoff, GitHub Pages + domain + HTTPS verification.

---

## 17. Open Decisions (non-blocking; sensible defaults used, flagged in-page)

1. Master Edenseek **wordmark** — redraw from covers (default) or supply a vector?
2. `edenseek.com` DNS access confirmed? (Needed for custom domain + absolute canonical/OG URLs.)
3. Tagline *"Stories Born Different."* — working default, echoes the crest.
4. Scripts/PDFs public or private? (Default: not published.)
5. Fonts Fraunces + Inter + Fredoka — approved default (downloaded, self-hosted).
6. Real storefront URLs, or "Coming soon" placeholders (default)?
7. Social handles for OG/`sameAs` — placeholders until provided.
