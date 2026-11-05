// tools/viteBuild/definePackage.ts
import path from 'path'
import { fileURLToPath } from 'url'
import { PackageDefinition, PackageProject, PackageVariant } from '@tools/types'

/**
 * パッケージ定義を作る (packages/<category>/<key>/build.ts から呼ぶ)
 * key / category / エントリーの場所は、build.ts のあるフォルダから決まる
 *
 * @param buildFileUrl 呼び出し元の `import.meta.url`
 */
export function definePackage(
  buildFileUrl: string,
  project: PackageProject,
  variants: PackageVariant[]
): PackageDefinition {
  if (variants.length === 0) throw new Error(`[Package] variants が空です: ${buildFileUrl}`)

  const dir = path.dirname(fileURLToPath(buildFileUrl))
  return { key: path.basename(dir), category: path.basename(path.dirname(dir)), dir, project, variants }
}
