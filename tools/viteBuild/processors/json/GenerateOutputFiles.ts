// tools/viteBuild/processors/json/GenerateOutputFiles.ts
import { PackageJsonType } from '@/types/core'
import { ResolvedPackageBuildConfig } from '@tools/types'
import fs from 'fs'
import path from 'path'

/**
 * JSON/JSファイルを出力
 */
export async function generateOutputFiles(
  distDir: string,
  jsonData: PackageJsonType,
  config: ResolvedPackageBuildConfig
): Promise<void> {
  const { json, key: name } = config
  if (!json) throw new Error('json config is missing')
  const { generateJsContent } = json

  if (config.packageType === 'JSON') {
    await generateJsonOnlyFile(distDir, jsonData, name)
  } else {
    await generateJsFile(distDir, jsonData, generateJsContent)
  }
}

/**
 * JSONオンリーファイル生成
 */
async function generateJsonOnlyFile(distDir: string, jsonData: PackageJsonType, name: string): Promise<void> {
  try {
    const jsonString = JSON.stringify(jsonData, null, 2)
    const outputJsonPath = path.join(distDir, `${name}.json`)
    fs.writeFileSync(outputJsonPath, jsonString, 'utf-8')
    console.log(`[Post-Build] Generated JSON-only file: ${outputJsonPath}`)
  } catch (error) {
    throw new Error(`Failed to generate JSON-only file. Error: ${error}`)
  }
}

/**
 * JSファイル生成
 */
async function generateJsFile(
  distDir: string,
  jsonData: PackageJsonType,
  generateJsContent: (configData: string) => string
): Promise<void> {
  try {
    const jsonString = JSON.stringify(jsonData, null, 2)
    const jsContent = generateJsContent(jsonString)
    const outputJsPath = path.join(distDir, 'omikujiData.js')
    fs.writeFileSync(outputJsPath, jsContent, 'utf-8')
    console.log(`[Post-Build] Generated JS file: ${outputJsPath}`)
  } catch (error) {
    throw new Error(`Failed to generate JS file. Error: ${error}`)
  }
}
