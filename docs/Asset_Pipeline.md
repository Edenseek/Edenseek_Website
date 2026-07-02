# Edenseek Asset Pipeline
**Canonical procedure for turning source art into web-ready assets.** Version 1.0 — 2026-07-02.

**Golden rule:** *Originals are never modified.* `/Projects`, `/Logo`, and `/source-originals` hold the canonical source of truth. Every optimized asset is **generated into `/assets/`** with a new, web-safe name. If a derivative is wrong, we regenerate it from the untouched original.

> **Documented deviation (2026-07-02):** the original `/About` source folder (three founder photos) collided with the standard `/about/` page route on case-sensitive GitHub Pages (Windows folds the case locally). To keep the canonical lowercase `/about/` URL and avoid publishing raw source photos at the web root, those three files were **relocated byte-for-byte, unmodified** to `/source-originals/About/`. No original file was edited or deleted. This is the only relocation of source material.

---

## 1. Why this exists

Source art is enormous and unshippable as-is:
| File | Size |
|---|---|
| `sok title.png` | ~29 MB |
| `Logo_SOK.png` | ~21 MB |
| `I Ride.tif` | ~20 MB |
| `sok title_low res.png` | ~16 MB |
| Egypt covers (JPG) | 1.1–4.5 MB each |
| `Cafe_Final.jpg` poster | ~9.6 MB |

A single unoptimized page could exceed 30 MB. Target per-image budgets: **cover thumb ≤ 60 KB, hero ≤ 250 KB, portrait ≤ 40 KB, OG image ≤ 200 KB.**

---

## 2. Tooling

- **ffmpeg** — the image processor. A standalone binary, **not a site/runtime dependency**. Used only at authoring time to resize and encode.
- **curl** — fetched the self-hosted variable fonts (one-time).
- No Node/npm/Python is required to build or run the site.

> Future enhancement: add AVIF encoding (via `libaom`/`avifenc`) and true blur LQIP. V1 uses WebP + dominant-color LQIP, which is sufficient and universally supported.

---

## 3. Output structure

```
/assets
  /brand      Logos, marks, favicon, wordmark (SVG, hand-authored)
  /covers     Comic & book cover derivatives (webp, multiple widths)
  /creators   Creator portrait derivatives (webp)
  /posters    Promo/poster derivatives (webp)
  /site       UI art + /site/og (1200×630 social preview images)
  /fonts      Self-hosted variable WOFF2 fonts
```

---

## 4. Naming convention

Lowercase, hyphenated, descriptive, width-suffixed. **No spaces, no uppercase, no `IMG_####`.** This is required for the case-sensitive host *and* for image SEO.

```
{slug}-{qualifier}-{width}w.webp

i-ride-for-them-01-cover-800w.webp
society-of-killers-02-cover-1200w.webp
egypt-the-cat-01-magic-cover-800w.webp
creator-andrea-bormida-400w.webp
og-home-1200x630.webp
```

Responsive widths generated per image: **400, 800, 1200** (add **1600** for heroes). Consumed via `<picture>`/`srcset`/`sizes`.

---

## 5. Procedure (ffmpeg recipes)

### 5.1 Resize + encode WebP (quality ~80)
```bash
# One width:
ffmpeg -y -i "SOURCE" -vf "scale=800:-2:flags=lanczos" -c:v libwebp -quality 80 -compression_level 6 \
  "assets/covers/{slug}-cover-800w.webp"
```
`scale=W:-2` preserves aspect ratio and keeps even dimensions. Generate 400/800/1200 (and 1600 for heroes) per source.

### 5.2 Dominant-color LQIP
Downscale to 1px to read the average color, then use it as the CSS background behind the image while it loads:
```bash
ffmpeg -y -i "SOURCE" -vf "scale=1:1" -f rawvideo -pix_fmt rgb24 - | xxd -p
# → hex color, stored as data-lqip="#RRGGBB" in the cover-card markup.
```
The responsive-image component paints this color under the `aspect-ratio` box, giving instant blur-up perceived performance.

### 5.3 OG / social images (1200×630)
Scale key art to cover 1200×630, center-crop, encode:
```bash
ffmpeg -y -i "SOURCE" -vf "scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630" \
  -c:v libwebp -quality 82 "assets/site/og/og-{page}-1200x630.webp"
```
A JPEG twin is also produced for maximum crawler compatibility.

### 5.4 Never do
- Never overwrite a file under `/Projects`, `/Logo`, `/About`.
- Never reference `.tif` or original PNG/JPG > 1 MB from any HTML page.

---

## 6. Mapping (source → asset)

| Source (untouched) | Derivative(s) |
|---|---|
| `Projects/I_Ride_for_Them/Issue 1/Cover/I_Ride_01.png` | `covers/i-ride-for-them-01-cover-{400,800,1200}w.webp` |
| `Projects/I_Ride_for_Them/Issue 2/Cover/I_Ride_02.png` | `covers/i-ride-for-them-02-cover-*.webp` |
| `Projects/Society_of_Killers/Issue 1/Cover/Cover_SOK_Issue_1.png` | `covers/society-of-killers-01-cover-*.webp` |
| `Projects/Society_of_Killers/Issue 2/Cover/Cover_SOK_Issue_2.jpg` | `covers/society-of-killers-02-cover-*.webp` |
| `Projects/Egypt_the_Cat/01…/Cover/cover_Magic!_Magic!_Magic!.jpg` | `covers/egypt-the-cat-01-*.webp` |
| …Egypt covers 02–05 | `covers/egypt-the-cat-0{2..5}-*.webp` |
| `Projects/.../Project Team/Photos/*.jpg` | `creators/creator-{name}-400w.webp` |
| `Projects/Egypt_the_Cat/Posters/*.jpg` | `posters/*-{800,1200}w.webp` |

The authoritative image paths live in `/data/*.json` (`image` / `cover` fields), so pages and JSON-LD always reference the correct derivative.

---

## 7. Adding new art later (and the Agent)

1. Drop the original into the appropriate `/Projects/...` location (canonical).
2. Run the ffmpeg recipes to emit derivatives into `/assets/...` with a conventional name.
3. Add/update the record in `/data/*.json` with the new image paths + `alt` text.
4. Regenerate `/data/edenseek-data.js`, `sitemap.xml`, and any OG image.

The **future Website Agent** automates steps 2–4 end to end — see [`Future_Website_Agent.md`](Future_Website_Agent.md). Because originals are preserved and naming is deterministic, the whole pipeline is safely repeatable.
