# Project status — tonyyunyang.github.io

_Last updated: 2026-05-03 (after iteration 19 — iPhone Pro Max-specific fixes: pill stadium proportions + hero corner overlap + BusinessCard mobile rebuild)_

## TL;DR

- **Live at https://tonyyunyang.github.io.** Custom Astro 5 build, single-author project, no template ancestry, no fork lineage.
- Repo: `git@github.com:tonyyunyang/tonyyunyang.github.io.git`. Default branch `main`. HEAD `60a885a`.
- Local git identity for this project: `tony / tonyyunyang@outlook.com` (project-scoped via `git config --local`, NOT global).
- Auto-deploy: every push to `main` triggers `.github/workflows/deploy.yml` → builds Astro → uploads `dist/` → `actions/deploy-pages@v4` → live in ~45 s.
- Pages source is `workflow` (GitHub Actions, NOT Jekyll). `public/.nojekyll` is a defensive marker.
- Visit analytics wired up: ClustrMaps script in `Base.astro` inside an sr-only off-screen wrapper. No visible widget. Stats: `https://clustrmaps.com/site/1c7hs`.

## Polish iterations shipped (all on `main`)

```
60a885a  fix(iter 19): BusinessCard mobile rebuild — TY crest hidden, pill 12px radius, +56px bottom padding
de6e77d  fix(iter 18): hero corner-band / name vertical overlap on mobile
eb03ada  fix(iter 17): hero pill shape on iPhone Pro Max — drop full-width to restore stadium proportions
c770b92  feat(iter 16): three-agent polish pass (hero rhythm + card fix + animations)
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
- Identity card leads: large upright "Tony Yang 杨童耘" (EB Garamond 400 Latin + LXGW WenKai Chinese, NOT italic), role+location mono caps, prominent emerald **"Open to research · academia or industry →"** pill (links to `#contact`, min-height 44 px tap target).
- **Pill mobile shape** (iter 17): pill auto-sizes to its content (NOT full-width), so `border-radius: 999px` produces a properly proportioned stadium with semi-circular ends. The earlier full-width treatment created a stretched lozenge on iPhone 17 Pro Max (430 px) — drop `align-self: stretch; width: 100%` to fix.
- **Hero corner / name overlap** (iter 18): mobile padding-top is 56 px (44 px on ≤380), enough to clear the absolute corner annotation band so "Tony Yang" never sits in the same vertical zone as "§ N° 01 · PERSONAL".
- **Hero entry animation** (iter 16): `.hero__id` 4-child stagger (name → role → pill → specialty), fade + 8 px rise, 600 ms cubic-bezier(.22,.72,.16,1), 80 ms stagger, reduced-motion safe. Pill sparkle has a 5.4 s breathing pulse.
- Italic-display quote sits below the identity, smaller and ink-soft so it does not outweigh the open-to-research signal.
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
- Reading chair with a curled cat (`狸花猫` Chinese mackerel tabby) and a fedora hat hanging on the chair back.
- Acoustic guitar leaning between chair and desk (frets, headstock with 6 tuning pegs, strings, emerald pickguard).
- **Running shoes** as a paired side-profile: double-peak silhouette (toe peak + collar peak with instep dip), 14 px midsole foam slab, vertical heel counter, dark outsole strip with tread ticks, swoosh, eyelets, pull-tab.
- Window onto Amsterdam canal at evening (gables, church spire silhouette, boat).
- Pendant lamp + warm desk lamp pool on the laptop area.
- Desk vignette: laptop+code+coffee+candle+wedding-ring.
- Kitchen alcove: hanging pots, knife block, **wok** with dried Sichuan chilis tossed up + garlic + scattered peppercorns + flame accents (NOT a covered pot — Tony is from Sichuan, no slow simmer), wall etching frame above the desk.
- **Tulips** in a vase (5 stems, 4 distinct fill patterns) on the cabinet — bought every spring at the Bloemenmarkt, NOT a Monstera.
- **Two tennis rackets** (Pure Drive in cream + emerald grip + emerald swoosh; Blade in dark with cream-against-dark strings) leaning right wall — his + wife's.
- 13 hotspots, sidenote panel, T toggles all labels, `?at=<id>` deep links, Esc exits.
- Subtitle "March 2026 · Amsterdam evening" (iter 14 fix — single dot so "· EVENING" stops orphaning to a new row on narrow phones). Hint: "select an object · T all notes" (iter 15 — touch-friendly, no Esc duplicate).
- **Mobile tap-list** (iter 14): 2-col grid of buttons under the canvas, sharing data attributes with hotspots so the existing JS opens the same side-panel. Trailing odd tile spans full width (iter 15). Medal got `shortLabel: "Half marathon"` so its tile stays single-line.
- Idle motion timings rebalanced (iter 16): shared-duration animations get ±0.4 s + 0–1.2 s delay so the room no longer pulses in lockstep. Same animations, less synchronized.
- Sidenote names/notes (in `atelier.json`): cat is `瓜子 · 狸花猫 (planned)`; books are Sartre + Boom Latinoamericano (Borges); stove is wok + Sichuan stir-fry; plant is tulips at the Bloemenmarkt; rackets are Pure Drive + Blade; medal note rephrased so the repetitive "km-8" line is gone.

