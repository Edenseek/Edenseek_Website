# Editorial Reconciliation Checklist — Render Bundle vs Canonical Data

**Origin:** R1 · Commit 2 semantic-equivalence finding (Website Platform Milestone 2).
**Status:** Open — must be resolved before the Canonical Publishing Engine becomes authoritative.
**Rule:** every "source of truth" below is left as **REQUIRES HUMAN DECISION**. No content is reconciled by this document.

---

## Context

The Commit‑2 semantic comparison (`node _tools/generator/build-bundle.js`) found **11 differences** between the canonical data and the live render bundle. `site`, `series`, and `books` are **already in sync** (no action). Drift exists only in **creators (8)**, **characters (1)**, and **news (2)** — because Phase 1 updated those fields in the *bundle* but not in canonical `/data`.

- **Canonical** = current `/data/*.json`.
- **Bundle** = current live `data/edenseek-data.js`.

**Recommended home (applies to all 11):** every differing field is **authored narrative content** → it should live in **Canonical data** and be **derived (generated)** into the bundle. **None is presentation-only.** The open question for each is *which of the two current texts becomes the canonical value*.

---

## A. Characters (1)

**1. `characters.joy.description`** — `data/characters.json`
- **Canonical:** "A nurse navigating the neon underbelly of a near-future city, protecting the children no one else will."
- **Bundle:** "An AI midwife who becomes the protector of the abandoned digital children in her care."
- **Source of truth:** **REQUIRES HUMAN DECISION**
- **Recommended home:** Canonical data → derived into bundle
- **Evidence:** Bundle matches the approved *I Ride for Them* manuscript (Joy is an **AI midwife**, not a nurse). Canonical is the pre‑Phase‑1 placeholder flagged inaccurate in the Canonical Content Alignment.

## B. News (2)

**2. `news[society-of-killers-2].summary`** — `data/news.json`
- **Canonical:** "The Society's deadliest members step into the light. Issue #2 continues the noir-soaked saga."
- **Bundle:** "The next chapter of the Kellerman Institute continues."
- **Source of truth:** **REQUIRES HUMAN DECISION**
- **Recommended home:** Canonical data → derived into bundle
- **Evidence:** Bundle aligns with the approved SOK premise (the Kellerman Institute); Canonical uses the old "noir-soaked saga" framing.

**3. `news[egypt-the-cat-series].summary`** — `data/news.json`
- **Canonical:** "Our children's picture-book series follows a magical little cat through five wonder-filled adventures."
- **Bundle:** "Our all-ages picture-book series follows a boy and his cat through gentle adventures."
- **Source of truth:** **REQUIRES HUMAN DECISION**
- **Recommended home:** Canonical data → derived into bundle
- **Evidence:** Bundle aligns with the approved Egypt series description ("all-ages," "a boy and his cat"); Canonical is the earlier phrasing. *(Note: "five … adventures" in Canonical is factually true and may be worth preserving.)*

## C. Creators — bios (8) — `data/creators.json`

For all eight, the **Canonical** bios are **fuller** (closer to the source bios document); the **Bundle** bios are **condensed** versions authored in Phase 1.

| # | Creator | Canonical (`creators.json`) — distinguishing text | Bundle (`edenseek-data.js`) |
|---|---|---|---|
| 4 | `chris-mosley` | …into his work **— a process he jokingly calls "That sucked; you're welcome."** | …into his work. |
| 5 | `andrea-bormida` | …Nathan Never, **Agenzia Alfa and Asteroide Argo.** … **His references include Alex Toth, Neal Adams, Gil Kane and Frank Miller.** | …Nathan Never and Agenzia Alfa. …a unified look. |
| 6 | `angelo-vecciarelli` | …Editoriale Aurea**'s "Collezione Tuttocolore" and "Monografici Dago."** … **, including graphic novels marking the centenary of the Italian Air Force.** | …Editoriale Aurea. Since 2022 … America and Europe. |
| 7 | `giulia-gualazzi` | …standout designs **and continually sharpens her craft to meet the needs of every project.** | …standout designs. |
| 8 | `bhumi-gupta` | …editorial work. **An avid reader and soulful artist, she is drawn to design, criticism and analysis.** | …editorial work. |
| 9 | `derek-uskert` | …collector. **He works with many entertainment-industry clients and loves collaborating with incredible talents.** He co-created… | …collector. He co-created… |
| 10 | `ness-uskert` | …Egypt's magical, **mischievous** adventures. | …Egypt's magical adventures. |
| 11 | `michael-bryan-quiambao` | Michael is the illustrator who brings Egypt the Cat to life, pairing **expressive, anime-influenced art** with bright, playful storytelling made for young readers. | Michael is the illustrator of the Egypt the Cat picture-book series. |

- **Source of truth (all 8):** **REQUIRES HUMAN DECISION**
- **Recommended home (all 8):** Canonical data → derived into bundle
- **Evidence:**
  - **#4–#10:** Canonical (fuller) bios are closer to the approved bios document; Bundle versions are editorial condensations. Decision = keep fuller canonical, or adopt the condensed version as canonical.
  - **#11 `michael-bryan-quiambao`:** special case — the **Canonical** ("anime-influenced") text was flagged **unverified/unsourced** in the Canonical Content Alignment; the **Bundle** text is the factual‑minimal replacement. Tied to the still‑open "obtain an approved Michael bio" flag.

---

## Recommendations summary

- **Where content should live:** all 11 fields → **Canonical data** (authored source), **derived** into the render bundle. **Zero** presentation-only fields.
- **Decision categories:** **(a) Accuracy** — items 1–3 (Bundle is the corrected/approved version); **(b) Editorial length** — items 4–10 (fuller-canonical vs condensed); **(c) Unverified** — item 11 (resolve with the creator).
- **Path to PASS:** once each decision is recorded and the chosen values are written into `creators.json` / `characters.json` / `news.json`, re-running `node _tools/generator/build-bundle.js` should report `PASS`; only then can Commit 2 be committed and the engine progress toward authoritative generation.

---

*No canonical or website data was modified in producing this checklist. Reconciliation is a separate, human-directed editorial step.*
