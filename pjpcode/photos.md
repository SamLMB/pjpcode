---
layout: page
title: Toutes les photos du PJP code
permalink: /pjpcode/photos.htm
---

Les plats, étapes de préparation et la famille en action dans le PJP code (167 photographies). Cliquez sur une photo pour ouvrir la recette correspondante.

<ul class="photo-grid">
{%- for p in photos %}
  <li>
    <a href="{{ p.href }}" title="{% if p.number %}{{ p.number | pad(3) }} — {% endif %}{{ p.title }}">
      <img src="{{ p.src }}" alt="{{ p.title }}" loading="lazy">
    </a>
  </li>
{%- endfor %}
</ul>

<script>
(function () {
  var grid = document.querySelector('.photo-grid');
  if (!grid) return;
  var items = Array.prototype.slice.call(grid.children);
  for (var i = items.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
  }
  var frag = document.createDocumentFragment();
  for (var k = 0; k < items.length; k++) frag.appendChild(items[k]);
  grid.appendChild(frag);
})();
</script>
