# Edenseek Brand & Visual Style Guide
**Canonical reference for all Edenseek website design.** Version 1.0 — 2026-07-02.

This document is the single source of truth for color, type, logo usage, imagery, and tone. All CSS design tokens (`/css/tokens.css`) implement these values; if the two ever disagree, this guide wins and the tokens are corrected.

---

## 1. Brand Essence

**Edenseek Publishing** publishes cinematic comics and children's books — *"Stories Born Different."*

- **Personality:** premium, cinematic, artistic, trustworthy, imaginative.
- **Voice:** confident and warm; never gimmicky. Let the artwork speak; keep copy spare.
- **The rule above all rules:** **artwork is the hero.** The interface is a gallery frame — it recedes so the art dominates.

Edenseek contains **two worlds under one house**:
| World | Audience | Mood | Zone |
|---|---|---|---|
| **Comics** (Mature) | Adult readers | Dark, cinematic, noir/sci-fi | Default dark shell |
| **Children's Books** | Kids & parents | Bright, warm, playful | Light "Young Readers" theme |

They share one skeleton (grid, type system, components) and swap a **theme layer**. Mature and children's content are always kept structurally separate.

---

## 2. Logo System

> ⚠️ **Asset gap:** the repository has no standalone master Edenseek wordmark; the woman-in-arch mark exists only embedded inside cover JPEGs. V1 ships a **redrawn SVG** wordmark + mark in `/assets/brand/`. Replace with an official vector if one is provided.

### 2.1 The Edenseek Mark — "The Seeker"
A woman's head in profile inside a rounded arch. It is **adaptive**:
- **Bare** variant — master brand + I Ride for Them contexts.
- **Fedora** variant — Society of Killers (noir) contexts.

`/assets/brand/edenseek-mark.svg` · `/assets/brand/edenseek-mark-fedora.svg`

### 2.2 Wordmark
"EDENSEEK" set in Fraunces, tight tracking, with "PUBLISHING" as a small tracked kicker beneath. Lockup (mark + wordmark) in `/assets/brand/edenseek-logo.svg`.

### 2.3 Usage rules
- Clear space ≥ the cap-height of "E" on all sides.
- Minimum width: 120px (horizontal lockup), 32px (mark alone).
- On art, always place on a scrim or solid chip — never directly on busy imagery.
- Never recolor outside the approved palette, stretch, rotate, or add effects.
- Favicon derives from the mark: `/assets/brand/favicon.svg` (+ generated PNG/ICO).

---

## 3. Color Palette

### 3.1 Dark shell (default / comics)
| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0F0F12` | Page background (obsidian) |
| `--surface` | `#17171C` | Cards, sections |
| `--surface-raised` | `#20202A` | Hover/elevated |
| `--paper` | `#F5F1E9` | Primary text (warm off-white) |
| `--muted` | `#A7A2AD` | Secondary text (AA-checked on `--ink`) |
| `--hairline` | `rgba(245,241,233,.10)` | Borders/dividers |

### 3.2 Signature accents
| Token | Hex | Role |
|---|---|---|
| `--crimson` | `#C8161D` | Primary brand accent, CTAs, links |
| `--crimson-bright` | `#E63A2E` | Hover / focus glow |
| `--blood` | `#7A0E12` | Deep red, SOK contexts |

### 3.3 Per-imprint accent themes
Set `--accent` (and optional `--accent-2`) on a series root to re-skin shared components.
| Series | `--accent` | `--accent-2` | Mood |
|---|---|---|---|
| Edenseek (master) | `#C8161D` | — | Premium, decisive |
| I Ride for Them | `#E01A17` | `#B6D900` (toxic glow) | Sci-fi thriller, neon |
| Society of Killers | `#8E1116` | `#C9A227` (gold) | Noir, dangerous |
| Egypt the Cat | `#B0392E` | `#E8A72C` (gold) | Playful storybook |

### 3.4 Children's ("Young Readers") theme
| Token | Hex | Role |
|---|---|---|
| `--kids-cream` | `#FBF3E4` | Warm light background |
| `--kids-ink` | `#2A2118` | Warm dark text (AA on cream) |
| `--kids-gold` | `#E8A72C` | Headlines/accents |
| `--kids-sky` | `#1F6FEB` | Secondary accent |
| `--kids-brick` | `#B0392E` | Egypt-the-Cat red |

