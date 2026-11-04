<!-- src/ui/CommentBubble/parts/CommentDisplay.vue -->
<template>
  <div
    v-for="(item, index) in displayedComments"
    :key="item.id"
    class="absolute left-0 right-0"
    :style="{ top: `${index * rowHeight}px`, zIndex: 20 - index }"
  >
    <MotionWrapper
      v-model:visible="item.display.visible"
      :motion="enterMotion"
      :leave-motion="leaveMotion"
      :auto-hide="false"
      @after-leave="() => removeComment(item.id)"
    >
      <div class="flex" :class="ALIGN_CLASS[align]">
        <CommentBubbleItem
          :botName="item.bubble.name ?? ''"
          :message="item.bubble.message"
          :color="previewColor?.value ?? getCharacterColor(item.bubble.characterKey) ?? undefined"
          :animated-text="animatedText"
          :compact="compact"
          :arrow-direction="arrow"
          :brightnessLevel="index"
          :style="{ zIndex: index }"
        />
      </div>
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { inject } from 'vue'
  import { EnterMotionType } from '@/types/OmikujiData'
  import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { useCharacters } from '@/generator/composables/useCharacters'
  import CommentBubbleItem from '@/ui/common/CommentBubbleItem.vue'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import { previewColorKey } from './previewColor'

  withDefaults(
    defineProps<{
      displayedComments: DisplayedBotMessage[]
      removeComment: (id: string) => void
      enterMotion?: EnterMotionType
      leaveMotion?: EnterMotionType
      animatedText?: boolean
      compact?: boolean // 小さめ表示
      rowHeight?: number // 1件ごとの縦ずらし量(px)
      align?: 'start' | 'center' | 'end' // 吹き出しの横位置
      arrow?: 'down' | 'left' | 'right' | 'none' // 矢印の向き
    }>(),
    {
      removeComment: () => undefined,
      enterMotion: 'slideUp',
      leaveMotion: 'slideUp',
      animatedText: false,
      compact: false,
      rowHeight: 40,
      align: 'center',
      arrow: 'down',
    }
  )

  const ALIGN_CLASS = { start: 'justify-start', center: 'justify-center', end: 'justify-end' } as const

  const { getCharacterColor } = useCharacters()
  const previewColor = inject(previewColorKey, null)
</script>
