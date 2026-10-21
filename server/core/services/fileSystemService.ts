// server/core/services/fileSystemService.ts
import fs from 'fs/promises'
import path from 'path'
import { FileItem } from '@server/types'
import { ensureDirectory } from './directoryService'
import { generateJsContent } from '@/common/presetsExport/generateContent'
import { SERVER_ROOT } from '@server/constants'
import { FILE_NAME, INVALID_PATH_CODE } from '@server/core/constants'

/**
 * rootName から基準ディレクトリを解決（null なら server 直下）
 */
function resolveBaseDir(rootName: string | null): string {
  return rootName ? path.join(SERVER_ROOT, rootName) : SERVER_ROOT
}

/**
 * baseDir 配下に収まるパスを解決する。
 * 配下から外れる場合は INVALID_PATH_CODE のエラーを投げる（多層防御）。
 */
function resolveSafePath(baseDir: string, fileName: string): string {
  const resolved = path.resolve(baseDir, fileName)
  const relative = path.relative(baseDir, resolved)
  const isOutside =
    relative === '' || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)
  if (isOutside) {
    const error: NodeJS.ErrnoException = new Error(`Path is outside of base directory: ${fileName}`)
    error.code = INVALID_PATH_CODE
    throw error
  }
  return resolved
}

/**
 * ファイル一覧を再帰的に取得（フォルダネスト対応）
 */
export async function getFileList(rootName: string | null): Promise<FileItem[]> {
  try {
    const baseDir = resolveBaseDir(rootName)
    await ensureDirectory(baseDir)

    const results = await collectJsonFiles(baseDir, baseDir)
    return results.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
  } catch (error) {
    console.error('Error getting file list:', error)
    return []
  }
}

/**
 * 再帰的にJSONファイルを収集
 * @param currentDir 現在探索中のディレクトリ
 * @param baseDir ルートディレクトリ（相対パス計算用）
 */
async function collectJsonFiles(currentDir: string, baseDir: string): Promise<FileItem[]> {
  const entries = await fs.readdir(currentDir, { withFileTypes: true })
  const results: FileItem[] = []

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name)

    if (entry.isDirectory()) {
      // サブフォルダを再帰探索
      const nested = await collectJsonFiles(fullPath, baseDir)
      results.push(...nested)
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      const stats = await fs.stat(fullPath)
      // baseDir からの相対パスを name として返す（例: "folder/file.json"）
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
      results.push({
        name: relativePath,
        modified: stats.mtime.toISOString(),
      })
    }
  }

  return results
}

/**
 * ファイルを移動（リネーム）
 */
export async function moveFile(rootName: string | null, fromName: string, toName: string): Promise<void> {
  const dir = resolveBaseDir(rootName)

  const fromPath = resolveSafePath(dir, fromName)
  const toPath = resolveSafePath(dir, toName)

  // 移動先フォルダを作成
  await ensureDirectory(path.dirname(toPath))
  await fs.rename(fromPath, toPath)
}

/**
 * ファイルを読み込み
 */
export async function loadFile(rootName: string | null, fileName: string): Promise<any> {
  const filePath = resolveSafePath(resolveBaseDir(rootName), fileName)
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}

/**
 * JSONファイルを保存
 */
export async function saveFile(rootName: string | null, fileName: string, data: string): Promise<void> {
  const dir = resolveBaseDir(rootName)
  const filePath = resolveSafePath(dir, fileName)

  await ensureDirectory(path.dirname(filePath))
  await fs.writeFile(filePath, data, 'utf8')
}

/**
 * ファイルを削除
 */
export async function deleteFile(rootName: string | null, fileName: string): Promise<void> {
  const filePath = resolveSafePath(resolveBaseDir(rootName), fileName)
  await fs.unlink(filePath)
}

/**
 * おみくじデータをJSファイルとして保存
 * @param outputDir 出力先ディレクトリ
 * @returns 実際に書き込んだファイルの、server の親ディレクトリからの相対パス (例: "server/omikujiData.js")
 */
export async function saveOmikujiData(configData: string, outputDir: string): Promise<string> {
  const jsContent = generateJsContent(configData)

  await ensureDirectory(outputDir)
  const filePath = path.join(outputDir, FILE_NAME.omikujiData)
  await fs.writeFile(filePath, jsContent, 'utf8')

  return path.relative(path.dirname(SERVER_ROOT), filePath).replace(/\\/g, '/')
}

/**
 * 指定フォルダが空なら削除する（rootName 直下の1階層のみ）
 */
export async function deleteEmptyFolder(rootName: string, folderName: string): Promise<void> {
  const folderPath = resolveSafePath(resolveBaseDir(rootName), folderName)
  try {
    const entries = await fs.readdir(folderPath)
    if (entries.length === 0) {
      await fs.rmdir(folderPath)
      console.info(`🗂️ Removed empty folder: ${folderName}`)
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error
  }
}
