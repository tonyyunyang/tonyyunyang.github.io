# Polish & improvement backlog

_Last updated: 2026-05-02 (after iteration 4 of polishing + repo migration)_

A working list of things noticed during build & visual inspection that would
sharpen the redesign. Tony has been driving iterative rounds — the items
below are what's left or newly noticed after iter 3.

## Closed in iteration 4

- ✅ **Plate I redesign** — bigger sketch (clamp(240px, 26vw, 340px)), richer Amsterdam canal scene with church spire + boat + crescent moon halo, denser writing tableau (book + spectacles + quill + letters + teacup), bumped italic captions and mono colophon.
- ✅ **Section deks readability** — `.dek` and `.themes__intro` italic font-size raised to clamp(20px, 1.7vw, 23px) from 18px.
- ✅ **Paper thumbnails match the rest** — three new engraving SVGs (prune-nnunet, reverse-imaging, through-eyes) replacing the off-brand PNG figures.
- ✅ **Author-name highlight on PaperCard** — the underline no longer extends under the trailing comma; comma separator moved outside the `.is-me` wrapper.
- ✅ **Studio: bigger cat + atmosphere** — cat resized + new ears, sleeping eye, whiskers, Z-glyph, emerald nose. Added fedora on chair back, leaning guitar with pickguard, wall etching frame above desk, stronger lamp pool on laptop.

## Closed in iterations 2 + 3

These were on the iter 1 polish list and are now addressed:

- ✅ **Atelier illustrations** — replaced the Lucide-icon parade with a single richly-illustrated cross-section of the Studio (bookshelf + reading chair + cat + window + canal + desk + alcove + plant + tennis racket + framed portrait + postcard + clock).
- ✅ **Project thumbnails for the 4 ongoing collaborations** — all redrawn as engraving-style SVGs (LLM Router, Cost-Adaptive, Human Intent World Model, LLM for Optimization). ScholarHighlights also redrawn as SVG (the off-brand PNG icon is gone).
- ✅ **Workbench responsiveness on narrow viewports** — the original workbench was retired entirely; replaced by the Research Themes grid which has a real responsive layout (3 → 2 → 1 columns).
- ✅ **Atelier viewport backgrounds** — irrelevant after the rebuild.
- ✅ **"Posts collection is empty" quieting** — still a warning, but only at build time. Disappears on first published post.
- ✅ **Hero photo treatment alternatives** — duotone filter removed, hand-drawn corner brackets added.
- ✅ **Hero scroll-pinning** — opted for a stronger hero (right-side window-onto-canal sketch + flourish ornament + smaller tagline) instead of pinning. Pinning may revisit later.

## High — worth doing before showing the site to a wide audience

### 1. Old atelier E2E tests still expect arrow-key navigation

`tests/e2e/atelier-scene.spec.ts` and `tests/e2e/_visual.spec.ts` test the original 4-viewport scene with `ArrowRight` walking and `[data-viewport]` queries. The Studio is now a single scene; these tests will fail in CI. Either rewrite to match the new structure (sidenote click, T-mode, Esc) or delete the obsolete cases. Helper specs `_homepage-preview.spec.ts` / `_atelier-preview.spec.ts` / `_thumb-render.spec.ts` already cover the basics.

### 2. Add a real `og:image`

`src/layouts/Base.astro` references `/og-default.png` for `og:image` and `twitter:card`, but no such file exists in `public/`. Embedded shares (Slack, Discord, X, LinkedIn) will currently fail to preview.

**Fix:** export a 1200×630 PNG using the design system — display serif name + tagline + accent emerald underline on cream paper, or render the new hero "twilight window" sketch. Drop into `public/og-default.png`. Optional v2: per-page OG.

### 3. Mobile review pass

Iter 2-3 was driven from the desktop screenshots. A walkthrough at 390px of every section (hero / §00 / Research Themes / Research / Projects / Writing / News / Teaching / Contact / Studio) is overdue. Likely victims: the BusinessCard (probably too tall on mobile), the Studio horizontal-scrolling content, and the Hero sketch (currently positioned absolutely, switches to flow on narrow).

### 4. Pagefind index in production

