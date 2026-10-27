// src/generator/scripts/EventProcess/OmikujiProcessor.ts
import { EventCategoryType, MikujiItemsType, OmikujiItemPostFlowType, OmikujiItemType } from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'

import { useAppStore } from '@/generator/stores/useAppStore'
import { BotMessageType } from '@/types/generator'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { drawOmikuji } from '@/engine/DrawOmikuji/DrawOmikuji'
import { OmikujiResultProcessor } from '@/engine/OmikujiResult/OmikujiResultProcessor'
import { buildDefaultPlaceholders } from '@/generator/scripts/EventProcess/DefaultPlaceholderBuilder'

export class OmikujiProcessor {
  private readonly store = useAppStore()
  private readonly omikujiResult: OmikujiResultProcessor

  constructor() {
    this.omikujiResult = new OmikujiResultProcessor(
      this.store.data,
      this.store.scriptManager.playScript,
      this.store.placeholderVariable
    )
  }

  /**
   * おみくじ抽選 & 実行 (本番用)
   * @param omikujiKey data.assets.mikuji のキー (event.omikujiKey)
   */
  async executeOmikuji(
    eventKey: string,
    omikujiKey: string,
    category: EventCategoryType,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    return this.runFlow(eventKey, omikujiKey, category, omiken, false)
  }

  /**
   * おみくじ抽選 & 実行 (スロット演出用)
   */
  async executeDummyOmikuji(
    eventKey: string,
    omikujiKey: string,
    category: EventCategoryType,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    return this.runFlow(eventKey, omikujiKey, category, omiken, true)
  }

  /**
   * 共通の実行フロー
   */
  private async runFlow(
    eventKey: string,
    omikujiKey: string,
    category: EventCategoryType,
    omiken?: OmikenCommentType,
    isDummy: boolean = false
  ): Promise<BotMessageType[]> {
    const omikujiSet = this.store.data.assets.mikuji[omikujiKey]?.omikuji ?? []
    const item = this.lotteryOmikujiItem(omikujiSet)

    // return / continue / reset / log は何もしない
    if (!item || item.kind !== 'postFlow') return []

    return this.runPostFlows(eventKey, item, category, omiken, isDummy)
  }

  /**
   * おみくじ抽選。
   * criteria フィルタが必要な場合は呼び出し側で事前に適用すること
   * (コメントイベントは EventCommentProcessor.lotteryWithCriteria を使用)。
   * isPriority が true のアイテムが複数ある場合は、配列の先頭側が必ず選ばれる。
   */
  lotteryOmikujiItem(omikujiSet: MikujiItemsType): OmikujiItemType | null {
    try {
      // weight / isPriority は item.lottery の中にあるため、drawOmikuji 用にフラット化する
      const candidates = omikujiSet.map((item) => {
        const lottery = 'lottery' in item ? item.lottery : undefined
        return { item, isPriority: lottery?.isPriority ?? false, weight: lottery?.weight ?? 1 }
      })
      return drawOmikuji(candidates)?.item ?? null
    } catch (error) {
      const msg = `おみくじ実行エラー ${error}`
      console.error(msg)
      postSystemMessage(msg)
      return null
    }
  }

  /**
   * 抽選済みの postFlow アイテムを実行する (コメントイベント用)
   */
  async executeActionItem(
    eventKey: string,
    item: OmikujiItemPostFlowType,
    category: EventCategoryType,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    return this.runPostFlows(eventKey, item, category, omiken, false)
  }

  /**
   * control アイテムの variable (評価ブロック {{ }}) を評価する (コメントイベント用)
   */
  evaluateControlVariable(variable: string, omiken?: OmikenCommentType): void {
    this.omikujiResult.evaluateVariable(variable, this.getDefaultPlaceholders(omiken))
  }

  /**
   * postFlows を順番に実行する。
   * 前の flow (variable など) の結果に後の flow が依存する可能性があるため、並列にはしない。
   */
  private async runPostFlows(
    eventKey: string,
    item: OmikujiItemPostFlowType,
    category: EventCategoryType,
    omiken: OmikenCommentType | undefined,
    isDummy: boolean
  ): Promise<BotMessageType[]> {
    const defaultPlaceholders = this.getDefaultPlaceholders(omiken)
    const messages: BotMessageType[] = []

    for (const flow of item.postFlows) {
      const result = isDummy
        ? await this.omikujiResult.processDummy(flow, defaultPlaceholders, omiken)
        : await this.omikujiResult.process(flow, defaultPlaceholders, omiken)
      messages.push(...result)
    }

    return this.attachOrigin(messages, omiken)
  }

  /**
   * origin を付与する共通処理
   */
  private attachOrigin(messages: BotMessageType[], omiken?: OmikenCommentType): BotMessageType[] {
    return messages.map((m) => ({ ...m, origin: omiken }))
  }

  /**
   * comment用デフォルトのプレースホルダー情報を設定
   */
  private getDefaultPlaceholders(omiken?: OmikenCommentType): Record<string, string | number> {
    return buildDefaultPlaceholders(this.store, omiken)
  }
}
