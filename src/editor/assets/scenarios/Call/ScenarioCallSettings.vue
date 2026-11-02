<!-- src/editor/assets/scenarios/scenarioCall/ScenarioCallSettings.vue -->
<template>
  <SettingItem layout="vertical" icon="ListChecks" label="シナリオ選択">
    <!-- 重み付きリスト表示 -->
    <div v-if="displayValues.length > 0" class="space-y-1">
      <div v-for="(value, index) in displayValues" :key="index">
        <div class="flex flex-col sm:flex-row items-center sm:gap-2">
          <!-- 重み -->
          <div class="w-full sm:w-24">
            <label class="text-xs text-gray-500 mb-1 block">
              {{ t('scenarioStep.scenarioCall.weight', { percent: percentages[index] }) }}
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
            <div class="">
              <div class="flex items-center gap-2">
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

                <!-- 該当シナリオへ移動 -->
                <button
                  v-if="value.content && !isCircular(value.content)"
                  class="btn btn-xs btn-ghost gap-1"
                  @click="goToItem('scenarios', value.content)"
                >
                  <ExternalLink class="w-3.5 h-3.5" />
                  {{ t('omikujiItem.scenario.edit') }}
                </button>
              </div>
            </div>

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
    <NoParamsCard v-else :message="t('scenarioStep.scenarioCall.empty')" />

    <button @click="addValue(handleUpdate)" class="btn btn-primary w-full mt-4">
      {{ t('scenarioStep.scenarioCall.addValue') }}
    </button>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { WeightValuesArrayType } from '@/types/OmikujiData'
  import { ScenarioStepCallType } from '@/types/OmikujiData'
  import { useWeightValueManagement } from '@/editor/helpers/shared/useWeightValueManagement'
  import NoParamsCard from '@/editor/parts/NoParamsCard.vue'
  import MenuDropdown from '@/editor/parts/MenuDropdown.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import type { CategoryType } from '@/types/OmikujiData'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { ExternalLink } from 'lucide-vue-next'

  const { t } = useI18n()

  const props = defineProps<{
    step: ScenarioStepCallType
    currentKey?: string
  }>()

  const emit = defineEmits<{
    'update:step': [step: ScenarioStepCallType]
  }>()

  const navigationStore = useNavigationStore()

  const goToItem = (category: CategoryType, key: string) => {
    navigationStore.selectCategory(category)
    navigationStore.selectItem(key)
  }

  // callKeys を取得
  const getValues = () => props.step.callKeys

  // currentKey を取得
  const getCurrentKey = () => props.currentKey

  // コンポーザブルを使用
  const {
    displayValues,
    percentages,
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
