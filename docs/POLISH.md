# Polish & improvement backlog

_Last updated: 2026-05-02 (after iteration 7 + codex round-3 convergence)_

A working list of things noticed during build & visual inspection that
would sharpen the site further. Codex round 3 declared the design
converged — everything below is either backlog (high) or out-of-scope
(low). Pick one bullet per session, work on it, push.

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
