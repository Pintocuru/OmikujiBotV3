<!-- src/editor/content/connections/PlaceholderLane.vue -->
<!-- プレースホルダー: 使っているシナリオ・上位のプレースホルダー(親) → 現在(自分) → 中で使っているプレースホルダー(子) -->
<template>
  <LaneLayout :upstreamLabel="t('connections.placeholderUsers')" :downstreamLabel="t('connections.childPlaceholders')">
    <template #upstream>
      <LinkGroup :items="upstreamItems" :emptyText="t('connections.noPlaceholderUsers')" />
    </template>
    <template #downstream>
      <LinkGroup :items="childItems" :emptyText="t('connections.noChildPlaceholders')" />
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
  const { scenariosOfPlaceholder, parentPlaceholders, childPlaceholders } = useReferenceGraph()

  // 使っている側: 上位のプレースホルダー → シナリオの順
  const upstreamItems = useLaneItems((key) => [...parentPlaceholders(key), ...scenariosOfPlaceholder(key)])
  const childItems = useLaneItems(childPlaceholders)
</script>
