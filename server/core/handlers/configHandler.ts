// server/core/handlers/configHandler.ts
import { ApiResult } from '@server/types'
import * as fileSystem from '@server/core/services/fileSystemService'
import { validateFileName } from '@server/core/utils/validation'
import { ok, badRequest, guard } from '@server/core/utils/result'
import { DIR_NAME } from '@server/core/constants'

const NOT_FOUND_MESSAGE = 'File not found'

/**
 * ファイル一覧を取得
 */
export async function listFiles(): Promise<ApiResult> {
  return guard('List files', 'Failed to list files', async () => {
    const files = await fileSystem.getFileList(DIR_NAME.data)
    return ok(files)
  })
}

/**
 * 設定ファイルを読み込み
 */
export async function loadConfig(fileName: string): Promise<ApiResult> {
  if (!fileName) return badRequest('fileName is required')
  if (!validateFileName(fileName)) return badRequest('Invalid file name')

  return guard(
    'Load file',
    'Failed to load file',
    async () => {
      const data = await fileSystem.loadFile(DIR_NAME.data, fileName)
      console.info(`📖 Loaded config file: ${fileName}`)
      return ok(data)
    },
    { notFound: NOT_FOUND_MESSAGE }
  )
}

/**
 * 設定ファイルを移動
 */
export async function moveConfig(fromName: string, toName: string): Promise<ApiResult> {
  if (!fromName || !toName) return badRequest('fromName and toName are required')
  if (!validateFileName(fromName) || !validateFileName(toName)) return badRequest('Invalid file name')

  return guard(
    'Move file',
    'Failed to move file',
    async () => {
      await fileSystem.moveFile(DIR_NAME.data, fromName, toName)
      await removeEmptyParentFolder(fromName)

      console.info(`📦 Moved config file: ${fromName} → ${toName}`)
      return ok({ message: 'File moved successfully', fromName, toName })
    },
    { notFound: NOT_FOUND_MESSAGE }
  )
}

/**
 * 設定ファイルを保存
 */
export async function saveConfig(fileName: string, data: string): Promise<ApiResult> {
  if (!fileName || !data) return badRequest('fileName and data are required')
  if (!validateFileName(fileName)) return badRequest('Invalid file name')

  return guard('Save file', 'Failed to save file', async () => {
    await fileSystem.saveFile(DIR_NAME.data, fileName, data)
    console.info(`💾 Saved config file: ${fileName}`)
    return ok({ message: 'File saved successfully', fileName })
  })
}

/**
 * 設定ファイルを削除
 */
export async function deleteConfig(fileName: string): Promise<ApiResult> {
  if (!fileName) return badRequest('fileName is required')
  if (!validateFileName(fileName)) return badRequest('Invalid file name')

  return guard(
    'Delete file',
    'Failed to delete file',
    async () => {
      await fileSystem.deleteFile(DIR_NAME.data, fileName)
      await removeEmptyParentFolder(fileName)

      console.info(`🗑️ Deleted config file: ${fileName}`)
      return ok({ message: 'File deleted successfully', fileName })
    },
    { notFound: NOT_FOUND_MESSAGE }
  )
}

/**
 * ファイルの親フォルダ(1階層目)が空になっていたら削除
 */
async function removeEmptyParentFolder(fileName: string): Promise<void> {
  const folder = fileName.includes('/') ? fileName.split('/')[0] : null
  if (folder) {
    await fileSystem.deleteEmptyFolder(DIR_NAME.data, folder)
  }
}
