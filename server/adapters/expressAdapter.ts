// server/adapters/expressAdapter.ts
import { Request, Response, Application } from 'express'
import { RequestContext, UnifiedRequest, ApiResult } from '@server/types'
import { routeRequest } from '@server/core/router'
import { SERVER_ROOT } from '@server/constants'
import path from 'path'
import { HTTP } from '@server/core/constants'

/**
 * Express(開発用)の実行環境
 */
const EXPRESS_CONTEXT: RequestContext = {
  omikujiOutputDir: path.join(SERVER_ROOT, 'data'),
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
  const params = toStringParams(req.query)
  return {
    method: req.method as UnifiedRequest['method'],
    action: params.action || '',
    params,
    body: req.body || {},
  }
}

/**
 * クエリを string だけにそろえる
 * ?a=1&a=2 は配列、?a[b]=1 はオブジェクトになるため、型 (Record<string, string>) と実体がずれる。
 * 配列は最初の値を使い、オブジェクトは捨てる (わんコメプラグインは常に string で渡す)
 */
function toStringParams(query: Request['query']): Record<string, string> {
  const params: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    const first = Array.isArray(value) ? value[0] : value
    if (typeof first === 'string') params[key] = first
  }
  return params
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
