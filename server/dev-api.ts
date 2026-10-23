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
  app.use(cors())
  app.use(express.json({ limit: DEV_API.bodyLimit }))
  app.use(logMiddleware)

  // ルート設定
  setupExpressRoutes(app)

  // サーバー起動
  server = app.listen(port, () => {
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
