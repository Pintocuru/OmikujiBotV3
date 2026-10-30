<!-- src/editor/assets/ScenarioStep/ScenarioStepsEditor.vue -->
<template>
  <div class="space-y-2">
    <!-- ツールバー -->
    <ScenarioStepToolbar :modelValue="modelValue" @update:modelValue="updateSteps" @reorder="followReorder" />

    <!-- PostActionsタブエディター -->
    <ScenarioStepTabs
      :modelValue="modelValue"
      :activeTab="activeTab"
      @select-tab="setActiveTab"
      @add="addNewAction"
      @duplicate="duplicateAction"
      @remove="removeAction"
    />

    <!-- タブコンテンツ -->
    <!-- PostActionタブの内容 -->
    <template v-if="currentAction">
      <ScenarioStepItem :action="currentAction" :current-key="currentKey" @update:action="updateCurrentAction" />
    </template>

    <!-- ステップが空の場合 -->
    <template v-else>
      <NoParamsCard :message="t('scenarioStep.stepsEditor.empty')" />
      <button @click="addNewAction" class="btn btn-primary btn-sm">{{ t('scenarioStep.stepsEditor.addFirst') }}</button>
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
    currentAction,
    setActiveTab,
    updateCurrentAction,
    addNewAction,
    duplicateAction,
    removeAction,
    followReorder,
  } = useScenarioStepTabs(
    computed(() => props?.modelValue),
    (_event, actions) => emit('update:modelValue', actions)
  )

  const updateSteps = (newActions: ScenarioStepType[]) => {
    emit('update:modelValue', newActions)
  }
</script>
