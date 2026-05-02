# tonyyunyang.github.io Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Jon-Barron-template-derived site at `tonyyunyang.github.io` with a custom Astro-built "Atelier × Cinema" personal site, including a blog system, a hidden atelier scene, and a `⌘K` command palette, deployed via GitHub Actions to GitHub Pages without disrupting the existing live URL.

**Architecture:** Astro 5 static site, content sourced from MDX files via Content Collections (Zod-validated). Bundle is near-zero JS by default; interactive layers (workbench SVG, command palette, atelier scene) are vanilla TypeScript "islands". Self-hosted free fonts via `@fontsource`. Deployed by a GitHub Action artifact to GitHub Pages, replacing the current "deploy from branch" config.

**Tech Stack:** Astro 5, TypeScript, Tailwind v4, MDX, Pagefind, Shiki, rehype-katex, `@fontsource`, Vitest (utility tests), Playwright (smoke + interaction tests), GitHub Actions, Bun (or npm) as package manager.

**Reference:** `docs/superpowers/specs/2026-05-01-tonyyunyang-redesign-design.md`

---

## How to read this plan

Phases are sequential — do not start Phase N+1 until Phase N's "Phase exit gate" task passes. Inside a phase, tasks are also generally sequential.

For testing, this plan is **pragmatic-TDD**: utility functions get test-first; presentational components get smoke-tested via Playwright after they're wired up; pure styling is verified visually. Where a step says "write the failing test first," follow it strictly.

Branch strategy: all work happens on a `redesign` branch. The cutover task at the end of Phase 4 merges `redesign` → `master` and is the only moment the live site changes.

---

## File structure (locked in)

```
tonyyunyang.github.io/
├── .github/workflows/deploy.yml
├── .gitignore
├── README.md                                  (rewritten)
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── public/
│   ├── cv.pdf
│   ├── favicon/                               (existing, copied)
│   ├── og-default.png
│   ├── papers/                                (paper thumbnails)
│   └── profile/Profile.jpg
├── src/
│   ├── content/
│   │   ├── config.ts                          (Zod schemas)
│   │   ├── site.json                          (hero, intro, contact)
│   │   ├── papers/                            (3 .mdx files)
│   │   ├── projects/                          (5 .mdx files)
│   │   ├── posts/                             (empty for now)
│   │   ├── news.mdx
│   │   ├── teaching.mdx
│   │   └── atelier.json
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Intro.astro
│   │   ├── Workbench.astro
│   │   ├── PaperCard.astro
│   │   ├── ProjectCard.astro
│   │   ├── PostCard.astro
│   │   ├── Sidenote.astro
│   │   ├── SectionHeader.astro
│   │   ├── Folio.astro
│   │   ├── PillLink.astro
│   │   ├── Toc.astro
│   │   ├── CommandPalette.astro
│   │   ├── SketchbookButton.astro
│   │   └── AtelierScene.astro
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Post.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── writing/{index.astro, [...slug].astro}
│   │   ├── world.astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   ├── scripts/
│   │   ├── command-palette.ts
│   │   ├── workbench.ts
│   │   ├── atelier-scene.ts
│   │   └── motion.ts
│   ├── styles/
│   │   ├── globals.css                        (tokens, typography, paper grain)
│   │   └── katex.css
│   └── lib/
│       ├── workbench-graph.ts
│       └── content-utils.ts
├── tests/
│   ├── unit/
│   │   ├── workbench-graph.test.ts
│   │   └── content-utils.test.ts
│   └── e2e/
│       ├── homepage.spec.ts
│       ├── command-palette.spec.ts
│       ├── atelier-scene.spec.ts
│       └── blog.spec.ts
├── legacy/                                    (old site files, moved at cutover)
└── docs/superpowers/{specs,plans}/
```

---

## Phase 1 — Foundation & Pipeline

**Goal:** Astro project scaffolded, design tokens loaded, GitHub Actions deploying a placeholder page to a `redesign` branch's preview deployment, all on a non-master branch so the live site stays untouched.

**Phase exit gate:** Pushing `redesign` triggers a green Action that uploads a Pages artifact, the placeholder page builds and serves locally via `npm run dev`, and the smoke test for the placeholder page passes.

### Task 1.1: Create the redesign branch

**Files:** none (git only)

- [ ] **Step 1: Create and switch to redesign branch**

```bash
git checkout -b redesign
```

- [ ] **Step 2: Verify**

```bash
git branch --show-current
```

Expected output: `redesign`

- [ ] **Step 3: Push the branch (no upstream commits yet)**

This is deferred until the first real commit lands on this branch (Task 1.4).

### Task 1.2: Add `.gitignore` for Node + Astro

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create `.gitignore`**

```
# Dependencies
node_modules/
.pnpm-store/

# Build output
dist/
.astro/
.cache/

# Test artifacts
coverage/
playwright-report/
test-results/

# Pagefind output (generated in CI)
public/pagefind/

# OS / editor
.DS_Store
.vscode/
.idea/
*.log
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: add .gitignore for Node + Astro toolchain"
```

### Task 1.3: Initialize package.json and TypeScript config

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "tonyyunyang.github.io",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check && tsc --noEmit",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test": "npm run test:unit && npm run test:e2e"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/rss": "^4.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "@fontsource/inter": "^5.1.0",
    "@fontsource/jetbrains-mono": "^5.1.0",
    "pp-editorial-new": "npm:@fontsource/eb-garamond@^5.1.0",
    "rehype-katex": "^7.0.1",
    "remark-math": "^6.0.0",
    "katex": "^0.16.11",
    "astro-icon": "^1.1.5",
    "@iconify-json/lucide": "^1.2.0",
    "pagefind": "^1.1.1"
  },
  "devDependencies": {
    "vitest": "^2.1.0",
    "@playwright/test": "^1.48.0",
    "@types/node": "^22.0.0"
  }
}
```

> **Note on PP Editorial New.** It's not free. The `@fontsource` registry has no exact match for it. We use **EB Garamond** (free, similarly elegant editorial italic) as the actual loaded font, exposed under the CSS family name `Editorial`. The visual reference in the spec stands; only the underlying font file changes. If a free PP-Editorial-style alternative becomes available later, swap `@fontsource/eb-garamond` for it without touching component code.

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*", "tests/**/*", "*.config.*"],
  "exclude": ["dist", "node_modules", ".astro", "legacy"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    },
    "verbatimModuleSyntax": true
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` populated, no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tsconfig.json
git commit -m "chore: add package.json, tsconfig.json with Astro 5 toolchain"
```

### Task 1.4: Configure Astro and Tailwind

**Files:**
- Create: `astro.config.mjs`
- Create: `src/styles/globals.css`

- [ ] **Step 1: Create `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  site: "https://tonyyunyang.github.io",
  base: "/",
  trailingSlash: "ignore",
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: "directory",
    inlineStylesheets: "auto",
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "viewport",
  },
});
```

- [ ] **Step 2: Create `src/styles/globals.css` with the design tokens**

```css
@import "tailwindcss";

@import "@fontsource/eb-garamond/400-italic.css";
@import "@fontsource/eb-garamond/500-italic.css";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/400-italic.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";

@theme {
  --color-paper: #f5efe2;
  --color-paper-shade: #ede6d5;
  --color-ink: #0f1417;
  --color-ink-soft: #4a5159;
  --color-accent: #0e5347;
  --color-hairline: #d9d2c2;
  --color-featured: #faf1d8;

  --font-display: "EB Garamond", "PP Editorial New", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --content-max: 880px;
  --content-with-rail: 1080px;
}

:root {
  color-scheme: light;
  background-color: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.65;
}

