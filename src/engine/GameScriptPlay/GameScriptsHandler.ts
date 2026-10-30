// src/engine/GameScriptPlay/GameScriptsHandler.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import { ScenarioStepGameScriptType } from '@/types/OmikujiData/'

import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'
import { BotMessageType, fromRankingEntry } from '@/types/generator'
import { BotMessageGenerator } from '@/engine/OmikujiResult/BotMessageGenerator'

export class GameScriptsHandler {
  constructor(
    private readonly playScript: GameScriptManager['playScript'],
    private readonly generator: BotMessageGenerator
  ) {}

  /**
   * gameScripts処理
   */
  async process(
    step: ScenarioStepGameScriptType,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): Promise<BotMessageType[]> {
    // 1. スクリプトの実行
    const scriptResult = await this.playScript(step, omiken)
    if (!scriptResult) return []

    const { steps, rankingMessages: scriptMessages } = scriptResult

    // 2. 評価ブロックを処理
    const processedSteps = this.generator.processVariables(steps)

    // 3. わんコメへ投稿 & BotMessage を生成
    return [
      ...scriptMessages.map(fromRankingEntry),
      ...this.generator.postAndGenerate(processedSteps, omiken, isOnecommePost),
    ]
  }
}
