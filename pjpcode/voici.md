---
layout: page
title: Voici le sommaire actuel du PJP code
permalink: /pjpcode/voici.htm
---

Livre secret consacré à la cuisine.
Les recettes sont classées par ordre d'inscription dans le cahier.

*Reçu d'un lecteur : [un petit mot de Pierre, écrivant d'Australie](commentaires/pierre.html).*

*Voir aussi : [petits outils et références](files/list.html) (équivalences four, thermostat, poids, etc.).*

*Voir aussi : [toutes les photos](photos.htm).*

<ul class="recipe-list">
{%- for r in recipes %}
  <li>
    <span class="num">{{ r.number | pad(3) }}</span>
    <a href="{{ r.href }}">{{ r.title }}</a>
  </li>
{%- endfor %}
</ul>
