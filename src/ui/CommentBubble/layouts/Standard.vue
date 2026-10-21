<!-- src/ui/CommentBubble/layouts/Standard.vue -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <div class="relative flex flex-col items-center">
      <!-- コメント吹き出し（キャラクターの上） -->
      <div class="absolute bottom-full -translate-y-36 left-1/2 -translate-x-1/2 min-w-[320px]">
        <CommentDisplay
          :displayed-comments="displayedComments"
          :remove-comment="removeComment"
          :enter-motion="settings.bubbleMotion"
          :leave-motion="settings.bubbleMotion"
        />
      </div>

      <!-- キャラクター（キーが変わったら再マウントしてアニメを頭出し） -->
      <LayerImage
        v-if="shown && shown.layers.length > 0"
        :key="shown.key"
        :layers="shown.layers"
        :size="settings.characterSize"
        :animation="shown.animation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BotMessageBubbleType } from '@/generator/types'
  import { CommentBubbleType } from '@/types/ui'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import CommentDisplay from './parts/CommentDisplay.vue'
  import type { ShownCharacter } from './types'

  defineProps<{
    displayedComments: BotMessageBubbleType[]
    removeComment: (id: string) => void
    shown: ShownCharacter | null
    settings: CommentBubbleType
  }>()
</script>
