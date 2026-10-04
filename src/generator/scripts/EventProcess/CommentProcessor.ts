// src/generator/scripts/EventProcess/CommentProcessor.ts
import { ActionSetType, CommentEventType, MikujiItemsType } from '@/types/OmikujiData/'
import { OmikenCommentType } from '@/types/OmikenComment'

import { useAppStore } from '@/generator/stores/useAppStore'
import { drawOmikuji } from '@/engine/DrawOmikuji/DrawOmikuji'
import { BotMessageEmptySchema, BotMessageType } from '@/generator/types'
import { checkAllTriggers } from '@/generator/scripts/trigger/TriggerChecker'
import { SpecialActionProcessor } from '@/engine/OmikujiProcess/SpecialActionProcessor'
import { OmikujiProcessor } from '@/engine/OmikujiProcess/OmikujiProcessor'

interface ProcessResult {
  isCommentTriggered: boolean
  botMessages: BotMessageType[]
}

export class EventCommentProcessor {
  private readonly store = useAppStore()
  private readonly specialActionProcessor = new SpecialActionProcessor()

  /**
   * メイン処理: コメントを処理して拡張コメントを作成
   */
  async respondToComments(omikens: OmikenCommentType[]): Promise<void> {
    if (omikens.length === 0) return
    const botMessagesArrays = await Promise.all(omikens.map((omiken) => this.processUserComment(omiken)))
    const messages = botMessagesArrays.flat()
    this.store.scheduleBotMessages(messages)
  }

  /**
   * ユーザーコメントの処理
   */
  private async processUserComment(omiken: OmikenCommentType): Promise<BotMessageType[]> {
    try {
      const sortedRules = this.getSortedEnabledRules()

      for (const rule of sortedRules) {
        const result = await this.processRule(omiken, rule)

        // イベントが成功し、botメッセージが生成された場合はここで終了
        if (result.botMessages.length > 0) {
          if (result.isCommentTriggered) {
            this.store.cooldownManager.updateLastProcessedTime()
          }
          return result.botMessages
        }
      }

      return []
    } catch (error) {
      console.error('ユーザーコメント処理エラー:', error)
      return []
    }
  }

  /**
   * 単一イベントの処理
   */
  private async processRule(omiken: OmikenCommentType, event: CommentEventType): Promise<ProcessResult> {
    const { data } = this.store

    // 1. コメントイベントの条件チェック
    if (!checkAllTriggers(omiken, event.trigger)) {
      return { isCommentTriggered: false, botMessages: [] }
    }

    // 3. drawsカウンタを omiken.meta に反映
    this.setDrawsMeta(omiken, event)

    // 4. criteria フィルタ適用後に抽選
    const actionItem = this.lotteryWithCriteria(event.omikujiKey, omiken)
    if (!actionItem) return { isCommentTriggered: false, botMessages: [] }

    // 5. special 処理
    const specialResult = this.specialActionProcessor.process(actionItem)
    if (specialResult) {
      const { handled, isCountEvent, countEvent } = specialResult
      if (isCountEvent) this.recordDraw(omiken, event, countEvent)
      return {
        isCommentTriggered: handled,
        botMessages: handled ? [BotMessageEmptySchema.parse({})] : [],
      }
    }

    // 6. 通常アクション
    const omikujiProcessor = new OmikujiProcessor()
    const botMessages = await omikujiProcessor.executeActionItem(event.key, actionItem, 'comments', omiken)
    const isCommentTriggered = event.trigger.conditions.includes('comment')

    // botMessages が空ではない場合にカウント
    if (botMessages.length > 0) this.recordDraw(omiken, event)

    return { isCommentTriggered, botMessages }
  }

  /**
   * criteria フィルタを適用してからおみくじ抽選する。
   * (OmikujiProcessor から移管。コメントイベント専用のフィルタのため)
   */
  private lotteryWithCriteria(omikujiSet: MikujiItemsType, omiken: OmikenCommentType): ActionSetType | null {
    const filtered = omikujiSet
      .filter((item) => {
        if (!item.criteria) return true
        return checkAllTriggers(omiken, item.criteria)
      })
      .map((item) => ({
        ...item,
        rank: item.isPriority ? 1 : 0,
      }))

    if (!filtered.length) return null
    return (drawOmikuji(filtered) as ActionSetType) ?? null
  }

  /**
   * omiken.meta.draws と eventKey を設定する (抽選前に呼ぶ)
   */
  private setDrawsMeta(omiken: OmikenCommentType, event: CommentEventType): void {
    const { userSession } = this.store
    omiken.omikuji = {
      draws: userSession.visits.getCount(omiken.userId, event.key) + 1,
      eventKey: event.key,
    }
  }

  /**
   * ドロー記録
   */
  private recordDraw(omiken: OmikenCommentType, rule: CommentEventType, count = 1): void {
    const { userSession } = this.store
    userSession.visits.record(rule.key, omiken, count)
  }

  private getSortedEnabledRules(): CommentEventType[] {
    return Object.values(this.store.data.comments)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)
  }
}
