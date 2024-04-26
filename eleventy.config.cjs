const eleventyVitePlugin = require('@11ty/eleventy-plugin-vite');

module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats('pug');

  eleventyConfig.setServerOptions({
    port: 5173,
  });

  eleventyConfig.addPlugin(eleventyVitePlugin, {
    viteOptions: {
      root: '.',
      publicDir: 'public',
      plugins: [],
      build: {
        outDir: '_site',
        emptyOutDir: true,
      },
    },
  });

  eleventyConfig.addPassthroughCopy('public');
  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.addPassthroughCopy('src/app');
  eleventyConfig.setServerPassthroughCopyBehavior('copy');

  return {
    dir: {
      input: 'src/views',
      output: '_site',
    },
    passthroughFileCopy: true,
  };
};
