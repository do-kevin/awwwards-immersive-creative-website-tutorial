const EleventyVitePlugin = require('@11ty/eleventy-plugin-vite')
const eleventySass = require('eleventy-sass')
const rollupPluginCritical = require('rollup-plugin-critical').default

module.exports = function (eleventyConfig) {
  eleventyConfig.setServerOptions({
    port: 5173
  })
  eleventyConfig.setServerPassthroughCopyBehavior('copy')
  eleventyConfig.addPassthroughCopy('public')
  eleventyConfig.addPlugin(eleventySass)
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      publicDir: 'public',
      clearScreen: false,
      server: {
        mode: 'development',
        middlewareMode: true
      },
      appType: 'custom',
      build: {
        mode: 'production',
        sourcemap: 'true',
        manifest: true,
        rollupOptions: {
          output: {
            assetFileNames: 'assets/css/main.[hash].css',
            chunkFileNames: 'assets/js/[name].[hash].js',
            entryFileNames: 'assets/js/[name].[hash].js'
          },
          plugins: [
            rollupPluginCritical({
              criticalUrl: './_site/',
              criticalBase: './_site/',
              criticalPages: [{ uri: 'index.html', template: 'index' }],
              criticalConfig: {
                inline: true,
                dimensions: [
                  {
                    height: 900,
                    width: 375
                  },
                  {
                    height: 720,
                    width: 1280
                  },
                  {
                    height: 1080,
                    width: 1920
                  }
                ],
                penthouse: {}
              }
            })
          ]
        }
      }
    }
  })

  eleventyConfig.addLayoutAlias('base', 'base.pug')

  eleventyConfig.addPassthroughCopy('src/assets/css')
  eleventyConfig.addPassthroughCopy('src/assets/js')

  return {
    templateFormats: ['pug', 'html'],
    htmlTemplateEngine: 'pug',
    passthroughFileCopy: true,
    dir: {
      input: 'src/views',
      output: '_site',
      includes: '_includes',
      layouts: 'layouts',
      data: '_data'
    }
  }
}
