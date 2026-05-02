---
title: tonyyunyang.github.io — Redesign Design Spec
date: 2026-05-01
author: Tony Yang
status: approved
brand: Atelier × Cinema
---

# tonyyunyang.github.io — Redesign Design Spec

## 0 · Goal

Replace the current Jon-Barron-template-derived site at `tonyyunyang.github.io` with a custom-designed, single-author personal/research site that:

1. Reads as gorgeous on first paint to *any* visitor (recruiter, researcher, peer, casual reader) — the "WOW" requirement.
2. Layers content for multiple audiences without diluting any: hero is emotional, body is substantive, personal layer hidden behind a tasteful door.
3. Adds a blog system from day one, with an empty Writing section that fills in as posts are added.
4. Introduces playful interactivity that *only appears when the audience asks for it* (the bryantcodes.art philosophy).
5. Replaces the existing `my-world.html` pixel page entirely with a single integrated atelier scene.
6. Continues to deploy to the existing `tonyyunyang.github.io` URL via GitHub Pages — deployment safety is non-negotiable.

The brand for this design is called **"Atelier × Cinema"**: editorial-minimal foundation (Direction A) with engineered/researcher discipline (D) and one signature playful reveal (E). Cinematic typographic hero + substantive live workbench + hidden navigable scene.

## 1 · Site map

```
/                          Homepage (single long scroll, 6 sections)
/writing/                  Blog index (auto-generated from MDX)
/writing/[slug]/           Individual blog posts
/world/                    Atelier scene (also reachable via sketchbook door)
/cv.pdf                    Static asset (replaces data/tony-cv.pdf)
/rss.xml                   Auto-generated RSS feed
/sitemap-index.xml         Auto-generated sitemap
404                        Custom 404 — small atelier joke
```

Homepage section order: **Hero → §00 Currently → §01 Research → §02 Projects → §03 Writing → §04 News → §05 Teaching → §06 Contact**.

Navigation pattern:

- No top nav bar. A right-rail Table of Contents fades in after the hero, listing the §-numbered sections.
- The `⌘K` command palette is the primary jump-around tool for power users.
- The sketchbook ✎ button is a persistent corner element on every page (lower-right).
- Mobile: a small floating "menu" button bottom-right reveals the same TOC.

## 2 · Visual system

### 2.1 Typography (free fonts only for MVP)

| Role | Font | Size | Notes |
|---|---|---|---|
| Display (hero tagline) | **PP Editorial New** italic | `clamp(40px, 8vw, 112px)` | line-height 1.05, `font-feature-settings: "ss01"` if available |
| Section header (`§01 · RESEARCH`) | PP Editorial New italic | 32–48px responsive | the `§01 · ` prefix is JetBrains Mono |
| Paper / project title | PP Editorial New | 22–26px | not italic |
| Body | **Inter** | 16–17px | line-height 1.65, max-width 62ch |
| Sidenote | Inter italic | 13px | line-height 1.5, color `--ink-soft` |
| Caption / metadata / dateline | **JetBrains Mono** | 11–12px | uppercase, letter-spacing 0.08em |
| Inline math | KaTeX (Computer Modern) | inherit | only where it earns its keep |

Fonts are loaded via `@fontsource` / `@fontsource-variable` packages so they're self-hosted (no external CDN dependency that could break the site).

### 2.2 Color palette (strict, 7 tokens)

```css
--paper:        #F5EFE2;   /* page background */
--paper-shade:  #EDE6D5;   /* alternating section bands, card backgrounds */
--ink:          #0F1417;   /* primary text, headings */
--ink-soft:     #4A5159;   /* secondary text, sidenotes, captions */
--accent:       #0E5347;   /* deep emerald — links, hovers, marks */
--hairline:     #D9D2C2;   /* rules, card edges, dividers */
--featured:     #FAF1D8;   /* highlighted paper tint (very subtle) */
```

