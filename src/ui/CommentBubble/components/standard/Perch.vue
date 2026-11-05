<!-- src/ui/CommentBubble/components/standard/Perch.vue -->
<!-- パーチ: 吹き出しの枠の左上に、小さなキャラが腰かける(枠の幅が固定でないと「枠の上」にならないため、他と別構造) -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-8">
    <div class="relative w-105">
      <!-- 枠の上辺に乗るキャラ(下端を少し枠に重ねる) -->
      <ShownImage :shown="shown" :size="size" class="absolute left-2 bottom-full z-0 translate-y-6" />

      <div class="relative z-10">
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
  import { computed } from 'vue'
  import type { CommentBubbleComponentProps } from '../../CommentBubbleRegistry'
  import CommentDisplay from './CommentDisplay.vue'
  import ShownImage from './ShownImage.vue'

  const props = defineProps<CommentBubbleComponentProps>()

  // 腰かけるので小さめにする
  const size = computed(() => Math.round(props.settings.characterSize * 0.6))
</script>
