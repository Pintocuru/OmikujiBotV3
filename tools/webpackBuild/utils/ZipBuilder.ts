// tools/webpackBuild/utils/ZipBuilder.ts
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

/**
 * ビルドしたフォルダを個別にzipする
 */
export async function buildZipFolders(packageRoot: string): Promise<void> {
  const distRoot = path.resolve(packageRoot, 'dist')
  const zippedDir = path.resolve(distRoot, 'distZipped')

  if (!fs.existsSync(distRoot)) {
    console.warn(`dist ディレクトリが見つかりません: ${distRoot}`)
    return
  }

  fs.mkdirSync(zippedDir, { recursive: true })

  // dist 直下のフォルダを個別に zip 化(出力先の distZipped は除外)
  const folders = fs
    .readdirSync(distRoot, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== 'distZipped')
    .map((dirent) => dirent.name)

  if (folders.length === 0) {
    console.warn('zip化するフォルダが見つかりません')
    return
  }

  for (const folder of folders) {
    const zipName = `${folder}.zip`
    await zipFolder(path.join(distRoot, folder), path.join(zippedDir, zipName))
    console.log(`✔ ${zipName} を作成しました`)
  }
}

function zipFolder(sourceDir: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', resolve)
    archive.on('error', reject)

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}
