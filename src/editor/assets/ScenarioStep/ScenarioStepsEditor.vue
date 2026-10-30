<!-- src/editor/assets/ScenarioStep/ScenarioStepsEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- ツールバー -->
    <ScenarioStepToolbar :modelValue="modelValue" @update:modelValue="updateSteps" @reorder="followReorder" />

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
      <ScenarioStepItem :step="currentStep" :current-key="currentKey" @update:step="updateCurrentStep" />
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
  import { ScenarioStepType } from '@/types/OmikujiData/'
  import ScenarioStepTabs from './tooltab/ScenarioStepTabs.vue'
  import ScenarioStepToolbar from '@/editor/assets/ScenarioStep/tooltab/ScenarioStepToolbar.vue'
  import ScenarioStepItem from './items/ScenarioStepItem.vue'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import { useScenarioStepTabs } from './composables/useScenarioStepTabs'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: ScenarioStepType[]
    currentKey?: string // 編集中のシナリオのキー(scenarioCall の循環参照チェック用)
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: ScenarioStepType[]]
  }>()

  // タブロジックをコンポーザブルから取得
  const {
    activeTab,
    currentStep,
    setActiveTab,
    updateCurrentStep,
    addNewStep,
    duplicateStep,
    removeStep,
    followReorder,
  } = useScenarioStepTabs(
    computed(() => props?.modelValue),
    (_event, steps) => emit('update:modelValue', steps)
  )

  const updateSteps = (newSteps: ScenarioStepType[]) => {
    emit('update:modelValue', newSteps)
  }
</script>
