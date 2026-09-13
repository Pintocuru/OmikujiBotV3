<!-- src/editor/events/trigger/TriggerAccess.vue -->
<template>
  <SettingItem :label="t('triggerAccess.label')" :description="t('triggerAccess.description')">
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
          {{ t(`triggerAccess.conditions.${condition}.label`) }}
        </span>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { accessConditions, AccessConditionTrigger } from '@/types/trigger'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const { t } = useI18n()

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
