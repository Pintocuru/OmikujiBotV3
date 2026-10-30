// src/engine/OmikujiResult/OmikujiResultProcessor.ts
import { OmikujiDataType, ScenarioStepType } from '@/types/OmikujiData/'
import { OmikenCommentType } from '@/types/OmikenComment'

import { BotMessageGenerator } from './BotMessageGenerator'
import { ScenarioStepHandler } from './ScenarioStepHandler'
import { GameScriptsHandler } from '@/engine/GameScriptPlay/GameScriptsHandler'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'
import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'
import { BotMessageType } from '@/types/generator'
import { postSystemMessage } from '@/sdk/post/PostOneComme'

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
    return this.run(step, defaultPlaceholders, omiken, true) // 投稿あり固定
  }

  /**
   * スロット演出用ダミーメッセージを生成。
   * わんコメへの投稿・サウンド再生は行わない。
   */
  async processDummy(
    step: ScenarioStepType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    return this.run(step, defaultPlaceholders, omiken, false)
  }

  /**
   * control アイテムの variable (評価ブロック) を評価する (投稿なし・変数状態の更新のみ)
   */
  evaluateVariable(variable: string, defaultPlaceholders: Record<string, string | number>): void {
    try {
      this.scenarioStepHandler.evaluateVariable(variable, defaultPlaceholders)
    } catch (error) {
      console.error('variable 評価エラー', error)
      postSystemMessage(`variable 評価エラー ${error}`)
    }
  }

  private async run(
    step: ScenarioStepType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): Promise<BotMessageType[]> {
    try {
      let messages: BotMessageType[]

      switch (step.kind) {
        case 'gameScript': {
          const [resolved] = this.scenarioStepHandler.resolveFlows([step], defaultPlaceholders)
          messages =
            resolved.kind === 'gameScript'
              ? await this.gameScriptsHandler.process(resolved, omiken, isOnecommePost)
              : []
          break
        }

        // variable は式の評価のみ (吹き出しは作らない。lists / slots がある場合のみ Ranking メッセージ)
        case 'scenarioCall':
        case 'message':
        case 'variable':
        case 'sound':
        case 'wordParty':
          messages = this.scenarioStepHandler.process([step], defaultPlaceholders, omiken, isOnecommePost)
          break
      }

      return messages
    } catch (error) {
      console.error('おみくじ実行エラー', error)
      postSystemMessage(`おみくじ実行エラー ${error}`)
      return []
    }
  }
}
