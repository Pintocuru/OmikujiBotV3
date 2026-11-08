// src/engine/OmikujiResult/BotMessageGenerator.ts
import { ScenarioStepType, OmikujiDataType } from '@/types/OmikujiData/'
import { createBotMessagesFromStep } from './BotMessageHelpers'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'
import { VariablePlaceholderProcessor } from '@/engine/VariablePlaceholder/VariableProcessor'
import { PostOmikujiService } from '@/engine/PostOmikuji/PostOmikujiService'
import { CharacterResolver } from '../CharacterResolver/CharacterResolver'
import { BotMessageType } from '@/types/generator'
import { OmikenCommentType } from '@/types/OmikenComment'
import { playSoundDelay } from '@/common/sounds'
import { describeError, showErrorNotice } from '@/generator/scripts/Notice/showNotice'

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
   * variable ステップの本文(評価ブロック)を評価して、変数を更新する。
   * 他のステップは何もしない (変数の値を本文に出すのは、[[key]] の役目)
   */
  evaluateVariableStep(step: ScenarioStepType): void {
    if (step.kind === 'variable' && step.message) this.variableProcessor.run(step.message)
  }

  /**
   * わんコメへ投稿し、BotMessageを生成
   */
  postAndGenerate(steps: ScenarioStepType[], omiken?: OmikenCommentType): BotMessageType[] {
    // variable は投稿対象から除外
    const postTargets = steps.filter((step) => step.kind !== 'variable')
    // 完了は待たない設計。post() が reject しても未処理にならないよう通知する
    this.postMessage.post(postTargets).catch((error) => {
      const msg = `投稿処理エラー: ${describeError(error)}`
      console.error(msg, error)
      showErrorNotice(msg)
    })
    return this.generate(steps, omiken)
  }

  /**
   * ステップからBotMessageを生成
   */
  private generate(steps: ScenarioStepType[], omiken?: OmikenCommentType): BotMessageType[] {
    const messages: BotMessageType[] = []
    const canPlaySound = this.soundEnabled

    for (const step of steps) {
      const delaySeconds = step.delaySeconds + this.basicDelaySeconds

      switch (step.kind) {
        case 'message':
          messages.push(...createBotMessagesFromStep(step, delaySeconds, this.characterResolver, omiken))
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
}
