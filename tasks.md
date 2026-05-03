# Tasks / Open Issues

Things noted during cleanup that aren't blocking but should not be forgotten.
Check items off as they're resolved; remove resolved sections when they go stale.

## Next session — pick up here

Recommended order when resuming:

1. **Triage `pjpcode/orphan/`** (Phase 3 leftover). Per-file content
   decisions; see "Orphan files left in place" below for the inventory.
2. **Bulk-delete the `RM_*_OLD` archive** (256 files: 253
   `RM_recipe_OLD.html` + 3 top-level `RM_*_OLD.htm`). Closes
   Checkpoint 3.
3. **Phase 2 hand-polish backlog** — recipes 86, 100, 136, 173, 252,
   plus alt-text restoration on 87, 92, 109, 112, 115, 117, 148. See
   "Phase 2 follow-up" below.
4. **Small loose ends** — `indexpjpcode.html` typography fix
   (`Bienvenue sur le PJP code !` space before `!`), and decommission
   the old VM at `34.73.98.109` once the GitHub Pages deploy is
   trusted.
5. **Phase 4 optional polish** — print stylesheet, schema.org Recipe
   JSON-LD, client-side keyword search, RSS feed. Pure
   would-be-nice work.

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

### Phase 3 — cleanup
- [x] **Final review pass:** all 253 recipes return 200 over the local
  server; 240 image refs resolve, all pdf/docx/css refs resolve, all
  three index pages link to all 253 recipes. Build is clean.
- [x] Renamed every `recipe_OLD.html` → `RM_recipe_OLD.html` (253),
  plus `voici_OLD.htm`, `recettes_alpha_OLD.htm`, and
  `recettes_liste_par_numeros_OLD.htm` to their `RM_*_OLD` form.
  Bulk-delete is the next pass — see below.
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
- [ ] Resolve the orphans in `pjpcode/orphan/`: per-file content
  decisions, not mechanical cleanup. See "Orphan files left in place"
  below for the inventory.
- [ ] Bulk-delete the `RM_recipe_OLD.html` archive (253 files) plus
  the three top-level `RM_*_OLD.htm`. Do this once you're satisfied
  with a final spot-check — any of those URLs is one rename away from
  being live again until then.
- [ ] Once all `RM_` files are gone, drop the `RM_` references from
  this tasks.md.

**✅ Checkpoint 3:** no `_OLD` or `recipe-v2` clutter. Repo is clean. Site
serves the same number of recipe URLs as before, all from `.md` sources.

### Phase 4 — optional polish
- [ ] Print stylesheet (`@media print`) for kitchen-friendly recipes.
- [ ] `schema.org/Recipe` JSON-LD per recipe (good for SEO).
- [ ] Client-side keyword search (replaces the old
  `liste_par_mots_clefs.html` if missed).
- [ ] RSS feed for new recipes.

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

## Reorganization fallout (review this round)

### Files marked `RM_` for deletion
About 50 files were renamed `RM_<original>` instead of being deleted, so you can
review before pulling the trigger. They fall into a few buckets:

- **NFC/NFD duplicate filenames** (same visible name, different Unicode byte
  sequences). Kept one copy as the canonical recipe asset, marked the other
  `RM_`. Examples: `velouté_champignons.html`, `huîtres_farcies_bretonne.htm`,
  `gelée_mures_manémeur.html`, the cooking-process JPGs (`1_pétrissant_pâte.jpg`,
  `2_applatissant_pâte.jpg`, etc.).
- **Word "Copie de" backups**: `RM_copie de anzac.html`,
  `RM_copie de confiture_figues_citron_vanille.html`.
- **Word `_fichiers/` sidecar artifacts** (filelist.xml, content-duplicate JPGs):
  `boeuf_en_croute_de_sel_fichiers/RM_filelist.xml`,
  `glace_chocolat_blanc_fichiers/RM_filelist.xml`,
  `coque_aux_pates_fichiers/RM_caramel_tupperware*.jpg`.
- **Leftover content-duplicate recipe files** in the original `NN/recette NN/`
  folders that got moved into `0NNN/` but the duplicate at the original
  location wasn't caught: `160/recette 160/RM_oeufs_cocotte_champignons.html`,
  `213/recette 213/RM_velouté_fèves..._b.html`,
  `236/recette 236/RM_cookies_flocons_samuel_luke.html`,
  `241/recette 241/RM_confiture_pommes_poires_cassis.html`. After deleting,
  `rmdir` the empty `NN/recette NN/` parent dirs.
- **Orphan recipe HTMLs** (no recipe number we could resolve them to, OR
  conflicting with a canonical) e.g.:
  `RM_rôti_de_boeuf_du_chef_michel_pioger.html`,
  `RM_pommes_de_terre_rôties_du_chef_michel_pioger.html`,
  `RM_potage_pékino_tico.html`.
- **Other**: `RM_récipients_et_unités.doc`, `RM_ls` (a stray bash output),
  `RM_236/recette 236/ultimate pjp code.html` (a stray page that landed in
  recipe 236's folder but isn't recipe 236).
