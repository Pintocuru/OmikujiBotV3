// tools/viteConfig/vite.botPlugin.config.ts
import { defineConfig, mergeConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tsconfig from '../../tsconfig.json'
import { baseViteConfig } from '../../vite.config'
import { createAliases } from '@tools/webpackBuild/utils/CreateAliases'
import { APP_VERSION } from '@/version'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const base = baseViteConfig(projectRoot)

// tsconfig.json からエイリアスを生成
const tsAliases = createAliases(projectRoot, tsconfig)
export const alias = { ...tsAliases }

export default defineConfig(() => {
  return mergeConfig(base, {
    // ビルド設定
    build: {
      // ライブラリモードでコンパイル
      lib: {
        entry: path.resolve(projectRoot, 'src/EditorPlugin/plugin.ts'),
        name: 'Plugin',
        fileName: () => `EditorPlugin-${APP_VERSION}/plugin.js`,
        formats: ['cjs'], // 出力形式は CommonJS
      },

      // 出力ディレクトリ
      outDir: 'dist',
      emptyOutDir: true,

      // ロールアップ設定
      rolldownOptions: {
        // plugins: [visualizer({ open: true })], // 同梱物チェック用
        // 外部依存関係を持ち込まない
        external: [
          'fs',
          'fs/promises',
          'path',
          'events',
          'stream',
          'buffer',
          'os',
          'url',
          'querystring',
          '@onecomme.com/onesdk',
          'electron-store',
        ],
        output: {
          // デフォルトエクスポートをCommonJSのexportsに直接変換
          exports: 'default',
        },
      },

      // ミニファイ設定
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // Console.logを削除する
          drop_debugger: true,
        },
        mangle: {
          // 特定の関数名を保持
          reserved: [
            'init',
            // 'subscribe',
            // 'filterComment',
            // 'filterSpeech'
            'request',
            'destroy',
          ],
        },
      },


      sourcemap: false,   // ソースマップ生成しない


      chunkSizeWarningLimit: 1000,    // チャンクサイズ警告を無効化
    },

    // 解決設定
    resolve: { alias: alias },
    test: {
      silent: false,   // コンソールメッセージを有効にする
      globals: true,    // その他の設定
    },
  })
})
