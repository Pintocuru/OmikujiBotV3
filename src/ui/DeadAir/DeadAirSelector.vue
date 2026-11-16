<!-- src/ui/DeadAir/DeadAirSelector.vue -->
<template>
  <!-- 本番は全画面、エディタのプレビューは 16:9 の枠に収める -->
  <div
    class="overflow-hidden"
    :class="[editorPreview ? 'relative aspect-video w-full' : 'fixed inset-0', useFontFamily(fontFamily)]"
  >
    <component
      :is="currentComponent"
      v-if="currentComponent"
      :obstacle="settings.obstacle"
      :phase="phase"
      :formatted-time="formattedTime"
      :is-warning="isWarning"
      :is-critical="isCritical"
      :current-lives="currentLives"
      :bonus-enabled="settings.bonusEnabled"
      :bonus-fraction="bonusFraction"
      :life-fraction="lifeFraction"
      :optional-value="optionalValue"
      :optional-label="settings.optionalCounterKey ?? ''"
      :editor-preview="editorPreview"
    />
    <div v-else-if="editorPreview && loadError" class="alert alert-error" role="alert">
      {{ $t(loadError.key, { id: loadError.id }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import type { DeadAirType } from '@/types/ui'
  import type { FontFamilyType } from '@/types/OmikujiData'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import type { DeadAirPhase } from './composables/useDeadAirLogic'
  import { getDeadAirComponent } from './DeadAirRegistry'
  import { notifyDeadAirComponentIssue } from './notifyDeadAirComponentIssue'

  const props = withDefaults(
    defineProps<{
      settings: DeadAirType
      phase: DeadAirPhase
      formattedTime: string
      isWarning: boolean
      isCritical: boolean
      currentLives: number
      bonusFraction: number
      lifeFraction: number
      optionalValue: number | null
      editorPreview?: boolean
      fontFamily?: FontFamilyType
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

      const definition = getDeadAirComponent(id)
      if (!definition) {
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) {
          notifyDeadAirComponentIssue(id, `表示タイプ「${id}」は、このバージョンには含まれていません`)
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[DeadAir] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyDeadAirComponentIssue(id, `表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
