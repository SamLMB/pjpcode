module.exports = function (eleventyConfig) {
  // Format a number with leading zeros (e.g. 7 -> "007")
  eleventyConfig.addFilter("pad", (n, width = 3) =>
    String(n).padStart(width, "0")
  );

  // Pass through everything we don't want Eleventy to template-process.
  // The existing Word-exported HTML is fragile — copy as-is.
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.html");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.htm");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.pdf");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.docx");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.doc");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.jpg");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.png");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.gif");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.css");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.xls");
  eleventyConfig.addPassthroughCopy("pjpcode/**/*.xml");

  // Repo-root files needed at the deployed root.
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy(".nojekyll");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    // Only treat .md and .njk files as Eleventy templates. HTML is passthrough.
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
