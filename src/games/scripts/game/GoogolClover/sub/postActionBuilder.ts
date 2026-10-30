// src/games/scripts/game/GoogolClover/sub/postActionBuilder.ts
import { PostFlowType, PostFlowMessageSchema } from '@/types/OmikujiData'

/**
 * PostActionの構築ロジック
 */

interface PostActionBuildParams {
  bubble: string
  score: number
  characterKey: string | null
}

/**
 * ゲーム結果に基づいてPostActionを構築
 */
export function buildPostActions(params: PostActionBuildParams): PostFlowType[] {
  const { bubble, score, characterKey } = params

  // メッセージ
  const messageAction = PostFlowMessageSchema.parse({
    delaySeconds: 3.5,
    characterKey,
    message: bubble,
    sound: 'decision',
  })

  // 共通シナリオ
  const commonActions: PostFlowType[] = [
    { kind: 'wordParty', delaySeconds: -1, wordPartyId: 'MaidenOmikujiLottery', repeat: 1 },
  ]

  // 成功時のシナリオ
  const successActions: PostFlowType[] = [
    { kind: 'wordParty', delaySeconds: 0, wordPartyId: 'MaidenOmikuji01', repeat: 1 },
    { kind: 'sound', delaySeconds: 1, sound: 'carnival', soundPath: '' },
  ]

  // 失敗時のシナリオ
  const failureActions: PostFlowType[] = [
    { kind: 'wordParty', delaySeconds: 0, wordPartyId: 'MaidenOmikuji08', repeat: 1 },
    { kind: 'sound', delaySeconds: 1, sound: 'fail', soundPath: '' },
    { kind: 'wordParty', delaySeconds: 1, wordPartyId: 'GoogolCloverFail', repeat: 1 },
  ]

  // Score が0より大きければ成功、そうでなければ失敗
  const isSuccess = score > 0
  const resultActions = isSuccess ? successActions : failureActions

  return [...commonActions, ...resultActions, messageAction]
}
