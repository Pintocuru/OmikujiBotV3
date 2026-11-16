<!-- src/ui/LiveClock/editor/LiveClockEditor.vue -->
<template>
  <!-- プレビュー -->
  <LiveClockPreview :settings="liveClock" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="liveClock.component"
    :options="componentOptions"
    @update:modelValue="(val) => update('component', val)"
  />

  <!-- カラー設定 -->
  <SettingItem
    labelKey="uiSettings.common.color.label"
    descriptionKey="uiSettings.common.color.description"
    layout="vertical"
  >
    <ColorPicker :modelValue="liveClock.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <!-- 日付を表示するか -->
  <SettingItem labelKey="uiSettings.liveClock.isDate.label" descriptionKey="uiSettings.liveClock.isDate.description">
    <label class="flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        v-model="liveClock.isDate"
        @change="(e) => update('isDate', (e.target as HTMLInputElement).checked)"
      />
      <span class="ml-2">
        {{ t(liveClock.isDate ? 'uiSettings.liveClock.dateOn' : 'uiSettings.liveClock.dateOff') }}
      </span>
    </label>
  </SettingItem>

  <!-- 秒数を表示するか -->
  <SettingItem
    labelKey="uiSettings.liveClock.isSecond.label"
    descriptionKey="uiSettings.liveClock.isSecond.description"
  >
    <label class="flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="toggle toggle-primary"
        v-model="liveClock.isSecond"
        @change="(e) => update('isSecond', (e.target as HTMLInputElement).checked)"
      />
      <span class="ml-2">
        {{ t(liveClock.isSecond ? 'uiSettings.liveClock.secondOn' : 'uiSettings.liveClock.secondOff') }}
      </span>
    </label>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { LiveClockSchema } from '@/types/ui'
  import { getLiveClockComponent, getLiveClockComponentSets } from '../LiveClockRegistry'
  import LiveClockPreview from './LiveClockPreview.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const liveClock = computed(() => data.value.ui.settings.liveClock ?? LiveClockSchema.parse({}))

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = liveClock.value.component
    if (!getLiveClockComponent(currentId))
      options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }) }
    for (const set of Object.values(getLiveClockComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: t(definition.labelKey) }
    }
    return options
  })

  // Field Updates
  const update = (field: keyof typeof liveClock.value, value: any) => {
    omikujiStore.updateItemSettings('liveClock', {
      ...liveClock.value,
      [field]: value,
    })
  }

</script>
