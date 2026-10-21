// src/engine/OmikujiResult/BotMessageGenerator.ts
import { PostFlowType, OmikujiDataType, hasPostFlowMessage } from '@/types/OmikujiData/'
import { createBotMessagesFromAction, createBotMessagesFromVariable } from './BotMessageHelpers'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'
import { VariablePlaceholderProcessor } from '@/engine/VariablePlaceholder/VariableProcessor'
import { PostOmikujiService } from '@/engine/PostOmikuji/PostOmikujiService'
import { CharacterManager } from '../CharacterManager/CharacterManager'
import { BotMessageType, ProcessedPostAction } from '@/generator/types'
import { OmikenCommentType } from '@/types/OmikenComment'
import { playSoundDelay } from '@/common/sounds'

/** 評価ブロック {{ ... }} */
const EVAL_PATTERN = /\{\{[\s\S]*?\}\}/g

export class BotMessageGenerator {
  private readonly variableProcessor: VariablePlaceholderProcessor
  private readonly postMessage: PostOmikujiService
  private readonly characterManager: CharacterManager
  private readonly soundEnabled: boolean
  private readonly basicDelaySeconds: number

  constructor(omikujiData: OmikujiDataType, variable: PlaceholderVariableType) {
    const { soundEnabled, basicDelaySeconds } = omikujiData.settings.generator

    this.variableProcessor = new VariablePlaceholderProcessor(variable)
    this.postMessage = new PostOmikujiService(omikujiData)
    this.characterManager = new CharacterManager(omikujiData.assets.characters)
    this.soundEnabled = soundEnabled
    this.basicDelaySeconds = basicDelaySeconds ?? 1
  }

  /**
   * 評価ブロックを処理し、解析結果を保持する型に変換
   */
  processVariables(actions: PostFlowType[]): ProcessedPostAction[] {
    return actions.map((action): ProcessedPostAction => {
      if (!hasPostFlowMessage(action) || !action.message) return { action }

      // 変数処理の実行（ランキング抽出等）
      // 評価後の本文 (bubble) を action.message に反映する。
      // 反映しないと、評価ブロック {{ }} が本文に残り、BotMessage 側ではそのまま表示され、
      // わんコメ投稿 (cleanPostMessage) では {{ }} が丸ごと消えてしまう
      const { bubble, extra } = this.variableProcessor.process(action.message)
      return { action: { ...action, message: bubble }, extra }
    })
  }

  /**
   * わんコメへ投稿し、BotMessageを生成
   */
  postAndGenerate(
    processedActions: ProcessedPostAction[],
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    if (isOnecommePost) {
      // variable は投稿対象から除外
      const postTargets = processedActions.map((a) => a.action).filter((action) => action.kind !== 'variable')
      this.postMessage.post(postTargets)
    }
    return this.generate(processedActions, omiken, isOnecommePost)
  }

  /**
   * 処理済みアクションからBotMessageを生成
   */
  private generate(
    processedActions: ProcessedPostAction[],
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    const messages: BotMessageType[] = []
    const canPlaySound = this.soundEnabled && !!isOnecommePost

    for (const { action, extra } of processedActions) {
      const delaySeconds = action.delaySeconds + this.basicDelaySeconds

      switch (action.kind) {
        case 'message':
          messages.push(...createBotMessagesFromAction(action, extra, delaySeconds, this.characterManager, omiken))
          if (canPlaySound && (action.sound || action.soundPath))
            playSoundDelay(action.sound, action.soundPath, delaySeconds)
          break

        case 'variable':
          // 投稿なし・音声なし。変数処理と BotMessage 生成のみ
          messages.push(...createBotMessagesFromVariable(extra, delaySeconds, omiken))
          break

        case 'sound':
          if (canPlaySound && (action.sound || action.soundPath))
            playSoundDelay(action.sound, action.soundPath, delaySeconds)
          break
      }
    }

    return messages
  }

  /**
   * 評価ブロック {{ }} を計算せずに除去する（ダミー演出用）
   */
  stripVariables(actions: PostFlowType[]): ProcessedPostAction[] {
    return actions.map((action): ProcessedPostAction => {
      if (action.kind !== 'message' && action.kind !== 'variable') return { action }
      if (!action.message) return { action }

      return { action: { ...action, message: action.message.replace(EVAL_PATTERN, '') } }
    })
  }
}
