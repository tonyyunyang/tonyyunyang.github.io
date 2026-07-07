# raunofreiberg.com — landing page replica

A dependency-free replica of the landing page of [raunofreiberg.com](https://raunofreiberg.com)
(Rauno Freiberg, interaction designer at Vercel), rebuilt in vanilla HTML/CSS/JS
for local study and play.

## Why a replica?

The GitHub repo `raunofreiberg/raunofreiberg.github.io` is **not** the source of
the current site — it's Rauno's ~2017 gulp/SCSS portfolio ("Front-End Developer",
Lato/Playfair fonts), and its `Delete CNAME` commit shows the domain being detached
from GitHub Pages. The current site is a closed-source Next.js app (canonical
`rauno.me`). This replica was built by analyzing the live site's served HTML, CSS,
and de-minified JS bundles, so the constants below are the site's *actual* values,
not eyeballed approximations.

## Run it

```sh
python3 -m http.server 4173
# open http://localhost:4173
```

Any static server works. No build step, no dependencies.

## Things to play with

- **Scroll** (vertical or horizontal — first axis wins): the row of "artboards"
  pans horizontally while zooming out to 60%; scroll back to the top and it
  springs back to fit.
- **Click the + crosshair** in the center: toggles the wireframe/debug mode
  (an easter egg from the real site).
- **Tab**: keyboard focus spring-scrolls each frame into center.
- **Contact frame**: click "Email" — copies `yo@rauno.me` with a spring flip
  to "Copied".
- **Minimap** (top center): 20 ticks, an outlined tracker slides across as you
  scroll; ticks hide underneath it.
- Select text: yellow selection.

## Extracted spec (from the real bundle)

| Thing | Value |
| --- | --- |
| Frames | 8 sheets of 1200×720, stride 1240px (total 9880px) |
| Fit scale | `clamp(min(vw/1300, vh/1020), 0.2, 1)` |
| Max scroll | `(9880 − 1200) × min(fitScale, 0.6)` |
| Container | `translateX(−scroll) scale(spring(500, 50))`; target decays by `scroll × 1e-4` per scroll event toward 0.6 |
| Entrance | main sheet `scale 0→1` spring(320, 60, m 0.2); circle spring(600, 80, m 0.2, delay .4); text lines `y 100→0` spring(240, 32, m 0.1, delay .2 + i×.1); other frames CSS fade at .8s |
| Slide parallax | spring(500, 40), starts past `(1240/3)×i`, clamped to max: DD 527, Craft 330, Projects 1373 |
| Labels | counter-scaled `scale(1/s)`, `top: −28/s px` so they stay 14px on screen |
| Minimap | tracker spring(620, 45, m 0.2), travel 0–160px; tick i hides when `0 ≤ x + 32 − 10i < 34` |
| Focus scroll | spring(600, 80) to `744 × index` |
| Email flip | spring(280, 32), ±90px |
| Theme | forced light: bg `hsl(0 0% 93%)` (#EDEDED), text `hsl(0 0% 9%)`, `--yellow #FFFF02`, `--orange #FF6100` (P3), selection yellow |

## Verification

Measured with puppeteer against the live site at 1440×900 — all values identical:
sheet rect (190.6, 132.4, 1058.8×635.3), implied scale 0.8824, scroll area
6648×6108, mid-scroll transform `matrix(0.6, 0, 0, 0.6, −2500, 0)`, spring-back
to 0.8824 at top. Side-by-side screenshots at scroll 744 and 2500 are
pixel-equivalent.

## Identity

The deployed site presents Tony Yang everywhere a visitor looks: titles,
meta/og tags, a pixel-Mac `favicon.svg` on every page, and contact links
(X `@satoshiotabvbu`, GitHub `tonyyunyang`, email copy
`tonyyunyang@outlook.com`). Craft and Field Notes open the coming-soon
page; the "2025" corner opens `/2025/` — the previous Astro site, built
from its last pre-redesign commit and archived under that path (root
references rewritten to `/2025/…`); the CV corner and the hidden card's CV link open
`Tongyun-Yang-CV.pdf` in a new tab (the browser's viewer, so visitors can
read before they save). Rauno Freiberg and Henry Heffernan remain only as
deliberate attribution (code comments, the Macintosh Credits app, LICENSE).
And — some races are won by going backwards; there is a frame before the
beginning, where three keys — copper, jade, crystal — spin in the air
as clouds of fine particle dust beside the kicker; drift toward one and
a hand rises, closes around its stem, and holds it still, facing you. Every page also carries a 1px
MapMyVisitors beacon — visit tracking with no widget rendered; stats at
mapmyvisitors.com/web/1c555.

## Personalization

The content has been personalized while keeping every link, layout, and spring
untouched: intro reads "Tony Yang is an AI Researcher & Engineer working from
Infra to Applications"; the DD frame shows "AGI" (slide max re-measured to 689 to
keep the reveal flush); Field Notes says "Tony's Field Notes" — reusing the
original handwriting stroke paths for "Field Notes"/o/n/'/s with hand-drawn T
and y to match; contact corners read "CV" (top-right, the PDF in a new tab)
and "2025" (bottom-left, the archived previous site); the mantra sheet sets a Wittgenstein paraphrase as a diagonal
call-and-response — the question in Georgia italic top-left, the answer in
PP Neue Montreal bottom-right, with a 14px "after Wittgenstein, Tractatus 5.6"
caption anchoring the bottom-left corner. Behind the words, the Nähr
photograph of Wittgenstein is halftoned into ~4,000 near-transparent ink
particles (`media/witt.png` carries the sampled ink map, regenerable with
`media/make-witt.py`; the engine lives in `main.js`): they assemble into the
portrait when the sheet first scrolls into view, scatter around the cursor
and spring back, and the whole head leans a few pixels after the pointer.
Dots dim under the question's lines and dissolve before the answer's, so the
words always win. Every subpage (`ai.html`, `projects.html`, `soon.html`)
carries a "← Home" corner link; paper pages keep Home in their dock.

## AI Research section

The landing page's "AI" frame now opens `ai.html` — a /craft-style gallery of
publications (seeded from Google Scholar, sorted newest-first by `date`) and a
held space for blog posts. Each card opens `paper.html?p=<slug>`: horizontal
sheets (Title → Authors → Venue → Introduction → Video → BibTeX) driven by
vertical scroll; the title stays pinned top-left once you scroll past it.
Text reveals as each sheet arrives (~1s): the exact scramble-decode algorithm
from rauno.me/projects for titles/venues, a diffusion blur-resolve for the
author list (`textfx.js`). The bottom dock is a port of the 2022.rauno.me
magnifying dock — cursor-distance interpolation [40→44→56.56→80]px with
springs, bottom-anchored buttons that swell out of a translucent blurred pill,
bouncy click — holding home · gallery · PDF · paper page · code · Scholar ·
copy BibTeX · theme toggle (only links that exist for that paper are shown).

- All content lives in `publications.js` — edit titles, links, abstracts,
  BibTeX there.
- Drop a video at `media/<slug>.mp4` and both the gallery card and the paper's
  media sheet pick it up automatically (until then a numbered accent tile
  holds the space).
- Subpages support light/dark (system default, dock toggle persists).

## My Macintosh, Projects, and the coming-soon page

- The landing's fourth frame is now **My Macintosh** — a pixel-art classic
  Macintosh in the same blue outline style as the pixel hand it replaced —
  and boots `/macintosh/`: a self-hosted adaptation of
  [Henry Heffernan's](https://henryheffernan.com) 3D portfolio (used with his
  permission — see below).
- The Projects frame opens `projects.html`, a local list in the style of
  rauno.me/projects (scramble-decoded rows, sweeping rules, years). Every
  entry opens the under-construction page; edit the `PROJECTS` array at the
  top of its inline script.
- `soon.html` is the under-construction page, personalized by `?t=<name>`,
  set in the landing's own vocabulary (popping sheet, staircase clip-reveal,
  yellow circle, Georgia-italic closing line).
