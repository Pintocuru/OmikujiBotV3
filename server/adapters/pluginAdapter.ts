// server/adapters/pluginAdapter.ts
import { PluginRequest, PluginResponse } from '@onecomme.com/onesdk/types/Plugin'
import { RequestContext, UnifiedRequest } from '@server/types'
import { routeRequest } from '@server/core/router'
import { SERVER_ROOT } from '@server/constants'
import { HTTP } from '@server/core/constants'

/**
 * プラグインの実行環境: omikujiData.js はプラグインと同じ位置(server)に出力する
 */
const PLUGIN_CONTEXT: RequestContext = {
  omikujiOutputDir: SERVER_ROOT,
}

/**
 * わんコメプラグイン用のリクエストハンドラー
 */
export async function pluginRequest(req: PluginRequest): Promise<PluginResponse> {
  try {
    // 統一形式に変換
    const unifiedReq = adaptPluginRequest(req)

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
      response: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}

/**
 * プラグインリクエストを統一形式に変換
 */
function adaptPluginRequest(req: PluginRequest): UnifiedRequest {
  // bodyをパース
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {})

  return {
    method: req.method,
    action: req.params?.action || '',
    params: req.params || {},
    body,
  }
}
