<!-- src/ui/CommentBubble/layouts/Smart.vue -->
<!-- スマート(シンプル): キャラクター画像なし。吹き出しだけを下部中央に表示する -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end pb-12">
    <div class="relative min-w-[320px]" :style="{ height: `${listHeight}px` }">
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="removeComment"
        :enter-motion="settings.bubbleMotion"
        :leave-motion="settings.bubbleMotion"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageBubbleType } from '@/generator/types'
  import { CommentBubbleType } from '@/ui/types'
  import CommentDisplay from './parts/CommentDisplay.vue'

  const props = defineProps<{
    displayedComments: BotMessageBubbleType[]
    removeComment: (id: string) => void
    // Standard と props を揃えるため受け取る（未使用）
    shown?: unknown
    settings: CommentBubbleType
  }>()

  // CommentDisplay は 40px 間隔の absolute 配置のため、高さ確保用に件数分を確保
  const listHeight = computed(() => Math.max(props.displayedComments.length, 1) * 40 + 80)
</script>
