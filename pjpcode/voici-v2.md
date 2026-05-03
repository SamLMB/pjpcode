---
layout: page
title: Sommaire (prototype)
---

Le sommaire ci-dessous est **généré automatiquement** à partir d'un
fichier de données partagé (`_data/recipes.js`). Pour en ajouter une recette,
il suffit d'ajouter une ligne dans ce fichier et de regénérer le site.

Cette page de prototype ne contient que les quelques recettes converties
au nouveau format. La version complète remplacerait `voici.htm`.

<ul class="recipe-list">
{%- for r in recipes %}
  <li{% if not r.converted %} class="unconverted"{% endif %}>
    <span class="num">{{ r.number | pad(3) }}</span>
    <a href="{{ r.href }}">{{ r.title }}</a>
  </li>
{%- endfor %}
</ul>

---

**Comparer&nbsp;:**

- [version actuelle de voici (`voici.htm`)](/pjpcode/voici.htm)
- [version actuelle d'une recette (recette n°86)](/pjpcode/recipes/0086/recipe.html)
- [version prototype d'une recette (recette n°86)](/pjpcode/recipes/0086/recipe-v2.html)
