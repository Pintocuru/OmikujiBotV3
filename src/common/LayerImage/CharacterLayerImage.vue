<!-- src/common/LayerImage/CharacterLayerImage.vue -->
<template>
  <div
    class="rounded-full overflow-hidden"
    :style="{ backgroundColor: props.color.background }"
  >
    <LayerImage :layers="layers" :size="size" :animation="animation" />
  </div>
</template>

<script setup lang="ts">
  import { CharacterAnimationType, CharacterColorType } from '@/types'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  const props = defineProps<{
    layers: string[] | string
    size?: number
    color: CharacterColorType
    animation?: CharacterAnimationType
  }>()

</script>
