// src/generator/stores/useNoticeStore.ts
// 配信画面の右下に出す、小さな通知の一覧。読み上げ・わんコメへの投稿はしない(表示だけ)
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

/** 通知の種類(見た目と表示時間が変わる) */
export type NoticeKind = 'cooldown' | 'error'
export type Notice = { id: string; text: string; kind: NoticeKind }

const MAX_NOTICES = 5 // 同時に表示する件数。超えたら古いものから消す
const DISPLAY_MILLISECONDS: Record<NoticeKind, number> = { cooldown: 3000, error: 5000 }

export const useNoticeStore = defineStore('notice', () => {
  const notices = ref<Notice[]>([])

  const remove = (id: string) => {
    notices.value = notices.value.filter((notice) => notice.id !== id)
  }

  /**
   * 通知を追加する。
   * エラーは同じ文言が続けて起きやすいので、すでに出ているものは入れ替えて(表示時間を延ばして)1 件にまとめる。
   * クールダウンは、重なるほど面白いのでまとめない
   */
  const push = (text: string, kind: NoticeKind) => {
    const id = nanoid()
    const rest =
      kind === 'error' ? notices.value.filter((n) => !(n.kind === 'error' && n.text === text)) : notices.value
    notices.value = [...rest, { id, text, kind }].slice(-MAX_NOTICES)
    setTimeout(() => remove(id), DISPLAY_MILLISECONDS[kind])
  }

  return { notices, push }
})
