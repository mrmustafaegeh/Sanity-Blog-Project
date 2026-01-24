import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),

    // Brotli compression (better than gzip)
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false,
    }),

    // Gzip compression (fallback)
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
      deleteOriginFile: false,
    }),

    // Bundle analyzer (only in analyze mode)
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "dist/stats.html",
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Use Terser for better minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
      },
    },

    rollupOptions: {
      output: {
        manualChunks: {
          // Critical vendors (loaded first)
          "react-core": ["react", "react-dom"],
          router: ["react-router-dom"],

          // State management
          redux: ["@reduxjs/toolkit", "react-redux"],

          // UI libraries (can be lazy loaded)
          "ui-icons": ["lucide-react"],
          "ui-toast": ["react-hot-toast", "react-toastify"],

          // CMS/API
          sanity: [
            "@sanity/client",
            "@sanity/image-url",
            "@portabletext/react",
          ],
        },

        // Optimize chunk naming
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },

    // Optimize chunk size
    chunkSizeWarningLimit: 500,

    // Enable CSS code splitting
    cssCodeSplit: true,

    // Source maps only in development
    sourcemap: false,
  },

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
      "/earth": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