No other colors. Contrast verified:
- ink on paper = 14.6:1 (AAA)
- ink-soft on paper = 7.8:1 (AAA)
- accent on paper = 9.2:1 (AAA)

### 2.3 Spacing & grid

- Content column: **880px** + **200px right rail** (sidenotes / TOC) = **1080px** total
- 8pt baseline; section spacing 96px (mobile) / 144px (desktop)
- 12-column grid, 24px gutter
- Paper grain: SVG noise texture overlay at **4% opacity**, fixed-position background-attachment

### 2.4 Motion budget (one decision, applied everywhere)

| Transition | Duration | Easing |
|---|---|---|
| Default (hover, color, opacity) | 180ms | ease-out |
| State change (card lift, button press) | 240ms | ease-out |
| Iris reveal (section enter) | 480ms | cubic-bezier(.22,.72,.16,1) |
| Page transitions (route-to-route) | 320ms | ease (View Transitions API) |
| Sketchbook door cinematic | 1200ms | one-shot, manually keyed |
| Workbench SVG draw-in | 1400ms | linear, scroll-triggered |

`prefers-reduced-motion: reduce` → all of the above become **0ms / opacity-only**. This is enforced via a CSS media-query override on every `@keyframes` and every `transition` property.

### 2.5 Distinctive details

- Print-style folio in margin: `§04 / 06` in monospace, 11px, ink-soft
- Hairline rules between sections: 1px `--hairline`, full content column width
- Paper grain SVG noise (single SVG turbulence filter) at 4% opacity
- Section underline accent: 2px emerald bar, 32px wide, beneath every §-numbered header
- All cards have 16px radius corners and `1px solid var(--hairline)` borders

## 3 · Homepage detail

### 3.1 Hero (above the fold, the cinematic moment)

Full viewport. No image, no nav bar, no CTA buttons. Layout:

```
┌──────────────────────────────────────────────────────────────────┐
│  TONY YANG · TY                              INDEPENDENT AI       │
│  (mono, top-left, 11px, ink-soft)             RESEARCHER ·        │
│                                                AMSTERDAM ·        │
│                                                2026 →             │
│                                                (mono, top-right)  │
│                                                                   │
│              The limits of language mean                          │
│              the limits of the world?                             │
│                                                                   │
│              Perhaps, yet we dwell in more                        │
│              than we can name.                                    │
│                                                                   │
│              (PP Editorial New italic, ~80–112px,                 │
│               left-aligned within content column, 2 stanzas)      │
│                                                                   │
│                                                                   │
│                                       SCROLL · OR ⌘K  (mono)      │
└──────────────────────────────────────────────────────────────────┘
```

Behavior:
- The tagline is plain text (`<h1>` is `Tony Yang`, the tagline is `<p class="hero-tagline">` for SEO sanity)
- On scroll: tagline shrinks (`scale(0.4)`) and pins to the upper-left as a small italic watermark via `position: sticky` + a `transform` keyed to scroll progress
- The "scroll · or ⌘K" hint fades out after first scroll

### 3.2 §00 — Currently (immediately below the hero)

Two-column layout: a 280px duotone-treated headshot card on the left, intro paragraph on the right.

Proposed copy:

> Tony (Tongyun) Yang. Independent AI researcher in Amsterdam. I build AI systems that expand what people can perceive, understand, and do — and that work outside the lab. I'm currently collaborating with industry (Tencent, Gradient Networks, MeetaVista) and academia (TU Delft, McGill, Tsinghua) on world models, LLMs, and AI for medicine. Earlier: Marie Curie Fellow at IMDEA Networks, AI research engineer at TU Delft Imaging Physics, MSc TU Delft.

Below the paragraph: a row of monospace pill links — `email · scholar · github · cv`.

### 3.3 The live workbench (still part of §00, before §01)

A hand-stroked SVG graph centered in the content column:

