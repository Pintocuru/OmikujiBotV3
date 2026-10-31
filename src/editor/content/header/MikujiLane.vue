<!-- src/editor/content/header/MikujiLane.vue -->
<!-- みくじ箱: 接続されたイベント → 現在のみくじ箱 → 接続されたシナリオ -->
<template>
  <div class="flex flex-wrap items-end gap-x-2 gap-y-3">
    <LinkGroup :label="t('connections.linkedEvents')" :items="eventItems" :emptyText="t('connections.noEvents')" />
    <ArrowRight class="w-4 h-4 mb-2 opacity-60 shrink-0" />
    <ItemSwitcher />
    <ArrowRight class="w-4 h-4 mb-2 opacity-60 shrink-0" />
    <LinkGroup :label="t('connections.linkedScenarios')" :items="scenarioItems" :emptyText="t('connections.noScenarios')" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { ArrowRight } from 'lucide-vue-next'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import { useOmikujiConnections } from '../composables/useOmikujiConnections'
  import ItemSwitcher from './ItemSwitcher.vue'
  import LinkGroup from './LinkGroup.vue'
  import type { LinkItem } from './types'

  const { t } = useI18n()
  const { selectedItemKey } = storeToRefs(useNavigationStore())
  const { connectedEvents, connectedScenarios } = useOmikujiConnections()

  const eventItems = computed<LinkItem[]>(() =>
    selectedItemKey.value
      ? connectedEvents(selectedItemKey.value).map((e) => ({ category: e.category, key: e.id, name: e.name }))
      : []
  )
  const scenarioItems = computed<LinkItem[]>(() =>
    selectedItemKey.value
      ? connectedScenarios(selectedItemKey.value).map((s) => ({ category: 'scenarios', ...s }))
      : []
  )
</script>
