// src/manager/services/gameConfigApi.ts
import { API_ACTION } from '@server/api/actions'
import {
  LoadGameConfigResponseSchema,
  SaveGameConfigResponseSchema,
  type GameConfigValueType,
  type SaveGameConfigResponseType,
} from '@/types/api'
import { BaseApiClient } from './baseApiClient'

/**
 * LiveConsole のゲームの設定 (server/game-configs/<gameKey>.json) の API
 * 中身の検証は、ゲーム側のスキーマで行う (ここでは、オブジェクトであることだけを見る)
 */
class GameConfigApiService extends BaseApiClient {
  /** 設定を取得 (まだ保存されていなければ null) */
  async loadConfig(gameKey: string): Promise<GameConfigValueType | null> {
    const response = await this.get(API_ACTION.loadGameConfig.action, { gameKey })
    if (response.code === 404) return null
    this.validateResponse(response, 'ゲームの設定の読み込みに失敗しました')

    return LoadGameConfigResponseSchema.parse(response.data).config
  }

  /** 設定を保存 (同じ gameKey なら上書き) */
  async saveConfig(gameKey: string, config: GameConfigValueType): Promise<SaveGameConfigResponseType> {
    const response = await this.post(API_ACTION.saveGameConfig.action, { gameKey, config })
    this.validateResponse(response, 'ゲームの設定の保存に失敗しました')

    return SaveGameConfigResponseSchema.parse(response.data)
  }
}

export const gameConfigApi = new GameConfigApiService()
