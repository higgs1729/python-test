import path from "node:path"
import { defineConfig } from "vite"

// React プラグインは使わない(esbuild が tsconfig の jsx:"react-jsx" を読んで .tsx を変換する)。
// HMR は効かず全リロードになるが、ビルド成果物は同じ。
export default defineConfig({
  base: "./",
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    // 開発中も server.py の学習データAPIを使えるようにする
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
})
