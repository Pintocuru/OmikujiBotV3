// src/ui/user/LabelMaker/composables/useLabelMakerUsers.ts
import { shallowRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'
import type { LabelEntry } from '../scripts/labelUsers'

/** この UI 宛て(uiKey)の投稿 */
const UI_KEY = 'labelMaker'

/**
 * labelMaker 宛ての投稿から、届いた順のユーザー一覧を作る
 * - ユーザー一覧はこの UI が持つ(botMessages が空になっても残る)
 * - 同じメッセージ(id)は 1 回しか取り込まない(id が表示の key になる)。user のない投稿は載せない
 */
export function useLabelMakerUsers() {
  const { botMessages } = storeToRefs(useAppStore())
  const users = shallowRef<LabelEntry[]>([])
  const seenIds = new Set<string>()

  watch(
    botMessages,
    (messages) => {
      const added: LabelEntry[] = []
      for (const message of messages) {
        if (message.uiKey !== UI_KEY || !message.user || seenIds.has(message.id)) continue
        seenIds.add(message.id)
        added.push({ key: message.id, user: message.user })
      }
      if (added.length > 0) users.value = [...users.value, ...added]
    },
    { immediate: true }
  )

  return users
}