### Mobile UX
- Pill min-height 44 px tap target. Pill is **auto-width on mobile** (iter 17) so it stays a proper stadium shape; on the narrowest phones the label / when stack into 2 lines (column flex), separator hidden.
- PillLink (§00 + Contact) min-height 44 px.
- Mobile hero quote: clamp(18px, 5.2vw, 26px), max-width 28ch (preserves the original 4-line stanza).
- **Hero `padding-top: 56px`** (iter 18) on ≤720 px so the corner annotation band cannot overlap the name. 44 px on ≤380.
- Role-line tracking eased on mobile (0.18 → 0.14 em). On ≤380 px the role line column-stacks so "INDEPENDENT AI RESEARCHER · AMSTERDAM" stops dropping its dot to a fresh row.
- Sketchbook button collapses to icon-only on ≤720 px so it never obscures running copy mid-scroll.
- `main { padding-bottom: 88px }` on ≤720 px reserves end-of-page clearance.
- Section reveal pattern (iter 16): `SectionHeader` rule + heading + dek staggered fade-rise on first paint.
- Studio (`/world/`) on mobile: 2-col tap-list of every readable object below the canvas (iter 14), with the trailing odd tile spanning full width. Chrome hint reads "select an object · T all notes" (touch-friendly, no Esc duplicate).

### Site copy
- `openingHeadline`: "Built across LLMs, vision, world models, and clinical AI. Now I want to go deeper, in academia or industry."
- `openingBody`: "I've shipped research with Tencent, Gradient Networks, MeetaVista, TU Delft, McGill, Tsinghua, and IMDEA. The throughline I care about: useful, durable AI, especially where access and reliability matter."
- `researchThemesIntro`: "Two things drive this work: pushing AI beyond text into perception and action, and making those systems fairer and more reachable in practice."

### BusinessCard (§06 Contact)
- Tagline weight 500, ink at 88 % opacity (legible carry, not ink-soft fade).
- Bilingual name (Tony Yang · 杨童耘), structured languages (Mandarin native; English near-native, professional, IELTS 8.0).
- **Mobile (iter 19)**: TY crest hidden so name → role → tagline → divider → contact reads without an orphan row. Pill `border-radius: 12px` (refined tag/button, not stretched stadium). Card `padding-bottom: 56px` so the languages caption sits clearly above the SVG plate's inner border (which lives at viewBox y=446, ~3% from bottom). Contact list bumped 12 → 13.5 px mono for readability. Plate flourish hidden on mobile so the pill doesn't widen into it.
- Card entry animation (iter 16): 4-child stagger across content blocks (top → divider → bottom → signature). Contact link tactile 4 px right-nudge on hover.

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
- `_mobile-audit.spec.ts` (iter 14) — full-page captures at 320 / 375 / 390 / 414 / **430** (iPhone 17 Pro Max, added in iter 17). Use for verifying mobile rendering after any layout change.
- `_pill-zoom.spec.ts` (iter 14) — close-up screenshots of hero + business-card pills at every mobile width (including 430). Use for verifying the stacked label / when typography stays inside the pill border.
- `_section-audit.spec.ts` (iter 14) — per-section mobile screenshots (intro, themes, projects, writing, news, teaching, contact).
- `_iter15-audit.spec.ts` (iter 15) — hero-fold + intro-photo + themes-grid + papers + Studio @ 360 / 414.
- `_iter19-contact.spec.ts` (iter 19) — full-card contact screenshots at 320 / 375 / 390 / 414 / 430.

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
- **Verification grid going forward**: always check 320 / 375 / 390 / 414 / **430** (iPhone 17 Pro Max). The 430 viewport surfaced two real bugs (iter 17 stretched-pill, iter 19 inner-border overlap) that 414 alone did not catch. The `_mobile-audit` and `_pill-zoom` specs already include 430.
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
