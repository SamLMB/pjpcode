---
layout: page
title: Galerie de photos du PJP code
permalink: /pjpcode/photos.html
---

Les plats, étapes de préparation et la famille en action dans le PJP code. Cliquez sur une photo pour ouvrir la recette correspondante.

<div class="gallery-controls">
  <div class="view-toggle">
    <button type="button" class="toggle-btn active" data-view="primary">Une photo par recette (88)</button>
    <button type="button" class="toggle-btn" data-view="all">Toutes les photos (167)</button>
  </div>
  <p id="gallery-count" class="gallery-count">88 photographies sélectionnées (une par recette)</p>
</div>

<ul class="photo-grid">
{%- for p in photos %}
  <li data-recipe="{{ p.number if p.number else 'cooks' }}" data-primary="{{ 'true' if p.primary else 'false' }}">
    <a href="{{ p.href }}" title="{% if p.number %}{{ p.number | pad(3) }} — {% endif %}{{ p.title }}">
      <img src="{{ p.src }}" alt="{{ p.title }}" loading="lazy">
    </a>
  </li>
{%- endfor %}
</ul>

<script>
(function () {
  var grid = document.querySelector('.photo-grid');
  var countEl = document.getElementById('gallery-count');
  var toggleBtns = document.querySelectorAll('.toggle-btn');
  if (!grid) return;

  var allItems = Array.prototype.slice.call(grid.children);
  var currentView = 'primary';

  // Dispersal shuffle to prevent photos of the same recipe from clustering
  function dispersalShuffle(list) {
    var groups = new Map();
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var key = item.getAttribute('data-recipe') || ('solo-' + i);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }

    // Shuffle items within each group
    groups.forEach(function (group) {
      for (var g = group.length - 1; g > 0; g--) {
        var r = Math.floor(Math.random() * (g + 1));
        var tmp = group[g]; group[g] = group[r]; group[r] = tmp;
      }
    });

    // Sort groups descending by length
    var sortedGroups = Array.from(groups.values()).sort(function (a, b) {
      if (b.length !== a.length) return b.length - a.length;
      return Math.random() - 0.5;
    });

    var total = list.length;
    var result = new Array(total);
    var slot = 0;

    for (var s = 0; s < sortedGroups.length; s++) {
      var grp = sortedGroups[s];
      for (var m = 0; m < grp.length; m++) {
        while (result[slot] !== undefined) {
          slot = (slot + 1) % total;
        }
        result[slot] = grp[m];
        slot = (slot + 5) % total;
      }
    }
    return result;
  }

  // Standard random shuffle for unique-recipe list
  function simpleShuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
    return arr;
  }

  function renderView(view) {
    currentView = view;
    var toDisplay = [];

    if (view === 'primary') {
      var primaries = allItems.filter(function (el) {
        return el.getAttribute('data-primary') === 'true';
      });
      toDisplay = simpleShuffle(primaries);
      if (countEl) countEl.textContent = toDisplay.length + ' photographies (une par recette)';
    } else {
      toDisplay = dispersalShuffle(allItems);
      if (countEl) countEl.textContent = toDisplay.length + ' photographies (collection complète, étapes et variantes)';
    }

    grid.innerHTML = '';
    var frag = document.createDocumentFragment();
    for (var k = 0; k < toDisplay.length; k++) {
      frag.appendChild(toDisplay[k]);
    }
    grid.appendChild(frag);

    toggleBtns.forEach(function (btn) {
      if (btn.getAttribute('data-view') === view) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Initialize with 'primary' (one photo per recipe) view
  renderView('primary');

  // Toggle button listeners
  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetView = this.getAttribute('data-view');
      if (targetView !== currentView) {
        renderView(targetView);
      }
    });
  });
})();
</script>
