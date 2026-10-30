<!-- src/editor/events/core/ScenarioChoiceEditor.vue -->
<template>
  <SettingItem
    icon="ListOrdered"
    :label="t('eventCore.scenarioChoiceEditor.stepKey.label')"
    :description="t('eventCore.scenarioChoiceEditor.stepKey.description')"
  >
    <select v-model="stepKey" class="select w-full">
      <option value="">{{ t('eventCore.scenarioChoiceEditor.stepKey.none') }}</option>
      <!-- 存在しない key を参照しているとき -->
      <option v-if="stepKey && !(stepKey in scenarioOptions)" :value="stepKey" disabled>
        {{ t('eventCore.scenarioChoiceEditor.stepKey.missing', { key: stepKey }) }}
      </option>
      <option v-for="(scenario, key) in scenarioOptions" :key="key" :value="key">
        {{ scenario.name || key }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { OmikujiItemStepsType } from '@/types/OmikujiData'
  import { useGetAssetData } from '@/editor/stores/useGetAssetData'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: OmikujiItemStepsType
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: OmikujiItemStepsType]
  }>()

  const { getAssets } = useGetAssetData()

  const scenarioOptions = computed(() => getAssets('scenarios'))

  const stepKey = computed({
    get: () => props.modelValue.stepKey,
    set: (value: string) => emit('update:modelValue', { ...props.modelValue, stepKey: value }),
  })
</script>
