// src/engine/GameScriptPlay/GameScriptsHandler.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import { PostFlowGameType } from '@/types/OmikujiData/'

import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'
import { BotMessageType } from '@/generator/types'
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
    actionItem: PostFlowGameType,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): Promise<BotMessageType[]> {
    // 1. スクリプトの実行
    const scriptResult = await this.playScript(actionItem, omiken)
    if (!scriptResult) return []

    const { actions, botMessageExtras: scriptMessages } = scriptResult

    // 2. 評価ブロックを処理
    const processedActions = this.generator.processVariables(actions)

    // 3. わんコメへ投稿 & BotMessage を生成
    return [...scriptMessages, ...this.generator.postAndGenerate(processedActions, omiken, isOnecommePost)]
  }
}
