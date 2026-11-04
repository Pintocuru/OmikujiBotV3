<!-- src/ui/CommentBubble/components/standard/Peek.vue -->
<!-- ピーク: 吹き出しの枠の後ろからキャラが顔を出す(キャラは枠の上、足元は枠に隠れる) -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-8">
    <div class="relative flex flex-col items-center">
      <div v-if="shown && shown.layers.length > 0" class="relative z-0 -mb-12">
        <LayerImage
          :key="shown.key"
          :layers="shown.layers"
          :size="settings.characterSize"
          :animation="shown.animation"
        />
      </div>

      <div class="relative z-10 w-[420px]" :style="{ height: `${listHeight}px` }">
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

  const listHeight = computed(() => Math.max(props.displayedComments.length, 1) * 40 + 60)
</script>
