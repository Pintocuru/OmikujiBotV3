<!-- src/editor/assets/scenarios/ScenarioStepsEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- ツールバー -->
    <ScenarioStepToolbar :modelValue="modelValue" @update:modelValue="updateSteps" />

    <!-- ステップタブエディター -->
    <ScenarioStepTabs
      :modelValue="modelValue"
      :activeTab="activeTab"
      @select-tab="setActiveTab"
      @add="addNewStep"
      @duplicate="duplicateStep"
      @remove="removeStep"
    />

    <!-- タブコンテンツ -->
    <!-- ステップタブの内容 -->
    <template v-if="currentStep">
      <ScenarioStepItem
        :key="currentStep.id"
        :step="currentStep"
        :current-key="currentKey"
        @update:step="updateCurrentStep"
      />
    </template>

    <!-- ステップが空の場合 -->
    <template v-else>
      <NoParamsCard :message="t('scenarioStep.stepsEditor.empty')" />
      <button @click="addNewStep" class="btn btn-primary btn-sm">{{ t('scenarioStep.stepsEditor.addFirst') }}</button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'
  import { ScenarioStepRecordType } from '@/types/OmikujiData/'
  import ScenarioStepTabs from './tooltab/ScenarioStepTabs.vue'
  import ScenarioStepToolbar from './tooltab/ScenarioStepToolbar.vue'
  import ScenarioStepItem from './items/ScenarioStepItem.vue'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import { useScenarioStepTabs } from './composables/useScenarioStepTabs'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: ScenarioStepRecordType
    currentKey?: string // 編集中のシナリオのキー(scenarioCall の循環参照チェック用)
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: ScenarioStepRecordType]
  }>()

  // タブロジックをコンポーザブルから取得
  const { activeTab, currentStep, setActiveTab, updateCurrentStep, addNewStep, duplicateStep, removeStep } =
    useScenarioStepTabs(
      computed(() => props?.modelValue),
      (_event, steps) => emit('update:modelValue', steps)
    )

  const updateSteps = (newSteps: ScenarioStepRecordType) => {
    emit('update:modelValue', newSteps)
  }
</script>
