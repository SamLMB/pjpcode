# Tasks / Open Issues

Things noted during cleanup that aren't blocking but should not be forgotten.
Check items off as they're resolved; remove resolved sections when they go stale.

## Filename cleanup

- [ ] Resolve NFC/NFD duplicate filenames — same visible name on disk, different
  Unicode byte sequences (one composed, one decomposed). The filesystem treats
  them as distinct files; HTML links generally point at one or the other.
  Known cases:
  - `pjpcode/huîtres_farcies_bretonne.htm` (two copies)
  - `pjpcode/237/recette 237/glace à la vanille.pdf` and `.docx` (two copies each)
  - `pjpcode/récipients_et_unités.doc` (two copies)
  - `pjpcode/gelée_mures_manémeur.html` (two copies, plus a `gelée_mures_manémeur (2).html` variant)
- [ ] Decide what to do with `Copie de ANZAC.html` and
  `Copie de confiture_figues_citron_vanille.html` — Word "save as" backup duplicates
  of pages that already exist under their canonical names.
- [ ] Pick and apply a standardized filename convention: accented vs ASCII,
  casing of `.JPG` vs `.jpg`, `.htm` vs `.html`, spaces vs underscores.

## Site graph / navigation

- [ ] Wire up the orphan navigation indexes that nothing currently links to:
  `pjpcode/recettes_alpha.htm` and `pjpcode/recettes_liste_par_numeros.htm`.
  `voici.htm` used to advertise a (broken) `recettes_mots-cles.htm`; these
  orphans were probably the intended targets.
- [ ] Decide whether the chef Pioger pages
  (`rôti_de_boeuf_du_chef_Michel_Pioger.html`,
  `pommes_de_terre_rôties_du_chef_Michel_Pioger.html`) belong in `voici.htm`'s
  numbered list — currently only reachable via `liste_par_mots_clefs.html`.

## Missing content

- [ ] Recipe #131 — *glace à la vanille, au yaourt et aux éclats de chocolat,
  comme l'adoraient les dinosaures de Malansac* — was never digitized on
  either the old VM or the local repo. `voici.htm`'s link currently points at
  the related photo `dinosaure.jpg` as a placeholder. If the recipe resurfaces
  (handwritten cookbook, old Word doc, etc.), write it as
  `glace_vanille_dinosaure.html` and re-point the link.

## Cosmetic

- [ ] `indexpjpcode.html` once read `Bienvenue sur le PJP code !` (space
  before `!`, proper French typography); the local copy is `code!`. Restore
  the space to match the original if desired. Sole content drift between old
  VM and local repo as of the deep-compare run.

## Infrastructure

- [ ] Take down the old VM at `34.73.98.109` once satisfied with the new
  deploy. The deep-compare run on `dev` confirmed every file from the VM has
  an equivalent in the local repo.
