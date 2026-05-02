# CLAUDE.md

Bootstrap doc for Claude Code (or any agent) jumping into this repo.

## What this is

`tonyyunyang.github.io` — Tony Yang's personal site. A custom Astro 5 build
in the **"Atelier × Cinema"** internal design language. Single-author project
with no template ancestry. Deploys via GitHub Actions to GitHub Pages on every
push to `main`.

The "personal layer" page (the cross-section illustration of Tony's study)
is called **Studio** in all user-visible copy. The URL is `/world/`. Tony
explicitly retired the name "Atelier" — don't reintroduce it in any
user-facing string. (Source files like `AtelierScene.astro` and
`atelier.json` keep their filenames for now to minimize churn.)

## Source of truth

- **Design spec:** `docs/superpowers/specs/2026-05-01-tonyyunyang-redesign-design.md`
- **Implementation plan:** `docs/superpowers/plans/2026-05-01-tonyyunyang-redesign.md`
- **Current state + cutover plan:** `docs/STATUS.md`
- **Improvement backlog:** `docs/POLISH.md`

When you need context on *why* something is the way it is, the spec is
authoritative. When in doubt about whether a change fits, check the spec
first; brainstorm an extension if it doesn't.

## Tech stack

- **Astro 5** (TypeScript, MDX content collections)
- **Tailwind v4** via `@tailwindcss/vite`
- **Self-hosted free fonts** through `@fontsource`:
  - Display: EB Garamond (400 + 500, both upright and italic)
  - Body: Inter (400, 500, 600, 400-italic)
  - Mono: JetBrains Mono (400, 500)
- **Pagefind** for client-side fuzzy search (powers `⌘K`)
- **Vitest** for unit tests, **Playwright** for E2E + visual screenshots
- **GitHub Actions** for build + deploy to Pages
- **ClustrMaps** for silent visit analytics (hidden in `Base.astro`)

No React/Vue/Svelte. Tiny vanilla TypeScript "islands" power the workbench,
command palette, and atelier scene.

## Daily commands

```sh
npm install
npm run dev             # http://localhost:4321 (dev server)
npm run build           # produces ./dist + Pagefind index
npm run preview         # serves the built ./dist locally
npm run check           # astro check
npm run test:unit       # vitest
npm run test:e2e        # playwright
npm test                # all tests

# Visual inspection (helper specs, all `_`-prefixed; PNGs → tests/visual/shots/, gitignored):
npx playwright test tests/e2e/_homepage-preview.spec.ts
npx playwright test tests/e2e/_atelier-preview.spec.ts
npx playwright test tests/e2e/_paper-thumbs.spec.ts
npx playwright test tests/e2e/_zoom-preview.spec.ts
```

NOTE: the legacy `tests/e2e/atelier-scene.spec.ts` and `_visual.spec.ts`
expect the original 4-viewport scene with arrow-key walk. They will fail
in CI; rewrite or delete before they run. See `docs/POLISH.md` §1.

## Repository layout (high-level)

```
src/
├── content/                  Zod-validated content collections
│   ├── config.ts             ← schema definitions
│   ├── papers/               one MDX per paper
│   ├── projects/             one MDX per project
│   ├── posts/                blog (MDX); set draft:false to publish
│   ├── news/news.mdx         single timeline entry
│   ├── teaching/teaching.mdx single list
│   ├── site.json             hero copy, §00 intro, research themes,
│   │                         business card, contact, projects/research deks
│   └── atelier.json          /world/ Studio scene data (single flat list
│                              of objects with x,y % coordinates)
├── components/
│   ├── Hero.astro            identity card + Plate I sketch (the page's
│   │                          first impression — name, role, PhD pill, etc.)
│   ├── Intro.astro           §00 (PhD opening + day-to-day)
│   ├── ResearchThemes.astro  6-card "Research compass" grid
│   ├── PaperCard.astro       (author name underline only on the name,
│   │                          NOT the trailing comma — see PaperCard.astro)
│   ├── ProjectCard.astro     thumbnails open primary link in new tab
│   ├── BusinessCard.astro    sketch-style §06 contact card
│   ├── SectionHeader.astro   `dekWide` prop (80ch); deks are Inter, NOT
│   │                          italic display (see Don'ts below)
│   ├── Sidenote.astro
│   ├── Icon.astro            hand-drawn engraving icon library
│   ├── PillLink.astro        accepts `icon` prop; min-height 44 px tap
│   ├── Folio.astro
│   ├── CommandPalette.astro
│   ├── SketchbookButton.astro  collapses to icon-only on ≤720 px
│   ├── AtelierScene.astro    Studio cross-section illustration
│   ├── Toc.astro
│   └── Workbench.astro       not currently mounted; ResearchThemes
│                              replaced it on the homepage
├── layouts/Base.astro        main layout (CommandPalette +
│                              SketchbookButton + hidden ClustrMaps tracker)
├── layouts/Post.astro        blog post layout
├── pages/
│   ├── index.astro           homepage (single long scroll)
│   ├── writing/              blog index + dynamic post route
│   ├── world.astro           Studio scene (route name retained)
│   ├── rss.xml.ts
│   └── 404.astro
├── scripts/                  client-side TS islands (palette, workbench, atelier)
├── styles/globals.css        design tokens + base layer (paper grain at 9% opacity)
└── lib/workbench-graph.ts    SVG graph builder (still used if Workbench is mounted)

public/                       static assets (cv.pdf, favicons, paper thumbs,
                              project SVGs, profile/Profile.jpg)
docs/                         specs, plans, status, polish
.github/workflows/deploy.yml  CI pipeline (deploys on push to main)
```

## Design tokens (don't drift)

```css
--paper        #F5EFE2
--paper-shade  #EDE6D5
--ink          #0F1417
--ink-soft     #4A5159
--accent       #0E5347   (deep emerald — links, highlights)
--hairline     #D9D2C2
--featured     #FAF1D8   (highlighted-paper tint)
```

Type rules:
- `var(--font-display)` (EB Garamond) — used **upright** for the hero
  name + business-card name, and **italic** ONLY for the hero quote,
  section title labels, business-card name italic variant, and Studio
  sidenotes. Body text is NEVER italic display — that read as too
  literary in earlier rounds.
- `var(--font-sans)` (Inter) — body running text, section deks
  (16-18 px / line-height 1.6), research-themes intro, paper summaries.
- `var(--font-mono)` (JetBrains Mono, uppercase, letter-spacing 0.08em)
  — captions, role lines, breadcrumbs, plate colophons.

Motion budget: hover 180ms ease-out, default 240ms ease-out, iris reveal
480ms, page transitions 320ms, atelier door 1200ms one-shot. Honor
`prefers-reduced-motion` (already wired via globals.css).

## Adding content

- **Paper:** drop `src/content/papers/<slug>.mdx` matching the Zod schema in
  `src/content/config.ts`. The card on the homepage and the live workbench
  graph update automatically.
- **Project:** same pattern under `src/content/projects/`.
- **Blog post:** drop `src/content/posts/<slug>.mdx`. Set `draft: false`
  when ready. It appears at `/writing/`, in the homepage §03 (3 newest),
  in `/rss.xml`, and in the sitemap with no other code change.

## Don'ts

- Don't add React/Vue/Svelte. Astro components + vanilla TS only.
- Don't introduce an eighth color. Stick to the 7 tokens above.
- **Don't use em-dashes (`—`) in user-visible content.** Tony explicitly
  doesn't like them. Use parens, periods, commas, the middle dot `·`, or
  the arrow `→` (for date ranges) instead. Hunt with
  `grep -rn "—" src/content src/components src/pages | grep -v "<!--"`
  before claiming polish work is done.
- **Don't reintroduce the name "Atelier"** in user-visible copy. The
  brand is **Studio** now. Filenames `AtelierScene.astro` and
  `atelier.json` are kept only to avoid churn; their contents read "Studio".
- **Don't remove or comment out the visit tracker** in `Base.astro`
  (the hidden `<div class="visit-tracker">` block). It's an off-screen
  ClustrMaps script that pings analytics without rendering a visible
  widget.
- **Don't make body deks italic display.** They were italic EB Garamond
  in earlier rounds and read as "fancy and distracting". They're upright
  Inter now for academic scannability — keep them that way.
- **Don't reduce the PhD-search pill prominence.** It's the page's
  primary call-to-action. The `Hero.astro:.hero__seeking` pill links to
  `#contact` and has min-height 44 px on touch; preserve both.
- **Don't push to `master`.** The default branch is `main`; `master`
  doesn't exist on this repo. Pushes to `main` auto-deploy.

## Polish workflow that worked (codex critique loop)

The site converged through three codex critique rounds (codex-rescue
subagent). The pattern:

1. Make a batch of changes locally.
2. Refresh `tests/visual/shots/` via the helper specs.
3. Dispatch codex-rescue with a focused critique prompt — point at
   specific files + screenshots, ask for ranked highest-impact-fixes
   first, under 500-700 words.
4. Apply codex's concrete suggestions verbatim where they're concrete.
5. Commit + push (auto-deploys).
6. Loop until codex says "converged" / "no urgent issues".

`docs/STATUS.md` has the run log + lessons. `docs/POLISH.md` has the
remaining backlog.

## Memory

Recurring per-user/per-project context lives at
`~/.claude/projects/-Users-tonyyunyang-Code-tonyyunyang-github-io/memory/`.
Refresh the project memory when ground truth changes (e.g., the redesign
ships, a new repo migration happens).
