// server/dev-api.ts
import express, { Request, Response, Application, NextFunction } from 'express'
import cors from 'cors'
import { Server } from 'http'
import { setupExpressRoutes } from './adapters/expressAdapter'
import path from 'path'
import { SERVER_ROOT } from './constants'
import { DEV_API, DIR_NAME } from './core/constants'
import { seedCommentUsers } from './core/services/userListService'
import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'

let server: Server | null = null

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]'])

// Origin / Host が、自分の PC (localhost) のものか
function isLocalUrl(value: string): boolean {
  try {
    return LOCAL_HOSTNAMES.has(new URL(value).hostname)
  } catch {
    return false
  }
}

/**
 * 他のサイトからの呼び出しを断る
 * - Origin: 他のサイトのページから fetch されると、ブラウザが付ける。
 *   CORS は「結果を読ませない」だけで、リクエスト自体は届く。?action=delete&fileName=... のようにクエリだけで動く POST は
 *   プリフライトなしで届くため、cors() だけでは防げない。
 * - Host: DNS リバインディング対策
 */
function localOnlyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const { host, origin } = req.headers
  if (!host || !isLocalUrl(`http://${host}`) || (origin !== undefined && !isLocalUrl(origin))) {
    res.status(403).json({ code: 403, response: JSON.stringify({ error: 'Forbidden' }) })
    return
  }
  next()
}

// 開発用APIサーバーを起動
export function startDevApiServer(): Server | null {
  if (server) {
    console.log('⚠️ Dev API server is already running')
    return server
  }

  const app: Application = express()
  const port = DEV_API.port

  // 開発サーバーにはわんコメがなく、コメントを受け取れないため、ダミーのユーザーを入れておく
  seedCommentUsers(generateDummyUserStats(DEV_API.dummyUserCount))

  // ミドルウェア設定
  app.use(localOnlyMiddleware)
  app.use(cors({ origin: (origin, callback) => callback(null, !origin || isLocalUrl(origin)) }))
  app.use(express.json({ limit: DEV_API.bodyLimit }))
  app.use(logMiddleware)

  // ルート設定
  setupExpressRoutes(app)

  // サーバー起動
  server = app.listen(port, DEV_API.host, () => {
    console.log(`🚀 Dev API server running on http://localhost:${port}`)
    console.log(`📁 Config files directory: ${path.join(SERVER_ROOT, DIR_NAME.data)}`)
  })

  // プロセス終了時の処理
  process.on('SIGTERM', () => {
    if (server) {
      server.close()
      server = null
    }
  })

  return server
}

// ログ用ミドルウェア
function logMiddleware(req: Request, res: Response, next: NextFunction): void {
  console.log(`[DEV API] ${req.method} ${req.path}`)
  next()
}
