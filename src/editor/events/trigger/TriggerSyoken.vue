<!-- src/editor/events/trigger/TriggerSyoken.vue -->
<template>
  <SettingItem label="初見判定ちゃん" description="初見ユーザー、または配信枠の1コメを判定">
    <div class="flex flex-wrap gap-2">
      <span
        v-for="option in syokenOptions"
        :key="option.value"
        class="badge badge-sm cursor-pointer select-none"
        :class="modelValue.includes(option.value) ? 'badge-secondary' : 'badge-ghost'"
        @click="toggleOption(option.value)"
      >
        {{ option.label }}
      </span>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { SyokenCondition, syokenConditionMap } from '../../types'

  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const props = defineProps<{
    modelValue: SyokenCondition[]
  }>()

  const emit = defineEmits(['update:modelValue'])

  // 選択肢の生成
  const syokenOptions = Object.entries(syokenConditionMap).map(([value, { label }]) => ({
    value: value as SyokenCondition,
    label,
  }))

  // オプションの切り替え
  const toggleOption = (value: SyokenCondition) => {
    const index = props.modelValue.indexOf(value)
    const newValue = index > -1 ? props.modelValue.filter((_, i) => i !== index) : [...props.modelValue, value]

    emit('update:modelValue', newValue)
  }
</script>
