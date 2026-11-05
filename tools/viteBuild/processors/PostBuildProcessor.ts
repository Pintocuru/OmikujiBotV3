// tools/viteBuild/processors/PostBuildProcessor.ts
import path from 'path'
import { ResolvedPackageBuildConfig } from '@tools/types'
import { TemplateJsonProcessor } from './template/TemplateJsonProcessor'
import { generateReadmeTxt } from './template/ReadmeTxtProcessor'
import { updateJsonMetadata } from './json/UpdateJsonMetadata'
import { generateOutputFiles } from './json/GenerateOutputFiles'

/**
 * ポストビルド処理実行
 */
export async function processPostBuild(config: ResolvedPackageBuildConfig, outputSubDir: string): Promise<void> {
  const distDir = path.join(config.packageRoot, 'dist', outputSubDir)

  try {
    // 依存関係のない処理を並列実行
    await Promise.all([generateReadmeTxt(distDir, config), TemplateJsonProcessor.generate(distDir, config)])

    // JSON処理 (json は UPDATE のとき持たない)
    if (config.json) {
      const jsonData = await updateJsonMetadata(config.json, config)
      await generateOutputFiles(distDir, jsonData, config)
    }
  } catch (error) {
    console.error('[Post-Build Error]', error)
    throw error
  }
}
