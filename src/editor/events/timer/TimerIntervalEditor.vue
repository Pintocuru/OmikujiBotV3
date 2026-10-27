<!-- src/editor/events/timer/TimerIntervalEditor.vue -->
<template>
  <!-- 動作モード（起動時のみ / 一定間隔 / ランダム間隔） -->
  <SettingItem
    icon="ToggleRight"
    :label="t('timerInterval.modeLabel')"
    :description="t('timerInterval.modeDescription')"
  >
    <div class="flex gap-2">
      <!-- 起動時のみ実行 -->
      <div
        class="badge badge-lg cursor-pointer"
        :class="mode === 'onStart' ? 'badge-primary' : 'badge-outline'"
        @click="mode = 'onStart'"
      >
        {{ t('timerInterval.onStart') }}
      </div>

      <!-- 通常の間隔タイマー -->
      <div
        class="badge badge-lg cursor-pointer"
        :class="mode === 'interval' ? 'badge-primary' : 'badge-outline'"
        @click="mode = 'interval'"
      >
        {{ t('timerInterval.interval') }}
      </div>

      <!-- ランダム間隔 (ランジ) -->
      <div
        class="badge badge-lg cursor-pointer"
        :class="mode === 'range' ? 'badge-primary' : 'badge-outline'"
        @click="mode = 'range'"
      >
        {{ t('timerInterval.range') }}
      </div>
    </div>
  </SettingItem>

  <template v-if="mode === 'interval'">
    <!-- プリセット選択 -->
    <SettingItem
      icon="Timer"
      :label="t('timerInterval.intervalLabel')"
      :description="t('timerInterval.intervalDescription')"
    >
      <select v-model="intervalSeconds" class="select select-bordered w-full">
        <option v-for="preset in intervalPresets" :key="preset.value" :value="preset.value">
          {{ preset.label }}
        </option>
      </select>
    </SettingItem>

    <!-- isBaseZero トグル -->
    <SettingItem
      icon="Clock"
      :label="t('timerInterval.baseZeroLabel')"
      :description="t('timerInterval.baseZeroDescription')"
    >
      <label class="label cursor-pointer justify-start gap-4">
        <input type="checkbox" class="toggle toggle-primary" v-model="isBaseZero" />
        <span class="label-text">{{
          isBaseZero ? t('timerInterval.baseZeroOn') : t('timerInterval.baseZeroOff')
        }}</span>
      </label>
    </SettingItem>
  </template>

  <!-- ランダム間隔: 最短〜最長 -->
  <SettingItem
    v-if="mode === 'range'"
    icon="Timer"
    :label="t('timerInterval.rangeLabel')"
    :description="t('timerInterval.rangeDescription')"
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
    :label="t('timerInterval.conditionLabel')"
    :description="t('timerInterval.conditionDescription')"
  >
    <textarea
      v-model="expression"
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
  const props = defineProps<{
    modelValue: {
      mode: TimerEventType['mode']
      intervalSeconds: number
      isBaseZero: boolean
      rangeMinSeconds: number
      rangeMaxSeconds: number
      expression: string
    }
  }>()

  const emit = defineEmits(['update:modelValue'])

  // ランダム間隔の入力範囲 (TimerEventSchema の rangeMin/MaxSeconds と合わせる)
  const RANGE_MIN = 1
  const RANGE_MAX = 60
  const RANGE_STEP = 0.5

  // 判定式の例 (ここでは変数名だけを使う。<< を含む例は vue-i18n の警告になるため置かない)
  const exampleExpression = 'fireworks_on == 1'

  // プリセット定義
  const intervalPresets = computed(() =>
    [30, 60, 120, 180, 300, 600, 900, 1800, 3600].map((value) => ({
      label: t(`timerInterval.presets.s${value}`),
      value,
    }))
  )

  // 個別のプロパティをcomputedで管理

  const mode = computed({
    get: () => props.modelValue.mode,
    set: (value) => {
      emit('update:modelValue', { ...props.modelValue, mode: value })
    },
  })

  const intervalSeconds = computed({
    get: () => props.modelValue.intervalSeconds,
    set: (value) => {
      emit('update:modelValue', { ...props.modelValue, intervalSeconds: Number(value) })
    },
  })

  const isBaseZero = computed({
    get: () => props.modelValue.isBaseZero,
    set: (value) => {
      emit('update:modelValue', { ...props.modelValue, isBaseZero: value })
    },
  })

  const expression = computed({
    get: () => props.modelValue.expression ?? '',
    set: (value: string) => {
      emit('update:modelValue', { ...props.modelValue, expression: value })
    },
  })

  /**
   * 入力値を 0.5 秒刻み・範囲内に丸める。数値として読めない場合は fallback
   */
  function normalizeRangeValue(raw: string, fallback: number): number {
    if (raw.trim() === '') return fallback
    const n = Number(raw)
    if (!Number.isFinite(n)) return fallback
    return Math.min(RANGE_MAX, Math.max(RANGE_MIN, Math.round(n / RANGE_STEP) * RANGE_STEP))
  }

  /**
   * 最短/最長の変更を反映する。
   * 入力途中で丸めると打ちにくいので、確定時 (change) にだけ処理する。
   * 最短 > 最長 になる場合は、もう一方を同じ値に揃える。
   */
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

    // 丸めた結果を表示に戻す (値が変わらない場合は再描画されないため)
    input.value = String(value)
    emit('update:modelValue', { ...current, rangeMinSeconds: min, rangeMaxSeconds: max })
  }
</script>
