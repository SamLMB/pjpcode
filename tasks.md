# Tasks / Open Issues

Things noted during cleanup that aren't blocking but should not be forgotten.
Check items off as they're resolved; remove resolved sections when they go stale.

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
- [ ] **URL strategy for the sommaire:** keep generated content at
  `pjpcode/voici.htm` (preserves all incoming links — `permalink: voici.htm`
  in the front matter) or move to `voici.html` with a tiny redirect at
  the old URL. Default plan: keep `voici.htm`.
- [ ] **`recettes_alpha.htm` and `recettes_liste_par_numeros.htm`:**
  regenerate from the same data source (alphabetical and numeric views
  of the same recipe list) or delete them. They're orphans now anyway.
- [ ] **`recipe-v2.md` files:** delete after the corresponding full
  `recipe.md` lands, or keep as before/after artifacts for a while.

**✅ Checkpoint 0:** decisions captured, ready to start.

### Phase 1 — sommaire and data layer
- [ ] Switch `_data/recipes.js` from a hand-curated 4-recipe seed to
  Eleventy *collections*: each `recipe.md` declares its own `number`,
  `title`, `subtitle?`, `images?`, etc. in front matter; voici iterates
  the `recipes` collection sorted by number. This makes adding a recipe
  a single-file change.
- [ ] Rename existing `voici.htm` → `voici_OLD.htm` (safety archive).
- [ ] Add `voici.md` (or `voici.htm.md` with explicit permalink) that
  generates the new sommaire content at the canonical URL.
- [ ] Optionally regenerate the alphabetical and numeric indexes
  (similar pattern: rename old `.htm` to `_OLD.htm`, add `.md`).
- [ ] Delete `voici-v2.md` (replaced by the canonical voici).

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

- [ ] **Bucket A — placeholders** (~10 recipes: 14, 58, 59, 95, 131,
  143, 204, 221, 237, 251, plus any others that have only PDF/DOCX or
  only an image). Pattern prototyped on `0143`. Trivial.
  - **✅ Checkpoint 2A:** all 10 placeholders render. Spot-check 2–3.
- [ ] **Bucket B — image-only handwritten** (~30–40 recipes, mostly
  numbers 1–44). Each is just title + `![](image-01.jpg)`. Pattern
  prototyped on `0001`. Mechanical batch.
  - **✅ Checkpoint 2B:** images appear, scaled correctly; spot-check 5
    across the bucket including any with multiple images.
- [ ] **Bucket C — Word HTML, simple prose** (~100 recipes). Pandoc
  html→md per file, light hand-edit. Pattern prototyped on `0086`.
  - **✅ Checkpoint 2C:** spot-check 10 across the bucket. Watch for
    accent issues (windows-1252 → utf-8 conversion artifacts), broken
    inter-recipe references, missing observations sections.
- [ ] **Bucket D — Word HTML with multiple images / sidecars / VML**
  (~30 recipes including 138, 133, 86, etc.). Same as C but more
  careful image placement. Pattern prototyped on `0138`.
  - **✅ Checkpoint 2D:** spot-check 5 — confirm all images appear in
    the right places, sidecar refs (`*_fichiers/...`) all rewritten.
- [ ] **Bucket E — recipes with both HTML and PDF/DOCX** (~22 recipes
  in 0143, 0155, 0195, 0204, 0213, 0221, 0223, 0225, 0230, 0235, 0236,
  0237, 0241, 0247, 0248, 0249, 0250, 0251, 0252, 0253, 0095, 0160).
  Prefer pandoc on the `.docx` over the html — output is much cleaner.
  - **✅ Checkpoint 2E:** PDF + DOCX download links still work; rendered
    HTML matches the docx content.

**✅ Checkpoint 2 (overall):** all 253 recipes converted to `.md`.
`recipe.html` files all renamed to `recipe_OLD.html`. `npm run serve`
shows new pages at canonical URLs; old pages still accessible at `_OLD`
URLs. `voici.htm` lists everything.

### Phase 3 — cleanup
- [ ] **Final review pass:** click through the whole sommaire, check
  every recipe renders. If anything looks broken, fix before deleting
  the archive.
- [ ] Delete every `recipe_OLD.html` and `voici_OLD.htm` (the safety
  archive). Recommended: rename to `RM_recipe_OLD.html` first per the
  RM_ convention, then bulk-delete in a separate pass.
- [ ] Delete `recipe-v2.md` files (the dev-branch prototype seeds).
- [ ] Delete `voici-v2.md` if not already replaced by `voici.md`.
- [ ] Update `_data/recipes.js` (or delete if collections replace it).
- [ ] Update `CLAUDE.md`: `.md` is now source of truth for recipes,
  Eleventy is the default workflow, `recipe.html` is a build artifact.
- [ ] Resolve the orphans in `pjpcode/orphan/`: any HTML that should
  become a numbered recipe gets converted; the rest stay or get deleted.
- [ ] Once all `RM_` files are gone (separate cleanup pass), drop the
  `RM_` references from this tasks.md.

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
