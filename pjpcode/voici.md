---
layout: page
title: Voici le sommaire actuel du PJP code
permalink: /pjpcode/voici.htm
---

Livre secret consacré à la cuisine.
Les recettes sont classées par ordre d'inscription dans le cahier.

<ul class="recipe-list">
{%- for r in recipes %}
  <li>
    <span class="num">{{ r.number | pad(3) }}</span>
    <a href="{{ r.href }}">{{ r.title }}</a>
  </li>
{%- endfor %}
</ul>
