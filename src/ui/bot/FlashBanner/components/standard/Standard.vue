<!-- src/ui/bot/FlashBanner/components/standard/Standard.vue -->
<template>
  <div
    class="flex min-h-18 items-center gap-4 overflow-hidden rounded-lg px-4 shadow-lg"
    :class="settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row'"
    :style="[rootStyle, { backgroundColor: 'var(--fb-bg)' }]"
  >
    <!-- ラベル -->
    <div
      v-if="settings.label"
      class="shrink-0 text-xl font-bold"
      :class="labelClass"
      :style="{ color: 'var(--fb-name)' }"
    >
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="shrink-0">
      <LayerImage :layers="characterLayers" :size="settings.iconSize * 4" :animation="characterAnimation" />
    </div>

    <!-- メッセージ(長いときだけスクロール) -->
    <div
      ref="containerRef"
      class="min-w-0 flex-1 overflow-hidden rounded-lg px-4"
      :style="{
        backgroundColor: 'color-mix(in srgb, var(--fb-bg) 85%, var(--fb-text))',
        color: 'var(--fb-text)',
      }"
    >
      <div ref="wrapperRef" class="flex items-center">
        <span
          ref="textRef"
          class="inline-block text-5xl font-bold whitespace-nowrap"
          :class="scrollClass"
          :style="{ '--scroll-duration': `${scrollDuration}s` }"
          v-html="displayMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import type { FlashBannerComponentProps } from '../../FlashBannerRegistry'
  import { useBannerColorVars } from '../../composables/useBannerColorVars'
  import { useFlashScroll } from '../../composables/useFlashScroll'
  import { useMessageTransition } from '../../composables/useMessageTransition'
  import '../../flashBanner.css'

  const props = defineProps<FlashBannerComponentProps>()

  const rootStyle = useBannerColorVars(() => props.color)
  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.characterLayers.length > 0)

  const { displayMessage, wrapperRef } = useMessageTransition(() => props.message)
  const { textRef, containerRef, scrollDuration, scrollClass } = useFlashScroll({
    getMessage: () => displayMessage.value,
    getSettings: () => props.settings,
  })
</script>
