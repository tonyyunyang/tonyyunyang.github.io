# tonyyunyang.github.io

Personal site for [Tony Yang](https://tonyyunyang.github.io). Custom Astro 5
build in the "Atelier × Cinema" internal design language. Single-author
project, no template ancestry. Deploys to GitHub Pages on every push to
`main` via the workflow in `.github/workflows/deploy.yml`.

## Develop

```sh
npm install
npm run dev          # http://localhost:4321
```

## Build

```sh
npm run build        # outputs ./dist with the Pagefind search index
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

It auto-appears at `/writing/`, on the homepage §03 (when among the 3 newest),
in `/rss.xml`, and in the sitemap.

## Add a paper or project

`src/content/papers/<slug>.mdx` and `src/content/projects/<slug>.mdx` —
schemas in `src/content/config.ts`. Adding a paper or project updates the
homepage cards *and* the live workbench graph automatically.

## Deploy

GitHub Actions builds and deploys on every push to `master`. The repo's
GitHub Pages source is set to "GitHub Actions". The live URL is
`https://tonyyunyang.github.io`.

## Legacy

The previous Jon-Barron-template-derived site lives under `legacy/` for
reference only. It is excluded from the build output and not deployed.
