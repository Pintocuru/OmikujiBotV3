<!-- src/ui/StreamCounter/StreamCounterSelector.vue -->
<template>
  <div class="w-full transparent-bg">
    <div v-if="allKeys.length === 0" class="flex flex-col items-center">
      <div class="badge badge-error font-bold">表示するカウンターはありません</div>
    </div>

    <!-- 並べ方はコンポーネント側で決める -->
    <component
      :is="currentComponent"
      v-else-if="currentComponent"
      :keys="allKeys"
      :counters="counters"
      :variable-labels="variableLabels"
      :colors="settings.color"
    />

    <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
      {{ $t(loadError.key, { id: loadError.id }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, toRef, watch, type Component } from 'vue'
  import type { StreamCounterType } from '@/types/ui'
  import { getStreamCounterComponent } from './StreamCounterRegistry'
  import { notifyStreamCounterComponentIssue } from './notifyStreamCounterComponentIssue'
  import { useStreamCounterDisplay } from './composables/useStreamCounterDisplay'

  const props = withDefaults(
    defineProps<{
      settings: StreamCounterType
      counters: Record<string, number>
      variableLabels: Record<string, string>
      editorPreview?: boolean
    }>(),
    { editorPreview: false }
  )

  const { allKeys } = useStreamCounterDisplay(toRef(props, 'settings'))

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef<{ key: string; id: string } | null>(null)

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = null

      const definition = getStreamCounterComponent(id)
      if (!definition) {
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) {
          notifyStreamCounterComponentIssue(
            id,
            `ライバーカウンターの表示タイプ「${id}」は、このバージョンには含まれていません`
          )
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[StreamCounter] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyStreamCounterComponentIssue(id, `ライバーカウンターの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
