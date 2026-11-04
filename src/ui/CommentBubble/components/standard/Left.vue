<!-- src/ui/CommentBubble/components/standard/Left.vue -->
<!-- レフト: キャラを左、吹き出しを右に並べる(画面左下) -->
<template>
  <div class="absolute bottom-0 left-0 flex items-end gap-6 p-8">
    <LayerImage
      v-if="shown && shown.layers.length > 0"
      :key="shown.key"
      :layers="shown.layers"
      :size="settings.characterSize"
      :animation="shown.animation"
    />

    <!-- CommentDisplay は absolute 配置のため、件数分の高さを確保する -->
    <div class="relative w-[420px] mb-4" :style="{ height: `${listHeight}px` }">
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="removeComment"
        :enter-motion="settings.bubbleMotion"
        :leave-motion="settings.bubbleMotion"
        align="start"
        arrow="left"
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

  const listHeight = computed(() => Math.max(props.displayedComments.length, 1) * 40 + 60)
</script>
