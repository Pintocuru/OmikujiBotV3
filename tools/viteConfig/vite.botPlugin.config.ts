// tools/viteConfig/vite.botPlugin.config.ts
// わんコメ用プラグイン (src/plugin/plugin.ts) を CommonJS 1ファイルにビルドする: npm run build:plugin
// ※ 設定ファイルの読み込み時は tsconfig の paths (@/ や @tools/) が解決されないため、import は相対パスで書くこと
import { defineConfig } from 'vite'
import path from 'path'
import { builtinModules } from 'module'
import { fileURLToPath } from 'url'
import { createViteAliases } from './CreateViteAliases'
import { APP_VERSION } from '../../src/version'
import fs from 'node:fs'
import { ZipArchive } from 'archiver'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')

// tsconfig.json からエイリアスを生成
export const alias = { ...createViteAliases(projectRoot) }

export default defineConfig({
  root: projectRoot,
  resolve: { alias },
  define: { 'import.meta.url': '__importMetaUrl' },

  plugins: [
    {
      name: 'zip-plugin-output',

      async closeBundle() {
        const folderName = `OmikujiBotPlugin-${APP_VERSION}`

        const sourceDir = path.resolve(projectRoot, 'dist', folderName)
        const zipDir = path.resolve(projectRoot, 'dist/distZipped')
        const zipPath = path.resolve(zipDir, `${folderName}.zip`)

        // ZIP 出力先を作成
        await fs.promises.mkdir(zipDir, { recursive: true })

        await new Promise<void>((resolve, reject) => {
          const output = fs.createWriteStream(zipPath)
          const archive = new ZipArchive({
            zlib: { level: 9 },
          })

          output.on('close', resolve)
          output.on('error', reject)
          archive.on('error', reject)

          archive.pipe(output)

          // フォルダ構造を維持して ZIP 化
          archive.directory(sourceDir, folderName)

          archive.finalize()
        })
      },
    },
  ],

  build: {
    lib: {
      entry: path.resolve(projectRoot, 'src/plugin/plugin.ts'),
      name: 'Plugin',
      fileName: () => `OmikujiBotPlugin-${APP_VERSION}/plugin.js`,
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
