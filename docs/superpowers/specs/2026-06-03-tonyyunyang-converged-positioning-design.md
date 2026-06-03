# Converged positioning redesign: "broad foundation, converged conviction"

- **Date:** 2026-06-03
- **Status:** Approved (design); ready for implementation plan
- **Branch:** `converged-positioning`
- **Supersedes:** the "A research compass" (8-card) concept in
  `docs/superpowers/specs/2026-05-01-tonyyunyang-redesign-design.md`. The rest
  of that spec (Atelier × Cinema language, tokens, Studio, section system)
  still holds.

## 1. Context and problem

The site currently reads as "interested in too many things / generic." Tony's
work genuinely spans a wide spectrum of AI, but the page presents that breadth
as an unprioritized menu, which undersells him. The three loudest offenders:

1. **Hero specialty line** is a flat list of five fields
   (`World models · LLMs · vision · medical AI · on-device AI`). A list of five
   reads as scattered. It is also coupled to the §06 business-card tagline
   (both render `businessCard.tagline`).
2. **"A research compass"** section with **eight** theme cards plus a vague
   `beyond text × access in practice` band. Eight directions is the single
   loudest "unfocused" signal on the page.
3. **§00 opening** gestures at convergence only vaguely
   ("go deeper, with passion and faith").

What Tony actually wants to communicate, in his own words:

> "My previous experience spans a wide spectrum of AI, from LLM routing to
> medical imaging. My interests have converged in two fields: (1) where data is
> sensitive and public data is scarce, and (2) applied systems in products that
> exploit the full power of frontier models. I believe they pave the next
> paradigm of AI."

And the values behind the convergence (from a cover letter): he left a PhD (a
Marie-Skłodowska-Curie Fellowship) on purpose to get closer to real AI
products, infrastructure, and systems, where research becomes practical impact;
he wants to build AI that is capable, efficient, reliable, and useful.

## 2. Goals and non-goals

**Goals**
- Make the convergence on **exactly two** value-driven directions the
  structural centerpiece of the page.
- Keep the wide-spectrum breadth visible and reframed as **earned foundation**
  (a strength), never hidden.
- State the **conviction** ("these pave the next paradigm of AI") once, loudly.
- Preserve everything Tony already likes: the warm print-plate theme, the seven
  color tokens, the fonts, the hero charm, and the Studio.

**Non-goals**
- No visual-language change (no new colors, no new fonts, no framework).
- No reordering of §01-§06 beyond what is described here.
- No changes to the Studio (`/world/`), the command palette, search, or the
  visit tracker.
- No per-card "direction" tagging of papers/projects in v1 (the copy primes
  which direction each belongs to; explicit tagging is a possible later pass).

## 3. The narrative spine

A top-to-bottom arc the visitor feels: **a person who walked widely, then chose
deliberately, and now believes hard.**

```
Hero        warmth + a converging tease ("two places, and I know exactly why")
   ↓
§00         "A letter from the desk": breadth → the decision → the two bets
   ↓
Diptych     conviction argued by GEOMETRY: two equal panels on one breadth plinth
   ↓
§01–§02     the papers and projects become the receipts behind the two bets
```

The chosen concept is the **Hybrid: Diptych on a Plinth + Letter warmth** (the
two highest-scoring concepts from the exploration, grafted). The diptych makes
the focus legible before a word is read; the letter supplies the human,
un-fakeable differentiator (leaving the fellowship on purpose).

## 4. Section-by-section design (with final copy)

All copy below is final and ship-ready. Hard rule: **no em-dashes** anywhere
(use periods, commas, parentheses, the middle dot `·`, or the arrow `→`).
"Studio", never "Atelier".

### 4.1 Hero (one change only)

Keep verbatim: name, role line, the emerald "Open to research" pill (the
primary CTA, 44px tap target, links to `#contact`), the `PLATE I · TWILIGHT`
sketch and its Studio portal, and the Wittgenstein quote (the sanctioned
italic-display flourish).

**Change:** decouple `.hero__specialty` from `businessCard.tagline` by adding a
new `heroSpecialtyLine` key, and replace the five-field list with a converging
tease (same upright EB Garamond, same slot, same 56ch max-width):

