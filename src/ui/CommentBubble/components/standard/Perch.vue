<!-- src/ui/CommentBubble/components/standard/Perch.vue -->
<!-- パーチ: 吹き出しの枠の左上に、小さなキャラが腰かける -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-8">
    <div class="relative w-105" :style="{ height: `${listHeight}px` }">
      <!-- 枠の上辺に乗るキャラ(下端を少し枠に重ねる) -->
      <div v-if="shown && shown.layers.length > 0" class="absolute left-2 bottom-full z-0 translate-y-6">
        <LayerImage :key="shown.key" :layers="shown.layers" :size="size" :animation="shown.animation" />
      </div>

      <div class="relative z-10">
        <CommentDisplay
          :displayed-comments="displayedComments"
          :remove-comment="removeComment"
          :enter-motion="settings.bubbleMotion"
          :leave-motion="settings.bubbleMotion"
          arrow="none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { CommentBubbleType, ShownCharacter } from '@/types/ui'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import CommentDisplay from '../../parts/CommentDisplay.vue'

  const props = defineProps<{
    displayedComments: DisplayedBotMessage[]
    removeComment: (id: string) => void
    shown: ShownCharacter | null
    settings: CommentBubbleType
  }>()

  const size = computed(() => Math.round(props.settings.characterSize * 0.6))
  const listHeight = computed(() => Math.max(props.displayedComments.length, 1) * 40 + 60)
</script>
