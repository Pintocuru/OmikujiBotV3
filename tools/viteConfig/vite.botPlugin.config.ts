// tools/viteConfig/vite.botPlugin.config.ts
// わんコメ用プラグイン (src/plugin/plugin.ts) を CommonJS 1ファイルにビルドする: npm run build:plugin
// ※ 設定ファイルの読み込み時は tsconfig の paths (@/ や @tools/) が解決されないため、import は相対パスで書くこと
import { defineConfig } from 'vite'
import path from 'path'
import { builtinModules } from 'module'
import { fileURLToPath } from 'url'
import { createViteAliases } from './CreateViteAliases'
import { APP_VERSION } from '../../src/version'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

// tsconfig.json からエイリアスを生成
export const alias = { ...createViteAliases(projectRoot) }

// プラグインは Vue / Tailwind を使わないため、vite.config.ts の baseViteConfig (vue・tailwind・型チェック) は使わない
export default defineConfig({
  root: projectRoot,
  resolve: { alias },
  // CommonJS では import.meta.url が使えない (server/constants.ts の SERVER_ROOT が決まらず、読み込み時に落ちる)
  // → plugin.js 自身の位置から作った値に置き換える (下の banner で定義)
  define: { 'import.meta.url': '__importMetaUrl' },
  build: {
    // ライブラリモードでコンパイル
    lib: {
      entry: path.resolve(projectRoot, 'src/plugin/plugin.ts'),
      name: 'Plugin',
      fileName: () => `EditorPlugin-${APP_VERSION}/plugin.js`,
      formats: ['cjs'], // 出力形式は CommonJS
    },

    // 出力ディレクトリ (dist はパッケージ版 (packages/build.ts) の出力先と同じため、中身を消さない)
    outDir: 'dist',
    emptyOutDir: false,

    rolldownOptions: {
      // 外部依存関係を持ち込まない (Node 組み込みモジュールと、わんコメ側が提供する OneSDK)
      external: [...builtinModules, /^node:/, '@onecomme.com/onesdk'],
      output: {
        // デフォルトエクスポートをCommonJSのexportsに直接変換
        exports: 'default',
        banner: "const __importMetaUrl = require('url').pathToFileURL(__filename).href;",
      },
    },

    // ミニファイ設定
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // console.log を残す
        drop_debugger: true,
      },
    },

    sourcemap: false, // ソースマップ生成しない
    chunkSizeWarningLimit: 1000, // チャンクサイズ警告の閾値 (KB)
  },
})
