<!-- src/ui/LiveClock/editor/LiveClockEditor.vue -->
<template>
  <!-- プレビュー -->
  <LiveClockPreview :settings="liveClock" :messageText="messageText" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="liveClock.component"
    :options="clockComponentMap"
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

  <!-- デフォルトで表示させるメッセージ -->
  <SettingItem
    labelKey="uiSettings.liveClock.defaultMessage.label"
    descriptionKey="uiSettings.liveClock.defaultMessage.description"
    :showReset="true"
    @reset="resetMap.defaultMessage"
  >
    <MessageTextDialog v-model="messageText" />
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
      <span class="ml-2"> 日付を表示{{ liveClock.isDate ? 'する' : 'しない' }} </span>
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
      <span class="ml-2"> 秒数を表示{{ liveClock.isSecond ? 'する' : 'しない' }} </span>
    </label>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { LiveClockSchema } from '@/types/ui'
  import { clockComponentMap } from '@/maps/ui'
  import LiveClockPreview from './LiveClockPreview.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MessageTextDialog from '@/editor/assets/ScenarioStep/Message/MessageTextDialog.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const liveClock = computed(() => data.value.ui.settings.liveClock ?? LiveClockSchema.parse({}))

  // Field Updates
  const update = (field: keyof typeof liveClock.value, value: any) => {
    omikujiStore.updateItemSettings('liveClock', {
      ...liveClock.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof liveClock.value) => {
    const defaults = LiveClockSchema.parse({})
    update(field, defaults[field])
  }

  const resetMap = {
    defaultMessage: () => resetField('defaultMessage'),
  }

  // Message Text
  const messageText = computed<string>({
    get: () => liveClock.value.defaultMessage ?? '',
    set: (value) => {
      update('defaultMessage', value)
    },
  })
</script>
