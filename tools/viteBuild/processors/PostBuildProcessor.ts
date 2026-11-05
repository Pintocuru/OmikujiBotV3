// tools/viteBuild/processors/PostBuildProcessor.ts
import path from 'path'
import { ResolvedPackageBuildConfig } from '@tools/types'
import { TemplateJsonProcessor } from './template/TemplateJsonProcessor'
import { generateReadmeTxt } from './template/ReadmeTxtProcessor'
import { loadBuildJson } from './json/UpdateJsonMetadata'
import { generateOutputFiles } from './json/GenerateOutputFiles'

/**
 * ポストビルド処理実行
 */
export async function processPostBuild(config: ResolvedPackageBuildConfig, outputSubDir: string): Promise<void> {
  const distDir = path.join(config.packageRoot, 'dist', outputSubDir)

  try {
    // 依存関係のない処理を並列実行
    await Promise.all([generateReadmeTxt(distDir, config), TemplateJsonProcessor.generate(distDir, config)])

    // JSON処理 (jsonFileName: null のパッケージは json を持たない)
    if (config.json) {
      const jsonData = await loadBuildJson(config.json, config)
      generateOutputFiles(distDir, jsonData)
    }
  } catch (error) {
    console.error('[Post-Build Error]', error)
    throw error
  }
}