@layer base {
  body {
    margin: 0;
    background-color: var(--color-paper);
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.06 0 0 0 0 0.08 0 0 0 0 0.09 0 0 0 0.04 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
    background-attachment: fixed;
    background-size: 160px 160px;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: -0.005em;
    color: var(--color-ink);
  }

  a {
    color: var(--color-accent);
    text-decoration: none;
    transition: color 180ms ease-out;
  }

  a:hover {
    color: var(--color-ink);
  }

  ::selection {
    background-color: var(--color-accent);
    color: var(--color-paper);
  }

  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

@layer utilities {
  .font-mono-meta {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .max-content {
    max-width: var(--content-max);
    margin-inline: auto;
    padding-inline: 24px;
  }

  .max-content-rail {
    max-width: var(--content-with-rail);
    margin-inline: auto;
    padding-inline: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs src/styles/globals.css
git commit -m "chore: configure Astro and Tailwind v4 with design tokens"
```

### Task 1.5: Create the Base layout and a placeholder homepage

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Create `src/layouts/Base.astro`**

```astro
---
import "~/styles/globals.css";

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = "Tony Yang",
  description = "Independent AI researcher in Amsterdam. Building AI systems that expand what people can perceive, understand, and do.",
  ogImage = "/og-default.png",
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
    <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
    <link rel="canonical" href={canonicalURL} />

    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="author" content="Tony Yang" />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(ogImage, Astro.site)} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />

    <link rel="alternate" type="application/rss+xml" title="Tony Yang — Writing" href="/rss.xml" />
  </head>
  <body>
    <a class="sr-only focus:not-sr-only" href="#main">Skip to content</a>
    <main id="main">
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 2: Create `src/pages/index.astro` (placeholder for now)**

```astro
---
import Base from "~/layouts/Base.astro";
---

<Base title="Tony Yang">
  <section class="max-content py-24">
    <p class="font-mono-meta">tonyyunyang.github.io · in atelier mode</p>
    <h1 class="text-5xl mt-6">Hello, Atelier.</h1>
    <p class="mt-6 max-w-prose text-lg leading-relaxed">
      The site is being rebuilt. Stay a while.
    </p>
  </section>
</Base>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Expected: server starts on `http://localhost:4321`. Open the URL and confirm:
- Cream background (`#F5EFE2`)
- Headline in italic display serif
- Mono caption above
- No console errors

Stop the server with Ctrl+C.

- [ ] **Step 4: Run typecheck**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro src/pages/index.astro
git commit -m "feat: add Base layout and placeholder homepage"
```

### Task 1.6: Copy assets into public/

**Files:**
- Create: `public/cv.pdf` (copy)
- Create: `public/favicon/*` (copy)
- Create: `public/profile/Profile.jpg` (copy)
- Create: `public/papers/{through-eyes,reverse,prune-nnunet}.png` (copy)
- Create: `public/projects/scholarhighlights.png` (copy)

- [ ] **Step 1: Copy assets**

```bash
mkdir -p public/favicon public/profile public/papers public/projects
cp data/tony-cv.pdf public/cv.pdf
cp images/favicon/* public/favicon/
cp images/profile/Profile.jpg public/profile/Profile.jpg
cp images/Ubicomp/2025/through_eyes.png public/papers/through-eyes.png
cp images/MICCAI/2025/reverse.png public/papers/reverse.png
cp images/MIDL/2025/prune_nnunet.png public/papers/prune-nnunet.png
cp images/projects/scholarhighlights/icon_big.png public/projects/scholarhighlights.png
```

- [ ] **Step 2: Verify files copied**

```bash
ls -la public/cv.pdf public/favicon/ public/profile/ public/papers/ public/projects/
```

Expected: all listed files present and non-zero size.

- [ ] **Step 3: Commit**

```bash
git add public/
git commit -m "feat: copy production assets into public/"
```

### Task 1.7: Write the homepage smoke test

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/homepage.spec.ts`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
```

- [ ] **Step 2: Install Playwright browsers**

```bash
npx playwright install chromium
```

- [ ] **Step 3: Write the failing smoke test**

`tests/e2e/homepage.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("homepage renders the placeholder", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Tony Yang");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Atelier");
  await expect(page.locator("body")).toHaveCSS("background-color", /245.+239.+226|rgb\(245,\s*239,\s*226\)/);
});

test("body uses Inter for body copy", async ({ page }) => {
  await page.goto("/");
  const fontFamily = await page.evaluate(() =>
    window.getComputedStyle(document.body).fontFamily
  );
  expect(fontFamily.toLowerCase()).toContain("inter");
});

test("respects prefers-reduced-motion", async ({ page, context }) => {
  await context.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Sanity: page still renders
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
```

- [ ] **Step 4: Run the test**

```bash
npm run test:e2e
```

Expected: all 3 tests PASS. (The dev server starts automatically via `webServer` config.)

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/e2e/homepage.spec.ts
git commit -m "test: add Playwright smoke tests for placeholder homepage"
```

### Task 1.8: Add Vitest config and a unit test placeholder

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/unit/sanity.test.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: { "~": new URL("./src", import.meta.url).pathname },
  },
});
```

- [ ] **Step 2: Create a sanity test**

`tests/unit/sanity.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("test runner sanity", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 3: Run unit tests**

```bash
npm run test:unit
```

Expected: 1 passing.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/unit/sanity.test.ts
git commit -m "test: add Vitest config and sanity test"
```

### Task 1.9: Add the GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create the workflow**

```yaml
name: Deploy site

on:
  push:
    branches: [master]
  pull_request:
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

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload Pages artifact
        if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

> **Why deploy is gated on `push`/`workflow_dispatch`.** PRs build (so you catch breaks early) but don't deploy. Only commits landing on `master` deploy. During Phase 1 we'll temporarily push the workflow to a branch *other* than `master` to test it; the deploy step won't run, but the build step will, which is what we want to validate.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow for Pages deployment"
```

### Task 1.10: Smoke-test the build locally

**Files:** none

- [ ] **Step 1: Run a full production build**

```bash
npm run build
```

Expected:
- `dist/` directory created
- `dist/index.html` exists and contains "Atelier" text
- No build errors
- Pagefind indexes the site (creates `dist/pagefind/`)

- [ ] **Step 2: Verify the build output**

```bash
test -f dist/index.html && grep -q "Atelier" dist/index.html && echo OK
test -d dist/pagefind && echo "pagefind OK"
```

Expected output: `OK` then `pagefind OK`.

- [ ] **Step 3: Preview the build**

```bash
npm run preview
```

Open `http://localhost:4321` and verify the page looks identical to `npm run dev`. Stop with Ctrl+C.

### Task 1.11: Phase 1 exit gate — push redesign branch and verify CI builds

**Files:** none (CI run only)

- [ ] **Step 1: Push redesign branch**

```bash
git push -u origin redesign
```

- [ ] **Step 2: Open PR redesign → master (build-only check)**

```bash
gh pr create --base master --head redesign --draft \
  --title "redesign: foundation phase (Astro scaffold + CI)" \
  --body "Draft PR to validate the build pipeline. Do NOT merge until Phase 4 cutover."
```

- [ ] **Step 3: Watch the workflow**

```bash
gh run watch
```

Expected: build job goes green. Deploy job is skipped (we're on a PR, not push to master).

- [ ] **Step 4: Confirm Phase 1 exit gate**

If the build is green, Phase 1 is done. The pipeline is proven; subsequent phases will continue to use it.

---

## Phase 2 — Homepage

**Goal:** Build the full homepage at `/` per spec §3 — hero, §00 currently, live workbench, §01 research, §02 projects, §03 writing (empty state), §04 news, §05 teaching, §06 contact — with content driven by Content Collections.

**Phase exit gate:** Pushing to redesign rebuilds, the homepage renders all 7 sections (Hero + §00–§06), the workbench SVG draws in on scroll, and a Playwright test verifies the section IDs and key text.

### Task 2.1: Define content collection schemas

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Write the schemas**

```ts
import { defineCollection, z } from "astro:content";

const TOPIC = z.enum([
  "world-models",
  "llms",
  "vision",
  "medical-ai",
  "wireless-sensing",
]);
export type Topic = z.infer<typeof TOPIC>;

const author = z.object({
  name: z.string(),
  url: z.string().url().optional(),
  isMe: z.boolean().optional(),
  equalContrib: z.boolean().optional(),
});

const papers = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    venue: z.string(),
    venueExtra: z.string().optional(),
    year: z.number().int(),
    date: z.string(),
    authors: z.array(author).min(1),
    topics: z.array(TOPIC).min(1),
    summary: z.string().min(20).max(200),
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

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    collaborator: z.string().optional(),
    period: z.string(),
    status: z.enum(["shipped", "in-progress"]),
    statusDetail: z.string().optional(),
    topics: z.array(TOPIC).min(1),
    summary: z.string().min(20).max(220),
    thumbnail: z.string(),
    links: z.object({
      site: z.string().url().optional(),
      github: z.string().url().optional(),
      store: z.string().url().optional(),
      paper: z.string().url().optional(),
    }).optional(),
    sortKey: z.number().default(0),
  }),
});

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.string(),
    dek: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { papers, projects, posts };
```

- [ ] **Step 2: Run typecheck**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: define content collection schemas (papers, projects, posts)"
```

### Task 2.2: Add paper content files

**Files:**
- Create: `src/content/papers/through-the-eyes.mdx`
- Create: `src/content/papers/reverse-imaging.mdx`
- Create: `src/content/papers/pruning-nnunet.mdx`

- [ ] **Step 1: Create `through-the-eyes.mdx`**

```mdx
---
title: "Through the Eyes of Emotion: A Multi-faceted Eye Tracking Dataset for Emotion Recognition in Virtual Reality"
venue: "IMWUT / Ubicomp"
year: 2025
date: "2025-07-01"
authors:
  - { name: "Tongyun Yang", isMe: true, equalContrib: true }
  - { name: "Bishwas Regmi", equalContrib: true }
  - { name: "Lingyu Du", url: "https://lingyudu.github.io/" }
  - { name: "Andreas Bulling", url: "https://www.collaborative-ai.org/people/bulling/" }
  - { name: "Xucong Zhang", url: "https://www.ccmitss.com/zhang" }
  - { name: "Guohao Lan", url: "https://guohao.netlify.app/" }
topics: ["vision"]
summary: "First large-scale public eye-tracking dataset for VR emotion recognition — high-frame-rate periocular video plus 240 Hz gaze, across seven discrete emotions."
featured: true
thumbnail: "/papers/through-eyes.png"
links:
  paper: "https://dl.acm.org/doi/abs/10.1145/3749545"
  code: "https://github.com/MultiRepEyeVR/Through-the-Eyes-of-Emotion"
  bibtex: "/papers/imwut25.bib"
---

The first large-scale public dataset for VR emotion recognition that combines high-frame-rate periocular video and high-frequency gaze data across seven emotions, enabling accurate multimodal recognition.
```

- [ ] **Step 2: Create `reverse-imaging.mdx`**

```mdx
---
title: "Reverse Imaging: Any-Sequence Generalization for Cardiac MRI Segmentation"
venue: "MICCAI"
venueExtra: "+ IEEE Transactions on Medical Imaging"
year: 2025
date: "2025-06-01"
authors:
  - { name: "Yidong Zhao" }
  - { name: "Yi Zhang", url: "https://yizhang025.github.io/" }
  - { name: "Tongyun Yang", isMe: true }
  - { name: "Maša Božić-Iven" }
  - { name: "Ayda Arami" }
  - { name: "Yuchi Han", url: "https://wexnermedical.osu.edu/find-a-doctor/yuchi-han-md-125529" }
  - { name: "Orlando Simonetti", url: "https://medicine.osu.edu/find-faculty/clinical/internal-medicine/orlando-simonetti-phd" }
  - { name: "Hui Xue", url: "https://www.microsoft.com/en-us/research/people/xueh/" }
  - { name: "Petter Kellman", url: "https://kellmanp.github.io/webpages/curricula_vitae.htm" }
  - { name: "Sebastian Weingärtner", url: "https://www.mars-lab.eu/" }
  - { name: "Qian Tao", url: "https://sites.google.com/view/qtao/" }
topics: ["medical-ai", "vision"]
summary: "A physics-driven framework that estimates tissue properties from annotated cardiac MRI via diffusion models, enabling zero-shot segmentation across unseen MRI sequences."
thumbnail: "/papers/reverse.png"
links:
  paper: "https://papers.miccai.org/miccai-2025/0780-Paper2605.html"
  code: "https://github.com/Ido-zh/cmr_reverse"
---

A physics-driven framework that estimates tissue properties (M0, T1, T2) from annotated cardiac MRI using diffusion models, enabling synthesis of diverse unseen sequences for zero-shot generalization across MRI contrasts.
```

- [ ] **Step 3: Create `pruning-nnunet.mdx`**

```mdx
---
title: "Pruning nnU-Net with Minimal Performance Loss"
venue: "MIDL"
year: 2025
date: "2025-05-01"
authors:
  - { name: "Tongyun Yang", isMe: true }
  - { name: "Yidong Zhao" }
  - { name: "Qian Tao", url: "https://sites.google.com/view/qtao/" }
topics: ["medical-ai"]
summary: "Trained nnU-Net models contain substantial weight redundancy — over 80% of weights can be removed by simple magnitude pruning while preserving segmentation quality."
thumbnail: "/papers/prune-nnunet.png"
links:
  paper: "https://openreview.net/forum?id=uTTOhthEDR#discussion"
  code: "https://github.com/prunennunet/Prune_nnUNet"
---

Demonstrated that nnU-Net can be structurally pruned to 99% sparsity with minimal performance degradation, leading to a 6× improvement in training efficiency and gain in inference speed across multiple medical segmentation tasks.
```

- [ ] **Step 4: Verify content collection loads**

Run typecheck:

```bash
npm run check
```

Expected: 0 errors. Astro will validate the frontmatter against the Zod schema at build time.

- [ ] **Step 5: Commit**

```bash
git add src/content/papers/
git commit -m "content: add 3 published papers (IMWUT, MICCAI, MIDL)"
```

### Task 2.3: Add project content files

**Files:**
- Create: `src/content/projects/scholarhighlights.mdx`
- Create: `src/content/projects/llm-router.mdx`
- Create: `src/content/projects/cost-adaptive-routing.mdx`
- Create: `src/content/projects/human-intent-world-model.mdx`
- Create: `src/content/projects/llm-for-optimization.mdx`

- [ ] **Step 1: Create the 5 project MDX files**

`src/content/projects/scholarhighlights.mdx`:

```mdx
---
title: "ScholarHighlights"
period: "2026"
status: "shipped"
topics: ["llms"]
summary: "A browser extension that surfaces venue-quality badges, author-role signals, and flexible ranking data directly on Google Scholar — the information you wish was there at a glance."
thumbnail: "/projects/scholarhighlights.png"
sortKey: 5
links:
  github: "https://github.com/tonyyunyang/Scholar-High-Lights"
  store: "https://chromewebstore.google.com/detail/jplgohkahhmhjaoigpoojdfjcfcabkgg"
---

A browser extension for Google Scholar that adds venue-quality badges, author-role signals, and configurable ranking data sources right into the browsing workflow.
```

`src/content/projects/llm-router.mdx`:

```mdx
---
title: "LLM Router"
collaborator: "Gradient Networks"
period: "Feb 2026 — present"
status: "in-progress"
statusDetail: "Open benchmark"
topics: ["llms"]
summary: "Built a benchmark for evaluating LLM routing strategies. Showed that routing can preserve same-quality performance while reducing cost by >90% versus calling a single SOTA model for every step."
thumbnail: "/projects/scholarhighlights.png"
sortKey: 4
links:
  github: "https://github.com/CommonstackAI/CommonRouterBench"
---

Collaborated with Gradient Networks to build a benchmark covering SWE-bench, BFCL and others. Tested whether easy steps in complex tasks can be assigned to lower-cost models without sacrificing accuracy.
```

`src/content/projects/cost-adaptive-routing.mdx`:

```mdx
---
title: "Cost-Adaptive LLM Routing with Specialist Models"
period: "Mar 2026 — present"
status: "in-progress"
statusDetail: "Target NeurIPS '25"
topics: ["llms"]
summary: "Building on the LLM Router benchmark — using stronger-model trajectories to fine-tune small specialists for repeated workflows. As usage accumulates, small models improve and the system's cost falls."
thumbnail: "/projects/scholarhighlights.png"
sortKey: 3
links: {}
---

Extending the LLM router benchmark by exploring how specialist models can further reduce inference cost. The central idea: as more usage data is collected, the small model improves, and the overall cost of the system decreases.
```

`src/content/projects/human-intent-world-model.mdx`:

```mdx
---
title: "Human Intent World Model"
collaborator: "MeetaVista"
period: "Mar 2026 — present"
status: "in-progress"
statusDetail: "Target top-tier AI venue"
topics: ["world-models", "vision", "llms"]
summary: "A vision-language world model that infers customer intent from visual cues and responds with sales-relevant reasoning, fine-tuned on a synthetic dataset distilled from classical sales literature."
thumbnail: "/projects/scholarhighlights.png"
sortKey: 2
links: {}
---

Collaborated with MeetaVista to improve customer experience in AI-powered sales. Built a synthetic dataset for modeling customer intent, with visual + behavioral cues, intent labels, and reasoning traces. Fine-tuned a vision-language model that performed well on real interaction tasks after deployment.
```

`src/content/projects/llm-for-optimization.mdx`:

```mdx
---
title: "LLM for Optimization"
collaborator: "Tencent"
period: "Apr 2026 — present"
status: "in-progress"
statusDetail: "Target top-tier AI venue"
topics: ["llms"]
summary: "A framework that uses an optimization harness — structured search, feedback, memory retrieval — to guide LLMs toward better solutions on optimization problems like TSP, rather than relying on direct generation alone."
thumbnail: "/projects/scholarhighlights.png"
sortKey: 1
links: {}
---

Collaborating with Tencent on an optimization harness for LLMs. The goal is to help models approach optimal answers more efficiently on combinatorial problems by combining structured search, feedback, and memory retrieval.
```

> **Note on placeholder thumbnails.** All five `thumbnail` fields point at `scholarhighlights.png` for now. Phase 2 Task 2.16 will generate dedicated SVG thumbnails for the four ongoing collaborations and update these paths.

- [ ] **Step 2: Verify content collection loads**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/content/projects/
git commit -m "content: add 5 project entries (ScholarHighlights + 4 collaborations)"
```

### Task 2.4: Add news, teaching, and site config files

**Files:**
- Create: `src/content/news.mdx`
- Create: `src/content/teaching.mdx`
- Create: `src/content/site.json`

- [ ] **Step 1: Create `src/content/news.mdx`**

```mdx
---
title: "News"
---

- **[2026/05]** Concluded my Marie Curie Fellowship at IMDEA Networks. Now seeking new opportunities.
- **[2026/03]** Submitted a paper on a diffusion-based training framework for large language models to ACL Rolling Review.
- **[2025/10]** Began Marie Curie Fellowship at IMDEA Networks (MSCA 6th Sense project).
- **[2025/07]** *Through the Eyes of Emotion* accepted to Ubicomp / IMWUT 2025.
- **[2025/06]** *Reverse Imaging* accepted to MICCAI 2025 + IEEE Transactions on Medical Imaging.
- **[2025/05]** *Pruning nnU-Net with Minimal Performance Loss* accepted to MIDL 2025.
```

- [ ] **Step 2: Create `src/content/teaching.mdx`**

```mdx
---
title: "Teaching"
---

- **2024/25 Q1** — [ET 4310 Supercomputing for Big Data](https://abs-tudelft.github.io/sbd/introduction/index.html) · TA · TU Delft
- **2023/24 Q3** — [CESE 4030 Embedded Systems Lab](https://cese.ewi.tudelft.nl/embedded-systems-lab/) · TA · TU Delft
- **2023/24 Q1** — [CESE 4000 Software Fundamentals](https://cese.ewi.tudelft.nl/software-fundamentals/) · TA · TU Delft
- **2023/24 Q1** — [CESE 4010 Advanced Computing Systems](https://sps.ewi.tudelft.nl/Education/coursedetail.php?mi=127) · TA · TU Delft
- **2023/24** — [CESE MSc Programme Student Mentor](https://www.tudelft.nl/studenten/faculteiten/tbm-studentenportal/onderwijs/bachelor/mentoraat) · TU Delft
```

- [ ] **Step 3: Create `src/content/site.json`**

```json
{
  "name": "Tony (Tongyun) Yang",
  "shortName": "Tony Yang",
  "initials": "TY",
  "tagline": [
    "The limits of language mean",
    "the limits of the world?",
    "Perhaps, yet we dwell in more",
    "than we can name."
  ],
  "dateline": "INDEPENDENT AI RESEARCHER · AMSTERDAM · 2026 →",
  "intro": "Tony (Tongyun) Yang. Independent AI researcher in Amsterdam. I build AI systems that expand what people can perceive, understand, and do — and that work outside the lab. I'm currently collaborating with industry (Tencent, Gradient Networks, MeetaVista) and academia (TU Delft, McGill, Tsinghua) on world models, LLMs, and AI for medicine. Earlier: Marie Curie Fellow at IMDEA Networks, AI research engineer at TU Delft Imaging Physics, MSc TU Delft.",
  "currently": "Researching cost-efficient LLMs and world models for human intent.",
  "contactInvitation": "I read everything. Reach out about research, collaboration, or just to say hi.",
  "contact": {
    "email": "tonyyunyang@outlook.com",
    "scholar": "https://scholar.google.com/citations?hl=en&user=rIFdBYAAAAAJ",
    "github": "https://github.com/tonyyunyang",
    "cv": "/cv.pdf"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/content/news.mdx src/content/teaching.mdx src/content/site.json
git commit -m "content: add news timeline, teaching list, site config"
```

### Task 2.5: Build the SectionHeader and Folio components

**Files:**
- Create: `src/components/SectionHeader.astro`
- Create: `src/components/Folio.astro`

- [ ] **Step 1: Create `src/components/SectionHeader.astro`**

```astro
---
interface Props {
  num: string;             // e.g. "01"
  title: string;           // "RESEARCH"
  dek?: string;
  id?: string;
}

const { num, title, dek, id } = Astro.props;
const slugId = id ?? title.toLowerCase().replace(/\s+/g, "-");
---

<header id={slugId} class="section-header">
  <p class="prefix">
    <span class="num">§{num}</span>
    <span class="bullet">·</span>
    <span class="label">{title}</span>
  </p>
  {dek && <p class="dek">{dek}</p>}
  <span class="underline" aria-hidden="true"></span>
</header>

<style>
  .section-header {
    margin-block: 96px 32px;
  }

  @media (min-width: 768px) {
    .section-header {
      margin-block: 144px 40px;
    }
  }

  .prefix {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin: 0;
  }

  .num,
  .bullet {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .label {
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(28px, 4vw, 44px);
    color: var(--color-ink);
    line-height: 1.05;
  }

  .dek {
    margin: 12px 0 0;
    font-family: var(--font-display);
    font-style: italic;
    font-size: 18px;
    color: var(--color-ink-soft);
    max-width: 50ch;
  }

  .underline {
    display: block;
    margin-top: 16px;
    width: 32px;
    height: 2px;
    background: var(--color-accent);
    border-radius: 2px;
  }
</style>
```

- [ ] **Step 2: Create `src/components/Folio.astro`**

```astro
---
interface Props {
  current: string; // "01"
  total: string;   // "06"
}

const { current, total } = Astro.props;
---

<aside class="folio" aria-hidden="true">
  §{current} / {total}
</aside>

<style>
  .folio {
    position: sticky;
    top: 24px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    text-align: right;
    height: 0;
    pointer-events: none;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SectionHeader.astro src/components/Folio.astro
git commit -m "feat: add SectionHeader and Folio components"
```

### Task 2.6: Build the Hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Create `src/components/Hero.astro`**

```astro
---
import siteConfig from "~/content/site.json";

const taglineLines = siteConfig.tagline;
---

<section class="hero" aria-label="Introduction">
  <div class="hero__corners">
    <p class="hero__corner hero__corner--left">
      {siteConfig.shortName.toUpperCase()} · {siteConfig.initials}
    </p>
    <p class="hero__corner hero__corner--right">
      {siteConfig.dateline}
    </p>
  </div>

  <h1 class="hero__tagline">
    {taglineLines.map((line, i) => (
      <span class={`hero__line hero__line--${i % 2 === 0 ? "a" : "b"}`}>
        {line}
      </span>
    ))}
  </h1>

  <p class="hero__hint" aria-hidden="true">
    SCROLL · OR <kbd>⌘K</kbd>
  </p>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100vh;
    padding: 24px 24px 96px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: var(--content-with-rail);
    margin-inline: auto;
  }

  .hero__corners {
    position: absolute;
    top: 24px;
    left: 24px;
    right: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  .hero__corner {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    max-width: 28ch;
  }

  .hero__corner--right {
    text-align: right;
  }

  .hero__tagline {
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(40px, 8vw, 112px);
    line-height: 1.05;
    margin: 0;
    color: var(--color-ink);
    display: flex;
    flex-direction: column;
  }

  .hero__line {
    display: block;
  }

  .hero__line--b {
    margin-bottom: 0.4em;
  }

  .hero__line:last-child {
    margin-bottom: 0;
  }

  .hero__hint {
    position: absolute;
    bottom: 24px;
    right: 24px;
    margin: 0;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .hero__hint kbd {
    font-family: inherit;
    font-size: 11px;
    color: var(--color-ink);
    background: var(--color-paper-shade);
    padding: 1px 6px;
    border: 1px solid var(--color-hairline);
    border-radius: 4px;
  }
</style>
```

- [ ] **Step 2: Wire Hero into placeholder homepage and verify visually**

Edit `src/pages/index.astro`:

```astro
---
import Base from "~/layouts/Base.astro";
import Hero from "~/components/Hero.astro";
---

<Base title="Tony Yang">
  <Hero />
  <section class="max-content py-24">
    <p class="font-mono-meta">more sections coming below</p>
  </section>
</Base>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:4321` and confirm:
- Hero takes the full first viewport
- Tagline is in italic display serif, big (~80–112px on desktop)
- Top-left corner shows "TONY YANG · TY" in mono
- Top-right shows "INDEPENDENT AI RESEARCHER · AMSTERDAM · 2026 →"
- Bottom-right shows "SCROLL · OR ⌘K"

Stop the server.

- [ ] **Step 4: Update homepage smoke test**

Replace `tests/e2e/homepage.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("homepage hero renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Tony Yang");
  const tagline = page.getByRole("heading", { level: 1 });
  await expect(tagline).toContainText("limits of language");
  await expect(tagline).toContainText("dwell in more");
});

test("hero corners show dateline + initials", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("TONY YANG · TY")).toBeVisible();
  await expect(page.getByText(/INDEPENDENT AI RESEARCHER/)).toBeVisible();
});

test("respects prefers-reduced-motion", async ({ page, context }) => {
  await context.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
```

- [ ] **Step 5: Run tests**

```bash
npm run test:e2e
```

Expected: all 3 PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: add Hero component with cinematic tagline"
```

### Task 2.7: Build the Sidenote and PillLink components

**Files:**
- Create: `src/components/Sidenote.astro`
- Create: `src/components/PillLink.astro`

- [ ] **Step 1: Create `src/components/Sidenote.astro`**

```astro
---
interface Props {
  label?: string;
}

const { label } = Astro.props;
---

<aside class="sidenote">
  {label && <p class="sidenote__label">{label}</p>}
  <div class="sidenote__body"><slot /></div>
</aside>

<style>
  .sidenote {
    font-family: var(--font-sans);
    font-size: 13px;
    line-height: 1.5;
    color: var(--color-ink-soft);
    border-left: 1px solid var(--color-hairline);
    padding-left: 12px;
    margin-block: 8px;
  }

  .sidenote__label {
    margin: 0 0 4px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .sidenote__body {
    font-style: italic;
  }
</style>
```

- [ ] **Step 2: Create `src/components/PillLink.astro`**

```astro
---
interface Props {
  href: string;
  external?: boolean;
  label: string;
}

const { href, external = href.startsWith("http") || href.startsWith("mailto:"), label } = Astro.props;
---

<a
  class="pill"
  href={href}
  rel={external ? "noopener noreferrer" : undefined}
  target={external ? "_blank" : undefined}
>
  <span class="pill__label">{label}</span>
</a>

<style>
  .pill {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border: 1px solid var(--color-hairline);
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink);
    background: var(--color-paper-shade);
    transition: background 180ms ease-out, border-color 180ms ease-out, color 180ms ease-out;
  }

  .pill:hover {
    background: var(--color-paper);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .pill__label {
    line-height: 1;
  }
</style>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidenote.astro src/components/PillLink.astro
git commit -m "feat: add Sidenote and PillLink components"
```

### Task 2.8: Build the Intro (§00) component

**Files:**
- Create: `src/components/Intro.astro`

- [ ] **Step 1: Create `src/components/Intro.astro`**

```astro
---
import siteConfig from "~/content/site.json";
import PillLink from "./PillLink.astro";
---

<section id="currently" class="intro">
  <div class="intro__head">
    <figure class="intro__photo">
      <img
        src="/profile/Profile.jpg"
        alt="Portrait of Tony Yang"
        loading="eager"
        width="280"
        height="280"
      />
    </figure>
    <div class="intro__text">
      <p class="intro__currently">§00 · Currently</p>
      <p class="intro__paragraph">{siteConfig.intro}</p>

      <div class="intro__pills">
        <PillLink href={`mailto:${siteConfig.contact.email}`} label="email" />
        <PillLink href={siteConfig.contact.scholar} label="scholar" />
        <PillLink href={siteConfig.contact.github} label="github" />
        <PillLink href={siteConfig.contact.cv} label="cv" />
      </div>
    </div>
  </div>
</section>

<style>
  .intro {
    max-width: var(--content-max);
    margin-inline: auto;
    padding: 24px;
  }

  .intro__head {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 32px;
    align-items: start;
  }

  @media (max-width: 720px) {
    .intro__head {
      grid-template-columns: 1fr;
    }
  }

  .intro__photo {
    margin: 0;
    border: 1px solid var(--color-hairline);
    border-radius: 16px;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    background: var(--color-paper-shade);
    filter: grayscale(0.15) sepia(0.10);
  }

  .intro__photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .intro__currently {
    margin: 0 0 12px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .intro__paragraph {
    margin: 0;
    font-size: 17px;
    line-height: 1.65;
    color: var(--color-ink);
    max-width: 60ch;
  }

  .intro__pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
  }
</style>
```

- [ ] **Step 2: Wire Intro into homepage**

```astro
---
import Base from "~/layouts/Base.astro";
import Hero from "~/components/Hero.astro";
import Intro from "~/components/Intro.astro";
---

<Base title="Tony Yang">
  <Hero />
  <Intro />
</Base>
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:4321`, scroll past hero. Confirm:
- 280px duotone-treated headshot on the left
- Mono "§00 · Currently" caption above the paragraph
- Paragraph reads cleanly at body size
- Four mono pill links beneath: `email · scholar · github · cv`
- Pills hover to emerald

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/components/Intro.astro src/pages/index.astro
git commit -m "feat: add Intro (§00) section with duotone photo and pill links"
```

### Task 2.9: Implement workbench-graph utility (test-first)

**Files:**
- Create: `src/lib/workbench-graph.ts`
- Create: `tests/unit/workbench-graph.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/unit/workbench-graph.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildGraph, type GraphInput } from "~/lib/workbench-graph";

const sample: GraphInput = {
  papers: [
    {
      slug: "through-the-eyes",
      title: "Through the Eyes of Emotion",
      venue: "IMWUT",
      year: 2025,
      topics: ["vision"],
    },
    {
      slug: "reverse-imaging",
      title: "Reverse Imaging",
      venue: "MICCAI",
      year: 2025,
      topics: ["medical-ai", "vision"],
    },
  ],
  projects: [
    {
      slug: "scholarhighlights",
      title: "ScholarHighlights",
      topics: ["llms"],
      sortKey: 5,
    },
    {
      slug: "llm-router",
      title: "LLM Router",
      topics: ["llms"],
      sortKey: 4,
    },
  ],
};

describe("buildGraph", () => {
  it("emits one node per topic that appears", () => {
    const graph = buildGraph(sample);
    const topics = graph.nodes.filter((n) => n.kind === "topic").map((n) => n.id);
    expect(topics).toEqual(expect.arrayContaining(["vision", "medical-ai", "llms"]));
    expect(topics).not.toContain("world-models");
    expect(topics).not.toContain("wireless-sensing");
  });

  it("emits one node per paper and project", () => {
    const graph = buildGraph(sample);
    const outputs = graph.nodes.filter((n) => n.kind !== "topic").map((n) => n.id);
    expect(outputs.sort()).toEqual([
      "paper:reverse-imaging",
      "paper:through-the-eyes",
      "project:llm-router",
      "project:scholarhighlights",
    ]);
  });

  it("emits an edge for each (topic, output) pair", () => {
    const graph = buildGraph(sample);
    expect(graph.edges).toContainEqual({ from: "vision", to: "paper:through-the-eyes" });
    expect(graph.edges).toContainEqual({ from: "vision", to: "paper:reverse-imaging" });
    expect(graph.edges).toContainEqual({ from: "medical-ai", to: "paper:reverse-imaging" });
    expect(graph.edges).toContainEqual({ from: "llms", to: "project:llm-router" });
  });

  it("orders topic nodes by total connection count desc", () => {
    const graph = buildGraph(sample);
    const topics = graph.nodes.filter((n) => n.kind === "topic");
    // llms (2) and vision (2) tie, medical-ai (1) is last
    expect(topics[topics.length - 1].id).toBe("medical-ai");
  });
});
```

- [ ] **Step 2: Run the test (it should fail)**

```bash
npm run test:unit
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/lib/workbench-graph.ts`**

```ts
import type { Topic } from "~/content/config";

export interface PaperLite {
  slug: string;
  title: string;
  venue: string;
  year: number;
  topics: Topic[];
}

export interface ProjectLite {
  slug: string;
  title: string;
  topics: Topic[];
  sortKey: number;
}

export interface GraphInput {
  papers: PaperLite[];
  projects: ProjectLite[];
}

export type NodeKind = "topic" | "paper" | "project";

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  meta?: string;
  href?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const TOPIC_LABELS: Record<Topic, string> = {
  "world-models": "world models",
  "llms": "LLMs",
  "vision": "vision",
  "medical-ai": "medical AI",
  "wireless-sensing": "wireless sensing",
};

export function buildGraph({ papers, projects }: GraphInput): Graph {
  const topicSet = new Set<Topic>();
  for (const p of papers) p.topics.forEach((t) => topicSet.add(t));
  for (const p of projects) p.topics.forEach((t) => topicSet.add(t));

  const counts = new Map<Topic, number>();
  for (const t of topicSet) counts.set(t, 0);
  for (const p of papers) p.topics.forEach((t) => counts.set(t, counts.get(t)! + 1));
  for (const p of projects) p.topics.forEach((t) => counts.set(t, counts.get(t)! + 1));

  const sortedTopics = [...topicSet].sort((a, b) => {
    const diff = counts.get(b)! - counts.get(a)!;
    return diff !== 0 ? diff : a.localeCompare(b);
  });

  const topicNodes: GraphNode[] = sortedTopics.map((t) => ({
    id: t,
    label: TOPIC_LABELS[t],
    kind: "topic",
  }));

  const paperNodes: GraphNode[] = papers.map((p) => ({
    id: `paper:${p.slug}`,
    label: p.title,
    kind: "paper",
    meta: `${p.venue} '${String(p.year).slice(2)}`,
    href: `#paper-${p.slug}`,
  }));

  const projectNodes: GraphNode[] = [...projects]
    .sort((a, b) => b.sortKey - a.sortKey)
    .map((p) => ({
      id: `project:${p.slug}`,
      label: p.title,
      kind: "project",
      href: `#project-${p.slug}`,
    }));

  const edges: GraphEdge[] = [];
  for (const p of papers) {
    for (const t of p.topics) edges.push({ from: t, to: `paper:${p.slug}` });
  }
  for (const p of projects) {
    for (const t of p.topics) edges.push({ from: t, to: `project:${p.slug}` });
  }

  return {
    nodes: [...topicNodes, ...paperNodes, ...projectNodes],
    edges,
  };
}
```

- [ ] **Step 4: Run the test again**

```bash
npm run test:unit
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/workbench-graph.ts tests/unit/workbench-graph.test.ts
git commit -m "feat: implement workbench graph builder with tests"
```

### Task 2.10: Build the Workbench component (SVG with draw-in animation)

**Files:**
- Create: `src/components/Workbench.astro`
- Create: `src/scripts/workbench.ts`

- [ ] **Step 1: Create `src/components/Workbench.astro`**

```astro
---
import { getCollection } from "astro:content";
import { buildGraph } from "~/lib/workbench-graph";

const papers = await getCollection("papers");
const projects = await getCollection("projects");

const graph = buildGraph({
  papers: papers.map((p) => ({
    slug: p.slug,
    title: p.data.title,
    venue: p.data.venue,
    year: p.data.year,
    topics: p.data.topics,
  })),
  projects: projects.map((p) => ({
    slug: p.slug,
    title: p.data.title,
    topics: p.data.topics,
    sortKey: p.data.sortKey,
  })),
});

const TOPIC_X = 80;
const OUTPUT_X = 540;
const TOPIC_GAP = 64;
const OUTPUT_GAP = 36;

const topicNodes = graph.nodes.filter((n) => n.kind === "topic");
const outputNodes = graph.nodes.filter((n) => n.kind !== "topic");

const topicCount = topicNodes.length;
const outputCount = outputNodes.length;
const topicYStart = 40;
const outputYStart = 28;

const topicCoords = new Map<string, { x: number; y: number }>(
  topicNodes.map((n, i) => [n.id, { x: TOPIC_X, y: topicYStart + i * TOPIC_GAP }])
);
const outputCoords = new Map<string, { x: number; y: number }>(
  outputNodes.map((n, i) => [n.id, { x: OUTPUT_X, y: outputYStart + i * OUTPUT_GAP }])
);

const svgWidth = 720;
const svgHeight = Math.max(
  topicYStart + topicCount * TOPIC_GAP,
  outputYStart + outputCount * OUTPUT_GAP
) + 24;
---

<section class="workbench" aria-label="Research workbench">
  <p class="workbench__caption">— WORKBENCH —</p>
  <svg
    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    width="100%"
    role="img"
    aria-label="A graph linking research topics to papers and projects."
    class="workbench__svg"
  >
    <g class="edges">
      {graph.edges.map((e) => {
        const from = topicCoords.get(e.from)!;
        const to = outputCoords.get(e.to)!;
        return (
          <path
            class="edge"
            data-from={e.from}
            data-to={e.to}
            d={`M ${from.x + 8} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x - 6} ${to.y}`}
          />
        );
      })}
    </g>

    <g class="topics">
      {topicNodes.map((n) => {
        const c = topicCoords.get(n.id)!;
        return (
          <g class="topic" data-topic-id={n.id}>
            <circle cx={c.x} cy={c.y} r={6} />
            <text x={c.x - 16} y={c.y + 4} text-anchor="end">{n.label}</text>
          </g>
        );
      })}
    </g>

    <g class="outputs">
      {outputNodes.map((n) => {
        const c = outputCoords.get(n.id)!;
        return (
          <a
            href={n.href}
            class="output"
            data-output-id={n.id}
            data-kind={n.kind}
          >
            <circle cx={c.x} cy={c.y} r={4} />
            <text x={c.x + 12} y={c.y + 4}>{n.label}</text>
            {n.meta && <text class="meta" x={c.x + 12} y={c.y + 18}>{n.meta}</text>}
          </a>
        );
      })}
    </g>
  </svg>
</section>

<script>
  import "~/scripts/workbench";
</script>

<style>
  .workbench {
    max-width: var(--content-max);
    margin: 64px auto 32px;
    padding: 24px;
  }

  .workbench__caption {
    margin: 0 0 24px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    text-align: center;
  }

  .edge {
    fill: none;
    stroke: var(--color-hairline);
    stroke-width: 1;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    transition: stroke 240ms ease-out, opacity 240ms ease-out;
  }

  .workbench[data-drawn="true"] .edge {
    animation: draw 1400ms linear forwards;
  }

  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }

  .topic circle {
    fill: var(--color-paper);
    stroke: var(--color-ink);
    stroke-width: 1;
    transition: fill 240ms ease-out;
  }

  .topic[data-active="true"] circle {
    fill: var(--color-accent);
  }

  .topic text {
    font-family: var(--font-sans);
    font-size: 13px;
    fill: var(--color-ink);
  }

  .output circle {
    fill: var(--color-ink);
  }

  .output text {
    font-family: var(--font-sans);
    font-size: 13px;
    fill: var(--color-ink);
  }

  .output text.meta {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    fill: var(--color-ink-soft);
  }

  .workbench[data-dim] .edge,
  .workbench[data-dim] .topic,
  .workbench[data-dim] .output {
    opacity: 0.3;
  }

  .workbench[data-dim] .edge[data-active="true"],
  .workbench[data-dim] .topic[data-active="true"],
  .workbench[data-dim] .output[data-active="true"] {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .edge {
      stroke-dashoffset: 0;
    }
    .workbench[data-drawn="true"] .edge {
      animation: none;
    }
  }
</style>
```

- [ ] **Step 2: Create `src/scripts/workbench.ts`**

```ts
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.drawn = "true";
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.25 }
);

document.querySelectorAll<HTMLElement>(".workbench").forEach((el) => {
  observer.observe(el);

  el.querySelectorAll<SVGGElement>(".topic").forEach((topic) => {
    const id = topic.dataset.topicId;
    if (!id) return;

    topic.addEventListener("mouseenter", () => activate(el, id));
    topic.addEventListener("mouseleave", () => deactivate(el));
    topic.addEventListener("focus", () => activate(el, id));
    topic.addEventListener("blur", () => deactivate(el));
  });
});

function activate(workbench: HTMLElement, topicId: string) {
  workbench.setAttribute("data-dim", "");
  workbench.querySelectorAll<HTMLElement>(".edge").forEach((edge) => {
    edge.dataset.active = edge.dataset.from === topicId ? "true" : "";
  });
  workbench.querySelectorAll<HTMLElement>(".topic").forEach((topic) => {
    topic.dataset.active = topic.dataset.topicId === topicId ? "true" : "";
  });
  const connectedOutputs = new Set(
    Array.from(workbench.querySelectorAll<HTMLElement>(".edge"))
      .filter((e) => e.dataset.from === topicId)
      .map((e) => e.dataset.to ?? "")
  );
  workbench.querySelectorAll<HTMLElement>(".output").forEach((out) => {
    out.dataset.active = connectedOutputs.has(out.dataset.outputId ?? "")
      ? "true"
      : "";
  });
}

function deactivate(workbench: HTMLElement) {
  workbench.removeAttribute("data-dim");
  workbench.querySelectorAll<HTMLElement>("[data-active]").forEach((el) => {
    delete el.dataset.active;
  });
}
```

- [ ] **Step 3: Wire into homepage**

```astro
---
import Base from "~/layouts/Base.astro";
import Hero from "~/components/Hero.astro";
import Intro from "~/components/Intro.astro";
import Workbench from "~/components/Workbench.astro";
---

<Base title="Tony Yang">
  <Hero />
  <Intro />
  <Workbench />
</Base>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:4321`, scroll to the workbench section. Confirm:
- "— WORKBENCH —" caption renders
- Topic labels appear on the left, output labels on the right
- Edges draw in over ~1.4s when scrolled into view
- Hovering a topic dims unrelated nodes/edges to 30% opacity, highlights connected outputs
- Mouse leave restores everything

Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/Workbench.astro src/scripts/workbench.ts src/pages/index.astro
git commit -m "feat: add live workbench SVG with scroll draw-in and hover focus"
```

### Task 2.11: Build the PaperCard component

**Files:**
- Create: `src/components/PaperCard.astro`

- [ ] **Step 1: Create `src/components/PaperCard.astro`**

```astro
---
import type { CollectionEntry } from "astro:content";

interface Props {
  paper: CollectionEntry<"papers">;
}

const { paper } = Astro.props;
const { data, slug } = paper;

const datelineParts = [data.venue, data.venueExtra, String(data.year)].filter(Boolean);
const dateline = datelineParts.join(" · ").toUpperCase();
---

<article id={`paper-${slug}`} class={`paper${data.featured ? " paper--featured" : ""}`}>
  <a class="paper__thumb" href={data.links.paper ?? "#"} target={data.links.paper ? "_blank" : undefined} rel="noopener noreferrer">
    <img src={data.thumbnail} alt="" loading="lazy" />
  </a>
  <div class="paper__body">
    <p class="paper__dateline">
      {data.featured && <span class="paper__star" aria-label="featured">★</span>}
      {dateline}
    </p>
    <h3 class="paper__title">
      {data.links.paper ? (
        <a href={data.links.paper} target="_blank" rel="noopener noreferrer">{data.title}</a>
      ) : data.title}
    </h3>
    <p class="paper__authors">
      {data.authors.map((a, i) => (
        <>
          {a.url ? <a href={a.url} target="_blank" rel="noopener noreferrer">{a.name}</a> : a.name}
          {a.isMe && <span class="paper__me-mark" aria-label="me">·</span>}
          {a.equalContrib && <sup>*</sup>}
          {i < data.authors.length - 1 && ", "}
        </>
      ))}
    </p>
    <p class="paper__summary">{data.summary}</p>
    <p class="paper__links">
      {data.links.paper && <a href={data.links.paper} target="_blank" rel="noopener noreferrer">paper</a>}
      {data.links.code && <> · <a href={data.links.code} target="_blank" rel="noopener noreferrer">code</a></>}
      {data.links.bibtex && <> · <a href={data.links.bibtex} target="_blank" rel="noopener noreferrer">bib</a></>}
    </p>
  </div>
</article>

<style>
  .paper {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 24px;
    padding: 24px;
    border: 1px solid var(--color-hairline);
    border-radius: 16px;
    background: var(--color-paper-shade);
    transition: transform 240ms ease-out, border-color 240ms ease-out;
  }

  @media (max-width: 720px) {
    .paper {
      grid-template-columns: 1fr;
    }
  }

  .paper:hover {
    transform: translateY(-2px);
    border-color: var(--color-accent);
  }

  .paper--featured {
    background: var(--color-featured);
  }

  .paper__thumb {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid var(--color-hairline);
    background: var(--color-paper);
  }

  .paper__thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: var(--color-paper);
  }

  .paper__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .paper__dateline {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .paper__star {
    color: var(--color-accent);
    font-size: 12px;
  }

  .paper__title {
    margin: 0;
    font-family: var(--font-display);
    font-style: normal;
    font-size: 22px;
    line-height: 1.25;
    font-weight: 500;
  }

  .paper__title a {
    color: inherit;
  }

  .paper__title a:hover {
    color: var(--color-accent);
  }

  .paper__authors {
    margin: 0;
    font-size: 14px;
    color: var(--color-ink-soft);
    line-height: 1.5;
  }

  .paper__me-mark {
    display: none;
  }

  .paper__authors a {
    color: var(--color-ink-soft);
  }

  .paper__authors a:hover {
    color: var(--color-accent);
  }

  .paper__summary {
    margin: 4px 0 0;
    font-style: italic;
    color: var(--color-ink);
    line-height: 1.55;
  }

  .paper__links {
    margin: 8px 0 0;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }
</style>
```

- [ ] **Step 2: Add §01 Research section to homepage**

Update `src/pages/index.astro`:

```astro
---
import { getCollection } from "astro:content";
import Base from "~/layouts/Base.astro";
import Hero from "~/components/Hero.astro";
import Intro from "~/components/Intro.astro";
import Workbench from "~/components/Workbench.astro";
import SectionHeader from "~/components/SectionHeader.astro";
import PaperCard from "~/components/PaperCard.astro";

const papers = (await getCollection("papers")).sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
---

<Base title="Tony Yang">
  <Hero />
  <Intro />
  <Workbench />

  <section class="max-content" aria-label="Research">
    <SectionHeader
      num="01"
      title="Research"
      dek="On building AI systems that expand human capabilities — and that work outside the lab."
      id="research"
    />
    <div class="paper-grid">
      {papers.map((p) => <PaperCard paper={p} />)}
    </div>
  </section>
</Base>

<style>
  .paper-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
</style>
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Confirm: 3 paper cards appear under §01, the IMWUT one is featured (cream background, ★). Hover lifts the card.

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/components/PaperCard.astro src/pages/index.astro
git commit -m "feat: add §01 Research section with PaperCard component"
```

### Task 2.12: Build the ProjectCard component and §02 Projects section

**Files:**
- Create: `src/components/ProjectCard.astro`

- [ ] **Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
import type { CollectionEntry } from "astro:content";

interface Props {
  project: CollectionEntry<"projects">;
}

const { project } = Astro.props;
const { data, slug } = project;

const statusLabel = data.status === "shipped"
  ? "SHIPPED"
  : `IN PROGRESS${data.statusDetail ? ` · ${data.statusDetail.toUpperCase()}` : ""}`;

const primaryLink =
  data.links?.site ??
  data.links?.store ??
  data.links?.github ??
  data.links?.paper;
---

<article id={`project-${slug}`} class="project">
  {data.thumbnail && (
    <a class="project__thumb" href={primaryLink ?? "#"} target={primaryLink ? "_blank" : undefined} rel="noopener noreferrer">
      <img src={data.thumbnail} alt="" loading="lazy" />
    </a>
  )}
  <div class="project__body">
    <p class="project__meta">
      {data.collaborator ? `${data.collaborator.toUpperCase()} · ` : ""}
      {data.period.toUpperCase()} · <span class="project__status">{statusLabel}</span>
    </p>
    <h3 class="project__title">
      {primaryLink ? (
        <a href={primaryLink} target="_blank" rel="noopener noreferrer">{data.title}</a>
      ) : data.title}
    </h3>
    <p class="project__summary">{data.summary}</p>
    {data.links && (
      <p class="project__links">
        {data.links.github && <a href={data.links.github} target="_blank" rel="noopener noreferrer">github</a>}
        {data.links.store && (data.links.github ? " · " : "")}
        {data.links.store && <a href={data.links.store} target="_blank" rel="noopener noreferrer">chrome web store</a>}
        {data.links.site && <> · <a href={data.links.site} target="_blank" rel="noopener noreferrer">site</a></>}
        {data.links.paper && <> · <a href={data.links.paper} target="_blank" rel="noopener noreferrer">paper</a></>}
      </p>
    )}
  </div>
</article>

<style>
  .project {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 24px;
    padding: 20px 24px;
    border: 1px solid var(--color-hairline);
    border-radius: 16px;
    background: var(--color-paper-shade);
    transition: transform 240ms ease-out, border-color 240ms ease-out;
  }

  @media (max-width: 720px) {
    .project { grid-template-columns: 1fr; }
  }

  .project:hover {
    transform: translateY(-2px);
    border-color: var(--color-accent);
  }

  .project__thumb {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--color-hairline);
    background: var(--color-paper);
  }

  .project__thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .project__meta {
    margin: 0 0 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .project__status {
    color: var(--color-accent);
  }

  .project__title {
    margin: 0;
    font-family: var(--font-display);
    font-size: 22px;
    line-height: 1.25;
    font-style: normal;
    font-weight: 500;
  }

  .project__title a { color: inherit; }
  .project__title a:hover { color: var(--color-accent); }

  .project__summary {
    margin: 6px 0 0;
    font-style: italic;
    line-height: 1.55;
  }

  .project__links {
    margin: 8px 0 0;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }
</style>
```

- [ ] **Step 2: Add §02 Projects to the homepage**

Append to `src/pages/index.astro` (inside `<Base>`, after the §01 section):

```astro
---
// (add to existing import block at top of file)
import ProjectCard from "~/components/ProjectCard.astro";

// (add after the papers fetch)
const projects = (await getCollection("projects")).sort((a, b) => b.data.sortKey - a.data.sortKey);
---

<!-- (add inside <Base>, after the §01 section) -->
<section class="max-content" aria-label="Projects">
  <SectionHeader
    num="02"
    title="Projects"
    dek="Tools and collaborations — most are works-in-progress, all are real."
    id="projects"
  />
  <div class="project-list">
    {projects.map((p) => <ProjectCard project={p} />)}
  </div>
</section>

<style is:global>
  .project-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
```

- [ ] **Step 3: Verify in browser**

`npm run dev`. Confirm: 5 project cards appear, sorted by `sortKey` descending (ScholarHighlights first), status chips render correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.astro src/pages/index.astro
git commit -m "feat: add §02 Projects section with ProjectCard"
```

### Task 2.13: Add §03 Writing (empty state), §04 News, §05 Teaching, §06 Contact

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Wire the remaining sections into `src/pages/index.astro`**

Final imports/exports section (top of file):

```astro
---
import { getCollection, getEntry } from "astro:content";
import Base from "~/layouts/Base.astro";
import Hero from "~/components/Hero.astro";
import Intro from "~/components/Intro.astro";
import Workbench from "~/components/Workbench.astro";
import SectionHeader from "~/components/SectionHeader.astro";
import PaperCard from "~/components/PaperCard.astro";
import ProjectCard from "~/components/ProjectCard.astro";
import PillLink from "~/components/PillLink.astro";
import siteConfig from "~/content/site.json";

const papers = (await getCollection("papers")).sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
const projects = (await getCollection("projects")).sort(
  (a, b) => b.data.sortKey - a.data.sortKey
);
const recentPosts = (await getCollection("posts", (p) => !p.data.draft))
  .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
  .slice(0, 3);

const newsEntry = await getEntry("news", "news");
const teachingEntry = await getEntry("teaching", "teaching");
const NewsBody = newsEntry ? (await newsEntry.render()).Content : null;
const TeachingBody = teachingEntry ? (await teachingEntry.render()).Content : null;
---
```

> **Note.** Astro's content collection API differs slightly between MDX collections that contain a single file vs many. The `news.mdx` and `teaching.mdx` files live as single entries in their respective collections (configure them as `type: "data"` if you want to skip the per-file render, but here we render their MDX body as the section content). If `getEntry` returns `null` for either, we render an empty section gracefully — see the markup below.

Body (replace everything inside `<Base>`):

```astro
<Base title="Tony Yang">
  <Hero />
  <Intro />
  <Workbench />

  <section class="max-content" aria-label="Research">
    <SectionHeader num="01" title="Research" dek="On building AI systems that expand human capabilities — and that work outside the lab." id="research" />
    <div class="grid-list">
      {papers.map((p) => <PaperCard paper={p} />)}
    </div>
  </section>

  <section class="max-content" aria-label="Projects">
    <SectionHeader num="02" title="Projects" dek="Tools and collaborations — most are works-in-progress, all are real." id="projects" />
    <div class="grid-list">
      {projects.map((p) => <ProjectCard project={p} />)}
    </div>
  </section>

  <section class="max-content" aria-label="Writing">
    <SectionHeader num="03" title="Writing" dek="Notes on research, taste, and the boring parts of building AI." id="writing" />
    {recentPosts.length === 0 ? (
      <div class="writing-empty">
        <p>First entry coming soon.</p>
        <p class="writing-empty__rss">
          <a href="/rss.xml">↗ subscribe via RSS</a>
        </p>
      </div>
    ) : (
      <ul class="post-list">
        {recentPosts.map((post) => (
          <li>
            <a href={`/writing/${post.slug}/`}>
              <span class="post__date">{post.data.date}</span>
              <span class="post__title">{post.data.title}</span>
              <span class="post__dek">{post.data.dek}</span>
            </a>
          </li>
        ))}
        <li class="post-list__more">
          <a href="/writing/">→ all writing</a>
        </li>
      </ul>
    )}
  </section>

  <section class="max-content" aria-label="News">
    <SectionHeader num="04" title="News" id="news" />
    {NewsBody && (
      <div class="news-body">
        <NewsBody />
      </div>
    )}
  </section>

  <section class="max-content" aria-label="Teaching">
    <SectionHeader num="05" title="Teaching" id="teaching" />
    {TeachingBody && (
      <div class="teaching-body">
        <TeachingBody />
      </div>
    )}
  </section>

  <section class="max-content" aria-label="Contact">
    <SectionHeader num="06" title="Contact" id="contact" />
    <p class="contact-invitation">{siteConfig.contactInvitation}</p>
    <div class="contact-pills">
      <PillLink href={`mailto:${siteConfig.contact.email}`} label="email" />
      <PillLink href={siteConfig.contact.scholar} label="scholar" />
      <PillLink href={siteConfig.contact.github} label="github" />
      <PillLink href={siteConfig.contact.cv} label="cv" />
    </div>
    <p class="contact-footer">
      built in atelier mode · <kbd>⌘K</kbd> · <a href="/world/">✎</a>
    </p>
  </section>
</Base>

<style>
  .grid-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .writing-empty {
    border: 1px dashed var(--color-hairline);
    padding: 32px;
    border-radius: 16px;
    text-align: center;
    font-style: italic;
    color: var(--color-ink-soft);
  }

  .writing-empty__rss {
    margin-top: 12px;
    font-style: normal;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .post__date {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .post__title {
    display: block;
    font-family: var(--font-display);
    font-size: 22px;
    margin-top: 4px;
  }

  .post__dek {
    display: block;
    color: var(--color-ink-soft);
    font-style: italic;
    margin-top: 4px;
  }

  .news-body :global(ul),
  .teaching-body :global(ul) {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .news-body :global(li),
  .teaching-body :global(li) {
    padding: 8px 0;
    border-bottom: 1px solid var(--color-hairline);
  }

  .news-body :global(strong) {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--color-ink-soft);
    font-weight: 500;
    margin-right: 8px;
  }

  .contact-invitation {
    font-style: italic;
    font-size: 18px;
    max-width: 50ch;
  }

  .contact-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 16px 0;
  }

  .contact-footer {
    margin-top: 64px;
    padding-top: 24px;
    border-top: 1px solid var(--color-hairline);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    text-align: center;
  }

  .contact-footer kbd {
    font-family: inherit;
    color: var(--color-ink);
    background: var(--color-paper-shade);
    padding: 1px 6px;
    border: 1px solid var(--color-hairline);
    border-radius: 4px;
  }
</style>
```

- [ ] **Step 2: Make news.mdx and teaching.mdx work as content entries**

These are single-entry "data-style" collections. Update `src/content/config.ts` to match:

```ts
// (add at the bottom, before `export const collections`)
const news = defineCollection({
  type: "content",
  schema: z.object({ title: z.string() }),
});

const teaching = defineCollection({
  type: "content",
  schema: z.object({ title: z.string() }),
});

export const collections = { papers, projects, posts, news, teaching };
```

- [ ] **Step 3: Verify all 7 sections render**

```bash
npm run dev
```

Scroll the homepage end-to-end. Confirm:
- Hero, §00, Workbench, §01, §02, §03 (empty state), §04, §05, §06 all render
- §03 shows the dashed empty-state card with "First entry coming soon" + RSS link
- §04 lists the 6 news items with mono dates
- §05 lists the 5 teaching entries
- §06 ends with `built in atelier mode · ⌘K · ✎`

- [ ] **Step 4: Update the smoke test to verify section IDs**

`tests/e2e/homepage.spec.ts` (replace):

```ts
import { test, expect } from "@playwright/test";

test("homepage hero renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Tony Yang");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("limits of language");
});

test("all 7 homepage sections are present", async ({ page }) => {
  await page.goto("/");
  for (const id of ["currently", "research", "projects", "writing", "news", "teaching", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
});

test("research section shows 3 papers", async ({ page }) => {
  await page.goto("/");
  const papers = page.locator("article.paper");
  await expect(papers).toHaveCount(3);
});

test("featured paper has star + cream tint", async ({ page }) => {
  await page.goto("/");
  const featured = page.locator("article.paper--featured");
  await expect(featured).toHaveCount(1);
  await expect(featured.locator(".paper__star")).toBeVisible();
});

test("writing empty state shows", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("First entry coming soon.")).toBeVisible();
});

test("respects prefers-reduced-motion", async ({ page, context }) => {
  await context.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
```

- [ ] **Step 5: Run tests**

```bash
npm run test:e2e
```

Expected: all 6 pass.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/content/config.ts tests/e2e/homepage.spec.ts
git commit -m "feat: add §03–§06 sections (writing empty state, news, teaching, contact)"
```

### Task 2.14: Build the right-rail TOC component

**Files:**
- Create: `src/components/Toc.astro`

- [ ] **Step 1: Create `src/components/Toc.astro`**

```astro
---
interface TocItem {
  id: string;
  num: string;
  label: string;
}

interface Props {
  items?: TocItem[];
}

const defaultItems: TocItem[] = [
  { id: "research", num: "01", label: "Research" },
  { id: "projects", num: "02", label: "Projects" },
  { id: "writing", num: "03", label: "Writing" },
  { id: "news", num: "04", label: "News" },
  { id: "teaching", num: "05", label: "Teaching" },
  { id: "contact", num: "06", label: "Contact" },
];

const { items = defaultItems } = Astro.props;
---

<aside class="toc" aria-label="Table of contents">
  <ol>
    {items.map((it) => (
      <li>
        <a href={`#${it.id}`} data-id={it.id}>
          <span class="toc__num">§{it.num}</span>
          <span class="toc__label">{it.label}</span>
        </a>
      </li>
    ))}
  </ol>
</aside>

<script>
  const toc = document.querySelector<HTMLElement>(".toc");
  if (toc) {
    const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>("a[data-id]"));
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          const link = links.find((l) => l.dataset.id === id);
          if (!link) continue;
          if (entry.isIntersecting) link.classList.add("is-active");
          else link.classList.remove("is-active");
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    links.forEach((l) => {
      const target = document.getElementById(l.dataset.id ?? "");
      if (target) obs.observe(target);
    });

    let scrolled = false;
    window.addEventListener("scroll", () => {
      if (!scrolled && window.scrollY > 200) {
        toc.classList.add("is-visible");
        scrolled = true;
      }
    });
  }
</script>

<style>
  .toc {
    position: fixed;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
    z-index: 5;
    opacity: 0;
    transition: opacity 320ms ease-out;
    pointer-events: none;
  }

  .toc.is-visible {
    opacity: 1;
    pointer-events: auto;
  }

  @media (max-width: 1080px) {
    .toc { display: none; }
  }

  ol {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  a {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    padding: 4px 8px;
    border-radius: 6px;
    opacity: 0.6;
    transition: opacity 180ms ease-out, color 180ms ease-out;
  }

  a:hover {
    opacity: 1;
    color: var(--color-ink);
  }

  a.is-active {
    opacity: 1;
    color: var(--color-accent);
  }
</style>
```

- [ ] **Step 2: Wire into the homepage**

Add to `src/pages/index.astro` imports:

```astro
import Toc from "~/components/Toc.astro";
```

Add inside `<Base>` (just after `<Hero />`):

```astro
<Toc />
```

- [ ] **Step 3: Verify**

`npm run dev`. Scroll past the hero. Confirm:
- Right-rail TOC fades in
- Active section highlights in emerald as you scroll
- Hidden on widths < 1080px
- Clicking links smooth-scrolls to the section

- [ ] **Step 4: Commit**

```bash
git add src/components/Toc.astro src/pages/index.astro
git commit -m "feat: add right-rail TOC with active-section tracking"
```

### Task 2.15: Add Folio markers per section

**Files:**
- Modify: `src/components/SectionHeader.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Add a folio prop to SectionHeader**

Update `src/components/SectionHeader.astro` — add a small inline folio at the right of the header:

```astro
---
interface Props {
  num: string;
  title: string;
  dek?: string;
  id?: string;
  total?: string;
}

const { num, title, dek, id, total = "06" } = Astro.props;
const slugId = id ?? title.toLowerCase().replace(/\s+/g, "-");
---

<header id={slugId} class="section-header">
  <div class="row">
    <p class="prefix">
      <span class="num">§{num}</span>
      <span class="bullet">·</span>
      <span class="label">{title}</span>
    </p>
    <span class="folio" aria-hidden="true">§{num} / {total}</span>
  </div>
  {dek && <p class="dek">{dek}</p>}
  <span class="underline" aria-hidden="true"></span>
</header>

<style>
  /* (existing styles, plus:) */
  .row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 24px;
  }

  .folio {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }
</style>
```

(Keep all the styles from the prior version — only add `.row` and `.folio`.)

- [ ] **Step 2: Verify**

`npm run dev`. Each section header now shows `§NN / 06` on the right.

- [ ] **Step 3: Commit**

```bash
git add src/components/SectionHeader.astro
git commit -m "feat: add folio markers to section headers"
```

### Task 2.16: Auto-generate SVG project thumbnails

**Files:**
- Create: `public/projects/llm-router.svg`
- Create: `public/projects/cost-adaptive-routing.svg`
- Create: `public/projects/human-intent-world-model.svg`
- Create: `public/projects/llm-for-optimization.svg`
- Modify: 4 project MDX files to point at the new SVGs

These are small hand-crafted decorative SVGs in the workbench aesthetic — hairline strokes on cream, single emerald accent.

- [ ] **Step 1: Create `public/projects/llm-router.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" fill="#F5EFE2"/>
  <g stroke="#0F1417" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="100" r="6"/>
    <circle cx="100" cy="60" r="5"/>
    <circle cx="100" cy="100" r="5"/>
    <circle cx="100" cy="140" r="5"/>
    <circle cx="160" cy="100" r="6"/>
    <path d="M46 100 L94 60"/>
    <path d="M46 100 L94 100"/>
    <path d="M46 100 L94 140"/>
    <path d="M105 60 L154 100"/>
    <path d="M105 100 L154 100"/>
    <path d="M105 140 L154 100"/>
  </g>
  <circle cx="100" cy="100" r="5" fill="#0E5347"/>
</svg>
```

- [ ] **Step 2: Create `public/projects/cost-adaptive-routing.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" fill="#F5EFE2"/>
  <g stroke="#0F1417" stroke-width="1.2" stroke-linecap="round">
    <path d="M30 150 Q 60 80 100 100 T 170 50"/>
    <path d="M30 160 Q 80 130 130 130 T 170 100" stroke="#0E5347"/>
    <line x1="30" y1="170" x2="170" y2="170"/>
    <line x1="30" y1="30" x2="30" y2="170"/>
  </g>
  <text x="180" y="56" font-family="JetBrains Mono, monospace" font-size="10" fill="#4A5159" text-anchor="end">SOTA</text>
  <text x="180" y="106" font-family="JetBrains Mono, monospace" font-size="10" fill="#0E5347" text-anchor="end">ROUTED</text>
</svg>
```

- [ ] **Step 3: Create `public/projects/human-intent-world-model.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" fill="#F5EFE2"/>
  <g stroke="#0F1417" stroke-width="1.2" fill="none" stroke-linecap="round">
    <circle cx="100" cy="100" r="60"/>
    <circle cx="100" cy="100" r="40"/>
    <circle cx="100" cy="100" r="20"/>
    <line x1="40" y1="100" x2="160" y2="100"/>
    <line x1="100" y1="40" x2="100" y2="160"/>
  </g>
  <circle cx="100" cy="100" r="4" fill="#0E5347"/>
</svg>
```

- [ ] **Step 4: Create `public/projects/llm-for-optimization.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" fill="#F5EFE2"/>
  <g stroke="#0F1417" stroke-width="1.2" fill="none" stroke-linecap="round">
    <path d="M30 100 L60 60 L100 90 L130 50 L170 80"/>
    <path d="M30 140 L60 110 L100 130 L130 100 L170 120" stroke="#0E5347"/>
    <line x1="30" y1="170" x2="170" y2="170"/>
    <line x1="30" y1="30" x2="30" y2="170"/>
  </g>
  <circle cx="170" cy="120" r="4" fill="#0E5347"/>
</svg>
```

- [ ] **Step 5: Update 4 project MDX files to point at the new SVGs**

Replace `thumbnail: "/projects/scholarhighlights.png"` with the matching path in each of:
- `src/content/projects/llm-router.mdx` → `/projects/llm-router.svg`
- `src/content/projects/cost-adaptive-routing.mdx` → `/projects/cost-adaptive-routing.svg`
- `src/content/projects/human-intent-world-model.mdx` → `/projects/human-intent-world-model.svg`
- `src/content/projects/llm-for-optimization.mdx` → `/projects/llm-for-optimization.svg`

- [ ] **Step 6: Verify in browser**

`npm run dev`. Confirm: each ongoing project now has its own distinct SVG thumbnail.

- [ ] **Step 7: Commit**

```bash
git add public/projects/ src/content/projects/
git commit -m "feat: add hand-crafted SVG thumbnails for ongoing projects"
```

### Task 2.17: Phase 2 exit gate — full homepage tested

**Files:** none

- [ ] **Step 1: Run all tests**

```bash
npm run test
```

Expected: all unit tests pass; all e2e tests pass.

- [ ] **Step 2: Run a production build**

```bash
npm run build
```

Expected: succeeds, `dist/index.html` contains all section IDs, paper titles, project titles, news entries.

- [ ] **Step 3: Push and verify CI is green**

```bash
git push
gh run watch
```

Expected: build job green.

---

## Phase 3 — Interactive Layers

**Goal:** Add the `⌘K` command palette, the persistent ✎ sketchbook button, and the atelier scene MVP at `/world/`. All three should be reachable, accessible, and respect reduced-motion preferences.

**Phase exit gate:** All 3 features have Playwright tests that pass; building Pagefind for the search index works.

### Task 3.1: Set up Pagefind integration

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Wire Pagefind in the head**

Add to the `<head>` of `Base.astro`:

```astro
<link rel="modulepreload" href="/pagefind/pagefind.js" />
```

Add to the bottom of `Base.astro`'s `<body>`:

```astro
<script>
  // Lazy-load pagefind so it doesn't block first paint
  declare global {
    interface Window {
      __pagefind?: any;
    }
  }
  window.__pagefind = null;
  export async function loadPagefind() {
    if (window.__pagefind) return window.__pagefind;
    // @ts-ignore - dynamic import of generated file
    const mod = await import(/* @vite-ignore */ "/pagefind/pagefind.js");
    await mod.init();
    window.__pagefind = mod;
    return mod;
  }
</script>
```

> **Note.** Pagefind is generated by `npm run build` (per the `package.json` script `"build": "astro build && pagefind --site dist"`). In dev mode it doesn't exist; the command palette will gracefully fall back to "no results" until the user runs a build.

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: wire Pagefind module into Base layout"
```

### Task 3.2: Build the CommandPalette component

**Files:**
- Create: `src/components/CommandPalette.astro`
- Create: `src/scripts/command-palette.ts`

- [ ] **Step 1: Create `src/components/CommandPalette.astro`**

```astro
---
import siteConfig from "~/content/site.json";
---

<div class="cmdk" data-cmdk hidden>
  <button class="cmdk__veil" type="button" aria-label="Close command palette" data-cmdk-close></button>
  <div class="cmdk__panel" role="dialog" aria-modal="true" aria-label="Command palette">
    <input
      class="cmdk__input"
      type="text"
      placeholder="Type a command or search..."
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
      data-cmdk-input
    />
    <ul class="cmdk__results" role="listbox" data-cmdk-results>
      <li role="option" data-cmd="papers">papers — jump to research</li>
      <li role="option" data-cmd="projects">projects — jump to projects</li>
      <li role="option" data-cmd="writing">writing — open the blog</li>
      <li role="option" data-cmd="latest">latest — most recent paper</li>
      <li role="option" data-cmd="cv">cv — open the PDF</li>
      <li role="option" data-cmd="email">email — compose</li>
      <li role="option" data-cmd="world">world — open the atelier</li>
      <li role="option" data-cmd="pace">pace — half-marathon PB</li>
      <li role="option" data-cmd="now">now — what I'm working on</li>
      <li role="option" data-cmd="theme" data-cmd-disabled>theme — toggle (coming soon)</li>
      <li role="option" data-cmd="help">? — help</li>
    </ul>
    <p class="cmdk__hint" data-cmdk-hint></p>
  </div>
</div>

<script define:vars={{ siteConfig }}>
  window.__siteConfig = siteConfig;
</script>
<script>
  import "~/scripts/command-palette";
</script>

<style>
  .cmdk {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: start center;
    padding-top: 18vh;
  }

  .cmdk[hidden] {
    display: none;
  }

  .cmdk__veil {
    position: absolute;
    inset: 0;
    background: rgba(15, 20, 23, 0.4);
    backdrop-filter: blur(2px);
    border: 0;
    cursor: default;
  }

  .cmdk__panel {
    position: relative;
    width: min(520px, calc(100% - 48px));
    background: var(--color-paper);
    border: 1px solid var(--color-hairline);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(15, 20, 23, 0.2);
  }

  .cmdk__input {
    display: block;
    width: 100%;
    padding: 16px 20px;
    border: 0;
    background: transparent;
    border-bottom: 1px solid var(--color-hairline);
    font-family: var(--font-sans);
    font-size: 16px;
    color: var(--color-ink);
  }

  .cmdk__input:focus {
    outline: 0;
  }

  .cmdk__results {
    list-style: none;
    margin: 0;
    padding: 8px;
    max-height: 320px;
    overflow-y: auto;
  }

  .cmdk__results li {
    padding: 10px 12px;
    border-radius: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink);
    cursor: pointer;
  }

  .cmdk__results li[data-cmd-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cmdk__results li.is-active,
  .cmdk__results li:hover {
    background: var(--color-paper-shade);
    color: var(--color-accent);
  }

  .cmdk__hint {
    margin: 0;
    padding: 8px 16px;
    border-top: 1px solid var(--color-hairline);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    text-align: right;
  }
</style>
```

- [ ] **Step 2: Create `src/scripts/command-palette.ts`**

```ts
const root = document.querySelector<HTMLElement>("[data-cmdk]");
if (!root) {
  // No palette on this page; bail quietly.
} else {
  const input = root.querySelector<HTMLInputElement>("[data-cmdk-input]")!;
  const results = root.querySelector<HTMLUListElement>("[data-cmdk-results]")!;
  const hint = root.querySelector<HTMLParagraphElement>("[data-cmdk-hint]")!;
  const closeBtn = root.querySelector<HTMLButtonElement>("[data-cmdk-close]")!;
  const items = Array.from(results.querySelectorAll<HTMLLIElement>("li"));

  let activeIndex = 0;
  setActive(0);

  function open() {
    root!.hidden = false;
    setTimeout(() => input.focus(), 30);
  }

  function close() {
    root!.hidden = true;
    input.value = "";
    filter("");
  }

  function setActive(i: number) {
    const visible = items.filter((el) => !el.hidden);
    if (visible.length === 0) return;
    activeIndex = ((i % visible.length) + visible.length) % visible.length;
    items.forEach((el) => el.classList.remove("is-active"));
    visible[activeIndex].classList.add("is-active");
    visible[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function filter(query: string) {
    const q = query.trim().toLowerCase();
    items.forEach((el) => {
      const cmd = (el.dataset.cmd ?? "").toLowerCase();
      const txt = (el.textContent ?? "").toLowerCase();
      el.hidden = q.length > 0 && !cmd.includes(q) && !txt.includes(q);
    });
    activeIndex = 0;
    setActive(0);
  }

  function execute(cmd: string) {
    const site = (window as any).__siteConfig as {
      contact: { email: string; scholar: string; github: string; cv: string };
      currently: string;
    };
    switch (cmd) {
      case "papers":
        location.hash = "#research";
        close();
        return;
      case "projects":
        location.hash = "#projects";
        close();
        return;
      case "writing":
        location.href = "/writing/";
        return;
      case "latest":
        location.hash = "#research";
        close();
        return;
      case "cv":
        window.open(site.contact.cv, "_blank");
        close();
        return;
      case "email":
        location.href = `mailto:${site.contact.email}`;
        close();
        return;
      case "world":
        location.href = "/world/";
        return;
      case "pace":
        toast("Half-marathon PB: 1:43:53");
        close();
        return;
      case "now":
        toast(site.currently);
        close();
        return;
      case "theme":
        toast("Dark mode is coming in v1.1.");
        return;
      case "help":
      case "?":
        toast("⌘K to open · ↑↓ Enter to pick · Esc to close");
        return;
      default:
        // Free-text query: try Pagefind
        runSearch(cmd);
    }
  }

  async function runSearch(q: string) {
    if (q.length < 2) return;
    const w = window as any;
    if (typeof w.loadPagefind !== "function") {
      hint.textContent = "Search index not built yet.";
      return;
    }
    try {
      const pf = await w.loadPagefind();
      const search = await pf.search(q);
      hint.textContent = `${search.results.length} result(s)`;
    } catch {
      hint.textContent = "Search unavailable in dev. Try a command instead.";
    }
  }

  function toast(msg: string) {
    hint.textContent = msg;
    setTimeout(() => (hint.textContent = ""), 4000);
  }

  // Keyboard
  window.addEventListener("keydown", (e) => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    const meta = isMac ? e.metaKey : e.ctrlKey;
    if ((meta && e.key.toLowerCase() === "k") || (!meta && e.key === "/" && document.activeElement?.tagName !== "INPUT")) {
      e.preventDefault();
      open();
      return;
    }
    if (root!.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(activeIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(activeIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const visible = items.filter((el) => !el.hidden);
      const target = visible[activeIndex];
      if (!target || target.dataset.cmdDisabled !== undefined) return;
      const cmd = target.dataset.cmd;
      if (cmd) execute(cmd);
      else execute(input.value);
    }
  });

  input.addEventListener("input", () => filter(input.value));

  closeBtn.addEventListener("click", () => close());

  results.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement).closest<HTMLLIElement>("li");
    if (!el || el.dataset.cmdDisabled !== undefined) return;
    const cmd = el.dataset.cmd;
    if (cmd) execute(cmd);
  });
}
```

- [ ] **Step 3: Wire CommandPalette into Base layout**

Edit `src/layouts/Base.astro` — import and render the palette:

```astro
---
import "~/styles/globals.css";
import CommandPalette from "~/components/CommandPalette.astro";
// ... existing props
---

<!-- inside <body>, AFTER <main> -->
<CommandPalette />
```

- [ ] **Step 4: Verify**

```bash
npm run dev
```

Open `http://localhost:4321`. Press `⌘K` (Mac) or `Ctrl+K` (others). Confirm:
- Palette opens with input focused
- All 11 commands listed
- Type "pap" → only "papers" remains visible
- Press ↓/↑ to move active highlight
- Press Enter on "papers" → palette closes, scrolls to #research
- Press `⌘K` again, then Escape → closes
- Click on the veil → closes

- [ ] **Step 5: Commit**

```bash
git add src/components/CommandPalette.astro src/scripts/command-palette.ts src/layouts/Base.astro
git commit -m "feat: add ⌘K command palette with fuzzy filter and keyboard nav"
```

### Task 3.3: Add command palette E2E test

**Files:**
- Create: `tests/e2e/command-palette.spec.ts`

- [ ] **Step 1: Write the test**

```ts
import { test, expect } from "@playwright/test";

test.describe("⌘K command palette", () => {
  test("opens with ⌘K, closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await expect(page.locator("[data-cmdk]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-cmdk]")).toBeHidden();
  });

  test("opens with /", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("/");
    await expect(page.locator("[data-cmdk]")).toBeVisible();
  });

  test("filters as you type", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await page.locator("[data-cmdk-input]").fill("pap");
    const visible = page.locator("[data-cmdk-results] li:not([hidden])");
    await expect(visible).toHaveCount(1);
    await expect(visible.first()).toContainText(/papers/i);
  });

  test("Enter on 'papers' jumps to #research", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await page.locator("[data-cmdk-input]").fill("papers");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#research$/);
  });

  test("'world' command navigates to /world/", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+K");
    await page.locator("[data-cmdk-input]").fill("world");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/world\/?$/);
  });
});
```

- [ ] **Step 2: Note about /world/ test**

The `'world' command navigates to /world/` test will fail until Task 3.5 creates the route. Mark it `test.fixme()` for now:

```ts
test.fixme("'world' command navigates to /world/", async ({ page }) => {
  // ...
});
```

We'll un-fixme it after Task 3.5.

- [ ] **Step 3: Run tests**

```bash
npm run test:e2e
```

Expected: 4 pass, 1 fixme.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/command-palette.spec.ts
git commit -m "test: add ⌘K command palette E2E tests"
```

### Task 3.4: Build the SketchbookButton component

**Files:**
- Create: `src/components/SketchbookButton.astro`

- [ ] **Step 1: Create the component**

```astro
---
---

<a class="sketchbook" href="/world/" aria-label="Open atelier scene">
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path d="M3 4 L21 4 L21 20 L3 20 Z M7 4 L7 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11 9 L17 9 M11 13 L17 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  </svg>
  <span class="sketchbook__label">atelier</span>
</a>

<style>
  .sketchbook {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 50;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: var(--color-paper);
    border: 1px solid var(--color-hairline);
    border-radius: 999px;
    color: var(--color-ink);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    box-shadow: 0 8px 24px rgba(15, 20, 23, 0.08);
    transition: transform 240ms ease-out, color 240ms ease-out, border-color 240ms ease-out;
  }

  .sketchbook:hover {
    transform: translateY(-2px);
    color: var(--color-accent);
    border-color: var(--color-accent);
  }

  .sketchbook__label {
    line-height: 1;
  }

  @media (max-width: 720px) {
    .sketchbook { padding: 10px; }
    .sketchbook__label { display: none; }
  }
</style>
```

- [ ] **Step 2: Wire into Base.astro**

Add to `Base.astro`'s `<body>`, after `<main>`:

```astro
<SketchbookButton />
```

with `import SketchbookButton from "~/components/SketchbookButton.astro";` at the top.

- [ ] **Step 3: Verify**

`npm run dev`. The ✎ button appears in the lower-right of every page. Hover lifts it.

- [ ] **Step 4: Commit**

```bash
git add src/components/SketchbookButton.astro src/layouts/Base.astro
git commit -m "feat: add persistent sketchbook button (linking to /world/)"
```

### Task 3.5: Create the atelier scene data file

**Files:**
- Create: `src/content/atelier.json`

- [ ] **Step 1: Create the scene data**

```json
{
  "viewports": [
    {
      "id": "desk",
      "title": "Desk & Window",
      "objects": [
        { "id": "laptop", "label": "Laptop", "x": 20, "y": 60, "note": "This is where the LLM Router commits get made. Usually around midnight, with bad lo-fi." },
        { "id": "notebook", "label": "Notebook", "x": 50, "y": 70, "note": "A new one every quarter. Most of the good ideas live here before they live in any repo." },
        { "id": "coffee", "label": "Coffee", "x": 75, "y": 65, "note": "Filter, black, no sugar." }
      ]
    },
    {
      "id": "kitchen",
      "title": "Kitchen",
      "objects": [
        { "id": "stove", "label": "Pot on stove", "x": 30, "y": 55, "note": "I cook for family on Sundays. Mostly Chinese, mostly experimental." },
        { "id": "knife", "label": "Knife & board", "x": 65, "y": 70, "note": "Yu Choy, garlic, ginger, soy. Reset button at the end of any week." }
      ]
    },
    {
      "id": "bookshelf",
      "title": "Bookshelf & Run",
      "objects": [
        { "id": "books", "label": "Books", "x": 25, "y": 40, "note": "A short stack of paper drafts and Le Guin essays. Always re-reading: Borges, On Photography." },
        { "id": "shoes", "label": "Running shoes", "x": 60, "y": 75, "note": "Half-marathon PB 1:43:53. Most ideas show up around km 8." },
        { "id": "medal", "label": "Medal", "x": 80, "y": 60, "note": "The medal isn't the point. The km-8 part is." }
      ]
    },
    {
      "id": "night",
      "title": "Night — The Cat",
      "objects": [
        { "id": "cat", "label": "Cat in window", "x": 70, "y": 50, "note": "We're planning to adopt a cat. The window is reserved for them." },
        { "id": "moon", "label": "Moon", "x": 30, "y": 25 },
        { "id": "candle", "label": "Candle", "x": 25, "y": 70, "note": "For the things I'm not yet ready to write about." },
        { "id": "rings", "label": "Rings", "x": 50, "y": 80, "note": "Married to the love of my life. The first co-author who never asks for revisions." },
        { "id": "tennis", "label": "Tennis racket", "x": 85, "y": 75, "note": "Saturday mornings. Mostly losing." }
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/content/atelier.json
git commit -m "content: add atelier scene data (4 viewports, 13 objects)"
```

### Task 3.6: Build the AtelierScene component

**Files:**
- Create: `src/components/AtelierScene.astro`
- Create: `src/scripts/atelier-scene.ts`
- Create: `src/pages/world.astro`

- [ ] **Step 1: Create `src/components/AtelierScene.astro`**

```astro
---
import scene from "~/content/atelier.json";

const allNotes = scene.viewports
  .flatMap((v) => v.objects.filter((o) => o.note).map((o) => ({ ...o, viewport: v.title })));
---

<div class="atelier" data-atelier>
  <button class="atelier__close" data-atelier-close aria-label="Close atelier">Esc · close</button>
  <p class="atelier__hint" data-atelier-hint>← / → to walk · click an object · T to show all notes</p>

  <div class="atelier__track" data-atelier-track>
    {scene.viewports.map((v, i) => (
      <section class={`atelier__view atelier__view--${v.id}`} data-viewport={i}>
        <p class="atelier__view-title">{v.title.toUpperCase()}</p>
        {v.objects.map((o) => (
          <button
            class="atelier__obj"
            data-obj-id={o.id}
            data-obj-note={o.note ?? ""}
            data-obj-label={o.label}
            style={`left: ${o.x}%; top: ${o.y}%;`}
            aria-label={o.label}
            disabled={!o.note}
          >
            <span class="atelier__dot"></span>
            <span class="atelier__caption">{o.label}</span>
          </button>
        ))}
      </section>
    ))}
  </div>

  <aside class="atelier__panel" data-atelier-panel hidden>
    <p class="atelier__panel-label" data-atelier-panel-label></p>
    <p class="atelier__panel-note" data-atelier-panel-note></p>
    <button class="atelier__panel-close" data-atelier-panel-close aria-label="Dismiss note">close ×</button>
  </aside>

  <ul class="atelier__sr" aria-label="All atelier notes">
    {allNotes.map((n) => (
      <li><strong>{n.label}</strong> ({n.viewport}): {n.note}</li>
    ))}
  </ul>
</div>

<script>
  import "~/scripts/atelier-scene";
</script>

<style>
  .atelier {
    position: fixed;
    inset: 0;
    background: var(--color-paper);
    overflow: hidden;
    z-index: 40;
  }

  .atelier__track {
    display: flex;
    height: 100vh;
    width: 400vw;
    transition: transform 320ms ease-out;
    transform: translateX(0);
  }

  .atelier__view {
    width: 100vw;
    height: 100vh;
    position: relative;
    border-right: 1px dashed var(--color-hairline);
    box-sizing: border-box;
  }

  .atelier__view-title {
    position: absolute;
    top: 24px;
    left: 24px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    color: var(--color-ink-soft);
    margin: 0;
  }

  .atelier__obj {
    position: absolute;
    transform: translate(-50%, -50%);
    border: 0;
    background: transparent;
    cursor: pointer;
    color: inherit;
  }

  .atelier__obj:disabled { cursor: default; }

  .atelier__dot {
    display: block;
    width: 14px;
    height: 14px;
    border: 1px solid var(--color-ink);
    border-radius: 50%;
    background: var(--color-paper);
    transition: background 180ms, border-color 180ms;
  }

  .atelier__obj:hover .atelier__dot,
  .atelier__obj:focus-visible .atelier__dot {
    background: var(--color-accent);
    border-color: var(--color-accent);
  }

  .atelier__caption {
    position: absolute;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    opacity: 0;
    transition: opacity 180ms;
  }

  .atelier[data-show-captions] .atelier__caption,
  .atelier__obj:hover .atelier__caption {
    opacity: 1;
  }

  .atelier__close,
  .atelier__hint {
    position: fixed;
    top: 24px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    background: transparent;
    border: 0;
    padding: 4px 8px;
  }

  .atelier__close { right: 24px; cursor: pointer; }
  .atelier__hint { left: 50%; transform: translateX(-50%); margin: 0; }

  .atelier__panel {
    position: fixed;
    right: 24px;
    bottom: 24px;
    width: min(360px, calc(100% - 48px));
    background: var(--color-paper-shade);
    border: 1px solid var(--color-hairline);
    border-radius: 16px;
    padding: 20px;
  }

  .atelier__panel-label {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  .atelier__panel-note {
    margin: 6px 0 0;
    font-family: var(--font-display);
    font-style: italic;
    font-size: 18px;
    line-height: 1.45;
  }

  .atelier__panel-close {
    margin-top: 12px;
    background: transparent;
    border: 0;
    padding: 0;
    color: var(--color-ink-soft);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .atelier__sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  @media (prefers-reduced-motion: reduce) {
    .atelier__track { transition: none; }
  }
</style>
```

- [ ] **Step 2: Create `src/scripts/atelier-scene.ts`**

```ts
const root = document.querySelector<HTMLElement>("[data-atelier]");
if (root) {
  const track = root.querySelector<HTMLElement>("[data-atelier-track]")!;
  const panel = root.querySelector<HTMLElement>("[data-atelier-panel]")!;
  const panelLabel = root.querySelector<HTMLElement>("[data-atelier-panel-label]")!;
  const panelNote = root.querySelector<HTMLElement>("[data-atelier-panel-note]")!;
  const panelClose = root.querySelector<HTMLElement>("[data-atelier-panel-close]")!;
  const closeBtn = root.querySelector<HTMLElement>("[data-atelier-close]")!;
  const objects = Array.from(root.querySelectorAll<HTMLButtonElement>(".atelier__obj"));
  const totalViewports = root.querySelectorAll(".atelier__view").length;

  let currentViewport = 0;

  function setViewport(i: number) {
    currentViewport = Math.max(0, Math.min(totalViewports - 1, i));
    track.style.transform = `translateX(-${currentViewport * 100}vw)`;
  }

  function showNote(label: string, note: string) {
    panelLabel.textContent = label;
    panelNote.textContent = note;
    panel.hidden = false;
  }

  function hideNote() {
    panel.hidden = true;
  }

  // Initial deep-link
  const params = new URLSearchParams(location.search);
  const at = params.get("at");
  if (at) {
    const target = objects.find((o) => o.dataset.objId === at);
    if (target) {
      const viewportIdx = parseInt(target.closest<HTMLElement>("[data-viewport]")?.dataset.viewport ?? "0", 10);
      setViewport(viewportIdx);
      showNote(target.dataset.objLabel ?? "", target.dataset.objNote ?? "");
    }
  }

  // Click an object
  objects.forEach((obj) => {
    obj.addEventListener("click", () => {
      const id = obj.dataset.objId ?? "";
      const note = obj.dataset.objNote ?? "";
      const label = obj.dataset.objLabel ?? "";
      if (!note) return;
      const url = new URL(location.href);
      url.searchParams.set("at", id);
      history.replaceState({}, "", url);
      showNote(label, note);
    });
  });

  panelClose.addEventListener("click", () => {
    hideNote();
    const url = new URL(location.href);
    url.searchParams.delete("at");
    history.replaceState({}, "", url);
  });

  closeBtn.addEventListener("click", () => {
    history.length > 1 ? history.back() : (location.href = "/");
  });

  // Scroll, arrow keys, T toggle
  let wheelLock = 0;
  window.addEventListener("wheel", (e) => {
    if (Date.now() < wheelLock) return;
    if (Math.abs(e.deltaY) < 30) return;
    setViewport(currentViewport + (e.deltaY > 0 ? 1 : -1));
    wheelLock = Date.now() + 600;
  }, { passive: true });

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setViewport(currentViewport + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setViewport(currentViewport - 1);
    } else if (e.key.toLowerCase() === "t") {
      e.preventDefault();
      if (root.dataset.showCaptions !== undefined) delete root.dataset.showCaptions;
      else root.dataset.showCaptions = "";
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (!panel.hidden) hideNote();
      else closeBtn.click();
    }
  });
}
```

- [ ] **Step 3: Create `src/pages/world.astro`**

```astro
---
import Base from "~/layouts/Base.astro";
import AtelierScene from "~/components/AtelierScene.astro";
---

<Base
  title="My World — Tony Yang"
  description="A small, hand-drawn world of objects from my life. Click any object to read a note."
>
  <AtelierScene />
</Base>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Visit `http://localhost:4321/world/`. Confirm:
- Cream background, 4 viewports horizontally laid out
- Right arrow / wheel moves to next viewport
- Hovering an object reveals its label
- Clicking an object opens the side panel with the note
- Pressing `T` toggles all labels
- Pressing Escape closes the panel
- Visiting `http://localhost:4321/world/?at=cat` deep-links straight to the cat sidenote

- [ ] **Step 5: Un-fixme the world test in `tests/e2e/command-palette.spec.ts`**

Remove `test.fixme` and confirm:

```bash
npm run test:e2e
```

Expected: 5 command-palette tests all pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/AtelierScene.astro src/scripts/atelier-scene.ts src/pages/world.astro tests/e2e/command-palette.spec.ts
git commit -m "feat: add atelier scene MVP at /world/ with horizontal parallax + sidenotes"
```

### Task 3.7: Add atelier-scene E2E tests

**Files:**
- Create: `tests/e2e/atelier-scene.spec.ts`

- [ ] **Step 1: Write the tests**

```ts
import { test, expect } from "@playwright/test";

test.describe("atelier scene", () => {
  test("renders at /world/", async ({ page }) => {
    await page.goto("/world/");
    await expect(page.locator("[data-atelier]")).toBeVisible();
    const viewports = page.locator(".atelier__view");
    await expect(viewports).toHaveCount(4);
  });

  test("clicking an object shows its note", async ({ page }) => {
    await page.goto("/world/?at=laptop");
    await expect(page.locator("[data-atelier-panel]")).toBeVisible();
    await expect(page.locator("[data-atelier-panel-label]")).toContainText(/laptop/i);
  });

  test("T key reveals all captions", async ({ page }) => {
    await page.goto("/world/");
    await page.keyboard.press("t");
    await expect(page.locator("[data-atelier]")).toHaveAttribute("data-show-captions", "");
  });

  test("Escape closes the open panel", async ({ page }) => {
    await page.goto("/world/?at=cat");
    await expect(page.locator("[data-atelier-panel]")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-atelier-panel]")).toBeHidden();
  });

  test("sketchbook button on homepage links to /world/", async ({ page }) => {
    await page.goto("/");
    const sketch = page.locator(".sketchbook");
    await expect(sketch).toBeVisible();
    await sketch.click();
    await expect(page).toHaveURL(/\/world\/?$/);
  });
});
```

- [ ] **Step 2: Run**

```bash
npm run test:e2e
```

Expected: all atelier tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/atelier-scene.spec.ts
git commit -m "test: add atelier scene E2E tests"
```

### Task 3.8: Phase 3 exit gate

- [ ] **Step 1: Build, run all tests**

```bash
npm run build && npm run test
```

Expected: build green, all tests pass.

- [ ] **Step 2: Manual cross-browser smoke**

Open `http://localhost:4321` (after `npm run preview`) in Chrome and Safari. Confirm hero, workbench, palette, sketchbook button, world all behave.

- [ ] **Step 3: Push**

```bash
git push
gh run watch
```

Expected: green.

---

## Phase 4 — Blog system & Cutover

**Goal:** Add `/writing/` index, individual post pages, RSS feed, sitemap, custom 404, and execute the safe cutover from old `master` to the redesigned site without breaking the live URL.

**Phase exit gate:** `tonyyunyang.github.io` serves the new site, the GitHub Action workflow is wired up, the legacy site is preserved in `legacy/`, all tests pass on master, and a `git revert` of the cutover commit would restore the old site cleanly.

### Task 4.1: Build the writing index page

**Files:**
- Create: `src/pages/writing/index.astro`

- [ ] **Step 1: Write the page**

```astro
---
import { getCollection } from "astro:content";
import Base from "~/layouts/Base.astro";
import SectionHeader from "~/components/SectionHeader.astro";

const posts = (await getCollection("posts", (p) => !p.data.draft)).sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
---

<Base
  title="Writing — Tony Yang"
  description="Notes on research, taste, and the boring parts of building AI."
>
  <section class="max-content">
    <SectionHeader num="03" title="Writing" id="writing" total="06" />
    {posts.length === 0 ? (
      <p class="empty">First entry coming soon. <a href="/rss.xml">↗ subscribe via RSS</a></p>
    ) : (
      <ul class="post-list">
        {posts.map((post) => (
          <li>
            <a href={`/writing/${post.slug}/`}>
              <span class="post__date">{post.data.date}</span>
              <span class="post__title">{post.data.title}</span>
              <span class="post__dek">{post.data.dek}</span>
            </a>
          </li>
        ))}
      </ul>
    )}
  </section>
</Base>

<style>
  .empty {
    border: 1px dashed var(--color-hairline);
    padding: 32px;
    border-radius: 16px;
    text-align: center;
    font-style: italic;
    color: var(--color-ink-soft);
  }
  .post-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 24px; }
  .post-list a { display: block; }
  .post__date { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-ink-soft); }
  .post__title { display: block; font-family: var(--font-display); font-style: italic; font-size: 28px; margin-top: 4px; color: var(--color-ink); }
  .post__dek { display: block; color: var(--color-ink-soft); font-style: italic; margin-top: 4px; }
</style>
```

- [ ] **Step 2: Verify**

`npm run dev` → visit `/writing/`. Confirm: empty state shows.

- [ ] **Step 3: Commit**

```bash
git add src/pages/writing/index.astro
git commit -m "feat: add /writing/ index page"
```

### Task 4.2: Build the post template + Post layout

**Files:**
- Create: `src/layouts/Post.astro`
- Create: `src/pages/writing/[...slug].astro`

- [ ] **Step 1: Create `src/layouts/Post.astro`**

```astro
---
import Base from "./Base.astro";

interface Props {
  title: string;
  date: string;
  dek?: string;
  description?: string;
}

const { title, date, dek, description } = Astro.props;
---

<Base title={`${title} — Tony Yang`} description={description ?? dek}>
  <article class="post max-content">
    <header class="post__header">
      <p class="post__date">{date}</p>
      <h1 class="post__title">{title}</h1>
      {dek && <p class="post__dek">{dek}</p>}
    </header>
    <div class="post__body">
      <slot />
    </div>
  </article>
</Base>

<style>
  .post {
    padding-block: 96px;
    max-width: 720px;
  }
  .post__date {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    margin: 0 0 16px;
  }
  .post__title {
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(36px, 6vw, 64px);
    line-height: 1.1;
    margin: 0;
  }
  .post__dek {
    margin: 16px 0 0;
    font-style: italic;
    font-size: 18px;
    color: var(--color-ink-soft);
    max-width: 50ch;
  }
  .post__body {
    margin-top: 48px;
    font-size: 17px;
    line-height: 1.75;
  }
  .post__body :global(h2) {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 28px;
    margin-top: 48px;
  }
  .post__body :global(p) { margin-block: 1em; }
  .post__body :global(a) { color: var(--color-accent); text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }
  .post__body :global(blockquote) {
    border-left: 2px solid var(--color-accent);
    padding-left: 16px;
    color: var(--color-ink-soft);
    font-style: italic;
  }
  .post__body :global(pre) {
    background: var(--color-paper-shade);
    border: 1px solid var(--color-hairline);
    padding: 16px;
    border-radius: 12px;
    overflow-x: auto;
    font-size: 13px;
  }
  .post__body :global(code) {
    font-family: var(--font-mono);
    font-size: 13px;
  }
</style>
```

- [ ] **Step 2: Create `src/pages/writing/[...slug].astro`**

```astro
---
import { getCollection } from "astro:content";
import Post from "~/layouts/Post.astro";

export async function getStaticPaths() {
  const posts = await getCollection("posts", (p) => !p.data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Post title={post.data.title} date={post.data.date} dek={post.data.dek}>
  <Content />
</Post>
```

- [ ] **Step 3: Add a sample draft post (so we can verify the template)**

`src/content/posts/hello.mdx`:

```mdx
---
title: "Hello, atelier"
date: "2026-05-01"
dek: "First entry. The site is alive."
draft: true
---

The site you're reading was rebuilt from scratch, in Astro, in May 2026.
This is a placeholder post — drafts don't appear in the index, but the template
can render them so we know it works.

## How posts work

Drop a `.mdx` file under `src/content/posts/`. Set `draft: false` in the frontmatter
when it's ready to ship. That's it.
```

- [ ] **Step 4: Build and verify**

```bash
npm run build && npm run preview
```

Visit `/writing/`. Empty state still shows (the post is `draft: true`).

To test the template, temporarily set `draft: false` and rebuild — verify `/writing/hello/` renders. Then set back to `draft: true`.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Post.astro src/pages/writing/\[...slug\].astro src/content/posts/hello.mdx
git commit -m "feat: add post layout + dynamic post route + sample draft"
```

### Task 4.3: Add RSS feed and a 404 page

**Files:**
- Create: `src/pages/rss.xml.ts`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/rss.xml.ts`**

```ts
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts", (p) => !p.data.draft);
  return rss({
    title: "Tony Yang — Writing",
    description: "Notes on research, taste, and the boring parts of building AI.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.dek,
      link: `/writing/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
```

- [ ] **Step 2: Create `src/pages/404.astro`**

```astro
---
import Base from "~/layouts/Base.astro";
---

<Base title="Lost — Tony Yang" description="This page wandered off.">
  <section class="lost">
    <p class="lost__meta">§404 · LOST IN THE ATELIER</p>
    <h1>The page wandered off.</h1>
    <p>Maybe try the <a href="/">home page</a>, or open the <a href="/world/">atelier</a>.</p>
  </section>
</Base>

<style>
  .lost {
    max-width: var(--content-max);
    margin: 96px auto;
    padding: 24px;
    text-align: center;
  }
  .lost__meta {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
    margin: 0 0 16px;
  }
  h1 {
    font-family: var(--font-display);
    font-style: italic;
    font-size: clamp(36px, 6vw, 64px);
    margin: 0;
  }
  p { margin-top: 16px; font-style: italic; color: var(--color-ink-soft); }
</style>
```

- [ ] **Step 3: Verify**

```bash
npm run build && npm run preview
```

- Visit `/rss.xml` → see XML feed (empty `<item>` list, but valid).
- Visit `/asdf` → see 404 page.

- [ ] **Step 4: Commit**

```bash
git add src/pages/rss.xml.ts src/pages/404.astro
git commit -m "feat: add RSS feed and custom 404 page"
```

### Task 4.4: Add blog E2E test

**Files:**
- Create: `tests/e2e/blog.spec.ts`

- [ ] **Step 1: Write the test**

```ts
import { test, expect } from "@playwright/test";

test("/writing index renders empty state when only drafts", async ({ page }) => {
  await page.goto("/writing/");
  await expect(page.getByText(/First entry coming soon/i)).toBeVisible();
});

test("404 page renders for unknown URL", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist");
  expect(res?.status()).toBeGreaterThanOrEqual(400);
});
```

> The 404 test note: in `astro dev`, unknown URLs return a dev overlay. In `astro preview` (production-like), the 404 page is served. Make sure to run `npm run build && npm run preview` if you want to verify locally; in CI, the Pages site serves 404.html directly.

- [ ] **Step 2: Commit**

```bash
git add tests/e2e/blog.spec.ts
git commit -m "test: add blog and 404 E2E tests"
```

### Task 4.5: Move the old site into legacy/

**Files:**
- Move: `index.html` → `legacy/index.html`
- Move: `my-world.html` → `legacy/my-world.html`
- Move: `bibtex-viewer.html` → `legacy/bibtex-viewer.html`
- Move: `stylesheet.css` → `legacy/stylesheet.css`
- Move: `my-world.css` → `legacy/my-world.css`
- Move: `WEBSITE_MODIFICATION_GUIDE.md` → `legacy/WEBSITE_MODIFICATION_GUIDE.md`

- [ ] **Step 1: Move files**

```bash
mkdir -p legacy
git mv index.html legacy/
git mv my-world.html legacy/
git mv bibtex-viewer.html legacy/
git mv stylesheet.css legacy/
git mv my-world.css legacy/
git mv WEBSITE_MODIFICATION_GUIDE.md legacy/
```

- [ ] **Step 2: Move the unused images directory**

```bash
git mv images legacy/images
git mv data legacy/data
git mv output legacy/output
```

> The `public/` directory now contains everything the new site needs.

- [ ] **Step 3: Verify nothing references the moved paths from the new build**

```bash
grep -r "data/tony-cv\|images/" src/ public/ 2>/dev/null && echo "REFS FOUND" || echo "OK"
```

Expected output: `OK` (no references in `src/` or `public/`).

- [ ] **Step 4: Build to confirm everything still works**

```bash
npm run build
```

Expected: build succeeds. `dist/` contains the new site.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: archive old Jon-Barron-template site to legacy/"
```

### Task 4.6: Write a new README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the old README**

```markdown
# tonyyunyang.github.io

Personal site for [Tony Yang](https://tonyyunyang.github.io). Built in Astro with the
"Atelier × Cinema" design system. Source for design/spec at
`docs/superpowers/specs/2026-05-01-tonyyunyang-redesign-design.md`.

## Develop

```sh
npm install
npm run dev          # http://localhost:4321
```

## Build

```sh
npm run build        # outputs to ./dist with the Pagefind search index
npm run preview      # serve the production build locally
```

## Tests

```sh
npm run test:unit    # Vitest
npm run test:e2e     # Playwright
npm test             # both
```

## Add a blog post

Drop a `.mdx` file in `src/content/posts/`:

```mdx
---
title: "..."
date: "YYYY-MM-DD"
dek: "..."
draft: false
---

post body...
```

It auto-appears at `/writing/`, on the homepage §03, in `/rss.xml`, and in the sitemap.

## Deploy

GitHub Actions builds and deploys on every push to `master`. The repo's
GitHub Pages source is set to "GitHub Actions". The live URL is
`https://tonyyunyang.github.io`.

## Legacy

The previous Jon-Barron-template site lives under `legacy/`. It is not part
of the build output and not deployed.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for the Astro setup"
```

### Task 4.7: Phase 4 exit gate — push, switch Pages source, cutover

This is the only "live moment" in the entire plan. Do it carefully.

**Files:** none (settings + git only)

- [ ] **Step 1: Push the redesign branch**

```bash
git push
gh run watch
```

Expected: build green on the redesign branch.

- [ ] **Step 2: Switch GitHub Pages source to "GitHub Actions"**

In the GitHub web UI: **Settings → Pages → Build and deployment → Source** → select **GitHub Actions**.

Or via CLI:

```bash
gh api -X PUT repos/tonyyunyang/tonyyunyang.github.io/pages -f build_type=workflow
```

Verify:

```bash
gh api repos/tonyyunyang/tonyyunyang.github.io/pages | grep build_type
```

Expected: `"build_type": "workflow"`.

- [ ] **Step 3: Open the cutover PR**

```bash
gh pr ready
gh pr view --web
```

Convert the draft PR (created in Phase 1) to ready-for-review. Confirm the build is green.

- [ ] **Step 4: Merge the PR**

```bash
gh pr merge --squash --delete-branch
```

This pushes a single squash commit to master, which triggers `deploy.yml`.

- [ ] **Step 5: Watch the deploy**

```bash
gh run watch
```

Expected: build + deploy both green.

- [ ] **Step 6: Verify the live site**

Open `https://tonyyunyang.github.io` in a fresh browser tab (private window to avoid cache). Confirm:
- New homepage loads
- Hero tagline renders
- Workbench draws
- `⌘K` works
- `/world/` works
- `/writing/` renders empty state
- `/cv.pdf` opens correctly
- `/rss.xml` returns a valid feed
- The 404 page works for `/asdf`

- [ ] **Step 7: Save a memory of the cutover**

Run a small command to confirm the cutover commit hash is captured for posterity:

```bash
git log -1 --format="%H %s" master
```

Save the hash; if anything goes wrong later, `git revert <hash>` rolls everything back.

- [ ] **Step 8: Phase 4 exit gate**

If steps 1–6 all succeeded, the redesign is live. Phase 4 is done.

### Task 4.8: Post-launch sweeps

These are optional polish tasks, do them now if there's appetite.

- [ ] **Step 1: Run Lighthouse on the homepage**

```bash
npx lighthouse https://tonyyunyang.github.io --view --preset=desktop
```

Targets: Accessibility ≥ 100, Performance ≥ 95, SEO ≥ 100, Best Practices ≥ 100.

If any score is below the bar, file follow-up issues; don't block on perfection.

- [ ] **Step 2: Verify reduced-motion works in production**

In Chrome DevTools: **Rendering → Emulate CSS media feature** → `prefers-reduced-motion: reduce`. Reload the live site. Confirm: workbench is drawn without animation, atelier viewport changes are instant, no other transitions.

- [ ] **Step 3: Update memory: project completed**

After verifying the site is live, the project memory at `~/.claude/projects/<project>/memory/project_redesign.md` should be updated to reflect that the design has shipped — but only the implementation agent at the end should do that.

---

## Self-review checklist (run after writing the plan)

1. **Spec coverage:**
   - §1 site map → Tasks 1.5, 4.1, 4.2, 4.3 (homepage, /writing, post pages, /world, /rss, /404, /cv.pdf, /sitemap auto)
   - §2 visual system → Task 1.4 (globals.css with all tokens, fonts, motion budget, reduced-motion)
   - §3 homepage → Tasks 2.6 (hero), 2.8 (intro), 2.10 (workbench), 2.11 (paper cards), 2.12 (project cards), 2.13 (writing/news/teaching/contact), 2.14 (TOC), 2.15 (folio)
   - §4 atelier MVP → Tasks 3.5, 3.6, 3.7
   - §5 command palette → Tasks 3.2, 3.3
   - §6 content rewrites → Task 2.4 (site.json with intro)
   - §7 image plan → Task 1.6 (asset copy), 2.16 (project SVGs)
   - §8 tech architecture → Tasks 1.3, 1.4 (Astro + Tailwind), 2.1 (collections), tests scaffolded throughout
   - §9 deployment → Tasks 1.9 (workflow), 4.7 (cutover with Pages source flip + rollback note)
   - §10 a11y → Task 1.4 (reduced-motion in globals), Task 1.5 (skip-link), Task 3.6 (sr-only ul), Task 4.8 step 2 (verify in prod)
   - §11 out of scope: dark mode, Three.js, comments, newsletter, analytics, i18n — none of these have tasks (correct)
   - §12 shipping plan → 4 phases match
   - §13 success criteria → covered: cutover (4.7), hero (2.6), workbench (2.10), palette (3.2/3.3), sketchbook (3.4), atelier scene (3.6/3.7), MDX-driven blog (4.1/4.2), reduced-motion (1.4), Lighthouse (4.8), legacy preserved (4.5)

2. **Placeholder scan:** plan body has zero `TBD`/`TODO`. The "placeholder thumbnail" note in Task 2.3 is descriptive (the file path placeholder gets fixed in 2.16); the "Hello, Atelier" page in Task 1.5 is intentional placeholder copy and replaced by 2.6.

3. **Type consistency:** `Topic` enum is defined once in `src/content/config.ts` and re-imported by `workbench-graph.ts`. Component prop names (`paper`, `project`, `num`, `title`, `dek`, `id`, `total`) are consistent across all uses. `data-cmdk*` attributes are consistent between Astro template and TS module. Atelier scene uses `data-atelier*` across template, script, and tests.

4. **Ambiguity:** none material.
