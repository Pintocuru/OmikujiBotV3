<!-- src/ui/CommentBubble/CommentBubbleSelector.vue -->
<template>
  <div
    class="relative pointer-events-none z-10"
    :class="[editorPreview ? 'h-full' : 'h-screen', useFontFamily(fontFamily)]"
  >
    <component
      :is="currentComponent"
      v-if="currentComponent"
      :displayedComments="displayedComments"
      :removeComment="removeComment"
      :shown="shown"
      :settings="settings"
    />
    <div v-else-if="editorPreview && loadError" class="alert alert-error m-2 text-sm" role="alert">
      {{ loadError }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import { FontFamilyType } from '@/types/OmikujiData'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import { getCommentBubbleComponent, type CommentBubbleComponentProps } from './CommentBubbleRegistry'
  import { notifyCommentBubbleComponentIssue } from './notifyCommentBubbleComponentIssue'

  const props = withDefaults(
    defineProps<
      CommentBubbleComponentProps & {
        fontFamily?: FontFamilyType
        editorPreview?: boolean // エディターのプレビュー用(エラーを画面に出す。わんコメへは通知しない)
      }
    >(),
    { fontFamily: undefined, editorPreview: false }
  )

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef('')

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = ''

      const definition = getCommentBubbleComponent(id)
      if (!definition) {
        loadError.value = `未登録の表示タイプ: ${id}`
        if (!props.editorPreview) {
          notifyCommentBubbleComponentIssue(id, `フキダシの表示タイプ「${id}」は、このバージョンには含まれていません`)
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[CommentBubble] Component load failed: ${id}`, error)
        loadError.value = `表示タイプ「${id}」の読み込みに失敗しました`
        if (!props.editorPreview) {
          notifyCommentBubbleComponentIssue(id, `フキダシの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