- **Phase 2 migration leftovers** (12 files inside `recipes/`):
  - `recipes/0001/RM_recipe-v2.md` — original Bucket B prototype, superseded
    by the new canonical `recipe.md`. Safe to delete.
  - `recipes/0060/RM_recipe.md.pilot{1,2,3}`, same for `0080/` and `0137/`
    (9 files total) — pilot iterations of the Bucket C converter while
    tuning section-detection / fuzzy title-match. Safe to delete.
  - `recipes/0086/RM_recipe.md.bucket-c-stray` and
    `recipes/0138/RM_recipe.md.bucket-c-stray` (2 files) —
    auto-conversions of these Bucket D recipes that were superseded
    by promoting the hand-polished `recipe-v2.md` prototypes. Kept
    as alternates in case you ever want to compare the auto vs
    polished output. Safe to delete once the prototypes are confirmed
    canonical.
- **Phase 3 archive** (256 files): every `RM_recipe_OLD.html`
  (253 inside `pjpcode/recipes/XXXX/`) plus `RM_voici_OLD.htm`,
  `RM_recettes_alpha_OLD.htm`, `RM_recettes_liste_par_numeros_OLD.htm`
  at `pjpcode/` root. Each is the original Word-exported / hand-built
  page preserved as a one-rename rollback safety net. Delete in a
  single pass when the new `.md` site has been spot-checked enough.

### Orphan files left in place (need a decision)
These files weren't moved into a `XXXX/` recipe folder because we couldn't
attribute them to a numbered recipe. Decide per file: assign to a recipe,
mark `RM_`, or keep where they are.

- HTMLs with self-declared numbers that conflict with the voici-canonical
  recipe (i.e. another file already owns that number):
  `carottes_blanquette.html` (claims 212),
  `lamelles_boeuf_aux_deux_poivrons.html` (claims 94),
  `soupe_faite_avec_des_restes.htm` (claims 96),
  `huitres_farcies_bretonne.htm` (claims 67).
- HTMLs with no clear recipe number: `commentaires_pierre.html` (closing
  commentary, intentionally orphan).
- Chef Pioger pages — kept as self-contained orphan folders under `orphan/`
  per your direction. Nothing currently links to them.
- Sidecar leftover: `coque_aux_pates_fichiers/` (only RM_ files inside now).
- Loose JPGs not referenced by any recipe HTML: `1_avant_cuisson.jpg`,
  `2_après_avoir_fait_dorer.jpg`, `3_sur_lit_de_sel.jpg`, `5_sortant_du_four.jpg`,
  `7_cassons_la_croûte.jpg`, `8_après_enlèvement_du_sel.jpg`, `38.jpg`, `40.jpg`,
  `41.jpg`, `42.jpg`, `2008 01 13 (8).jpg`, `confiture_de_raisin_de_kermorvan.jpg`,
  `far1.jpg`, `far2.jpg`, `img_1567.jpg`, `img_1570.jpg`, `omelette_nepita.jpg`,
  `lamelles_boeuf_poivrons.jpg`.
- Utility files: `four_mesures_us_&_eu.pdf`, `thermostat.xls`,
  `weights_and_measures.xls`.

### Special judgment calls
- **Recipe 236** (cookies): two HTMLs in the folder. Picked
  `cookies_flocons_samuel_luke.html` as the canonical, marked the other
  (`ultimate pjp code.html`) `RM_` — it appears to be a stray copy of the
  index page that ended up there.
- **Recipe 138** (boeuf en croûte de sel): the original HTML referenced
  `image002.jpg` only via Word's VML imagedata (the modern-browser fallback
  `<img>` tags accidentally skipped it). The image is now `0138/image-07.jpg`
  and the VML reference points at it.
- **Shared images**: `creme_chicons_isabelle_photo.jpg` was used by both
  recipes 88 and 230, so it was copied into each folder as `image-01.jpg`.
  Same for `recettes_auvergnates.jpg` (recipes 226 and 227).
- **Pre-existing broken refs left alone** (visible in 3 recipe HTMLs):
  `0014/recipe.html` references `glace_fromage_blanc_vanille.jpg` (the actual
  file is `gl ace_fromage_blanc_vanille.jpg` with a space — a typo in the
  original HTML); `0133/recipe.html` and `0138/recipe.html` reference
  `<sidecar>/filelist.xml` (a Word-only artifact, doesn't affect rendering).

## Site graph / navigation

- [ ] Wire up the orphan navigation indexes that nothing currently links to:
  `pjpcode/recettes_alpha.htm` (mostly references dead absolute paths from a
  Word export) and `pjpcode/recettes_liste_par_numeros.htm` (links exclusively
  to the old `f6fqx.free.fr/pjpcode/...` host). Both need to be regenerated
  from `voici.htm` against the new `0XXX/recipe.html` paths to be useful.
- [ ] Decide whether the chef Pioger pages (now under `orphan/`) belong in
  `voici.htm`'s numbered list, or stay orphaned.

## Missing content

- [ ] Recipe #131 — *glace à la vanille, au yaourt et aux éclats de chocolat,
  comme l'adoraient les dinosaures de Malansac* — was never digitized. There's
  now a placeholder `0131/recipe.html` with the dinosaure image as
  `image-01.jpg`. If the real recipe resurfaces, drop it in.
- [ ] Recipes 14, 58, 59, 95, 143, 204, 221, 237, 251 also got placeholder
  `recipe.html` files because they had only PDF/DOCX or only an image in
  the original layout. The placeholders link to the PDF/DOCX or display the
  image; replace with proper HTML when convenient.

## Cosmetic

- [ ] `indexpjpcode.html` once read `Bienvenue sur le PJP code !` (space
  before `!`, proper French typography); the local copy is `code!`. Restore
  the space to match the original if desired.

## Infrastructure

- [ ] Take down the old VM at `34.73.98.109` once satisfied with the new
  deploy.
