# Tasks / Open Issues

Things noted during cleanup that aren't blocking but should not be forgotten.
Check items off as they're resolved; remove resolved sections when they go stale.

## Next session — pick up here

Recommended order when resuming:

1. **DOCX-placeholder conversion** (recipes 143, 221, 237, 251)
   — pandoc each `recipe.docx` → markdown, replace the "Recette
   disponible en :" placeholder body. Same pipeline as the
   Bucket E pass. See "Phase 2 follow-up".
2. **Quick typo fixes** (recipes 95, 249, 250, 254) — mechanical
   edits, plus the recipe 254 vegetarian-or-veal-side judgment
   call. See "Phase 2 follow-up".
3. **Formatting cleanup** (recipes 86, 100, 136, 252) — Word-table
   HTML, footnote styles, crunched ingredients, subtitle convention
   call. See "Phase 2 follow-up".
4. **Image work** (recipe 173 image repositioning + alt-text on
   87, 92, 109, 112, 115, 117, 148) — see "Phase 2 follow-up".
5. **Image-only placeholder transcription** (recipes 14, 58, 59)
   — handwritten manuscript scans, no Word/PDF source. Try gemini
   vision mode to transcribe; verify line by line. Higher risk;
   may stay placeholder if accuracy is poor. See "Phase 2 follow-up".
6. **Files index descriptions** (`pjpcode/files/list.md`) — verify
   guesses against actual file contents. See "Phase 2 follow-up".
7. **Typography fix** — `indexpjpcode.html` non-breaking space
   before `!` in `Bienvenue sur le PJP code!`. See "Cosmetic".
8. **Old VM decommission** — take down `34.73.98.109` once the
   GitHub Pages deploy is fully trusted. See "Infrastructure".
9. **Phase 4 optional polish** — print stylesheet, schema.org
   Recipe JSON-LD, client-side keyword search, RSS feed. See
   "Phase 4 — optional polish".

## Remodel plan (Eleventy migration)

The dev branch shipped a working Eleventy prototype: shared template +
CSS in `_layouts/` and `pjpcode/style.css`, four sample recipes
(`0001`, `0086`, `0138`, `0143`) converted to `recipe-v2.md` alongside
their originals, a regenerated sommaire at `voici-v2.html`, and a
GitHub Actions deploy workflow. Production deploys verified.

**Out of scope (preserved as the original author intended):**
`index.html` (root splash), `pjpcode/indexpjpcode.html` (welcome with
the cooks' photo), `pjpcode/nous_deux.jpg`, `pjpcode/lisez moi d'abord.htm`.
Remodel starts at `voici` and goes deeper.

### Always — how to serve and inspect locally

```bash
npm install      # once (pulls Eleventy if node_modules is missing)
npm run serve    # http://localhost:8080  — live-reloads on .md/.njk/.css edits
npm run build    # one-shot build to _site/
npm run clean    # delete _site/
```

`npm run serve` is the canonical way to look at the prototype during
work. Open `http://localhost:8080/pjpcode/voici.htm` (or `voici-v2.html`
during the migration) and click around. Every checkpoint below assumes
you have it running in another terminal.

### Safety net: archive the old HTML before replacing

Each `recipe.html` we replace gets renamed to `recipe_OLD.html` *first*,
**then** we add `recipe.md`. Reason: if a conversion goes catastrophically
wrong, the original page is one `git mv recipe_OLD.html recipe.html` away
from being restored. The `_OLD.html` files stay served (Eleventy
passthrough-copies them), so you can always compare side-by-side at
`/recipes/0086/recipe_OLD.html` vs `/recipes/0086/recipe.html`.

Phase 3 deletes the `_OLD.html` archive once you're satisfied.

### Phase 0 — decisions to lock in
- [x] **URL strategy for the sommaire:** keep generated content at
  `pjpcode/voici.htm` via `permalink: voici.htm` in front matter
  (preserves all incoming links). Original archived as `voici_OLD.htm`
  during the migration, deleted in Phase 3.
- [x] **`recettes_alpha.htm` and `recettes_liste_par_numeros.htm`:**
  regenerate from the same recipes collection that drives voici
  (alphabetical and numeric views).
