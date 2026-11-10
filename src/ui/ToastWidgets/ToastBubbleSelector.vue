<!-- src/ui/ToastWidgets/ToastBubbleSelector.vue -->
<template>
  <component
    :is="currentComponent"
    v-if="currentComponent"
    :message="message"
    :color="color"
    :iconLayers="iconLayers"
    :showToastsOnRight="settings.showToastsOnRight"
    :getProfileImage="getProfileImage"
  />
  <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
    {{ $t(loadError.key, { id: loadError.id }) }}
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import type { ToastWidgetsType } from '@/types/ui'
  import type { CharacterColorType } from '@/types/OmikujiData/'
  import { getToastWidgetsComponent } from './ToastWidgetsRegistry'
  import { notifyToastWidgetsComponentIssue } from './notifyToastWidgetsComponentIssue'

  const props = withDefaults(
    defineProps<{
      settings: ToastWidgetsType
      message: string
      color: CharacterColorType
      iconLayers?: string[]
      getProfileImage?: (userId: string) => string | undefined
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

      const definition = getToastWidgetsComponent(id)
      if (!definition) {
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) {
          notifyToastWidgetsComponentIssue(id, `トーストの表示タイプ「${id}」は、このバージョンには含まれていません`)
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[ToastWidgets] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyToastWidgetsComponentIssue(id, `トーストの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
