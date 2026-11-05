// tools/viteBuild/processors/json/UpdateJsonMetadata.ts
import fs from 'fs'
import path from 'path'
import { PackageJsonType } from '@/types/core'
import { OmikujiDataType } from '@/types/OmikujiData'
import { JsonConfig, ResolvedPackageBuildConfig } from '@tools/types'
import { assembleBuildJson } from '@tools/JsonMerge/JsonMergeProcessor'

/**
 * ビルド用: JSON を読み込み、メタデータを反映してアセンブルする
 * (ソースの JSON は書き換えない。ソースへの反映は tools/presetMeta の役割)
 */
export async function loadBuildJson(
  { jsonPath, jsonPathRoot }: JsonConfig,
  config: ResolvedPackageBuildConfig
): Promise<PackageJsonType> {
  const original = readJsonFile(path.resolve(jsonPathRoot, jsonPath))
  // PackageJsonType は meta だけ必須の緩い型なので、OmikujiDataType として渡す
  return assembleBuildJson(applyMetadata(original, config) as OmikujiDataType, jsonPathRoot) as Promise<PackageJsonType>
}

export function readJsonFile(filePath: string): PackageJsonType {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${filePath}. Error: ${error}`)
  }
}

/**
 * パッケージ設定から meta を作って反映する (ビルドと tools/presetMeta で共通)
 */
export function applyMetadata(jsonData: PackageJsonType, config: ResolvedPackageBuildConfig): PackageJsonType {
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