- [x] **`recipe-v2.md` files:** delete each one as the corresponding
  canonical `recipe.md` lands in Phase 2. The `recipe_OLD.html` archive
  is the real safety net.

**✅ Checkpoint 0:** decisions captured, ready to start.

### Phase 1 — sommaire and data layer
- [x] Replaced the 4-recipe `_data/recipes.js` seed with the full
  253-entry list extracted from `voici.htm` (one-time pass with
  `/tmp/extract_recipes.py`; can be re-run if needed). All hrefs
  normalized to `/pjpcode/recipes/XXXX/recipe.html`. The migration to a
  proper Eleventy *collection* (driven by recipe.md front matter)
  happens incrementally during Phase 2 — entries here will be removed
  or replaced as each `recipe.md` lands. See Phase 3 cleanup.
- [x] Renamed existing `voici.htm` → `voici_OLD.htm` (safety archive).
- [x] Added `pjpcode/voici.md` with `permalink: /pjpcode/voici.htm`,
  iterating the recipes data into the same numbered sommaire layout.
- [x] Regenerated `recettes_alpha.htm` and
  `recettes_liste_par_numeros.htm` from the same data (originals
  archived as `_OLD.htm`). Alpha view sorts via `Intl.Collator('fr')`
  in `_data/recipesAlpha.js` so French accents collate correctly.
- [x] Updated `_layouts/recipe.njk` back-link from `voici-v2.html` to
  `voici.htm`.
- [x] Deleted `voici-v2.md` (replaced by canonical `voici.md`).