- `media/PROMPTS.md` holds one Seedance prompt per publication, written to
  the official Subject→Action→Environment→Camera→Style→Constraints formula
  and matched to each card's accent color. Generated videos go to
  `media/<slug>.mp4`.

## My Macintosh (the 3D experience)

`/macintosh/` is Henry Heffernan's two-part portfolio —
[portfolio-website](https://github.com/henryjeff/portfolio-website) (the
three.js desk + CRT shell, MIT) and
[portfolio-inner-site](https://github.com/henryjeff/portfolio-inner-site)
(the Windows-95-style OS running inside the monitor) — adapted with Henry's
explicit permission ("Please go ahead and use anything you find useful!").
Everything he built is kept intact (boot BIOS, CRT shaders, Doom, Oregon
Trail, Scrabble, the wordle clone, all sound design); only the personal
details changed:

- BIOS/boot text, name overlay, page meta → Tongyun Yang; the baked monitor
  bezel & keyboard textures were repainted from "Heffernan henry inc" to
  "Yang tongyun inc"; Henordle → **Tonordle** (the word is always "TONYS").
- **My Showcase** is fully Tony's: Home/About/Experience from the CV,
  Projects split into Software / Research (the five publications, each
  linking back to `paper.html`) / Life (running, lifting, cooking).
- The Contact form posts straight to a Google Form (no server to run):
  submissions appear in the form's responses, mapped field-for-field
  (entry IDs live in `Contact.tsx`).
- The **Credits** app keeps every one of Henry's original slides and gains a
  leading "Original Work" slide crediting him and both repos.
- The monitor iframe points at the self-hosted `/macintosh/os/` — nothing
  loads from henryheffernan.com; his Google Analytics tag was removed.

Modified sources live in `macintosh-src/` (`shell/` + `os/`, upstream
commits recorded in `macintosh-src/NOTES.md`). To rebuild after editing:

```sh
cd macintosh-src/os    && npm install --legacy-peer-deps && npm run build && rsync -a --delete build/  ../../macintosh/os/
cd macintosh-src/shell && npm install --legacy-peer-deps && npm run build && rsync -a ../macintosh-src/shell/public/ ../../macintosh/   # shell output dir is shell/public
```

## Notes & caveats

- `fonts/dd.woff2` is **PP Neue Montreal Medium** (Pangram Pangram), fetched from
  the live site for personal, local fidelity only. Don't redistribute it or deploy
  this publicly — license the font (or swap the `@font-face` for a system font) first.
- All content (text, SVG artwork, design) is Rauno Freiberg's. This is a study
  replica for personal use.
- Internal links (Craft, Projects, Field Notes) point at the live site since only
  the landing page is replicated; DD/History/GitHub/etc. go to their real URLs.
- Touch devices get a simplified native horizontal scroll (the original's mobile
  branch is approximated).
