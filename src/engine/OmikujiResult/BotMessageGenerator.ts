// src/engine/OmikujiResult/BotMessageGenerator.ts
import { ScenarioStepType, OmikujiDataType, hasScenarioStepMessage } from '@/types/OmikujiData/'
import { createBotMessagesFromAction } from './BotMessageHelpers'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'
import { VariablePlaceholderProcessor } from '@/engine/VariablePlaceholder/VariableProcessor'
import { PostOmikujiService } from '@/engine/PostOmikuji/PostOmikujiService'
import { CharacterResolver } from '../CharacterResolver/CharacterResolver'
import { BotMessageType, ProcessedStep } from '@/types/generator'
import { OmikenCommentType } from '@/types/OmikenComment'
import { playSoundDelay } from '@/common/sounds'

/** 評価ブロック {{ ... }} */
const EVAL_PATTERN = /\{\{[\s\S]*?\}\}/g

export class BotMessageGenerator {
  private readonly variableProcessor: VariablePlaceholderProcessor
  private readonly postMessage: PostOmikujiService
  private readonly characterResolver: CharacterResolver
  private readonly soundEnabled: boolean
  private readonly basicDelaySeconds: number

  constructor(omikujiData: OmikujiDataType, variable: PlaceholderVariableType) {
    const { soundEnabled, basicDelaySeconds } = omikujiData.settings.generator

    this.variableProcessor = new VariablePlaceholderProcessor(variable)
    this.postMessage = new PostOmikujiService(omikujiData)
    this.characterResolver = new CharacterResolver(omikujiData.assets.characters)
    this.soundEnabled = soundEnabled
    this.basicDelaySeconds = basicDelaySeconds ?? 1
  }

  /**
   * 評価ブロックを処理し、解析結果を保持する型に変換
   */
  processVariables(actions: ScenarioStepType[]): ProcessedStep[] {
    return actions.map((action): ProcessedStep => {
      // message は本文と slots の両方を評価する (slots は uiKey ごとの入力欄の値)
      if (action.kind === 'message') {
        // 予約語は、message と slots の処理が終わるまで残す
        const processed = action.message ? this.variableProcessor.process(action.message) : undefined
        const slots = Object.fromEntries(
          Object.entries(action.slots).map(([key, text]) => [key, this.variableProcessor.process(text).bubble])
        )
        return {
          step: { ...action, message: processed?.bubble ?? action.message, slots },
          extra: processed?.extra,
        }
      }
      if (!hasScenarioStepMessage(action) || !action.message) return { step: action }

      // 変数処理の実行（ランキング抽出等）
      const { bubble, extra } = this.variableProcessor.process(action.message)
      return { step: { ...action, message: bubble }, extra }
    })
  }

  /**
   * わんコメへ投稿し、BotMessageを生成
   */
  postAndGenerate(
    processedActions: ProcessedStep[],
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    if (isOnecommePost) {
      // variable は投稿対象から除外
      const postTargets = processedActions.map((a) => a.step).filter((action) => action.kind !== 'variable')
      this.postMessage.post(postTargets)
    }
    return this.generate(processedActions, omiken, isOnecommePost)
  }

  /**
   * 処理済みステップからBotMessageを生成
   */
  private generate(
    processedActions: ProcessedStep[],
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    const messages: BotMessageType[] = []
    const canPlaySound = this.soundEnabled && !!isOnecommePost

    for (const { step: action, extra } of processedActions) {
      const delaySeconds = action.delaySeconds + this.basicDelaySeconds

      switch (action.kind) {
        case 'message':
          messages.push(...createBotMessagesFromAction(action, extra, delaySeconds, this.characterResolver, omiken))
          if (canPlaySound && (action.sound || action.soundPath))
            playSoundDelay(action.sound, action.soundPath, delaySeconds)
          break

        case 'variable':
          // 投稿なし・音声なし・BotMessage 生成なし (変数処理のみ)
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
  stripVariables(actions: ScenarioStepType[]): ProcessedStep[] {
    return actions.map((action): ProcessedStep => {
      if (action.kind !== 'message' && action.kind !== 'variable') return { step: action }
      if (action.kind === 'message') {
        const slots = Object.fromEntries(Object.entries(action.slots).map(([k, t]) => [k, t.replace(EVAL_PATTERN, '')]))
        return { step: { ...action, message: (action.message ?? '').replace(EVAL_PATTERN, ''), slots } }
      }
      if (!action.message) return { step: action }

      return { step: { ...action, message: action.message.replace(EVAL_PATTERN, '') } }
    })
  }
}
