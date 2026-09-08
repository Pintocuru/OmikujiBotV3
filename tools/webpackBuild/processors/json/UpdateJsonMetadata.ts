// tools/webpackBuild/processors/json/UpdateJsonMetadata.ts
import fs from 'fs'
import path from 'path'
import { ResolvedPackageBuildConfig } from '../../BuildTypes'
import { PackageJsonType } from '../../../../types'
import { getAccessSuffix } from '../../utils/AccessLevelUtils'

/**
 * JSONメタデータの更新と書き込み
 */
export async function updateJsonMetadata(config: ResolvedPackageBuildConfig): Promise<PackageJsonType> {
  if (!config.json || !config.template) {
    throw new Error('json or template config is missing')
  }
  // JSONファイルパス
  const { jsonPath, jsonPathRoot, assembleJsonData } = config.json
  const jsonSourcePath = path.resolve(jsonPathRoot, jsonPath)

  // JSONファイル読み込み
  const originalJsonData = readJsonFile(jsonSourcePath)

  // メタデータ更新
  const updatedMetadataJson = updateMetadata(originalJsonData, config)

  // 元ファイルに書き戻し（assemble前のもの）
  await writeJsonFile(jsonSourcePath, updatedMetadataJson)

  // アセンブル処理（optional・保存しない）
  return assembleJsonData ? await assembleJsonData(updatedMetadataJson, jsonPathRoot) : updatedMetadataJson
}

/**
 * JSONファイル読み込み
 */
function readJsonFile(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${filePath}. Error: ${error}`)
  }
}

/**
 * メタデータ更新
 */
function updateMetadata(jsonData: PackageJsonType, config: ResolvedPackageBuildConfig): PackageJsonType {
  if (!jsonData.meta || !config.template) return jsonData
  const accessLevel = config.targetAccessLevel

  return {
    ...jsonData,
    meta: {
      ...jsonData.meta,
      id: `${config.key}-${config.version}`,
      name: `${config.template.label}${getAccessSuffix(accessLevel)}`,
      description: config.template.description,
      version: config.version,
      author: config.system.author,
      tags: config.tags,
      license: config.licenseLabel ?? '個人利用のみ',
      url: config.template.boothURL,
      banner: config?.banner,
      generatorName: config.system.generatorName,
      generatorVersion: config.system.generatorVersion,
      dataVersion: config.system.dataVersion,
    },
  }
}

/**
 * JSONファイル書き込み
 */
async function writeJsonFile(filePath: string, data: any): Promise<void> {
  try {
    const content = JSON.stringify(data)
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`[Post-Build] Updated source JSON file: ${filePath}`)
  } catch (error) {
    throw new Error(`Failed to write JSON file: ${filePath}. Error: ${error}`)
  }
}
