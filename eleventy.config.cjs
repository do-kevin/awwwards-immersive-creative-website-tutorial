const eleventyVitePlugin = require("@11ty/eleventy-plugin-vite");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyVitePlugin, {
    viteOptions: {
      publicDir: "public",
      root: "src",
      plugins: [],
    },
  });

  eleventyConfig.addPassthroughCopy("public");
  eleventyConfig.setServerPassthroughCopyBehavior("copy");
  return {
    dir: {
      input: "src/views",
      output: "_site",
    },
    passthroughFileCopy: true,
  };
};
