const fs = require("fs");
const path = require("path");
const recipes = require("./recipes.js");

module.exports = function () {
  const index = [];

  for (const r of recipes) {
    const pad = String(r.number).padStart(4, "0");
    const padNum = String(r.number).padStart(3, "0");
    const filePath = path.join(__dirname, "..", "pjpcode", "recipes", pad, "recipe.md");

    let title = r.title;
    let ingredients = "";

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      
      // Extract title from front matter
      const titleMatch = content.match(/^title:\s*(?:"([^"]+)"|([^\r\n]+))$/m);
      if (titleMatch) {
        title = (titleMatch[1] || titleMatch[2]).trim();
      }

      // Extract ingredients block
      const ingMatch = content.match(/## Ingrédients\s*([\s\S]*?)(?=##|$)/i);
      if (ingMatch) {
        ingredients = ingMatch[1]
          .split("\n")
          .map((line) => line.replace(/^[-*•\d.]+\s*/, "").trim())
          .filter(
            (line) =>
              line &&
              !line.startsWith("*") &&
              !line.startsWith("📄") &&
              !line.startsWith("#") &&
              !line.toLowerCase().startsWith("recette")
          )
          .join(", ");
      }
    }

    index.push({
      id: r.number,
      padNum: padNum,
      title: title,
      navTitle: r.title,
      ingredients: ingredients,
      href: r.href,
    });
  }

  return index;
};