**✅ Checkpoint 1:** in `npm run serve`, hit
`http://localhost:8080/pjpcode/voici.htm` — see the new sommaire with all
253 numbered links. Every link should resolve (most still go to the old
`recipe.html` files; that's fine until Phase 2 converts them).
`http://localhost:8080/pjpcode/voici_OLD.htm` should still serve the
original sommaire as a safety net.

### Phase 2 — recipe conversion (batches of ~25)

**Process per recipe:**
1. Pandoc the source: prefer `docx → md` when a `.docx` exists, fall
   back to `html → md`.
2. Hand-edit the `.md`: title, subtitle, paragraph breaks, image
   placement, smart quotes, fix any conversion artifacts.
3. **Rename `recipe.html` → `recipe_OLD.html`** (do not delete; this is
   the rollback safety net).
4. With `npm run serve` running, open the new page in the browser and
   check it renders correctly. Compare against
   `/recipes/0NNN/recipe_OLD.html` to confirm nothing was lost.
5. Commit the batch with a clear message.

Buckets to convert in roughly this order (easy → hard):

- [x] **Bucket A — placeholders** (9 recipes: 14, 58, 59, 95, 131,
  143, 204, 221, 237). Pattern prototyped on `0143`. Trivial.
  Note: 251 was originally listed in Bucket A but its `recipe.html`
  contains real Word HTML (~10 KB) — moved to Bucket E.
  Side effect: recipe 14's pre-existing broken image ref
  (`glace_fromage_blanc_vanille.jpg` typo) is fixed by the new
  `image-01.jpg` reference.
  - [x] **✅ Checkpoint 2A:** all 9 placeholders render at canonical
    URLs; old pages preserved at `_OLD.html`. PDF/Word download links
    appear automatically via the layout when `pdf:`/`docx:` set in
    front matter.
- [x] **Bucket B — image-only handwritten** (63 recipes: 1–13, 15–34,
  36–57, 87, 92, 109, 112, 115, 117, 148; recipe 35 also). Pattern
  prototyped on `0001`. Mechanical batch driven by
  `/tmp/convert_bucket_b.py` (kept around in case re-run is needed).
  Recipe 35 special-cased to preserve "honorable mention" prose. Each
  image gets descriptive alt text. The prototype `0001/recipe-v2.md`
  is marked `RM_recipe-v2.md` for review.
  - [x] **✅ Checkpoint 2B:** spot-checked 1, 9, 35, 50, 117 — all
    images appear with alt text; multi-image recipes (3 imgs) render
    correctly; recipe 35's prose appears below the images.
- [x] **Bucket C — Word HTML, simple prose** (156 recipes). Driven by
  `/tmp/convert_bucket_c.py` (kept around for re-runs). Pandoc
  `html-native_divs-native_spans → gfm` plus post-processing:
  - Drops leading "Recette n°XX" + duplicate-title lines
    (SequenceMatcher fuzzy-match against the data title).
  - Converts `**Section :**` / `<u>Section :</u>` lines to `## Heading`
    for French (Ingrédients, Préparation, Observations, Variantes,
    Notes, Remarques, Suggestions, Conservation, Présentation,
    Service, Cuisson, Sauce, Astuce, Recommandation), Spanish
    (Ingredientes, Preparación, Observaciones, Notas), and English
    (Ingredients, Preparation).
  - Strips stylistic raw-HTML wrappers pandoc left as-is (`<u>`,
    `<b>`, `<i>`, `<em>`, `<strong>`, `<big>`, `<small>`, `<font>`).
  - Converts raw `<img …>` to `![](src)` and ensures standalone-image
    lines are paragraph-separated.
  - Recipe **136** has Word footnote anchors (`<a href="#_ftn1"
    style="mso-…">[1]</a>`) preserved as raw HTML — functional but
    cosmetically noisy; user can polish.
  - [x] **✅ Checkpoint 2C:** spot-checked 60, 80, 105, 137, 162,
    184, 199, 211, 222, 246. Headings, ingredient bullets, image
    placement, French/English/Spanish all OK. Build clean.
- [x] **Bucket D — Word HTML with multiple images / sidecars / VML**
  (8 recipes: 62, 66, 84, 86, 100, 138, 173, 239). Final composition
  was much smaller than the original ~30 estimate — most recipes that
  could have been here were sidecar-free in practice.
  - **86 and 138** have hand-polished `recipe-v2.md` prototypes that
    were promoted to canonical `recipe.md` (image placement, tone,
    sub-titling all preserved as the user originally crafted them).
    **Note:** 86's prototype uses `subtitle: Recette de mon ami Kurt
    de Dresde` and a shortened `title:` — this departs from the
    "verbatim title, no subtitle" convention adopted later for
    placeholders. Left as-is intentionally; adjust if desired.
  - **62, 66, 84, 100, 173, 239** were converted by the Bucket C
    auto-converter. Image placement reflects where pandoc emitted
    them, not where they belong semantically — user touch-up may be
    needed (especially 173 with 10 images).
  - **Recipe 100** ships with three nested layout `<table>` blocks
    that pandoc preserved as raw HTML (Word used tables for
    image-left/text-right layout). Functional in the browser but the
    `.md` source is messy — flag for cleanup.
  - [x] **✅ Checkpoint 2D:** spot-checked 86, 138, 100, 173. 86 and
    138 render perfectly (prototypes). 100 has table HTML that
    renders but isn't ideal. 173 has all 10 images, mostly between
    sections.
- [x] **Bucket E — recipes with both HTML and PDF/DOCX** (17 recipes:
  155, 160, 195, 213, 223, 225, 230, 235, 236, 241, 247, 248, 249,
  250, 251, 252, 253). The original list also included 95, 143, 204,
  221, 237 but those were handled in Bucket A as placeholders (the
  user's preferred pattern: explicit "Recette disponible en :" body,
  no extracted .docx content).
  - Converted via `convert_bucket_c.py --docx --force` (the `.docx`
    output was indeed cleaner than the `.html` for these — at least
    no `--\>·` Word-tab artifacts that the html had).
  - Pandoc emitted image refs as `media/imageN.<ext>` for 7 recipes
    (223, 225, 230, 235, 236, 241, 247). Fixed by
    `/tmp/fix_media_refs.py` (rewrites to actual `image-NN.<ext>` on
    disk).
  - **Recipe 252** (Gigot de 7 heures, the largest at 22 KB source)
    has the ingredients list crunched onto one line — both the html
    and docx pandoc outputs were messy here. Flag for hand-cleanup.
  - No PDF/Word download links are added by the converter — per the
    Phase-A user-edit pattern, those go in the body explicitly when
    desired. The .pdf and .docx files still passthrough at the
    canonical URLs.
  - [x] **✅ Checkpoint 2E:** spot-checked 155, 247, 251, 252. Image
    refs now resolve. Content matches the .docx source.

**✅ Checkpoint 2 (overall):** all 253 recipes converted to `.md`.
`recipe.html` files all renamed to `recipe_OLD.html`. `npm run serve`
shows new pages at canonical URLs; old pages still accessible at `_OLD`
URLs. `voici.htm` lists everything. Build clean: 257 written + 593
passthrough = 850 files total.

### Phase 2 follow-up — per-recipe hand-polish

These are non-blocking quality issues found during Phase 2 conversion.
Each one can be fixed in isolation by editing the corresponding
`recipe.md`. None of them block Phase 3 cleanup.

- [ ] **Placeholder DOCX recipes** (`recipes/0143/`, `0221/`, `0237/`,
  `0251/`) — each has `recipe.docx` + `recipe.pdf` but `recipe.md`
  is just the "Recette disponible en :" stub. Convert per recipe:
  ```
  pandoc recipes/0NNN/recipe.docx -f docx -t gfm \
      --wrap=none -o /tmp/recipe-NNN.md
  ```
  Then hand-polish (drop "Recette n°NNN" prefix lines, normalize
  section headings to `## Ingrédients` / `## Préparation` /
  `## Observations`, verify image refs), and replace the placeholder
  body. Keep `pdf: true, docx: true` in front matter so the layout
  still offers downloads. Pattern matches recipe 95's promotion
  earlier.
