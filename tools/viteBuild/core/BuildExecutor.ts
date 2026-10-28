// tools/viteBuild/core/BuildExecutor.ts
import { ResolvedPackageBuildConfig } from '@tools/types'
import { processPostBuild } from '../processors/PostBuildProcessor'
import { cleanOutputDir, copyFiles } from '../processors/file/FileCopier'
import { runVite } from './ViteRunner'

/**
 * パッケージビルドを実行
 */
export async function executePackageBuild(config: ResolvedPackageBuildConfig): Promise<void> {
  const outputSubDir = config.outputFolderName
  console.log(`\n[Package Build] Building: ${outputSubDir} (Type: ${config.packageType})`)

  try {
    // 出力ディレクトリをクリーン
    const distPath = await cleanOutputDir(config.packageRoot, outputSubDir)
    console.log(`  [Clean] Output directory: ${distPath}`)

    if (config.packageType === 'FULL' || config.packageType === 'UPDATE') {
      // FULL / UPDATE: パッケージの entryPoints (main.ts / editor.ts / console.ts) を Vite でビルド
      await runVite(config, outputSubDir)
      console.log(`  [vite] Entry: ${JSON.stringify(config.entryPoints)}`)
    } else {
      console.log(`  [JSON Mode] Skipping Vite build`)
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
