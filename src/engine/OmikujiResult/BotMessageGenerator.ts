// src/engine/OmikujiResult/BotMessageGenerator.ts
import { ScenarioStepType, OmikujiDataType, hasScenarioStepMessage } from '@/types/OmikujiData/'
import { createBotMessagesFromStep } from './BotMessageHelpers'
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
  processVariables(steps: ScenarioStepType[]): ProcessedStep[] {
    return steps.map((step): ProcessedStep => {
      // message は本文と slots の両方を評価する (slots は uiKey ごとの入力欄の値)
      if (step.kind === 'message') {
        // 予約語は、message と slots の処理が終わるまで残す
        const processed = step.message ? this.variableProcessor.process(step.message) : undefined
        const slots = Object.fromEntries(
          Object.entries(step.slots).map(([key, text]) => [key, this.variableProcessor.process(text).bubble])
        )
        return {
          step: { ...step, message: processed?.bubble ?? step.message, slots },
          extra: processed?.extra,
        }
      }
      if (!hasScenarioStepMessage(step) || !step.message) return { step }

      // 変数処理の実行（ランキング抽出等）
      const { bubble, extra } = this.variableProcessor.process(step.message)
      return { step: { ...step, message: bubble }, extra }
    })
  }

  /**
   * わんコメへ投稿し、BotMessageを生成
   */
  postAndGenerate(
    processedSteps: ProcessedStep[],
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    if (isOnecommePost) {
      // variable は投稿対象から除外
      const postTargets = processedSteps.map((a) => a.step).filter((step) => step.kind !== 'variable')
      this.postMessage.post(postTargets)
    }
    return this.generate(processedSteps, omiken, isOnecommePost)
  }

  /**
   * 処理済みステップからBotMessageを生成
   */
  private generate(
    processedSteps: ProcessedStep[],
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    const messages: BotMessageType[] = []
    const canPlaySound = this.soundEnabled && !!isOnecommePost

    for (const { step, extra } of processedSteps) {
      const delaySeconds = step.delaySeconds + this.basicDelaySeconds

      switch (step.kind) {
        case 'message':
          messages.push(...createBotMessagesFromStep(step, extra, delaySeconds, this.characterResolver, omiken))
          if (canPlaySound && (step.sound || step.soundPath))
            playSoundDelay(step.sound, step.soundPath, delaySeconds)
          break

        case 'variable':
          // 投稿なし・音声なし・BotMessage 生成なし (変数処理のみ)
          break

        case 'sound':
          if (canPlaySound && (step.sound || step.soundPath))
            playSoundDelay(step.sound, step.soundPath, delaySeconds)
          break
      }
    }

    return messages
  }

  /**
   * 評価ブロック {{ }} を計算せずに除去する（ダミー演出用）
   */
  stripVariables(steps: ScenarioStepType[]): ProcessedStep[] {
    return steps.map((step): ProcessedStep => {
      if (step.kind !== 'message' && step.kind !== 'variable') return { step }
      if (step.kind === 'message') {
        const slots = Object.fromEntries(Object.entries(step.slots).map(([k, t]) => [k, t.replace(EVAL_PATTERN, '')]))
        return { step: { ...step, message: (step.message ?? '').replace(EVAL_PATTERN, ''), slots } }
      }
      if (!step.message) return { step }

      return { step: { ...step, message: step.message.replace(EVAL_PATTERN, '') } }
    })
  }
}
