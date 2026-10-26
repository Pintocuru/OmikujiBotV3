// src/engine/OmikujiResult/BotMessageHelpers.ts
import {
  BotMessageBubbleSchema,
  BotMessageRankingSchema,
  BotMessageSlotsType,
  BotMessageType,
  VariablePlaceholderExtra,
  fromRankingEntry,
} from '@/types/generator'
import { PostFlowMessageType } from '@/types/OmikujiData'
import { CharacterResolver } from '../CharacterResolver/CharacterResolver'
import { OmikenCommentType, UserNameSchema } from '@/types/OmikenComment'

/**
 * PostActionからBotMessageを生成
 */
export function createBotMessagesFromAction(
  action: PostFlowMessageType,
  extra: VariablePlaceholderExtra | undefined,
  delaySeconds: number,
  characterResolver?: CharacterResolver,
  omiken?: OmikenCommentType
): BotMessageType[] {
  const message = action.message || ''
  const messages: BotMessageType[] = []

  // 評価ブロックだけのメッセージ (評価後に本文が空) は、吹き出しを作らない
  if (message.trim()) {
    messages.push(
      createBubbleMessage(action.characterKey, action.iconKey, message, delaySeconds, characterResolver, extra?.slots)
    )
  }

  // Rankingメッセージ
  if (extra?.lists) messages.push(...createRankingMessages(delaySeconds, extra, omiken))

  return messages
}

/**
 * PostFlowVariable からBotMessageを生成
 */
export function createBotMessagesFromVariable(
  extra: VariablePlaceholderExtra | undefined,
  delaySeconds: number,
  omiken?: OmikenCommentType
): BotMessageType[] {
  return extra?.lists ? createRankingMessages(delaySeconds, extra, omiken) : []
}

/**
 * Bubbleメッセージを生成
 */
function createBubbleMessage(
  characterKey: string | null,
  iconKey: string,
  message: string,
  delaySeconds: number,
  characterResolver?: CharacterResolver,
  slots?: BotMessageSlotsType
): BotMessageType {
  const resolved = characterResolver?.resolveCharacter({ characterKey, iconKey })
  const character = resolved && characterResolver?.getCharacter(resolved.characterKey)

  return BotMessageBubbleSchema.parse({
    delaySeconds,
    bubble: {
      name: character?.displayName || '',
      message,
      characterKey: resolved?.characterKey,
      iconKey: resolved?.iconKey,
    },
    slots,
  })
}

/**
 * Rankingメッセージを生成
 * - user と lists.order がある場合だけ作る (uiKey 'gameRanking')。
 * - user がない場合 (定期的なお知らせなど) や order がない場合は作らない (記録の対象にならない)。
 */
function createRankingMessages(
  delaySeconds: number,
  extra: VariablePlaceholderExtra,
  omiken?: OmikenCommentType
): BotMessageType[] {
  const { lists } = extra
  const user = omiken ? UserNameSchema.parse(omiken) : undefined
  if (!user || typeof lists?.order !== 'number') return []

  const ranking = BotMessageRankingSchema.safeParse({
    delaySeconds,
    user,
    slots: {
      listName: lists.listName || user.userName,
      symbol: lists.symbol,
      label: lists.text,
      score: lists.order,
    },
  })
  return ranking.success ? [fromRankingEntry(ranking.data)] : []
}
