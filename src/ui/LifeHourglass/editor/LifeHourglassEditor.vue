<!-- src/ui/LifeHourglass/editor/LifeHourglassEditor.vue -->
<template>
  <!-- プレビュー -->
  <HudPreview :isAdminOnly="true">
    <LifeHourglassSelector
      :settings="lifeHourglass"
      :grains="preview.grains"
      :giftPulse="preview.giftPulse"
      :viewer="preview.viewer"
      :giftTotal="preview.giftTotal"
      :streamSeconds="preview.streamSeconds"
      :fontFamily="fontFamily"
      editorPreview
    />
    <template #hud>
      <!-- プレビューの操作(数値を増やして演出を確認する) -->
      <LifeHourglassPreviewControls @update="(value) => (preview = value)" />
    </template>
  </HudPreview>

  <!-- 表示コンポーネントの選択 -->
  <DisplayStyleSelector
    :modelValue="lifeHourglass.component"
    :options="componentOptions"
    @update:modelValue="(val) => update('component', val)"
  />

  <!-- カラー設定 -->
  <SettingItem labelKey="uiSettings.common.color.label" descriptionKey="uiSettings.common.color.description">
    <ColorPicker :modelValue="lifeHourglass.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <!-- 前回までの砂粒の引き継ぎ -->
  <SettingItem
    v-if="isPersistent"
    label="前回までの砂粒を引き継ぐ"
    :description="carryOverDescription"
    :showWarning="!isPersistent"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="lifeHourglass.carryOver"
      :disabled="!isPersistent"
      @change="(e) => update('carryOver', (e.target as HTMLInputElement).checked)"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { useLifeHourglassStore } from '@/ui/LifeHourglass/composables/useLifeHourglassStore'
  import { LifeHourglassSchema, type LifeHourglassType } from '@/types/ui'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import LifeHourglassSelector from '@/ui/LifeHourglass/LifeHourglassSelector.vue'
  import LifeHourglassPreviewControls from './LifeHourglassPreviewControls.vue'
  import { createLifeHourglassPreviewState, type LifeHourglassPreviewState } from './useLifeHourglassPreview'
  import { getLifeHourglassComponent, getLifeHourglassComponentSets } from '../LifeHourglassRegistry'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const fontFamily = computed(() => data.value.ui.fontFamily)

  const lifeHourglass = computed(() => LifeHourglassSchema.parse(data.value.ui.settings.lifeHourglass ?? {}))

  // プレビュー用の仮の数値(PreviewControls が更新する)
  const preview = ref<LifeHourglassPreviewState>(createLifeHourglassPreviewState())

  // 保存先が仮実装(メモリのみ)の間は、引き継ぎのトグルを無効にする
  const { isPersistent } = storeToRefs(useLifeHourglassStore())
  const carryOverDescription = computed(() =>
    isPersistent.value
      ? 'ON: 前回までの通算を表示します / OFF: 今回の配信ぶんだけを表示します'
      : 'サーバーがないため、現在は使用できません(起動しごとに 0 に戻ります)'
  )

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = lifeHourglass.value.component
    if (!getLifeHourglassComponent(currentId)) options[currentId] = { label: `未登録: ${currentId}` }
    for (const set of Object.values(getLifeHourglassComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: definition.label }
    }
    return options
  })

  // 更新関数
  const update = <K extends keyof LifeHourglassType>(field: K, value: LifeHourglassType[K]) => {
    updateItemSettings('lifeHourglass', { [field]: value })
  }
</script>