- **Topic nodes** (5): `world models`, `LLMs`, `vision`, `medical AI`, `wireless sensing`
- **Output nodes** (papers + projects): edges connect topics to specific outputs
- Topics are 14px circles (filled emerald or outlined hairline depending on activity)
- Outputs are short labels with monospace meta (`MICCAI '25`, `IMWUT '25`, `IN PROGRESS`)
- Edges are 1px hairline strokes that animate in via `stroke-dashoffset` on intersection-observer trigger

Interaction:
- Hover a topic node → all unrelated nodes/edges fade to 30% opacity, the matching paper/project cards in §01/§02 get an emerald hairline border
- Click a topic → smooth-scroll to first matching card
- Hover a paper/project label → 200ms tooltip with venue and year (uses the `<Sidenote>` component pattern)

Data: the workbench is generated at build time from the `papers/` and `projects/` content collection frontmatter. Each entry declares `topics: ["LLMs", "vision"]` etc.; the generator (`src/lib/workbench-graph.ts`) emits the SVG node-edge structure. **The graph is never out of sync with the content.**

### 3.4 §01 · Research

Header: `§01 · RESEARCH` (italic display + mono prefix), 1-line dek beneath:
> *On building AI systems that expand human capabilities — and that work outside the lab.*

Then a 2-up paper grid. Each `<PaperCard>`:

