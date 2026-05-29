// shared/utils/webpackBuild/processors/template/TemplateJsonProcessor.ts
import fs from 'fs'
import path from 'path'
import { ResolvedCoreBuildConfig, ResolvedPackageBuildConfig, PackageType } from '../../BuildTypes'
import { getAccessSuffix } from '../../utils/AccessLevelUtils'

/**
 * template.json生成処理
 */
export class TemplateJsonProcessor {
  static async generate(distDir: string, config: ResolvedPackageBuildConfig): Promise<void> {
    const { json, template } = config

    // jsonまたはわんコメのテンプレート情報が入らないなら処理しない
    if (!json || !template) return
    // JSON パッケージでは わんコメのテンプレートは不要
    if (config.packageType === 'JSON') return

    const accessSuffix = getAccessSuffix(config.targetAccessLevel)

    const templateJson = {
      name: `${template.name}${accessSuffix} ${config.version}`,
      author: config.system.author,
      link: template.boothURL,
      description: config.system.description,
    }

    const jsonPath = path.join(distDir, 'template.json')
    fs.writeFileSync(jsonPath, JSON.stringify(templateJson, null, 2), 'utf-8')

    console.log(`[Post-Build] Generated template.json: ${jsonPath}`)
  }
}
