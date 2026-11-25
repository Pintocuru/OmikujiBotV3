// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import checker from 'vite-plugin-checker'
import { createViteAliases } from './tools/viteConfig/CreateViteAliases.ts'
import { imageAssetsPlugin } from './tools/viteConfig/imageAssetsPlugin.ts'
import { soundAssetsPlugin } from './tools/viteConfig/soundAssetsPlugin.ts'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname)

// tsconfig.json からエイリアスを生成
export const alias = { ...createViteAliases(projectRoot) }

export default defineConfig({
  root: projectRoot,
  plugins: [
    vue(),
    tailwindcss(),
    checker({
      // テンプレート内もチェック
      overlay: { initialIsOpen: 'error' },
      terminal: true,
    }),
    // common/ または YYYY-QN/ フォルダから探して返す独自プラグイン
    imageAssetsPlugin(projectRoot),
    soundAssetsPlugin(projectRoot),
  ],
  resolve: { alias },
  server: {
    watch: {
      ignored: [
        path.resolve(projectRoot, 'server/presets/**'),
        path.resolve(projectRoot, 'server/streams/**'),
        path.resolve(projectRoot, 'server/userStats.json'),
        path.resolve(projectRoot, 'server/game-configs/**'),
      ],
    },
  },
})
