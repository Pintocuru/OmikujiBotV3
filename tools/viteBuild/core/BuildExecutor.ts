// tools/viteBuild/core/BuildExecutor.ts
import { ResolvedPackageBuildConfig } from '@tools/types'
import { processPostBuild } from '../processors/PostBuildProcessor'
import fs from 'fs'
import path from 'path'
import { copyFiles } from '../processors/file/FileCopier'
import { runVite } from './ViteRunner'

/**
 * パッケージビルドを実行
 */
export async function executePackageBuild(config: ResolvedPackageBuildConfig): Promise<void> {
  const outputSubDir = config.outputFolderName
  console.log(`\n[Package Build] Building: ${outputSubDir}`)

  try {
    // 出力ディレクトリを作成 (dist は buildPackages が先に空にしている)
    fs.mkdirSync(path.join(config.packageRoot, 'dist', outputSubDir), { recursive: true })

    // パッケージの entryPoints (main.ts / editor.ts / console.ts) を Vite でビルド
    await runVite(config, outputSubDir)
    console.log(`  [vite] Entry: ${JSON.stringify(config.entryPoints)}`)

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
