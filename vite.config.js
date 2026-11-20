import { defineConfig } from "vite";

export default defineConfig({
  // Relative base: the same build must work at a domain root and under a
  // project-site subpath (for example username.github.io/fluid-guard/).
  base: "./",
  server: {
    port: 5173,
  },
});
