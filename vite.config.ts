import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // 새 버전 자동 갱신 흐름
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "test-chang",
        short_name: "test",
        description: "pwa test chang",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        // icons: [
        //   { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        //   { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
        //   { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        // ]
      },
      workbox: {
        navigateFallback: "/index.html", // SPA 라우팅
      },
    }),
  ],
});
