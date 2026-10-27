// src/manager/services/omikujiApi.ts
import { API_ACTION } from '@server/api/actions'
import { BaseApiClient } from './baseApiClient'

/**
 * おみくじ・配信データ関連のAPI
 * 配信データの蓄積など、おみくじの実行結果に関する API はここに追加していく
 */
class OmikujiApiService extends BaseApiClient {
  /**
   * おみくじデータ (omikujiData.js) を保存
   */
  async saveOmikujiData(configData: string): Promise<any> {
    const response = await this.post(API_ACTION.saveOmikuji.action, { configData })
    this.validateResponse(response, 'おみくじデータの保存に失敗しました')
    return response.data
  }
}

export const omikujiApi = new OmikujiApiService()
