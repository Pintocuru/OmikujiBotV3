// server/adapters/pluginAdapter.ts
import { PluginRequest, PluginResponse } from '@onecomme.com/onesdk/types/Plugin'
import { RequestContext, UnifiedRequest } from '@server/types'
import { routeRequest } from '@server/core/router'
import { SERVER_ROOT } from '@server/constants'
import path from 'path'
import { HTTP } from '@server/core/constants'

/**
 * プラグインの実行環境: omikujiData.js はプラグインと同じ位置(server)に出力する
 */
const PLUGIN_CONTEXT: RequestContext = {
  omikujiOutputDir: path.join(SERVER_ROOT, 'data'),
}

/**
 * わんコメプラグイン用のリクエストハンドラー
 */
export async function pluginRequest(req: PluginRequest): Promise<PluginResponse> {
  try {
    // 統一形式に変換
    const unifiedReq = adaptPluginRequest(req)
    if (!unifiedReq) return badBodyResponse()

    // コアルーターで処理
    const result = await routeRequest(unifiedReq, PLUGIN_CONTEXT)

    // プラグイン形式のレスポンスに変換
    return {
      code: result.code,
      response: JSON.stringify(result.data),
    }
  } catch (error) {
    console.error('Plugin request error:', error)
    return {
      code: HTTP.INTERNAL_ERROR,
      response: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}

/**
 * body が読めないときの応答 (500 ではなく 400)
 */
function badBodyResponse(): PluginResponse {
  return {
    code: HTTP.BAD_REQUEST,
    response: JSON.stringify({ error: 'Invalid JSON body' }),
  }
}

/**
 * body を読む。空文字・未指定は {}、JSON として読めないときは null
 * (オブジェクトかどうかは、ルーターが POST のときに確認する)
 */
function parseBody(raw: unknown): Record<string, any> | null {
  if (raw === undefined || raw === null) return {}
  if (typeof raw !== 'string') return raw as Record<string, any>
  if (raw.trim() === '') return {}
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * プラグインリクエストを統一形式に変換
 * body が JSON として読めないときは null を返す
 */
function adaptPluginRequest(req: PluginRequest): UnifiedRequest | null {
  const body = parseBody(req.body)
  if (body === null) return null

  return {
    method: req.method,
    action: req.params?.action || '',
    params: req.params || {},
    body,
  }
}
