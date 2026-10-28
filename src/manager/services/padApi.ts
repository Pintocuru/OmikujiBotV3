// src/manager/services/padApi.ts
import { API_ACTION } from '@server/api/actions'
import type { PadIdType } from '@/types/OmikujiData'
import {
  PadStatusResponseSchema,
  PadStatusResponseType,
  PadTriggerResponseSchema,
  PadTriggerResponseType,
} from '@/types/api'
import { BaseApiClient } from './baseApiClient'

/**
 * ポン出しの API
 * - 押す側 (LiveConsole): trigger
 * - 受け取る側 (Generator): loadStatus を since 付きでポーリングする
 */
class PadApiService extends BaseApiClient {
  /** ボタンが押されたことをサーバーに伝える */
  async trigger(padId: PadIdType): Promise<PadTriggerResponseType> {
    const response = await this.post(API_ACTION.triggerPad.action, { padId })
    this.validateResponse(response, 'ポン出しの発火に失敗しました')

    return PadTriggerResponseSchema.parse(response.data)
  }

  /**
   * 発火の状態を取得
   * since を省くと hasNew は常に false で、最後の発火時刻だけが返る (受け取り側の最初の lastSeen を決める)
   */
  async loadStatus(since?: number): Promise<PadStatusResponseType> {
    const response = await this.get(API_ACTION.loadPadStatus.action, { since })
    this.validateResponse(response, 'ポン出しの状態の取得に失敗しました')

    return PadStatusResponseSchema.parse(response.data)
  }
}

export const padApi = new PadApiService()
