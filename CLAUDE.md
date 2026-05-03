# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A static website serving the **PJP code**, a French family cookbook hosted at pjpcode.com. To preview, open `index.html` in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server` from the repo root).

The current site is plain hand-written HTML (no build step). An **Eleventy
prototype** has been added on top to demonstrate a Markdown + template
workflow — see "Eleventy prototype" below.

## Site structure and navigation flow

The site has a hand-built navigation hierarchy across three files in `pjpcode/`:

1. `/index.html` — root splash, links into `pjpcode/indexpjpcode.html`.
2. `pjpcode/indexpjpcode.html` — photo of the cooks; the photo links to `voici.htm`.
3. `pjpcode/voici.htm` — the **sommaire**: a numbered list of every recipe with `<a href="…">` links to each recipe's HTML file. This is the primary index. Two further index pages (`recettes_alpha.htm`, `recettes_liste_par_numeros.htm`) live at `pjpcode/` root but currently aren't linked from anywhere — see `tasks.md`.

When adding a recipe, the index page `voici.htm` needs to be updated by hand — there is no generator.

## Recipe storage layout

Each recipe lives in `pjpcode/recipes/XXXX/` where `XXXX` is the
four-digit zero-padded recipe number (e.g. `pjpcode/recipes/0001/`,
`pjpcode/recipes/0030/`, `pjpcode/recipes/0253/`). URLs follow the same
shape: `pjpcode.com/recipes/0030/recipe.html`. Inside, the files use generic names — the recipe name
isn't part of any filename:

- `recipe.html` — the recipe page (Word-exported HTML for older recipes;
  a handwritten placeholder for image-only recipes; a short generated
  placeholder for recipes whose only source is Word docs).
- `recipe.pdf` and/or `recipe.docx` — Word-format copies (recipes 143+
  and a handful of older ones that have both).
- `image-01.jpg`, `image-02.jpg`, … — recipe images, two-digit
  zero-padded, numbered in the order they appear in `recipe.html`. The
  extension matches the original (`.jpg`, `.png`, `.gif`).

Word HTML is fragile — heavy `mso-*` styles, `windows-1252` charset,
`<u1:p>`/`<o:p>` tags, VML imagedata for old IE. Don't try to clean it up;
the whitespace/markup is load-bearing.

Files at `pjpcode/` root are either navigation pages (`voici.htm`,
`indexpjpcode.html`, `recettes_alpha.htm`,
`recettes_liste_par_numeros.htm`, `lisez moi d'abord.htm`,
`nous_deux.jpg`), the `recipes/` directory itself, the `orphan/`
directory of unattributed files, or `RM_`-prefixed entries pending
deletion — see `tasks.md` for the inventory.

## Eleventy prototype

A prototype build setup using [Eleventy (11ty)](https://www.11ty.dev/) is
wired into the repo. It demonstrates rendering a few recipes from
Markdown + a shared template, alongside the existing hand-written HTML.

Layout:

```
package.json                  # Eleventy + scripts
.eleventy.js                  # config (input ., output _site)
.eleventyignore
_layouts/
  recipe.njk                  # recipe page template
  page.njk                    # generic page template (sommaire, etc.)
_data/
  recipes.js                  # prototype recipe metadata (drives voici-v2)
.github/workflows/deploy.yml  # GitHub Pages deploy via Actions
pjpcode/
  style.css                   # shared stylesheet for new pages
  pjpcode.11tydata.js         # directory data: keep .html URLs flat
  voici-v2.md                 # prototype sommaire
  recipes/0001/recipe-v2.md   # prototype recipes (alongside recipe.html)
  recipes/0086/recipe-v2.md
  recipes/0138/recipe-v2.md
  recipes/0143/recipe-v2.md
```

Existing `.html`, `.pdf`, `.docx`, image files are *passed through* by
Eleventy unchanged. Only `.md` and `.njk` files are processed as templates.
Each prototype recipe lives at `recipe-v2.md` next to the original
`recipe.html`, so you can compare side-by-side without disturbing the
existing site.

**Local commands:**

- `npm install` — once, to install Eleventy.
- `npm run build` — one-shot build to `_site/`.
- `npm run serve` — Eleventy's dev server at `http://localhost:8080`
  (or pass `--port=8888`). Use this to view prototype pages — absolute
  paths like `/pjpcode/style.css` only resolve when the build output is
  served as the document root.
- `npm run clean` — delete `_site/`.

**Deploy:** `.github/workflows/deploy.yml` builds on every push to `master`
and publishes `_site/` via GitHub Pages. To enable, set the repo's
**Settings → Pages → Source** to **GitHub Actions** (one-time).

**Browsing the prototype** (after `npm run serve`):
- `http://localhost:8080/pjpcode/voici-v2.html` — regenerated sommaire
  with links to the 4 prototype recipes.
- Each prototype recipe links back via `← sommaire`.
- The original site (`/pjpcode/voici.htm`, `/pjpcode/recipes/0086/recipe.html`,
  etc.) is also served for direct comparison.

## Encoding gotchas

- Most older HTML declares `charset=ISO-8859-1` or `windows-1252` and stores French accents as 8-bit bytes (e.g. `derni�re mise � jour`). These display correctly in browsers but may look like mojibake in editors that auto-detect UTF-8. **Don't blanket-convert files to UTF-8** — you'd also need to update the `<meta charset>` and re-test rendering across every page.
- All filenames in the repo are lowercase. Inside `pjpcode/XXXX/` recipe folders names are normalized (`recipe.{html,pdf,docx}`, `image-NN.<ext>`), so the old NFC/NFD accent-duplicate problem is mostly gone within recipes — any remaining `RM_`-prefixed files at root are the duplicates pending deletion.
- `.gitattributes` enables `* text=auto` LF normalization, which can churn the Word-exported HTML on commit. If you see large whitespace-only diffs, that's why.
