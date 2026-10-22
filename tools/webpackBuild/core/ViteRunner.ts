// tools/webpackBuild/core/ViteRunner.ts
// 個人利用・試験ビルド用。配布パッケージは webpack (WebpackRunner) でビルドすること
import path from 'path'
import fs from 'fs'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { WebpackBuildInput } from '@tools/types'
import type { Plugin } from 'vite'
import { createHtmlTemplate } from '../buildOptions/plugins'

/**
 * Vite でビルドを実行 (entryPoints の最初の1つを iife でバンドルし、index.html を生成)
 * 出力は webpack と同じ構成: scripts/main.js / scripts/main.css / index.html
 */
/**
 * iife 形式では external の「動的 import()」がグローバル変数に置換されず、
 * ブラウザに素の import('@onecomme.com/onesdk') が残って落ちる。
 * (静的 import は output.globals で OneSDK に置換される。webpack は両方置換する)
 * そのため動的 import をグローバル参照に書き換える。
 */
function externalDynamicImportPlugin(): Plugin {
  const re = /import\(\s*(['"])@onecomme\.com\/onesdk\1\s*\)/g
  return {
    name: 'external-dynamic-import-to-global',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('node_modules') || !code.includes('@onecomme.com/onesdk')) return null
      const replaced = code.replace(re, 'Promise.resolve({ ...window.OneSDK, default: window.OneSDK })')
      return replaced === code ? null : { code: replaced, map: null }
    },
  }
}

/**
 * Vite でビルドを実行 (entryPoints を entry ごとに iife でバンドルする)
 * 出力は webpack と同じ構成: scripts/<name>.js / scripts/<name>.css / index.html
 * iife は 1 ビルド = 1 エントリのため、entry の数だけ build を回す
 */
export async function runVite(config: WebpackBuildInput, outputSubDir: string): Promise<void> {
  const { packageRoot, entryPoints, addHtmlTemplate, system } = config
  const outDir = path.join(packageRoot, 'dist', outputSubDir)

  const entries = typeof entryPoints === 'string' ? { main: entryPoints } : entryPoints
  const manifest: Record<string, { css: string[]; js: string[] }> = {}

  let isFirst = true
  for (const [name, entry] of Object.entries(entries)) {
    await build({
      configFile: false,
      root: packageRoot,
      mode: 'production',
      // .env / .env.development を読まない (開発用の VITE_IMAGE_BASE_URL や VITE_IS_DEV=true を製品に混ぜない)
      // → import.meta.env.VITE_* は undefined になり、コード側の既定値 './Characters/' と isDev=false が使われる
      envDir: false,
      // build.ts が dotenv で process.env に読み込んだ VITE_* も import.meta.env に入ってしまうため、公開プレフィックスを無効化
      envPrefix: '__NO_PUBLIC_ENV__',
      logLevel: 'warn',
      plugins: [externalDynamicImportPlugin(), vue(), tailwindcss()],
      css: { postcss: path.resolve(packageRoot, 'postcss.config.js') },
      resolve: { alias: system.alias },
      define: { 'process.env.NODE_ENV': JSON.stringify('production') },
      build: {
        outDir,
        emptyOutDir: isFirst, // 2つ目以降は前の出力を消さない
        lib: {
          entry,
          formats: ['iife'],
          name: `OmikujiBotPackage_${name}`,
          fileName: () => `scripts/${name}.js`,
          cssFileName: `scripts/${name}`,
        },
        rolldownOptions: {
          // webpack の externals と同じ (HTML 側で Vue / OneSDK をグローバル読み込みする)
          external: ['vue', '@onecomme.com/onesdk'],
          output: {
            globals: { vue: 'Vue', '@onecomme.com/onesdk': 'OneSDK' },
            codeSplitting: false,
          },
        },
      },
    })

    // CSS が無い entry もあり得るので、存在確認してから manifest に載せる
    const cssExists = fs.existsSync(path.join(outDir, 'scripts', `${name}.css`))
    manifest[name] = { css: cssExists ? [`scripts/${name}.css`] : [], js: [`scripts/${name}.js`] }

    // index.html は先頭 entry 用 (webpack の HtmlWebpackPlugin 相当)。editor.html 等はテンプレートのコピーを使う
    if (isFirst) {
      let html = createHtmlTemplate(addHtmlTemplate)
      if (cssExists)
        html = html.replace('</head>', `    <link rel="stylesheet" href="./scripts/${name}.css" />\n  </head>`)
      html = html.replace('</body>', `  <script src="./scripts/${name}.js" defer></script>\n  </body>`)
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8')
    }
    isFirst = false
  }

  // 配布用ローダー (script.js) が読む entry 一覧。webpack の EntrypointsManifestPlugin と同じ形式
  fs.writeFileSync(
    path.join(outDir, 'scripts', 'entrypoints.js'),
    `window.OmikujiEntrypoints=${JSON.stringify(manifest)};`,
    'utf-8'
  )

  console.log('[Build] Vite completed successfully')
}
