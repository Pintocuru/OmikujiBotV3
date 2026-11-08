<!-- src/editor/events/trigger/TriggerExpression.vue -->
<template>
  <SettingItem
    icon="Brackets"
    labelKey="triggerExpression.label"
    descriptionKey="triggerExpression.description"
    :helpUrl="TRIGGER_EXPRESSION_HELP_URL"
    :helpLabel="t('triggerExpression.helpLabel')"
  >
    <input type="text" v-model="text" :placeholder="exampleLc" class="input input-bordered w-full font-mono" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SettingItem from '@/editor/parts/SettingItem.vue'
  import { TRIGGER_EXPRESSION_HELP_URL } from '@/editor/constants/docsUrl'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue?: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  // vue-i18n のメッセージに << を入れると警告が出るため、記法を含む例はここで持つ
  const exampleLc = '<<lc>> > 20'

  const text = computed({
    get: () => props.modelValue ?? '',
    set: (value: string) => emit('update:modelValue', value),
  })
</script>
