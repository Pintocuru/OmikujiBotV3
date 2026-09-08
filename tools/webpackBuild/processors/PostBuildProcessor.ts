// tools/webpackBuild/processors/PostBuildProcessor.ts
import path from 'path'
import { ResolvedPackageBuildConfig } from '../BuildTypes'
import { TemplateJsonProcessor } from './template/TemplateJsonProcessor'
import { generateReadmeTxt } from './template/ReadmeTxtProcessor'
import { updateJsonMetadata } from './json/UpdateJsonMetadata'
import { generateOutputFiles } from './json/GenerateOutputFiles'

/**
 * ポストビルド処理実行
 */
export async function processPostBuild(config: ResolvedPackageBuildConfig, outputSubDir?: string): Promise<void> {
  const distDir = getDistDir(config.packageRoot, outputSubDir)

  // 早期リターンによる処理の制御
  const shouldRunTemplateProcessors = config.json && config.template

  try {
    const processorsToRun = []

    // readme.txt生成の条件を満たしているかチェック
    if (shouldRunTemplateProcessors) {
      processorsToRun.push(generateReadmeTxt(distDir, config))
    }

    // template.json生成の条件を満たしているかチェック
    if (shouldRunTemplateProcessors) {
      processorsToRun.push(TemplateJsonProcessor.generate(distDir, config))
    }

    // 依存関係のない処理を並列実行
    await Promise.all(processorsToRun)

    // JSON処理
    if (shouldRunTemplateProcessors) {
      // JSONメタデータの更新と書き込み
      const updatedJsonData = await updateJsonMetadata(config)
      // JSON/JSファイルを出力
      await generateOutputFiles(distDir, updatedJsonData, config)
    }
  } catch (error) {
    console.error('[Post-Build Error]', error)
    throw error
  }
}

/**
 * 出力ディレクトリパス取得
 */
function getDistDir(packageRoot: string, outputSubDir?: string): string {
  return outputSubDir ? path.join(packageRoot, 'dist', outputSubDir) : path.join(packageRoot, 'dist')
}
