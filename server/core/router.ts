// server/core/router.ts
import { ApiResult, RequestContext, UnifiedRequest } from '@server/types'
import * as configHandler from './handlers/configHandler'
import * as generatorHandler from './handlers/generatorHandler'
import * as omikujiHandler from './handlers/omikujiHandler'
import * as gameStateHandler from './handlers/gameStateHandler'
import * as userStatsHandler from './handlers/userStatsHandler'
import * as padHandler from './handlers/padHandler'
import { API_ACTION } from '@server/api/actions'
import { HTTP } from './constants'
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
    case API_ACTION.health.action:
      return ok({ status: 'OK', message: 'API is running' })

    case API_ACTION.list.action:
      return configHandler.listFiles()

    case API_ACTION.load.action:
      return configHandler.loadConfig(params.fileName)

    case API_ACTION.loadGenerator.action:
      return generatorHandler.loadGeneratorConfig(params.fileName ?? null)

    case API_ACTION.listPackages.action:
      return generatorHandler.listPackages()

    case API_ACTION.listGameStates.action:
      return gameStateHandler.listGameStates()

    case API_ACTION.loadGameState.action:
      return gameStateHandler.loadGameState(params.streamId, params.eventKey)

    case API_ACTION.loadUserStats.action:
      return userStatsHandler.loadUserStats(params.since)

    case API_ACTION.loadUsers.action:
      return userStatsHandler.loadUsers()

    case API_ACTION.loadPadStatus.action:
      return padHandler.loadPadStatus(params.since)

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
    case API_ACTION.move.action:
      return configHandler.moveConfig(body.fromName, body.toName)

    case API_ACTION.save.action:
      return configHandler.saveConfig(body.fileName, body.data)

    case API_ACTION.delete.action:
      return configHandler.deleteConfig(params.fileName || body.fileName)

    case API_ACTION.saveGenerator.action:
      return generatorHandler.saveGeneratorConfig(body.data, body.fileName)

    case API_ACTION.saveOmikuji.action:
      return omikujiHandler.saveOmikujiData(body.configData, ctx)

    case API_ACTION.appendGameLog.action:
      return gameStateHandler.appendGameLog(body)

    case API_ACTION.deleteGameState.action:
      return gameStateHandler.deleteGameState(params.streamId || body.streamId)

    case API_ACTION.updateUserStats.action:
      return userStatsHandler.updateUserStats(body)

    case API_ACTION.resetUserStats.action:
      return userStatsHandler.resetUserStats()

    case API_ACTION.addManualUser.action:
      return userStatsHandler.addManualUser(body)

    case API_ACTION.removeManualUser.action:
      return userStatsHandler.removeManualUser(body)

    case API_ACTION.resetUsers.action:
      return userStatsHandler.resetUsers()

    case API_ACTION.seedMockUsers.action:
      // 開発サーバー専用。プラグインでは、存在しないアクションと同じ応答にする
      if (!ctx.allowMock) return fail(HTTP.NOT_FOUND, `Unknown POST action: ${action}`)
      return userStatsHandler.seedMockUsers(body)

    case API_ACTION.triggerPad.action:
      return padHandler.triggerPad(body)

    default:
      return fail(HTTP.NOT_FOUND, `Unknown POST action: ${action}`)
  }
}
