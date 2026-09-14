<!-- src/editor/assets/characters/CharacterImage/EmotionCard.vue -->
<template>
  <div class="text-center p-2">
    <div class="w-24 mx-auto relative">
      <!-- ドラッグハンドル -->
      <div
        v-if="showDragHandle"
        class="drag-handle absolute -top-1 -left-1 z-10 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing transition-opacity"
      >
        <GripVertical class="w-4 h-4 text-base-content" />
      </div>

      <!-- レイヤー画像 -->
      <LayerImage
        :key="`${item.key}-${item.value.animation?.type ?? 'none'}-${item.value.animation?.duration ?? 0}-${item.value.animation?.loop ?? true}`"
        :layers="item.value.src"
        :animation="item.value.animation"
      />
    </div>
    <p class="text-sm text-base-content mt-2 truncate">{{ item.value.label || item.key }}</p>
  </div>
</template>

<script setup lang="ts">
  import { CharacterImageType } from '@/types/'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { GripVertical } from 'lucide-vue-next'

  defineProps<{
    item: { key: string; value: CharacterImageType[string] }
    showDragHandle?: boolean
  }>()
</script>
