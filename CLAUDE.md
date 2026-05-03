# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A static website serving the **PJP code**, a French family cookbook hosted at pjpcode.com. There is no build system, no package manager, no tests, no linter — just HTML, images, and Office documents served as files. To preview, open `index.html` in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server` from the repo root).

## Site structure and navigation flow

The site has a hand-built navigation hierarchy across three files in `pjpcode/`:

1. `/index.html` — root splash, links into `pjpcode/indexpjpcode.html`.
2. `pjpcode/indexpjpcode.html` — photo of the cooks; the photo links to `voici.htm`.
3. `pjpcode/voici.htm` — the **sommaire**: a numbered list of every recipe with `<a href="…">` links to each recipe's HTML file. This is the primary index. It also links to:
   - `recettes_alpha.htm` — alphabetical list
   - `recettes_liste_par_numeros.htm` — numeric list
   - `liste_par_mots_clefs.html` — keyword list

When adding a recipe, **all four index pages** (`voici.htm`, `recettes_alpha.htm`, `recettes_liste_par_numeros.htm`, `liste_par_mots_clefs.html`) need to be updated by hand — there is no generator.

## Two generations of recipe storage

Older recipes (numbers ≲ 142) are individual HTML files directly under `pjpcode/`, e.g. `pjpcode/financiers.html`, `pjpcode/gigot_de_7_heures.html`. These come in two flavors:
- **Word-exported HTML** (most of them) — heavy `mso-*` styles, `windows-1252` charset, `<u1:p>` and `<o:p>` tags. Don't try to clean these up; they render fine and the whitespace/markup is fragile.
- **Image-only pages** — the HTML body is just one `<img>` pointing at a scan of a handwritten recipe (e.g. `financiers.html` → `financiers.jpg`).

Newer recipes (143 and up) are stored as `pjpcode/<num>/recette <num>/recette n° <num>.{docx,pdf}` — no HTML wrapper, just the Office files. When writing links to new-format recipes, link directly to the PDF.

Some recipes also have a `*_fichiers/` companion folder (e.g. `boeuf_en_croute_de_sel_fichiers/`) — this is Word's standard "saved-as-HTML" sidecar with `filelist.xml`, images, and CSS. Keep these alongside their parent HTML.

## Encoding gotchas

- Most older HTML declares `charset=ISO-8859-1` or `windows-1252` and stores French accents as 8-bit bytes (e.g. `derni�re mise � jour`). These display correctly in browsers but may look like mojibake in editors that auto-detect UTF-8. **Don't blanket-convert files to UTF-8** — you'd also need to update the `<meta charset>` and re-test rendering across every page.
- Filenames mix accented (`pétrissant_pâte`) and unaccented forms, sometimes for the same image — this is the "doubles" referenced in the latest commit. Don't dedupe without checking which filename the HTML references.
- `.gitattributes` enables `* text=auto` LF normalization, which can churn the Word-exported HTML on commit. If you see large whitespace-only diffs, that's why.
