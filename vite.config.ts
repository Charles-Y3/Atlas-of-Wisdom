import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'Atlas of Wisdom',
        short_name: 'Atlas',
        description: "Discover the places that shaped humanity's wisdom.",
        theme_color: '#f6f0e2',
        background_color: '#f6f0e2',
        display: 'standalone',
        icons: [
          { src: 'icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      workbox: {
        // The basemap is bundled GeoJSON (see scripts/gen-basemap.ts), so
        // precaching .json makes the globe work fully offline — there is no
        // tile server to depend on.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,json}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
