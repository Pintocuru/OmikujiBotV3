// src/ui/LuckyDraw/composables/useLuckyDraw.ts
import { watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'
import { LuckyDrawSlotMap } from '@/types/generator'
import type { BotMessageType } from '@/types/generator'
import type { LuckyDrawType } from '@/types/ui'
import { useLuckyDrawCore } from './useLuckyDrawCore'

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number') return Number.isNaN(value) ? undefined : value
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value)
    return Number.isNaN(num) ? undefined : num
  }
  return undefined
}

/**
 * 配信画面用。botMessages の luckyDraw 宛てメッセージ(slot0 = join / draw / reset)を処理する
 */
export function useLuckyDraw(settings: Ref<LuckyDrawType>) {
  const core = useLuckyDrawCore(settings)
  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)

  // 処理済みメッセージ(同じメッセージを 2 回処理しない)
  const processed = new Set<string>()

  const handle = (msg: BotMessageType) => {
    const slots = msg.slots
    if (!slots) return
    const action = String(slots[LuckyDrawSlotMap.action.slot] ?? '').trim()

    if (action === 'join') {
      if (msg.user) core.join(msg.user)
    } else if (action === 'draw') {
      core.draw(toNumber(slots[LuckyDrawSlotMap.count.slot]))
    } else if (action === 'reset') {
      core.resetParticipants()
    }
  }

  watch(
    botMessages,
    (list) => {
      for (const msg of list) {
        if (processed.has(msg.id)) continue
        processed.add(msg.id)
        if (msg.uiKey === 'luckyDraw') handle(msg)
      }
    },
    { immediate: true, deep: true }
  )

  return core
}
