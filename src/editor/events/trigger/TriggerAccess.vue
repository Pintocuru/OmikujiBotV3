<!-- shared/components/trigger/TriggerAccess.vue -->
<template>
  <SettingItem label="ユーザーの役職" description="メンバー限定の発動条件はここです!">
    <div class="flex flex-wrap gap-2">
      <label v-for="condition in accessConditions" :key="condition" class="cursor-pointer">
        <input
          type="checkbox"
          class="hidden"
          :checked="(modelValue ?? []).includes(condition)"
          @change="toggleOption(condition)"
        />
        <span
          class="badge badge-sm select-none"
          :class="(modelValue ?? []).includes(condition) ? 'badge-secondary' : 'badge-ghost'"
        >
          {{ accessConditionMap[condition].label }}
        </span>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { accessConditions, AccessConditionTrigger } from '@/types/trigger'
  import { accessConditionMap } from '@/maps/trigger/AccessConditionMap'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const props = defineProps<{
    modelValue?: AccessConditionTrigger[]
  }>()

  const emit = defineEmits(['update:modelValue'])

  // オプションの切り替え
  const toggleOption = (value: AccessConditionTrigger) => {
    const current = props.modelValue ?? []
    const index = current.indexOf(value)
    const newValue = index > -1 ? current.filter((_, i) => i !== index) : [...current, value]

    emit('update:modelValue', newValue)
  }
</script>
