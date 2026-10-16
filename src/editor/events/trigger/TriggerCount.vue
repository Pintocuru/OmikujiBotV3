<!-- src/editor/events/trigger/TriggerCount.vue -->
<template>
  <SettingItem label="おみくじ履歴・チャット数" description="このおみくじ履歴や、チャット数で判定">
    <!-- 対象の値 -->
    <div class="flex flex-wrap gap-2 pb-2">
      <span
        v-for="(meta, value) in countUnitConditionMap"
        :key="value"
        class="badge badge-sm cursor-pointer select-none"
        :class="modelValue?.unit === value ? 'badge-secondary' : 'badge-ghost'"
        @click="updateField('unit', value)"
      >
        {{ meta.label }}
      </span>
    </div>

    <div class="flex flex-wrap gap-2">
      <!-- 比較方法 -->
      <select
        :value="modelValue?.comparison"
        @change="updateField('comparison', ($event.target as HTMLSelectElement).value)"
        class="select select-bordered select-sm flex-1"
      >
        <option v-for="(meta, value) in countComparisonConditionMap" :key="value" :value="value">
          {{ meta.label }}
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
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'
  import { countComparisonConditionMap, countUnitConditionMap } from '@/maps/engine/trigger/CountConditionMap'
  import { CountConditionTriggerType } from '@/types/engine/trigger'

  const props = defineProps<{
    modelValue?: CountConditionTriggerType
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: CountConditionTriggerType): void
  }>()

  const updateField = (field: keyof CountConditionTriggerType, value: string) => {
    emit('update:modelValue', {
      ...props.modelValue,
      [field]: field === 'value' ? Number(value) : value,
    } as CountConditionTriggerType)
  }
</script>
