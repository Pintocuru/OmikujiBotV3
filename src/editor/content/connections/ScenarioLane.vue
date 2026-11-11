<!-- src/editor/content/connections/ScenarioLane.vue -->
<!-- シナリオ: 参照元(みくじ箱 / 他のシナリオ。親) → 現在のシナリオ(自分) → 呼び出し先のシナリオ / 使用しているプレースホルダー(子) -->
<template>
  <LaneLayout :upstreamLabel="t('connections.sources')" :downstreamLabel="t('connections.scenarioChildren')">
    <template #upstream>
      <LinkGroup v-if="sourceItems.length > 0" :items="sourceItems" />
      <!-- どこからも参照されていないとき -->
      <div v-else class="flex flex-wrap items-center gap-2 rounded-lg bg-neutral text-neutral-content px-3 py-2">
        <span class="text-sm">{{ t('connections.noSources') }}</span>
        <button class="btn btn-sm btn-neutral" @click="connectOpen = true">
          {{ t('connections.connectOmikuji') }}
        </button>
      </div>
    </template>
    <template #downstream>
      <LinkGroup :items="calledItems" />
      <LinkGroup
        :items="placeholderItems"
        :emptyText="calledItems.length === 0 ? t('connections.noPlaceholders') : undefined"
      />
    </template>

    <ScenarioConnectDialog v-model:open="connectOpen" :scenarioKey="selectedItemKey ?? ''" />
  </LaneLayout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useReferenceGraph } from '@/editor/helpers/referenceGraph/useReferenceGraph'
  import { useLaneItems } from '../composables/useLaneItems'
  import ScenarioConnectDialog from './ScenarioConnectDialog.vue'
  import LaneLayout from './LaneLayout.vue'
  import LinkGroup from '@/editor/helpers/referenceGraph/LinkGroup.vue'

  const { t } = useI18n()
  const { selectedItemKey } = storeToRefs(useNavigationStore())
  const { sourcesOfScenario, calledScenariosOf, placeholdersOfScenario } = useReferenceGraph()

  const connectOpen = ref(false)

  const sourceItems = useLaneItems(sourcesOfScenario)
  const calledItems = useLaneItems(calledScenariosOf)
  const placeholderItems = useLaneItems(placeholdersOfScenario)
</script>
