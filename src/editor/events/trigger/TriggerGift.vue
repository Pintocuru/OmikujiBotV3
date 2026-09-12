<!-- src/editor/events/trigger/TriggerGift.vue -->
<template>
  <SettingItem label="ギフト条件" description="金額や種類で発動を変更できます">
    <div class="flex flex-wrap gap-2">
      <label v-for="condition in giftConditions" :key="condition" class="cursor-pointer">
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
          {{ giftConditionMap[condition].label }}
        </span>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { GiftCondition, giftConditions } from '@/types/trigger'
  import { giftConditionMap } from '@/maps/trigger/GiftConditionMap'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const props = defineProps<{
    modelValue?: GiftCondition[]
  }>()

  const emit = defineEmits(['update:modelValue'])

  // オプションの切り替え
  const toggleOption = (value: GiftCondition) => {
    const current = props.modelValue ?? []
    const index = current.indexOf(value)
    const newValue = index > -1 ? current.filter((_, i) => i !== index) : [...current, value]

    emit('update:modelValue', newValue)
  }
</script>
