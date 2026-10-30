// src/ui/GameRanking/scripts/services/MessageService.ts
import { ScenarioStepMessageSchema, ScenarioStepMessageType } from '@/types/OmikujiData'

/**
 * メッセージ作成に必要な最小限のパラメータ
 * TODO(LiveConsole): GameRanking 内でのみ表示するメッセージとして使う予定。現在はどこからも呼ばれていない。
 *   他の UI に渡すメッセージにはしない(前バージョンで仕組みが煩雑になったため)。
 */
export interface RankingMessageParams {
  user: { userName: string }
  characterKey: string | null
}

/**
 * PostActionType型のメッセージを作成
 */
export const createSteps = (
  params: RankingMessageParams,
  score: number,
  isOverLimit: boolean,
  rank?: number
): ScenarioStepMessageType[] => {
  const { user, characterKey } = params

  return [
    ScenarioStepMessageSchema.parse({
      delaySeconds: 8,
      characterKey,
      message: rank
        ? createRankingMessage(user.userName, score, rank, isOverLimit)
        : createMessage(user.userName, score, isOverLimit),
      sound: 'cute',
    }),
  ]
}

/**
 * ランキング情報を含むメッセージを作成
 * リストの下部にアナウンスを流す用途
 */
const createRankingMessage = (userName: string, score: number, rank: number, isOverLimit: boolean): string => {
  if (isOverLimit) return `${userName}さんは上限を超えているから、参考記録だよ。`
  return `${userName}さんの${score}ポイントは、${rank}位だよ。`
}

/**
 * ユーザー統計と記録からメッセージを作成
 */
const createMessage = (userName: string, score: number, isOverLimit: boolean): string => {
  if (isOverLimit) return `${userName}さんは上限を超えているから、参考記録だよ。`

  // ランキング情報は外部で取得する想定
  // ここではシンプルなメッセージのみ
  if (score > 0) return `${userName}さんの${score}ポイントを記録したよ。`
  return `${userName}さんの記録を登録したよ。`
}
