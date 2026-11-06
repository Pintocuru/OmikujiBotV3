<!-- src/editor/events/trigger/TriggerUserId.vue -->
<template>
  <SettingItem icon="Fingerprint" labelKey="triggerUserId.label" descriptionKey="triggerUserId.description">
    <textarea
      v-model="textValue"
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
