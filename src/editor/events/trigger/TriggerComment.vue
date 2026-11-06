<!-- src/editor/events/trigger/TriggerComment.vue -->
<template>
  <SettingItem icon="MessageSquare" labelKey="triggerComment.label" descriptionKey="triggerComment.description">
    <textarea
      v-model="textValue"
      :placeholder="t('triggerComment.placeholder')"
      class="textarea textarea-bordered w-full min-h-30"
      rows="6"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue?: string[]
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string[]]
  }>()

  // 配列とtextarea用文字列をcomputedで相互変換
  const textValue = computed({
    get: () => (props.modelValue ?? []).join('\n'),
    set: (value: string) => emit('update:modelValue', value.split('\n')),
  })
</script>
