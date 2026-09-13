<!-- src/editor/events/trigger/TriggerGift.vue -->
<template>
  <SettingItem :label="t('triggerGift.label')" :description="t('triggerGift.description')">
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
          {{ t(`triggerGift.conditions.${condition}.label`) }}
        </span>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { GiftCondition, giftConditions } from '@/types/trigger'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const { t } = useI18n()

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
