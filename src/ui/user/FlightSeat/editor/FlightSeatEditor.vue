<!-- src/ui/user/FlightSeat/editor/FlightSeatEditor.vue -->
<template>
  <!-- プレビュー -->
  <FlightSeatPreview :flightSeat="flightSeat" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="flightSeat.component"
    :options="componentOptions"
    @update:modelValue="updateComponent"
  />

  <!-- プリセット選択 -->
  <SettingItem
    v-if="currentPresets"
    labelKey="uiSettings.flightSeat.preset.label"
    descriptionKey="uiSettings.flightSeat.preset.description"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="preset in currentPresets"
        :key="preset.labelKey"
        class="badge badge-lg cursor-pointer"
        :class="isPresetActive(preset.layout) ? 'badge-primary' : 'badge-outline'"
        @click="updateField('customLayout', JSON.stringify(preset.layout))"
      >
        {{ t(preset.labelKey) }}
      </div>
    </div>
  </SettingItem>

  <!-- カスタムレイアウト（defaultLayout が string のときのみ表示） -->
  <SettingItem
    v-if="isCustomizable"
    labelKey="uiSettings.flightSeat.customLayout.label"
    descriptionKey="uiSettings.flightSeat.customLayout.description"
    :showReset="true"
    @reset="updateField('customLayout', defaultLayout as string)"
  >
    <input
      type="text"
      class="input input-bordered w-full font-mono text-sm"
      :value="flightSeat.customLayout ?? defaultLayout"
      :class="isValidLayout ? '' : 'input-error'"
      @input="(e) => updateField('customLayout', (e.target as HTMLInputElement).value)"
    />
    <div v-if="!isValidLayout" class="text-error text-xs mt-1">
      {{ t('uiSettings.flightSeat.customLayout.invalid') }}
    </div>
  </SettingItem>

  <!-- 右下のステータス -->
  <SettingItem
    labelKey="uiSettings.flightSeat.statKey.label"
    descriptionKey="uiSettings.flightSeat.statKey.description"
  >
    <div class="flex flex-wrap gap-2">
      <div
        class="badge badge-lg cursor-pointer"
        :class="flightSeat.statKey === null ? 'badge-primary' : 'badge-outline'"
        @click="updateField('statKey', null)"
      >
        {{ t('uiSettings.flightSeat.statKey.none') }}
      </div>
      <div
        v-for="key in flightSeatStatKeys"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="flightSeat.statKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('statKey', key)"
      >
        {{ t(`uiSettings.flightSeat.statKey.${key}`) }}
      </div>
    </div>
  </SettingItem>

  <!-- カラー設定 -->
  <SettingItem labelKey="uiSettings.common.color.label" descriptionKey="uiSettings.common.color.description">
    <ColorPicker :modelValue="flightSeat.color" @update:modelValue="(val) => updateField('color', val)" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import { FlightSeatSchema, flightSeatStatKeys, type FlightSeatType } from '@/types/ui'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import { getFlightSeatComponent, getFlightSeatComponentSets } from '../FlightSeatRegistry'
  import { useFlightSeatLayout } from '../composables/useFlightSeatLayout'
  import FlightSeatPreview from './FlightSeatPreview.vue'

  const { t } = useI18n()
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const flightSeat = computed(() => FlightSeatSchema.parse(data.value.ui.settings.flightSeat ?? {}))
  const { definition, defaultLayout } = useFlightSeatLayout(flightSeat)

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = flightSeat.value.component
    if (!definition.value) options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }), invalid: true }
    for (const set of Object.values(getFlightSeatComponentSets())) {
      for (const [id, def] of Object.entries(set)) options[id] = { label: t(def.labelKey) }
    }
    return options
  })

  const currentPresets = computed(() => definition.value?.presets ?? null)

  // defaultLayout が string = カスタム可能
  const isCustomizable = computed(() => typeof defaultLayout.value === 'string')

  // customLayout のバリデーション
  const isValidLayout = computed(() => {
    const val = flightSeat.value.customLayout
    if (!val) return true
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) && parsed.every((n) => typeof n === 'number')
    } catch {
      return false
    }
  })

  const isPresetActive = (layout: number[]) => {
    const raw = flightSeat.value.customLayout
    if (!raw) return false
    try {
      const parsed = JSON.parse(raw)
      return (
        Array.isArray(parsed) &&
        parsed.length === layout.length &&
        parsed.every((n: number, i: number) => n === layout[i])
      )
    } catch {
      return false
    }
  }

  // ---- ストア更新 ----
  const updateField = (field: keyof FlightSeatType, value: unknown) => {
    omikujiStore.updateItemSettings('flightSeat', { ...flightSeat.value, [field]: value })
  }

  // component 変更時に、customLayout を新しいコンポーネントの既定値にする(number のときは持たない)
  const updateComponent = (id: string) => {
    const next = getFlightSeatComponent(id)?.defaultLayout
    omikujiStore.updateItemSettings('flightSeat', {
      ...flightSeat.value,
      component: id,
      customLayout: typeof next === 'string' ? next : undefined,
    })
  }
</script>
