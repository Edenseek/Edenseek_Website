# Website Platform Milestone 2 — Canonical Generation Pipeline (Architecture Specification)

**Document class:** Platform Specification (Governance Hierarchy Level 4). Extends *Website Architecture Specification v1*.
**Status:** Draft (design only — no implementation)
**Date:** 2026-07-02
**Subordinate to:** Creative Constitution v3.0, its Appendices, and the Trust Gate architecture. This document may not weaken any of them.

> **Non-goals (hard constraints).** No website redesign. No user-facing features. No code. No change to the Constitution. **No change to current production behavior** — the pipeline's first duty is to reproduce today's site faithfully. The generator is a **build/CI-time tool, never a site runtime dependency**; static delivery is preserved.

---

## 0. Objective & Design Principles

**Objective.** Eliminate all manual synchronization between canonical platform data and public website artifacts by introducing a deterministic **generation pipeline**: `canonical data + governance + assets + templates → public artifacts`. The website becomes a *projection* of the canonical data, not a hand-maintained copy of it.

**Principles.**
- **P-G1 Single source of truth, enforced structurally.** `/data/*.json` (and governance appendices) are the only authored inputs. Every generated file is a *pure function* of inputs; hand-editing a generated file is prohibited and CI-detectable.
- **P-G2 Determinism & idempotence.** Same inputs → byte-identical outputs. Re-runs are no-ops.
- **P-G3 Truth by construction.** Public prose is rendered *from* canonical fields, so Gate B ("every claim accurate") holds by construction rather than by review.
- **P-G4 Gates in the pipeline.** The automatable Trust Gates run inside the pipeline; a failing gate blocks the build (fail-closed).
- **P-G5 Fidelity-first migration.** The pipeline is introduced by proving byte-equivalence to the current site before it becomes authoritative.
- **P-G6 Projection, not framework.** A minimal purpose-built generator — not a CMS/SSG framework — consistent with static-first (WAS P4) and "no framework."
- **P-G7 Read-only on canon and originals.** The generator never writes canonical data and never mutates source art.

---

## 1. Source Inputs

All inputs are versioned, authored artifacts; the generator only reads them.

| Input | Location (interim) | Role |
|---|---|---|
| **Canonical platform data** | `/data/*.json` (series, books, creators, characters, news, site) | The content graph — source of truth |
| **Approved assets (originals)** | `/Projects`, `/Logo` (preserved, never mutated) | Source art the asset step derives from |
| **Governance metadata** | Constitution Appendix **A1** (Property Register: thesis facet, universe links) + **A2** (tiers, bridge rule) | Policy the pipeline enforces and surfaces |
| **Maturity tiers** | `tier ∈ {E,T,M}` per record (mirrors A1/A2) | Drives labels, `data-tier`, and the bridge graph |
| **Trust Gate metadata** | `status ∈ {draft,review,approved,published}`, approval/provenance, gate outcomes | Publish eligibility + human-gate record |
| **Templates & partials** | new: page templates, shared header/nav/footer, JSON-LD/meta templates | Presentation shape (structure only, not content) |
| **Design tokens & config** | `/css/tokens.css`, `SITE_ORIGIN`, budgets | Referenced, not regenerated |