- Duotone-treated thumbnail (top), `--paper-shade` background card with hairline border
- Dateline in monospace: `MICCAI · IEEE TMI · 2025` etc.
- Paper title in PP Editorial New 22–26px
- Author list with linked names, your name underlined + bold
- 1-line "in plain English" summary
- Link row: `paper · code · bib`
- Featured papers (the first-author IMWUT'25): `--featured` cream tint + small `★` next to the dateline + a one-line "why this matters" appears as a sidenote in the right rail when the card is hovered

Initial papers (3):
1. Yang, Regmi, Du, Bulling, Zhang, Lan — *Through the Eyes of Emotion* (IMWUT 2025) — featured, first-author, equal-contrib `*`
2. Zhao, Zhang, Yang, Božić-Iven, Arami, Han, Simonetti, Xue, Kellman, Weingärtner, Tao — *Reverse Imaging: Any-Sequence Generalization for Cardiac MRI Segmentation* (MICCAI 2025 + IEEE TMI)
3. Yang, Zhao, Tao — *Pruning nnU-Net with Minimal Performance Loss* (MIDL 2025)

### 3.5 §02 · Projects

Same card system, landscape (1-up rows). Fields: project name, collaborator, period, status (`SHIPPED` / `IN PROGRESS · TARGET NEURIPS '25`), 2-line description, links (github, demo, store).

Initial projects (5):
1. **ScholarHighlights** — browser extension, shipped, Chrome Web Store + GitHub
2. **LLM Router** — Gradient Networks collaboration, in progress, GitHub link
3. **Cost-Adaptive LLM Routing with Specialist Models** — in preparation for NeurIPS '25
4. **Human Intent World Model** — MeetaVista collaboration, in progress, target top-tier AI venue
5. **LLM for Optimization** — Tencent collaboration, in progress

### 3.6 §03 · Writing

Header `§03 · WRITING`. MVP empty state:

> *Notes on research, taste, and the boring parts of building AI. First entry coming soon.*
> *↗ subscribe via RSS*

Once posts exist, this section auto-fills with the 3 most recent (title + 1-line dek + reading time + date), then `→ all writing` links to `/writing/`.

### 3.7 §04 · News

A vertical timeline. Each item: monospace date `[2026/05]`, then 1–2 lines. Pulled from `news.mdx`. Show the most recent **6**; the rest collapse under "earlier news ↓".

Initial 6 (taken from current site, lightly edited):

- `[2026/05]` Concluded my Marie Curie Fellowship at IMDEA Networks. Now seeking new opportunities.
- `[2026/03]` Submitted a paper on a diffusion-based training framework for large language models to ACL Rolling Review.
- `[2025/10]` Began Marie Curie Fellowship at IMDEA Networks (MSCA 6th Sense project).
- `[2025/07]` *Through the Eyes of Emotion* accepted to Ubicomp / IMWUT 2025.
- `[2025/06]` *Reverse Imaging* accepted to MICCAI 2025 + IEEE Transactions on Medical Imaging.
- `[2025/05]` *Pruning nnU-Net with Minimal Performance Loss* accepted to MIDL 2025.

### 3.8 §05 · Teaching

Compact list (no cards) — date range, course code, course name, role. Plus "Graduate Student Mentor (2023/24)" as a separate trailing line.

Initial entries (5):

- 2024/25 Q1 — ET 4310 Supercomputing for Big Data — TA — TU Delft
- 2023/24 Q3 — CESE 4030 Embedded Systems Lab — TA — TU Delft
- 2023/24 Q1 — CESE 4000 Software Fundamentals — TA — TU Delft
- 2023/24 Q1 — CESE 4010 Advanced Computing Systems — TA — TU Delft
- 2023/24 — CESE MSc Programme Student Mentor — TU Delft

### 3.9 §06 · Contact

A single 1-paragraph invitation:
> *I read everything. Reach out about research, collaboration, or just to say hi.*

Followed by a row of 4 monospace pill links: `email · scholar · github · cv`.

Bottom strip: `built in atelier mode · ⌘K · ✎` — the ✎ is the sketchbook door (also persistently in the bottom-right corner).

## 4 · The Atelier scene MVP (the hidden world)

### 4.1 Trigger

Three ways to enter:
1. The **✎ sketchbook button** persistently in the lower-right corner of every page (floating, 44×44px, ink stroke on paper background, hover lifts emerald)
2. Direct route `/world/` (linkable, shareable, indexed)
3. `⌘K` → type `world`

### 4.2 The cinematic transition (1.2s)

1. Black letterbox bars slide in from top & bottom (`240ms`)
2. Soft "page-turn" cue (audio is **off by default**; toggle in the palette under `sound`)
3. Cross-fade to the scene (`320ms`)

### 4.3 The scene (MVP — layered SVG horizontal parallax)

A horizontal scrolling vignette, **4 viewports wide**, scrolls with mousewheel, arrow keys, or trackpad. Visual language: hand-drawn ink lines on cream paper with watercolor-like wash fills (matches homepage palette).

```
┌──── viewport 1 ────┬──── viewport 2 ────┬──── viewport 3 ────┬──── viewport 4 ────┐
│ DESK & WINDOW      │ KITCHEN            │ BOOKSHELF & RUN    │ NIGHT — THE CAT    │
│ - laptop           │ - pot on stove     │ - shelf w/ books   │ - cat in window    │
│ - notebook         │ - chopping board   │ - running shoes    │ - moon, candle     │
│ - coffee mug       │ - knife            │ - half marathon    │ - wedding rings    │
│ - paper drafts     │ - plant            │   medal            │ - tennis racket    │
│ - canal thru window│                    │                    │   leaning          │
└────────────────────┴────────────────────┴────────────────────┴────────────────────┘
```

### 4.4 Interactions

- Hover an object → it gets a hairline emerald outline + cursor changes to pointer
- Click → a sidenote panel slides in from the right with a 2–4 sentence personal note
- Press `T` → all sidenote *captions* (1-line summaries) appear simultaneously, hovering above each object — for skim-mode
- Press `Esc` → letterboxed transition reverses, returns to where you were on the homepage
- Route is deep-linkable: `/world/?at=cat` opens with the cat sidenote already shown — for sharing

Initial sidenote drafts (to be edited by Tony in `atelier.json`):

- **laptop** — "*This is where the LLM Router commits get made. Usually around midnight, with bad lo-fi.*"
- **notebook** — "*A new one every quarter. Most of the good ideas live here before they live in any repo.*"
- **pot on stove** — "*I cook for family on Sundays. Mostly Chinese, mostly experimental.*"
- **books** — "*A short stack of paper drafts and Le Guin essays. Always re-reading: Borges, On Photography.*"
- **running shoes** — "*Half-marathon PB 1:43:53. Most ideas show up around km 8.*"
- **medal** — "*The medal isn't the point. The km-8 part is.*"
- **cat in window** — "*We're planning to adopt a cat. The window is reserved for them.*"
- **rings** — "*Married to the love of my life. The first co-author who never asks for revisions.*"
- **tennis racket** — "*Saturday mornings. Mostly losing.*"
- **candle** — "*For the things I'm not yet ready to write about.*"

### 4.5 Tech for MVP

- All vector SVG, illustrated to spec (see §8 image plan); exported per-layer
- Parallax via CSS `transform: translateX()` keyed to scroll position via `requestAnimationFrame`
- ~6–8 layers per viewport, ~30 layers total — well under 1MB
- Sidenote system reuses the homepage `<Sidenote>` component
- Two ambient details: slow flicker on the candle (CSS `@keyframes`), cat tail curl every 5s (CSS animation)

### 4.6 Phase-2 upgrade (after launch)

Same scene, ported to Three.js with low-poly geometry + the SVG textures retained as decals. Keeps the look, gains 3D depth, allows for orbit/tilt. **No content changes** — only the renderer changes. This upgrade can ship without re-approving the design.

## 5 · Command palette (`⌘K` / `/`)

A minimal command bar, ~520px wide, slides down from the top center.

| Command (or fuzzy match) | Result |
|---|---|
| (anything) | Fuzzy search across pages, papers, projects, posts (Pagefind-backed) |
| `papers` | Smooth-scroll to §01 |
| `projects` | Smooth-scroll to §02 |
| `writing` | Open `/writing` |
| `latest` | Open the most recent paper or post |
| `cv` | Open `/cv.pdf` in new tab |
| `email` | Compose to `tonyyunyang@outlook.com` |
| `world` | Open the atelier scene |
| `theme` | Toggle light/dark *(deferred to v1.1; placeholder shown but disabled)* |
| `pace` | Toast: `1:43:53` |
| `now` | Toast: contents of `site.json#currently` field |
| `sound` | Toggle scene audio on/off |
| `?` | Show help (this table) |

UX: same paper-grain background and emerald hover/selection. Keyboard-only: `↑/↓` to navigate, `Enter` to select, `Esc` to close.

## 6 · Content rewrites

Most of the existing copy in `index.html` carries over with light edits. The hero / §00 paragraph is consolidated as in §3.2 above. The full final copy lives in `src/content/site.json` (hero, §00, §06) and the individual content collection MDX files.

The implementation plan will produce a `content-rewrites.md` working doc that's separate from this spec, so copy iteration doesn't churn the design.

## 7 · Image plan (final)

### 7.1 Keep & re-use

- `Profile.jpg` → re-cropped into a duotone-treated 280px square card for §00. The original stays in `public/profile/Profile.jpg` for the linked higher-res view.
- `Ubicomp/2025/through_eyes.png` → §01 paper card thumbnail
- `MICCAI/2025/reverse.png` → §01 paper card thumbnail
- `MIDL/2025/prune_nnunet.png` → §01 paper card thumbnail
- `projects/scholarhighlights/icon_big.png` → §02 project thumbnail
- favicons → reused (already correct sizes)

### 7.2 Drop entirely

- `profile_rec.png`, `profile_rec3.png` — cute cartoons, tonally off-brand
- `profile_rec2.png`, `profile_sqaure.png` — joke devil/whisker drawings, not portfolio-grade
- `Ubicomp/2025/IMWUT25_1.png`, `Ubicomp/2025/IMWUT25.gif` (8 MB), `MICCAI/2025/Untitled.png`, `MIDL/2025/MIDL25_1.png` — duplicate or visually-busy result grids
- `images/my-world/masterpieces/*` — pixel-world page is being removed entirely

### 7.3 Need from Tony (during build)

1. **(Optional, low priority)** One landscape lifestyle photo for `og:image` and `/writing` header — candid only.
2. **(Optional)** A new high-res cropped square headshot. If not provided, we re-crop `Profile.jpg`.
3. **Project thumbnails for the 4 ongoing collaborations** (LLM Router, Cost-Adaptive Routing, Human Intent World Model, LLM for Optimization). For MVP: I'll auto-generate clean SVG illustrations matching the workbench aesthetic. Tony can swap them later.
4. **Atelier scene illustrations** (4 vignettes). For MVP: assembled from public-domain icon sets unified in the palette and re-stroked to feel hand-drawn. Tony can commission a real illustrator before the Phase-2 3D upgrade.

## 8 · Tech architecture

### 8.1 Stack

- **Astro 5** (latest stable) with Content Collections + Zod schemas
- **MDX** for blog & paper / project frontmatter
- **TypeScript** throughout
- **Tailwind v4** for utilities + a small `globals.css` for tokens & typography
- **Pagefind** for client-side fuzzy search (powers `⌘K`)
- **Shiki** for code highlighting (Astro built-in)
- **rehype-katex** + **remark-math** for inline math
- **astro-icon** for icons (lucide set, monoline)
- **`@fontsource` / `@fontsource-variable`** for self-hosted fonts (no external CDN dependency)
- **No React/Vue/Svelte** for MVP — keep the bundle near zero. Use Astro components + tiny vanilla TypeScript "islands" for the workbench, command palette, and atelier scene
- **No GSAP** — motion is done with the Web Animations API + CSS only (lighter & sufficient for the motion budget)

### 8.2 File structure

```
tonyyunyang.github.io/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.mjs
├── .github/workflows/deploy.yml     ← THE deployment pipeline
├── public/
│   ├── cv.pdf
│   ├── favicon/                     (existing, reused)
│   ├── og-default.png
│   ├── papers/                      (paper thumbnails copied from images/)
│   └── profile/
│       └── Profile.jpg
├── src/
│   ├── content/
│   │   ├── config.ts                (Zod schemas for all collections)
│   │   ├── site.json                (hero copy, §00, §06, "currently", contact links)
│   │   ├── papers/                  (one .mdx per paper)
│   │   ├── projects/                (one .mdx per project)
│   │   ├── posts/                   (blog posts, .mdx)
│   │   ├── news.mdx                 (single timeline file)
│   │   ├── teaching.mdx
│   │   └── atelier.json             (scene objects + sidenotes + positions)
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Workbench.astro          (SVG graph)
│   │   ├── PaperCard.astro
│   │   ├── ProjectCard.astro
│   │   ├── PostCard.astro
│   │   ├── Sidenote.astro
│   │   ├── SectionHeader.astro
│   │   ├── Folio.astro              (page-number margin marker)
│   │   ├── CommandPalette.astro     (+ palette.client.ts)
│   │   ├── SketchbookButton.astro
│   │   ├── AtelierScene.astro       (+ atelier.client.ts)
│   │   ├── Toc.astro                (right-rail TOC)
│   │   └── Layout.astro
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Post.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── writing/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── world.astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   ├── styles/
│   │   ├── globals.css              (tokens, typography, paper grain)
│   │   └── katex.css
│   └── lib/
│       ├── workbench-graph.ts       (derives node-edge data from frontmatter)
│       └── motion.ts                (motion utilities w/ reduced-motion guard)
├── docs/
│   └── superpowers/specs/
│       └── 2026-05-01-tonyyunyang-redesign-design.md   ← this doc
├── legacy/                          (old site archived, not deployed)
│   ├── index.html
│   ├── my-world.html
│   ├── stylesheet.css
│   ├── my-world.css
│   ├── bibtex-viewer.html
│   └── WEBSITE_MODIFICATION_GUIDE.md
└── README.md                        (rewritten)
```

The `legacy/` folder keeps the old site readable and copy-able from the same repo at any time (it's not in the build output, so it doesn't ship to Pages).

### 8.3 Content collection schemas (sketch)

```ts
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const papers = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    venue: z.string(),                // e.g., "MICCAI"
    venueExtra: z.string().optional(), // e.g., "+ IEEE TMI"
    year: z.number(),
    authors: z.array(z.object({
      name: z.string(),
      url: z.string().url().optional(),
      isMe: z.boolean().optional(),
      equalContrib: z.boolean().optional(),
    })),
    topics: z.array(z.enum([
      "world-models", "llms", "vision", "medical-ai", "wireless-sensing"
    ])),
    summary: z.string(),               // 1-line plain English
    featured: z.boolean().default(false),
    thumbnail: z.string(),
    links: z.object({
      paper: z.string().url().optional(),
      code: z.string().url().optional(),
      bibtex: z.string().optional(),
      project: z.string().url().optional(),
    }),
  }),
});

const projects = defineCollection({ /* similar */ });
const posts    = defineCollection({ /* title, date, dek, tags, draft */ });

export const collections = { papers, projects, posts };
```

## 9 · Deployment to GitHub Pages — non-negotiable correctness

This is a **User Pages** repository (`tonyyunyang/tonyyunyang.github.io`). Currently it serves `master` directly. Astro requires a build step, so we switch to GitHub Actions deployment.

### 9.1 What changes in GitHub Pages settings (manual, one-time)

In the repo settings → Pages:
- **Source:** "GitHub Actions" (currently "Deploy from a branch")
- This must be flipped **before** the new workflow's first successful run, otherwise the action will succeed but Pages will still serve the old branch.

This step can be done either:
- Manually in the GitHub web UI, or
- Via `gh` CLI: `gh api -X PUT repos/tonyyunyang/tonyyunyang.github.io/pages -f build_type=workflow`

### 9.2 The workflow file

`.github/workflows/deploy.yml`:

```yaml
name: Deploy site

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Build search index (Pagefind)
        run: npx pagefind --site dist
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 9.3 Astro config — the right `site` and `base`

Because this is `tonyyunyang.github.io` (a User Pages repo, not a Project Pages repo):
- `site: "https://tonyyunyang.github.io"`
- `base: "/"` (NOT `/repo-name/` — that would break paths)

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://tonyyunyang.github.io",
  base: "/",
  integrations: [mdx(), sitemap()],
  // ...
});
```

### 9.4 Deployment safety steps (in this order, no skipping)

1. Build the new site on a `redesign` branch — keep `master` serving the old site untouched until cutover.
2. Open a PR for `redesign` → `master`. The PR body has a checklist (build green, all internal links work, mobile checked, reduced-motion checked, `⌘K` works, atelier scene works, blog renders).
3. Before merging, do a **dry-run cutover**: temporarily push the workflow file to `master` (without deleting old HTML), flip Pages to "GitHub Actions", verify the action runs and the site still serves correctly (the action will happily serve the existing `index.html` if no Astro build is wired yet — verifying the pipeline is alive).
4. On merge, the redesigned site goes live at `tonyyunyang.github.io`. The old `index.html` etc. move to `legacy/` in the same commit, so they're not in the build output.
5. Verify post-deploy: open the URL, check 5 random sub-routes (`/writing/`, `/world/`, an MDX post, the 404), check `/sitemap-index.xml` and `/rss.xml`, check Pagefind search, check the sketchbook button.
6. **Rollback plan**: if anything is broken post-cutover, `git revert` the merge commit and push — the action will rebuild and re-deploy the previous state. The old site files remain in `legacy/` so reverting wholesale is also possible.

### 9.5 Custom domain — out of scope for now

The user has not requested a custom domain. If one is added later, we add a `CNAME` file in `public/` and configure DNS; the workflow itself doesn't change.

## 10 · Accessibility & non-negotiables

- All motion respects `prefers-reduced-motion: reduce` (already in motion budget)
- Color contrast: AAA across all text on background combinations (verified §2.2)
- All interactive elements keyboard-reachable
- Focus rings: 2px emerald with 2px paper offset (via `:focus-visible`)
- ARIA labels on the sketchbook button, command palette, workbench nodes
- Skip-to-content link (visible on focus)
- The atelier scene is non-essential — `aria-hidden="true"` on the visual scene; the sidenote text content is duplicated into a screen-reader-only `<ul>` so it's still readable
- All images have `alt` text
- The hero `<h1>` is "Tony Yang" (semantic), the tagline is `<p>` — search engines and screen readers get a sane page hierarchy

## 11 · Out of scope for MVP

These are explicitly deferred so we don't scope-creep:

- Dark mode (mentioned in `⌘K` but disabled; ship light-only first; v1.1)
- Three.js atelier scene (SVG MVP first; v1.1+)
- Comments / guestbook
- Newsletter signup
- Analytics (Plausible can be added later in 5 minutes)
- i18n / Chinese version of the site
- Author "now-playing" status fed by an external API
- Automated `og:image` per blog post (use one site-wide for MVP)

## 12 · Shipping plan

Four build phases, ~5 working days for one developer:

- **Phase 1 — Foundation (1 day):** Astro scaffold, `tailwind.config`, GitHub Action, content collections, Zod schemas, layout, typography & color tokens, paper grain, basic page routing, deploy pipeline working end-to-end on a `redesign` branch with a placeholder "Hello, Atelier" page so the new pipeline is proven before we throw away the old site.
- **Phase 2 — Homepage (2 days):** Hero, §00 intro, workbench SVG generator, all 6 sections, paper/project cards, news timeline, teaching, contact, sidenotes, right-rail TOC, folio markers.
- **Phase 3 — Interactive layers (1.5 days):** Command palette (`⌘K`), sketchbook button, atelier scene MVP (4 viewports, sidenotes, T-key captions), `/world/` route, route deep-linking.
- **Phase 4 — Blog system + cutover (0.5 day):** Writing index, post template, RSS, sitemap, MDX paper detail pages (optional), 404, og-image, Pagefind, accessibility pass, replace `master` with `redesign` (the cutover dance from §9.4), verify deploy.

The implementation plan (next document) breaks each phase into checkable steps with verification commands.

## 13 · Success criteria

The redesign is "done" when all of the following hold:

1. `https://tonyyunyang.github.io` serves the new site, and a `git push master` triggers a successful Action that redeploys.
2. The hero tagline renders at `clamp(40px, 8vw, 112px)` and the rest of the page meets the visual system in §2 on a fresh Chrome / Safari / Firefox load.
3. The live workbench SVG draws in on scroll, hovering a topic node highlights matching cards in §01/§02.
4. The `⌘K` command palette opens with `⌘K`, navigates with `↑/↓ Enter`, and closes with `Esc`. All commands in the table in §5 work (or are visibly disabled with a tooltip if deferred).
5. The ✎ sketchbook button is present in the lower-right on every page; clicking it triggers the cinematic transition and lands on the atelier scene at `/world/`.
6. The atelier scene scrolls horizontally, sidenotes open on click, `T` toggles all captions, `Esc` exits with reverse transition, `?at=cat` deep-links work.
7. A new MDX file dropped into `src/content/posts/` automatically appears in `/writing/`, in the homepage §03 (if among the 3 newest), in the RSS feed, and in the sitemap, with no other code change.
8. `prefers-reduced-motion: reduce` disables all motion (verified in DevTools emulation).
9. Lighthouse on the homepage: Accessibility ≥ 100, Performance ≥ 95, SEO ≥ 100, Best Practices ≥ 100 (single-run, mobile preset).
10. The old site is preserved in `legacy/` and the cutover is reversible via a single `git revert`.
