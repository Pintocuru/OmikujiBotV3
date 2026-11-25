// src/manager/services/aiApi.ts
import { API_ACTION } from '@server/api/actions'
import {
  AskAiResponseSchema,
  LoadAiSettingsResponseSchema,
  type AskAiResponseType,
  type LoadAiSettingsResponseType,
  type SaveAiSettingsRequestType,
} from '@/types/api'
import { BaseApiClient } from './baseApiClient'

/** AI の利用上限に達した (使える接続先がすべて 429)。呼び出し側は、規則ベースの代替に切り替える */
export class AiRateLimitedError extends Error {
  constructor() {
    super('AI の利用上限に達しました')
    this.name = 'AiRateLimitedError'
  }
}

/**
 * 生成 AI の接続先の設定と、AI への中継 (server/ai-settings.json)。API キーは、保存のときだけ送る
 */
class AiApiService extends BaseApiClient {
  /** 保存されている接続先を取得 (キーは含まない) */
  async loadSettings(): Promise<LoadAiSettingsResponseType> {
    const response = await this.get(API_ACTION.loadAiSettings.action)
    this.validateResponse(response, 'AI の設定の読み込みに失敗しました')
    return LoadAiSettingsResponseSchema.parse(response.data)
  }

  /** 接続先を保存 (apiKey が空なら、保存済みのキーを使う) */
  async saveSettings(settings: SaveAiSettingsRequestType): Promise<LoadAiSettingsResponseType> {
    const response = await this.post(API_ACTION.saveAiSettings.action, settings)
    this.validateResponse(response, 'AI の設定の保存に失敗しました')
    return LoadAiSettingsResponseSchema.parse(response.data)
  }

  /** プロンプトを渡して、返事を受け取る (メインが使えなければ、サーバーがサブに切り替える) */
  async ask(prompt: string): Promise<AskAiResponseType> {
    const response = await this.post(API_ACTION.askAi.action, { prompt })
    if (response.code === 429) throw new AiRateLimitedError()
    this.validateResponse(response, 'AI の呼び出しに失敗しました')
    return AskAiResponseSchema.parse(response.data)
  }
}

export const aiApi = new AiApiService()
