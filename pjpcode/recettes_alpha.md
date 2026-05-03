---
layout: page
title: Liste alphabétique des recettes
permalink: /pjpcode/recettes_alpha.htm
---

Les 253 recettes du PJP code, classées par ordre alphabétique.
Pour la liste classique par ordre d'inscription dans le cahier, voir le
[sommaire](voici.htm).

<ul class="recipe-list">
{%- for r in recipesAlpha %}
  <li>
    <span class="num">{{ r.number | pad(3) }}</span>
    <a href="{{ r.href }}">{{ r.title }}</a>
  </li>
{%- endfor %}
</ul>
