// src/games/scriptsEngine/RankingMessage/RankingMessage.ts
import { OmikenCommentType, UserNameSchema, UserNameType } from '@/types/OmikenComment'
import { BotMessageExtraSchema, BotMessageExtraType } from '@/generator/types'

const UNKNOWN_NAME = 'おみくじBOT'

/**
 * BotMessage構築のパラメータ
 */
interface BuildBotMessageParams {
  user: UserNameType
  bubbleText: string
  score: number
  symbol: string
  delaySeconds?: number
  isUnique?: boolean
  isOverLimit: boolean
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
 * TODO(LiveConsole): この関数は BotMessageExtraType を返す。ランキング(ゲームログ)用には BotMessageRankingType
 *   (@/generator/types) を返す関数に置き換える。score は lists.order に入れている値と同じ。
 *   移行するまで、GameRanking 側の scripts/toRankingMessage.ts が変換して API に保存する。
 *
 * BotMessageを構築する共通関数
 * 吹き出し(comment)とランキング(extra)を個別のメッセージとして出力する
 */
export function buildBotMessageRanking(params: BuildBotMessageParams): BotMessageExtraType {
  const { user, score, symbol, delaySeconds = 3.5, isUnique = false, isOverLimit } = params

  return BotMessageExtraSchema.parse({
    delaySeconds,
    user,
    lists: {
      listName: user.userName,
      symbol,
      text: String(score),
      order: score,
      isVisible: !isOverLimit,
      isUnique,
    },
  })
}
