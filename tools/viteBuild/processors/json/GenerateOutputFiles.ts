// tools/viteBuild/processors/json/GenerateOutputFiles.ts
import fs from 'fs'
import path from 'path'
import { PackageJsonType } from '@/types/core'
import { generateJsContent } from '@/common/presetsExport/generateContent'

/**
 * omikujiData.js を出力
 */
export function generateOutputFiles(distDir: string, jsonData: PackageJsonType): void {
  try {
    const jsContent = generateJsContent(JSON.stringify(jsonData, null, 2))
    const outputJsPath = path.join(distDir, 'omikujiData.js')
    fs.writeFileSync(outputJsPath, jsContent, 'utf-8')
    console.log(`[Post-Build] Generated JS file: ${outputJsPath}`)
  } catch (error) {
    throw new Error(`Failed to generate JS file. Error: ${error}`)
  }
}
