<!-- src/ui/CommentBubble/components/standard/Left.vue -->
<!-- レフト: キャラを左、吹き出しを右に並べる(画面左下) -->
<template>
  <div class="absolute bottom-0 left-0 flex items-end gap-6 p-8">
    <ShownImage :shown="shown" :size="settings.characterSize" />

    <div class="w-105 mb-4">
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="removeComment"
        :motion="settings.bubbleMotion"
        auto-height
        align="start"
        arrow="left"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CommentBubbleComponentProps } from '../../CommentBubbleRegistry'
  import CommentDisplay from './CommentDisplay.vue'
  import ShownImage from './ShownImage.vue'

  defineProps<CommentBubbleComponentProps>()
</script>
