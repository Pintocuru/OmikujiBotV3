<!-- src/ui/CommentBubble/components/standard/ShownImage.vue -->
<!-- 表示中のキャラクター画像。画像がなければ何も描画しない(class は外側の div に渡る) -->
<template>
  <!-- キーが変わったら再マウントしてアニメを頭出し -->
  <div v-if="shown && shown.layers.length > 0" :key="shown.key">
    <LayerImage :layers="shown.layers" :size="size" :animation="shown.animation" />
  </div>
</template>

<script setup lang="ts">
  import type { ShownCharacter } from '@/types/ui'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  defineProps<{
    shown: ShownCharacter | null
    size: number
  }>()
</script>
