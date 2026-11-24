// server/core/services/fileSystemService.ts
import fs from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'
import { FileItem } from '@server/types'
import { MetaDataSchema, type MetaDataType } from '@/types/core/MetaDataSchema'
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
 * ファイルを「全部書けたときだけ」置き換える (途中で落ちても、元のファイルは壊れない)
 * 同じ場所の一時ファイルに書き切ってから rename する。一時ファイルは .json で終わらないので、一覧には出ない
 */
async function writeFileAtomic(filePath: string, data: string): Promise<void> {
  const tmpPath = `${filePath}.${nanoid()}.tmp`
  try {
    const handle = await fs.open(tmpPath, 'w')
    try {
      await handle.writeFile(data, 'utf8')
      await handle.sync() // OS のキャッシュに残ったまま電源が落ちても、空のファイルにならないようにする
    } finally {
      await handle.close()
    }
    await renameWithRetry(tmpPath, filePath)
  } catch (error) {
    await fs.rm(tmpPath, { force: true }).catch(() => undefined)
    throw error
  }
}

const RENAME_RETRY_CODES = new Set(['EPERM', 'EBUSY', 'EACCES'])
const RENAME_MAX_RETRIES = 3

/**
 * rename を、失敗したら数回やり直す
 * Windows では、ウイルス対策ソフトなどが対象のファイルを一瞬つかむと、rename が失敗することがある
 */
async function renameWithRetry(from: string, to: string): Promise<void> {
  for (let attempt = 0; ; attempt++) {
    try {
      await fs.rename(from, to)
      return
    } catch (error: any) {
      if (attempt >= RENAME_MAX_RETRIES || !RENAME_RETRY_CODES.has(error?.code)) throw error
      await new Promise((resolve) => setTimeout(resolve, 50 * (attempt + 1)))
    }
  }
}

interface FileListOptions {
  /** 各ファイルの meta を読むか (既定: true)。読むには JSON 全体を解析するため、meta を使わない一覧では false にする */
  withMeta?: boolean
  /** サブフォルダも探すか (既定: true)。フォルダを使わない置き場 (packages など) では false にする */
  recursive?: boolean
}

/**
 * ファイル一覧を取得（既定では再帰的。フォルダネスト対応）
 * 読み取りに失敗したときは例外を投げる (空の一覧と区別するため。呼び出し側の guard が 500 にする)
 */
export async function getFileList(rootName: string | null, options: FileListOptions = {}): Promise<FileItem[]> {
  const { withMeta = true, recursive = true } = options
  const baseDir = resolveBaseDir(rootName)
  await ensureDirectory(baseDir)

  const results = await collectJsonFiles(baseDir, baseDir, withMeta, recursive)
  return results.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
}

/**
 * 再帰的にJSONファイルを収集
 * @param currentDir 現在探索中のディレクトリ
 * @param baseDir ルートディレクトリ（相対パス計算用）
 * @param withMeta meta も読むか
 * @param recursive サブフォルダも探すか
 */
async function collectJsonFiles(
  currentDir: string,
  baseDir: string,
  withMeta: boolean,
  recursive: boolean
): Promise<FileItem[]> {
  const entries = await fs.readdir(currentDir, { withFileTypes: true })
  const results: FileItem[] = []

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name)

    if (entry.isDirectory()) {
      if (!recursive) continue
      // サブフォルダを再帰探索 (探索中に消えたフォルダは飛ばす)
      const nested = await collectJsonFiles(fullPath, baseDir, withMeta, recursive).catch(skipVanished)
      if (nested) results.push(...nested)
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      // 探索中に消えたファイルは飛ばす
      const stats = await fs.stat(fullPath).catch(skipVanished)
      if (!stats) continue
      // baseDir からの相対パスを name として返す（例: "folder/file.json"）
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
      results.push({
        name: relativePath,
        modified: stats.mtime.toISOString(),
        meta: withMeta ? await readMeta(fullPath) : undefined,
      })
    }
  }

  return results
}

/** 探索中に消えたもの (ENOENT) は、一覧に含めず飛ばす。それ以外のエラーは投げ直す */
function skipVanished(error: any): undefined {
  if (error?.code === 'ENOENT') return undefined
  throw error
}

/**
 * meta だけを取り出す。壊れた JSON・meta なしでも一覧全体は失敗させない
 */
async function readMeta(fullPath: string): Promise<MetaDataType | undefined> {
  try {
    const parsed = JSON.parse(await fs.readFile(fullPath, 'utf8'))
    const result = MetaDataSchema.safeParse(parsed?.meta)
    return result.success ? result.data : undefined
  } catch {
    return undefined
  }
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target)
    return true
  } catch {
    return false
  }
}

/**
 * ファイルを移動（リネーム）
 * 移動先に同名のファイルがあるときは、上書きせず EEXIST のエラーを投げる
 */
export async function moveFile(rootName: string | null, fromName: string, toName: string): Promise<void> {
  const dir = resolveBaseDir(rootName)

  const fromPath = resolveSafePath(dir, fromName)
  const toPath = resolveSafePath(dir, toName)

  // 移動元がなければ ENOENT。移動先に同名のファイルがあれば、上書きせず EEXIST にする
  await fs.stat(fromPath)
  if (fromPath !== toPath && (await pathExists(toPath))) {
    const error: NodeJS.ErrnoException = new Error(`Destination already exists: ${toName}`)
    error.code = 'EEXIST'
    throw error
  }

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
  await writeFileAtomic(filePath, data)
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
  await writeFileAtomic(filePath, jsContent)

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
