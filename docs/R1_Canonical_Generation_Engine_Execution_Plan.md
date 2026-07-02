# R1 — Canonical Generation Engine · Engineering Execution Plan

**Document class:** Engineering execution plan (implementation checklist for Website Platform **Milestone 2**, refactor **R1**).
**Status:** **Approved engineering plan** — the checklist to follow when development begins.
**Date:** 2026-07-02
**Parent spec:** *Website Platform Milestone 2 — Canonical Generation Pipeline* (`docs/Website_Platform_Milestone_2_Generation_Pipeline.md`).
**Subordinate to:** Creative Constitution v3.0, its Appendices, the Trust Gate architecture, and Website Architecture Specification v1.

> **Documentation only.** No generator code is written by this plan. Development begins only after this plan is used as the checklist, and the cutover step is separately signed off.

---

## Architectural context (governing principle)

Canonical inputs — **Canonical Assets · Canonical Metadata · Canonical Workflows** — flow through the **Trust Gate Pipeline**, and *then* into the public-facing agents (Website, Social, Scout, Reader) that serve the public:

```
   Canonical Assets     Canonical Metadata     Canonical Workflows
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                     Trust Gate Pipeline
                               │
        ┌──────────────┬───────┴──────┬──────────────┐
        │              │              │              │
   Website Agent   Social Agent   Scout Agent   Reader Agent
        │              │              │              │
        └──────────────┴──────┬───────┴──────────────┘
                               │
                             Public
```

**The important distinction:** Trust Gates sit **between the platform and the public agents — not inside them.** The R1 generator is the Website Agent's execution substrate; it therefore **runs behind the gates** and must never let an artifact reach the public path without passing them. This plan builds the first slice of that substrate.

---

## 1. Goals
- Prove the Milestone 2 generation architecture on **standalone, data-derived artifacts** (no HTML/templating risk).
- Eliminate hand-mirroring of the render bundle and the hand-maintained sitemap — the highest-drift surfaces (D1/D4).
- Establish the reusable **generate → validate → drift-guard** loop that later artifacts (R2+) plug into, positioned behind the Trust Gate Pipeline.
- **Zero change to production behavior** at every step until an explicitly gated cutover.

## 2. Scope
- **In:** the engine + generation of `data/edenseek-data.js`, `sitemap.xml`, and (optional, future-ready) `data/search-index.json`; a **report-only** CI drift check.
- **Out (deferred — scope guard):** HTML pages/prose/templates and header/footer → **R2**; **JSON-LD & OG** (embedded in HTML `<head>` → templating) → **R2**; image derivatives → later; formal JSON Schema → **R5** (R1 uses inline schema-lite checks); **blocking** CI gates → **R4** (R1 ships report-only); **status-based content filtering** → deferred (would change output — see Risks).

