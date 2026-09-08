// tools/webpackBuild/utils/BuildMetaStore.ts
import fs from 'fs'
import path from 'path'
import { BuildMeta } from '../BuildTypes'

function getMetaPath(packageRoot: string, outputFolderName: string) {
  return path.join(packageRoot, 'dist', '_build-meta', `${outputFolderName}.json`)
}

export function loadBuildMeta(packageRoot: string, outputFolderName: string): BuildMeta | null {
  const metaPath = getMetaPath(packageRoot, outputFolderName)
  if (!fs.existsSync(metaPath)) return null
  return JSON.parse(fs.readFileSync(metaPath, 'utf-8'))
}

export function saveBuildMeta(packageRoot: string, outputFolderName: string, meta: BuildMeta): void {
  const metaPath = getMetaPath(packageRoot, outputFolderName)
  fs.mkdirSync(path.dirname(metaPath), { recursive: true })
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2))
}
