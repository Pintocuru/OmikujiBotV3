// tools/viteBuild/processors/json/UpdateJsonMetadata.ts
import fs from 'fs'
import path from 'path'
import { PackageJsonType } from '@/types/core'
import { JsonConfig, ResolvedPackageBuildConfig } from '@tools/types'
import { OmikujiDataType } from '@/types/OmikujiData'
import { assembleBuildJson } from '@tools/JsonMerge/JsonMergeProcessor'

/**
 * JSON を読み込み、メタデータを更新してアセンブルする
 * (ソースの JSON は書き換えない。メタデータは出力物にだけ反映される)
 */
export async function updateJsonMetadata(
  { jsonPath, jsonPathRoot }: JsonConfig,
  config: ResolvedPackageBuildConfig
): Promise<PackageJsonType> {
  const jsonSourcePath = path.resolve(jsonPathRoot, jsonPath)
  const originalJsonData = readJsonFile(jsonSourcePath)
  // 以前は any 経由で渡していた (PackageJsonType は meta だけ必須の緩い型)
  return assembleBuildJson(updateMetadata(originalJsonData, config) as OmikujiDataType, jsonPathRoot) as Promise<PackageJsonType>
}

function readJsonFile(filePath: string): PackageJsonType {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${filePath}. Error: ${error}`)
  }
}

function updateMetadata(jsonData: PackageJsonType, config: ResolvedPackageBuildConfig): PackageJsonType {
  if (!jsonData.meta) return jsonData

  return {
    ...jsonData,
    meta: {
      ...jsonData.meta,
      id: `${config.key}-${config.version}`,
      name: config.template.label,
      description: config.template.description,
      version: config.version,
      author: config.system.author,
      tags: config.tags,
      license: config.licenseLabel,
      url: config.template.boothURL,
      banner: config.banner,
      generatorName: config.system.generatorName,
      generatorVersion: config.system.generatorVersion,
      dataVersion: config.system.dataVersion,
    },
  }
}
