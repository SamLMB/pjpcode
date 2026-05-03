// Recipes sorted alphabetically by title (French collation, accent-insensitive
// for ordering so e.g. "âge" sorts where "age" would). Used by the alpha
// index page; regenerated automatically from _data/recipes.js.
const recipes = require("./recipes.js");
const collator = new Intl.Collator("fr", { sensitivity: "base" });
module.exports = [...recipes].sort((a, b) => collator.compare(a.title, b.title));
