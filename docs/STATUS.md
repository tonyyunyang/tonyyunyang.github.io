# Project status — tonyyunyang.github.io

_Last updated: 2026-05-03 (after iteration 16 — three parallel polish agents: hero rhythm + BusinessCard fixes + animation refinement)_

## TL;DR

- **Live at https://tonyyunyang.github.io.** Custom Astro 5 build, single-author project, no template ancestry, no fork lineage.
- Repo: `git@github.com:tonyyunyang/tonyyunyang.github.io.git`. Default branch `main`. HEAD `489b585`.
- Local git identity for this project: `tony / tonyyunyang@outlook.com` (project-scoped via `git config --local`, NOT global).
- Auto-deploy: every push to `main` triggers `.github/workflows/deploy.yml` → builds Astro → uploads `dist/` → `actions/deploy-pages@v4` → live in ~45 s.
- Pages source is `workflow` (GitHub Actions, NOT Jekyll). `public/.nojekyll` is a defensive marker.
- Visit analytics wired up: ClustrMaps script in `Base.astro` inside an sr-only off-screen wrapper. No visible widget. Stats: `https://clustrmaps.com/site/1c7hs`.

## Polish iterations shipped (all on `main`)

```
(iter 16) feat: three-agent polish pass (hero rhythm + card fix + animations)
f903368  feat(iter 15): mobile compaction round 2 (themes + intro photo + studio)
523ca13  feat(iter 14): academia-or-industry pill reframe + mobile rebuild
489b585  feat(iter 13): swap to variant C (anatomical realism) for cat + shoes
b5111d0  feat(iter 12): proper-cat-and-shoe redo from parallel-agent design pass
54b4677  feat(iter 11): LXGW WenKai for 杨童耘, alert 狸花猫 cat, cleaner running shoes
fed895e  feat(iter 10): broaden idle motion — stars, clock, medal, tennis ball, ripples
dd49d59  feat(iter 9): cat reads as 狸花猫, running shoes proportions, visible animations
bb8aca9  feat(iter 8): hero CN font, Plate I portal, Studio idle motion, cat 狸花猫, shoes redo
3826701  feat(iter 7): mobile Studio CTA → icon-only
70442c6  feat(iter 6): tighten mobile hero, shoes refine, heart asymmetry, tap targets
0987377  feat(iter 5): hero identity card, paper SVG redo, studio polish, type swap
e04e7db  feat: initial commit
```

Earlier iterations (1–4) were rolled into the initial commit when the
repo was migrated to a fresh slate. The design history that motivated
those rounds lives in `docs/superpowers/` (internal doc, not user-facing).

## What lives in the repo today

### Hero (the design north star)
- Identity card leads: large upright "Tony Yang 杨童耘" (EB Garamond 400, NOT italic), role+location mono caps, prominent emerald **"Open to research · academia or industry →"** pill (links to `#contact`, min-height 44 px tap target, and on mobile becomes a full-width 2-line stack so the label / when never wrap mid-phrase), specialty tagline.
- Italic-display quote sits below the identity, smaller and ink-soft so it does not outweigh the PhD search signal.
- Top corners: printer's-plate header `§ N° 01 · PERSONAL` // `AMSTERDAM · 2026`.
- Animated chevron + "scroll for the work" cue at the bottom-center; ⌘K hint at bottom-right.
- Plate I sketch on the right (architectural arched window with hatched corners, 4-pane mullion+transom, crescent moon + halo, Westerkerk-style spire, gables with chimneys + smoke + lit windows, canal water with a small rower-with-oars, writing tableau under the sill: open book + spectacles + quill rising from inkwell + letters with emerald wax seal + steaming teacup).

### Type system
- Italic display (EB Garamond italic) is reserved for: hero quote, section title labels, business-card name, Studio sidenotes only.
- Body deks + research themes intro use upright Inter at 16–18 px / line-height 1.6 (academic-scannable, not literary).
- New imports in `globals.css`: EB Garamond 400/500 upright, Inter 600.

