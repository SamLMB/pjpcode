---
layout: page
title: Liste des recettes par numéro
permalink: /pjpcode/recettes_liste_par_numeros.html
---

Les 253 recettes du PJP code, par numéro d'inscription dans le cahier
(même tri que le [sommaire](voici.html), présentation simplifiée).

<ul class="recipe-list">
{%- for r in recipes %}
  <li>
    <span class="num">{{ r.number | pad(3) }}</span>
    <a href="{{ r.href }}">{{ r.title }}</a>
  </li>
{%- endfor %}
</ul>
