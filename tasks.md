# Tasks / Open Issues

Things noted during cleanup that aren't blocking but should not be forgotten.
Check items off as they're resolved; remove resolved sections when they go stale.

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
