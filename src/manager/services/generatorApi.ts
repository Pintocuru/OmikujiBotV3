// src/manager/services/generatorApi.ts
import { API_ACTION } from '@server/api/actions'
import { FileItem } from '@/manager/types'
import { BaseApiClient, ConnectionError } from './baseApiClient'
import { toFileItem } from './apiServiceUtils'

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
   * packages に保存されている設定の一覧を取得 (name は "<id>.json")
   */
  async listPackages(): Promise<FileItem[]> {
    const response = await this.get<{ name: string; modified: string }[]>(API_ACTION.listPackages.action)
    this.validateResponse(response, 'パッケージ一覧の取得に失敗しました')

    return response.data.map(toFileItem)
  }

  /**
   * packages の設定を削除 (fileName は "<id>.json")
   */
  async deletePackage(fileName: string): Promise<void> {
    const response = await this.post(API_ACTION.deletePackage.action, { fileName })
    this.validateResponse(response, 'パッケージの削除に失敗しました')
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
