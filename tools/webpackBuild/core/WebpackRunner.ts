// shared/utils/webpackBuild/core/WebpackRunner.ts
import webpack from 'webpack'

/**
 * Webpackビルドを実行
 */
export async function runWebpack(options: webpack.Configuration): Promise<void> {
  return new Promise((resolve, reject) => {
    const compiler = webpack(options)

    if (!compiler) {
      reject(new Error('Failed to create webpack compiler'))
      return
    }

    compiler.run((err, stats) => {
      if (err) {
        console.error('[Build Error]', err)
        reject(err)
        return
      }

      if (stats?.hasErrors()) {
        logErrors(stats)
        reject(new Error('Webpack compilation failed'))
        return
      }

      if (stats?.hasWarnings()) {
        logWarnings(stats)
      }

      console.log('[Build] Webpack completed successfully')
      resolve()
    })
  })
}

/**
 * エラーをログ出力
 */
function logErrors(stats: webpack.Stats): void {
  console.error('[Build Error] Webpack compilation errors:')
  stats.compilation.errors.forEach((error) => {
    console.error(error.message)
  })
}

/**
 * 警告をログ出力
 */
function logWarnings(stats: webpack.Stats): void {
  console.warn('[Build Warning] Webpack compilation warnings:')
  stats.compilation.warnings.forEach((warning) => {
    console.warn(warning.message)
  })
}
