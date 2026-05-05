const fs = require("fs");
const path = require("path");
const recipes = require("./recipes.js");

const titlesByNumber = new Map(recipes.map(r => [r.number, r.title]));
const recipesDir = path.join(__dirname, "..", "pjpcode", "recipes");

const photos = [];
for (const folder of fs.readdirSync(recipesDir).sort()) {
  const number = parseInt(folder, 10);
  if (!Number.isFinite(number)) continue;
  const dir = path.join(recipesDir, folder);
  const images = fs.readdirSync(dir)
    .filter(f => /^image-\d+\.(jpe?g|png|gif)$/i.test(f))
    .sort();
  for (const image of images) {
    photos.push({
      number,
      folder,
      image,
      title: titlesByNumber.get(number) || `recette ${number}`,
      href: `/pjpcode/recipes/${folder}/recipe.html`,
      src: `/pjpcode/recipes/${folder}/${image}`,
    });
  }
}

module.exports = photos;
