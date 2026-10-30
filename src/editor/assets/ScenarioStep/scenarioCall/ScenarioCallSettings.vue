<!-- src/editor/assets/ScenarioStep/scenarioCall/ScenarioCallSettings.vue -->
<template>
  <div>
    <!-- 重み付きリスト表示 -->
    <div v-if="displayValues.length > 0" class="space-y-1 max-h-128 overflow-y-auto">
      <div v-for="(value, index) in displayValues" :key="index" class="card bg-base-100 p-2 border border-base-300">
        <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <!-- 重み -->
          <div class="w-full sm:w-32">
            <label class="text-xs text-gray-500 mb-1 block">
              {{ t('scenarioStep.scenarioCall.weight', { percent: getWeightPercentage(value.weight) }) }}
            </label>
            <input
              type="number"
              :value="value.weight"
              @input="updateWeight(index, $event, handleUpdate)"
              min="0"
              class="input input-bordered input-sm w-full"
            />
          </div>

          <!-- シナリオ選択 -->
          <div class="flex-1">
            <label class="text-xs text-gray-500 mb-1 block">{{ t('scenarioStep.scenarioCall.label') }}</label>
            <select
              :value="value.content"
              @change="updateContent(index, $event, handleUpdate)"
              class="select select-bordered select-sm w-full"
              :class="{ 'select-error': isCircular(value.content) }"
            >
              <option value="">{{ t('scenarioStep.scenarioCall.choose') }}</option>

              <option
                v-for="option in availableScenarios"
                :key="option.key"
                :value="option.key"
                :disabled="option.disabled"
              >
                {{ option.name }} {{ option.disabled ? t('scenarioStep.scenarioCall.circularShort') : '' }}
              </option>
            </select>

            <!-- 循環参照警告 -->
            <div v-if="isCircular(value.content)" class="alert alert-error py-1 mt-1 text-xs">
              {{ t('scenarioStep.scenarioCall.circular', { path: getCircularPath(value.content) }) }}
            </div>
          </div>

          <!-- 複製・削除 -->
          <div class="mt-2 sm:mt-0 sm:ml-auto">
            <MenuDropdown @duplicate="duplicateValue(index, handleUpdate)" @delete="removeValue(index, handleUpdate)" />
          </div>
        </div>
      </div>
    </div>

    <!-- 空の場合 -->
    <div v-else>
      <NoParamsCard :message="t('scenarioStep.scenarioCall.empty')" />
    </div>

    <button @click="addValue(handleUpdate)" class="btn btn-primary w-full mt-4">
      {{ t('scenarioStep.scenarioCall.addValue') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { WeightValuesArrayType } from '@/types/OmikujiData'
  import { ScenarioStepCallType } from '@/types/OmikujiData'
  import { useWeightValueManagement } from './useWeightValueManagement'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import MenuDropdown from '@/editor/parts/MenuDropdown.vue'

  const { t } = useI18n()

  const props = defineProps<{
    step: ScenarioStepCallType
    currentKey?: string
  }>()

  const emit = defineEmits<{
    'update:step': [step: ScenarioStepCallType]
  }>()

  // callKeys を取得
  const getValues = () => props.step.callKeys

  // currentKey を取得
  const getCurrentKey = () => props.currentKey

  // コンポーザブルを使用
  const {
    displayValues,
    getWeightPercentage,
    availableScenarios,
    addValue,
    removeValue,
    duplicateValue,
    updateWeight,
    updateContent,
    isCircular,
    getCircularPath,
  } = useWeightValueManagement(getValues, getCurrentKey)

  // 更新処理
  const handleUpdate = (newValues: WeightValuesArrayType) => {
    emit('update:step', { ...props.step, callKeys: newValues })
  }
</script>
