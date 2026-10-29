<!-- src/ui/CharacterStage/CharacterStageLayer.vue -->
<template>
  <!-- 位置決め用の枠(アニメーションの transform と分けるため、MotionWrapper の外に置く) -->
  <div
    v-for="item in items"
    :key="item.id"
    class="absolute"
    :style="{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -100%)', zIndex: item.z }"
  >
    <MotionWrapper
      v-model:visible="item.display.visible"
      :motion="item.motion"
      :leave-motion="item.motion"
      :duration="item.motionDuration"
      :auto-hide="false"
      @after-leave="() => emit('remove', item.id)"
    >
      <LayerImage :layers="item.layers" :size="item.size" :animation="item.animation" />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import type { StageItem } from './types'

  // 親(position: relative の枠)を基準に並べる。本番は画面全体、エディターはプレビュー枠
  defineProps<{ items: StageItem[] }>()
  const emit = defineEmits<{ remove: [id: string] }>()
</script>
