<!-- src/ui/CommentBubble/CommentBubbleSelector.vue -->
<template>
  <div class="relative pointer-events-none z-10 h-screen" :class="useFontFamily(fontFamily)">
    <component
      :is="currentComponent"
      :displayedComments="displayedComments"
      :removeComment="removeComment"
      :shown="shown"
      :settings="settings"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BubbleComponent, CommentBubbleType, ShownCharacter } from '@/types/ui'
  import { BotMessageBubbleType } from '@/generator/types'
  import { FontFamilyType, useFontFamily } from '@/types/OmikujiData'
  import standard from './layouts/Standard.vue'
  import smart from './layouts/Smart.vue'

  const props = defineProps<{
    displayedComments: BotMessageBubbleType[]
    removeComment: (id: string) => void
    shown: ShownCharacter | null
    settings: CommentBubbleType
    fontFamily?: FontFamilyType
  }>()

  const componentMap: Record<BubbleComponent, any> = {
    standard,
    smart,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] || standard)
</script>
