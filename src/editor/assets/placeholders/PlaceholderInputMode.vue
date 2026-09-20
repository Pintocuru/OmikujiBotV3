<!-- src/editor/assets/placeholders/PlaceholderInputMode.vue -->
<template>
  <div v-if="displayValues.length > 0" class="space-y-1 max-h-128 overflow-y-auto">
    <div v-for="(value, index) in displayValues" :key="index" class="card bg-base-100 p-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <!-- 重み (パーセンテージ表示) -->
        <div class="w-full sm:w-32">
          <label class="text-xs text-gray-500 mb-1 block">
            {{ t('placeholder.weightLabel') }} ({{ getWeightPercentage(value.weight) }}%)
          </label>
          <input
            type="number"
            :value="value.weight"
            @input="updateWeight(index, $event, handleUpdate)"
            min="0"
            class="input input-bordered input-sm w-full"
            :placeholder="t('placeholder.weightLabel')"
          />
        </div>

        <!-- 内容 -->
        <div class="flex-1">
          <label class="text-xs text-gray-500 mb-1 block">{{ t('placeholder.contentLabel') }}</label>
          <input
            type="text"
            :value="value.content"
            @input="updateContent(index, $event, handleUpdate)"
            :placeholder="t('placeholder.contentPlaceholder')"
            class="input input-bordered input-sm w-full"
          />
        </div>

        <!-- 複製・削除ボタン -->
        <div class="mt-2 sm:mt-0 sm:ml-auto">
          <MenuDropdown @duplicate="duplicateValue(index, handleUpdate)" @delete="removeValue(index, handleUpdate)" />
        </div>
      </div>
    </div>
  </div>

  <!-- データが空であるとき -->
  <div v-else>
    <NoParamsCard :message="t('placeholder.emptyValues')" />
  </div>

  <button @click="addValue(handleUpdate)" class="btn btn-primary w-full mt-4">{{ t('placeholder.addValue') }}</button>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { WeightValuesArrayType } from '@/types/OmikujiData'
  import { useWeightValueManagement } from '@/editor/assets/PostFlow/actions/useWeightValueManagement'
  import NoParamsCard from '@/editor/parts/NoParamsCard/NoParamsCard.vue'
  import MenuDropdown from '@/editor/parts/MenuDropdown/MenuDropdown.vue'

  const { t } = useI18n()

  const props = defineProps<{
    values: WeightValuesArrayType
  }>()

  const emit = defineEmits<{
    update: [values: WeightValuesArrayType]
  }>()

  const getValues = () => props.values

  const { displayValues, getWeightPercentage, addValue, removeValue, duplicateValue, updateWeight, updateContent } =
    useWeightValueManagement(getValues)

  // ストアには触れず、親（PlaceholderValuesEditor）に emit するだけ
  const handleUpdate = (newValues: WeightValuesArrayType) => {
    emit('update', newValues)
  }
</script>