- [ ] **Image-only placeholder recipes** (`recipes/0014/`, `0058/`,
  `0059/`) — handwritten manuscript scans, no Word/PDF source. Try
  gemini vision mode to transcribe:
  ```
  gemini -p "Transcribe this French recipe (handwritten) line by
  line, preserving structure." pjpcode/recipes/0014/image-01.jpg
  ```
  (CLI flag for the image attachment depends on the gemini version.)
  Verify each line by hand against the image — French handwriting
  is hard. If accuracy is poor, leave as image-only placeholder.
  Recipe 131 is irrecoverable (never digitized, no source at all).
- [ ] **Recipe 86** (`recipes/0086/recipe.md`) — uses `subtitle:
  Recette de mon ami Kurt de Dresde` and a shortened `title: Soupe à
  l'ail et aux pommes de terre` (the original prototype). This
  departs from the "verbatim title from `_data/recipes.js`, no
  subtitle" convention adopted later. Decide: keep the stylized
  prototype, or align with the convention.
- [ ] **Recipe 100** (`recipes/0100/recipe.md`) — pandoc preserved
  three nested layout `<table>` blocks (Word used tables for
  image-left/text-right layout). Renders OK in the browser but the
  `.md` source is messy. Replace tables with plain prose + image
  references, or convert to a cleaner two-column markdown construct.
- [ ] **Recipe 136** (`recipes/0136/recipe.md`) — Word footnote
  anchors `<a href="#_ftn1" id="_ftnref1" style="mso-footnote-id:
  ftn1">[1]</a>` preserved as raw HTML. Functional (anchors work)
  but ugly. Either strip the `style="mso-…"` attrs, or convert to
  proper markdown footnotes (`[^1]` syntax).
- [ ] **Recipe 173** (`recipes/0173/recipe.md`) — 10 images
  interleaved between sections; pandoc placed them where Word had
  them, which may not be where they belong semantically. Walk
  through and reposition as needed.
- [ ] **Recipe 252** (`recipes/0252/recipe.md`, "Gigot de 7 heures",
  the largest source at 22 KB) — the ingredients list is crunched
  onto one continuous line because both the .docx and .html pandoc
  outputs were messy. Break out into a proper bulleted list by
  hand. Also the "Gigot de sept heures (qui ne cuit que cinq
  heures)" duplicate-title line at the top can be dropped.
- [ ] **Recipes 87, 92, 109, 112, 115, 117, 148** (image-only
  Bucket B recipes that got re-processed by the Bucket C pass and
  lost their descriptive image alt-text). Re-add alt text like
  `![<Title> — recette manuscrite](image-01.jpg)` if accessibility
  matters. Functionally fine without it.
