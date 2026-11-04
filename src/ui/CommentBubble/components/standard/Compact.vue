<!-- src/ui/CommentBubble/components/standard/Compact.vue -->
<!-- コンパクト: Standard を小さくしたもの(キャラ 75%・小さい吹き出し) -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <div class="relative flex flex-col items-center">
      <div class="absolute bottom-full -translate-y-24 left-1/2 -translate-x-1/2 min-w-[240px]">
        <CommentDisplay
          :displayed-comments="displayedComments"
          :remove-comment="removeComment"
          :enter-motion="settings.bubbleMotion"
          :leave-motion="settings.bubbleMotion"
          compact
          :row-height="32"
        />
      </div>

      <LayerImage
        v-if="shown && shown.layers.length > 0"
        :key="shown.key"
        :layers="shown.layers"
        :size="size"
        :animation="shown.animation"
      />
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

  const size = computed(() => Math.round(props.settings.characterSize * 0.75))
</script>
