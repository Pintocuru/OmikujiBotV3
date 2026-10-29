<!-- src/ui/LiveClock/editor/LiveClockMessagePreview.vue -->
<template>
  <HudPreview maxHeightClass="">
    <div class="flex justify-center" :class="[fontFamily]">
      <LiveClockSelector
        :settings="settings"
        :default-message="settings.defaultMessage ?? ''"
        :is-mounted="isMounted"
        :is-flipped="true"
        :current-msg="message ?? ''"
      />
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import { LiveClockSchema } from '@/types/ui'
  import type { BotMessageSlotsType } from '@/types/generator'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import LiveClockSelector from '@/ui/LiveClock/LiveClockSelector.vue'

  // UI プレビュー共通の props。liveClock は message だけを使う
  defineProps<{
    message?: string
    characterKey?: string
    iconKey?: string
    slots?: BotMessageSlotsType
  }>()

  const { data } = storeToRefs(useOmikujiStore())
  const fontFamily = computed(() => useFontFamily(data.value.ui.fontFamily ?? 'default'))
  const settings = computed(() => data.value.ui.settings.liveClock ?? LiveClockSchema.parse({}))

  // 投稿されたメッセージが出ている状態(コメント表示)で見せる
  const isMounted = ref(false)
  onMounted(() => {
    requestAnimationFrame(() => {
      isMounted.value = true
    })
  })
</script>
