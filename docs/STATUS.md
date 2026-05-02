# Project status — tonyyunyang.github.io

_Last updated: 2026-05-02 (clean repo init + Pages deploy wired up)_

## TL;DR

- Custom Astro 5 personal site. Single-author project. No template ancestry.
- Brand language is **Studio** for the personal-layer page (the cross-section illustration). The URL is `/world/`.
- Repo is fresh: a single initial commit on `main` is the only history. No fork lineage on GitHub.
- Pages is wired up to deploy via GitHub Actions on every push to `main` (`.github/workflows/deploy.yml`).
- Visit tracking is enabled silently via a hidden ClustrMaps script in `Base.astro` (no visible widget). Stats live at `https://clustrmaps.com/site/1c7hs`.
- Local git identity for this project: `tony / tonyyunyang@outlook.com` (project-scoped, not global).

## Layout & key components

```
src/
├── components/
│   ├── Hero.astro              hero with "Plate I · Twilight 2026" sketch
│   ├── Intro.astro             §00 (PhD opening + day-to-day)
│   ├── ResearchThemes.astro    6-card "Research compass" grid
│   ├── PaperCard.astro         author name underline (only the name, not the comma)
│   ├── ProjectCard.astro       thumbnail click opens primary link in new tab
│   ├── BusinessCard.astro      sketch-style §06 contact card
│   ├── SectionHeader.astro     dek font-size clamp(20px, 1.7vw, 23px), dekWide prop
│   ├── Icon.astro              hand-drawn engraving icon library
│   ├── PillLink.astro          accepts an icon prop
│   ├── CommandPalette.astro
│   ├── SketchbookButton.astro
│   └── AtelierScene.astro      Studio cross-section illustration
├── layouts/Base.astro          main layout (CommandPalette + SketchbookButton +
│                               hidden ClustrMaps tracker)
├── layouts/Post.astro          blog post layout
├── pages/
│   ├── index.astro             homepage (single long scroll)
│   ├── writing/                blog index + dynamic post route
│   ├── world.astro             Studio scene
│   ├── rss.xml.ts
│   └── 404.astro
└── content/                    Zod-validated content collections
    ├── papers/                 one MDX per paper (engraving SVG thumbs in public/papers/)
    ├── projects/               one MDX per project (engraving SVG thumbs in public/projects/)
    ├── posts/                  blog (set draft:false to publish)
    ├── teaching/teaching.mdx
    ├── site.json               hero copy, intro, research themes, business card, contact
    └── atelier.json            /world/ Studio scene data (objects with x,y % coords)
```

## Tests

- **Unit (Vitest):** `npm run test:unit` — 5/5 passing.
- **E2E (Playwright):** `npm run test:e2e` — `atelier-scene.spec.ts` and `_visual.spec.ts` still expect the original 4-viewport Studio (arrow-key walk); they need rewriting or deletion.
- **Helper preview specs** (all `_`-prefixed, gitignored screenshots in `tests/visual/shots/`):
  - `_homepage-preview.spec.ts`
  - `_atelier-preview.spec.ts`
  - `_thumb-render.spec.ts`
  - `_paper-thumbs.spec.ts`
  - `_zoom-preview.spec.ts`

## Daily commands

```sh
npm install
npm run dev             # http://localhost:4321
npm run build           # outputs ./dist + Pagefind index
npm run preview         # serves built ./dist locally (full prod-like)
npm run check           # astro check
npm run test:unit       # vitest
npm run test:e2e        # playwright
npm test                # all tests
```

## How the deploy works

The workflow at `.github/workflows/deploy.yml`:
1. Triggers on push to `main`, PRs targeting `main`, or manual dispatch.
2. Checks out, installs (`npm ci`), runs `npm run build` (which produces `dist/` with the Pagefind index).
3. Uploads `dist/` as a Pages artifact and deploys to `https://tonyyunyang.github.io`.

The Pages source is set to "GitHub Actions" via:

```sh
gh api -X PUT repos/tonyyunyang/tonyyunyang.github.io/pages -f build_type=workflow
gh api repos/tonyyunyang/tonyyunyang.github.io/pages | grep build_type
# expect "build_type": "workflow"
```

## Known follow-ups

- **Old E2E tests for the Studio.** `atelier-scene.spec.ts` and `_visual.spec.ts` still test arrow-key viewport walking that was removed when the four viewports collapsed into one scene. They will fail in CI; rewrite or delete.
- **`og-default.png`** referenced in `Base.astro` but not present in `public/`. Social embeds will 404 the og:image. Needs a 1200×630 PNG generated.
- **Studio mobile** has empty space below the SVG when the stage is taller than the canvas. Consider denser layout or a "↓ scroll" hint.
- **Mobile review pass.** A 390px walkthrough of every section is overdue.

## Visit analytics

The ClustrMaps script lives in `Base.astro` inside `<div class="visit-tracker">`. The `<div>` uses an sr-only style (1×1 px, clipped, off-screen) so the script's map widget is not rendered visually, but the tracking ping fires on every page load. Stats: `https://clustrmaps.com/site/1c7hs`.

## Where to look first if it's broken

- Build error: `npm run build` output; usually a content-schema mismatch in MDX frontmatter or a missing import after a rename.
- Visual debug: re-run `_homepage-preview.spec.ts` / `_atelier-preview.spec.ts` and inspect `tests/visual/shots/*.png`, or use `npx playwright show-report`.
- Studio not rendering: check `src/content/atelier.json` (`scene.scene.title = "Studio"`) and `AtelierScene.astro` (breadcrumb pulls from `scene.scene.title`).
- Themes not rendering: `ResearchThemes.astro` reads from `siteConfig.researchThemes` (in `src/content/site.json`).
- Em-dash hunt: `grep -rn "—" src/content src/components src/pages | grep -v "<!--"` should return only HTML/SVG comments. Any user-visible em-dash is a bug Tony will flag.
