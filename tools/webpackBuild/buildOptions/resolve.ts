// tools/webpackBuild/buildOptions/resolve.ts
import path from 'path'
import webpack from 'webpack'

/**
 * Webpack resolve設定を作成
 */
export function createResolveConfig(alias: Record<string, string>, packageRoot: string): webpack.ResolveOptions {
  return {
    extensions: ['.js', '.ts', '.json', '.vue'],
    alias: createResolvedAlias(alias, packageRoot),
  }
}

/**
 * エイリアス設定を解決済みパスに変換
 */
function createResolvedAlias(alias: Record<string, string>, packageRoot: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(alias).map(([key, value]) => [
      key,
      path.isAbsolute(value) ? value : path.resolve(packageRoot, value),
    ])
  )
}
