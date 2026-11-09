// src/manager/services/imageApi.ts
import { API_ACTION } from '@server/api/actions'
import { BaseApiClient } from './baseApiClient'

/**
 * 画像関連のAPI
 */
class ImageApiService extends BaseApiClient {
  /**
   * 画像・動画ファイルの一覧を取得 (images ルートからの相対パス。例: chocolate/default.webp)
   */
  async getImageList(): Promise<string[]> {
    const response = await this.get<string[]>(API_ACTION.listImages.action)
    this.validateResponse(response, '画像一覧の取得に失敗しました')
    return response.data
  }
}

export const imageApi = new ImageApiService()
