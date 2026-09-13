<!-- src/editor/events/trigger/TriggerUsername.vue -->
<template>
  <SettingItem :label="t('triggerUsername.label')" :description="t('triggerUsername.description')">
    <textarea
      v-model="textValue"
      @input="updateModelValue"
      :placeholder="t('triggerUsername.placeholder')"
      class="textarea textarea-bordered w-full min-h-30"
      rows="6"
    />
    <div class="text-sm text-gray-500 mt-2">
      <p>{{ t('triggerUsername.hints.regex') }}</p>
      <p>{{ t('triggerUsername.hints.normal') }}</p>
      <p>{{ t('triggerUsername.hints.negative') }}</p>
    </div>
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
