<!-- src/ui/CharacterStage/CharacterStage.vue -->
<template>
  <div class="relative pointer-events-none z-10 h-screen w-screen overflow-hidden">
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
        :auto-hide="false"
        @after-leave="() => remove(item.id)"
      >
        <LayerImage :layers="item.layers" :size="item.size" :animation="item.animation" />
      </MotionWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterStageSchema } from '@/types/ui'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import { useCharacterStage } from './useCharacterStage'

  const appStore = useAppStore()

  // 設定（未設定ならスキーマの既定値）
  const settings = computed(() => CharacterStageSchema.parse(appStore.data.ui.settings.characterStage ?? {}))

  const { items, remove } = useCharacterStage(settings)
</script>
