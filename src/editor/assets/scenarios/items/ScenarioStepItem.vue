<!-- src/editor/assets/scenarios/items/ScenarioStepItem.vue -->
<template>
  <!-- グリッドレイアウト: 左1/3がプレビュー、右2/3が設定 -->
  <div class="grid grid-cols-3 gap-4">
    <!-- 左側: プレビューエリア -->
    <div class="col-span-1 min-h-xs">
      <ScenarioStepPreview :step="step" />
    </div>

    <!-- 右側: 設定エリア -->
    <div class="col-span-2 space-y-2">
      <!-- ステップタイプ -->
      <SettingItem layout="vertical" icon="Rocket" labelKey="scenarioStep.stepItem.typeLabel">
        <IconRadioGroup
          v-model="stepChoice"
          i18n-prefix="mapText.scenarioStepKind"
          :i18n-base-of="stepChoiceI18nBase"
          :icons="stepChoiceIcons"
          :keys="stepChoiceKeys"
          :aria-label="t('scenarioStep.stepItem.typeLabel')"
        />
      </SettingItem>

      <!-- 遅延秒数（全タイプ共通） -->
      <SettingItem
        icon="Clock"
        labelKey="scenarioStep.stepItem.delayLabel"
        descriptionKey="scenarioStep.stepItem.delayDesc"
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
        @update:step="handleStepUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { scenarioStepKinds, type ScenarioStepKind, type ScenarioStepWithIdType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import IconRadioGroup from '@/editor/parts/IconRadioGroup.vue'
  import ScenarioStepPreview from '../preview/ScenarioStepPreview.vue'
  import { useScenarioStepItem } from './useScenarioStepItem'
  import { settingsComponentMap } from './ScenarioStepKindMap'
  import { stepChoiceI18nBase, stepChoiceIcons, type StepChoice } from './stepChoice'
  import { getRegisteredGameScriptKeys } from '@/games/gameScriptRegistry'

  const { t } = useI18n()

  const props = defineProps<{
    step: ScenarioStepWithIdType
    currentKey?: string // 編集中のシナリオのキー(scenarioCall の循環参照チェック用)
  }>()

  const emit = defineEmits<{
    'update:step': [value: ScenarioStepWithIdType]
  }>()

  // 現在表示する設定コンポーネント
  const currentComponent = computed(() => settingsComponentMap[props.step.kind])

  const { basicDelaySeconds, componentProps, delaySeconds, stepChoice, selectableUiKinds, handleStepUpdate } =
    useScenarioStepItem(props, emit)

  // 選択肢: 表示先の UI(message はここから選ぶ) + message 以外の kind
  // scenarioStepKinds から項目が0 のものを除外する
  const otherStepKinds = scenarioStepKinds.filter(
    (kind): kind is Exclude<ScenarioStepKind, 'message'> =>
      kind !== 'message' && (kind !== 'gameScript' || getRegisteredGameScriptKeys().length > 0)
  )
  const stepChoiceKeys = computed<StepChoice[]>(() => [...selectableUiKinds.value, ...otherStepKinds])
</script>
