// tools/viteBuild/processors/template/TemplateJsonProcessor.ts
import fs from 'fs'
import path from 'path'
import { ResolvedPackageBuildConfig } from '@tools/types'

/**
 * template.json生成処理
 */
export class TemplateJsonProcessor {
  static async generate(distDir: string, config: ResolvedPackageBuildConfig): Promise<void> {
    const { template } = config

    const templateJson = {
      name: `${template.name} ${config.version}`,
      author: config.system.author,
      link: template.boothURL,
      description: config.system.description,
    }

    const jsonPath = path.join(distDir, 'template.json')
    fs.writeFileSync(jsonPath, JSON.stringify(templateJson, null, 2), 'utf-8')

    console.log(`[Post-Build] Generated template.json: ${jsonPath}`)
  }
}
