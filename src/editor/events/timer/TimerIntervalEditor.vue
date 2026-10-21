<!-- src/editor/events/timer/TimerIntervalEditor.vue -->
<template>
  <!-- isBaseZero トグル -->
  <SettingItem icon="ToggleRight" :label="t('timerInterval.modeLabel')" :description="t('timerInterval.modeDescription')">
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
    </div>
  </SettingItem>

  <template v-if="mode === 'interval'">
    <!-- プリセット選択 -->
    <SettingItem icon="Timer" :label="t('timerInterval.intervalLabel')" :description="t('timerInterval.intervalDescription')">
      <select v-model="intervalSeconds" class="select select-bordered w-full">
        <option v-for="preset in intervalPresets" :key="preset.value" :value="preset.value">
          {{ preset.label }}
        </option>
      </select>
    </SettingItem>

    <!-- isBaseZero トグル -->
    <SettingItem icon="Clock" :label="t('timerInterval.baseZeroLabel')" :description="t('timerInterval.baseZeroDescription')">
      <label class="label cursor-pointer justify-start gap-4">
        <input type="checkbox" class="toggle toggle-primary" v-model="isBaseZero" />
        <span class="label-text">{{ isBaseZero ? t('timerInterval.baseZeroOn') : t('timerInterval.baseZeroOff') }}</span>
      </label>
    </SettingItem>
  </template>
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
    }
  }>()

  const emit = defineEmits(['update:modelValue'])

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
</script>
