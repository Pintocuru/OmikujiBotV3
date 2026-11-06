<!-- src/editor/events/timer/TimerIntervalEditor.vue -->
<template>
  <!-- 動作モード（起動時のみ / 一定間隔 / ランダム間隔） -->
  <SettingItem icon="ToggleRight" labelKey="timerInterval.modeLabel" descriptionKey="timerInterval.modeDescription">
    <div class="flex gap-2">
      <!-- 起動時のみ実行 -->
      <div
        class="badge badge-lg cursor-pointer"
        :class="modelValue.mode === 'onStart' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('mode', 'onStart')"
      >
        {{ t('timerInterval.onStart') }}
      </div>

      <!-- 通常の間隔タイマー -->
      <div
        class="badge badge-lg cursor-pointer"
        :class="modelValue.mode === 'interval' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('mode', 'interval')"
      >
        {{ t('timerInterval.interval') }}
      </div>

      <!-- ランダム間隔 (ランジ) -->
      <div
        class="badge badge-lg cursor-pointer"
        :class="modelValue.mode === 'range' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('mode', 'range')"
      >
        {{ t('timerInterval.range') }}
      </div>
    </div>
  </SettingItem>

  <template v-if="modelValue.mode === 'interval'">
    <!-- プリセット選択 -->
    <SettingItem icon="Timer" labelKey="timerInterval.intervalLabel" descriptionKey="timerInterval.intervalDescription">
      <select
        :value="modelValue.intervalSeconds"
        @change="updateField('intervalSeconds', Number(($event.target as HTMLSelectElement).value))"
        class="select select-bordered w-full"
      >
        <option v-for="preset in intervalPresets" :key="preset.value" :value="preset.value">
          {{ preset.label }}
        </option>
      </select>
    </SettingItem>

    <!-- isBaseZero トグル -->
    <SettingItem icon="Clock" labelKey="timerInterval.baseZeroLabel" descriptionKey="timerInterval.baseZeroDescription">
      <label class="label cursor-pointer justify-start gap-4">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          :checked="modelValue.isBaseZero"
          @change="updateField('isBaseZero', ($event.target as HTMLInputElement).checked)"
        />
        <span class="label-text">
          {{ modelValue.isBaseZero ? t('timerInterval.baseZeroOn') : t('timerInterval.baseZeroOff') }}
        </span>
      </label>
    </SettingItem>
  </template>

  <!-- ランダム間隔: 最短〜最長 -->
  <SettingItem
    v-if="modelValue.mode === 'range'"
    icon="Timer"
    labelKey="timerInterval.rangeLabel"
    descriptionKey="timerInterval.rangeDescription"
  >
    <div class="flex flex-wrap items-center gap-2">
      <label class="flex items-center gap-2">
        <span class="label-text">{{ t('timerInterval.rangeMin') }}</span>
        <input
          type="number"
          class="input input-bordered w-24"
          :min="RANGE_MIN"
          :max="RANGE_MAX"
          :step="RANGE_STEP"
          :value="modelValue.rangeMinSeconds"
          @change="onRangeChange('min', $event)"
        />
      </label>
      <span>～</span>
      <label class="flex items-center gap-2">
        <span class="label-text">{{ t('timerInterval.rangeMax') }}</span>
        <input
          type="number"
          class="input input-bordered w-24"
          :min="RANGE_MIN"
          :max="RANGE_MAX"
          :step="RANGE_STEP"
          :value="modelValue.rangeMaxSeconds"
          @change="onRangeChange('max', $event)"
        />
      </label>
      <span>{{ t('timerInterval.rangeUnit') }}</span>
    </div>
  </SettingItem>

  <!-- 動作条件 (全モード共通) -->
  <SettingItem
    icon="Brackets"
    labelKey="timerInterval.conditionLabel"
    descriptionKey="timerInterval.conditionDescription"
  >
    <textarea
      :value="modelValue.expression ?? ''"
      @input="updateField('expression', ($event.target as HTMLTextAreaElement).value)"
      :placeholder="exampleExpression"
      class="textarea textarea-bordered w-full min-h-20 font-mono"
      rows="3"
    />
    <div class="text-sm text-gray-500 mt-2 space-y-1">
      <p>{{ t('timerInterval.conditionHints.variable') }}</p>
      <p>{{ t('timerInterval.conditionHints.undefined') }}</p>
      <p>{{ t('timerInterval.conditionHints.operator') }}</p>
      <p>{{ t('timerInterval.conditionHints.skip') }}</p>
      <p class="font-mono">
        {{ t('timerInterval.conditionHints.example') }}
        <code class="badge badge-ghost">{{ exampleExpression }}</code>
      </p>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { TimerEventType } from '@/types/OmikujiData'

  const { t } = useI18n()

  type TimerIntervalModel = {
    mode: TimerEventType['mode']
    intervalSeconds: number
    isBaseZero: boolean
    rangeMinSeconds: number
    rangeMaxSeconds: number
    expression: string
  }

  const props = defineProps<{
    modelValue: TimerIntervalModel
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: TimerIntervalModel]
  }>()

  const RANGE_MIN = 1
  const RANGE_MAX = 60
  const RANGE_STEP = 0.5

  const exampleExpression = 'fireworks_on == 1'

  const intervalPresets = computed(() =>
    [30, 60, 120, 180, 300, 600, 900, 1800, 3600].map((value) => ({
      label: t(`timerInterval.presets.s${value}`),
      value,
    }))
  )

  /** 汎用的なプロパティ更新ヘルパー */
  function updateField<K extends keyof TimerIntervalModel>(key: K, value: TimerIntervalModel[K]) {
    emit('update:modelValue', { ...props.modelValue, [key]: value })
  }

  function normalizeRangeValue(raw: string, fallback: number): number {
    if (raw.trim() === '') return fallback
    const n = Number(raw)
    if (!Number.isFinite(n)) return fallback
    return Math.min(RANGE_MAX, Math.max(RANGE_MIN, Math.round(n / RANGE_STEP) * RANGE_STEP))
  }

  function onRangeChange(which: 'min' | 'max', event: Event): void {
    const input = event.target as HTMLInputElement
    const current = props.modelValue
    const value = normalizeRangeValue(input.value, which === 'min' ? current.rangeMinSeconds : current.rangeMaxSeconds)

    let min = which === 'min' ? value : current.rangeMinSeconds
    let max = which === 'max' ? value : current.rangeMaxSeconds
    if (min > max) {
      if (which === 'min') max = min
      else min = max
    }

    input.value = String(value)
    emit('update:modelValue', { ...current, rangeMinSeconds: min, rangeMaxSeconds: max })
  }
</script>
