// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { alias } from './vite.config'

export default defineConfig({
  test: { globals: true },
  resolve: { alias: alias },
})
