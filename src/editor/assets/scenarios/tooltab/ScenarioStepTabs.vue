<!-- src/editor/assets/scenarios/tooltab/ScenarioStepTabs.vue -->
<template>
  <!-- タブヘッダー -->
  <div class="tabs tabs-box" role="tablist">
    <!-- ステップタブ（内側にメニューの button を持つため、button ではなく div role="tab" にする） -->
    <div
      v-for="(step, index) in sortedSteps"
      :key="step.id"
      class="tab"
      :class="props.activeTab === step.id ? 'tab-active bg-info text-info-content' : ''"
      role="tab"
      tabindex="0"
      :aria-selected="props.activeTab === step.id"
      @click="emit('select-tab', step.id)"
      @keydown.enter.self.prevent="emit('select-tab', step.id)"
      @keydown.space.self.prevent="emit('select-tab', step.id)"
    >
      <!-- 左側：バッジと内容 -->
      <div class="flex items-center">
        <span class="badge badge-sm badge-primary mr-2">{{ index + 1 }}</span>
        <ScenarioStepRow :step="step" />
      </div>

      <!-- 右側：メニュー -->
      <div @click.stop>
        <MenuDropdown @duplicate="emit('duplicate', step.id)" @delete="emit('remove', step.id)" />
      </div>
    </div>

    <!-- 追加ボタン -->
    <button type="button" class="tab tab-sm" @click="emit('add')">{{ t('scenarioStep.tabs.add') }}</button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ScenarioStepRecordType, sortedStepsFromRecord } from '@/types/OmikujiData/'
  import ScenarioStepRow from './ScenarioStepRow.vue'
  import MenuDropdown from '@/editor/parts/MenuDropdown.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: ScenarioStepRecordType
    activeTab: string | null
  }>()

  const emit = defineEmits<{
    'select-tab': [id: string]
    add: []
    duplicate: [id: string]
    remove: [id: string]
  }>()

  // 表示は delaySeconds 昇順(保存順に依存しない)
  const sortedSteps = computed(() => sortedStepsFromRecord(props.modelValue))
</script>
