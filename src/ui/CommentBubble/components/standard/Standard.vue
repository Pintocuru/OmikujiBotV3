<!-- src/ui/CommentBubble/components/standard/Standard.vue -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <div class="relative flex flex-col items-center">
      <!-- コメント吹き出し（キャラクターの上） -->
      <div class="absolute bottom-full -translate-y-36 left-1/2 -translate-x-1/2 min-w-[320px]">
        <CommentDisplay
          :displayed-comments="displayedComments"
          :remove-comment="removeComment"
          :motion="settings.bubbleMotion"
        />
      </div>

      <ShownImage :shown="shown" :size="settings.characterSize" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CommentBubbleComponentProps } from '../../CommentBubbleRegistry'
  import CommentDisplay from './CommentDisplay.vue'
  import ShownImage from './ShownImage.vue'

  defineProps<CommentBubbleComponentProps>()
</script>
