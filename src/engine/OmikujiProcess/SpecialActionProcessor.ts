// src/engine/OmikujiProcess/SpecialActionProcessor.ts
import { OmikujiItemType } from '@/types/OmikujiData/'
import { UserNameType } from '@/types/OmikenComment'
import { useAppStore } from '@/generator/stores/useAppStore'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { GameStateType } from '@/games/types'

export interface SpecialActionResult {
  handled: boolean // trueのとき呼び出し元でイベント処理を終了する
  isCountEvent: boolean // おみくじカウントとして記録するか
}

/**
 * postFlow 以外の kind (return / continue / reset / log) を処理するクラス
 * @param eventKey 実行中のイベントの key (reset / log の対象特定に使用)
 */
export class SpecialActionProcessor {
  private readonly store = useAppStore()

  process(item: OmikujiItemType, eventKey: string): SpecialActionResult | null {
    switch (item.kind) {
      // 通常アクション (BOTメッセージ送信) は対象外
      case 'postFlow':
        return null

      // 処理を終了する
      case 'return':
        return { handled: true, isCountEvent: item.isCountEvent }

      // 次のイベントへ進む
      case 'continue':
        return { handled: false, isCountEvent: item.isCountEvent }

      // おみくじ回数をリセットする (リセット自体はカウントしない)
      case 'reset': {
        this.store.userSession.visits.resetEvent(eventKey)
        postSystemMessage(`${item.name}のおみくじ回数をリセットしました`, { username: '__INFO__' })
        return { handled: true, isCountEvent: false }
      }

      // ユーザー状態ログを出力する
      case 'log': {
        const logs = this.store.scriptManager.getGameState(eventKey)?.logs
        if (logs) {
          const message = this.formatLogs(logs, item.logFormat, item.logLimit)
          postSystemMessage(message, { username: '__INFO__', speech: false })
        }
        return { handled: true, isCountEvent: false }
      }
    }
  }

  /** ログ配列をフォーマット文字列に従って整形し、件数制限して結合する */
  private formatLogs(logs: GameStateType['logs'] = [], logFormat: string, logLimit: number): string {
    return logs
      .map((log, i) => {
        const user = this.resolveUserName(log.userId)
        if (!user) return ''
        return logFormat
          .replace('<<index>>', String(i + 1))
          .replace('<<user>>', user.userName)
          .replace('<<userId>>', user.userId)
          .replace('<<score>>', String(log.score))
          .replace('<<item>>', log.item ?? '')
          .replace('<<flag>>', log.flag ? 'true' : 'false')
          .replace('<<createdAt>>', this.formatDate(log.createdAt))
      })
      .filter(Boolean)
      .slice(0, logLimit)
      .join('\n')
  }

  private resolveUserName(userId: string): UserNameType | null {
    return this.store.userSession.stats.get(userId) ?? null
  }

  private formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString()
  }
}
