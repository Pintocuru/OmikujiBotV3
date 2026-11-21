// tools/viteConfig/imageAssetsPlugin.ts
import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

/**
 * /images/{name} へのリクエストを (ビルド後の images/ と同じ URL)
 * assets/images/ 下の common/ または YYYY-QN/ フォルダから探して返すプラグイン
 */
export function imageAssetsPlugin(projectRoot: string): Plugin {
  const imagesDir = path.resolve(projectRoot, 'assets/images')

  return {
    name: 'image-assets-fallback',
    apply: 'serve', // 開発サーバのみ
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const PREFIX = '/images/' // 公開 URL (ビルド後の root/images と同じ)
        const SRC_PREFIX = '/assets/images/' // 実ファイルの置き場所
        if (!req.url?.startsWith(PREFIX)) return next()

        const relativePath = req.url.slice(PREFIX.length).split('?')[0]

        // すでに中間フォルダ付きのパスならそのまま実ファイルへ
        if (relativePath.includes('/') && isIntermediateFolder(relativePath.split('/')[0])) {
          req.url = `${SRC_PREFIX}${relativePath}`
          return next()
        }

        // 中間フォルダ候補を動的に取得（フォルダ追加時に自動対応
        const candidates = getIntermediateFolders(imagesDir)
        for (const folder of candidates) {
          const fullPath = path.resolve(imagesDir, folder, relativePath)
          if (fs.existsSync(fullPath)) {
            req.url = `${SRC_PREFIX}${folder}/${relativePath}`
            return next()
          }
        }

        next() // 見つからなければ通常の404
      })
    },
  }
}

/** assets/images/ 直下のフォルダ一覧を動的に取得*/
function getIntermediateFolders(imagesDir: string): string[] {
  if (!fs.existsSync(imagesDir)) return []
  return fs
    .readdirSync(imagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && isIntermediateFolder(d.name))
    .map((d) => d.name)
}

/** 中間フォルダかの判定*/
function isIntermediateFolder(name: string): boolean {
  return name === 'common' || name === 'wip' || /^\d{4}-Q\d+$/.test(name)
}
