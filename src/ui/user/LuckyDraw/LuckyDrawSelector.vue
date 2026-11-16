<!-- src/ui/user/LuckyDraw/LuckyDrawSelector.vue -->
<template>
  <!-- クリックで抽選する -->
  <div class="relative inline-block min-w-80 cursor-pointer select-none" :class="useFontFamily(props.fontFamily)">
    <HistoryButton
      v-if="settings.showHistory"
      :historyItems="history"
      :color="settings.color"
      @clear="emit('clearHistory')"
    />

    <MotionWrapper
      :visible="editorPreview || state.isVisible"
      :motion="settings.animation"
      :leave-motion="settings.animation"
      @click="emit('draw')"
    >
      <component
        :is="currentComponent"
        v-if="currentComponent"
        :users="state.winners"
        :label="settings.label"
        :color="settings.color"
        :drawKey="state.drawKey"
        :waiting="!state.hasDrawn"
      />
    </MotionWrapper>
    <div v-if="editorPreview && loadError" class="alert alert-error" role="alert">
      {{ $t(loadError.key, { id: loadError.id }) }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { shallowRef, watch, type Component } from 'vue'
  import type { LuckyDrawType } from '@/types/ui'
  import type { FontFamilyType } from '@/types/OmikujiData'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import MotionWrapper from '@/ui/common/MotionVariants/MotionWrapper.vue'
  import HistoryButton from './parts/HistoryButton.vue'
  import { getLuckyDrawComponent } from './LuckyDrawRegistry'
  import { notifyLuckyDrawComponentIssue } from './notifyLuckyDrawComponentIssue'
  import type { LuckyDrawHistoryItem, LuckyDrawState } from './types'

  const props = withDefaults(
    defineProps<{
      settings: LuckyDrawType
      state: LuckyDrawState
      history: LuckyDrawHistoryItem[]
      editorPreview?: boolean // エディターのプレビュー(常に表示し、読み込みエラーも出す)
      fontFamily?: FontFamilyType
    }>(),
    { editorPreview: false }
  )

  const emit = defineEmits<{ draw: []; clearHistory: [] }>()

  // 未登録・読み込み失敗のときは null のまま(配信画面は無表示。わんコメへ一度だけ通知する)
  const currentComponent = shallowRef<Component | null>(null)
  const loadError = shallowRef<{ key: string; id: string } | null>(null)

  watch(
    () => props.settings.component,
    async (id) => {
      currentComponent.value = null
      loadError.value = null

      const definition = getLuckyDrawComponent(id)
      if (!definition) {
        loadError.value = { key: 'uiSettings.common.loadError.unregistered', id }
        if (!props.editorPreview) {
          notifyLuckyDrawComponentIssue(id, `抽選の表示タイプ「${id}」は、このバージョンには含まれていません`)
        }
        return
      }

      try {
        const module = await definition.loader()
        if (props.settings.component === id) currentComponent.value = module.default
      } catch (error) {
        if (props.settings.component !== id) return
        console.error(`[LuckyDraw] Component load failed: ${id}`, error)
        loadError.value = { key: 'uiSettings.common.loadError.loadFailed', id }
        if (!props.editorPreview) {
          notifyLuckyDrawComponentIssue(id, `抽選の表示タイプ「${id}」の読み込みに失敗しました`)
        }
      }
    },
    { immediate: true }
  )
</script>