The palette runs commands fine without it, but free-text search depends on `/pagefind/pagefind.js` which only exists post-build. The deploy workflow already runs `pagefind --site dist`, so this works in production. Verify after cutover with `⌘K → "neural"` (should return paper hits).

## Medium — polish for craft

### 5. Studio: more atmosphere, denser room

The cross-section reads as a real place but the cat is small at thumbnail-size. Consider:
- Bigger cat silhouette
- More wall objects (a hat on a hook, a guitar leaning, a coat on a chair)
- Stronger atmospheric shading (warmer evening tone on the desk surface; light pool on the laptop)
- Mobile: the canvas centers vertically with empty space below; consider denser layout or a "↓ scroll for the writing tools" prompt below the SVG.

### 6. Studio: phase-2 Three.js upgrade

Spec §4.6 still pencils this in. Same content (objects, sidenotes, deep-link IDs), gains low-poly parallax + orbit. ~1-2 days of work when motivated.

### 7. Mobile workbench / themes responsiveness

The Research Themes grid handles three breakpoints (3/2/1 columns) and looks fine in smoke tests. A finer pass on narrow phones (320px-360px) is worth doing.

### 8. Hero photo: try alternatives

The duotone filter is gone, photo is naturally rendered with corner brackets. Could still try:
- pure grayscale
- a slightly toned matte
- swap the photo entirely for a more recent shot if Tony has one

### 9. Smoother section transitions / scroll-driven flourishes

The hero flourish is static. Consider scroll-triggered ornaments that draw in as each §-numbered section enters viewport. Honor `prefers-reduced-motion`.

## Low — nice-to-have

### 10. Dark mode

Spec §11 (out of scope for MVP). The `theme` command is already wired up as `disabled` in the palette. To add: introduce a `[data-theme="dark"]` override block at the bottom of `globals.css` flipping `--paper` → near-black, `--ink` → cream, etc. Persist via `localStorage` from the palette command. ~half-day.

### 11. Custom OG per blog post

When the blog grows, generate per-post `og:image` at build time using `@vercel/og` or a `satori`-based Astro endpoint. Optional.

### 12. Comments / guestbook

Out of scope. Lightest path: a `<a href="mailto:tonyyunyang@outlook.com">` reply prompt at the bottom of each post, or self-hosted Giscus.

### 13. Analytics

Add Plausible (or similar privacy-respecting) when curiosity about traffic kicks in. ~2 lines in `Base.astro`.

### 14. Newsletter signup

Out of scope. If wanted: Buttondown form embedded in §03 footer.

### 15. Sitemap & RSS verification

Both auto-generate. After cutover, paste `/rss.xml` into a feed reader and `/sitemap-index.xml` into Search Console to confirm.

### 16. Lighthouse target verification (post-deploy)

Spec §13 success criterion #9 calls for Accessibility ≥100, Performance ≥95, SEO ≥100, Best Practices ≥100 on a Lighthouse mobile run. Verify on the live URL once cutover is done.

### 17. i18n / Chinese version

Out of scope. Tony's resume has a Chinese version; if a `/zh/` route is ever wanted, Astro's i18n routing can do it without a third-party lib. The BusinessCard already shows 杨童耘 next to "Tony Yang" so there's a hook.

### 18. View-through to citations / paper-detail pages

Future upgrade: render `/papers/[slug]/` detail pages from the same MDX, including bibtex, related work links, and a more spacious abstract.

### 19. Studio sidenote panel: less "Esc · close" prompt clutter

The chrome bar at the top of `/world/` has three pieces (breadcrumb, hint, Esc button). On narrow viewports it stacks. Could simplify to a single floating Esc affordance.

### 20. Replace remaining `<!-- — -->` HTML comments with hyphens

Pure cosmetic — Tony asked for no em-dashes anywhere, which has been done in user-visible content. HTML/SVG comments still have stray em-dashes (cosmetic only). Optional sweep.

## How to use this file

When you (or a future Claude) want to iterate, pick a single bullet from this list, branch off `master` (post-cutover) or `redesign` (pre-cutover), work on it, open a small PR. Keep changes scoped to one item per PR so the brand stays coherent.

The current iter 2-3 work is uncommitted — the next session should either commit it as one polish commit or split it into logical chunks (rename, hero, themes, business card, content scrub) before opening new branches off it.
