<!-- src/ui/CommentBubble/components/standard/CommentDisplay.vue -->
<template>
  <div class="relative" :style="autoHeight ? { height: `${listHeight}px` } : undefined">
    <div
      v-for="(item, index) in displayedComments"
      :key="item.id"
      class="absolute left-0 right-0"
      :style="{ top: `${index * rowHeight}px`, zIndex: 20 - index }"
    >
      <MotionWrapper
        v-model:visible="item.display.visible"
        :motion="motion"
        :leave-motion="motion"
        :auto-hide="false"
        @after-leave="() => removeComment(item.id)"
      >
        <div class="flex" :class="ALIGN_CLASS[align]">
          <CommentBubbleItem
            :botName="item.bubble.name ?? ''"
            :message="item.bubble.message"
            :color="previewColor ?? getCharacterColor(item.bubble.characterKey) ?? undefined"
            :animated-text="animatedText"
            :compact="compact"
            :arrow-direction="arrow"
            :brightnessLevel="index"
            :style="{ zIndex: index }"
          />
        </div>
      </MotionWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject } from 'vue'
  import { EnterMotionType } from '@/types/OmikujiData'
  import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { useCharacters } from '@/generator/composables/useCharacters'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import { previewColorKey } from '../../parts/previewColor'
  import CommentBubbleItem from './CommentBubbleItem.vue'

  // 最後の 1 件の吹き出し自体の高さ(autoHeight のとき、件数分の高さに足す)
  const LAST_ITEM_HEIGHT = 60

  const props = withDefaults(
    defineProps<{
      displayedComments: DisplayedBotMessage[]
      removeComment: (id: string) => void
      motion?: EnterMotionType // 登場・退場のアニメーション
      animatedText?: boolean
      compact?: boolean // 小さめ表示
      rowHeight?: number // 1件ごとの縦ずらし量(px)
      align?: 'start' | 'center' | 'end' // 吹き出しの横位置
      arrow?: 'down' | 'left' | 'right' | 'none' // 矢印の向き
      autoHeight?: boolean // 件数に合わせて高さを確保する(各行は absolute 配置のため、親に高さが必要なとき)
    }>(),
    {
      removeComment: () => undefined,
      motion: 'slideUp',
      animatedText: false,
      compact: false,
      rowHeight: 40,
      align: 'center',
      arrow: 'down',
      autoHeight: false,
    }
  )

  const ALIGN_CLASS = { start: 'justify-start', center: 'justify-center', end: 'justify-end' } as const

  const listHeight = computed(() => Math.max(props.displayedComments.length, 1) * props.rowHeight + LAST_ITEM_HEIGHT)

  const { getCharacterColor } = useCharacters()
  const previewColor = inject(previewColorKey, null)
</script>
