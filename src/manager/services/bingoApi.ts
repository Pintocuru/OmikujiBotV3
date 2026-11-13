// src/manager/services/bingoApi.ts
import { API_ACTION } from '@server/api/actions'
import {
  LoadBingoCommandsResponseSchema,
  LoadBingoCommandsResponseType,
  LoadBingoSnapshotResponseSchema,
  LoadBingoSnapshotResponseType,
  SendBingoCommandResponseSchema,
  SendBingoCommandResponseType,
  type LiverBingoCommandType,
  type LiverBingoSnapshotType,
} from '@/types/api'
import { BaseApiClient } from './baseApiClient'

/**
 * ライバービンゴの API
 * - 操作する側 (LiveConsole): sendCommand / loadSnapshot
 * - カードを持つ側 (OBS のブラウザソース): loadCommands を since 付きでポーリング / saveSnapshot
 */
class BingoApiService extends BaseApiClient {
  /** 命令を積む */
  async sendCommand(command: LiverBingoCommandType): Promise<SendBingoCommandResponseType> {
    const response = await this.post(API_ACTION.sendBingoCommand.action, { command })
    this.validateResponse(response, 'ビンゴの命令の送信に失敗しました')

    return SendBingoCommandResponseSchema.parse(response.data)
  }

  /**
   * since より新しい命令を取得
   * since を省くと commands は常に空で、latest だけが返る (受け取り側の最初の lastSeen を決める)
   */
  async loadCommands(since?: number): Promise<LoadBingoCommandsResponseType> {
    const response = await this.get(API_ACTION.loadBingoCommands.action, { since })
    this.validateResponse(response, 'ビンゴの命令の取得に失敗しました')

    return LoadBingoCommandsResponseSchema.parse(response.data)
  }

  /** カードの写しを送る */
  async saveSnapshot(snapshot: LiverBingoSnapshotType): Promise<void> {
    const response = await this.post(API_ACTION.saveBingoSnapshot.action, { snapshot })
    this.validateResponse(response, 'ビンゴの状態の送信に失敗しました')
  }

  /** カードの写しを取得 */
  async loadSnapshot(): Promise<LoadBingoSnapshotResponseType> {
    const response = await this.get(API_ACTION.loadBingoSnapshot.action)
    this.validateResponse(response, 'ビンゴの状態の取得に失敗しました')

    return LoadBingoSnapshotResponseSchema.parse(response.data)
  }
}

export const bingoApi = new BingoApiService()
