// src/engine/OmikujiResult/OmikujiResultProcessor.ts
import { OmikujiDataType, ScenarioStepType } from '@/types/OmikujiData/'
import { OmikenCommentType } from '@/types/OmikenComment'

import { BotMessageGenerator } from './BotMessageGenerator'
import { ScenarioStepHandler } from './ScenarioStepHandler'
import { GameScriptsHandler } from '@/engine/GameScriptPlay/GameScriptsHandler'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'
import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'
import { BotMessageType } from '@/types/generator'
import { showErrorNotice } from '@/generator/scripts/Notice/showNotice'

/** processTimeline の結果 */
export interface TimelineResult {
  /** delaySeconds が 0 のステップから、すぐ生成された BotMessage */
  messages: BotMessageType[]
  /** BotMessage を作るステップが(遅延分も含めて)あったか。コメントイベントが後続ルールを止めるかの判定に使う */
  handled: boolean
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * おみくじ結果の処理とBotMessage生成を担当
 */
export class OmikujiResultProcessor {
  private readonly scenarioStepHandler: ScenarioStepHandler
  private readonly gameScriptsHandler: GameScriptsHandler

  constructor(
    omikujiData: OmikujiDataType,
    playScript: GameScriptManager['playScript'],
    variable: PlaceholderVariableType
  ) {
    const generator = new BotMessageGenerator(omikujiData, variable)
    this.scenarioStepHandler = new ScenarioStepHandler(omikujiData, variable, generator)
    this.gameScriptsHandler = new GameScriptsHandler(playScript, generator)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  async process(
    step: ScenarioStepType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    try {
      let messages: BotMessageType[]

      switch (step.kind) {
        case 'gameScript': {
          const [resolved] = this.scenarioStepHandler.resolveSteps([step], defaultPlaceholders)
          messages = resolved.kind === 'gameScript' ? await this.gameScriptsHandler.process(resolved, omiken) : []
          break
        }

        // variable は式の評価のみ (BotMessage は作らない)
        case 'scenarioCall':
        case 'message':
        case 'variable':
        case 'sound':
        case 'wordParty':
          messages = this.scenarioStepHandler.process([step], defaultPlaceholders, omiken)
          break
      }

      return messages
    } catch (error) {
      console.error('おみくじ実行エラー', error)
      showErrorNotice(`おみくじ実行エラー ${error}`)
      return []
    }
  }

  /**
   * steps を delaySeconds の時刻どおりに実行する。
   * 評価ブロック・プレースホルダー置換・投稿・音は、すべて「そのステップの時刻」に行う。
   * - delaySeconds が 0 のステップは、今までどおりこの呼び出しの中で順に実行する
   *   (クールダウンや回数制限のカウンタ更新が、連投で抜けられないように)
   * - delaySeconds が 0 より大きいステップは、その時刻まで待ってから実行する。結果は onDeferred に渡す
   *   実行時には delaySeconds を 0 に直すので、出力の遅れは basicDelaySeconds だけになる
   * - 遅延分は時刻順に1本の流れで実行する (gameScript が重くても、順序は入れ替わらない)
   */
  async processTimeline(
    steps: ScenarioStepType[],
    defaultPlaceholders: Record<string, string | number>,
    omiken: OmikenCommentType | undefined,
    onDeferred: (messages: BotMessageType[]) => void
  ): Promise<TimelineResult> {
    const startedAt = Date.now()
    const timeline = this.scenarioStepHandler.buildTimeline(steps)
    const immediate = timeline.filter((step) => step.delaySeconds <= 0)
    const deferred = timeline.filter((step) => step.delaySeconds > 0)

    const messages: BotMessageType[] = []
    for (const step of immediate) {
      messages.push(...(await this.process(step, defaultPlaceholders, omiken)))
    }

    if (deferred.length > 0) {
      // 完了は待たない (即時分の結果をすぐ返す)。失敗は runDeferred 内で通知する
      void this.runDeferred(deferred, startedAt, defaultPlaceholders, omiken, onDeferred)
    }

    const handled =
      messages.length > 0 || deferred.some((step) => step.kind === 'message' || step.kind === 'gameScript')
    return { messages, handled }
  }

  /**
   * 遅延分のステップを、同じ時刻ごとにまとめて、時刻順に実行する
   */
  private async runDeferred(
    steps: ScenarioStepType[],
    startedAt: number,
    defaultPlaceholders: Record<string, string | number>,
    omiken: OmikenCommentType | undefined,
    onDeferred: (messages: BotMessageType[]) => void
  ): Promise<void> {
    try {
      const groups = new Map<number, ScenarioStepType[]>()
      for (const step of steps) {
        const group = groups.get(step.delaySeconds)
        if (group) group.push(step)
        else groups.set(step.delaySeconds, [step])
      }

      for (const [delaySeconds, group] of groups) {
        const waitMs = startedAt + delaySeconds * 1000 - Date.now()
        if (waitMs > 0) await sleep(waitMs)

        const messages: BotMessageType[] = []
        for (const step of group) {
          messages.push(...(await this.process({ ...step, delaySeconds: 0 }, defaultPlaceholders, omiken)))
        }
        if (messages.length > 0) onDeferred(messages)
      }
    } catch (error) {
      console.error('遅延ステップの実行エラー', error)
      showErrorNotice(`遅延ステップの実行エラー ${error}`)
    }
  }

  /**
   * control アイテムの variable (評価ブロック) を評価する (投稿なし・変数状態の更新のみ)
   */
  evaluateVariable(variable: string, defaultPlaceholders: Record<string, string | number>): void {
    try {
      this.scenarioStepHandler.evaluateVariable(variable, defaultPlaceholders)
    } catch (error) {
      console.error('variable 評価エラー', error)
      showErrorNotice(`variable 評価エラー ${error}`)
    }
  }
}
