<!-- src/editor/assets/ScenarioStep/variable/VariableSettings.vue -->
<template>
  <SettingItem icon="Code2" layout="vertical" labelKey="scenarioStep.variable.label">
    <MessageTextDialog v-model="bubbleText" :isCommentMode="true" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ScenarioStepVariableType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import MessageTextDialog from '../Message/MessageTextDialog.vue'

  const props = defineProps<{
    step: ScenarioStepVariableType
  }>()

  const emit = defineEmits<{
    'update:step': [step: ScenarioStepVariableType]
  }>()

  // --- Helper Functions ---
  const updateStep = (updates: Partial<ScenarioStepVariableType>) => {
    emit('update:step', { ...props.step, ...updates })
  }

  const bubbleText = computed<string>({
    get: () => props.step.message ?? '',
    set: (value) => updateStep({ message: value }),
  })
</script>
