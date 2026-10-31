<!-- src/editor/content/header/ScenarioLane.vue -->
<!-- シナリオ: 参照元(みくじ箱 / 他のシナリオ) → 現在のシナリオ → 使用しているプレースホルダー -->
<template>
  <LaneLayout>
    <template #upstream>
      <LinkGroup v-if="sourceItems.length > 0" :label="t('connections.sources')" :items="sourceItems" />
      <!-- どこからも参照されていないとき -->
      <div v-else class="flex flex-wrap items-center gap-2 rounded-lg bg-neutral text-neutral-content px-3 py-2">
        <span class="text-sm">{{ t('connections.noSources') }}</span>
        <button class="btn btn-xs btn-primary" @click="connectOpen = true">
          {{ t('connections.connectOmikuji') }}
        </button>
      </div>
    </template>
    <template #downstream>
      <LinkGroup
        :label="t('connections.usedPlaceholders')"
        :items="placeholderItems"
        :emptyText="t('connections.noPlaceholders')"
      />
    </template>

    <ScenarioConnectDialog v-model:open="connectOpen" :scenarioKey="selectedItemKey ?? ''" />
  </LaneLayout>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useOmikujiConnections } from '../composables/useOmikujiConnections'
  import { useReferenceGraph } from '../composables/useReferenceGraph'
  import ScenarioConnectDialog from '@/editor/assets/scenarios/ScenarioConnectDialog.vue'
  import LaneLayout from './LaneLayout.vue'
  import LinkGroup from './LinkGroup.vue'
  import type { LinkItem } from './types'

  const { t } = useI18n()
  const { selectedItemKey } = storeToRefs(useNavigationStore())
  const { scenarioSources } = useOmikujiConnections()
  const { placeholdersOfScenario } = useReferenceGraph()

  const connectOpen = ref(false)

  const sourceItems = computed<LinkItem[]>(() => {
    if (!selectedItemKey.value) return []
    const { mikuji, scenarios } = scenarioSources(selectedItemKey.value)
    return [
      ...mikuji.map((s): LinkItem => ({ category: 'mikuji', ...s })),
      ...scenarios.map((s): LinkItem => ({ category: 'scenarios', ...s })),
    ]
  })

  const placeholderItems = computed<LinkItem[]>(() =>
    selectedItemKey.value
      ? placeholdersOfScenario(selectedItemKey.value).map((p) => ({ category: 'placeholders', ...p }))
      : []
  )
</script>
