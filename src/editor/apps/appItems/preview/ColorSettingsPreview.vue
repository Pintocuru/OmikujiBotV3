<!-- src/editor/apps/appItems/preview/ColorSettingsPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-45 max-w-60">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <Palette class="w-3 h-3" />
      <span>フキダシカラー</span>
    </div>

    <div class="flex items-center gap-1.5 text-xs">
      <Brush class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">モード:</span>
      <span class="badge badge-xs badge-primary"> カスタム </span>
    </div>

    <div class="flex items-center gap-1.5 text-xs">
      <span class="opacity-70 ml-4">背景:</span>
      <span class="w-4 h-4 rounded border border-base-300 shrink-0" :style="{ backgroundColor: color.background }" />
      <span class="font-mono opacity-70">{{ color.background }}</span>
    </div>
    <div class="flex items-center gap-1.5 text-xs">
      <span class="opacity-70 ml-4">テキスト:</span>
      <span class="w-4 h-4 rounded border border-base-300 shrink-0" :style="{ backgroundColor: color.text }" />
      <span class="font-mono opacity-70">{{ color.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterColorScheme, CharacterType } from '@/types/OmikujiData'
  import { Palette, Brush } from 'lucide-vue-next'

  const props = defineProps<{
    data: CharacterType | null
  }>()

  const color = computed(() => props.data?.color ?? CharacterColorScheme.parse({}))
</script>
