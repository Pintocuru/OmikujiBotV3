<!-- src/ui/LiveClock/LiveClockSelector.vue -->
<template>
  <div v-if="currentComponent" class="bg-base-100 transparent-bg overflow-hidden">
    <component
      :is="currentComponent"
      :settings="settings"
      :default-message="defaultMessage"
      :is-mounted="isMounted"
      :is-flipped="isFlipped"
      :current-msg="currentMsg"
    />
  </div>
  <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
    {{ loadError }}
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import type { LiveClockType } from '@/types/ui'
  import { getLiveClockComponent } from './LiveClockRegistry'
  import { notifyLiveClockComponentIssue } from './notifyLiveClockComponentIssue'

  const props = withDefaults(
    defineProps<{
      settings: LiveClockType
      defaultMessage: string
      isMounted: boolean
      isFlipped: boolean
      currentMsg: string
      editorPreview?: boolean
    }>(),
    { editorPreview: false }
  )

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef('')

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = ''

      const definition = getLiveClockComponent(id)
      if (!definition) {
        loadError.value = `未登録の表示タイプ: ${id}`
        if (!props.editorPreview) {
          notifyLiveClockComponentIssue(id, `ライブクロックの表示タイプ「${id}」は、このバージョンには含まれていません`)
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[LiveClock] Component load failed: ${id}`, error)
        loadError.value = `表示タイプ「${id}」の読み込みに失敗しました`
        if (!props.editorPreview) {
          notifyLiveClockComponentIssue(id, `ライブクロックの表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
