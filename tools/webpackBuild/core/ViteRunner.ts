// tools/webpackBuild/core/ViteRunner.ts
// 個人利用・試験ビルド用。配布パッケージは webpack (WebpackRunner) でビルドすること
import path from 'path'
import fs from 'fs'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { WebpackBuildInput } from '@tools/types'
import { createHtmlTemplate } from '../buildOptions/plugins'

/**
 * Vite でビルドを実行 (entryPoints の最初の1つを iife でバンドルし、index.html を生成)
 * 出力は webpack と同じ構成: scripts/main.js / scripts/main.css / index.html
 */
export async function runVite(config: WebpackBuildInput, outputSubDir: string): Promise<void> {
  const { packageRoot, entryPoints, addHtmlTemplate, system } = config
  const outDir = path.join(packageRoot, 'dist', outputSubDir)

  const entries = typeof entryPoints === 'string' ? { main: entryPoints } : entryPoints
  const [name, entry] = Object.entries(entries)[0]
  if (Object.keys(entries).length > 1) {
    console.warn(`[Vite] entry が複数あります。最初の '${name}' のみビルドします`)
  }

  await build({
    configFile: false,
    root: packageRoot,
    logLevel: 'warn',
    plugins: [vue(), tailwindcss()],
    css: { postcss: path.resolve(packageRoot, 'postcss.config.js') },
    resolve: { alias: system.alias },
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
    build: {
      outDir,
      emptyOutDir: true,
      lib: {
        entry,
        formats: ['iife'],
        name: 'OmikujiBotPackage',
        fileName: () => `scripts/${name}.js`,
        cssFileName: `scripts/${name}`,
      },
      rolldownOptions: {
        // webpack の externals と同じ (HTML 側で Vue をグローバル読み込みする)
        external: ['vue', '@onecomme.com/onesdk'],
        output: {
          globals: { vue: 'Vue', '@onecomme.com/onesdk': 'OneSDK' },
          codeSplitting: false,
        },
      },
    },
  })

  // Vite の lib モードは HTML を作らないので、webpack の HtmlWebpackPlugin 相当を書き出す
  const html = createHtmlTemplate(addHtmlTemplate)
    .replace('</head>', `    <link rel="stylesheet" href="./scripts/${name}.css" />\n  </head>`)
    .replace('</body>', `  <script src="./scripts/${name}.js" defer></script>\n  </body>`)
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8')

  // 配布用ローダー (script.js) が読む entry 一覧。webpack の EntrypointsManifestPlugin と同じ形式
  // (Vite は分割しないので、js / css それぞれ 1 ファイルだけ)
  const manifest = { [name]: { css: [`scripts/${name}.css`], js: [`scripts/${name}.js`] } }
  fs.writeFileSync(path.join(outDir, 'scripts', 'entrypoints.js'), `window.OmikujiEntrypoints=${JSON.stringify(manifest)};`, 'utf-8')

  console.log('[Build] Vite completed successfully')
}
