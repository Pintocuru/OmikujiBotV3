<!-- src/editor/content/header/PlaceholderLane.vue -->
<!-- プレースホルダー: このプレースホルダーを使っているシナリオ → 現在のプレースホルダー -->
<template>
  <div class="flex flex-wrap items-end gap-x-2 gap-y-3">
    <LinkGroup
      :label="t('connections.placeholderUsers')"
      :items="scenarioItems"
      :emptyText="t('connections.noPlaceholderUsers')"
    />
    <ArrowRight class="w-4 h-4 mb-2 opacity-60 shrink-0" />
    <ItemSwitcher />
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
  const { placeholderUsers } = useOmikujiConnections()

  const scenarioItems = computed<LinkItem[]>(() =>
    selectedItemKey.value
      ? placeholderUsers(selectedItemKey.value).map((s) => ({ category: 'scenarios', ...s }))
      : []
  )
</script>