> Years across AI, from LLM routing to medical imaging. Now I build in two
> places, and I know exactly why.

(Decided: tease, not the explicit-names variant. The tease pulls the eye toward
§00 and the diptych where the two bets are named.)

### 4.2 §00 retitled "A letter from the desk"

Same `Intro.astro`: portrait, Day-to-day block, and contact strip all stay. The
`SectionHeader` title changes from `Currently` to `A letter from the desk`. Note
the title is hardcoded inside `Intro.astro` (`<SectionHeader num="00"
title="Currently" ... />`, line ~18), so the edit is there, not at the
`<Intro />` usage in `index.astro`. The opening becomes a short, plain,
three-beat letter. No "Dear reader" salutation (the section title signals the
form).

> **openingHeadline:** I spent years moving across AI, from LLM routing to
> medical imaging. Then I left a fellowship on purpose, because I finally knew
> what I wanted to build.
>
> **openingBody:** The breadth was not indecision, it was reconnaissance. It
> showed me where the work that matters actually lives, and where I can do it
> best. So I converged on two: building where data is sensitive and scarce, and
> turning frontier models into systems people can actually use.

The Day-to-day block (`currently`) stays as the factual footer of the letter
(keeps the institution/collaboration detail, so §00 carries the seven-name
roster as proof of range). Optional light touch: a single hand-drawn signature
flourish (reusing the `hero__flourish` SVG vocabulary) closing the letter
before the Day-to-day block, signalling "signed" without literal handwriting.
This is optional and may be dropped during the critique pass if it adds noise.

### 4.3 The Diptych on a Plinth (new section, replaces the compass)

A new section component, `Diptych.astro`, replaces `<ResearchThemes />` at
`index.astro`. It lives in the same slot the compass held (between §00 and §01),
and reuses the existing section-header furniture (rule + centered italic heading
+ rule). Heading: **Two directions.** It is built as one bordered plate, NOT a
two-up reuse of the old four-column grid (which would read "depleted").

**Thesis band** (full-width, top of the plate, paper-shade fill). This is the
ONE place the grand belief is stated; numbers carry the rest of the section:

> Two bets, one belief: build where data is sensitive and scarce, and turn
> frontier models into products people can actually use. I believe these two
> pave the next paradigm of AI.

**Two equal 50/50 panels**, separated by a 1px hairline gutter. Each panel:
mono kicker (`DIRECTION I` / `DIRECTION II`), italic-display title, upright
Inter blurb, and the proofs woven into the prose.

- **DIRECTION I · When the data doesn't exist, I build it**
  > The work that matters most often happens where public data barely reaches
  > and a mistake is costly: the clinic, the headset, the device, the closed
  > enterprise. I build models that work there. Reverse Imaging segments
  > cardiac MRI it has never seen. Pruning nnU-Net removes over 80% of a medical
  > network with quality intact. Through the Eyes of Emotion is the first public
  > VR eye-tracking dataset, built because none existed.

- **DIRECTION II · Frontier capability, made cheap enough to ship**
  > Frontier models are astonishing, and almost no one can afford to run them
  > well. I turn raw capability into systems that route, adapt, and run at a
  > fraction of the cost without losing quality. MERA holds 87.3% router
  > accuracy at 51.8% of always-large-model cost. TwinRouterBench matches
  > unrouted Opus 4.6 on SWE-bench Verified for 53% less. The LLM Router cut
  > cost by over 90% at the same quality.

**The plinth** (full-width row beneath both panels, paper-shade, with a
stronger-weight top hairline "seating-line" and a 1px inset hairline shadow so
the panels visibly rest ON it like load-bearing stone). It holds:

- the breadth line:
  > On the ground beneath both: a wide spectrum of AI, from LLM routing to
  > medical imaging, across Tencent, Gradient Networks, MeetaVista, TU Delft,
  > McGill, Tsinghua, and IMDEA. The range is what earned the convergence.
- a compact mono "ledger" colophon (small, plate-colophon register), so range
  reads as proof rather than a roster:
  > `SERVING COST 51.8% · MATCHES OPUS 4.6 AT 53% LESS · >80% OF A MEDICAL NET PRUNED · CHROME EXTENSION LIVE`
