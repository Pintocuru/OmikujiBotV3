// server/adapters/expressAdapter.ts
import path from 'path'
import { Request, Response, Application } from 'express'
import { RequestContext, UnifiedRequest, ApiResult } from '@server/types'
import { routeRequest } from '@server/core/router'
import { SERVER_ROOT } from '@server/constants'
import { HTTP } from '@server/core/constants'
import { listImageRootDirs } from '@server/core/services/fileSystemService'

// 開発: リポジトリ直下の assets/Characters (直下の中間フォルダが、それぞれ1つの画像ルート)
const CHARACTERS_DIR = path.join(path.dirname(SERVER_ROOT), 'assets', 'Characters')

/**
 * Express(開発用)の実行環境
 */
const EXPRESS_CONTEXT: RequestContext = {
  omikujiOutputDir: SERVER_ROOT,
  soundsDir: path.join(path.dirname(SERVER_ROOT), 'assets', 'sounds'), // 開発: リポジトリ直下の assets/sounds
  // 中間フォルダの追加に追従するため、リクエストのたびに読み直す
  get imagesDirs() {
    return listImageRootDirs(CHARACTERS_DIR)
  },
  allowMock: true, // 開発サーバーにはわんコメがないため、ダミーデータを追加するアクションを許可する
}

/**
 * Expressルートのセットアップ
 */
export function setupExpressRoutes(app: Application): void {
  app.get('/api', handleApiRequest)
  app.post('/api', handleApiRequest)
}

/**
 * GET / POST 共通のハンドラー
 */
async function handleApiRequest(req: Request, res: Response): Promise<void> {
  try {
    const result = await routeRequest(adaptExpressRequest(req), EXPRESS_CONTEXT)
    sendUnifiedResponse(res, result)
  } catch (error) {
    console.error(`Express ${req.method} error:`, error)
    res.status(HTTP.INTERNAL_ERROR).json({
      code: HTTP.INTERNAL_ERROR,
      response: JSON.stringify({ error: 'Internal server error' }),
    })
  }
}

/**
 * ExpressリクエストをUnifiedRequest形式に変換
 */
function adaptExpressRequest(req: Request): UnifiedRequest {
  return {
    method: req.method as UnifiedRequest['method'],
    action: (req.query.action as string) || '',
    params: req.query as Record<string, string>,
    body: req.body || {},
  }
}

/**
 * UnifiedResponseをExpressレスポンスとして送信
 */
function sendUnifiedResponse(res: Response, result: ApiResult): void {
  // わんコメプラグイン仕様に合わせた形式で返す
  res.status(HTTP.OK).json({
    code: result.code,
    response: JSON.stringify(result.data),
  })
}
