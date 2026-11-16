<!-- src/ui/SnipeTimer/editor/SnipeTimerEditor.vue -->
<template>
  <!-- プレビュー(クリックで実際に操作できる) -->
  <HudPreview :isAdminOnly="true">
    <SnipeTimerSelector
      :settings="snipeTimer"
      :state="state"
      :digits="digits"
      :fontFamily="fontFamily"
      editorPreview
      @toggle="toggle"
      @reset="reset"
    />
    <template #hudLeft>
      <div class="text-xs text-white bg-black/50 px-1 rounded">{{ t('uiSettings.snipeTimer.previewHint') }}</div>
    </template>
  </HudPreview>

  <!-- 表示コンポーネントの選択 -->
  <DisplayStyleSelector
    :modelValue="snipeTimer.component"
    :options="componentOptions"
    @update:modelValue="(val) => update('component', val)"
  />

  <!-- カラー設定 -->
  <SettingItem labelKey="uiSettings.common.color.label" descriptionKey="uiSettings.common.color.description">
    <ColorPicker :modelValue="snipeTimer.color" @update:modelValue="(val) => update('color', val)" />
  </SettingItem>

  <!-- アニメーション -->
  <SettingItem
    labelKey="uiSettings.snipeTimer.animation.label"
    descriptionKey="uiSettings.snipeTimer.animation.description"
  >
    <select
      class="select select-bordered select-sm w-full max-w-xs"
      :value="snipeTimer.animation"
      @change="(e) => update('animation', (e.target as HTMLSelectElement).value as SnipeTimerType['animation'])"
    >
      <option v-for="key in enterMotions" :key="key" :value="key">{{ t(`mapText.enterMotion.${key}.label`) }}</option>
    </select>
  </SettingItem>

  <!-- 開始の秒数 -->
  <SettingItem
    labelKey="uiSettings.snipeTimer.initialSeconds.label"
    descriptionKey="uiSettings.snipeTimer.initialSeconds.description"
  >
    <div class="flex items-center gap-2">
      <input
        type="number"
        class="input input-bordered input-sm w-24"
        :min="SNIPE_TIMER_INITIAL_SECONDS.min"
        :max="SNIPE_TIMER_INITIAL_SECONDS.max"
        :value="snipeTimer.initialSeconds"
        @change="(e) => update('initialSeconds', Number((e.target as HTMLInputElement).value))"
      />
      <span class="text-sm opacity-70">{{ t('uiSettings.snipeTimer.initialSeconds.unit') }}</span>
    </div>
  </SettingItem>

  <!-- 秒数を丸める単位 -->
  <SettingItem
    labelKey="uiSettings.snipeTimer.secondAdjust.label"
    descriptionKey="uiSettings.snipeTimer.secondAdjust.description"
  >
    <div class="join">
      <input
        v-for="seconds in SNIPE_TIMER_SECOND_ADJUSTS"
        :key="seconds"
        type="radio"
        name="snipeTimerSecondAdjust"
        class="btn join-item btn-sm"
        :aria-label="t('uiSettings.snipeTimer.secondAdjust.option', { seconds })"
        :checked="snipeTimer.secondAdjust === seconds"
        @change="update('secondAdjust', seconds)"
      />
    </div>
  </SettingItem>

  <!-- 常時表示 -->
  <SettingItem
    labelKey="uiSettings.snipeTimer.alwaysVisible.label"
    descriptionKey="uiSettings.snipeTimer.alwaysVisible.description"
  >
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="snipeTimer.alwaysVisible"
      @change="(e) => update('alwaysVisible', (e.target as HTMLInputElement).checked)"
    />
  </SettingItem>

  <!-- 終了後の表示秒数 -->
  <SettingItem
    v-if="!snipeTimer.alwaysVisible"
    labelKey="uiSettings.snipeTimer.afterShowSeconds.label"
    descriptionKey="uiSettings.snipeTimer.afterShowSeconds.description"
  >
    <input
      type="number"
      class="input input-bordered input-sm w-24"
      min="0"
      max="60"
      :value="snipeTimer.afterShowSeconds"
      @change="(e) => update('afterShowSeconds', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import {
    SNIPE_TIMER_INITIAL_SECONDS,
    SNIPE_TIMER_SECOND_ADJUSTS,
    SnipeTimerSchema,
    type SnipeTimerType,
  } from '@/types/ui'
  import { enterMotions } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import ColorPicker from '@/editor/parts/ColorPicker/ColorPicker.vue'
  import DisplayStyleSelector from '@/ui/common/DisplayStyleSelector.vue'
  import SnipeTimerSelector from '../SnipeTimerSelector.vue'
  import { useSnipeTimerCore } from '../useSnipeTimerCore'
  import { getSnipeTimerComponent, getSnipeTimerComponentSets } from '../SnipeTimerRegistry'

  const { t } = useI18n()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { updateItemSettings } = omikujiStore
  const fontFamily = computed(() => data.value.ui.fontFamily)

  const snipeTimer = computed(() => SnipeTimerSchema.parse(data.value.ui.settings.snipeTimer ?? {}))

  // プレビューのタイマー(配信画面と同じ状態管理。クリックで開始・一時停止・リセットを試せる)
  const { state, digits, toggle, reset } = useSnipeTimerCore(snipeTimer)

  // 登録済みコンポーネントの選択肢(選択中の ID が未登録なら、その旨を先頭に出す)
  const componentOptions = computed(() => {
    const options: Record<string, { label: string }> = {}
    const currentId = snipeTimer.value.component
    if (!getSnipeTimerComponent(currentId))
      options[currentId] = { label: t('uiSettings.common.unregistered', { id: currentId }) }
    for (const set of Object.values(getSnipeTimerComponentSets())) {
      for (const [id, definition] of Object.entries(set)) options[id] = { label: t(definition.labelKey) }
    }
    return options
  })

  // 更新関数
  const update = <K extends keyof SnipeTimerType>(field: K, value: SnipeTimerType[K]) => {
    updateItemSettings('snipeTimer', { [field]: value })
  }
</script>
