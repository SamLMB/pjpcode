---
layout: page
title: Recherche de recettes
permalink: /pjpcode/recherche.html
---

Trouver rapidement une recette par intitulé, ingrédient ou numéro dans le livre de cuisine PJP code.

<div class="search-box-container">
  <input
    type="search"
    id="search-input"
    class="search-input"
    placeholder="Rechercher (ex. chocolat, veau, moules, pommes de terre, 86)..."
    autocomplete="off"
    autofocus
  >
  <div class="search-tags">
    <span>Suggestions :</span>
    <a href="#" class="search-tag" data-term="chocolat">chocolat</a>
    <a href="#" class="search-tag" data-term="pommes de terre">pommes de terre</a>
    <a href="#" class="search-tag" data-term="veau">veau</a>
    <a href="#" class="search-tag" data-term="moules">moules</a>
    <a href="#" class="search-tag" data-term="homard">homard</a>
    <a href="#" class="search-tag" data-term="blanquette">blanquette</a>
    <a href="#" class="search-tag" data-term="far">far</a>
    <a href="#" class="search-tag" data-term="sushis">sushis</a>
  </div>
  <p id="search-status" class="search-status">Chargement de l'index de recherche...</p>
</div>

<ul id="search-results" class="recipe-list"></ul>

<script src="/pjpcode/js/minisearch.js"></script>
<script src="/pjpcode/js/search.js"></script>
