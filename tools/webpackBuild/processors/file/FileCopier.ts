// shared/utils/webpackBuild/processors/file/FileCopier.ts
import { promises } from 'fs'
import fs from 'fs-extra'
import path from 'path'
import { CopyFileItem } from '../../BuildTypes'

/**
 * CopyFileItem のファイルをコピー(Webpack の CopyFileItem の代用)
 */
export const copyFiles = async (files: CopyFileItem[], packageRoot: string, outputDir: string): Promise<void> => {
  const distPath = outputDir ? path.join(packageRoot, 'dist', outputDir) : path.join(packageRoot, 'dist')

  for (const item of files) {
    const from = typeof item === 'string' ? item : item.from
    const to = typeof item === 'string' ? path.basename(item) : item.to

    const src = path.resolve(packageRoot, from)
    const dest = path.resolve(distPath, to)

    await promises.mkdir(path.dirname(dest), { recursive: true })
    await promises.cp(src, dest, { recursive: true })
    console.log(`[Copy] ${src} -> ${dest}`)
  }
}

/**
 * Distのファイルを削除
 */
export const cleanOutputDir = async (packageRoot: string, outputSubDir: string): Promise<string> => {
  const distPath = path.join(packageRoot, 'dist', outputSubDir)

  // フォルダごと削除
  try {
    await promises.rm(distPath, { recursive: true, force: true })
    console.log(`[Clean] Removed existing folder: ${distPath}`)
  } catch (e) {
    // force:true なのでエラーにはなりにくいが念のため
    console.warn(`[Clean] Failed to remove folder (ignored): ${distPath}`, e)
  }

  // 再作成
  await promises.mkdir(distPath, { recursive: true })
  console.log(`[Clean] Created fresh folder: ${distPath}`)

  return distPath
}

/**
 * ディレクトリ全体をコピー
 */
export async function copyDirectory(src: string, dest: string): Promise<void> {
  try {
    await fs.ensureDir(dest)
    await fs.copy(src, dest, {
      overwrite: true, // node_modules 等の不要なファイルは除外
      filter: (src, dest) => {
        const relativePath = path.relative(src, dest)
        return !relativePath.includes('node_modules') && !relativePath.includes('.git') && !relativePath.startsWith('.')
      },
    })
    console.log(`[FileCopier] Directory copied: ${src} -> ${dest}`)
  } catch (error) {
    console.error(`[FileCopier] Failed to copy directory: ${src} -> ${dest}`, error)

    throw error
  }
}

/**
 * ディレクトリ全体を再帰的にコピーする新しい関数
 * @param src コピー元ディレクトリパス
 * @param dest コピー先ディレクトリパス
 */
export const copyDirectoryRecursive = async (src: string, dest: string): Promise<void> => {
  try {
    await fs.ensureDir(dest)
    await fs.copy(src, dest, {
      overwrite: true,
    })
    console.log(`[Copy] Copied directory recursively: ${src} -> ${dest}`)
  } catch (error) {
    console.error(`[Copy Error] Failed to copy directory: ${src} -> ${dest}`, error)
    throw error
  }
}
