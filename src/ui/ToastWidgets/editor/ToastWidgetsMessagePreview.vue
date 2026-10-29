<!-- src/ui/ToastWidgets/editor/ToastWidgetsMessagePreview.vue -->
<template>
  <HudPreview>
    <div class="flex flex-col" :class="[fontFamily]">
      <div :class="!settings.showToastsOnRight ? 'self-start' : 'self-end'">
        <ToastBubbleSelector
          :settings="settings"
          :message="message || '(未記入)'"
          :color="getCharacterColor(characterKey || null)"
          :iconLayers="settings.showToastsCharacter ? iconSrc(characterKey || null, iconKey || 'default') : []"
        />
      </div>
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { ToastWidgetsSchema } from '@/types/ui'
  import type { BotMessageSlotsType } from '@/types/generator'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useCharacters } from '@/generator/composables/useCharacters'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import ToastBubbleSelector from '@/ui/ToastWidgets/ToastBubbleSelector.vue'

  // UI プレビュー共通の props。toastWidgets は slots を使わない
  defineProps<{
    message?: string
    characterKey?: string
    iconKey?: string
    slots?: BotMessageSlotsType
  }>()

  const { data } = storeToRefs(useOmikujiStore())
  const { iconSrc, getCharacterColor } = useCharacters()
  const fontFamily = computed(() => useFontFamily(data.value.ui.fontFamily ?? 'default'))
  const settings = computed(() => ToastWidgetsSchema.parse(data.value.ui.settings.toastWidgets ?? {}))
</script>
