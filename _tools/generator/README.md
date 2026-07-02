# Canonical Publishing Engine (`_tools/generator/`)

Dev/CI tool for **Website Platform Milestone 2**. Transforms canonical platform data (`/data/*.json`) into website artifacts. **Not a site runtime dependency** — it never runs in the browser or on the served site.

> **Why `_tools/` (underscore):** Jekyll excludes underscore-prefixed directories from the published build, so this tooling is never deployed to the public site — no `_config.yml` change required.

## Run
```
node _tools/generator/generate.js
```

## Current status — R1 · Commit 1 (scaffold)
This commit implements **only** load + schema-lite validation + a deterministic report. It **writes no files** and **modifies no website artifacts**.

- **Loads** every canonical collection in `config.js` (`series, books, creators, characters, news`).
- **Validates (schema-lite):** required fields present; `tier ∈ {E,T,M}`; cover references present; nested issue fields.
- **Reports:** a deterministic JSON report to **stdout** — engine info, per-file `sha256` + record counts, and any validation errors — with stable ordering and no timestamps.
- **Exit code:** `0` if all inputs pass; `1` on any schema-lite error (fail-closed).

Determinism: the report is a pure function of the input bytes, so repeated runs on unchanged data produce identical output.

## Not yet implemented (later commits — do not skip ahead)
- Commit 2: generate the `edenseek-data.js` render bundle (candidate + semantic-equivalence check).
- Commit 3/5: CI shadow drift-checks (report-only).
- Commit 4: generate `sitemap.xml` (candidate).
- Commit 6: `search-index.json` (optional).
- Commit 7: make drift-checks blocking.
- Commit 8: authoritative generation (cutover) — **held for sign-off**.

See `docs/R1_Canonical_Generation_Engine_Execution_Plan.md` for the full checklist.
