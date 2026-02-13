
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Avoid pre-bundling the native `lightningcss` package which is node-only
  // and can cause esbuild to try resolving non-existent ../pkg files.
  optimizeDeps: {
    exclude: ["lightningcss"]
  },
});




