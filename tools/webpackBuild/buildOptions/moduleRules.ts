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
    // CSS (Tailwind CSS v4 & DaisyUI)
    // 開発(Vite)は @tailwindcss/vite を使うが、webpack には無いので PostCSS 経由で Tailwind を通す
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        { loader: 'postcss-loader', options: { postcssOptions: { plugins: ['@tailwindcss/postcss'] } } },
      ],
    },
  ]
}
