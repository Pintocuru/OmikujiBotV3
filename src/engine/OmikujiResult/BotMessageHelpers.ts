// src/engine/OmikujiResult/BotMessageHelpers.ts
import {
  BotMessageBubbleSchema,
  BotMessageSchema,
  BotMessageSlotsType,
  BotMessageType,
  VariablePlaceholderExtra,
  getUiMessageSpec,
} from '@/types/generator'
import { PostFlowMessageType } from '@/types/OmikujiData'
import { CharacterResolver } from '../CharacterResolver/CharacterResolver'
import { OmikenCommentType, UserNameSchema } from '@/types/OmikenComment'

/**
 * PostFlowMessage から BotMessage を生成
 * - uiKey ごとの仕様 (bubble を使うか・slots) は UiMessageSpecs で決まる
 * - slots は、editor のフォームの値を、評価ブロックの slotN が上書きする
 */
export function createBotMessagesFromAction(
  action: PostFlowMessageType,
  extra: VariablePlaceholderExtra | undefined,
  delaySeconds: number,
  characterResolver?: CharacterResolver,
  omiken?: OmikenCommentType
): BotMessageType[] {
  const spec = getUiMessageSpec(action.uiKey)
  const user = omiken ? UserNameSchema.parse(omiken) : undefined
  const merged = { ...action.slots, ...extra?.slots }
  const slots = Object.keys(merged).length > 0 ? (merged as BotMessageSlotsType) : undefined

  if (spec.bubble) {
    // 評価ブロックだけのメッセージ (評価後に本文が空) は、吹き出しを作らない
    const message = action.message || ''
    if (!message.trim()) return []
    return [createBubbleMessage(action, message, delaySeconds, characterResolver, user, slots)]
  }

  // bubble を使わない UI は slots だけを渡す
  return slots ? [BotMessageSchema.parse({ uiKey: action.uiKey, delaySeconds, user, slots })] : []
}

/**
 * Bubbleメッセージを生成
 */
function createBubbleMessage(
  action: PostFlowMessageType,
  message: string,
  delaySeconds: number,
  characterResolver?: CharacterResolver,
  user?: BotMessageType['user'],
  slots?: BotMessageSlotsType
): BotMessageType {
  const { characterKey, iconKey } = action
  const resolved = characterResolver?.resolveCharacter({ characterKey, iconKey })
  const character = resolved && characterResolver?.getCharacter(resolved.characterKey)

  return BotMessageBubbleSchema.parse({
    uiKey: action.uiKey,
    delaySeconds,
    user,
    bubble: {
      name: character?.displayName || '',
      message,
      characterKey: resolved?.characterKey,
      iconKey: resolved?.iconKey,
    },
    slots,
  })
}
