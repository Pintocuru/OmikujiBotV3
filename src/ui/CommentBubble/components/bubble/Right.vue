<!-- src/ui/CommentBubble/components/bubble/Right.vue -->
<!-- ライト: キャラを右、吹き出しを左に並べる(画面右下) -->
<template>
  <div class="absolute bottom-0 right-0 flex flex-row-reverse items-end gap-6 p-8">
    <ShownImage :shown="shown" :size="settings.characterSize" />

    <div class="w-105 mb-4">
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="removeComment"
        :motion="settings.bubbleMotion"
        auto-height
        align="end"
        arrow="right"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CommentBubbleComponentProps } from '../../CommentBubbleRegistry'
  import CommentDisplay from './CommentDisplay.vue'
  import ShownImage from '../../parts/ShownImage.vue'

  defineProps<CommentBubbleComponentProps>()
</script>
