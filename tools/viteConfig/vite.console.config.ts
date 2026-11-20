// tools/viteConfig/vite.console.config.ts
// LiveConsole (console.html / src/console) の開発サーバー・ビルド用の設定。
// 使い方: npm run dev:console → http://localhost:5174/console.html (開発用 API サーバーも一緒に起動する。editor は起動しない)
// ※ `npm run dev` とは同時に使えない (API のポートが重複する)。本番のデータ保存先はわんコメのプラグイン。
import { defineConfig, mergeConfig, UserConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createViteAliases } from './CreateViteAliases'
import { baseViteConfig } from '../../vite.config'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const base = baseViteConfig(projectRoot)

// tsconfig.json からエイリアスを生成
export const alias = { ...createViteAliases(projectRoot) }

export default defineConfig(() => {
  const overrideConfig: UserConfig = {
    root: path.resolve(projectRoot),
    resolve: { alias },
    server: {
      // ルートの開発サーバー (5173) と同時に起動できるよう、ポートを分ける
      port: 5174,
      open: '/console.html',
      watch: {
        // サーバーが書き込むファイルで、画面が再読み込みされないようにする
        ignored: [
          path.resolve(projectRoot, 'server/presets/**'),
          path.resolve(projectRoot, 'server/streams/**'),
          path.resolve(projectRoot, 'server/userStats.json'),
          path.resolve(projectRoot, 'server/game-configs/**'),
        ],
      },
    },
    build: {
      outDir: path.resolve(projectRoot, 'dist-console'),
      emptyOutDir: true,
      rolldownOptions: {
        input: path.resolve(projectRoot, 'console.html'),
      },
    },
  }

  return mergeConfig(base, overrideConfig)
})
