import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  // Build React wrappers separately from main library
  const isReactBuild = process.env.BUILD_TARGET === "react";

  return {
    plugins: [react()],
    build: {
      emptyOutDir: !isReactBuild, // Don't empty dist on React build
      lib: isReactBuild
        ? {
            entry: path.resolve(__dirname, "src/generated/react.tsx"),
            formats: ["es"],
            name: "FvrComponentsReact",
            fileName: () => "react.es.js",
          }
        : {
            entry: path.resolve(__dirname, "src/index.js"),
            formats: ["es", "umd"],
            name: "FvrComponents",
            fileName: (format) => `fvr-components.${format}.js`,
          },
      rollupOptions: isReactBuild
        ? {
            // Externalize React and main library for React build
            external: ["react", "react-dom", "react/jsx-runtime"],
            output: {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
                "react/jsx-runtime": "jsxRuntime",
              },
            },
          }
        : {
            // No externals for main library build
          },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./setupTests.js"],
    },
  };
});
