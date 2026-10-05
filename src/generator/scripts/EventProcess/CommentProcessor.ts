// src/generator/scripts/EventProcess/CommentProcessor.ts
import { CommentEventType, MikujiItemsType } from '@/types/OmikujiData/'
import { OmikenCommentType } from '@/types/OmikenComment'
import { BotMessageEmptySchema, BotMessageType } from '@/generator/types'

import { useAppStore } from '@/generator/stores/useAppStore'
import { drawOmikuji } from '@/engine/DrawOmikuji/DrawOmikuji'
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
    const mikujiBox = data.assets.mikuji[event.omikujiKey]
    if (!mikujiBox) return { isCommentTriggered: false, botMessages: [] }

    const selectedItem = this.lotteryWithCriteria(mikujiBox.omikuji, omiken)
    if (!selectedItem) return { isCommentTriggered: false, botMessages: [] }

    // 5. special 処理 (return / continue / reset / log)
    const specialResult = this.specialActionProcessor.process(selectedItem, event.key)
    if (specialResult) {
      const { handled, isCountEvent } = specialResult
      if (isCountEvent) this.recordDraw(omiken, event)
      return {
        isCommentTriggered: handled,
        botMessages: handled ? [BotMessageEmptySchema.parse({})] : [],
      }
    }

    // 6. 通常アクション (postFlow のみ到達)
    if (selectedItem.kind !== 'postFlow') return { isCommentTriggered: false, botMessages: [] }
    const omikujiProcessor = new OmikujiProcessor()
    const botMessages = await omikujiProcessor.executeActionItem(event.key, selectedItem.postFlows, 'comments', omiken)

    // botMessages が空ではない場合にカウント
    if (botMessages.length > 0) this.recordDraw(omiken, event)

    return { isCommentTriggered, botMessages }
  }

  /**
   * criteria フィルタを適用してからおみくじ抽選する
   */
  private lotteryWithCriteria(mikujiItems: MikujiItemsType, omiken: OmikenCommentType): MikujiItemsType[number] | null {
    const filtered = mikujiItems
      .filter((item) => {
        const criteria = item.lottery.criteria

        if (!criteria) return true
        return checkAllTriggers(omiken, criteria)
      })
      .map((item) => ({
        ...item,
        rank: item.lottery.isPriority ? 1 : 0,
      }))
    if (!filtered.length) return null
    return drawOmikuji(filtered)
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

  /**
   * 有効な CommentEventType を取得する
   */
  private getSortedEnabledRules(): CommentEventType[] {
    return Object.values(this.store.data.events.comments)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)
  }
}
