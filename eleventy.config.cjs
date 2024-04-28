const eleventyVitePlugin = require('@11ty/eleventy-plugin-vite');
const eleventySass = require('eleventy-sass');

module.exports = function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    port: 5173,
  });

  eleventyConfig.setTemplateFormats('pug');
  eleventyConfig.addPlugin(eleventySass);

  eleventyConfig.addPlugin(eleventyVitePlugin, {
    viteOptions: {
      root: '.',
      publicDir: 'public',
      plugins: [],
      build: {
        target: 'es6',
        outDir: '_site',
        emptyOutDir: true,
      },
    },
  });

  eleventyConfig.addPassthroughCopy('public');
  eleventyConfig.addPassthroughCopy('src/app');
  eleventyConfig.setServerPassthroughCopyBehavior('copy');
  // eleventyConfig.addWatchTarget('src/app/main.js');
  return {
    dir: {
      input: 'src/views',
      output: '_site',
      includes: '_includes',
      data: '_data',
    },
    passthroughFileCopy: true,
    htmlTemplateEngine: 'pug',
  };
};
