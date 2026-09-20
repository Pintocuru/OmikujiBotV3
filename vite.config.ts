// vite.config.ts
import { defineConfig, mergeConfig, UserConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createViteAliases } from './tools/viteConfig/CreateViteAliases'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'
import { characterAssetsPlugin } from './tools/viteConfig/characterAssetsPlugin'
import { soundAssetsPlugin } from './tools/viteConfig/soundAssetsPlugin'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname)
const base = baseViteConfig(projectRoot)

// tsconfig.json からエイリアスを生成
export const alias = { ...createViteAliases(projectRoot) }

export default defineConfig(() => {
  const overrideConfig: UserConfig = {
    plugins: [
      characterAssetsPlugin(projectRoot),
      soundAssetsPlugin(projectRoot),
    ],
    resolve: { alias },
    server: {
      watch: {
        ignored: [path.resolve(projectRoot, 'server/presets/**')],
      },
    },
  }
  return mergeConfig(base, overrideConfig)
})


export function baseViteConfig(childDir: string) {
  const plugins = [
    vue(),
    tailwindcss(),
    checker({
      // テンプレート内もチェック
      overlay: { initialIsOpen: 'error' },
      terminal: true,
    }),
  ]

  return defineConfig({
    root: childDir,
    plugins,
    css: {
      postcss: path.resolve(__dirname, '../../postcss.config.js'),
    },
  })
}