**Contract:** governance metadata (A1/A2) and canonical data must agree (e.g., a record's `tier` == its A1 register tier); disagreement is a validation failure, not a silent resolution.

---

## 2. Generated Outputs

Every output below is derived; none is authored by hand.

- **HTML pages** — assembled from templates + data (one header/footer definition, expanded to all routes).
- **Page content / prose** — hero, synopsis, About, credits, issue lists rendered from canonical fields (removes the data↔HTML prose duplication).
- **Render bundle** — `edenseek-data.js` (`window.EDEN`) emitted from JSON (removes the hand-mirror).
- **JSON-LD** — Organization / WebSite / ComicSeries / BookSeries / Person / BreadcrumbList, composed from data + governance (tiers → `contentRating`, credits → `creator`).
- **Open Graph + Twitter metadata** — per page, with absolute URLs and per-title OG images.
- **`sitemap.xml`** — from the generated route graph, with `lastmod` from record timestamps.
- **RSS / news feeds** — from `news.json` (future-ready; not surfaced until enabled).
- **Search index (future-ready)** — a compact JSON index of titles/creators/characters/tiers for on-site search and Scout.
- **OG preview images + responsive derivatives (WebP/AVIF) + LQIP** — from approved key art (ffmpeg step), deterministic names.
- **`robots.txt`** — templated from config.

**Determinism note:** outputs carry no timestamps or randomness except values sourced from inputs (record `lastmod`), so builds are reproducible (dates are passed in, per the no-`Date.now()` discipline).

---

## 3. Build Pipeline

A staged, single-pass function. Each stage is pure and cacheable.

```
 authored inputs
      │
 (S1) LOAD + SCHEMA-VALIDATE canonical data ............ Gate 0
      │
 (S2) RESOLVE GOVERNANCE: merge A1/A2 (tier, facet, links);
      filter by status → only {approved,published} publish
      │
 (S3) RESOLVE ASSETS: ensure derivatives/OG/LQIP exist for
      referenced art; generate missing (ffmpeg); never touch originals
      │
 (S4) RENDER: expand templates + partials + data →
      pages, prose, JSON-LD, OG/Twitter, tier declarations,
      bridge-rule link data
      │
 (S5) EMIT DERIVED DATA: edenseek-data.js bundle
      │
 (S6) EMIT SEO/FEED: sitemap.xml, RSS, robots, search index
      │
 (S7) VALIDATE OUTPUT ................................. Gates C + D
      │
 (S8) WRITE build/ → hand off to existing Actions deploy
```

- **Runtime independence:** stages S1–S8 run in Node or Python at **CI/authoring time**; the deployed site remains static HTML/CSS/JS.
- **Separation of build vs deploy:** the generator produces `build/`; the existing GitHub Actions Pages workflow deploys it. Credentials stay with deploy, never with the generator.

---

## 4. Validation Pipeline

Validation is first-class, not an afterthought; it *is* how the pipeline enforces the Constitution.

- **Schema** — JSON Schema for every collection (required fields, tier enum, status enum). *(Gate 0)*
- **Referential integrity** — creator slugs resolve; `cover.base` maps to real derivatives; `universeLinks` resolve; every A1 property has a `thesisFacet` + link + tier.
- **Governance/safety** — every surface declares a tier (D5); **bridge-rule lint over the generated link graph** (no E-tier surface emits an ungated link to an M destination); tier == A1 register. *(Gate C — fail-closed)*
- **Truth** — rendered prose is byte-derived from the canonical field (no un-sourced strings in output). *(Gate B by construction)*
- **Output correctness** — HTML validity; JSON-LD validity (Rich-Results shape); OG/Twitter completeness; broken-link/asset scan; sitemap consistency; Lighthouse budgets (perf/a11y/SEO). *(Gate D)*
- **Determinism** — a second run yields identical bytes.
- **Migration guard** — diff generated output vs the currently committed site; during migration require **byte-equivalence or an explicitly approved diff** (this is what preserves production behavior).

---

## 5. Trust Gate Integration

The pipeline is the mechanical enforcer of the *automatable* gates; human gates are represented as **required metadata the pipeline checks**, so governance and the build are one system.

| Constitution/Spec Gate | Pipeline realization |
|---|---|
| **Gate 0 — Schema & Lifecycle** | S1 schema + S2 status filter (only `approved`/`published` publish) |
| **Gate A — Brand** | Automated D2 checks (thesis + universe marker on brand surfaces); *human sign-off for net-new brand surfaces represented as an `approved` status set by Creative Governance — pipeline refuses to publish without it* |
| **Gate B — Narrative** | Truth-by-construction (S4) + continuity refs; *Editorial (Continuity Authority) approval encoded as `status`/approver metadata the pipeline requires for narrative-bearing records* |
| **Gate C — Audience** | tier-declared + bridge-rule lint + a11y checks (S7) — fail-closed |
| **Gate D — Implementation** | build success + validators + budgets (S7) |

**Key idea:** the content-lifecycle `status` field *is* the record of human gate approvals. The pipeline cannot manufacture approval; it can only refuse to publish what isn't approved. This lets the future Website Agent operate the automatable gates fully while humans retain Gates A/B via the status they set.

---

## 6. Failure Modes

Correctness and safety gates **fail closed** (block build/deploy; last good build stays live). The runtime age gate remains fail-open (availability) — the asymmetry is deliberate: a *build* can safely refuse, a *live page* must not brick.

| Failure | Behavior |
|---|---|
| Schema invalid | Block (Gate 0); report offending record/field |
| Missing/broken asset or reference | Block; report the unresolved link |
| Unapproved `status` | Excluded from publish (a filter, not an error) |
| Bridge-rule violation on the link graph | **Block (Gate C)** — safety is non-negotiable |
| Prose ≠ canonical field | Block (Gate B) — a hand-edit crept into a generated file |
| HTML/JSON-LD/link/budget validator fails | Block (Gate D) |
| Non-deterministic output | Block — reproducibility is required |
| Migration diff mismatch | Block; require explicit approval of the diff |
| Generator crash | Fail-closed; do not deploy; alert |

Every failure is a **governed event** (reported, traceable), never a silent partial publish.

---

## 7. Incremental Rebuild Strategy

- **Content-addressed inputs.** Hash each canonical record, template, and asset. A dependency manifest maps each output → the input hashes it depends on.
- **Rebuild only what changed.** Editing one record rebuilds its pages, the affected JSON-LD/OG, and any global artifact that includes it; unaffected pages are skipped.
- **Global artifacts** (bundle, sitemap, RSS, search index) rebuild when any contributing record changes.
- **Derivative cache.** Image derivatives/OG keyed by `(source hash, params)`; regenerated only when source or params change.
- **Full rebuild is always valid** and byte-identical — used for verification and as the fallback.
- **CI cadence:** PR → build the changed subset + validate; merge to `main` → full build + deploy. Incremental for speed, full for trust.

---

## 8. Generator Ownership Boundaries

**The generator owns:** transforming *approved* canonical data + governance + templates + assets into deterministic public artifacts; running the automatable gates; emitting `build/`.

**The generator must never:**
- **author or approve content** — Publishing/humans write canon and set `status`;
- **adjudicate canon** — that is the Continuity Authority;
- **define policy** — tiers/gates/rules come from governance data (A1/A2), not generator code; the generator *enforces*, never *decides*;
- **write canonical data or mutate originals** — read-only on both; it writes only derived outputs;
- **deploy or hold credentials** — it hands `build/` to the deploy workflow;
- **be a runtime dependency** — it does not run in the browser or on the served site.

**Boundary with the Website Agent:** the Agent *orchestrates* (edit data → invoke generator → read gate results → request deploy); the generator is the **pure function the Agent must go through**. The Agent never bypasses it to hand-edit output.

---

## 9. Future Compatibility — the Platform View

Think of the canonical data as **the product**, and each surface as a **projection** produced by its own projector that shares the same schema, tiers, and validators.

```
                      Canonical Platform Data (+ governance, tiers, status)
                                     │
   ┌──────────┬───────────┬─────────┼─────────┬───────────┬──────────┐
   ▼          ▼           ▼         ▼         ▼           ▼          ▼
 Website    Scout       Reader     Store    Social    Newsletter  (future)
 generator  index +     reader-    store-   social-   feed-
 (this doc) validators  projector  projector projector projector
```

- **Website Agent** — *operates* this generator; the pipeline is its safe execution substrate (edit → build → gate → deploy).
- **Scout** — consumes the generated **search index** + canonical data; reuses the **tier/bridge validators as a shared library** for real-time safe-by-design (no re-implementation).
- **Reader** — consumes canonical issue/book records + reading assets via a reader-projector; shares the schema.
- **Store** — consumes product/price fields (future) via a store-projector; shares identity + tier.
- **Publishing** — the **upstream** authoring/approval system that *writes* canonical data and sets `status`/gate metadata; the generator is strictly downstream.
- **Social** — consumes generated OG images + canonical data; a social-projector composes gated posts.
- **Newsletter** — consumes `news.json` + the generated RSS; a newsletter-projector composes issues.

**The reusable core** to extract during M2: (a) the **canonical schema**, (b) the **tier/bridge validators**, (c) the **asset naming/derivation**. These become shared Platform libraries; the website generator is their first, reference consumer — which is exactly how a publishing platform, rather than a website, should be built.

---

## 10. Migration Strategy (from today's manual synchronization)

Fidelity-first and reversible; **no production behavior changes until cutover, and only if byte-equivalent (or an approved diff).**

- **M2.0 — Groundwork (repo hygiene, R6).** `.gitattributes` (stop CRLF churn), move ~210 MB originals to Git LFS, commit the outstanding working tree. Prerequisite; touches no output.
- **M2.1 — Shadow build.** Stand up the generator to reproduce the current site; add a CI job that generates and **diffs against committed HTML**. Deploy source unchanged. Proves fidelity with zero production impact.
- **M2.2 — Generate the low-risk, high-drift artifacts.** Switch `edenseek-data.js`, `sitemap.xml`, JSON-LD, OG to generated output (byte-diff guarded). Authoring stops hand-editing the bundle/sitemap.
- **M2.3 — Templates & partials (R2).** Header/nav/footer and page templates move into the generator; pages generated from templates + data; verify byte-diff.
- **M2.4 — Prose single-sourcing (R3).** Detail-page prose generated from canonical fields; the last hand-sync surface closes.
- **M2.5 — Schema + CI gates (R5, R4).** JSON Schema + the automatable gates become blocking in CI.
- **M2.6 — Cutover.** The generated `build/` becomes the deploy artifact (generate in the Actions workflow, or CI-check that committed output == generated). Hand-editing generated files is now disallowed and detected.

Each phase is independently revertible; the migration diff-guard is the mechanism that satisfies "do not modify current production behavior."

---

## ADR-011 — Generation replaces manual synchronization

**Status:** Proposed (Milestone 2). Extends WAS v1 ADR-001/002 and supersedes their *manual* interim reality.

**Context.** Milestone 1 ships correct output but keeps four hand-synchronized surfaces: the render bundle (mirrored from JSON), `sitemap.xml`/JSON-LD/OG, detail-page prose (duplicated from data), and header/footer (copied across 11 pages). Each is a drift surface; together they block safe autonomy (the Website Agent cannot be trusted to hand-mirror), and they do not scale as the catalog grows.

**Decision.** Introduce a deterministic, build-time **generation pipeline** that transforms canonical data + governance + assets + templates into *all* public artifacts, and **prohibit hand-editing generated files**. The website becomes a projection of canonical data.

**Rationale.**
- **Removes drift structurally** — one source of truth, enforced by determinism + CI, not by discipline.
- **Makes Gate B truth-by-construction** — prose is derived from canon, so it cannot silently diverge.
- **Enables the Website Agent** — the pipeline is a pure function with gates; the Agent edits *data* and runs it, never touching output.
- **Scales SEO/feeds** — sitemap/JSON-LD/RSS/search index are generated, not maintained.
- **Seeds the platform** — the schema + validators + asset derivation become shared libraries for Scout/Reader/Store/Social/Newsletter.
- **Preserves static delivery** — the generator is CI-time only; the served site stays framework-free static files.

**Alternatives considered.**
- *Keep manual sync + lint checks* — rejected: detects drift but doesn't remove it, and doesn't enable autonomy.
- *Client-side render everything (incl. prose) from data* — rejected: regresses SEO/perf; the static-prose exception exists deliberately.
- *Adopt a CMS/SSG framework* — rejected: over-engineered, adds runtime/dependencies, conflicts with static-first (P4) and "no framework"; a minimal purpose-built generator is sufficient.

**Consequences.** Adds a dev/CI toolchain (Node or Python) and a schema; generated files become read-only; introduces a build step (offset by incremental rebuild). Migration must prove byte-fidelity before cutover. Net: drift eliminated, autonomy unblocked, platform foundations laid.

---

## Recommended Implementation Order (R1–R5)

Dependency-ordered; **R6 (hygiene) is groundwork done first (M2.0)** but is not part of R1–R5.

1. **R5 — Canonical schema** *(define the contract before generating from it).* JSON Schema for `/data/*` + validation harness. Low risk; unlocks safe generation and the Publishing/Platform contract.
2. **R1 — Generator core** *(the keystone).* Build the pipeline (S1–S8) to emit the bundle + SEO artifacts first (lowest-risk, highest-drift), under the shadow-build byte-diff guard. Authoring stops hand-mirroring.
3. **R3 — Prose single-sourcing** *(depends on R1 rendering pages).* Detail prose generated from canonical fields; closes the data↔HTML drift.
4. **R2 — Partials/templates** *(a facet of R1's templating).* Header/nav/footer become one templated definition expanded by the generator. Listed separately because it is the largest duplication removal; folds into the generator once R1 renders pages.
5. **R4 — CI Trust Gates** *(last: they validate the now-authoritative generated output).* Wire Gates 0/C/D (schema, tier/bridge, build/link/budget) into CI as blocking.

*(R7 — AVIF — folds into R1's asset step opportunistically; not on the critical path.)*

**Why this order:** contract (R5) → generation (R1) → single-sourced content (R3) → deduplicated chrome (R2) → enforced gates (R4). Each step is shippable, byte-diff-verified, and independently revertible, so the platform gains a canonical generation pipeline without ever changing what a visitor sees — until, by design, nothing about the visitor's experience changes at all.

---

*End of Milestone 2 Architecture Specification. Design only — no code, no redesign, no Constitution change, no production behavior change.*
