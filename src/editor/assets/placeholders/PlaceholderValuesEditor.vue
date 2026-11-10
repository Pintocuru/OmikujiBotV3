<!-- src/editor/assets/placeholders/PlaceholderValuesEditor.vue -->
<template>
  <template v-if="modelValue">
    <div class="flex justify-end gap-2">
      <!-- 抽選テストボタン -->
      <PlaceholderPreview v-if="modelValue.values.length > 0" :values="modelValue.values" />

      <!-- テキストモード -->
      <PlaceholderTextMode :initialValues="modelValue.values" @save="handleValuesUpdate" />
    </div>

    <!-- 入力モード -->
    <PlaceholderInputMode :values="modelValue.values" @update="handleValuesUpdate" />
  </template>
</template>

<script setup lang="ts">
  import { type PlaceholderType, type WeightValuesArrayType } from '@/types/OmikujiData'
  import PlaceholderInputMode from './PlaceholderInputMode.vue'
  import PlaceholderTextMode from './PlaceholderTextMode.vue'
  import PlaceholderPreview from './PlaceholderPreview.vue'

  const props = defineProps<{
    modelValue: PlaceholderType | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: PlaceholderType]
  }>()

  // 値配列を差し替えて親へ v-model 更新を通知するだけ（ストアには触れない）
  const emitUpdatedValues = (values: WeightValuesArrayType) => {
    if (!props.modelValue) return
    emit('update:modelValue', { ...props.modelValue, values })
  }

  const handleValuesUpdate = (values: WeightValuesArrayType) => {
    emitUpdatedValues(values)
  }
</script>
