<!-- src/ui/CommentBubble/components/standard/Peek.vue -->
<!-- ピーク: 吹き出しの枠の後ろからキャラが顔を出す(キャラは枠の上、足元は枠に隠れる) -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-8">
    <div class="relative flex flex-col items-center">
      <ShownImage :shown="shown" :size="settings.characterSize" class="relative z-0 -mb-12" />

      <div class="relative z-10 w-105">
        <CommentDisplay
          :displayed-comments="displayedComments"
          :remove-comment="removeComment"
          :motion="settings.bubbleMotion"
          auto-height
          arrow="none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CommentBubbleComponentProps } from '../../CommentBubbleRegistry'
  import CommentDisplay from './CommentDisplay.vue'
  import ShownImage from './ShownImage.vue'

  defineProps<CommentBubbleComponentProps>()
</script>
