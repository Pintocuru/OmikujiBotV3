// server/core/router.ts
import { ApiResult, RequestContext, UnifiedRequest } from '@server/types'
import * as configHandler from './handlers/configHandler'
import * as generatorHandler from './handlers/generatorHandler'
import * as omikujiHandler from './handlers/omikujiHandler'
import { GET_ACTION, POST_ACTION, HTTP } from './constants'
import { ok, fail, badRequest } from './utils/result'

/**
 * 統合ルーター
 * プラグインとExpressの両方から使用される
 * @param ctx 呼び出し元ごとの実行環境(保存先など)
 */
export async function routeRequest(req: UnifiedRequest, ctx: RequestContext): Promise<ApiResult> {
  const { method, action, params, body } = req

  // アクションが必須
  if (!action) {
    return badRequest('action parameter is required')
  }

  // メソッド別にルーティング
  if (method === 'GET') {
    return handleGetRequest(action, params)
  }

  if (method === 'POST') {
    return handlePostRequest(action, params, body, ctx)
  }

  return fail(HTTP.METHOD_NOT_ALLOWED, `Method ${method} not allowed`)
}

/**
 * GETリクエストのルーティング
 */
async function handleGetRequest(action: string, params: Record<string, string>): Promise<ApiResult> {
  switch (action) {
    case GET_ACTION.health:
      return ok({ status: 'OK', message: 'API is running' })

    case GET_ACTION.list:
      return configHandler.listFiles()

    case GET_ACTION.load:
      return configHandler.loadConfig(params.fileName)

    case GET_ACTION.loadGenerator:
      return generatorHandler.loadGeneratorConfig(params.fileName ?? null)

    default:
      return fail(HTTP.NOT_FOUND, `Unknown GET action: ${action}`)
  }
}

/**
 * POSTリクエストのルーティング
 */
async function handlePostRequest(
  action: string,
  params: Record<string, string>,
  body: Record<string, any>,
  ctx: RequestContext
): Promise<ApiResult> {
  switch (action) {
    case POST_ACTION.move:
      return configHandler.moveConfig(body.fromName, body.toName)

    case POST_ACTION.save:
      return configHandler.saveConfig(body.fileName, body.data)

    case POST_ACTION.delete:
      return configHandler.deleteConfig(params.fileName || body.fileName)

    case POST_ACTION.saveGenerator:
      return generatorHandler.saveGeneratorConfig(body.data, body.fileName)

    case POST_ACTION.saveOmikuji:
      return omikujiHandler.saveOmikujiData(body.configData, ctx)

    default:
      return fail(HTTP.NOT_FOUND, `Unknown POST action: ${action}`)
  }
}
