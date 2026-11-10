<!-- src/ui/CookieCounter/CookieCounterSelector.vue -->
<template>
  <div class="w-full bg-base-100 transparent-bg">
    <component
      :is="currentComponent"
      v-if="currentComponent"
      :counters="counters"
      :counter-defs="settings.counters"
      :variable-labels="variableLabels"
      :color="settings.color"
      :images="settings.images"
    />
    <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
      {{ $t(loadError.key, { id: loadError.id }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import type { CookieCounterType } from '@/types/ui'
  import { getCookieCounterComponent } from './CookieCounterRegistry'
  import { notifyCookieCounterComponentIssue } from './notifyCookieCounterComponentIssue'

  const props = withDefaults(
    defineProps<{
      settings: CookieCounterType
      counters: Record<string, number>
      variableLabels: Record<string, string>
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

      const definition = getCookieCounterComponent(id)
      if (!definition) {
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) {
          notifyCookieCounterComponentIssue(
            id,
            `クッキーカウンターの表示タイプ「${id}」は、このバージョンには含まれていません`
          )
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[CookieCounter] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyCookieCounterComponentIssue(id, `クッキーカウンターの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
