<!-- src/ui/CommentBubble/CommentBubbleSelector.vue -->
<template>
  <div class="relative pointer-events-none z-10 h-screen" :class="useFontFamily(fontFamily)">
    <component
      :is="currentComponent"
      v-if="currentComponent"
      :displayedComments="displayedComments"
      :removeComment="removeComment"
      :shown="shown"
      :settings="settings"
    />
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import type { CommentBubbleType, ShownCharacter } from '@/types/ui'
  import type { DisplayedBotMessage } from '@/ui/common/useBotDisplay'
  import { FontFamilyType } from '@/types/OmikujiData'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import { getCommentBubbleComponent } from './CommentBubbleRegistry'
  import { notifyCommentBubbleComponentIssue } from './notifyCommentBubbleComponentIssue'

  const props = defineProps<{
    displayedComments: DisplayedBotMessage[]
    removeComment: (id: string) => void
    shown: ShownCharacter | null
    settings: CommentBubbleType
    fontFamily?: FontFamilyType
  }>()

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null

      const definition = getCommentBubbleComponent(id)
      if (!definition) {
        notifyCommentBubbleComponentIssue(id, `フキダシの表示タイプ「${id}」は、このバージョンには含まれていません`)
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[CommentBubble] Component load failed: ${id}`, error)
        notifyCommentBubbleComponentIssue(id, `フキダシの表示タイプ「${id}」の読み込みに失敗しました`)
      }
    },
    { immediate: true }
  )
</script>
