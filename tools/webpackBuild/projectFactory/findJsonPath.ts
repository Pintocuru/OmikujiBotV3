// tools/webpackBuild/projectFactory/findJsonPath.ts
import fs from 'fs'
import path from 'path'

/**
 * presets/<templateName>.json を自動探索
 */
export function findJsonPath(presetsRoot: string, templateName: string): string {
  // 1. まず「相対パスとして」そのまま試す
  const directPath = path.join(presetsRoot, templateName)
  if (fs.existsSync(directPath)) {
    return path.relative(presetsRoot, directPath).replace(/\\/g, '/')
  }

  // 2. ダメなら「ファイル名だけ」に落として再帰探索
  const fileName = path.basename(templateName)
  const fullPath = findJsonPathRecursive(presetsRoot, fileName)
  if (!fullPath) {
    throw new Error(`JSON not found for template: ${templateName}`)
  }

  return path.relative(presetsRoot, fullPath).replace(/\\/g, '/')
}

/**
 * presets 以下を再帰的に探索し、<templateName>.json を探す
 */
function findJsonPathRecursive(root: string, targetFileName: string): string | null {
  const entries = fs.readdirSync(root, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name)

    if (entry.isDirectory()) {
      const result = findJsonPathRecursive(fullPath, targetFileName)
      if (result) return result
    } else if (entry.isFile() && entry.name === targetFileName) {
      return fullPath
    }
  }

  return null
}
