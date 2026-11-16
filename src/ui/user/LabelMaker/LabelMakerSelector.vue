<!-- src/ui/user/LabelMaker/LabelMakerSelector.vue -->
<template>
  <div class="relative" :class="useFontFamily(fontFamily)">
    <component :is="currentComponent" v-if="currentComponent" :users="displayedUsers" :settings="settings" />
    <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
      {{ $t(loadError.key, { id: loadError.id }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, shallowRef, watch, type Component } from 'vue'
  import { FontFamilyType } from '@/types/OmikujiData'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import type { LabelMakerType } from '@/types/ui'
  import { getLabelMakerComponent } from './LabelMakerRegistry'
  import { notifyLabelMakerComponentIssue } from './notifyLabelMakerComponentIssue'
  import { buildLabelUsers, type LabelEntry } from './scripts/labelUsers'

  const props = withDefaults(
    defineProps<{
      users: LabelEntry[] // 届いた順の投稿
      settings: LabelMakerType
      fontFamily?: FontFamilyType
      editorPreview?: boolean
    }>(),
    { editorPreview: false }
  )

  // 表示するユーザー(新しい順・重複排除・件数制限は、どのコンポーネントでも同じ)
  const displayedUsers = computed(() => buildLabelUsers(props.users, props.settings.target, props.settings.limit))

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef<{ key: string; id: string } | null>(null)

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = null

      const definition = getLabelMakerComponent(id)
      if (!definition) {
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) {
          notifyLabelMakerComponentIssue(
            id,
            `ラベルメーカーの表示タイプ「${id}」は、このバージョンには含まれていません`
          )
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[LabelMaker] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyLabelMakerComponentIssue(id, `ラベルメーカーの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