- a hand-drawn "strata" engraving: 4-5 stacked horizontal lines at hairline
  weight that thin and fade downward (repurposed from the retired
  `themes__threads` sine-wave motif), reading as accumulated bedrock layers.

### 4.4 Two small echoes so the close matches the open

- **§01 Research dek** (`researchDek`) re-points so the paper cards read as the
  receipts behind the two directions:
  > The receipts behind the two directions. Every paper here is one of those
  > bets made concrete.
- **§06 business-card tagline** (`businessCard.tagline`) swaps the five-field
  list for the two-direction phrasing (and removes the stray U+2011 soft-hyphen
  artifact in `on‑device`). Now a distinct key from `heroSpecialtyLine`:
  > Sensitive, scarce-data AI · frontier models made shippable
- `contactInvitation` stays as-is (its warmth fits the letter voice).

## 5. Visual / layout spec for the Diptych

The plate reuses the existing seam recipe from `ResearchThemes.astro`:
`display:grid` on a container with `background: var(--color-hairline)`,
`gap: 1px`, `overflow: hidden`, `border-radius: 12px`, and a `1px` hairline
border, so the 1px hairline background shows through the gaps as crisp dividers.

Desktop structure (one plate):

```
┌───────────────────────────────────────────────┐
│  THESIS BAND  (full width, paper-shade)         │
├──────────────────────┬──────────────────────────┤
│  DIRECTION I          │  DIRECTION II            │  ← two 50/50 panels
│  (paper-shade)        │  (paper-shade)           │     1px hairline gutter
├──────────────────────┴──────────────────────────┤
│  PLINTH  (full width, paper-shade,               │
│  stronger top hairline + inset shadow,           │
│  breadth line + mono ledger + strata engraving)  │
└───────────────────────────────────────────────┘
```

- Tokens only: panels and bands on `--color-paper-shade`; dividers/borders on
  `--color-hairline`; titles/ink on `--color-ink`; blurbs/captions on
  `--color-ink-soft`; emerald `--color-accent` for the kicker tick / accent
  dots only. The "seating-line" is a heavier-weight use of `--color-hairline`
  (e.g. a 2px hairline-colored top border plus an `inset` box-shadow in a
  low-alpha ink), NOT a new color.
- Type: kickers in JetBrains Mono uppercase with letter-spacing; titles in EB
  Garamond italic (matches the existing `themes__card-title`); blurbs in Inter
  16px/1.6; ledger in JetBrains Mono ~11px. Body blurbs are never italic.
- Motion budget unchanged (hover 180ms, default 240ms); honor
  `prefers-reduced-motion`.

**Responsive.** The two panels stay side by side from desktop down through the
tablet range, and stack vertically at the existing phone cutover
(`max-width: 560px`, matching `ResearchThemes`). When stacked, the
plinth stays a full-width band beneath both, joined to the panels by a single
vertical hairline connector so the "panels stand on the plinth" relationship
survives the stack. Direction I is capped to its three most distinctive proofs
(first public dataset, zero-shot cardiac MRI, >80% pruned) so the two panels
feel equally weighty even though Direction II has more shipped artifacts.

## 6. Data model changes (`src/content/site.json`)

**Add:**
- `heroSpecialtyLine` (string) — the hero tease (§4.1).
- A `diptych` block, e.g.:
  ```jsonc
  "diptych": {
    "heading": "Two directions",
    "thesis": "Two bets, one belief: ...",
    "directions": [
      { "kicker": "Direction I",  "title": "When the data doesn't exist, I build it", "blurb": "..." },
      { "kicker": "Direction II", "title": "Frontier capability, made cheap enough to ship", "blurb": "..." }
    ],
    "breadthLine": "On the ground beneath both: ...",
    "ledger": [
      "Serving cost 51.8%",
      "Matches Opus 4.6 at 53% less",
      ">80% of a medical net pruned",
      "Chrome extension live"
    ]
  }
  ```
  (Ledger entries stored in natural case; the component uppercases via CSS
  `text-transform`, matching how other mono captions are handled.)

**Change:**
- `openingHeadline`, `openingBody` (§4.2 letter copy).
- `researchDek` (§4.4).
- `businessCard.tagline` (§4.4; also drop the U+2011 artifact).

