<!-- src/ui/CharacterStage/CharacterStageLayer.vue -->
<template>
  <!-- 位置決め用の枠(アニメーションの transform と分けるため、MotionWrapper の外に置く) -->
  <div
    v-for="item in items"
    :key="item.id"
    class="absolute"
    :style="{ left: `${item.x}%`, top: `${item.y}%`, transform: anchorTransform(item.anchor), zIndex: item.z }"
  >
    <MotionWrapper
      v-model:visible="item.display.visible"
      :motion="item.motion"
      :leave-motion="item.motion"
      :duration="item.motionDuration"
      :auto-hide="false"
      @after-leave="() => emit('remove', item.id)"
    >
      <LayerImage :layers="item.layers" :size="item.size" :animation="item.animation" :muted="muted" />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import type { StageAnchorType } from '@/types/ui'
  import type { StageItem } from './types'

  // 基準点(anchor)を left/top の位置に合わせるための移動量(%)
  const ANCHOR_SHIFT: Record<StageAnchorType, [number, number]> = {
    topLeft: [0, 0],
    top: [-50, 0],
    topRight: [-100, 0],
    left: [0, -50],
    center: [-50, -50],
    right: [-100, -50],
    bottomLeft: [0, -100],
    bottom: [-50, -100],
    bottomRight: [-100, -100],
  }
  const anchorTransform = (anchor: StageAnchorType) => {
    const [x, y] = ANCHOR_SHIFT[anchor]
    return `translate(${x}%, ${y}%)`
  }

  // 親(position: relative の枠)を基準に並べる。本番は画面全体、エディターはプレビュー枠
  withDefaults(
    defineProps<{
      items: StageItem[]
      muted?: boolean
    }>(),
    {
      muted: true,
    }
  )
  const emit = defineEmits<{ remove: [id: string] }>()
</script>
