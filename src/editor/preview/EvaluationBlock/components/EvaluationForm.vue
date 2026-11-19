<!-- components/EvaluationForm.vue -->
<template>
  <div class="space-y-1">
    <div class="join w-full">
      <input
        v-model="keyText"
        type="text"
        :placeholder="t('editorPreview.evaluationBlock.keyPlaceholder')"
        class="input input-bordered input-xs join-item flex-1 font-mono"
        @keydown.enter="emit('submit')"
      />
      <input
        v-model="valueText"
        type="text"
        :placeholder="t('editorPreview.evaluationBlock.valuePlaceholder')"
        class="input input-bordered input-xs join-item w-28"
        @keydown.enter="emit('submit')"
      />
      <button class="btn btn-xs btn-primary join-item" @click="emit('submit')">
        {{ t('editorPreview.evaluationBlock.set') }}
      </button>
    </div>
    <p v-if="error" class="text-xs text-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  defineProps<{ error: string }>()
  const emit = defineEmits<{ submit: [] }>()
  const keyText = defineModel<string>('keyText', { required: true })
  const valueText = defineModel<string>('valueText', { required: true })
  const { t } = useI18n()
</script>
