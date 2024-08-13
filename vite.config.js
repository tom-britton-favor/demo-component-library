import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es", "umd", "cjs"],
      name: "MyComponentLib",
      fileName: (format) => `fvr-components.${format}.js`,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTests.js"], // if you have a setup file
  },
});
