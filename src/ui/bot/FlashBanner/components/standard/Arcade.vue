<!-- src/ui/bot/FlashBanner/components/standard/Arcade.vue -->
<template>
  <div
    class="flex min-h-18 items-center gap-4 overflow-hidden px-4"
    :class="settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row'"
    :style="[rootStyle, arcadeFrame]"
  >
    <!-- ラベル(点滅ブロック風) -->
    <div
      v-if="settings.label"
      class="fb-cursor-blink shrink-0 px-3 py-1 text-lg font-black tracking-widest uppercase"
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
          class="arcade-text inline-block text-5xl font-black whitespace-nowrap"
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

  // 上は明るく、下は暗い縁(立体感)
  const arcadeFrame = {
    backgroundColor: 'var(--fb-bg)',
    borderTop: '3px solid rgba(255, 255, 255, 0.4)',
    borderBottom: '3px solid rgba(0, 0, 0, 0.5)',
  }

  // アーケードは右から勢いよく入ってくる
  const { displayMessage, wrapperRef } = useMessageTransition(() => props.message, 'slideInRight')
  const { textRef, containerRef, scrollDuration, scrollClass } = useFlashScroll({
    getMessage: () => displayMessage.value,
    getSettings: () => props.settings,
  })
</script>

<style scoped>
  /* 縁取り文字(背景色で縁を取り、文字色で光らせる) */
  .arcade-text {
    text-shadow:
      -1px -1px 0 var(--fb-bg),
      1px -1px 0 var(--fb-bg),
      -1px 1px 0 var(--fb-bg),
      1px 1px 0 var(--fb-bg),
      0 0 12px currentColor;
  }
</style>
