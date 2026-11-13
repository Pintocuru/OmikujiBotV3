// src/ui/SnipeTimer/useSnipeTimer.ts
import { onUnmounted, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'
import { SnipeTimerSlotMap } from '@/types/generator'
import type { SnipeTimerType } from '@/types/ui'
import { useSnipeTimerCore } from './useSnipeTimerCore'

/**
 * 配信画面用: snipeTimer 宛ての BotMessage(slot の targetAt)を受け取って、カウントを始める
 * 本文は使わないため、useFilteredBotMessages ではなく botMessages を直接見る
 */
export const useSnipeTimer = (settings: Ref<SnipeTimerType>) => {
  const core = useSnipeTimerCore(settings)
  const { botMessages } = storeToRefs(useAppStore())
  const processed = new Set<string>()

  const stopWatch = watch(
    botMessages,
    (list) => {
      for (const msg of list) {
        if (msg.uiKey !== 'snipeTimer' || processed.has(msg.id)) continue
        processed.add(msg.id)
        const target = Number(msg.slots?.[SnipeTimerSlotMap.targetAt.slot])
        if (Number.isFinite(target)) core.receive(target)
      }
    },
    { immediate: true }
  )
  onUnmounted(stopWatch)

  return core
}
