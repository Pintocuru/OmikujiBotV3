// src/engine/OmikujiResult/BotMessageHelpers.ts
import {
  BotMessageBubbleSchema,
  BotMessageExtraSchema,
  BotMessageRankingSchema,
  BotMessageType,
  ExtraSlotsType,
  VariablePlaceholderExtra,
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
  const hasRanking = !!extra?.lists || !!extra?.slots

  const messages: BotMessageType[] = []

  // 評価ブロックだけのメッセージ (評価後に本文が空) は、吹き出しを作らない
  if (message.trim()) {
    messages.push(
      createBubbleMessage(action.characterKey, action.iconKey, message, delaySeconds, characterResolver, extra?.slots)
    )
  }

  // Rankingメッセージ
  if (hasRanking) messages.push(...createRankingMessages(delaySeconds, extra, omiken))

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
  const hasRanking = extra?.lists || extra?.slots
  return hasRanking ? createRankingMessages(delaySeconds, extra, omiken) : []
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
  slots?: ExtraSlotsType
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
 * - user と lists.order がある場合: type 'ranking' (lists.slots があれば slots だけの 'extra' を別に作る)
 * - user がない場合 (定期的なお知らせなど) や order がない場合: 従来どおりの 'extra'。記録の対象にはならない
 */
function createRankingMessages(
  delaySeconds: number,
  extra: VariablePlaceholderExtra,
  omiken?: OmikenCommentType
): BotMessageType[] {
  const { lists, slots } = extra
  const user = omiken ? UserNameSchema.parse(omiken) : undefined

  if (user && typeof lists?.order === 'number') {
    const ranking = BotMessageRankingSchema.safeParse({
      delaySeconds,
      user,
      listName: lists.listName || user.userName,
      symbol: lists.symbol,
      label: lists.text,
      score: lists.order,
    })
    if (ranking.success) {
      const messages: BotMessageType[] = [ranking.data]
      if (slots) messages.push(BotMessageExtraSchema.parse({ delaySeconds, slots, user }))
      return messages
    }
  }

  return [BotMessageExtraSchema.parse({ delaySeconds, lists, slots, user })]
}