- [ ] **Files index descriptions** (`pjpcode/files/list.md`) — descriptions
  for the 4 utility files were guessed from filenames; verify each
  matches the actual file contents and edit. Also flag: filename
  `récipients_et_unités.doc` keeps its accents (URL-encoded as
  `%C3%A9.../%C3%A9...` in the link). Eventually consider renaming to
  ASCII (`recipients_et_unites.doc`) for cleaner URLs.
- [ ] **Recipes 249 & 250** (`recipes/0249/recipe.md` & `recipes/0250/recipe.md`,
  Chef Michel Pioger's rôti de boeuf and pommes de terre rôties) — recovered
  6 cooking-process photos for 249 and 4 for 250 from the Chef Pioger
  orphan folders, and rewrote both recipes with proper markdown formatting
  (the Bucket E docx-extracted versions had a stray `**`, missing list
  markers, gappy ingredient numbering 1/2/3/5/6). Pre-existing typos
  preserved in 250: `huille` → `huile` (prep step 5), `2 à 3 mois maximum`
  → `2 à 3 fois maximum` (prep step 7 — clearly meant "times" not "months"),
  `avantege` → `avantage` (Observations 3), `le pommes de terre` → `les`
  (prep step 1). Also note: the pdt photos were originally labelled
  pdt_roties_1/2/4/6 (gaps); renumbered sequentially as image-01..04.
- [ ] **Recipe 95** (`recipes/0095/recipe.md`, "Lamelles de bœuf
  aux deux poivrons") — promoted from a PDF/DOCX-only placeholder
  to a full recipe by recovering `pjpcode/orphan/lamelles_boeuf_aux_deux_poivrons.html`
  (whose body header still said "Recette n°94" — an old number from
  before PJP renumbered). Source has a few typos to fix: "huille"
  → "huile" (ingredients), "minuetes" → "minutes" and "reemuant"
  → "remuant" (préparation, sauté step). Also "ail" appears in the
  préparation but not in the ingredients list — decide whether to
  add a clove or two to the ingredients, or drop the mention from
  prep.
- [ ] **Recipe 254** (`recipes/0254/recipe.md`, "Carottes façon
  blanquette de veau, mais sans veau") — rescued from
  `pjpcode/orphan/carottes_blanquette.html` (which self-declared
  recipe 212, conflicting with voici-canonical 212). The body is
  half-converted: ingredients are vegetarian, but préparation
  steps 4–7 still reference *le veau* (PJP appears to have
  copy-pasted from a veal recipe and not finished the edit).
  Likely originally a side dish meant to *accompany* veal. Decide
  the intent (vegetarian carrot blanquette, or veal-accompaniment),
  rewrite the prep accordingly, and fix the typo "carottres" →
  "carottes" in step 3. The "Observations" note ("préparée le 15
  novembre 2008 à Quiberon… tous ont trouvé ce plat excellent")
  confirms the dish was made and worked — the writeup just needs
  finishing.

### Phase 3 — cleanup
- [x] **Final review pass:** all 253 recipes return 200 over the local
  server; 240 image refs resolve, all pdf/docx/css refs resolve, all
  three index pages link to all 253 recipes. Build is clean.
- [x] Renamed every `recipe_OLD.html` → `RM_recipe_OLD.html` (253),
  plus `voici_OLD.htm`, `recettes_alpha_OLD.htm`, and
  `recettes_liste_par_numeros_OLD.htm` to their `RM_*_OLD` form,
  then bulk-deleted the entire `RM_*` archive in one pass.
- [x] `recipe-v2.md` and `voici-v2.md` already deleted in earlier
  Phase 2 work — none remain on disk.
- [x] Decision on `_data/recipes.js`: **kept** as the hand-curated
  nav-title list. Header comment updated to explain why. Switching to
  an Eleventy collection driven by recipe.md front matter would either
  change every visible sommaire title (the recipe.md `title:` is Title
  Case for the page heading; recipes.js holds the verbatim lowercase
  voici.htm originals) or require touching all 253 recipe.md files to
  add a separate nav field. Not worth the churn.
- [x] `CLAUDE.md` updated: Markdown is now source of truth, Eleventy
  is the default workflow, the verbatim-vs-Title-Case title split is
  documented, the Eleventy section was renamed from "prototype" to
  "build".
- [x] Resolved the orphans in `pjpcode/orphan/`: triaged file by
  file. Some promoted to new/existing recipe folders (95, 167, 204,
  249, 250, 254), one promoted to `pjpcode/commentaires/pierre.md`,
  utility files moved to `pjpcode/files/` with an index page; the
  rest were `RM_`'d as duplicates or unattributed.
- [x] Bulk-deleted every `RM_*` file under `pjpcode/` in one pass
  (`find pjpcode/pjpcode -name 'RM_*' -type f -delete`, 286 files).
  Source tree and `_site/` both confirmed at zero `RM_*`.

**✅ Checkpoint 3:** no `_OLD` or `recipe-v2` clutter. Repo is clean. Site
serves the same number of recipe URLs as before, all from `.md` sources.

### Phase 4 — optional polish
- [ ] Print stylesheet (`@media print`) for kitchen-friendly recipes.
- [ ] `schema.org/Recipe` JSON-LD per recipe (good for SEO).
- [ ] Client-side keyword search (replaces the old
  `liste_par_mots_clefs.html` if missed).
- [ ] RSS feed for new recipes.
- [x] **Photo gallery** at `/pjpcode/photos.htm` — every recipe image
  on one page, click-through to the recipe. Linked from `voici.htm`.
  Implemented via `_data/photos.js` (build-time scan of
  `pjpcode/recipes/*/image-*`) + `pjpcode/photos.md` + a `.photo-grid`
  block in `style.css`. Order is randomized client-side via a small
  inline Fisher-Yates shuffle in `photos.md`. Possible future tweaks:
  tile size (currently `minmax(160px, 1fr)`), or filtering by recipe
  number range.

### Useful commands

```bash
# Convert a Word docx to clean Markdown (preferred when available)
pandoc pjpcode/recipes/0143/recipe.docx -o pjpcode/recipes/0143/recipe.md \
       --extract-media=pjpcode/recipes/0143/

# Convert Word-exported HTML to Markdown (when no .docx)
pandoc pjpcode/recipes/0086/recipe.html -f html -t markdown_strict \
       --strip-comments --wrap=none -o pjpcode/recipes/0086/recipe.md

# Archive the old HTML before adding the new .md
git mv pjpcode/recipes/0086/recipe.html pjpcode/recipes/0086/recipe_OLD.html

# Restore from archive if a conversion is bad
git mv pjpcode/recipes/0086/recipe_OLD.html pjpcode/recipes/0086/recipe.html
rm    pjpcode/recipes/0086/recipe.md
```

## Missing content

- [ ] Recipe #131 — *glace à la vanille, au yaourt et aux éclats de chocolat,
  comme l'adoraient les dinosaures de Malansac* — was never digitized. There's
  now a placeholder `0131/recipe.html` with the dinosaure image as
  `image-01.jpg`. If the real recipe resurfaces, drop it in.
- [ ] Recipes 14, 58, 59, 143, 221, 237, 251 are still placeholder
  `recipe.md` files because they had only PDF/DOCX or only an image
  in the original layout. The placeholders link to the PDF/DOCX or
  display the image; replace with proper Markdown when convenient.
  (95 and 204 were promoted to full recipes during the orphan triage.)

## Cosmetic

- [ ] `indexpjpcode.html` once read `Bienvenue sur le PJP code !` (space
  before `!`, proper French typography); the local copy is `code!`. Restore
  the space to match the original if desired. **Conflict flag:** the
  "don't restyle the entry pages" rule covers `indexpjpcode.html` —
  confirm with the user before touching, since this is technically a
  text edit on a preserved page (small, one-character, and arguably a
  restoration not a restyle, but worth checking).

## Infrastructure

- [ ] Take down the old VM at `34.73.98.109` once satisfied with the new
  deploy.
