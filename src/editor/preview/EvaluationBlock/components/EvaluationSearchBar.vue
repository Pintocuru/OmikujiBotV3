<!-- components/EvaluationSearchBar.vue -->
<template>
  <div class="join w-full">
    <input
      v-model="query"
      type="search"
      :placeholder="t('editorPreview.evaluationBlock.search')"
      class="input input-bordered input-xs join-item flex-1"
    />
    <button
      class="btn btn-xs join-item tooltip tooltip-top"
      :class="paused ? 'btn-warning' : ' btn-outline'"
      :data-tip="t('editorPreview.evaluationBlock.pauseTip')"
      @click="paused = !paused"
    >
      {{ paused ? t('editorPreview.evaluationBlock.resume') : t('editorPreview.evaluationBlock.stop') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const query = defineModel<string>('query', { required: true })
  const paused = defineModel<boolean>('paused', { required: true })
  const { t } = useI18n()
</script>
