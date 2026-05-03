# Polish & improvement backlog

_Last updated: 2026-05-03 (after iteration 15 — mobile compaction round 2 from a second codex critique pass)_

A working list of things noticed during build & visual inspection that
would sharpen the site further. Pick one bullet per session, work on
it, push.

## Closed in iteration 15

A second codex critique pass after iter 14 returned "close to converged · no P0". The remaining items were P1 / P2 polish fixes, all applied:

- ✅ **Studio mobile chrome trimmed**: hint dropped its trailing "· Esc close" since the dedicated Esc button already lives in the chrome bar. Now reads "select an object · T all notes". Files: `src/components/AtelierScene.astro`.
- ✅ **Research themes compacted on mobile (≤560px)**: card padding 26/24/24 → 20/20/18, gap 14 → 10, glyph height 36 → 28, title 22 → 20, blurb 15 → 14 / line-height 1.55 → 1.5, intro margin-bottom 40 → 28. The 6-card column now reads as a compass instead of a long staircase.
- ✅ **Intro photo capped on mobile**: `width: min(100%, 320px); margin-inline: auto` so the 1:1 portrait stops dominating the §00 reading area.
- ✅ **Studio mobile tap-list orphan**: with 13 readable objects (odd count), the trailing tile used to sit alone in the left column. `li:last-child:nth-child(odd)` now stretches it across both columns so the grid resolves cleanly.
- ⏭ **Hero scroll cue below fold (skipped)**: codex confirmed this is not a real ship problem — the Plate I sketch already functions as the visual continuation cue. No diff applied.

## Closed in iteration 14

