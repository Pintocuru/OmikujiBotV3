<!-- src/editor/events/trigger/TriggerSyoken.vue -->
<template>
  <SettingItem icon="UserPlus" label="初見判定ちゃん" description="初見ユーザー、または配信枠の1コメを判定">
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
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { syokenConditionMap } from '@/maps/engine/trigger/SyokenConditionMap'
  import { SyokenConditionType } from '@/types/engine/trigger'

  const props = defineProps<{
    modelValue: SyokenConditionType[]
  }>()

  const emit = defineEmits(['update:modelValue'])

  // 選択肢の生成
  const syokenOptions = Object.entries(syokenConditionMap).map(([value, { label }]) => ({
    value: value as SyokenConditionType,
    label,
  }))

  // オプションの切り替え
  const toggleOption = (value: SyokenConditionType) => {
    const index = props.modelValue.indexOf(value)
    const newValue = index > -1 ? props.modelValue.filter((_, i) => i !== index) : [...props.modelValue, value]

    emit('update:modelValue', newValue)
  }
</script>
