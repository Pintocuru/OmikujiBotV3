<!-- src/editor/preview/EvaluationBlock/EvaluationBlock.vue -->
<template>
  <div class="card bg-base-200 border border-base-300 w-full">
    <div class="card-body gap-2 p-2">
      <EvaluationHeader v-model:collapsed="collapsed" :count="entries.length" :paused="paused" />

      <template v-if="!collapsed">
        <EvaluationSearchBar v-model:query="query" v-model:paused="paused" />
        <EvaluationSummary v-if="summary" :query="query" :summary="summary" />
        <EvaluationTable
          :rows="filteredEntries"
          :total="entries.length"
          :flash-keys="flashKeys"
          @edit="form.edit"
          @remove="remove"
        />
        <EvaluationForm
          v-model:key-text="form.key.value"
          v-model:value-text="form.value.value"
          :error="form.error.value"
          @submit="form.submit"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useFlashKeys } from './composables/useFlashKeys'
  import { useVariablePolling } from './composables/useVariablePolling'
  import { useVariableSearch } from './composables/useVariableSearch'
  import { useVariableForm } from './composables/useVariableForm'
  import EvaluationHeader from './components/EvaluationHeader.vue'
  import EvaluationSearchBar from './components/EvaluationSearchBar.vue'
  import EvaluationSummary from './components/EvaluationSummary.vue'
  import EvaluationTable from './components/EvaluationTable.vue'
  import EvaluationForm from './components/EvaluationForm.vue'

  const collapsed = ref(false)

  const { flashKeys, flash } = useFlashKeys()
  const { entries, paused, set, remove } = useVariablePolling(flash)
  const { query, filteredEntries, summary } = useVariableSearch(entries)
  const form = useVariableForm(set)
</script>
