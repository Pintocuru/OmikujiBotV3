<!-- src/editor/content/connections/MikujiLane.vue -->
<!-- みくじ箱: 接続されたイベント(親) → 現在のみくじ箱(自分) → 接続されたシナリオ(子) -->
<template>
  <LaneLayout :upstreamLabel="t('connections.linkedEvents')" :downstreamLabel="t('connections.linkedScenarios')">
    <template #upstream>
      <LinkGroup :items="eventItems" :emptyText="t('connections.noEvents')" />
    </template>
    <template #downstream>
      <LinkGroup :items="scenarioItems" :emptyText="t('connections.noScenarios')" />
    </template>
  </LaneLayout>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useReferenceGraph } from '../composables/useReferenceGraph'
  import { useLaneItems } from '../composables/useLaneItems'
  import LaneLayout from './LaneLayout.vue'
  import LinkGroup from './LinkGroup.vue'

  const { t } = useI18n()
  const { eventsOfBox, scenariosOfBox } = useReferenceGraph()

  const eventItems = useLaneItems(eventsOfBox)
  const scenarioItems = useLaneItems(scenariosOfBox)
</script>
