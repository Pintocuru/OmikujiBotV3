<!-- src/ui/CommentBubble/layouts/parts/CommentDisplay.vue -->
<template>
  <div
    v-for="(item, index) in displayedComments"
    :key="item.id"
    class="absolute left-0 right-0"
    :style="{ top: `${index * 40}px`, zIndex: 20 - index }"
  >
    <MotionWrapper
      v-model:visible="item.display.visible"
      :motion="enterMotion"
      :leave-motion="leaveMotion"
      :auto-hide="false"
      @after-leave="() => removeComment(item.id)"
    >
      <div class="flex justify-center">
        <CommentBubbleItem
          :botName="item.bubble.name ?? ''"
          :message="item.bubble.message"
          :color="getCharacterColor(item.bubble.characterKey) ?? undefined"
          :animated-text="animatedText"
          :brightnessLevel="index"
          :style="{ zIndex: index }"
        />
      </div>
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { EnterMotionType } from '@/types/OmikujiData'
  import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { useCharacterManager } from '@/generator/composables/useCharacterManager'
  import CommentBubbleItem from '@/ui/common/CommentBubbleItem.vue'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'

  withDefaults(
    defineProps<{
      displayedComments: DisplayedBotMessage[]
      removeComment: (id: string) => void
      enterMotion?: EnterMotionType
      leaveMotion?: EnterMotionType
      animatedText?: boolean
    }>(),
    {
      removeComment: () => undefined,
      enterMotion: 'slideUp',
      leaveMotion: 'slideUp',
      animatedText: false,
    }
  )

  const { getCharacterColor } = useCharacterManager()
</script>
