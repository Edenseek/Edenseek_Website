# Edenseek Autonomous Website Agent — Future Architecture
**Architectural blueprint only. Nothing here is implemented in Version 1.** Version 1.0 — 2026-07-02.

This document describes the long-term architecture for an **autonomous Website Agent** that will operate and grow the Edenseek website. V1 is deliberately built to make this Agent trivial to introduce later: canonical data, deterministic asset naming, semantic + stably-identified markup, and a static deployment target.

---

## 1. Purpose

The Agent is a supervised automation layer that maintains the public website so humans can work at the level of *content and approvals* rather than files and markup. Responsibilities:

1. **Publishing approved content** — turn approved records into live pages.
2. **Synchronizing canonical metadata** — keep `/data`, rendered pages, sitemap, and JSON-LD in lockstep.
3. **Optimizing images** — run the ffmpeg pipeline on new source art.
4. **Generating thumbnails / derivatives / OG images** — all responsive sizes + LQIP + social cards.
5. **Managing news updates** — schedule/publish `news.json` entries.
6. **Shopping-cart integration** — sync products/prices/inventory to storefront (V-future).
7. **Google Workspace / mail workflows** — newsletter, contact routing, approvals via email.
8. **Deployment automation** — commit, build (if any), push, verify Pages.
9. **Monitoring website health** — uptime, Lighthouse/CWV, broken links, broken images, SEO regressions.

---

## 2. Why V1 already enables this

| V1 decision | Agent benefit |
|---|---|
| **Canonical `/data/*.json`** | The Agent's read/write surface is data, not HTML. |
| **Generated `edenseek-data.js` + `sitemap.xml`** | Deterministic artifacts the Agent regenerates from data. |
| **Deterministic asset naming** (`{slug}-{qualifier}-{width}w.webp`) | The Agent computes asset paths without guessing. |
| **Originals preserved, derivatives generated** | The Agent can always re-derive; never destroys source. |
| **Semantic HTML + stable `id`/`data-*` hooks** | The Agent targets `data-section`/`data-entity`/`id`, never brittle CSS classes. |
| **Static GitHub Pages** | Deployment = commit + push; nothing to orchestrate. |

---

## 3. The stable interface: identifiers & data attributes

V1 markup exposes machine-stable hooks so the Agent (or any future tool) can locate and regenerate regions without parsing presentation:

- **Regions:** `<section id="explore-worlds" data-section="series-grid">…`
- **Entities:** `<article data-entity="series" data-slug="i-ride-for-them">…`
- **Render targets:** `data-render="comics-grid|books-grid|creators-grid|news-list|issues"`
- **Editable fields (future):** `data-field="synopsis|title|tagline"` for surgical updates.
- **Data provenance:** every rendered node traces to a `/data` record by `slug`/`id`.

Contract: **the Agent edits `/data` and regenerates artifacts; it does not hand-edit rendered HTML.** Presentation classes may change freely without breaking automation because automation never depends on them.

---

## 4. Component architecture (future)

```
                 ┌─────────────────────────────┐
   Approvals ───▶│      Orchestrator (Agent)    │◀── Health signals
 (human / mail)  └──────────────┬──────────────┘
                                │ tools
   ┌───────────┬───────────┬────┴─────┬────────────┬─────────────┐
   ▼           ▼           ▼          ▼            ▼             ▼
 Content     Asset       SEO        Deploy      Comms        Monitor
 Service     Service     Service    Service     Service      Service
 (edit       (ffmpeg     (sitemap,  (git push,  (Workspace,  (Lighthouse,
  /data)      derive)     JSON-LD,   Pages)      mail, cart)  links, uptime)
                          OG)
```

- **Content Service** — CRUD over canonical `/data`; validates against a schema; regenerates `edenseek-data.js`.
- **Asset Service** — watches `/Projects` for new originals; runs Asset_Pipeline recipes; writes `/assets`.
- **SEO Service** — regenerates `sitemap.xml`, JSON-LD blocks, and OG images on content change.
- **Deploy Service** — milestone commits, push, verify Pages + HTTPS.
- **Comms Service** — newsletter (Google Workspace/Gmail), contact-form routing, cart/storefront sync.
- **Monitor Service** — scheduled Lighthouse + CWV, broken-link/image scans, SEO diff alerts; opens tasks/PRs on regression.

---

## 5. Content lifecycle (future)

```
Draft (in /data, unpublished) → Review → Approved → Published (rendered + deployed) → Monitored
                                   ▲                                                     │
                                   └───────────────── revision requested ◀──────────────┘
```

Each record carries `status` (`draft|review|approved|published`), `publishAt`, and an audit trail. The Agent only publishes `approved` records.

---

## 6. Guardrails

- **Human-in-the-loop** for anything public-facing, commercial, or irreversible (publishing, pricing, mailing).
- **Never modify source originals**; only generate derivatives.
- **Schema validation** before any write; reject malformed data.
- **Dry-run + diff** before deploy; every change is a reviewable commit.
- **Rollback** = revert commit (static host makes this clean).
- **Least privilege** on Workspace/storefront credentials; secrets never in the repo.
- **Content safety:** enforce the mature/children's separation rules structurally.

---

## 7. Phased roadmap (future, post-V1)

1. **Read-only monitor** — health/SEO/CWV dashboards + alerts. Lowest risk.
2. **Asset automation** — auto-derive images + OG on new source art.
3. **Content sync** — schema-validated `/data` edits + artifact regeneration, human-approved.
4. **News automation** — scheduled publishing from `news.json`.
5. **Deploy automation** — commit/push/verify.
6. **Comms** — newsletter + contact + Workspace workflows.
7. **Commerce** — cart/storefront + reader platform + accounts.
8. **AI search** — index `/data` for the planned on-site search.

Each phase is independently shippable and preserves the V1 deployment contract.