**Remove (now unused):**
- `researchThemes` (the eight-card array) and `researchThemesIntro`.
- Leave `currently`, `intro`, `projectsIntro`, `contactInvitation`, `tagline`
  (hero quote), `datelineLines`, etc. untouched.

If `src/content/config.ts` has a Zod schema for `site.json`, update it to add
`heroSpecialtyLine` + `diptych` and drop `researchThemes`/`researchThemesIntro`
so `astro check` stays green.

## 7. Component changes

- **New:** `src/components/Diptych.astro` (thesis band + two panels + plinth +
  strata SVG). Reads `siteConfig.diptych`.
- **Retire:** `src/components/ResearchThemes.astro` (fully superseded). Remove
  its import/usage from `index.astro`; delete the file. The `themes__threads`
  sine-wave SVG is the donor motif for the plinth strata, so lift it before
  deleting.
- **`Hero.astro`:** point `.hero__specialty` at `siteConfig.heroSpecialtyLine`
  instead of `card.tagline` (line ~54). No style change.
- **`Intro.astro`:** change the hardcoded §00 `SectionHeader` title (line ~18)
  from `Currently` to `A letter from the desk`. Add the optional signature
  flourish here if kept after critique.
- **`index.astro`:** swap `import ResearchThemes` → `import Diptych` and
  `<ResearchThemes />` → `<Diptych />` (line ~48). The running-head section list
  is unchanged (the diptych, like the compass, is not a numbered folio).
- **`Icon.astro`:** no new icon strictly required; the strata is inline SVG in
  `Diptych.astro`. The retired theme icons (`world-model`, `tokens`, `eye`,
  `heartbeat`, `chip`, `market-trend`, `interface`, `open-door`) may remain in
  the library if used elsewhere; do not delete blindly (grep first).

## 8. Constraints honored

- Seven tokens only; no eighth color. The "seating-line" and inset shadow are
  heavier/low-alpha uses of existing tokens.
- EB Garamond italic only where sanctioned (titles, hero quote, section labels);
  body blurbs upright Inter.
- No em-dashes in any copy above (verify with the project grep before commit).
- "Studio" preserved; no "Atelier" in user-visible strings.
- No React/Vue/Svelte; no JS island required for the diptych (static markup +
  CSS + inline SVG).
- Honest to the evidence: every number and claim traces to a real paper/project
  (MERA, TwinRouterBench, LLM Router, Reverse Imaging, Pruning nnU-Net, Through
  the Eyes of Emotion, ScholarHighlights).

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Diptych panels feel unequal (II has more numbers) | Cap Direction I to its 3 most distinctive proofs; let range, not count, balance it. |
| "Panels rest on stone" reads as a generic stacked card | Stronger seating-line + inset shadow; confirm via render-and-critique pass. |
| Letter copy tips "too literary" (a prior failure mode) | Keep copy plain; let the numbers carry confidence; dial back warm lines if flagged. |
| Mobile stack loses the "standing on" relationship | Vertical hairline connector keeps panels visually seated on the plinth when stacked. |
| Dead `site.json` keys / Zod drift | Remove `researchThemes*`; update `config.ts`; keep `astro check` green. |

## 10. Verification plan

1. `npm run build` and `npm run check` pass (Zod + types green).
2. Em-dash hunt is clean:
   `grep -rn "—" src/content src/components src/pages | grep -v "<!--"`.
3. Refresh visual shots via the helper specs
   (`_homepage-preview.spec.ts`) and run one or more codex-rescue critique
   rounds on the new diptych (the documented polish loop), focused on: does the
   plinth read as load-bearing? do the two panels read as equally weighty? does
   the section kill the "too wide" signal at a glance?
4. Manual responsive check at desktop / tablet / phone breakpoints, including
   the mobile stack + plinth connector.
5. Accessibility: section landmarks/headings intact; decorative SVG
   `aria-hidden`; reduced-motion honored.

## 11. Decided micro-choices

- Hero line: **tease** variant (not explicit-names).
- Direction titles: **as written** in §4.3.
- Signature flourish in §00: **include as an optional light touch**, subject to
  removal in the critique pass.
- `contactInvitation`: **keep** unchanged.
