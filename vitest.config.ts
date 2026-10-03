import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  // @vitejs/plugin-react is intentionally omitted — it fails to load against the
  // pinned Vite version (vite/internal subpath mismatch). Vite's own esbuild
  // transform handles JSX for .tsx files without it.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
