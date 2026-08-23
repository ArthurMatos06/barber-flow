import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      // Espelha o alias "@/..." que você já usa no tsconfig.json,
      // pra poder importar os arquivos do projeto nos testes do mesmo jeito.
      "@": path.resolve(__dirname, "."),
    },
  },
})
