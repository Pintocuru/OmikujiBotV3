<!-- src/ui/KujibikiPanel/editor/KujibikiPanelMessagePreview.vue -->
<template>
  <HudPreview maxHeightClass="h-[440px]">
    <KujibikiPanelSelector :settings="settings" :messages="messages" />
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { KujibikiPanelSchema } from '@/types/ui'
  import type { BotMessageSlotsType } from '@/types/generator'
  import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import KujibikiPanelSelector from '@/ui/KujibikiPanel/KujibikiPanelSelector.vue'

  // UI プレビュー共通の props
  const props = defineProps<{
    message?: string
    characterKey?: string
    iconKey?: string
    slots?: BotMessageSlotsType
  }>()

  const { data } = storeToRefs(useOmikujiStore())
  const settings = computed(() => data.value.ui.settings.kujibikiPanel ?? KujibikiPanelSchema.parse({}))

  // step の内容を 1 件の表示メッセージにする(KujibikiPanelPreview のモックと同じ形)
  const messages = computed<DisplayedBotMessage[]>(() => [
    {
      id: 'preview-kujibiki',
      uiKey: 'kujibikiPanel',
      timestamp: new Date().toISOString(),
      delaySeconds: 0,
      bubble: {
        name: 'テストユーザー',
        message: props.message ?? '',
        isToast: false,
        characterKey: props.characterKey || null,
        iconKey: props.iconKey || 'default',
        displaySeconds: settings.value.displaySeconds,
      },
      slots: props.slots ?? {},
      display: { visible: true },
    },
  ])
</script>
