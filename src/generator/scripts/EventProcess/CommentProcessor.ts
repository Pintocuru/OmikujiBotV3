// src/generator/scripts/EventProcess/CommentProcessor.ts
import { CommentEventType, MikujiItemsType } from '@/types/OmikujiData/'
import { OmikenCommentType } from '@/types/OmikenComment'
import { BotMessageEmptySchema, BotMessageType } from '@/types/generator'

import { useAppStore } from '@/generator/stores/useAppStore'
import { drawOmikuji } from '@/engine/DrawOmikuji/DrawOmikuji'
import { checkAllTriggers } from '@/generator/scripts/trigger/TriggerChecker'
import { OmikujiControlProcessor } from '@/generator/scripts/EventProcess/OmikujiControlProcessor'
import { OmikujiProcessor } from '@/generator/scripts/EventProcess/OmikujiProcessor'

export class EventCommentProcessor {
  private readonly store = useAppStore()
  private readonly control = new OmikujiControlProcessor()

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
        const botMessages = await this.processRule(omiken, rule)

        // イベントが成功し、botメッセージが生成された場合はここで終了
        if (botMessages.length > 0) return botMessages
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
  private async processRule(omiken: OmikenCommentType, event: CommentEventType): Promise<BotMessageType[]> {
    const { data } = this.store

    // コメントイベントの条件チェック
    if (!checkAllTriggers(omiken, event.trigger)) return []

    // criteria フィルタ適用後に抽選
    const mikujiBox = data.assets.mikuji[event.omikujiKey]
    if (!mikujiBox) return []

    const selectedItem = this.lotteryWithCriteria(mikujiBox.omikuji, omiken)
    if (!selectedItem) return []

    // control 処理 (return / continue)
    const handled = this.control.process(selectedItem, omiken)
    if (handled !== null) {
      // return: 空メッセージで以降のイベントを止める / continue: 次のイベントへ
      return handled ? [BotMessageEmptySchema.parse({})] : []
    }

    // 通常アクション (postFlow のみ到達)
    if (selectedItem.kind !== 'postFlow') return []
    const omikujiProcessor = new OmikujiProcessor()
    return omikujiProcessor.executeActionItem(event.key, selectedItem, 'comments', omiken)
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
   * 有効な CommentEventType を取得する
   */
  private getSortedEnabledRules(): CommentEventType[] {
    return Object.values(this.store.data.events.comments)
      .filter((rule) => rule.isEnabled)
      .sort((a, b) => a.order - b.order)
  }
}
