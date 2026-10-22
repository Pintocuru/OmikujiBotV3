// src/ui/common/useFilteredBotMessages.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'
import type { BotMessageBubbleType } from '@/types/generator'
import type { UiKind } from '@/types/OmikujiData'

type Options = {
  displaySeconds?: number | null // 表示秒数（0 は無期限）
  userIconSize?: number // ユーザーアイコンの大きさ
  allowEmptyMessage?: boolean // 空メッセージを許可するか
}

const EMPTY_MESSAGE_FALLBACK = '(メッセージが入力されていません)'

export function useFilteredBotMessages(kind: UiKind, options: Options = {}) {
  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)

  const isKindEnabled = computed(() => !!data.value.ui.settings[kind])

  const { displaySeconds, userIconSize = 6, allowEmptyMessage: allowEmpty = false } = options

  const buildMessage = (bot: BotMessageBubbleType): BotMessageBubbleType => {
    const raw = bot.bubble.message
    const normalized = allowEmpty && !raw?.trim() ? EMPTY_MESSAGE_FALLBACK : raw

    const message = resolveIconPlaceholders(
      normalized,
      (userId) => appStore.userStats.get(userId)?.profileImage,
      userIconSize
    )

    return {
      ...bot,
      bubble: {
        ...bot.bubble,
        message,
        displaySeconds:
          displaySeconds != null ? (displaySeconds === 0 ? null : displaySeconds) : bot.bubble.displaySeconds,
      },
    }
  }

  const messages = computed<BotMessageBubbleType[]>(() => {
    if (!isKindEnabled.value) return []

    return botMessages.value.flatMap((msg) => {
      if (msg.type !== 'comment') return []
      if (!allowEmpty && !msg.bubble.message?.trim()) return []
      return [buildMessage(msg)]
    })
  })

  return { messages }
}

/**
 * {{icon userId}} をユーザーアイコン画像に置換
 */
export function resolveIconPlaceholders(
  raw: string,
  getProfileImage?: (userId: string) => string | undefined,
  userIconSize = 6
): string {
  if (!getProfileImage) return raw

  return raw.replace(/\{\{icon\s+([^}]+)\}\}/g, (_, userId) => {
    const url = getProfileImage(userId)
    return url ? `<img class="inline-block w-${userIconSize} h-${userIconSize} rounded-full" src="${url}" />` : ''
  })
}
