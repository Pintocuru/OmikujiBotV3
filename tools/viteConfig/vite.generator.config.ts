// tools/viteConfig/vite.generator.config.ts
import { defineConfig, mergeConfig, UserConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createViteAliases } from './CreateViteAliases'
import { baseViteConfig } from '../../vite.config'

// projectRoot の設宁E
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const base = baseViteConfig(projectRoot)

// tsconfig.json からエイリアスを生戁E
export const alias = { ...createViteAliases(projectRoot) }

export default defineConfig(() => {
  const overrideConfig: UserConfig = {
    root: path.resolve(projectRoot),
    resolve: { alias },
    build: {
      lib: {
        // TODO: MainGenerator -> generator
        entry: path.resolve(projectRoot, 'src/MainGenerator/main.ts'),
        formats: ['iife'],
        name: 'MainGenerator',
        fileName: () => 'scripts/MainGenerator.js',
      },
      emptyOutDir: true,
      rolldownOptions: {
        output: {
          assetFileNames: '[name].[ext]',
        },
      },
    },
  }

  return mergeConfig(base, overrideConfig)
})
