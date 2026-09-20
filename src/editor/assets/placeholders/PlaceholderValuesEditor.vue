<!-- src/editor/assets/placeholders/PlaceholderValuesEditor.vue -->
<template>
  <template v-if="modelValue">
    <div class="flex justify-end gap-2">
      <!-- 抽選テストボタン -->
      <PlaceholderPreview v-if="modelValue.values.length > 0" :values="modelValue.values" />

      <!-- 編集モード切り替えボタン -->
      <button
        @click="toggleMode"
        class="btn bg-primary text-primary-content"
        :class="{ 'btn-active': isTextMode }"
        :title="t('placeholder.toggleModeTitle')"
      >
        {{ isTextMode ? t('placeholder.inputMode') : t('placeholder.textMode') }}
      </button>
    </div>

    <!-- 入力モード -->
    <PlaceholderInputMode v-if="!isTextMode" :values="modelValue.values" @update="handleValuesUpdate" />

    <!-- テキストモード -->
    <PlaceholderTextMode
      v-else
      :initialValues="modelValue.values"
      @save="handleTextSave"
      @cancel="isTextMode = false"
    />
  </template>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { PlaceholderType, WeightValuesArrayType } from '@/types/OmikujiData'
  import PlaceholderInputMode from './PlaceholderInputMode.vue'
  import PlaceholderTextMode from './PlaceholderTextMode.vue'
  import PlaceholderPreview from './PlaceholderPreview.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue: PlaceholderType | null
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: PlaceholderType]
  }>()

  const isTextMode = ref(false)

  const toggleMode = () => {
    isTextMode.value = !isTextMode.value
  }

  // 値配列を差し替えて親へ v-model 更新を通知するだけ（ストアには触れない）
  const emitUpdatedValues = (values: WeightValuesArrayType) => {
    if (!props.modelValue) return
    emit('update:modelValue', { ...props.modelValue, values })
  }

  const handleValuesUpdate = (values: WeightValuesArrayType) => {
    emitUpdatedValues(values)
  }

  const handleTextSave = (values: WeightValuesArrayType) => {
    emitUpdatedValues(values)
    isTextMode.value = false
  }
</script>
