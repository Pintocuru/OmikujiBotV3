// tools/viteBuild/processors/file/FileCopier.ts
import { promises } from 'fs'
import path from 'path'
import { CopyFileItem } from '@tools/viteBuild/types'

/**
 * CopyFileItem のファイルをコピー
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
