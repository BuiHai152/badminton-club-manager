import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: "0.0.0.0",
    watch: {
      ignored: [
        "**/.chrome-profile*/**",
        "**/.edge-profile/**",
        "**/.pgdata/**",
        "**/.npm-cache/**",
        "**/.pnpm-store/**",
        "**/tools/**",
        "**/docs/screenshots/**",
        "**/scripts/**",
        "**/.tmp/**",
        "**/*.tmpdir/**",
        "**/.*.tmpdir/**",
        "**/*.log",
      ],
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4100",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
