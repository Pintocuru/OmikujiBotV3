// src/ui/FlashBanner/composables/useFlashBannerDisplay.ts
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'
import { FlashBannerSlotMap } from '@/types/generator'

/**
 * コメントがないときに流す文言(テンプレート)
 * flashBanner 宛ての BotMessage の slot0(FlashBannerSlotMap.defaultMessage)を受け取る。
 * 最後に届いたものを使い、何も届いていなければ空(= 何も表示しない)。
 * 本文は使わないため、useFilteredBotMessages ではなく botMessages を直接見る
 */
export function useFlashBannerDefaultTemplate() {
  const { botMessages } = storeToRefs(useAppStore())

  const latest = computed(() => {
    for (let i = botMessages.value.length - 1; i >= 0; i--) {
      const msg = botMessages.value[i]
      if (msg.uiKey !== 'flashBanner') continue
      const value = msg.slots?.[FlashBannerSlotMap.defaultMessage.slot]
      if (typeof value === 'string' && value.trim()) return value
    }
    return null
  })

  // botMessages が消されても、直前の文言は保持する
  const template = ref('')
  watch(
    latest,
    (value) => {
      if (value !== null) template.value = value
    },
    { immediate: true }
  )

  return { template }
}
