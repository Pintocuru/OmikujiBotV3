// shared/utils/webpackBuild/buildOptions/plugins.ts
import webpack from 'webpack'
import { ResolvedCoreBuildConfig } from '../BuildTypes'
import { VueLoaderPlugin } from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CircularDependencyPlugin from 'circular-dependency-plugin'

/**
 * Webpackプラグインを作成
 */
export function createPlugins(config: ResolvedCoreBuildConfig): webpack.WebpackPluginInstance[] {
  const { entryPoints, addHtmlTemplate } = config

  return [
    new VueLoaderPlugin(),
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
  ]
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
function createHtmlTemplate(addHtmlTemplate: string): string {
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
