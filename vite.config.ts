/// <reference types="vitest" />

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

const escapeRegExp = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const api = env.VITE_SPOTIFY_CLONE_LUIZALABS_API_BASE_URL || "";

  const apiPattern = api ? new RegExp("^" + escapeRegExp(api) + "$") : /\/graphql$/;

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "assets/favicon.ico",
          "apple-touch-icon.png"
        ],
        manifest: {
          id: "/",
          name: "Spotify Clone – Luizalabs Challenge",
          short_name: "Spotify Clone",
          start_url: "/",
          scope: "/",
          display: "standalone",
          background_color: "#212121",
          theme_color: "#000",
          icons: [
            { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
            { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ["**/*.{js,css,html,png,svg}"],
          globIgnores: [
            "**/assets/icon-192.png",
            "**/assets/icon-512.png",
            "**/apple-touch-icon.png",
            "**/assets/favicon.ico"
          ],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/graphql(?:$|\/)/],
          runtimeCaching: [
            {
              urlPattern: apiPattern,
              handler: "NetworkFirst",
              options: {
                cacheName: "graphql-api",
                networkTimeoutSeconds: 4,
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 } // 1 hour
              }
            },
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                cacheableResponse: { statuses: [0, 200] },
                expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }
              }
            }
          ]
        },
        devOptions: {
          enabled: false
        }
      })
    ],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./test/setup.ts",
      exclude: ["node_modules", "dist", "e2e/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
        reportsDirectory: "coverage",

        all: true,
        include: ["src/**/*.{ts,tsx}"],

        exclude: [
          "src/main.tsx",            
          "src/gql/generated.ts",    
          "**/*.d.ts"
        ],

        thresholds: {
          lines: 80,
          functions: 80,
          statements: 80,
          branches: 60
        }
      }
    }
  };
});
