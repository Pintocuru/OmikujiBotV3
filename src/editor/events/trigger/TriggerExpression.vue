<!-- src/editor/events/trigger/TriggerExpression.vue -->
<template>
  <SettingItem icon="Brackets" :label="t('triggerExpression.label')" :description="t('triggerExpression.description')">
    <textarea
      v-model="text"
      :placeholder="exampleLc"
      class="textarea textarea-bordered w-full min-h-20 font-mono"
      rows="3"
    />
    <div class="text-sm text-gray-500 mt-2 space-y-1">
      <p>{{ t('triggerExpression.hints.variable') }}</p>
      <p>{{ t('triggerExpression.hints.userVariable') }}</p>
      <p>{{ t('triggerExpression.hints.operator') }}</p>
      <p class="font-mono">
        {{ t('triggerExpression.hints.example') }}
        <code class="badge badge-ghost">{{ exampleLc }}</code>
        <code class="badge badge-ghost">{{ exampleUser }}</code>
      </p>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SettingItem from '@/editor/parts/SettingItem.vue'

  const { t } = useI18n()

  const props = defineProps<{
    modelValue?: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  // vue-i18n のメッセージに << を入れると警告が出るため、記法を含む例はここで持つ
  const exampleLc = '<<lc>> > 20'
  const exampleUser = "<<name>> == 'ownerName'"

  const text = computed({
    get: () => props.modelValue ?? '',
    set: (value: string) => emit('update:modelValue', value),
  })
</script>
