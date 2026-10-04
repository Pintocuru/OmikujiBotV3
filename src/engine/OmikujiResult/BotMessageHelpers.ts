// src/engine/OmikujiResult/BotMessageHelpers.ts
import {
  BotMessageBubbleSchema,
  BotMessageExtraSchema,
  BotMessageExtraType,
  BotMessageType,
  ExtraSlotsType,
  VariablePlaceholderExtra,
} from '@/generator/types'
import { PostFlowMessageType } from '@/types/OmikujiData'
import { CharacterManager } from '../CharacterManager/CharacterManager'
import { OmikenCommentType, UserNameSchema } from '@/types/OmikenComment'

/**
 * PostActionからBotMessageを生成
 */
export function createBotMessagesFromAction(
  action: PostFlowMessageType,
  extra: VariablePlaceholderExtra | undefined,
  delaySeconds: number,
  characterManager?: CharacterManager,
  omiken?: OmikenCommentType
): BotMessageType[] {
  const message = action.message || ''
  const hasRanking = !!extra?.scriptKey && (!!extra?.lists || !!extra?.slots)

  const messages: BotMessageType[] = []

  const bubbleMessage = createBubbleMessage(
    action.characterKey,
    action.iconKey,
    message,
    delaySeconds,
    characterManager,
    extra?.slots
  )
  messages.push(bubbleMessage)

  // Rankingメッセージ
  if (hasRanking) messages.push(createRankingMessage(delaySeconds, extra, omiken))

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
  const hasRanking = extra?.scriptKey && (extra.lists || extra.slots)
  return hasRanking ? [createRankingMessage(delaySeconds, extra, omiken)] : []
}

/**
 * Bubbleメッセージを生成
 */
function createBubbleMessage(
  characterKey: string | null,
  iconKey: string,
  message: string,
  delaySeconds: number,
  characterManager?: CharacterManager,
  slots?: ExtraSlotsType
): BotMessageType {
  const resolved = characterManager?.resolveCharacter({ characterKey, iconKey })
  const character = resolved && characterManager?.getCharacter(resolved.characterKey)

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
 */
function createRankingMessage(
  delaySeconds: number,
  extra: VariablePlaceholderExtra,
  omiken?: OmikenCommentType
): BotMessageExtraType {
  return BotMessageExtraSchema.parse({
    delaySeconds,
    scriptKey: extra.scriptKey,
    lists: extra.lists,
    slots: extra.slots,
    user: omiken ? UserNameSchema.parse(omiken) : undefined,
  })
}
