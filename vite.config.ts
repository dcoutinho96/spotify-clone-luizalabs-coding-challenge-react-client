/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    exclude: [
      "node_modules",
      "dist",
      "e2e/**", 
    ],
    coverage: {
      reporter: ["text", "lcov"],   
      reportsDirectory: "coverage",
    },
  },
});