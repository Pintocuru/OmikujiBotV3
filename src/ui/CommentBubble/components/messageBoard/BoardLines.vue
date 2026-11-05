<!-- src/ui/CommentBubble/components/messageBoard/BoardLines.vue -->
<!-- ボード面に並べるコメント(新しいものが下)。1 件の見た目は、各ボードがスロットで決める -->
<template>
  <div class="flex h-full flex-col justify-end gap-3 overflow-hidden" :style="FADE_TOP">
    <MotionWrapper
      v-for="item in lines"
      :key="item.id"
      v-model:visible="item.display.visible"
      class="shrink-0"
      :motion="motion"
      :leave-motion="motion"
      :auto-hide="false"
      @after-leave="() => removeComment(item.id)"
    >
      <slot
        :speaker="item.bubble.name ?? ''"
        :message="item.bubble.message"
        :color="colorOf(item)"
        :index="indexOf(item)"
      />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject } from 'vue'
  import { CharacterColorScheme, CharacterColorType, EnterMotionType } from '@/types/OmikujiData'
  import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { useCharacters } from '@/generator/composables/useCharacters'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import { previewColorKey } from '../../parts/previewColor'

  const props = withDefaults(
    defineProps<{
      displayedComments: DisplayedBotMessage[]
      removeComment: (id: string) => void
      motion: EnterMotionType
      maxLines?: number // ボード面に出す最大件数(新しい順に数える)
    }>(),
    { maxLines: 5 }
  )

  // 古い行が上端で切れるとき、ぶつ切りに見えないよう上端をぼかす
  const FADE_MASK = 'linear-gradient(to bottom, transparent 0, #000 28px)'
  const FADE_TOP = { maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK } // 古い CEF(OBS)向けに接頭辞付きも指定
  const DEFAULT_COLOR = CharacterColorScheme.parse({})

  // displayedComments は新しい順。ボード面は新しいものが下
  const lines = computed(() => props.displayedComments.slice(0, props.maxLines).reverse())
  const indexOf = (item: DisplayedBotMessage) => props.displayedComments.indexOf(item)

  const { getCharacterColor } = useCharacters()
  const previewColor = inject(previewColorKey, null)
  const colorOf = (item: DisplayedBotMessage): CharacterColorType =>
    previewColor?.value ?? getCharacterColor(item.bubble.characterKey) ?? DEFAULT_COLOR
</script>
