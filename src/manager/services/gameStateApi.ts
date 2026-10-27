// src/manager/services/gameStateApi.ts
import { API_ACTION } from '@server/api/actions'
import {
  GameLogAppendResponseSchema,
  GameLogAppendResponseType,
  GameLogType,
  GameStateListItemSchema,
  GameStateListItemType,
  StreamGameFileSchema,
  StreamGameFileType,
} from '@/types/api'
import { BaseApiClient } from './baseApiClient'

/**
 * 配信ごとのゲームステート (server/streams/<streamId>.json) の API
 */
class GameStateApiService extends BaseApiClient {
  /**
   * 保存済みの配信一覧 (更新日時の新しい順)
   */
  async listGameStates(): Promise<GameStateListItemType[]> {
    const response = await this.get<unknown[]>(API_ACTION.listGameStates.action)
    this.validateResponse(response, 'ゲームステート一覧の取得に失敗しました')

    return response.data.map((item) => GameStateListItemSchema.parse(item))
  }

  /**
   * 1配信ぶんを取得 (存在しない場合は null)
   * eventKey を指定すると、その eventKey の GameState だけが states に入る
   */
  async loadGameState(streamId: string, eventKey?: string): Promise<StreamGameFileType | null> {
    const response = await this.get(API_ACTION.loadGameState.action, { streamId, eventKey })
    if (response.code === 404) return null
    this.validateResponse(response, 'ゲームステートの読み込みに失敗しました')

    return StreamGameFileSchema.parse(response.data)
  }

  /**
   * ログを1件追記 (統計はサーバ側で更新。同じ log.id は無視され、appended が false になる)
   */
  async appendGameLog(streamId: string, eventKey: string, log: GameLogType): Promise<GameLogAppendResponseType> {
    const response = await this.post(API_ACTION.appendGameLog.action, { streamId, eventKey, log })
    this.validateResponse(response, 'ゲームログの追記に失敗しました')

    return GameLogAppendResponseSchema.parse(response.data)
  }

  /**
   * 1配信ぶんを削除
   */
  async deleteGameState(streamId: string): Promise<void> {
    const response = await this.post(API_ACTION.deleteGameState.action, { streamId })
    this.validateResponse(response, 'ゲームステートの削除に失敗しました')
  }
}

export const gameStateApi = new GameStateApiService()
