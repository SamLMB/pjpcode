// Directory data: apply to every Eleventy template under pjpcode/.
// Use the source file's path verbatim, just swapping .md for .html, so URLs
// match the on-disk layout (no /foo/index.html "pretty URL" rewriting).
module.exports = {
  permalink: "{{ page.filePathStem }}.html",
};
