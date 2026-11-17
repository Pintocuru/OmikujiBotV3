<!-- src/ui/bot/ToastWidgets/editor/ToastWidgetsMessagePreview.vue -->
<template>
  <HudPreview>
    <div class="flex flex-col">
      <div :class="!settings.showToastsOnRight ? 'self-start' : 'self-end'">
        <ToastBubbleSelector
          :settings="settings"
          :fontFamily="data.ui.fontFamily"
          editorPreview
          :message="message || $t('uiSettings.common.emptyMessage')"
          :color="getCharacterColor(shownKey)"
          :iconLayers="
            settings.showToastsCharacter ? toastIconLayers(getCharacter(shownKey), iconKey || 'default') : []
          "
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
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useCharacterLookup } from '@/editor/helpers/CharacterChanger/composables/useCharacterLookup'
  import { resolveToastCharacterKey, toastIconLayers } from '../toastCharacter'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import ToastBubbleSelector from '@/ui/bot/ToastWidgets/ToastBubbleSelector.vue'

  // UI プレビュー共通の props。toastWidgets は slots を使わない
  const props = defineProps<{
    message?: string
    characterKey?: string
    iconKey?: string
    slots?: BotMessageSlotsType
  }>()

  const { data } = storeToRefs(useOmikujiStore())
  // 編集中のデータ(omikujiStore)のキャラクターを参照する(配信側の appStore ではない)
  const { characterArray, getCharacter, getCharacterColor } = useCharacterLookup()
  const settings = computed(() => ToastWidgetsSchema.parse(data.value.ui.settings.toastWidgets ?? {}))

  // キャラ未指定なら fallbackCharacter(ランダムは設定・キャラ・キーが変わったときだけ引き直す)
  const shownKey = computed(() =>
    resolveToastCharacterKey(props.characterKey, settings.value.fallbackCharacter, characterArray.value)
  )
</script>
