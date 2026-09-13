<!-- src/editor/events/trigger/TriggerComment.vue -->
<template>
  <SettingItem :label="t('triggerComment.label')" :description="t('triggerComment.description')">
    <textarea
      v-model="textValue"
      @input="updateModelValue"
      :placeholder="t('triggerComment.placeholder')"
      class="textarea textarea-bordered w-full min-h-30"
      rows="6"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SettingItem from '@/editor/parts/SettingItem/SettingItem.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue?: string[]
  }>()

  const emit = defineEmits(['update:modelValue'])

  // textarea用の文字列値
  const textValue = ref('')

  // 初期値設定
  textValue.value = (props.modelValue ?? []).join('\n')

  watch(
    () => props.modelValue,
    (newValue) => {
      const newText = (newValue ?? []).join('\n')
      if (textValue.value !== newText) {
        textValue.value = newText
      }
    }
  )

  // textareaの値が変更された時にmodelValueを更新
  const updateModelValue = () => {
    const lines = textValue.value.split('\n')
    emit('update:modelValue', lines)
  }
</script>
