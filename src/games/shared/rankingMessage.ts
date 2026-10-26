// src/games/shared/rankingMessage.ts
import { OmikenCommentType, UserNameSchema, UserNameType } from '@/types/OmikenComment'
import { BotMessageRankingSchema, BotMessageRankingType } from '@/types/generator'

const UNKNOWN_NAME = 'おみくじBOT'

/**
 * ランキングメッセージ構築のパラメータ
 */
interface BuildRankingMessageParams {
  user: UserNameType
  score: number // 比較用の得点
  symbol: string // 名前の補助記号
  label?: string // 表示用の得点 (省略時は score をそのまま文字にする)
  gameKey?: string // ゲームの認識キー(任意)
  delaySeconds?: number
}

/**
 * ユーザー情報を準備（omikenの有無を吸収）
 */
export function prepareUserInfo(omiken?: OmikenCommentType): UserNameType {
  return UserNameSchema.parse({
    userName: UNKNOWN_NAME,
    userId: UNKNOWN_NAME,
    ...omiken,
  })
}
/**
 * ランキングメッセージ(uiKey: 'gameRanking')を構築する共通関数
 * 表示するかどうか(上限・ユーザーごとの重複など)は、ここでは決めず UI 側で決める。
 */
export function buildBotMessageRanking(params: BuildRankingMessageParams): BotMessageRankingType {
  const { user, score, symbol, label = String(score), gameKey, delaySeconds = 3.5 } = params

  return BotMessageRankingSchema.parse({
    delaySeconds,
    user,
    slots: { gameKey, listName: user.userName, symbol, label, score },
  })
}