### 3.5 Contrast rules (WCAG 2.2 AA)
- Body text ≥ 4.5:1; large text (≥24px or 19px bold) & UI components ≥ 3:1.
- `--paper` on `--ink` ≈ 17:1 ✓. `--muted` on `--ink` ≈ 6:1 ✓. `--kids-ink` on `--kids-cream` ≈ 11:1 ✓.
- Text over artwork requires a scrim/gradient — non-negotiable.

---

## 4. Typography

Self-hosted variable fonts (WOFF2) in `/assets/fonts/`, declared in `/css/fonts.css`. No external font CDN.

| Role | Face | Weights/axes | Use |
|---|---|---|---|
| Display | **Fraunces** (variable serif) | opt-size + weight, incl. italic | H1/H2, hero, section titles |
| Body/UI | **Inter** (variable) | 100–900 | Body, nav, labels, buttons |
| Kids display | **Fredoka** (variable rounded) | 300–700 | Egypt-the-Cat headings only |

**Fallback stacks:** Fraunces → `Georgia, 'Times New Roman', serif`; Inter → `system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`; Fredoka → `'Baloo 2', system-ui, sans-serif`.

### Type scale (fluid)
| Token | Value | Face |
|---|---|---|
| `--fs-display` | `clamp(2.75rem, 6vw, 5.5rem)` | Fraunces |
| `--fs-h1` | `clamp(2rem, 4vw, 3.5rem)` | Fraunces |
| `--fs-h2` | `clamp(1.5rem, 2.5vw, 2.25rem)` | Fraunces |
| `--fs-h3` | `clamp(1.15rem, 1.6vw, 1.5rem)` | Inter 600 |
| `--fs-body` | `clamp(1rem, 1.05vw, 1.125rem)` | Inter |
| `--fs-small` | `0.875rem` | Inter |
| `--fs-kicker` | `0.78rem` uppercase, `letter-spacing:.14em` | Inter 700 |

Body line-height 1.6; headings 1.08–1.15; measure ≤ 68ch. One `<h1>` per page (also an SEO rule).

---

## 5. Spacing, Radius, Elevation

- **Spacing scale** (`--space-*`): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px.
- **Radius:** `--radius-sm 6px`, `--radius 12px`, `--radius-lg 20px`, pill `999px`.
- **Container:** max-width `1320px`, gutter `clamp(16px, 4vw, 48px)`.
- **Elevation:** soft shadows only; cards lift on hover via `transform: translateY(-4px)` (never animate layout properties → avoids CLS).
- **Motion:** 150–300ms, `ease`/`cubic-bezier(.2,.7,.2,1)`. All transitions/animations wrapped in `@media (prefers-reduced-motion: no-preference)`.

---

## 6. Imagery & Art Direction

- Covers display at true comic ratio (**~2:3**); book covers at their native ratio. Never awkward-crop key art.
- Every image sits in an `aspect-ratio` box with an LQIP (dominant-color/blur) background for blur-up.
- Text over art always on a gradient scrim (bottom-up or left-right).
- Hero may carry a faint film-grain/vignette (opacity ≤ .06), disabled under reduced-motion.
- **Mature covers** in any mixed context carry a small "Mature" tag chip.
- Thin **crimson angled rule** as an occasional comic-panel accent — used sparingly.

---

## 7. Iconography & UI

- Inline SVG icons, 1.5px stroke, `currentColor`, 24px grid. Minimal set: menu, close, arrow-right, external, play, mail, social glyphs.
- Buttons: `.btn--primary` (crimson fill, paper text), `.btn--ghost` (hairline border). Min target 44×44px, visible ≥2px focus ring at ≥3:1 contrast.
- Tag chips: pill, uppercase kicker type; variants `chip--mature`, `chip--genre`, `chip--imprint`.

---

## 8. Tone & Copy

- Headlines: short, cinematic, evocative. Body: clear, warm, unpadded.
- Comics copy leans moody/intriguing; children's copy leans bright/wonder-filled.
- Always credit creators by role (writer, artist, colorist, cover artist, editor) — a comics convention Edenseek honors.
- Accessibility of language: plain, scannable, descriptive link text (never "click here").

---

## 9. Do / Don't

**Do:** let art fill the frame; keep chrome quiet; maintain contrast; label mature content; credit creators; use the theme layer for imprint identity.
**Don't:** autoplay carousels; place text on unscrimmed art; ship original-size images; mix mature and children's content; recolor the logo; remove focus outlines; use more than the three approved typefaces.
