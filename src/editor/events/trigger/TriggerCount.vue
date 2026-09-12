<!-- src/editor/events/trigger/TriggerCount.vue -->
<template>
  <SettingItem label="おみくじ履歴・チャット数" description="このおみくじ履歴や、チャット数で判定">
    <!-- 対象の値 -->
    <div class="flex flex-wrap gap-2 pb-2">
      <span
        v-for="option in unitOptions"
        :key="option.value"
        class="badge badge-sm cursor-pointer select-none"
        :class="modelValue?.unit === option.value ? 'badge-secondary' : 'badge-ghost'"
        @click="updateField('unit', option.value)"
      >
        {{ option.label }}
      </span>
    </div>

    <div class="flex flex-wrap gap-2">
      <!-- 比較方法 -->
      <select
        :value="modelValue?.comparison"
        @change="updateField('comparison', ($event.target as HTMLSelectElement).value)"
        class="select select-bordered select-sm flex-1"
      >
        <option v-for="option in comparisonOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- 数値 -->
      <input
        type="number"
        :value="modelValue?.value"
        @input="updateField('value', ($event.target as HTMLInputElement).value)"
        min="0"
        class="input input-bordered input-sm flex-1"
        placeholder="数値"
      />
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import {
    countComparisonCondition,
    countComparisonConditionMap,
    CountConditionTriggerType,
    countUnitCondition,
    countUnitConditionMap,
  } from '@shared/types/trigger/CountConditionTrigger'

  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const props = defineProps<{
    modelValue?: CountConditionTriggerType
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: CountConditionTriggerType): void
  }>()

  const unitOptions = countUnitCondition.map((value) => ({
    value,
    label: countUnitConditionMap[value].label,
  }))

  const comparisonOptions = countComparisonCondition.map((value) => ({
    value,
    label: countComparisonConditionMap[value].label,
  }))

  const updateField = (field: keyof CountConditionTriggerType, value: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      [field]: field === 'value' ? Number(value) : value,
    } as CountConditionTriggerType)
  }
</script>
