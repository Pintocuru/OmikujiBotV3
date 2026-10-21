// src/manager/services/configApi.ts
import { FileItem } from '@/manager/types'
import { API_ACTION } from '@server/api/actions'
import { BaseApiClient } from './baseApiClient'
import { ensureJsonExtension, toFileItem } from './apiServiceUtils'

/**
 * 設定ファイル関連のAPI
 */
class ConfigApiService extends BaseApiClient {
  /**
   * ファイル一覧を取得
   */
  async getFileList(): Promise<FileItem[]> {
    const response = await this.get<{ name: string; modified: string }[]>(API_ACTION.list.action)
    this.validateResponse(response, 'ファイル一覧の取得に失敗しました')

    return response.data.map(toFileItem)
  }

  /**
   * 設定ファイルを取得
   */
  async loadConfig(fileName: string): Promise<any> {
    const finalFileName = ensureJsonExtension(fileName)

    const response = await this.get(API_ACTION.load.action, { fileName: finalFileName })
    if (response.code === 404) {
      throw new Error('設定ファイルが見つかりませんでした (404)')
    }
    this.validateResponse(response, '設定の読み込みに失敗しました')

    return response.data
  }

  /**
   * ファイル移動
   */
  async moveConfig(fromName: string, toName: string): Promise<void> {
    const response = await this.post(API_ACTION.move.action, { fromName, toName })
    this.validateResponse(response, '設定ファイルの移動に失敗しました')
  }

  /**
   * 設定ファイルを保存
   */
  async saveConfig(fileName: string, configData: string): Promise<string> {
    const finalFileName = ensureJsonExtension(fileName)

    const response = await this.post(API_ACTION.save.action, {
      fileName: finalFileName,
      data: configData,
    })

    this.validateResponse(response, '設定の保存に失敗しました')

    return finalFileName
  }

  /**
   * 設定ファイルを削除
   */
  async deleteConfig(fileName: string): Promise<void> {
    const response = await this.post(API_ACTION.delete.action, { fileName })
    this.validateResponse(response, '設定ファイルの削除に失敗しました')
  }
}

export const configApi = new ConfigApiService()