## 3. Inputs
- `/data/series.json`, `books.json`, `creators.json`, `characters.json`, `news.json` (canonical).
- A **generator config**: `SITE_ORIGIN`, the sitemap route list, and the `lastmod` value (a constant matching today's committed sitemap for R1 fidelity).
- *No assets or templates are inputs in R1.*

## 4. Outputs
- `data/edenseek-data.js` (render bundle) — **the vertical slice**.
- `sitemap.xml`.
- `data/search-index.json` (optional; future-ready, not yet consumed).
- A **build report** (validation + diff results) — a CI artifact, not deployed.

### Per-artifact source-of-truth mapping
| Generated artifact | Source of truth | Generated output | Manual authorship retired |
|---|---|---|---|
| Render bundle | `/data/*.json` | `data/edenseek-data.js` | The hand-mirrored `edenseek-data.js` — file stays at the same path but ceases to be hand-edited (becomes generated; hand-edits disallowed post-cutover) |
| Sitemap | `/data/*.json` + config (routes, lastmod) | `sitemap.xml` | The hand-maintained `sitemap.xml` — same path, becomes generated |
| Search index (optional) | `/data/*.json` | `data/search-index.json` | None (net-new artifact; no manual predecessor) |

> Honest note: in R1 no file literally disappears — the two existing files persist but lose their hand-authorship. The first true *file elimination* is **R2** (the 11 duplicated header/footer blocks collapse to one templated source).

## 5. Build pipeline stages (R1 subset of the M2 8-stage pipeline)
```
S1 LOAD + SCHEMA-LITE VALIDATE   (/data/*.json → in-memory graph; fail on missing slug/url/tier/cover.base)
S2 CONTENT SELECTION             (reproduce today's selection EXACTLY — no status filtering in R1)
S5 EMIT render bundle            (deterministic serialization → candidate edenseek-data.js)
S6 EMIT sitemap (+ search index) (routes + config)
S7 VALIDATE                      (semantic deep-equal vs committed; determinism; byte-diff)
S8 WRITE candidate + REPORT      (to build/tmp; never overwrites committed until cutover)
```
*(S3 assets and S4 HTML render are not exercised in R1.)*

## 6. File dependency graph
```
/data/series.json ┐
/data/books.json  │
/data/creators.json├─►┌───────────────┐─► data/edenseek-data.js ─► (loaded by every HTML page at runtime)
/data/characters. │  │  GENERATOR     │─► sitemap.xml           ─► (search engines)
/data/news.json   ┘  │ (dev/CI only)  │─► data/search-index.json─► (future: Scout / on-site search)
gen.config ─────────►└───────────────┘─► build-report (CI artifact, not deployed)

CI shadow job ─► runs generator ─► diffs candidate vs COMMITTED outputs ─► pass / report
```
No output depends on another output; each is a pure projection of `/data` (+ config) — which is what makes them independently testable.

## 7. Smallest vertical slice (first implementation)
**Generate `edenseek-data.js` from `/data/*.json`, semantically identical to the committed bundle, in shadow (non-authoritative) mode, with a report-only CI diff.** It exercises S1→S2→S5→S7→S8 with zero HTML risk and objective verifiability (the live site already loads this file). If the generated bundle deep-equals the committed one, a visitor sees no change.

## 8. Migration strategy
Phased per artifact (bundle → sitemap → optional index); each traverses the same checkpoints; the engine is **non-authoritative** (committed files stay deployed) until a gated cutover.
| # | Checkpoint |
|---|---|
| C0 | Engine scaffolded; loads `/data`; emits candidate to `build/tmp` |
| C1 | Candidate **semantically identical** to committed (parsed object deep-equals; XML URL-set equal) |
| C2 | **Determinism** — two runs byte-identical |
| C3 | CI **shadow** job diffs candidate vs committed — **report-only** |
| C4 | Shadow diff becomes **blocking** (drift = CI failure) |
| C5 | **Cutover (held for sign-off):** artifact authoritatively generated; hand-edits disallowed |

## 9. Rollback strategy
- Through C4 the engine touches **nothing in the deploy path** → rollback = delete the generator script + CI job (no visible change to revert).
- At C5, rollback = `git revert` to the hand-maintained file (it remained the source until cutover).
- Per-artifact and per-commit independent → any step reverts without affecting the others.

## 10. Validation strategy
- **Behavioral (primary):** parsed `window.EDEN` **deep-equals** today's; confirmed by a **headless render-diff** of the data-driven grids (home/hubs/detail) before vs after. Sitemap: parse XML, assert identical URL set + `lastmod`.
- **Drift guard (secondary):** **byte-diff** vs committed is empty — or **one explicitly approved normalization** (JS formatting/line-endings don't change the parsed object).
- **Determinism:** rerun = no-op.
- **Schema-lite:** engine fails fast on missing required fields (seed of R5).
- **Toolchain purity:** dev/CI-only, no site runtime dependency, no network.

## 11. Acceptance criteria
1. A dependency-free generator (language decided at review — see Risks) reads `/data/*.json` and emits the bundle + sitemap.
2. Both outputs **semantically identical** to committed; byte-diff empty or one approved normalization.
3. Determinism proven.
4. CI **shadow drift-check** exists (report-only → blocking) and fails on **injected** drift.
5. **Zero production change** verified (headless render parity + live parity).
6. Runbook documented (how to run; equivalence decision; cutover switch).
7. **Reviewed and approved before C5 cutover.**

## 12. Risks
| # | Risk | Mitigation |
|---|---|---|
| K1 | Byte drift: hand-formatting ≠ generated formatting | Semantic deep-equal is primary; allow **one approved normalization** commit |
| K2 | Hidden content-selection differences (e.g., `draft` items) | R1 **reproduces current selection exactly**; status filtering deferred (behavior change) |
| K3 | Serialization nondeterminism (key order, unicode/quote escaping) | Stable key order + fixed serialization + determinism test |
| K4 | Sitemap `lastmod` drift | **Config constant matching committed**; record-derived `lastmod` deferred (byte change → needs approval) |
| K5 | Toolchain sprawl (introducing Node) | Single **dependency-free** script; Node-vs-Python is a decision for review |
| K6 | Scope creep into HTML/JSON-LD/OG | Hard scope boundary — those are **R2** |
| K7 | Premature blocking CI blocks unrelated PRs | **Report-only first (C3)**; blocking only after stable (C4) |
| K8 | Post-cutover hand-edit of a generated file | Blocking drift-check (C4) + runbook |

## 13. Estimated implementation order (small, independently testable commits)
| # | Commit | Proves | Prod impact |
|---|---|---|---|
| 1 | `chore(gen): generator scaffold + config (no outputs wired)` | Loads `/data`, schema-lite validates, prints report | none |
| 2 | `feat(gen): render bundle → candidate + semantic equivalence check` | Candidate bundle deep-equals committed; determinism | none |
| 3 | `ci(gen): shadow drift-check for bundle (report-only)` | CI runs generator, reports diff | none |
| 4 | `feat(gen): sitemap → candidate + equivalence check` | Sitemap URL-set + lastmod equal | none |
| 5 | `ci(gen): shadow drift-check for sitemap (report-only)` | CI reports sitemap drift | none |
| 6 | `feat(gen): search-index.json (future-ready, unconsumed)` *(optional)* | New artifact validates against index schema | none |
| 7 | `ci(gen): make bundle + sitemap drift-checks blocking (C4)` | CI fails on injected drift | none |
| 8 | `build(gen): authoritative generation / committed==generated (C5)` — **HELD for sign-off** | Cutover; hand-edits disallowed | gated cutover |

Commits 1–7 leave production untouched and are individually revertible; **commit 8 is the gated cutover**, executed only after a second review.

---

## Open decisions to lock at review (before commit 1)
- **Language/toolchain:** a single **dependency-free Node script** (natural for emitting a JS bundle + JSON; matches the JS site) **vs Python** (already used for tooling). Recommendation: **Node**, scoped explicitly as a dev/CI tool (never a site runtime dependency).
- **Equivalence standard:** accept **semantic deep-equal** as the behavioral guarantee + **one approved normalization** to reach byte-clean going forward — vs reproducing current hand-formatting byte-for-byte. Recommendation: semantic + one-time normalization.
- **Bundle location:** keep emitting to `data/edenseek-data.js` (committed) with a CI drift-check for R1 — vs generating into `build/` at deploy time (defer to M2 cutover). Recommendation: keep committed + CI drift-check for R1.

---

*End of R1 execution plan. This is the approved engineering checklist for Milestone 2 · R1. No generator code has been written; implementation begins only when this checklist is executed, and commit 8 (cutover) requires separate sign-off.*
