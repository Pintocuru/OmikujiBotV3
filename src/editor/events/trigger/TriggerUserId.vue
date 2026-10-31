<!-- src/editor/events/trigger/TriggerUserId.vue -->
<template>
  <SettingItem icon="Fingerprint" labelKey="triggerUserId.label" descriptionKey="triggerUserId.description">
    <textarea
      v-model="textValue"
      @input="updateModelValue"
      :placeholder="t('triggerUserId.placeholder')"
      class="textarea textarea-bordered w-full min-h-30"
      rows="6"
    />
    <div class="text-sm text-gray-500 mt-2">
      <p>{{ t('triggerUserId.normalHint') }}</p>
      <p>{{ t('triggerUserId.negativeHint') }}</p>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { ref, watch } from 'vue'

  import SettingItem from '@/editor/parts/SettingItem.vue'

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
