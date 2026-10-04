// src/engine/OmikujiResult/OmikujiResultProcessor.ts
import { OmikujiDataType, PostFlowType } from '@/types/OmikujiData/'
import { OmikenCommentType } from '@/types/OmikenComment'

import { BotMessageGenerator } from './BotMessageGenerator'
import { PostActionsHandler } from './PostActionsHandler'
import { GameScriptsHandler } from '../GameScriptPlay/GameScriptsHandler'
import { PlaceholderVariableType } from '@/generator/stores/PlaceholderVariable/PlaceholderVariable'
import { CooldownManager } from '@/generator/stores/CooldownManager/CooldownManager'
import { GameScriptManager } from '@/engine/GameScriptPlay/GameScriptManager'
import { BotMessageType } from '@/generator/types'
import { postSystemMessage } from '@/sdk/post/PostOneComme'

/**
 * おみくじ結果の処理とBotMessage生成を担当
 */
export class OmikujiResultProcessor {
  private readonly postActionsHandler: PostActionsHandler
  private readonly gameScriptsHandler: GameScriptsHandler
  private readonly cooldownManager = CooldownManager.getInstance()

  constructor(
    omikujiData: OmikujiDataType,
    playScript: GameScriptManager['playScript'],
    variable: PlaceholderVariableType
  ) {
    const generator = new BotMessageGenerator(omikujiData, variable)
    this.postActionsHandler = new PostActionsHandler(omikujiData, variable, generator)
    this.gameScriptsHandler = new GameScriptsHandler(playScript, generator)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  async process(
    actionItem: PostFlowType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    return this.run(actionItem, defaultPlaceholders, omiken, true) // 投稿あり固定
  }

  /**
   * スロット演出用ダミーメッセージを生成。
   * わんコメへの投稿・サウンド再生は行わない。
   */
  async processDummy(
    actionItem: PostFlowType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType
  ): Promise<BotMessageType[]> {
    return this.run(actionItem, defaultPlaceholders, omiken, false)
  }

  private async run(
    actionItem: PostFlowType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): Promise<BotMessageType[]> {
    try {
      let messages: BotMessageType[]

      switch (actionItem.kind) {
        case 'gameScript':
          messages = await this.gameScriptsHandler.process(actionItem, omiken, isOnecommePost)
          break

        case 'flowCall':
          messages = this.postActionsHandler.process(actionItem, defaultPlaceholders, omiken, isOnecommePost)
          break

        default:
          return []
      }

      return messages
    } catch (error) {
      console.error('おみくじ実行エラー', error)
      postSystemMessage(`おみくじ実行エラー ${error}`)
      return []
    }
  }
}
