// shared/utils/webpackBuild/utils/ZipBuilder.ts
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

/**
 * ビルドしたフォルダを個別にzipする
 */
export async function buildZipFolders(packageRoot: string, isRecordConfig: boolean): Promise<void> {
  const distRoot = path.resolve(packageRoot, 'dist')
  const zippedDir = path.resolve(packageRoot, 'dist', 'distZipped')

  if (!fs.existsSync(distRoot)) {
    console.warn(`dist ディレクトリが見つかりません: ${distRoot}`)
    return
  }

  // zippedフォルダが存在しない場合は作成
  if (!fs.existsSync(zippedDir)) {
    fs.mkdirSync(zippedDir, { recursive: true })
  }

  if (isRecordConfig) {
    // Record型：dist内のフォルダを個別にzip化
    const folders = fs
      .readdirSync(distRoot, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    if (folders.length === 0) {
      console.warn('zip化するフォルダが見つかりません')
      return
    }

    for (const folder of folders) {
      const folderPath = path.join(distRoot, folder)
      const zipName = `${folder}.zip`
      const zipPath = path.join(zippedDir, zipName)

      await zipFolder(folderPath, zipPath)
      console.log(`✔ ${zipName} を作成しました （複数出力）`)
    }
  } else {
    // 単体設定：dist全体をpackageRoot基準の名前でzip化
    const packageName = path.basename(packageRoot)
    const zipName = `${packageName}.zip`
    const zipPath = path.join(zippedDir, zipName)

    await zipFolder(distRoot, zipPath)
    console.log(`✔ ${zipName} を作成しました （単体）`)
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
