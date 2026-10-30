<!-- src/editor/assets/ScenarioStep/items/ScenarioStepItem.vue -->
<template>
  <!-- グリッドレイアウト: 左1/3がプレビュー、右2/3が設定 -->
  <div class="grid grid-cols-3 gap-4">
    <!-- 左側: プレビューエリア -->
    <div class="col-span-1 min-h-xs">
      <ScenarioStepPreview :action="action" />
    </div>

    <!-- 右側: 設定エリア -->
    <div class="col-span-2 space-y-2">
      <!-- ActionType -->
      <SettingItem layout="vertical" icon="Rocket" :label="t('scenarioStep.stepItem.typeLabel')">
        <IconRadioGroup
          v-model="kind"
          :map="scenarioStepKindMap"
          :keys="scenarioStepKinds"
          :aria-label="t('scenarioStep.stepItem.typeLabel')"
        />
      </SettingItem>

      <!-- 遅延秒数（全タイプ共通） -->
      <SettingItem
        layout="vertical"
        icon="Clock"
        :label="t('scenarioStep.stepItem.delayLabel')"
        :description="t('scenarioStep.stepItem.delayDesc')"
      >
        <input
          type="number"
          v-model.number="delaySeconds"
          :min="basicDelaySeconds * -1"
          step="0.1"
          class="input input-bordered input-sm w-32"
          placeholder="0"
        />
      </SettingItem>

      <!-- 動的コンポーネント表示 -->
      <component
        v-if="currentComponent"
        :is="currentComponent"
        v-bind="componentProps"
        @update:action="handleActionUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { scenarioStepKinds, type ScenarioStepType } from '@/types/OmikujiData'
  import { scenarioStepKindMap } from '@/maps/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import IconRadioGroup from '@/editor/parts/IconRadioGroup.vue'
  import ScenarioStepPreview from '../preview/ScenarioStepPreview.vue'
  import { useScenarioStepItem } from './useScenarioStepItem'

  const { t } = useI18n()

  const props = defineProps<{
    action: ScenarioStepType
    currentKey?: string // 編集中のシナリオのキー(scenarioCall の循環参照チェック用)
  }>()

  const emit = defineEmits<{
    'update:action': [value: ScenarioStepType]
  }>()

  const { basicDelaySeconds, currentComponent, componentProps, delaySeconds, kind, handleActionUpdate } =
    useScenarioStepItem(props, emit)
</script>
