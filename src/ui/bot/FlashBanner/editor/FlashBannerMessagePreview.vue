<!-- src/ui/bot/FlashBanner/editor/FlashBannerMessagePreview.vue -->
<template>
  <HudPreview>
    <div :class="[fontFamily]">
      <FlashBannerSelector
        :key="`${settings.component}-${isSlotOnly}`"
        editorPreview
        :settings="settings"
        :message="displayMessage"
        :character-layers="characterLayers"
        :color="color"
      />
    </div>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { FlashBannerSchema } from '@/types/ui'
  import { FlashBannerSlotMap, type BotMessageSlotsType } from '@/types/generator'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useAppCharacters } from '@/ui/common/useAppCharacters'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import FlashBannerSelector from '../FlashBannerSelector.vue'

  // UI プレビュー共通の props。flashBanner は slot0(コメントがないときの文言)を使う
  const props = defineProps<{
    message?: string
    characterKey?: string
    iconKey?: string
    slots?: BotMessageSlotsType
  }>()

  const { t } = useI18n()
  const { data } = storeToRefs(useOmikujiStore())
  const { iconSrc, getCharacterColor, isValidCharacter } = useAppCharacters()
  const fontFamily = computed(() => useFontFamily(data.value.ui.fontFamily ?? 'default'))
  const settings = computed(() => FlashBannerSchema.parse(data.value.ui.settings.flashBanner ?? {}))

  // 本文があればコメント表示、なければ slot0 の文言(プレースホルダーは解決しないまま見せる)
  const slotMessage = computed(() => {
    const value = props.slots?.[FlashBannerSlotMap.defaultMessage.slot]
    return typeof value === 'string' ? value : ''
  })
  const isSlotOnly = computed(() => !props.message?.trim() && !!slotMessage.value.trim())

  const displayMessage = computed(() => {
    if (props.message?.trim()) return props.message
    if (slotMessage.value.trim()) return slotMessage.value
    return t('uiSettings.common.emptyMessage')
  })

  // キャラクター(コメント表示のときだけ)
  const hasCharacter = computed(() => !isSlotOnly.value && !!props.characterKey && isValidCharacter(props.characterKey))
  const characterLayers = computed(() =>
    hasCharacter.value ? iconSrc(props.characterKey ?? '', props.iconKey || 'default') : []
  )
  const color = computed(() =>
    hasCharacter.value ? getCharacterColor(props.characterKey ?? '') : settings.value.color
  )
</script>
