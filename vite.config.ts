import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Appends a dynamic timestamp hash to force all browsers/Telegram to bust cache
        entryFileNames: `assets/[name].${Date.now()}.js`,
        chunkFileNames: `assets/[name].${Date.now()}.js`,
        assetFileNames: `assets/[name].${Date.now()}.[ext]`,
      },
    },
  },
});
// Cache hash: 1783098571
