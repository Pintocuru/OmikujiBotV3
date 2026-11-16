// src/manager/services/bingoApi.ts
import { API_ACTION } from '@server/api/actions'
import {
  ListBingoPatternsResponseSchema,
  ListBingoPatternsResponseType,
  LoadBingoCommandsResponseSchema,
  LoadBingoCommandsResponseType,
  LoadBingoSnapshotResponseSchema,
  LoadBingoSnapshotResponseType,
  LoadBingoPatternResponseSchema,
  SaveBingoPatternResponseSchema,
  SaveBingoPatternResponseType,
  SendBingoCommandResponseSchema,
  SendBingoCommandResponseType,
  type LiverBingoCommandType,
  type LiverBingoSnapshotType,
} from '@/types/api'
import type { LiverBingoPatternInputType, LiverBingoPatternType } from '@/types/ui'
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

  // ---- 保存パターン (server/bingo-patterns/<id>.json) ----

  /** 保存済みパターンの一覧(更新日時の新しい順) */
  async listPatterns(): Promise<ListBingoPatternsResponseType> {
    const response = await this.get(API_ACTION.listBingoPatterns.action)
    this.validateResponse(response, 'ビンゴの保存パターン一覧の取得に失敗しました')

    return ListBingoPatternsResponseSchema.parse(response.data)
  }

  /** 1 パターンを取得(存在しない場合は null) */
  async loadPattern(id: string): Promise<LiverBingoPatternType | null> {
    const response = await this.get(API_ACTION.loadBingoPattern.action, { id })
    if (response.code === 404) return null
    this.validateResponse(response, 'ビンゴの保存パターンの読み込みに失敗しました')

    return LoadBingoPatternResponseSchema.parse(response.data)
  }

  /** パターンを保存(同じ id なら上書き) */
  async savePattern(pattern: LiverBingoPatternInputType): Promise<SaveBingoPatternResponseType> {
    const response = await this.post(API_ACTION.saveBingoPattern.action, { pattern })
    this.validateResponse(response, 'ビンゴの保存パターンの保存に失敗しました')

    return SaveBingoPatternResponseSchema.parse(response.data)
  }

  /** パターンを削除 */
  async deletePattern(id: string): Promise<void> {
    const response = await this.post(API_ACTION.deleteBingoPattern.action, { id })
    this.validateResponse(response, 'ビンゴの保存パターンの削除に失敗しました')
  }
}

export const bingoApi = new BingoApiService()
