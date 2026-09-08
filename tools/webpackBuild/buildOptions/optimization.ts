// tools/webpackBuild/buildOptions/optimization.ts
import webpack from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

/**
 * Webpackの最適化設定を作成
 */
export function createOptimizationConfig(): webpack.Configuration['optimization'] {
  return {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: [/config.*\.js$/],
        terserOptions: {
          compress: {
            drop_console: true, // コンソールを消すか
            drop_debugger: true,
            passes: 2,
          },
          mangle: true,
        },
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              calc: false,
            },
          ],
        },
      }),
    ],
    usedExports: true,
    sideEffects: true,
    splitChunks: {
      chunks: 'all',
      minSize: 200000,
      maxSize: 5000000,
      minChunks: 2,
      automaticNameDelimiter: '-',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
        },
        common: {
          minChunks: 2,
          name: 'common',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  }
}
