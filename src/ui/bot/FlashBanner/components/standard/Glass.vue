<!-- src/ui/bot/FlashBanner/components/standard/Glass.vue -->
<template>
  <div
    class="flex min-h-12 items-center gap-3 overflow-hidden rounded-full px-4 py-2"
    :class="settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row'"
    :style="[rootStyle, glassStyle]"
  >
    <!-- ラベル -->
    <div
      v-if="settings.label"
      class="shrink-0 rounded-2xl px-3 py-1 text-xl font-bold opacity-90"
      :class="labelClass"
      :style="{ backgroundColor: 'var(--fb-accent)', color: 'var(--fb-bg)' }"
    >
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="flex shrink-0 items-center">
      <LayerImage :layers="characterLayers" :size="settings.iconSize * 4" :animation="characterAnimation" />
    </div>

    <!-- メッセージ -->
    <div ref="containerRef" class="min-w-0 flex-1 overflow-hidden">
      <div ref="wrapperRef">
        <span
          ref="textRef"
          class="inline-block text-5xl font-bold whitespace-nowrap"
          :class="scrollClass"
          :style="{ color: 'var(--fb-text)', '--scroll-duration': `${scrollDuration}s` }"
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

  // すりガラス(背景色は半透明にして、後ろをぼかす)
  const glassStyle = {
    backgroundColor: 'color-mix(in srgb, var(--fb-bg) 60%, transparent)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.10)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
  }

  const { displayMessage, wrapperRef } = useMessageTransition(() => props.message)
  const { textRef, containerRef, scrollDuration, scrollClass } = useFlashScroll({
    getMessage: () => displayMessage.value,
    getSettings: () => props.settings,
  })
</script>
