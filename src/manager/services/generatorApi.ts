// src/manager/services/generatorApi.ts
import { API_ACTION } from '@server/api/actions'
import { BaseApiClient, ConnectionError } from './baseApiClient'

/**
 * Generator関連のAPI
 * - fileName なし: server/generator.json (MainGenerator が読む設定)
 * - fileName あり(meta.id): server/packages/<id>.json
 */
class GeneratorApiService extends BaseApiClient {
  /**
   * Generatorファイルを読み込み（存在しない場合は null を返す）
   */
  async loadGeneratorConfig(id?: string): Promise<any | null> {
    try {
      const fileName = this.getGeneratorFileName(id)
      const response = await this.get(API_ACTION.loadGenerator.action, { fileName })

      if (response.code !== 200) return null

      return response.data
    } catch (err) {
      if (err instanceof ConnectionError) return null
      throw err
    }
  }

  /**
   * ジェネレーター用設定を保存
   */
  async saveGeneratorConfig(data: string): Promise<any> {
    const fileName = this.getGeneratorFileName()

    const response = await this.post(API_ACTION.saveGenerator.action, { data, fileName })
    this.validateResponse(response, 'ジェネレーター設定の保存に失敗しました')
    return response.data
  }

  /**
   * meta.id からユニークなファイル名を生成する
   */
  private getGeneratorFileName(id?: string): string | null {
    const finalId = id ?? window.omikujiData?.meta.id
    return finalId && finalId.trim() !== '' ? `${finalId}.json` : null
  }
}

export const generatorApi = new GeneratorApiService()
