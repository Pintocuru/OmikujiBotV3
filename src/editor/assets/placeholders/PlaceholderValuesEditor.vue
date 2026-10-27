<!-- src/editor/assets/placeholders/PlaceholderValuesEditor.vue -->
<template>
  <template v-if="modelValue">
    <div class="flex justify-end gap-2">
      <!-- 抽選テストボタン -->
      <PlaceholderPreview v-if="modelValue.values.length > 0" :values="modelValue.values" />

      <!-- テキストモード(ダイアログ)を開くボタン -->
      <button @click="textDialog?.open()" class="btn bg-primary text-primary-content">
        {{ t('placeholder.textMode') }}
      </button>
    </div>

    <!-- 入力モード -->
    <PlaceholderInputMode :values="modelValue.values" @update="handleValuesUpdate" />

    <!-- テキストモード -->
    <PlaceholderTextMode ref="textDialog" :initialValues="modelValue.values" @save="handleValuesUpdate" />
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

  const textDialog = ref<InstanceType<typeof PlaceholderTextMode> | null>(null)

  // 値配列を差し替えて親へ v-model 更新を通知するだけ（ストアには触れない）
  const emitUpdatedValues = (values: WeightValuesArrayType) => {
    if (!props.modelValue) return
    emit('update:modelValue', { ...props.modelValue, values })
  }

  const handleValuesUpdate = (values: WeightValuesArrayType) => {
    emitUpdatedValues(values)
  }
</script>
