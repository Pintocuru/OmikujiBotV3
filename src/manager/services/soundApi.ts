// src/manager/services/soundApi.ts
import { API_ACTION } from '@server/api/actions'
import { BaseApiClient } from './baseApiClient'

/**
 * サウンド関連のAPI
 */
class SoundApiService extends BaseApiClient {
  /**
   * sounds フォルダの音声ファイル一覧を取得 (sounds からの相対パス)
   */
  async getSoundList(): Promise<string[]> {
    const response = await this.get<string[]>(API_ACTION.listSounds.action)
    this.validateResponse(response, 'サウンド一覧の取得に失敗しました')
    return response.data
  }
}

export const soundApi = new SoundApiService()
