(function () {
  "use strict";

  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchStatus = document.getElementById("search-status");
  const sampleTags = document.querySelectorAll(".search-tag");

  if (!searchInput || !searchResults) return;

  function normalize(text) {
    if (!text) return "";
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function highlightMatches(text, query) {
    if (!text || !query) return escapeHtml(text);
    const words = query
      .trim()
      .split(/\s+/)
      .map(function (w) {
        return normalize(w);
      })
      .filter(Boolean);
    if (!words.length) return escapeHtml(text);

    // Escape regex characters
    const pattern = new RegExp(
      "(" +
        words
          .map(function (w) {
            return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          })
          .join("|") +
        ")",
      "gi"
    );

    // Find matches in normalized text and map back
    const escaped = escapeHtml(text);
    return escaped.replace(pattern, "<mark>$1</mark>");
  }

  let miniSearch = null;
  let allRecipes = [];

  function renderList(items, query) {
    if (!items.length) {
      searchResults.innerHTML =
        '<li style="border: none; padding: 2rem 0; color: var(--color-muted); font-style: italic;">Aucune recette trouvée. Essayez un autre ingrédient ou terme.</li>';
      return;
    }

    const html = items
      .map(function (item) {
        const ingredientsSnippet = item.ingredients
          ? '<div class="search-snippet">' +
            highlightMatches(item.ingredients, query) +
            "</div>"
          : "";

        return (
          '<li>' +
          '<span class="num">' +
          escapeHtml(item.padNum) +
          "</span>" +
          '<div class="search-item-info">' +
          '<a href="' +
          escapeHtml(item.href) +
          '">' +
          escapeHtml(item.title) +
          "</a>" +
          ingredientsSnippet +
          "</div>" +
          "</li>"
        );
      })
      .join("");

    searchResults.innerHTML = html;
  }

  function performSearch() {
    const query = searchInput.value.trim();

    if (!query) {
      searchStatus.textContent = allRecipes.length + " recettes disponibles au total.";
      renderList(allRecipes, "");
      return;
    }

    if (!miniSearch) return;

    // Search query with prefix and fuzzy options
    const results = miniSearch.search(query, {
      prefix: true,
      fuzzy: 0.2,
      boost: { title: 4, navTitle: 3, padNum: 5, idStr: 5, ingredients: 1 },
    });

    const count = results.length;
    searchStatus.textContent =
      count + (count > 1 ? " recettes trouvées" : count === 1 ? " recette trouvée" : " recette trouvée") +
      ' pour "' +
      query +
      '".';

    renderList(results, query);
  }

  // Load index
  fetch("/pjpcode/search-index.json")
    .then(function (res) {
      if (!res.ok) throw new Error("Erreur de chargement de l'index de recherche");
      return res.json();
    })
    .then(function (data) {
      allRecipes = data;

      miniSearch = new window.MiniSearch({
        fields: ["title", "navTitle", "ingredients", "padNum", "idStr"],
        storeFields: ["id", "padNum", "title", "navTitle", "ingredients", "href"],
        processTerm: normalize,
        searchOptions: {
          processTerm: normalize,
        },
      });

      // Prepare documents with idStr for number searches
      const docs = data.map(function (item) {
        return Object.assign({}, item, {
          idStr: String(item.id) + " " + item.padNum,
        });
      });

      miniSearch.addAll(docs);

      searchStatus.textContent = allRecipes.length + " recettes prêtes à être recherchées.";
      renderList(allRecipes, "");

      // Execute search if query prefilled in URL
      const urlParams = new URLSearchParams(window.location.search);
      const initialQuery = urlParams.get("q");
      if (initialQuery) {
        searchInput.value = initialQuery;
        performSearch();
      }
    })
    .catch(function (err) {
      searchStatus.textContent = "Impossible de charger l'index de recherche.";
      console.error(err);
    });

  // Event listeners
  searchInput.addEventListener("input", performSearch);

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      searchInput.value = "";
      performSearch();
    } else if (e.key === "Enter") {
      const firstLink = searchResults.querySelector("a");
      if (firstLink) {
        window.location.href = firstLink.href;
      }
    }
  });

  // Sample tag buttons
  sampleTags.forEach(function (tag) {
    tag.addEventListener("click", function (e) {
      e.preventDefault();
      const text = tag.getAttribute("data-term") || tag.textContent.trim();
      searchInput.value = text;
      searchInput.focus();
      performSearch();
    });
  });
})();
