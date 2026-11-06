// src/generator/scripts/EventProcess/OmikujiProcessor.ts
import {
  MikujiItemsType,
  OmikujiItemStepsType,
  OmikujiItemType,
  ScenarioStepType,
  sortedStepsFromRecord,
} from '@/types/OmikujiData'
import { OmikenCommentType } from '@/types/OmikenComment'

import { useAppStore } from '@/generator/stores/useAppStore'
import { BotMessageType } from '@/types/generator'
import { drawOmikuji } from '@/engine/DrawOmikuji/DrawOmikuji'
import { OmikujiResultProcessor } from '@/engine/OmikujiResult/OmikujiResultProcessor'
import { buildDefaultPlaceholders } from '@/generator/scripts/EventProcess/DefaultPlaceholderBuilder'
import { acquireCooldown, type CooldownBlock } from '@/generator/scripts/EventProcess/CooldownGate'
import { showCooldownBlockNotice, showErrorNotice } from '@/generator/scripts/Notice/showNotice'

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
    const mikujiBox = this.store.data.assets.mikuji[omikujiKey]?.omikuji ?? []
    const item = this.lotteryOmikujiItem(mikujiBox)

    // return / continue / reset / log は何もしない
    if (!item || item.kind !== 'steps') return []

    // クールダウン中は何も実行しない
    if (!this.tryAcquireCooldown(item, omiken)) return []

    return this.runSteps(item, omiken)
  }

  /**
   * cooldownSeconds による実行可否の判定。通過した場合は記録を更新する。
   * runSteps の直前に呼ぶこと (並列処理でも判定と記録が同期的に完結する)。
   * ブロックされたときは、コンソールに理由を出し、設定がオンならコメントしたユーザーを画面に通知する。
   */
  tryAcquireCooldown(item: OmikujiItemStepsType, omiken?: OmikenCommentType): boolean {
    const result = acquireCooldown(item.cooldownSeconds, this.cooldownLabel(item))
    if (result.allowed) return true
    this.reportCooldownBlock(item, result, omiken)
    return false
  }

  /**
   * ブロックを通知する。
   * - コンソール: 常に出す(設定時に原因を調べるため)
   * - 画面: コメントがきっかけのとき(ユーザー名があるとき)だけ。表示するかは設定(showCooldownNotice)に従う。タイマーなどは知らせても意味がない
   */
  private reportCooldownBlock(item: OmikujiItemStepsType, block: CooldownBlock, omiken?: OmikenCommentType): void {
    const { blockedBy, remainingSeconds } = block
    console.info(
      `[cooldown] "${this.cooldownLabel(item)}" をブロック: "${blockedBy.label}"(${blockedBy.seconds}秒)により、あと ${remainingSeconds.toFixed(1)} 秒`
    )
    if (omiken) showCooldownBlockNotice(omiken.userName, remainingSeconds)
  }

  /** ログ用の名前: アイテム名 → シナリオ名 → key の順 */
  private cooldownLabel(item: OmikujiItemStepsType): string {
    return item.name || this.store.data.assets.scenarios[item.stepKey]?.name || item.key
  }

  /**
   * おみくじ抽選
   * isPriority が true のアイテムが複数ある場合は、配列の先頭側が必ず選ばれる
   */
  private lotteryOmikujiItem(mikujiBox: MikujiItemsType): OmikujiItemType | null {
    try {
      return drawOmikuji(mikujiBox)
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
      this.reportError(`おみくじ「${item.name}」にシナリオが設定されていません`)
      return []
    }

    const scenario = this.store.data.assets.scenarios[key]
    if (!scenario) {
      this.reportError(`おみくじ「${item.name}」のシナリオ "${key}" が見つかりません`)
      return []
    }
    return sortedStepsFromRecord(scenario.steps)
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
   * 実行時エラーをコンソールと、配信画面の右下の通知へ知らせる
   * (わんコメへの投稿はしない。読み上げに乗り、視聴者にも目立つため)
   */
  private reportError(msg: string): void {
    console.error(msg)
    showErrorNotice(msg)
  }
}
