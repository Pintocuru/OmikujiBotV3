<!-- src/ui/UserBoard/UserBoardSelector.vue -->
<template>
  <div class="relative" :class="useFontFamily(fontFamily)">
    <component :is="currentComponent" v-if="currentComponent" :users="users" :settings="settings" />
    <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
      {{ $t(loadError.key, { id: loadError.id }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import { FontFamilyType } from '@/types/OmikujiData'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import type { UserBoardType } from '@/types/ui'
  import { getUserBoardComponent } from './UserBoardRegistry'
  import { notifyUserBoardComponentIssue } from './notifyUserBoardComponentIssue'

  const props = withDefaults(
    defineProps<{
      users: UserStatsRecord[]
      settings: UserBoardType
      fontFamily?: FontFamilyType
      editorPreview?: boolean
    }>(),
    { editorPreview: false }
  )

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef<{ key: string; id: string } | null>(null)

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = null

      const definition = getUserBoardComponent(id)
      if (!definition) {
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) {
          notifyUserBoardComponentIssue(id, `ユーザーボードの表示タイプ「${id}」は、このバージョンには含まれていません`)
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[UserBoard] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyUserBoardComponentIssue(id, `ユーザーボードの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
