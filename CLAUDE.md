# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A static website serving the **PJP code**, a French family cookbook hosted at pjpcode.com. The site is built with [Eleventy (11ty)](https://www.11ty.dev/): recipes are authored in Markdown, the three index pages are generated, and everything else (images, PDFs, the original Word-exported HTML still on disk as `RM_recipe_OLD.html` archives, the entry pages) is passed through unchanged. `npm run serve` runs the dev server at `http://localhost:8080`.

The two entry pages (`/index.html` and `pjpcode/indexpjpcode.html`) are
preserved as the original author wrote them — don't restyle them. The
generated content starts at `voici.htm`.

## Site structure and navigation flow

The site has a hand-built navigation hierarchy across three files in `pjpcode/`:

1. `/index.html` — root splash, links into `pjpcode/indexpjpcode.html`.
2. `pjpcode/indexpjpcode.html` — photo of the cooks; the photo links to `voici.htm`.
3. `pjpcode/voici.htm` — the **sommaire**: a numbered list of every recipe with `<a href="…">` links to each recipe's page. Generated from `pjpcode/voici.md` iterating `_data/recipes.js`. Two further index pages (`recettes_alpha.htm`, `recettes_liste_par_numeros.htm`) are generated the same way and live at `pjpcode/` root.

When adding a recipe, append an entry to `_data/recipes.js` (number, verbatim lowercase title, href) and create `pjpcode/recipes/XXXX/recipe.md`. The three index pages regenerate automatically.

## Recipe storage layout

Each recipe lives in `pjpcode/recipes/XXXX/` where `XXXX` is the
four-digit zero-padded recipe number (e.g. `pjpcode/recipes/0001/`,
`pjpcode/recipes/0030/`, `pjpcode/recipes/0253/`). The deployed URL is
`pjpcode.com/recipes/0030/recipe.html` — the `.html` extension is
preserved by `permalink: recipe.html` directory data
(`pjpcode/pjpcode.11tydata.js`). Inside each folder:

- `recipe.md` — **source of truth.** Markdown with front matter
  (`layout: recipe`, `number:`, `title:`, optional `subtitle:`,
  `pdf:`/`docx:`). Built via the `recipe.njk` layout. The conventions:
  `title:` is Title Case (page heading); for placeholder-only recipes
  the body is the explicit `Recette disponible en :` block; no
  `subtitle:` unless intentional.
- `RM_recipe_OLD.html` — the original Word-exported / hand-written
  page archived during migration. Pending deletion (RM_ convention);
  do not edit. Word HTML is fragile (heavy `mso-*` styles,
  `windows-1252` charset, VML imagedata for old IE) — these archives
  preserve it as-is for rollback.
- `recipe.pdf` and/or `recipe.docx` — Word-format copies (recipes 143+
  and a handful of older ones that have both). Linked from the layout
  when `pdf:`/`docx:` front matter is set.
- `image-01.jpg`, `image-02.jpg`, … — recipe images, two-digit
  zero-padded, numbered in the order they appear in the recipe. The
  extension matches the original (`.jpg`, `.png`, `.gif`).

Files at `pjpcode/` root are either generated index pages (`voici.htm`,
`recettes_alpha.htm`, `recettes_liste_par_numeros.htm` — built from
the corresponding `.md` files), entry/static pages
(`indexpjpcode.html`, `lisez moi d'abord.htm`, `nous_deux.jpg`),
the `recipes/` directory, the `orphan/` directory of unattributed
files, or `RM_`-prefixed entries pending deletion — see `tasks.md`
for the inventory.

## Eleventy build

Layout:

```
package.json                  # Eleventy + scripts
.eleventy.js                  # config (input ., output _site)
.eleventyignore
_layouts/
  recipe.njk                  # recipe page template
  page.njk                    # generic page template (sommaire, etc.)
_data/
  recipes.js                  # 253-entry nav-title list (verbatim lowercase
                              #   from the original voici.htm) — drives the
                              #   three index pages
  recipesAlpha.js             # same list, French-collated alphabetically
.github/workflows/deploy.yml  # GitHub Pages deploy via Actions
pjpcode/
  style.css                   # shared stylesheet
  pjpcode.11tydata.js         # directory data: permalink keeps .html URLs flat
  voici.md                    # sommaire (permalink: voici.htm)
  recettes_alpha.md           # alpha index (permalink: recettes_alpha.htm)
  recettes_liste_par_numeros.md
  recipes/XXXX/recipe.md      # one per recipe, all 253
```

Why two title sources: each `recipe.md` has a Title Case `title:`
used as its page heading, while `_data/recipes.js` holds the
**verbatim lowercase** title from the original voici.htm for use in
the sommaire/alpha/numeros lists. They are kept separate
deliberately; do not collapse into one.

**Local commands:**

- `npm install` — once, to install Eleventy.
- `npm run build` — one-shot build to `_site/`.
- `npm run serve` — dev server at `http://localhost:8080`. Live-reloads
  on `.md`/`.njk`/`.css` edits. Absolute paths like `/pjpcode/style.css`
  only resolve when the build output is served as the document root.
- `npm run clean` — delete `_site/`.

**Deploy:** `.github/workflows/deploy.yml` builds on every push to `master`
and publishes `_site/` via GitHub Pages.

## Encoding gotchas

- Most older HTML declares `charset=ISO-8859-1` or `windows-1252` and stores French accents as 8-bit bytes (e.g. `derni�re mise � jour`). These display correctly in browsers but may look like mojibake in editors that auto-detect UTF-8. **Don't blanket-convert files to UTF-8** — you'd also need to update the `<meta charset>` and re-test rendering across every page.
- All filenames in the repo are lowercase. Inside `pjpcode/recipes/XXXX/` folders names are normalized (`recipe.md`, `recipe.{pdf,docx}`, `image-NN.<ext>`, `RM_recipe_OLD.html`), so the old NFC/NFD accent-duplicate problem is mostly gone within recipes — any remaining `RM_`-prefixed files are pending deletion.
- `.gitattributes` enables `* text=auto` LF normalization, which can churn the Word-exported HTML on commit. If you see large whitespace-only diffs, that's why.
