// tools/viteConfig/vite.botPlugin.config.ts
// TODO:コメントが文字化けしてるので修正して
import { defineConfig, mergeConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tsconfig from '../../tsconfig.json'
import { baseViteConfig } from '../../vite.config'
import { createAliases } from '@tools/webpackBuild/utils/CreateAliases'
import { APP_VERSION } from '@/version'

// projectRoot の設宁E
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const base = baseViteConfig(projectRoot)

// tsconfig.json からエイリアスを生戁E
const tsAliases = createAliases(projectRoot, tsconfig)
export const alias = { ...tsAliases }

export default defineConfig(() => {
  return mergeConfig(base, {
    // ビルド設宁E
    build: {
      // ライブラリモードで構篁E
      lib: {
        entry: path.resolve(projectRoot, 'src/EditorPlugin/plugin.ts'),
        name: 'Plugin',
        fileName: () => `EditorPlugin-${APP_VERSION}/plugin.js`,
        formats: ['cjs'], // 出力形式�E CommonJS 持E��E
      },

      // 出力ディレクトリ
      outDir: 'dist',
      emptyOutDir: true,

      // ロールアチE�E設宁E
      rolldownOptions: {
        // plugins: [visualizer({ open: true })], // 同梱物チェチE��用
        // 外部依存関係�E持E��E
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
          // チE��ォルトエクスポ�EトをCommonJSのexportsに直接変換
          exports: 'default',
        },
      },

      // ミニファイ設宁E
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // Console.logを削除するぁE
          drop_debugger: true,
        },
        mangle: {
          // 特定�E関数名�E保持
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


      sourcemap: false,   // ソースマップ生戁E


      chunkSizeWarningLimit: 1000,    // チャンクサイズ警告�E無効匁E
    },

    // 解決設宁E
    resolve: { alias: alias },
    test: {
      silent: false,   // コンソールメチE��ージを有効にする
      globals: true,    // そ�E他�E設宁E
    },
  })
})
