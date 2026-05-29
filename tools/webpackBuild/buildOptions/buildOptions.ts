// shared/utils/webpackBuild/buildOptions/buildOptions.ts
import webpack from 'webpack'
import path from 'path'
import fs from 'fs'
import { ResolvedCoreBuildConfig } from '../BuildTypes'
import { createModuleRules } from './moduleRules'
import { createOptimizationConfig } from './optimization'
import { createPlugins } from './plugins'
import { createResolveConfig } from './resolve'
import { createExternals } from './externals'

/**
 * Webpackビルドオプションを作成
 */
export const createBuildOptions = (config: ResolvedCoreBuildConfig, outputSubDir?: string): webpack.Configuration => {
  const { entryPoints, packageRoot } = config
  const distPath = outputSubDir ? path.join(packageRoot, 'dist', outputSubDir) : path.join(packageRoot, 'dist')

  // サブディレクトリがある場合は作成
  if (outputSubDir) fs.mkdirSync(distPath, { recursive: true })

  return {
    mode: 'production',
    entry: entryPoints,
    context: packageRoot,
    output: {
      filename: 'scripts/[name].js',
      chunkFilename: 'scripts/[name].js',
      path: distPath,
      clean: true,
    },
    bail: true, // エラーなら強制終了
    resolve: createResolveConfig(config.system.alias, packageRoot),
    externals: createExternals(),
    module: { rules: createModuleRules() },
    optimization: createOptimizationConfig(),
    plugins: createPlugins(config),
  }
}