### Paper thumbnails (`public/papers/*.svg`, all square 240×240 viewBox)
- `prune-nnunet.svg` — U-Net encoder/decoder skeleton, mostly-dashed pruned skip connections, × marks on cuts, "99% SPARSE" emerald badge moved off the corner so the rounded card border never clips it, "CORE" bottleneck (MIDL '25).
- `reverse-imaging.svg` — anatomically asymmetric heart silhouette (right side fuller, narrower apex, curved septal), three orbiting MRI panels (T1, M0, T2*), prominent T2* synthesized panel with "SYNTHESIZED" label, emerald "REVERSE" arrow + tighter letter-spacing (MICCAI '25).
- `through-eyes.svg` — 7 large emotion glyphs (r=15) ringed around a small central VR headset with two lensed eyes + dotted gaze trace; gaze rays from headset to each emotion; "240 Hz" emerald badge tucked in corner (IMWUT '25).
- Old PNG thumbnails removed from `public/papers/`.

### PaperCard
- Author name underline highlights only the name (not the trailing comma). The `, ` separator span sits outside the `.is-me` wrapper.

### Studio (`/world/`, `AtelierScene.astro` + `atelier.json`)
- Bookshelf at left (with framed portrait + postcard above).
- Reading chair with a curled cat (sleeping eye, emerald nose, whiskers, tabby stripe hint, Z-glyph) and a fedora hat hanging on the chair back.
- Acoustic guitar leaning between chair and desk (frets, headstock with 6 tuning pegs, strings, emerald pickguard).
- **Running shoes** as a paired side-profile: double-peak silhouette (toe peak + collar peak with instep dip), 14 px midsole foam slab, vertical heel counter, dark outsole strip with tread ticks, swoosh, eyelets, pull-tab.
- Window onto Amsterdam canal at evening (gables, church spire silhouette, boat).
- Pendant lamp + warm desk lamp pool on the laptop area.
- Desk vignette: laptop+code+coffee+candle+wedding-ring.
- Kitchen alcove: hanging pots, knife block, **wok** with dried Sichuan chilis tossed up + garlic + scattered peppercorns + flame accents (NOT a covered pot — Tony is from Sichuan, no slow simmer), wall etching frame above the desk.
- **Tulips** in a vase (5 stems, 4 distinct fill patterns) on the cabinet — bought every spring at the Bloemenmarkt, NOT a Monstera.
- **Two tennis rackets** (Pure Drive in cream + emerald grip + emerald swoosh; Blade in dark with cream-against-dark strings) leaning right wall — his + wife's. Moved left + larger heads so they separate from the cabinet edge.
- 13 hotspots, sidenote panel, T toggles all labels, `?at=<id>` deep links, Esc exits.
- Sidenote names/notes (in `atelier.json`): cat is `瓜子 · the cat (planned)`; books are Sartre + Boom Latinoamericano (Borges); stove is wok + Sichuan stir-fry; plant is tulips at the Bloemenmarkt; rackets are Pure Drive + Blade; medal note rephrased so the repetitive "km-8" line is gone.

### Mobile UX
- PhD pill min-height 44 px tap target.
- PillLink (§00 + Contact) min-height 44 px.
- Mobile hero quote: clamp(18px, 5.2vw, 26px), max-width 28ch (preserves the original 4-line stanza).
- Top-corner meta lifted from 20 → 16 px so it stops crowding the name.
- Role-line tracking eased on mobile (0.18 → 0.14 em).
- Sketchbook button collapses to icon-only on ≤720 px so it never obscures running copy mid-scroll.
- `main { padding-bottom: 88px }` on ≤720 px reserves end-of-page clearance.

### Site copy
- `openingHeadline`: "Built across LLMs, vision, world models, and clinical AI. Now I want to go deeper, in academia or industry."
- `openingBody`: "I've shipped research with Tencent, Gradient Networks, MeetaVista, TU Delft, McGill, Tsinghua, and IMDEA. Next I want long-horizon work on useful, durable AI, especially where access and reliability matter."
- `researchThemesIntro`: "Two things drive this work: pushing AI beyond text into perception and action, and making those systems fairer and more reachable in practice."

### BusinessCard (§06 Contact)
- Tagline weight 500, ink at 88 % opacity (legible carry, not ink-soft fade).
- Bilingual name (Tony Yang · 杨童耘), structured languages (Mandarin native; English near-native, professional, IELTS 8.0).

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

## Helper preview specs (all `_`-prefixed, write to gitignored `tests/visual/shots/`)

- `_homepage-preview.spec.ts` — desktop hero + full-page + workbench + mobile.
- `_atelier-preview.spec.ts` — Studio at multiple viewports + sidenote + T-mode.
- `_thumb-render.spec.ts` — eager-loads images for full-page captures.
- `_paper-thumbs.spec.ts` — individual paper thumbnail closeups.
- `_zoom-preview.spec.ts` — Plate I 1× / 2×, themes, research, papers list, Studio enlarged 2700 px, kitchen+rackets+tulips, shoes.

## How the deploy works

The workflow at `.github/workflows/deploy.yml`:
1. Triggers on push to `main`, PRs targeting `main`, or manual dispatch.
2. Checks out, installs (`npm ci`), runs `npm run build` (which produces `dist/` with the Pagefind index).
3. Uploads `dist/` as a Pages artifact and deploys via `actions/deploy-pages@v4`.

Pages is configured to use this workflow (NOT Jekyll). If the source ever needs to be re-flipped after a config reset:

```sh
gh api -X PUT repos/tonyyunyang/tonyyunyang.github.io/pages -f build_type=workflow
gh api repos/tonyyunyang/tonyyunyang.github.io/pages | grep build_type
# expect "build_type": "workflow"
```

The legacy `pages-build-deployment` Jekyll workflow only fires when Pages source is set to "branch". Once flipped to "workflow" it stops triggering. `public/.nojekyll` is a defensive marker on top of that.

## Known follow-ups (open polish backlog → see `docs/POLISH.md`)

- **Old E2E specs** `tests/e2e/atelier-scene.spec.ts` + `_visual.spec.ts` still expect the original 4-viewport scene with arrow-key walk. They will fail when CI runs them; rewrite or delete.
- **`og-default.png`** referenced in `Base.astro` but missing in `public/`. Social embeds will 404 the og:image until a 1200×630 PNG is generated.
- **Studio mobile** has empty space below the SVG when the stage is taller than the canvas. Consider a denser layout or a "↓ scroll" hint underneath.
- **Lighthouse verification** on the live URL (Accessibility ≥ 100, Performance ≥ 95, SEO ≥ 100, Best Practices ≥ 100) is overdue.

## Where to look first if it's broken

- Build error: `npm run build` output; usually a content-schema mismatch in MDX frontmatter or a missing import after a rename.
- Visual debug: re-run `_homepage-preview.spec.ts` / `_atelier-preview.spec.ts` and inspect `tests/visual/shots/*.png`, or use `npx playwright show-report`.
- Studio not rendering: check `src/content/atelier.json` (`scene.scene.title = "Studio"`) and `AtelierScene.astro` (breadcrumb pulls from `scene.scene.title`).
- Themes not rendering: `ResearchThemes.astro` reads from `siteConfig.researchThemes` (in `src/content/site.json`).
- Em-dash hunt: `grep -rn "—" src/content src/components src/pages | grep -v "<!--"` should return only HTML/SVG comments. Any user-visible em-dash is a bug.

## Codex critique loop (used heavily, recommend continuing)

The codex-rescue subagent was used three times during iter 5 → 7 polish for design critique passes. The pattern that worked:

1. Make a batch of changes locally.
2. Run helper Playwright specs to refresh `tests/visual/shots/`.
3. Dispatch codex-rescue with a focused critique prompt (point at specific files + screenshots, ask for ranked highest-impact-fixes-first under 500-700 words).
4. Apply codex's concrete suggestions verbatim where they're concrete.
5. Commit + push (auto-deploys to live).
6. Loop until codex says "converged" / "no urgent issues".

Round 3 declared convergence after iter 7. If you ship more polish, run the same loop again.
