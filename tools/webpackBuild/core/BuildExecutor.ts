// tools/webpackBuild/core/BuildExecutor.ts
import { ResolvedCoreBuildConfig, ResolvedPackageBuildConfig } from '@tools/types'
import { processPostBuild } from '../processors/PostBuildProcessor'
import { runWebpack } from './WebpackRunner'
import { runVite } from './ViteRunner'

export type Bundler = 'webpack' | 'vite'
import { cleanOutputDir, copyFiles, copyDirectoryRecursive } from '../processors/file/FileCopier'
import { createBuildOptions } from '../buildOptions/buildOptions'
import path from 'path'
import { createCoreFingerprint } from '../utils/BuildFingerprint'
import { saveBuildMeta } from '../utils/BuildMetaStore'

/**
 * コアビルドを実行
 */
export async function executeCoreBuild(config: ResolvedCoreBuildConfig): Promise<void> {
  const outputSubDir = config.outputFolderName
  await cleanOutputDir(config.packageRoot, outputSubDir)

  const buildOptions = createBuildOptions(config, outputSubDir)
  await runWebpack(buildOptions)

  const fingerprint = createCoreFingerprint(config)

  saveBuildMeta(config.packageRoot, outputSubDir, {
    hash: fingerprint,
    builtAt: new Date().toISOString(),
  })

  // 拡張ファイルをコピー
  if (config.filesToCopy.length > 0) {
    await copyFiles(config.filesToCopy, config.packageRoot, outputSubDir)
    console.log(`  [Copy] Extended files: ${config.filesToCopy.length} items`)
  }

  console.log(`[Core Build] Completed: ${outputSubDir}`)
}

/**
 * パッケージビルドを実行
 */
export async function executePackageBuild(
  config: ResolvedPackageBuildConfig,
  bundler: Bundler = 'webpack'
): Promise<void> {
  const outputSubDir = config.outputFolderName
  console.log(`\n[Package Build] Building: ${outputSubDir} (Type: ${config.packageType})`)

  try {
    // 出力ディレクトリをクリーン
    const distPath = await cleanOutputDir(config.packageRoot, outputSubDir)
    console.log(`  [Clean] Output directory: ${distPath}`)

    if (config.packageType === 'FULL') {
      // FULL: パッケージの main.ts (entryPoints) をビルド (配布は webpack、試験用は vite)
      if (bundler === 'vite') {
        await runVite(config, outputSubDir)
      } else {
        await runWebpack(createBuildOptions(config, outputSubDir))
      }
      console.log(`  [${bundler}] Entry: ${JSON.stringify(config.entryPoints)}`)
    } else if (config.packageType === 'PATCH') {
      // PATCH: コアパッケージをコピー
      if (!config.sourceCorePath) {
        throw new Error(`[Package Build] sourceCorePath is required for ${config.packageType} build type`)
      }
      await copyDirectoryRecursive(config.sourceCorePath, distPath)
      console.log(`  [Copy] Core package from: ${path.basename(config.sourceCorePath)}`)
    } else {
      console.log(`  [JSON Mode] Skipping core package copy`)
    }

    // 拡張ファイルをコピー
    if (config.filesToCopy.length > 0) {
      await copyFiles(config.filesToCopy, config.packageRoot, outputSubDir)
      console.log(`  [Copy] Extended files: ${config.filesToCopy.length} items`)
    }

    // ポストビルド処理（JSON、readme.txt、thumb.png などを生成）
    await processPostBuild(config, outputSubDir)
    console.log(`  [Post-Build] Completed`)

    console.log(`[Package Build] Completed: ${outputSubDir}`)
  } catch (error) {
    console.error(`[Package Build] Failed to build ${outputSubDir}:`, error)
    throw error
  }
}
