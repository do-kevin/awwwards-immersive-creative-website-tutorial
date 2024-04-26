import { defineConfig } from "vite";

export default defineConfig({
  root: "./src",
  build: {
    outDir: "./_site",
    emptyOutDir: true,
  },
});
