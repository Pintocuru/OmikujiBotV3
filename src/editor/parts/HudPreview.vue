<!-- src/editor/parts/HudPreview.vue -->
<template>
  <div class="sticky top-0 z-20 overflow-hidden" :class="isHeight ? maxHeightClass : 'h-auto'">
    <div class="w-full h-full" :style="{ backgroundColor: `hsl(${hue} 60% ${lightness}%)` }">
      <!-- スケーリング対象のメインスロット -->
      <div class="origin-top-left" :style="contentStyle">
        <slot />
      </div>

      <!-- 右下HUD -->
      <div class="absolute bottom-2 right-2 z-10 space-y-1">
        <slot name="hud" />
      </div>

      <!-- 左下HUD + スケール操作 -->
      <div class="absolute bottom-2 left-2 z-10 space-y-2">
        <slot name="hudLeft" />
        <div class="flex gap-2">
          <div class="text-xs text-white bg-black/50 px-1 rounded">{{ Math.round(scale * 100) }}%</div>
          <input v-model="scale" type="range" min="0.2" max="1" step="0.1" class="range range-xs w-12" />
        </div>
      </div>

      <!-- 色調整ツール -->
      <div
        class="absolute top-2 right-2 flex gap-1 transition-opacity duration-300"
        :class="showTools ? 'opacity-100' : 'opacity-0'"
        @mouseenter="showTemporarily"
        @mousemove="showTemporarily"
        @mouseleave="showTemporarily"
      >
        <component
          :is="icon"
          v-for="{ icon, action } in tools"
          :key="icon.name"
          :size="24"
          class="cursor-pointer hover:text-gray-300 transition-colors"
          @click="action"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Sun, Moon, Palette } from '@lucide/vue'

  const props = withDefaults(
    defineProps<{
      isHeight?: boolean
      maxHeightClass?: string
      defaultScale?: number
    }>(),
    {
      isHeight: true,
      maxHeightClass: 'h-64',
      defaultScale: 1,
    }
  )

  const hue = ref(200)
  const lightness = ref(50)
  const scale = ref(props.defaultScale)
  const showTools = ref(false)
  let hideTimer: number | undefined

  const showTemporarily = () => {
    showTools.value = true
    clearTimeout(hideTimer)
    hideTimer = window.setTimeout(() => (showTools.value = false), 2000)
  }

  const tools = [
    { icon: Sun, action: () => (lightness.value = Math.min(lightness.value + 10, 100)) },
    { icon: Moon, action: () => (lightness.value = Math.max(lightness.value - 10, 0)) },
    { icon: Palette, action: () => (hue.value = (hue.value + 40) % 360) },
  ]

  const contentStyle = computed(() => {
    const size = `${100 / Math.min(scale.value, 1)}%`
    return { transform: `scale(${scale.value})`, width: size, height: size }
  })
</script>
