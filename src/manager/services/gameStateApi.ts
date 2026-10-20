// src/manager/services/gameStateApi.ts
import { API_ACTION } from '@server/api/actions'
import {
  GameStateListItemSchema,
  GameStateListItemType,
  GameStateSaveResponseSchema,
  GameStateSaveResponseType,
  GameStateType,
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
   * ゲームステートを保存 (state.eventKey の枠を丸ごと上書き)
   */
  async saveGameState(streamId: string, state: GameStateType): Promise<GameStateSaveResponseType> {
    const response = await this.post(API_ACTION.saveGameState.action, { streamId, state })
    this.validateResponse(response, 'ゲームステートの保存に失敗しました')

    return GameStateSaveResponseSchema.parse(response.data)
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
