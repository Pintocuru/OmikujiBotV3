// server/core/handlers/generatorHandler.ts
import { ApiResult } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { validatePackageFileName } from '@server/core/utils/validation'
import { ok, badRequest, guard } from '@server/core/utils/result'
import { DIR_NAME, FILE_NAME } from '@server/core/constants'

/**
 * fileName から保存先(ディレクトリ, ファイル名)を決定する
 * fileName 未指定なら server 直下の generator.json
 */
function resolveTarget(fileName?: string | null): { dir: string | null; name: string } {
  return fileName ? { dir: DIR_NAME.packages, name: fileName } : { dir: null, name: FILE_NAME.generator }
}

/**
 * Generator設定を読み込み
 */
export async function loadGeneratorConfig(fileName: string | null): Promise<ApiResult> {
  if (fileName && !validatePackageFileName(fileName)) return badRequest('Invalid file name')

  const { dir, name } = resolveTarget(fileName)

  return guard(
    'Load generator',
    'Failed to load generator config',
    async () => {
      const data = await fileSystem.loadFile(dir, name)
      console.info(`📖 Loaded generator config: ${name}`)
      return ok(data)
    },
    { notFound: 'Generator config not found' }
  )
}

/**
 * packages に保存されている Generator 設定の一覧を取得
 */
export async function listPackages(): Promise<ApiResult> {
  return guard('List packages', 'Failed to list packages', async () => {
    const files = await fileSystem.getFileList(DIR_NAME.packages)
    return ok(files)
  })
}

/**
 * packages に保存されている Generator 設定を削除
 * (fileName 必須。server 直下の generator.json は対象外)
 */
export async function deletePackage(fileName: string): Promise<ApiResult> {
  if (!fileName) return badRequest('fileName is required')
  if (!validatePackageFileName(fileName)) return badRequest('Invalid file name')

  return guard(
    'Delete package',
    'Failed to delete package',
    async () => {
      await fileSystem.deleteFile(DIR_NAME.packages, fileName)
      console.info(`🗑️ Deleted package: ${fileName}`)
      return ok({ message: 'Package deleted successfully', fileName })
    },
    { notFound: 'Package not found' }
  )
}

/**
 * Generator設定を保存
 */
export async function saveGeneratorConfig(data: string, fileName?: string | null): Promise<ApiResult> {
  if (!data) return badRequest('data is required')
  if (fileName && !validatePackageFileName(fileName)) return badRequest('Invalid file name')

  const { dir, name } = resolveTarget(fileName)

  return guard('Save generator', 'Failed to save generator config', async () => {
    await fileSystem.saveFile(dir, name, data)
    console.info(`💾 Saved generator config: ${name}`)
    return ok({ message: 'Generator config saved successfully', fileName: name })
  })
}
