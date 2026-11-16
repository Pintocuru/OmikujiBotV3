<!-- src/ui/bot/FlashBanner/components/standard/Ticker.vue -->
<template>
  <div
    class="flex items-center overflow-hidden px-2"
    :class="settings.showItemOnRight ? 'flex-row-reverse' : 'flex-row'"
    :style="rootStyle"
  >
    <!-- ラベル(強調カラー帯) -->
    <div
      v-if="settings.label"
      class="shrink-0 rounded-full px-4 py-1 text-xl font-bold"
      :class="labelClass"
      :style="{ backgroundColor: 'var(--fb-accent)', color: 'var(--fb-bg)' }"
    >
      {{ settings.label }}
    </div>

    <!-- アイコン -->
    <div v-if="shouldShowIcon" class="flex shrink-0 items-center px-2">
      <LayerImage :layers="characterLayers" :size="settings.iconSize * 4" :animation="characterAnimation" />
    </div>

    <!-- メッセージ(常時スクロール。背景あり・両端フェード) -->
    <div
      ref="wrapperRef"
      class="fb-fade-mask flex min-w-0 flex-1 items-center overflow-hidden rounded-lg p-2"
      :style="{ backgroundColor: 'var(--fb-bg)' }"
    >
      <div class="fb-ticker-loop flex items-center" :style="tickerStyle">
        <span
          v-for="i in repeat"
          :key="i"
          class="inline-block text-5xl font-bold whitespace-nowrap"
          :style="[{ color: 'var(--fb-text)', textShadow: glow }, segmentStyle(i)]"
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
  import { useMessageTransition } from '../../composables/useMessageTransition'
  import { useTickerLoop } from '../../composables/useTickerLoop'
  import '../../flashBanner.css'

  const props = defineProps<FlashBannerComponentProps>()

  const rootStyle = useBannerColorVars(() => props.color)
  const shouldShowIcon = computed(() => props.settings.iconSize > 0 && props.characterLayers.length > 0)
  const glow = '0 0 8px currentColor, 0 0 2px currentColor'

  const { displayMessage, wrapperRef } = useMessageTransition(() => props.message)
  const { repeat, tickerStyle, segmentStyle } = useTickerLoop(
    () => displayMessage.value,
    () => props.settings.scrollSpeed
  )
</script>
