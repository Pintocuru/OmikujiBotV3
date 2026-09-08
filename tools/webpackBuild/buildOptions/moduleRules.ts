// tools/webpackBuild/buildOptions/moduleRules.ts
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

/**
 * Webpackのモジュールルールを作成
 */
export function createModuleRules(): webpack.RuleSetRule[] {
  return [
    // Vue
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: { reactivityTransform: true },
    },
    // TypeScript
    {
      test: /\.ts$/,
      loader: 'ts-loader',
      options: { transpileOnly: true },
    },
    // CSS (Tailwind CSS & DaisyUI)
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
    },
  ]
}