- ✅ **Hero pill reframed**: "Seeking PhD positions · my contact info →" → **"Open to research · academia or industry →"**. Tony's framing is "always looking for research to enjoy", which can attach a PhD or an industry research role; the old copy read as a job-search status. The pill structure was also restructured (`hero__seeking-content` wrapper) so on mobile (`@media ≤720px`) the label / when stack into 2 lines inside a full-width pill instead of breaking mid-phrase. Files: `src/components/Hero.astro`.
- ✅ **§00 opening headline rewritten**: "Now I want a PhD with room for deeper work" → **"Now I want to go deeper, in academia or industry"**. Same broadening (academia OR industry) and tighter prose (codex's recommended option from three drafts).
- ✅ **BusinessCard pill split** the same way: `card.looking` is parsed on the middle dot at build time and rendered as label + when, with a column-stack mobile treatment that mirrors the hero pill.
- ✅ **News + intro + businessCard all updated** for consistency: no remaining "Seeking PhD positions" string in any user-visible content.
- ✅ **Hero narrow-phone breakpoint (≤380px)** added: smaller name + corner labels, tighter padding, and a column-stacked role line so "INDEPENDENT AI RESEARCHER · AMSTERDAM" no longer wraps with a stranded city below the dot.
- ✅ **Studio mobile tap-list**: under the canvas on mobile, every readable object renders as a 2-col grid of buttons that share data attributes with the canvas hotspots so the existing JS opens the same side-panel. The empty space below the 16:10 canvas now becomes a usable index. Stage flex-direction set to column on mobile so the list sits below the canvas, not beside it. The medal hotspot got a `shortLabel: "Half marathon"` so its tile stays single-line.
- ✅ **Studio chrome touch-friendly + breadcrumb fix**: hint reads "select an object" (not "click"), and the subtitle dropped its trailing dot ("March 2026 · Amsterdam evening" instead of "March 2026 · Amsterdam · evening") so the orphan "· EVENING" no longer wraps to a fresh line on narrow phones.
- ✅ **Helper specs added** (all `_`-prefixed, gitignored shots): `_mobile-audit.spec.ts` for full-page captures at 320 / 375 / 390 / 414 plus Studio + writing + contact, `_pill-zoom.spec.ts` for hero + card pill close-ups at every mobile width, `_section-audit.spec.ts` for per-section mobile screenshots.

## Closed in iterations 9–13

- ✅ **iter 13**: Swapped Studio cat + running shoes to variant C
  (anatomical realism) after a parallel-agent design pass. Cat is now
  a sitting alert 狸花猫 with dark almond ink eyes (slit pupils),
  cream catchlights, layered fur tones, M-mark forehead, ringed tail,
  cream chest + tucked paws. Shoes are a side-profile pair with proper
  rocker bottoms, exposed dark outsole + tread ticks, sweeping swoosh,
  visible heel pull tab, eight eyelets, mesh dot toe-box texture.
- ✅ **iter 12**: Spawned 4 isolated worktree agents in parallel
  (engraving / bold-flat / anatomical / minimal-icon) and applied the
  bold-flat variant briefly before iter 13's variant-C lock-in.
- ✅ **iter 11**: Switched the Chinese name `杨童耘` from Noto Serif SC
  to **LXGW WenKai** (humanist calligraphic, pairs warmly with EB
  Garamond's serif). Slightly smaller (`0.5em → 0.44em`).
- ✅ **iter 10**: Broadened idle motion across the Studio — stars
  twinkle, clock minute hand 8 s / hour hand 60 s rotation, half-
  marathon medal swings on its ribbon, new tennis ball next to the
  rackets squishes / settles, houseboat bobs + rocks, water ripples
  shimmer at four different rates, pendant lamp sways from the ceiling
  cap, curtain waves, cat tail twitches occasionally.
- ✅ **iter 9**: Boosted animation amplitudes after Tony reported the
  iter 8 motion was imperceptible. Added `_motion-check.spec.ts` that
  takes two screenshots 1.5 s apart and confirms pixel-level
  differences on the live build.

## Closed in iteration 8

- ✅ **Chinese name typography**: `杨童耘` now uses Noto Serif SC (Source Han Serif) so it pairs cleanly with EB Garamond, with bumped letter-spacing and a slight upward translate to align caps with the Latin baseline.
- ✅ **Identity-card spacing tightened**: `.hero__id` gap 14 → 22 px, name line-height 1 → 1.05, name margin-bottom 6 px so "Tony Yang 杨童耘" stops crowding the role line below.
- ✅ **PhD pill copy** changed from "READY ANY TIME" → "MY CONTACT INFO" so the pill announces it leads to the contact card.
- ✅ **Plate I sketch is now a clickable portal into Studio**: wrapped in `<a href="/world/">`, with a persistent emerald "studio ↗" tag at rest in the bottom-right of the sketch (anchored near the plate colophon, not the italic margin annotation), idle hover lift, and motion on the moon halo / boat / chimney smoke / teacup steam. Reduced-motion users get the static plate.
- ✅ **§00 Currently shows the email address** (`tonyyunyang@outlook.com`) as a visible row above the email/scholar/github/cv pills, so visitors don't have to click to read it.
- ✅ **Reverse-imaging paper SVG redrawn** with non-overlapping rows: T1 + DIFFUSION + M0 across the top, heart in the middle, REVERSE arrow, T2* SYNTHESIZED panel, CMR caption. Microtype on DIFFUSION / SYNTHESIZED / CMR caption was bumped so it stays legible at 240×240 thumbnail scale.
- ✅ **Cat is now `狸花猫`** (Chinese mackerel tabby): ink-soft base coat with bold mackerel stripes, ringed tail, M-mark on forehead, cheek stripes, ear-tip darks. Label updated to `瓜子 · 狸花猫 (planned)` in `atelier.json`. The on-canvas tag uses `shortLabel: "Cat"` so the initial reveal stays atmospheric.
- ✅ **Running shoes redrawn** with proper running-shoe anatomy: low toe spring, vamp / lacing area, ankle-collar dip, vertical heel counter, thick midsole foam, dark outsole with tread ticks, swoosh, tongue, eyelets, mesh dots, heel pull tab.
- ✅ **Studio idle motion**: lamp glow pulse, candle flame flicker + halo pulse, coffee + wok steam rise + fade, wok flames flicker, tulip stems sway, moon halo pulse, cat zzz drift. Reduced-motion users get a static room.
- ✅ **Initial label reveal in Studio**: every hotspot label is visible briefly on entry then fades unless the user pressed T or arrived via `?at=<id>` deep link. Long verbose labels (cat, tennis rackets, wok, window) gained a `shortLabel` so the on-canvas tag stays terse while the side panel header keeps the full label.
- ✅ **Sketchbook (Studio CTA) more obvious by default**: emerald background, paper text, expanding emerald halo ring, slow breathing pulse, slightly larger tap target. Restrained enough to sit *behind* the hero PhD pill in visual hierarchy.
- ✅ **`_zoom-preview.spec.ts` patched**: emulates `prefers-reduced-motion: reduce` so screenshots stabilise even with the new idle animations.

## Closed in iteration 7

- ✅ **Mobile Studio CTA collapsed to icon-only** — was covering running copy mid-scroll; now hides `.sketchbook__text` and `.sketchbook__arrow` on ≤720 px and tightens to a 24×24 glyph in 12 px padding.

## Closed in iteration 6

- ✅ **Mobile hero quote shrunk + flourish margins trimmed** — quote now clamp(18px, 5.2vw, 26px) at line-height 1.18, max-width 28ch (preserves original 4-line stanza).
- ✅ **PhD pill tap target raised to 44 px** — padding 12/11 px + min-height 44 px so the primary CTA hits comfort spec on touch.
- ✅ **PillLink tap targets** raised to 44 px (carries through to §00 + Contact pills).
- ✅ **Fixed Studio CTA no longer overlaps copy at end-of-page** — `main { padding-bottom: 88px }` on ≤720 px.
- ✅ **`openingHeadline` rewritten as proof-of-fit** instead of duplicating the PhD pill verbatim.
- ✅ **`openingBody` tightened** to one proof + one direction sentence (was a longer breadth-claim the cards already prove).
- ✅ **`researchThemesIntro` tightened** to a single scannable sentence.
- ✅ **Running shoes redrawn** with concrete fixes: 14 px midsole, toe-spring lift, vertical heel counter, front shoe offset further so the pair stops fusing, outsole tread ticks.
- ✅ **Reverse-imaging heart redrawn anatomically** — right chamber fuller, narrower apex, curved septal — instead of valentine icon. REVERSE label closer to arrow with letter-spacing tightened to 0.12 em.
- ✅ **Two-threads ornament opacity** dropped 0.55 → 0.45 for a quieter exit.
- ✅ **BusinessCard tagline** weight 500, color ink at 88 % opacity (was ink-soft).
- ✅ **Top-corner meta** lifted on mobile (20 → 16 px) so it stops crowding the name.
- ✅ **Mobile role tracking** eased 0.18 → 0.14 em.
- ✅ **`intro__opening` margin** 12 → 8 px now that the body is shorter.
- ✅ **Last em-dash scrubbed** from `src/content/posts/hello.mdx`.

## Closed in iteration 5

- ✅ **Hero identity card** — large upright "Tony Yang 杨童耘", role+location mono, prominent emerald PhD pill (links to `#contact`), specialty tagline. The italic-display quote shrunk + softened to ink-soft so the identity leads.
- ✅ **Type system swap** — section deks + research-themes intro went from EB Garamond italic display to upright Inter at 16–18 px / line-height 1.6.
- ✅ **Paper SVGs recomposed around the science** — through-eyes: 7 emotion glyphs ringed around a small VR headset; reverse-imaging: prominent T2* synthesized panel + REVERSE arrow; prune-nnunet: square 240×240 so the "99% SPARSE" badge never gets clipped by the rounded card border.
- ✅ **Plate I "fatal" fixed** — awkward boat mast replaced with a tiny rower silhouette + two oars at angles.
- ✅ **Studio rewritten to the user's life** — cat is `瓜子` (sunflower seeds), books are Sartre + Boom Latinoamericano (Borges), pot → wok with Sichuan stir-fry (dried chilis + garlic + peppercorns + flame accents), Monstera → tulips at the Bloemenmarkt (5 stems, 4 distinct fills), tennis racket → a pair (Pure Drive + Blade), running shoes redrawn as side-profile sneakers, "km-8" line removed, em-dash in tennis note removed.
- ✅ **ClustrMaps tracker added invisibly** in `Base.astro` (sr-only off-screen wrapper).
- ✅ **Repo migration** to a fresh new GitHub repo, no template ancestry, single clean initial commit.
- ✅ **Pages auto-deploy** via GitHub Actions (`build_type: workflow`), `.nojekyll` defensive marker.

## High — worth doing before showing the site to a wide audience

### 1. Old atelier E2E tests still expect arrow-key navigation

`tests/e2e/atelier-scene.spec.ts` and `tests/e2e/_visual.spec.ts` test the original 4-viewport scene with `ArrowRight` walking and `[data-viewport]` queries. The Studio is now a single scene; these tests will fail in CI. Either rewrite to match the new structure (sidenote click, T-mode, Esc, deep-link `?at=<id>`) or delete the obsolete cases. The helper specs `_homepage-preview.spec.ts` / `_atelier-preview.spec.ts` / `_thumb-render.spec.ts` / `_paper-thumbs.spec.ts` / `_zoom-preview.spec.ts` already cover the basics for visual review.

### 2. Add a real `og:image`

`src/layouts/Base.astro` references `/og-default.png` for `og:image` and `twitter:card`, but no such file exists in `public/`. Embedded shares (Slack, Discord, X, LinkedIn) currently fail to preview.

**Fix:** export a 1200×630 PNG using the design system. Easiest path: render the new hero "twilight window" Plate I sketch on cream paper with the name "Tony Yang" and the role line below in JetBrains Mono. Drop into `public/og-default.png`. Optional v2: per-page OG.

### 3. Lighthouse verification (post-deploy)

Spec §13 success criterion #9 calls for Accessibility ≥ 100, Performance ≥ 95, SEO ≥ 100, Best Practices ≥ 100 on a Lighthouse mobile run. Verify on the live URL now that the site is shipped. Easy win: serve the favicon at the right sizes, ensure all images have alt text.

## Medium — polish for craft

### 4. Studio: mobile whitespace below the canvas

The cross-section reads as a real place at full scene scale, but on mobile the canvas centers vertically with empty space below. Consider:
- A "↓ scroll for the writing tools" prompt below the SVG.
- A denser layout that scales the canvas to fill more vertical room.
- A small ornament (printer's flourish) to occupy the empty space stylistically.

### 5. Studio: phase-2 Three.js upgrade

Spec §4.6 still pencils this in. Same content (objects, sidenotes, deep-link IDs), gains low-poly parallax + orbit. ~1–2 days of work when motivated.

### 6. Mobile workbench / themes responsiveness

The Research Themes grid handles three breakpoints (3 / 2 / 1 columns) and looks fine in smoke tests. A finer pass on narrow phones (320–360 px) is worth doing — verify card padding, dek line-height, the cross-cutting threads ornament under the grid.

### 7. Hero photo: try alternatives

The duotone filter is gone, photo is naturally rendered with corner brackets. Could still try:
- pure grayscale
- a slightly toned matte
- swap the photo entirely for a more recent shot

### 8. Smoother section transitions / scroll-driven flourishes

The hero flourish is static. Consider scroll-triggered ornaments that draw in as each §-numbered section enters viewport. Honor `prefers-reduced-motion`.

### 9. Studio sidenote panel: less chrome

The chrome bar at the top of `/world/` has three pieces (breadcrumb, hint, Esc button). On narrow viewports it stacks. Could simplify to a single floating Esc affordance + a hover-revealed breadcrumb.

## Low — nice-to-have

### 10. Dark mode

Spec §11 (out of scope for MVP). The `theme` command is already wired up as `disabled` in the palette. To add: introduce a `[data-theme="dark"]` override block at the bottom of `globals.css` flipping `--paper` → near-black, `--ink` → cream, etc. Persist via `localStorage` from the palette command. ~half-day.

### 11. Custom OG per blog post

When the blog grows, generate per-post `og:image` at build time using `@vercel/og` or a `satori`-based Astro endpoint. Optional.

### 12. Comments / guestbook

Out of scope. Lightest path: a `<a href="mailto:tonyyunyang@outlook.com">` reply prompt at the bottom of each post, or self-hosted Giscus.

### 13. Analytics beyond ClustrMaps

ClustrMaps is wired up silently in `Base.astro` and reports at `https://clustrmaps.com/site/1c7hs`. If deeper analytics are wanted later, add Plausible (privacy-respecting) — ~2 lines in `Base.astro`.

### 14. Newsletter signup

Out of scope. If wanted: Buttondown form embedded in §03 footer.

### 15. Sitemap & RSS verification

Both auto-generate. Paste `/rss.xml` into a feed reader and `/sitemap-index.xml` into Google Search Console once curiosity about discoverability kicks in.

### 16. i18n / Chinese version

Out of scope. Tony's resume has a Chinese version; if a `/zh/` route is ever wanted, Astro's i18n routing can do it without a third-party lib. The BusinessCard already shows 杨童耘 next to "Tony Yang" so there's a hook.

### 17. View-through to citations / paper-detail pages

Future upgrade: render `/papers/[slug]/` detail pages from the same MDX, including bibtex, related work links, and a more spacious abstract.

### 18. Replace remaining `<!-- — -->` HTML comments with hyphens

Pure cosmetic. User asked for no em-dashes anywhere, which has been done in user-visible content. HTML/SVG comments still have stray em-dashes (cosmetic only). Optional sweep.

### 19. Node.js 24 opt-in for the deploy workflow

GitHub annotated the deploy run with a Node.js 20 → 24 deprecation notice (full removal September 2026). Easy update: pin the workflow steps to action versions that support Node 24, or set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` on the runner. Not urgent until June 2026.

## How to use this file

When you (or a future Claude) want to iterate, pick a single bullet from
this list, branch off `main`, work on it, push (auto-deploys). Keep
changes scoped to one item per push so the brand stays coherent.

The codex critique loop in `docs/STATUS.md` is the recommended pattern
for design polish: implement → screenshot → codex critique → apply → push.
