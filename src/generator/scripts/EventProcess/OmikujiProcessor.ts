// src/generator/scripts/EventProcess/OmikujiProcessor.ts
import { MikujiItemsType, OmikujiItemStepsType, OmikujiItemType, ScenarioStepType } from '@/types/OmikujiData'
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
   * おみくじ抽選 & 実行
   * @param omikujiKey data.assets.mikuji のキー (event.omikujiKey)
   */
  async executeOmikuji(omikujiKey: string, omiken?: OmikenCommentType): Promise<BotMessageType[]> {
    const omikujiSet = this.store.data.assets.mikuji[omikujiKey]?.omikuji ?? []
    const item = this.lotteryOmikujiItem(omikujiSet)

    // return / continue / reset / log は何もしない
    if (!item || item.kind !== 'steps') return []

    return this.runSteps(item, omiken)
  }

  /**
   * おみくじ抽選
   * isPriority が true のアイテムが複数ある場合は、配列の先頭側が必ず選ばれる
   */
  private lotteryOmikujiItem(omikujiSet: MikujiItemsType): OmikujiItemType | null {
    try {
      // weight / isPriority は item.lottery の中にあるため、drawOmikuji 用にフラット化する
      const candidates = omikujiSet.map((item) => {
        const lottery = 'lottery' in item ? item.lottery : undefined
        return { item, isPriority: lottery?.isPriority ?? false, weight: lottery?.weight ?? 1 }
      })
      return drawOmikuji(candidates)?.item ?? null
    } catch (error) {
      this.reportError(`おみくじ実行エラー ${error}`)
      return null
    }
  }

  /**
   * control アイテムの variable (評価ブロック) を評価する
   */
  evaluateControlVariable(variable: string, omiken?: OmikenCommentType): void {
    this.omikujiResult.evaluateVariable(variable, this.getDefaultPlaceholders(omiken))
  }

  /**
   * steps を順番に実行する。
   * 前の step (variable など) の結果に後の step が依存する可能性があるため、並列にはしない。
   */
  async runSteps(item: OmikujiItemStepsType, omiken: OmikenCommentType | undefined): Promise<BotMessageType[]> {
    const steps = this.resolveScenarioSteps(item)
    const defaultPlaceholders = this.getDefaultPlaceholders(omiken)
    const messages: BotMessageType[] = []

    for (const step of steps) {
      const result = await this.omikujiResult.process(step, defaultPlaceholders, omiken)
      messages.push(...result)
    }

    return this.attachOrigin(messages, omiken)
  }

  /**
   * stepKey から実行するシナリオの steps を取得する。
   * 空・存在しない key は実行時エラーとしてわんコメへ通知する(スキーマ側は '' を許容している)。
   */
  private resolveScenarioSteps(item: OmikujiItemStepsType): ScenarioStepType[] {
    const key = item.stepKey
    if (!key) {
      this.reportError('おみくじアイテムにシナリオ(stepKey)が設定されていません')
      return []
    }

    const scenario = this.store.data.assets.scenarios[key]
    if (!scenario) {
      this.reportError(`シナリオ "${key}" が見つかりません`)
      return []
    }
    return scenario.steps
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

  /**
   * 実行時エラーをコンソールとわんコメの両方へ通知する
   */
  private reportError(msg: string): void {
    console.error(msg)
    postSystemMessage(msg)
  }
}
