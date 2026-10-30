// src/games/scripts/game/GoogolClover/sub/stepBuilder.ts
import { ScenarioStepType, ScenarioStepMessageSchema } from '@/types/OmikujiData'

/**
 * ステップの構築ロジック
 */

interface StepBuildParams {
  bubble: string
  score: number
  characterKey: string | null
}

/**
 * ゲーム結果に基づいてステップを構築
 */
export function buildSteps(params: StepBuildParams): ScenarioStepType[] {
  const { bubble, score, characterKey } = params

  // メッセージ
  const messageAction = ScenarioStepMessageSchema.parse({
    delaySeconds: 3.5,
    characterKey,
    message: bubble,
    sound: 'decision',
  })

  // 共通シナリオ
  const commonActions: ScenarioStepType[] = [
    { kind: 'wordParty', delaySeconds: -1, wordPartyId: 'MaidenOmikujiLottery', repeat: 1 },
  ]

  // 成功時のシナリオ
  const successActions: ScenarioStepType[] = [
    { kind: 'wordParty', delaySeconds: 0, wordPartyId: 'MaidenOmikuji01', repeat: 1 },
    { kind: 'sound', delaySeconds: 1, sound: 'carnival', soundPath: '' },
  ]

  // 失敗時のシナリオ
  const failureActions: ScenarioStepType[] = [
    { kind: 'wordParty', delaySeconds: 0, wordPartyId: 'MaidenOmikuji08', repeat: 1 },
    { kind: 'sound', delaySeconds: 1, sound: 'fail', soundPath: '' },
    { kind: 'wordParty', delaySeconds: 1, wordPartyId: 'GoogolCloverFail', repeat: 1 },
  ]

  // Score が0より大きければ成功、そうでなければ失敗
  const isSuccess = score > 0
  const resultActions = isSuccess ? successActions : failureActions

  return [...commonActions, ...resultActions, messageAction]
}
