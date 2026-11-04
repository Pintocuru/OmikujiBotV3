<!-- src/ui/LifeHourglass/LifeHourglassSelector.vue -->
<template>
  <div class="relative">
    <component
      :is="currentComponent"
      v-if="currentComponent"
      :grains="grains"
      :showMessage="settings.showMessage"
      :giftPulse="giftPulse"
      :viewer="viewer"
      :giftTotal="giftTotal"
      :streamSeconds="streamSeconds"
    />
    <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
      {{ loadError }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import type { LifeHourglassType } from '@/types/ui'
  import { getLifeHourglassComponent } from './LifeHourglassRegistry'
  import { notifyLifeHourglassComponentIssue } from './notifyLifeHourglassComponentIssue'

  const props = withDefaults(
    defineProps<{
      settings: LifeHourglassType
      grains: number // 表示する砂粒
      giftPulse?: number // ギフトで砂粒が増えた回数(落ちる演出用)
      viewer?: number // 現在の同時接続数
      giftTotal?: number // ギフト合計(円)
      streamSeconds?: number // 配信時間(秒)
      editorPreview?: boolean
    }>(),
    { giftPulse: 0, viewer: 0, giftTotal: 0, streamSeconds: 0, editorPreview: false }
  )

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef('')

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = ''

      const definition = getLifeHourglassComponent(id)
      if (!definition) {
        loadError.value = `未登録の表示タイプ: ${id}`
        if (!props.editorPreview) {
          notifyLifeHourglassComponentIssue(id, `命の砂時計の表示タイプ「${id}」は、このバージョンには含まれていません`)
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[LifeHourglass] Component load failed: ${id}`, error)
        loadError.value = `表示タイプ「${id}」の読み込みに失敗しました`
        if (!props.editorPreview) {
          notifyLifeHourglassComponentIssue(id, `命の砂時計の表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
