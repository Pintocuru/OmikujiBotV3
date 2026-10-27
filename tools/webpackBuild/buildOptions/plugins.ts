// tools/webpackBuild/buildOptions/plugins.ts
import webpack from 'webpack'
import { WebpackBuildInput } from '@tools/types'
import { VueLoaderPlugin } from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CircularDependencyPlugin from 'circular-dependency-plugin'

/**
 * Webpackプラグインを作成
 */
export function createPlugins(config: WebpackBuildInput): webpack.WebpackPluginInstance[] {
  const { entryPoints, addHtmlTemplate } = config

  return [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      __VUE_I18N_FULL_INSTALL__: JSON.stringify(true),
      __VUE_I18N_LEGACY_API__: JSON.stringify(false), // createI18n<false> のみ使用
      __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
      __INTLIFY_JIT_COMPILATION__: JSON.stringify(true),
      __INTLIFY_DROP_MESSAGE_COMPILER__: JSON.stringify(false),
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js',
    }),
    new MiniCssExtractPlugin({
      filename: 'scripts/[name].css',
    }),
    ...createHtmlPlugins(entryPoints, addHtmlTemplate),
    createTypeScriptPlugin(),
    createCircularDependencyPlugin(),
    new EntrypointsManifestPlugin(),
  ]
}

/**
 * 各 entry が読み込むべきファイル (vendors などの分割チャンクを含む、読み込み順) を
 * scripts/entrypoints.js に書き出す。
 * index.html / editor.html のローダー(script.js)がこれを読むので、
 * チャンクの分け方が変わっても HTML 側にファイル名を手書きする必要がない。
 */
class EntrypointsManifestPlugin {
  apply(compiler: webpack.Compiler) {
    const name = 'EntrypointsManifestPlugin'
    compiler.hooks.thisCompilation.tap(name, (compilation) => {
      compilation.hooks.processAssets.tap({ name, stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT }, () => {
        const manifest: Record<string, { css: string[]; js: string[] }> = {}
        for (const [entryName, entrypoint] of compilation.entrypoints) {
          const files = entrypoint.getFiles()
          manifest[entryName] = {
            css: files.filter((f) => f.endsWith('.css')),
            js: files.filter((f) => f.endsWith('.js')),
          }
        }
        compilation.emitAsset(
          'scripts/entrypoints.js',
          new webpack.sources.RawSource(`window.OmikujiEntrypoints=${JSON.stringify(manifest)};`)
        )
      })
    })
  }
}

/**
 * HTMLプラグインを作成
 */
function createHtmlPlugins(entryPoints: string | Record<string, string>, addHtmlTemplate: string): HtmlWebpackPlugin[] {
  const createPlugin = (name: string, chunk: string, isIndex: boolean): HtmlWebpackPlugin => {
    return new HtmlWebpackPlugin({
      filename: isIndex ? 'index.html' : `${name}.html`,
      chunks: [chunk],
      inject: 'body',
      templateContent: () => createHtmlTemplate(addHtmlTemplate),
    })
  }

  return Object.entries(entryPoints).map(([key], index) => {
    return createPlugin(key, key, index === 0)
  })
}

/**
 * HTMLテンプレートを作成
 * <script src="./assets/onesdk.js"></script>
 */
export function createHtmlTemplate(addHtmlTemplate: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="referrer" content="no-referrer" />
    <!-- Vue3 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js" defer></script>
    ${addHtmlTemplate}
  </head>
  <body>
    <div id="App"></div>
  </body>
</html>`
}

/**
 * TypeScriptチェッカープラグインを作成
 */
function createTypeScriptPlugin(): ForkTsCheckerWebpackPlugin {
  return new ForkTsCheckerWebpackPlugin({
    typescript: {
      diagnosticOptions: {
        semantic: true,
        syntactic: true,
        declaration: true,
      },
    },
    async: false, // ← ビルドを止める
    logger: 'webpack-infrastructure',
    issue: {
      include: [{ file: '**/src/**/*.{ts,tsx,vue}' }], // ← 明示的に対象を限定
      exclude: [{ file: '**/node_modules/**' }, { file: '**/archives/**' }],
    },
  })
}

/**
 * 循環依存検出プラグインを作成
 */
function createCircularDependencyPlugin(): CircularDependencyPlugin {
  return new CircularDependencyPlugin({
    exclude: /node_modules/,
    failOnError: true,
    allowAsyncCycles: false,
    cwd: process.cwd(),
  })
}
