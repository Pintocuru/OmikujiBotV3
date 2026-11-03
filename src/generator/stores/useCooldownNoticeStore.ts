// src/generator/stores/useCooldownNoticeStore.ts
// クールダウンでブロックされたことを、画面の右下に知らせる通知の一覧
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export type CooldownNotice = { id: string; text: string }

const MAX_NOTICES = 5 // 同時に表示する件数。超えたら古いものから消す
const DISPLAY_MILLISECONDS = 3000

export const useCooldownNoticeStore = defineStore('cooldownNotice', () => {
  const notices = ref<CooldownNotice[]>([])

  /**
   * 「◯◯がブロックされました(あと2.3秒)」を追加する。
   * 残り秒は 0.1 秒単位に切り上げる(「あと0.0秒」にならないようにするため)
   */
  const push = (userName: string, remainingSeconds: number) => {
    const seconds = (Math.ceil(remainingSeconds * 10) / 10).toFixed(1)
    const id = nanoid()
    notices.value = [...notices.value, { id, text: `${userName}がブロックされました(あと${seconds}秒)` }].slice(
      -MAX_NOTICES
    )
    setTimeout(() => remove(id), DISPLAY_MILLISECONDS)
  }

  const remove = (id: string) => {
    notices.value = notices.value.filter((notice) => notice.id !== id)
  }

  return { notices, push }
})
